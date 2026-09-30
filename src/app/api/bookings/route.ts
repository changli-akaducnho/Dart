import { fileTypeFromBuffer } from "file-type";
import { randomUUID } from "node:crypto";
import { artworks } from "@/data/artworks";
import { STUDIO_EMAIL } from "@/data/studio";
import { validateBooking } from "@/lib/booking";
import { bookingEmail, bookingConfirmationEmail } from "@/lib/booking-email";
import { createStudioMailTransport, mailFailure } from "@/lib/studio-mail";

export const runtime = "nodejs";
const MAX_REQUEST_BYTES = 6 * 1024 * 1024;
// Local MVP throttle. Use a shared rate-limit store when deploying multiple instances.
const attempts = new Map<string, { count: number; expires: number }>();
const reply = (error: string, status: number) =>
  Response.json({ error }, { status });

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  // Next's internal URL may use localhost while the browser uses 127.0.0.1.
  // The Host header represents the incoming public host (including its port).
  const publicUrl = new URL(request.url);
  publicUrl.host = request.headers.get("host") || publicUrl.host;
  if (origin && origin !== publicUrl.origin)
    return reply("Nguồn gửi yêu cầu không hợp lệ.", 403);
  if (!request.headers.get("content-type")?.startsWith("multipart/form-data"))
    return reply("Biểu mẫu không hợp lệ.", 415);
  let data: FormData;
  try {
    if (Number(request.headers.get("content-length")) > MAX_REQUEST_BYTES)
      return reply("Ảnh quá lớn. Vui lòng chọn ảnh tối đa 5 MB.", 413);
    const reader = request.body?.getReader();
    if (!reader) return reply("Biểu mẫu trống.", 400);
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_REQUEST_BYTES) {
        await reader.cancel();
        return reply("Ảnh quá lớn. Vui lòng chọn ảnh tối đa 5 MB.", 413);
      }
      chunks.push(value);
    }
    data = await new Response(Buffer.concat(chunks), {
      headers: { "content-type": request.headers.get("content-type")! },
    }).formData();
  } catch {
    return reply("Không đọc được biểu mẫu. Vui lòng thử lại.", 400);
  }
  let booking;
  try {
    booking = validateBooking(data);
  } catch (error) {
    return reply(
      error instanceof Error ? error.message : "Thông tin chưa hợp lệ.",
      400,
    );
  }
  const artwork =
    booking.type === "purchase"
      ? artworks.find((item) => item.id === booking.artworkId)
      : undefined;
  if (
    booking.type === "purchase" &&
    (!artwork || artwork.status !== "available" || artwork.price === null)
  )
    return reply(
      "Tác phẩm hiện không nhận yêu cầu mua. Vui lòng liên hệ studio.",
      400,
    );

  const file = data.get("reference");
  let attachment:
    | { filename: string; content: Buffer; contentType: string }
    | undefined;
  if (file instanceof File && file.size) {
    try {
      const content = Buffer.from(await file.arrayBuffer());
      const detected = await fileTypeFromBuffer(content);
      if (!detected || detected.mime !== file.type)
        throw new Error("Invalid image");
      attachment = {
        filename: `anh-tham-khao.${detected.ext}`,
        content,
        contentType: file.type,
      };
    } catch {
      return reply(
        "Không đọc được ảnh tham khảo. Vui lòng chọn ảnh JPG, PNG hoặc WebP hợp lệ.",
        400,
      );
    }
  }
  const password = process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "");
  if (!password)
    return reply(
      "Chưa thể gửi yêu cầu qua email. Vui lòng liên hệ Zalo để được studio hỗ trợ trực tiếp.",
      503,
    );
  const now = Date.now();
  for (const [key, value] of attempts)
    if (value.expires <= now) attempts.delete(key);
  const key = booking.email.toLowerCase();
  const recent = attempts.get(key);
  if (recent && recent.count >= 5)
    return reply(
      "Bạn đã gửi nhiều yêu cầu. Vui lòng chờ 15 phút hoặc liên hệ Zalo.",
      429,
    );
  if (attempts.size >= 2000 && !recent)
    return reply(
      "Studio đang nhận nhiều yêu cầu. Vui lòng thử lại sau hoặc liên hệ Zalo.",
      429,
    );
  attempts.set(key, {
    count: (recent?.count || 0) + 1,
    expires: recent?.expires || now + 15 * 60_000,
  });
  const id = `DART-${randomUUID()}`;
  const transport = createStudioMailTransport(password);
  try {
    const result = await transport.sendMail({
      from: {
        name: "DART Space Studio",
        address: process.env.GMAIL_USER?.trim() || STUDIO_EMAIL,
      },
      ...bookingEmail(booking, id, new Date(), artwork),
      attachments: attachment ? [attachment] : [],
    });
    if (
      !result.accepted.some(
        (address) => String(address).toLowerCase() === STUDIO_EMAIL,
      )
    )
      throw new Error("Recipient not accepted");
    // Studio acceptance is the booking's success boundary. A receipt failure
    // must not ask the customer to submit the same booking again.
    let confirmationEmail: "accepted" | "unconfirmed" = "unconfirmed";
    try {
      const receipt = await transport.sendMail({
        from: {
          name: "DART Space Studio",
          address: process.env.GMAIL_USER?.trim() || STUDIO_EMAIL,
        },
        ...bookingConfirmationEmail(booking, id, artwork),
      });
      if (!receipt.accepted.some((address) => String(address).toLowerCase() === booking.email.toLowerCase()))
        throw new Error("Confirmation recipient not accepted");
      confirmationEmail = "accepted";
    } catch (error) {
      mailFailure(error, "booking_confirmation", id);
    }
    return Response.json({ id, confirmationEmail });
  } catch (error) {
    return Response.json(mailFailure(error, "booking", id), { status: 502 });
  } finally {
    transport.close();
  }
}
