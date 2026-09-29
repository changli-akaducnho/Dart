export type Review = { name: string; email: string; rating: number; comment: string };

export function validateReview(input: unknown): Review {
  if (!input || typeof input !== "object") throw new Error("Đánh giá không hợp lệ.");
  const data = input as Record<string, unknown>;
  const read = (key: string, min: number, max: number) => {
    if (typeof data[key] !== "string") throw new Error("Vui lòng điền đầy đủ thông tin.");
    const value = data[key].trim();
    if (value.length < min || value.length > max) throw new Error("Vui lòng kiểm tra độ dài thông tin đánh giá.");
    return value;
  };
  const name = read("name", 2, 100);
  const email = read("email", 5, 200);
  const comment = read("comment", 10, 2000);
  if (/[\r\n]/.test(name) || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email))
    throw new Error("Vui lòng nhập tên và email hợp lệ.");
  if (typeof data.rating !== "number" || !Number.isInteger(data.rating) || data.rating < 1 || data.rating > 5)
    throw new Error("Vui lòng chọn từ 1 đến 5 sao.");
  return { name, email, comment, rating: data.rating };
}
