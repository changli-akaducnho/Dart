import nodemailer from "nodemailer";
import tls, { type TLSSocket } from "node:tls";
import { STUDIO_EMAIL } from "../data/studio";

type SocketCallback = (
  error: Error | null,
  options?: { connection: TLSSocket; secured: true },
) => void;

export function createStudioMailTransport(password: string) {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER?.trim() || STUDIO_EMAIL,
      pass: password,
    },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
    disableFileAccess: true,
    disableUrlAccess: true,
    // Let Workers resolve the hostname. Nodemailer's pre-resolved IP path
    // failed in workerd; TLS by hostname preserves DNS routing and SNI.
    getSocket: getGmailSocket,
  });
}

export function getGmailSocket(_options: unknown, callback: SocketCallback) {
      let socket: TLSSocket;
      let settled = false;
      const timer = setTimeout(() => {
        fail(Object.assign(new Error("SMTP TLS connection timed out"), {
          code: "ETIMEDOUT",
          command: "CONN",
        }));
      }, 10_000);
      function fail(error: Error) {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        socket?.destroy();
        callback(error);
      }
      try {
        socket = tls.connect({
          host: "smtp.gmail.com",
          port: 465,
          servername: "smtp.gmail.com",
          rejectUnauthorized: true,
        });
        socket.once("error", fail);
        socket.once("close", () => {
          if (!settled) fail(Object.assign(new Error("SMTP socket closed"), { code: "ECONNECTION" }));
        });
        socket.once("secureConnect", () => {
          if (settled) return;
          settled = true;
          clearTimeout(timer);
          // Nodemailer assumes ownership after the TLS handshake. Leaving the
          // one-shot error handler also absorbs any immediate teardown error.
          callback(null, { connection: socket, secured: true });
        });
      } catch (error) {
        fail(error instanceof Error ? error : new Error("SMTP connection failed"));
      }
}

export function mailFailure(error: unknown, kind: "booking" | "review" | "booking_confirmation", requestId: string) {
  const detail = error && typeof error === "object"
    ? error as { code?: unknown; command?: unknown; responseCode?: unknown }
    : {};
  const allowedCodes = ["EAUTH", "ESOCKET", "ECONNECTION", "ETIMEDOUT", "EDNS", "ETLS", "EENVELOPE", "EMESSAGE", "ECONNRESET", "ECONNREFUSED", "ENOTFOUND", "CERT_HAS_EXPIRED", "ERR_TLS_CERT_ALTNAME_INVALID"];
  const smtpCode = typeof detail.code === "string" && allowedCodes.includes(detail.code) ? detail.code : "UNKNOWN";
  const responseCode = typeof detail.responseCode === "number" && Number.isInteger(detail.responseCode) && detail.responseCode >= 100 && detail.responseCode <= 599 ? detail.responseCode : undefined;
  const commands = ["CONN", "EHLO", "HELO", "AUTH", "AUTH PLAIN", "AUTH LOGIN", "MAIL FROM", "RCPT TO", "DATA"];
  const command = typeof detail.command === "string" && commands.includes(detail.command) ? detail.command : undefined;
  const code = smtpCode === "EAUTH" || responseCode === 535
    ? "MAIL_AUTH_FAILED"
    : ["ESOCKET", "ECONNECTION", "ETIMEDOUT", "EDNS", "ETLS", "ECONNRESET", "ECONNREFUSED", "ENOTFOUND"].includes(smtpCode)
      ? "MAIL_CONNECTION_FAILED"
      : "MAIL_SEND_FAILED";
  // Never log the raw SMTP error, credentials, addresses, message or attachment.
  console.error("studio_mail_failed", { kind, requestId, code, smtpCode, command, responseCode });
  return {
    error: `Chưa xác nhận gửi được ${kind === "booking" ? "yêu cầu" : "đánh giá"}. Thông tin vẫn ở trong biểu mẫu; vui lòng thử lại hoặc liên hệ studio. Mã hỗ trợ: ${code} / ${requestId}.`,
    code,
    requestId,
  };
}
