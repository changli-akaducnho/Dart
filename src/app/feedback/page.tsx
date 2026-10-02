import type { Metadata } from "next";
import Link from "next/link";
import { ReviewForm } from "@/components/review-form";
import { STUDIO_ZALO } from "@/data/studio";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Gửi đánh giá",
  description: "Chia sẻ trải nghiệm sau khi nhận tranh từ DART Studio. Phản hồi được gửi riêng đến studio, không tự động đăng công khai.",
  alternates: { canonical: "/feedback" },
  robots: { index: false, follow: true },
};

export default function FeedbackPage() {
  return (
    <div className={styles.page}>
      <a className="skip-link" href="#feedback-content">Đến nội dung chính</a>
      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="DART Studio — về trang chủ">DART<span>ART & SOUL</span></Link>
        <Link className="text-link" href="/">← Về trang chủ</Link>
      </header>
      <main id="feedback-content" className={styles.main}>
        <div className={styles.heading}>
          <p className="eyebrow">SAU MỖI TÁC PHẨM</p>
          <h1>Cảm nhận của bạn về DART</h1>
          <p>Một lời chia sẻ giúp studio chăm chút tốt hơn cho từng bức tranh và từng trải nghiệm.</p>
        </div>
        <ReviewForm />
      </main>
      <footer className={styles.footer}>
        <p>DART Studio · Cảm ơn bạn đã để DART đồng hành cùng câu chuyện của mình.</p>
        <nav aria-label="Liên kết hỗ trợ">
          <Link href="/privacy">Thông tin về quyền riêng tư</Link>
          <a href={STUDIO_ZALO} target="_blank" rel="noopener noreferrer">Nhắn DART qua Zalo ↗</a>
        </nav>
      </footer>
    </div>
  );
}
