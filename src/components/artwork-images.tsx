"use client";
import Image from "next/image";
import { useState } from "react";
import type { Artwork } from "@/data/artworks";

export function ArtworkImages({ artwork }: { artwork: Artwork }) {
  const [selected, setSelected] = useState(0);
  const images = artwork.images?.length ? artwork.images : [artwork.image];
  return (
    <div className="detail-media">
      <div className="detail-image">
        <Image
          src={images[selected]}
          alt={`${artwork.title} — ảnh ${selected + 1}`}
          fill
          sizes="(max-width: 700px) 85vw, 440px"
          className="object-contain"
        />
      </div>
      {images.length > 1 && (
        <div
          className="detail-thumbnails"
          role="group"
          aria-label={`Ảnh của ${artwork.title}`}
        >
          {images.map((src, index) => (
            <button
              key={src}
              aria-label={`Xem ảnh ${index + 1} của ${artwork.title}`}
              aria-pressed={index === selected}
              className={index === selected ? "is-active" : ""}
              onClick={() => setSelected(index)}
            >
              <Image
                src={src}
                alt={`Góc nhìn ${index + 1}`}
                width={80}
                height={80}
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
