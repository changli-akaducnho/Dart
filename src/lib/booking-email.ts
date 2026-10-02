import { PURCHASE_DELIVERY_NOTE, SHIPPING_NOTE, STUDIO_EMAIL, STUDIO_ZALO } from "../data/studio";
import { bookingCategoryLabel, COMMISSION_TIMELINE_NOTE, COMMISSION_PLANNING_NOTE, PAYMENT_METHODS, type Booking } from "./booking";

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
      `Phương thức thanh toán: ${PAYMENT_METHODS[booking.paymentMethod]}`,
      "",
      "THÔNG TIN ĐẶT TRANH",
      ...(booking.type === "commission"
        ? [`Thể loại: ${bookingCategoryLabel(booking.category)}`, `Ngân sách: ${booking.budget}`]
        : [
            `Mã tranh: ${booking.artworkId}`,
            `Tác phẩm: ${artwork?.title}`,
            `Giá tham khảo: ${artwork?.price?.toLocaleString("vi-VN")} VNĐ`,
          ]),
      ...(booking.type === "commission"
        ? [`Khổ tranh mong muốn: ${booking.dimensions}`, `Ngày mong muốn nhận tranh (cần xác nhận): ${date}`]
        : [PURCHASE_DELIVERY_NOTE]),
      `Mô tả ý tưởng: ${booking.idea || "Không cung cấp"}`,
      `Lời nhắn: ${booking.message || "Không có"}`,
      "Ảnh tham khảo: xem tệp đính kèm nếu khách có cung cấp.",
      "",
      "LƯU Ý TƯ VẤN",
      ...(booking.type === "commission"
        ? [COMMISSION_TIMELINE_NOTE, COMMISSION_PLANNING_NOTE, "Ngày khách chọn là ngày mong muốn, cần studio xác nhận.",
           "Nhân viên tư vấn vui lòng liên hệ khách để xác nhận yêu cầu, kích thước, báo giá và lịch giao."]
        : ["Nhân viên vui lòng liên hệ khách để hỗ trợ đơn hàng và giao tranh có sẵn."]),
      "Đây là yêu cầu tư vấn đặt tranh; chưa xác nhận thanh toán hoặc giữ chỗ tác phẩm.",
    ].join("\n"),
  };
}

export function bookingConfirmationEmail(
  booking: Booking,
  id: string,
  artwork?: { title: string; price: number | null },
) {
  return {
    to: { name: booking.name, address: booking.email },
    replyTo: { name: "DART Space Studio", address: STUDIO_EMAIL },
    subject: `[DART] Đã nhận yêu cầu đặt tranh — ${id}`,
    text: [
      `Chào ${booking.name},`,
      "",
      "Cảm ơn bạn đã đặt tranh tại DART Space Studio. Yêu cầu của bạn đã được gửi đến studio.",
      `Mã yêu cầu: ${id}`,
      "",
      "THÔNG TIN YÊU CẦU",
      ...(booking.type === "commission"
        ? ["Hình thức: Đặt tranh theo yêu cầu", `Thể loại: ${bookingCategoryLabel(booking.category)}`, `Ngân sách: ${booking.budget}`]
        : ["Hình thức: Đặt tranh có sẵn", `Tác phẩm: ${artwork?.title}`, `Mã tranh: ${booking.artworkId}`, `Giá tham khảo: ${artwork?.price?.toLocaleString("vi-VN")} VNĐ`]),
      ...(booking.type === "commission"
        ? [`Khổ tranh mong muốn: ${booking.dimensions}`, `Ngày mong muốn nhận tranh (cần xác nhận): ${booking.desiredDate.split("-").reverse().join("/")}`]
        : [PURCHASE_DELIVERY_NOTE]),
      `Điện thoại / Zalo: ${booking.phone}`,
      `Địa chỉ nhận hàng: ${booking.address}`,
      `Mô tả ý tưởng: ${booking.idea || "Không cung cấp"}`,
      `Lời nhắn: ${booking.message || "Không có"}`,
      `Vận chuyển: ${SHIPPING_NOTE}`,
      `Phương thức thanh toán: ${PAYMENT_METHODS[booking.paymentMethod]}`,
      "",
      booking.type === "commission"
        ? "Nhân viên tư vấn sẽ liên hệ trực tiếp để xác nhận yêu cầu, báo giá và lịch giao tranh."
        : "Nhân viên sẽ liên hệ trực tiếp để hỗ trợ đơn hàng.",
      "Email này xác nhận đã nhận yêu cầu đặt tranh, chưa xác nhận thanh toán hoặc giữ chỗ tác phẩm.",
      ...(booking.type === "commission" ? [COMMISSION_TIMELINE_NOTE, COMMISSION_PLANNING_NOTE, "Ngày nhận mong muốn cần được studio xác nhận."] : []),
      "Nếu cần gấp hoặc muốn sửa thông tin, hãy trả lời email này hoặc liên hệ Zalo kèm mã yêu cầu. Bạn không cần đặt lại.",
      `Zalo: ${STUDIO_ZALO}`,
      `Email studio: ${STUDIO_EMAIL}`,
      "",
      "DART Space Studio",
    ].join("\n"),
  };
}
