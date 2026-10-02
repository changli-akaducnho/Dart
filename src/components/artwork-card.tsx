import Image from "next/image";
import type { Artwork } from "@/data/artworks";
import { categories } from "@/data/site-content";
import { Icon } from "./icons";

export function ArtworkCard({ artwork, onOpen, onCommission }: {
  artwork: Artwork;
  onOpen: (artwork: Artwork) => void;
  onCommission: (artwork: Artwork) => void;
}) {
  const available = artwork.status === "available";
  const label = available ? "Có sẵn" : artwork.status === "delivered" ? "Tác phẩm đã thực hiện" : "Trưng bày";
  const href = `/artworks/${artwork.slug}`;
  return (
    <article className="artwork-card">
      <a className="artwork-image" href={href} aria-label={`Xem tác phẩm ${artwork.title}`}>
        <span className="artwork-status"><i className={available ? "available" : "unavailable"} />{label}</span>
        <div className="artwork-image-mat">
          <Image src={artwork.image} alt={`${artwork.title} — ${artwork.medium}`} fill sizes="(max-width: 550px) 90vw, (max-width: 900px) 44vw, 28vw" className="object-contain" />
        </div>
        <span className="artwork-hover">Xem tác phẩm <Icon name="arrow-up" size={17} /></span>
      </a>
      <div className="artwork-label">
        <div><a className="artwork-title" href={href}>{artwork.title}</a><p>{artwork.medium}</p></div>
        {available && artwork.price !== null && <span className="artwork-price">{new Intl.NumberFormat("vi-VN").format(artwork.price)} ₫</span>}
      </div>
      <p className="artwork-artist">{categories.find(item => item.value === artwork.category)?.label}</p>
      <div className="artwork-actions">
        <button className="text-link" onClick={() => onOpen(artwork)} aria-label={`Xem nhanh ${artwork.title}`}>Xem nhanh <Icon name="arrow-up" size={14} /></button>
        {!available && <button className="text-link" onClick={() => onCommission(artwork)} aria-label={`Đặt tranh tương tự ${artwork.title}`}>Đặt tranh tương tự <Icon name="arrow-up" size={14} /></button>}
      </div>
    </article>
  );
}
