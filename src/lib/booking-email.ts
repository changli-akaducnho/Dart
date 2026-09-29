import { SHIPPING_NOTE, STUDIO_EMAIL } from "../data/studio";
import type { Booking } from "./booking";

export function bookingEmail(
  booking: Booking,
  id: string,
  createdAt: Date,
  artwork?: { title: string; price: number | null },
) {
  const date = booking.desiredDate.split("-").reverse().join("/");
  const kind =
    booking.type === "commission"
      ? "ĐẶT TRANH THEO YÊU CẦU"
      : "ĐẶT TRANH CÓ SẴN";
  return {
    to: STUDIO_EMAIL,
    replyTo: { name: booking.name, address: booking.email },
    subject: `[DART] BOOK TRANH — ${kind} — ${id}`,
    text: [
      "DART SPACE STUDIO | PHIẾU BOOK TRANH",
      `Mã yêu cầu: ${id}`,
      `Thời gian gửi: ${createdAt.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })} (giờ Việt Nam)`,
      `Hình thức: ${kind}`,
      "",
      "THÔNG TIN KHÁCH HÀNG",
      `Họ tên: ${booking.name}`,
      `Điện thoại / Zalo: ${booking.phone}`,
      `Email: ${booking.email}`,
      `Địa chỉ nhận hàng: ${booking.address}`,
      `Vận chuyển: ${SHIPPING_NOTE}`,
      "",
      "THÔNG TIN ĐẶT TRANH",
      ...(booking.type === "commission"
        ? [`Thể loại: ${booking.category}`, `Ngân sách: ${booking.budget}`]
        : [
            `Mã tranh: ${booking.artworkId}`,
            `Tác phẩm: ${artwork?.title}`,
            `Giá tham khảo: ${artwork?.price?.toLocaleString("vi-VN")} VNĐ`,
          ]),
      `Khổ tranh mong muốn: ${booking.dimensions}`,
      `Ngày yêu cầu nhận hàng: ${date}`,
      `Mô tả ý tưởng: ${booking.idea || "Không cung cấp"}`,
      `Lời nhắn: ${booking.message || "Không có"}`,
      "Ảnh tham khảo: xem tệp đính kèm nếu khách có cung cấp.",
      "",
      "LƯU Ý TƯ VẤN",
      "Khách nên đặt trước 1 tháng để tránh rủi ro về thời gian. Ngày khách chọn là ngày mong muốn, cần studio xác nhận.",
      "Nhân viên tư vấn vui lòng liên hệ khách để xác nhận yêu cầu, kích thước, báo giá và lịch giao.",
      "Đây là yêu cầu tư vấn đặt tranh; chưa xác nhận thanh toán hoặc giữ chỗ tác phẩm.",
    ].join("\n"),
  };
}
