// Source: giá.xlsx, Sheet1, A1:C31. Amounts are VND; null means no listed price.
export const commissionPrices = [
  { name: "Chì đen chân dung", a5: 199000, a4: 299000 },
  { name: "Chì màu", a5: 259000, a4: 359000 },
  { name: "Tranh thú cưng", a5: 229000, a4: 329000 },
  { name: "Tranh đôi", a5: 279000, a4: 399000 },
  { name: "Tranh gia đình", a5: null, a4: 499000 },
  { name: "Phong cảnh theo ảnh", a5: 149000, a4: 279000 },
  { name: "Tranh theo ý tưởng riêng", a5: 299000, a4: 449000, from: true },
] as const;

// Studio confirmed the acrylic substrate is canvas on 2026-10-02.
export const canvasPrice = { dimensions: "21 × 29,7 cm (tương đương A4)", amount: 449000 };

export const turnaroundPrices = [
  { label: "7–10 ngày sau khi xác nhận đơn", fee: "Không phụ phí" },
  { label: "Đặt gấp · 4–5 ngày", fee: "+15%" },
  { label: "Đặt gấp · 72 giờ", fee: "+60%" },
];

export const additionalPrices = [
  ["Người / thú cưng thứ 2", "+80.000 ₫"],
  ["Người / thú cưng thứ 3 trở đi", "+60.000 ₫ / người"],
  ["Phông nền đơn giản", "Miễn phí"],
  ["Phông nền chi tiết", "+100.000–250.000 ₫"],
  ["Quần áo / phụ kiện nhiều chi tiết", "+50.000–150.000 ₫"],
  ["Ghép nhiều ảnh thành một tranh", "+100.000 ₫"],
  ["Sáng tạo concept hoàn toàn mới", "+150.000–300.000 ₫"],
  ["Chỉnh sửa nhỏ lần 1", "Miễn phí"],
  ["Chỉnh sửa nhỏ lần 2", "Miễn phí"],
  ["Chỉnh sửa từ lần 3", "+50.000 ₫ / lần"],
  ["Chỉnh sửa lớn sau khi đã duyệt phác thảo", "+20–40%"],
  ["File scan chất lượng cao", "+30.000 ₫"],
] as const;
