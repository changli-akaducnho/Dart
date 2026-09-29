// Source: giá.xlsx, Sheet1, A1:C31. Amounts are VND; null means no listed price.
export const commissionPrices = [
  { name: "Chì đen chân dung", a5: 199000, a4: 299000 },
  { name: "Chì màu", a5: 259000, a4: 359000 },
  { name: "Acrylic", a5: null, a4: 449000 },
  { name: "Acrylic Canvas", a5: null, a4: null },
  { name: "Tranh thú cưng", a5: 229000, a4: 329000 },
  { name: "Tranh couple", a5: 279000, a4: 399000 },
  { name: "Tranh gia đình", a5: null, a4: 499000 },
  { name: "Phong cảnh theo ảnh", a5: 149000, a4: 279000 },
  { name: "Tranh concept / custom", a5: 299000, a4: 449000, from: true },
] as const;

export const turnaroundPrices = [
  { label: "Bình thường · 7–10 ngày", fee: "Không phụ phí" },
  { label: "Đặt gấp · 4–5 ngày", fee: "+15%" },
  { label: "Đặt gấp · 72 giờ", fee: "+60%" },
];

export const additionalPrices = [
  ["Người / thú cưng thứ 2", "+80.000 ₫"],
  ["Người / thú cưng thứ 3 trở đi", "+60.000 ₫ / người"],
  ["Background đơn giản", "Miễn phí"],
  ["Background chi tiết", "+100.000–250.000 ₫"],
  ["Quần áo / phụ kiện nhiều chi tiết", "+50.000–150.000 ₫"],
  ["Ghép nhiều ảnh thành một tranh", "+100.000 ₫"],
  ["Sáng tạo concept hoàn toàn mới", "+150.000–300.000 ₫"],
  ["Chỉnh sửa nhỏ lần 1", "Miễn phí"],
  ["Chỉnh sửa nhỏ lần 2", "Miễn phí"],
  ["Chỉnh sửa từ lần 3", "+50.000 ₫ / lần"],
  ["Chỉnh sửa lớn sau khi đã duyệt sketch", "+20–40%"],
  ["File scan chất lượng cao", "+30.000 ₫"],
] as const;
