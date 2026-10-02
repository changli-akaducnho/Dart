import type { Artwork, ArtworkCategory } from "../data/artworks";
import { absoluteSiteUrl } from "./site-url";

export const artworkCategoryLabels: Record<ArtworkCategory, string> = {
  Portrait: "Chân dung",
  "Character Illustration": "Minh họa nhân vật",
  Landscape: "Phong cảnh",
  Pet: "Thú cưng",
  "Custom Concept": "Ý tưởng riêng",
};

export function canPurchaseArtwork(artwork: Artwork) {
  return artwork.status === "available" && artwork.available &&
    artwork.price !== null && artwork.price > 0;
}

export function artworkHref(artwork: Pick<Artwork, "slug">) {
  return `/artworks/${encodeURIComponent(artwork.slug)}`;
}

export function artworkActionHref(artwork: Artwork) {
  const action = canPurchaseArtwork(artwork) ? "purchase" : "commission";
  return `/?${action}=${encodeURIComponent(artwork.id)}`;
}

export function artworkStructuredData(artwork: Artwork) {
  const url = absoluteSiteUrl(artworkHref(artwork));
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: absoluteSiteUrl() },
      { "@type": "ListItem", position: 2, name: "Tác phẩm", item: absoluteSiteUrl("/#artworks") },
      { "@type": "ListItem", position: 3, name: artwork.title, item: url },
    ],
  };
  if (!canPurchaseArtwork(artwork)) return [breadcrumbs];

  return [breadcrumbs, {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#artwork`,
    name: artwork.title,
    description: artwork.description,
    image: (artwork.images ?? [artwork.image]).map((image) => absoluteSiteUrl(image)),
    url,
    category: artworkCategoryLabels[artwork.category],
    material: artwork.medium,
    brand: { "@type": "Brand", name: "DART Studio" },
    offers: {
      "@type": "Offer",
      url,
      price: artwork.price,
      priceCurrency: "VND",
      availability: "https://schema.org/InStock",
      seller: { "@id": absoluteSiteUrl("/#studio") },
    },
  }];
}
