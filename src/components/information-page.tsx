import { informationPages } from "@/data/information";
import Link from "next/link";
import { STUDIO_EMAIL, STUDIO_ZALO } from "@/data/studio";

export function InformationPage({ page }: { page: keyof typeof informationPages }) {
  const content = informationPages[page];
  return <main className="information-page page-width" id="main">
    <header className="information-header"><Link className="wordmark" href="/">DART</Link><Link href="/#artworks">← Về bộ sưu tập</Link></header>
    <p className="eyebrow">DART STUDIO / THÔNG TIN ĐẶT TRANH</p>
    <h1>{content.title}</h1><p className="information-lead">{content.description}</p>
    <nav className="information-nav" aria-label="Thông tin studio">{Object.entries(informationPages).map(([key, item]) => <a key={key} href={`/${key}`} aria-current={key === page ? "page" : undefined}>{item.title}</a>)}</nav>
    <article className="information-content">{content.sections.map(section => <section key={section.title}><h2>{section.title}</h2>{section.paragraphs.map(text => <p key={text}>{text}</p>)}</section>)}</article>
    <footer className="information-footer"><p>Cần trao đổi về trường hợp của bạn?</p><a className="button button-primary" href={STUDIO_ZALO} target="_blank" rel="noopener noreferrer">Nhắn DART qua Zalo ↗</a><p><a href={`mailto:${STUDIO_EMAIL}`}>{STUDIO_EMAIL}</a></p><Link href="/">Trở về trang chủ</Link></footer>
  </main>;
}
