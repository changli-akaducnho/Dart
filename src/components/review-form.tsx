"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { STUDIO_PAGE } from "@/data/studio";
import { validateReview } from "@/lib/review";

export function ReviewForm() {
  const prefix = useId();
  const sending = useRef(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");
  const [error, setError] = useState("");
  const [rating, setRating] = useState(0);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current) return;
    const data = new FormData(event.currentTarget);
    setError("");
    try {
      const review = validateReview({ name: data.get("name"), email: data.get("email"), comment: data.get("comment"), rating });
      sending.current = true;
      setStatus("sending");
      const response = await fetch("/api/reviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(review) });
      const result = await response.json();
      if (!response.ok || typeof result.id !== "string") throw new Error(result.error || "Chưa gửi được đánh giá. Vui lòng thử lại.");
      setStatus("success");
    } catch (error) {
      setStatus("idle");
      setError(error instanceof Error ? error.message : "Mất kết nối. Vui lòng thử lại.");
    } finally { sending.current = false; }
  }
  return (
    <div className="review-panel">
      <div className="review-intro">
        <p className="eyebrow">MỖI TRẢI NGHIỆM ĐỀU ĐÁNG LẮNG NGHE</p>
        <h3>Bức tranh của bạn,<br /><em>câu chuyện của bạn.</em></h3>
        <p>Bạn đã nhận tranh từ DART? Chia sẻ cảm nhận về tác phẩm, quá trình trao đổi hoặc điều studio có thể làm tốt hơn.</p>
        <p>Phản hồi của bạn được gửi riêng đến studio qua email, không tự động đăng lên trang.</p>
        <a className="text-link" href={STUDIO_PAGE} target="_blank" rel="noopener noreferrer">Ghé Facebook của DART ↗</a>
      </div>
      <form className="review-form inquiry-form" onSubmit={submit} aria-busy={status === "sending"}>
        <h3>Viết đánh giá của bạn</h3>
        {status === "success" ? <div className="review-success" role="status"><strong>Cảm ơn bạn đã chia sẻ!</strong><p>Đánh giá đã được gửi đến studio. DART sẽ đọc và ghi nhận phản hồi của bạn.</p><button type="button" className="text-link" onClick={() => { setRating(0); setStatus("idle"); }}>Viết phản hồi khác ↗</button></div> : <>
          <fieldset className="form-fields" disabled={status === "sending"}>
            <legend className="sr-only">Nội dung đánh giá</legend>
            <fieldset className="rating-field"><legend>Trải nghiệm của bạn *</legend><div className="star-options">{[1, 2, 3, 4, 5].map((value) => <label key={value} className={rating >= value ? "is-selected" : ""}><input type="radio" name="rating" value={value} checked={rating === value} onChange={() => setRating(value)} required aria-label={`${value} sao`} /><span aria-hidden="true">★</span></label>)}</div><span className="rating-label" aria-live="polite">{rating ? `${rating} / 5 sao` : "Chọn số sao"}</span></fieldset>
            <div className="form-grid">
              <div className="field"><label htmlFor={`${prefix}-name`}>Tên của bạn *</label><input id={`${prefix}-name`} name="name" autoComplete="name" required minLength={2} maxLength={100} /></div>
              <div className="field"><label htmlFor={`${prefix}-email`}>Email liên hệ *</label><input id={`${prefix}-email`} name="email" type="email" autoComplete="email" required maxLength={200} /></div>
              <div className="field field-full"><label htmlFor={`${prefix}-comment`}>Cảm nhận của bạn *</label><textarea id={`${prefix}-comment`} name="comment" rows={4} required minLength={10} maxLength={2000} placeholder="Điều bạn thích, điều studio có thể cải thiện…" /></div>
            </div>
          </fieldset>
          {error && <p role="alert" className="form-error">{error} <a href={STUDIO_PAGE} target="_blank" rel="noopener noreferrer">Liên hệ Facebook ↗</a></p>}
          <button className="button button-primary" disabled={status === "sending"}>{status === "sending" ? "Đang gửi đánh giá…" : "Gửi đánh giá"} <span aria-hidden="true">↗</span></button>
          <p className="form-note">Tên, email và nhận xét được chuyển đến studio để tiếp nhận phản hồi. Email không hiển thị công khai.</p>
        </>}
      </form>
    </div>
  );
}
