export const BOOKING_CATEGORIES = [
  "Chân dung",
  "Character Illustration",
  "Phong cảnh",
  "Thú cưng",
  "Custom Concept",
] as const;
export const BOOKING_SIZES = ["A5", "A4"] as const;
export const PAYMENT_METHODS = {
  cod: "COD — Thanh toán khi nhận hàng",
  bank_transfer: "Chuyển khoản ngân hàng",
} as const;
export type PaymentMethod = keyof typeof PAYMENT_METHODS;
export const BOOKING_BUDGETS = [
  "Dưới 1 triệu",
  "1–2 triệu",
  "2–5 triệu",
  "Trên 5 triệu",
] as const;
export const MAX_REFERENCE_BYTES = 5 * 1024 * 1024;
export const REFERENCE_TYPES = ["image/jpeg", "image/png", "image/webp"];

/** Seven calendar days after today's date in the studio's timezone. */
export function minimumBookingDate(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const part = (type: string) => parts.find((p) => p.type === type)!.value;
  const date = new Date(
    `${part("year")}-${part("month")}-${part("day")}T00:00:00Z`,
  );
  date.setUTCDate(date.getUTCDate() + 7);
  return date.toISOString().slice(0, 10);
}

export type Booking = {
  type: "commission" | "purchase";
  name: string;
  phone: string;
  email: string;
  address: string;
  paymentMethod: PaymentMethod;
  dimensions: string;
  desiredDate: string;
  category: string;
  budget: string;
  idea: string;
  artworkId: string;
  message: string;
};

export function validateBooking(data: FormData, now = new Date()): Booking {
  const read = (key: string, max: number) => {
    const value = data.get(key);
    if (value !== null && typeof value !== "string")
      throw new Error("Thông tin biểu mẫu không hợp lệ.");
    const text = (value || "").trim();
    if (text.length > max)
      throw new Error("Thông tin vượt quá độ dài cho phép.");
    return text;
  };
  const type = read("type", 20);
  if (type !== "commission" && type !== "purchase")
    throw new Error("Loại yêu cầu không hợp lệ.");
  const paymentMethod = read("paymentMethod", 30);
  if (paymentMethod !== "cod" && paymentMethod !== "bank_transfer")
    throw new Error("Vui lòng chọn thanh toán COD hoặc chuyển khoản ngân hàng.");
  const booking: Booking = {
    type,
    paymentMethod,
    name: read("name", 100),
    phone: read("phone", 24),
    email: read("email", 200),
    address: read("address", 500),
    dimensions: type === "commission" ? read("dimensions", 10) : "",
    desiredDate: type === "commission" ? read("desiredDate", 10) : "",
    category: read("category", 80),
    budget: read("budget", 80),
    idea: read("idea", 4000),
    artworkId: read("artworkId", 100),
    message: read("message", 4000),
  };
  if (booking.name.length < 2 || /[\r\n]/.test(booking.name))
    throw new Error("Vui lòng nhập họ tên hợp lệ.");
  if (!/^\+?\d{8,15}$/.test(booking.phone.replace(/[\s().-]/g, "")))
    throw new Error("Vui lòng nhập số điện thoại hợp lệ.");
  if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(booking.email))
    throw new Error("Vui lòng nhập email hợp lệ.");
  if (booking.address.length < 10)
    throw new Error("Vui lòng nhập địa chỉ nhận hàng đầy đủ (ít nhất 10 ký tự).");
  if (type === "commission") {
    if (!BOOKING_SIZES.some((size) => size === booking.dimensions))
      throw new Error("Vui lòng chọn khổ A5 hoặc A4.");
    const date = new Date(`${booking.desiredDate}T00:00:00Z`);
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(booking.desiredDate) ||
      Number.isNaN(date.valueOf()) ||
      date.toISOString().slice(0, 10) !== booking.desiredDate ||
      booking.desiredDate < minimumBookingDate(now)
    ) {
      throw new Error(
        "Ngày nhận tranh phải cách hôm nay ít nhất 7 ngày. Nếu cần gấp, vui lòng liên hệ Zalo.",
      );
    }
    if (!BOOKING_CATEGORIES.some((category) => category === booking.category))
      throw new Error("Vui lòng chọn loại tranh.");
    if (!BOOKING_BUDGETS.some((budget) => budget === booking.budget))
      throw new Error("Vui lòng chọn ngân sách.");
    if (booking.category === "Custom Concept" && booking.idea.length < 10)
      throw new Error("Custom Concept cần mô tả ý tưởng ít nhất 10 ký tự.");
  }
  const reference = data.get("reference");
  const hasReference = reference instanceof File && reference.size > 0;
  if (
    type === "commission" &&
    booking.category === "Custom Concept" &&
    !hasReference
  )
    throw new Error("Vui lòng thêm ảnh tham khảo cho Custom Concept.");
  if (reference && typeof reference === "string")
    throw new Error("Ảnh tham khảo không hợp lệ.");
  if (
    hasReference &&
    (!REFERENCE_TYPES.includes(reference.type) ||
      reference.size > MAX_REFERENCE_BYTES)
  )
    throw new Error("Ảnh tham khảo phải là JPG, PNG hoặc WebP, tối đa 5 MB.");
  return booking;
}
