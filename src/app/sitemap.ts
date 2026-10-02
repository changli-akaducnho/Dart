import type { MetadataRoute } from "next";
import { artworks } from "@/data/artworks";
import { artworkHref } from "@/lib/artwork-presentation";
import { absoluteSiteUrl } from "@/lib/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteSiteUrl(), changeFrequency: "weekly", priority: 1 },
    ...artworks.map((artwork) => ({
      url: absoluteSiteUrl(artworkHref(artwork)),
      images: [absoluteSiteUrl(artwork.image)],
      changeFrequency: "monthly" as const,
      priority: artwork.status === "available" ? 0.8 : 0.6,
    })),
    ...["/order-guide", "/shipping", "/privacy", "/terms"].map((path) => ({
      url: absoluteSiteUrl(path), changeFrequency: "monthly" as const, priority: 0.3,
    })),
  ];
}
