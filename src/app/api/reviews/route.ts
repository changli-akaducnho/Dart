import { randomUUID } from "node:crypto";
import { STUDIO_EMAIL } from "@/data/studio";
import { validateReview } from "@/lib/review";
import { createStudioMailTransport, mailFailure } from "@/lib/studio-mail";

export const runtime = "nodejs";
const MAX_BYTES = 16000;
// Best-effort per-instance throttle, matching the booking endpoint.
const attempts = new Map<string, { count: number; expires: number }>();
const reply = (error: string, status: number) => Response.json({ error }, { status });

export async function POST(request: Request) {
  const url = new URL(request.url);
  url.host = request.headers.get("host") || url.host;
  const origin = request.headers.get("origin");
  if (origin && origin !== url.origin) return reply("Nguồn gửi không hợp lệ.", 403);
  if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json")
    return reply("Định dạng đánh giá không hợp lệ.", 415);
  let review;
  try {
    if (Number(request.headers.get("content-length")) > MAX_BYTES) return reply("Nội dung quá dài.", 413);
    const reader = request.body?.getReader();
    if (!reader) return reply("Vui lòng nhập đánh giá.", 400);
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BYTES) {
        await reader.cancel();
        return reply("Nội dung quá dài.", 413);
      }
      chunks.push(value);
    }
    review = validateReview(JSON.parse(Buffer.concat(chunks).toString("utf8")));
  } catch {
    return reply("Vui lòng nhập tên, email, số sao (1–5) và nhận xét từ 10 đến 2.000 ký tự.", 400);
  }
  const password = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "");
  if (!password) return reply("Chưa thể gửi đánh giá qua email. Bạn có thể liên hệ Facebook hoặc Zalo của studio.", 503);
  const now = Date.now();
  for (const [key, value] of attempts) if (value.expires <= now) attempts.delete(key);
  const key = review.email.toLowerCase();
  const recent = attempts.get(key);
  if ((recent && recent.count >= 3) || (!recent && attempts.size >= 2000))
    return reply("Bạn vui lòng đợi 15 phút rồi gửi lại đánh giá.", 429);
  attempts.set(key, { count: (recent?.count || 0) + 1, expires: recent?.expires || now + 15 * 60000 });
  const id = `REVIEW-${randomUUID()}`;
  const transport = createStudioMailTransport(password);
  try {
    const result = await transport.sendMail({
      from: { name: "DART Space Studio", address: process.env.GMAIL_USER?.trim() || STUDIO_EMAIL },
      to: STUDIO_EMAIL,
      replyTo: { name: review.name, address: review.email },
      subject: `[DART] ĐÁNH GIÁ KHÁCH HÀNG — ${id}`,
      text: ["DART | ĐÁNH GIÁ KHÁCH HÀNG", `Mã: ${id}`, `Tên: ${review.name}`, `Email: ${review.email}`, `Đánh giá: ${review.rating}/5 sao`, "", review.comment, "", "Phản hồi gửi riêng đến studio. Không tự động đăng công khai; cần xin phép khách trước khi trích đăng."].join("\n"),
    });
    if (!result.accepted.some((address) => String(address).toLowerCase() === STUDIO_EMAIL)) throw new Error("Recipient not accepted");
    return Response.json({ id });
  } catch (error) {
    return Response.json(mailFailure(error, "review", id), { status: 502 });
  } finally {
    transport.close();
  }
}
