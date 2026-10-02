import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { artworks } from "@/data/artworks";
import { PURCHASE_DELIVERY_NOTE, SHIPPING_NOTE, STUDIO_ZALO } from "@/data/studio";
import {
  artworkActionHref,
  artworkCategoryLabels,
  artworkHref,
  artworkStructuredData,
  canPurchaseArtwork,
} from "@/lib/artwork-presentation";
import { serializeJsonLd } from "@/lib/site-url";
import styles from "./artwork.module.css";

type Props = { params: Promise<{ slug: string }> };

function findArtwork(slug: string) {
  return artworks.find((artwork) => artwork.slug === slug);
}

export const dynamicParams = false;

export function generateStaticParams() {
  return artworks.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const artwork = findArtwork((await params).slug);
  if (!artwork) notFound();
  const title = `${artwork.title} — ${artworkCategoryLabels[artwork.category]}`;
  return {
    title,
    description: artwork.description,
    alternates: { canonical: artworkHref(artwork) },
    openGraph: {
      title: `${title} | DART Studio`,
      description: artwork.description,
      url: artworkHref(artwork),
      type: "website",
      locale: "vi_VN",
      siteName: "DART Studio",
      images: [{ url: artwork.image, alt: `${artwork.title} — ${artwork.medium}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | DART Studio`,
      description: artwork.description,
      images: [artwork.image],
    },
  };
}

export default async function ArtworkPage({ params }: Props) {
  const artwork = findArtwork((await params).slug);
  if (!artwork) notFound();

  const purchasable = canPurchaseArtwork(artwork);
  const delivered = artwork.status === "delivered";
  const status = purchasable ? "Có sẵn" : delivered ? "Tác phẩm đã thực hiện" : "Tác phẩm giới thiệu";
  const photos = artwork.images ?? [artwork.image];
  const related = artworks.filter((item) => item.id !== artwork.id && item.category === artwork.category).slice(0, 3);

  return (
    <div className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(artworkStructuredData(artwork)) }} />
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="DART Studio — về trang chủ">DART<span>ART STUDIO</span></Link>
        <nav aria-label="Điều hướng tác phẩm">
          <Link href="/#artworks">Bộ sưu tập</Link>
          <Link href="/#commission">Đặt tranh theo yêu cầu</Link>
        </nav>
      </header>

      <main id="main-content" className={styles.main}>
        <nav aria-label="Đường dẫn" className={styles.breadcrumb}>
          <ol>
            <li><Link href="/">Trang chủ</Link></li>
            <li><Link href="/#artworks">Tác phẩm</Link></li>
            <li aria-current="page">{artwork.title}</li>
          </ol>
        </nav>

        <article className={styles.artwork}>
          <div className={styles.photographs}>
            <a href={artwork.image} target="_blank" rel="noreferrer" className={styles.mainImage} aria-label={`Mở ảnh ${artwork.title} ở kích thước lớn trong tab mới`}>
              <Image src={artwork.image} alt={`${artwork.title} — ${artwork.description}`} fill sizes="(max-width: 760px) 92vw, 55vw" preload />
              <span className={styles.imageHint}>Xem ảnh lớn ↗</span>
            </a>
            {photos.length > 1 && <div className={styles.moreImages}>
              {photos.slice(1).map((image, index) => <a key={image} href={image} target="_blank" rel="noreferrer" aria-label={`Xem góc chụp ${index + 2} của ${artwork.title} trong tab mới`}>
                <Image src={image} alt={`${artwork.title} — góc chụp ${index + 2}`} fill sizes="(max-width: 760px) 44vw, 26vw" />
              </a>)}
            </div>}
          </div>

          <div className={styles.details}>
            <p className={styles.eyebrow}>{artworkCategoryLabels[artwork.category]}</p>
            <h1>{artwork.title}</h1>
            <p className={styles.artist}>Một tác phẩm của {artwork.artist}</p>
            <span className={`${styles.status} ${purchasable ? styles.available : ""}`}>{status}</span>
            <p className={styles.description}>{artwork.description}</p>

            {purchasable && <p className={styles.price}>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(artwork.price!)}</p>}
            {delivered && <p className={styles.context}>Tác phẩm này đã được thực hiện cho khách. Bạn có thể dùng làm gợi ý cho một yêu cầu mới; studio sẽ tư vấn và báo giá riêng.</p>}
            {artwork.status === "inquiry" && <p className={styles.context}>Liên hệ báo giá. Tác phẩm hiện được giới thiệu để bạn tham khảo; studio chưa nhận yêu cầu mua trực tiếp trên website.</p>}

            <div className={styles.actions}>
              {(purchasable || delivered) && <Link href={artworkActionHref(artwork)} className={styles.primary}>
                {purchasable ? "Đặt mua tác phẩm" : "Đặt tranh tương tự"}<span aria-hidden="true">↗</span>
              </Link>}
              <a href={STUDIO_ZALO} target="_blank" rel="noreferrer" className={styles.secondary}>Nhắn DART qua Zalo <span aria-hidden="true">↗</span></a>
            </div>

            <dl className={styles.specifications}>
              <div><dt>Chất liệu</dt><dd>{artwork.medium}</dd></div>
              <div><dt>Kích thước</dt><dd>{artwork.dimensions}</dd></div>
              <div><dt>Khung tranh</dt><dd>Giá chưa bao gồm khung. Studio tư vấn lựa chọn khung và chi phí trước khi chốt đơn.</dd></div>
            </dl>

            <section className={styles.note} aria-labelledby="delivery-heading">
              <h2 id="delivery-heading">Giao nhận &amp; bảo quản</h2>
              <p>{purchasable ? PURCHASE_DELIVERY_NOTE : "Với tranh đặt theo yêu cầu, ngày mong muốn nhận tranh sẽ được studio đối chiếu lịch vẽ và xác nhận khi tư vấn."}</p>
              <p>{SHIPPING_NOTE}</p>
              <p>Giữ tác phẩm khô ráo, tránh nắng trực tiếp và không chà xát bề mặt nét vẽ. Với giày hoặc sản phẩm vẽ riêng, hỏi studio cách vệ sinh phù hợp trước khi sử dụng.</p>
              <div className={styles.noteLinks}><Link href="/order-guide">Hướng dẫn đặt hàng</Link><Link href="/shipping">Thông tin vận chuyển</Link></div>
            </section>
          </div>
        </article>

        {related.length > 0 && <section className={styles.related} aria-labelledby="related-heading">
          <div className={styles.relatedHeading}><h2 id="related-heading">Cùng một cảm hứng</h2><Link href="/#artworks">Xem bộ sưu tập ↗</Link></div>
          <div className={styles.relatedGrid}>
            {related.map((item) => <Link key={item.id} href={artworkHref(item)} className={styles.relatedCard} aria-label={`Xem tác phẩm ${item.title}`}>
              <div className={styles.relatedImage}><Image src={item.image} alt={item.title} fill sizes="(max-width: 760px) 44vw, 30vw" /></div>
              <p>{item.status === "available" ? "Có sẵn" : item.status === "delivered" ? "Tác phẩm đã thực hiện" : "Tác phẩm giới thiệu"}</p>
              <h3>{item.title}</h3>
            </Link>)}
          </div>
        </section>}
      </main>

      <footer className={styles.footer}>
        <Link href="/">DART Studio</Link>
        <nav aria-label="Thông tin studio"><Link href="/order-guide">Hướng dẫn đặt hàng</Link><Link href="/shipping">Vận chuyển</Link><Link href="/privacy">Bảo mật</Link></nav>
      </footer>
    </div>
  );
}
