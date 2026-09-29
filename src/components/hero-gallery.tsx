"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Artwork } from "@/data/artworks";
import { Icon } from "./icons";

export function HeroGallery({
  items,
  onSelect,
  suspended = false,
}: {
  items: Artwork[];
  onSelect: (artwork: Artwork) => void;
  suspended?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [hidden, setHidden] = useState(false);
  const [explicitPlay, setExplicitPlay] = useState(false);
  const active = items[index];
  const playing =
    !paused &&
    (explicitPlay || (!hovered && !focused)) &&
    !reducedMotion &&
    !hidden &&
    !suspended;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(media.matches);
    const updateVisibility = () => setHidden(document.hidden);
    updateMotion();
    updateVisibility();
    media.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      media.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (!playing || items.length < 2) return;
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % items.length),
      6000,
    );
    return () => window.clearInterval(timer);
  }, [playing, items.length]);

  const change = (next: number) => {
    setExplicitPlay(false);
    setIndex((next + items.length) % items.length);
  };
  return (
    <figure
      className="hero-art hero-carousel"
      aria-roledescription="carousel"
      aria-label="Tác phẩm nổi bật của DART"
      onMouseEnter={() => {
        setHovered(true);
        setExplicitPlay(false);
      }}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => {
        setFocused(true);
        setExplicitPlay(false);
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          change(index - 1);
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          change(index + 1);
        }
      }}
    >
      <div className="art-edition">
        <span>THE DART COLLECTION</span>
        <span>
          {String(index + 1).padStart(2, "0")} /{" "}
          {String(items.length).padStart(2, "0")}
        </span>
      </div>
      <button
        className="hero-image"
        onClick={() => onSelect(active)}
        aria-label={`Xem tác phẩm ${active.title}`}
      >
        <div className="hero-frame">
          <div className="hero-image-inner">
            {items.map((artwork, slideIndex) => (
              <div
                key={artwork.id}
                className={`hero-slide${slideIndex === index ? " is-active" : ""}`}
                aria-hidden={slideIndex !== index}
              >
                <Image
                  src={artwork.image}
                  alt={`${artwork.title} — DART Studio`}
                  fill
                  sizes="(max-width: 767px) 90vw, 52vw"
                  loading={slideIndex === 0 ? "eager" : "lazy"}
                  fetchPriority={slideIndex === 0 ? "high" : "auto"}
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>
        <span className="hero-image-link">
          <Icon name="arrow-up" size={21} />
        </span>
      </button>
      <figcaption
        className="carousel-caption"
        aria-live={playing ? "off" : "polite"}
      >
        <span>
          <i /> {active.title}
        </span>
        <span>
          {active.status === "inquiry"
            ? "Liên hệ báo giá"
            : active.status === "delivered"
              ? "Tác phẩm đã giao"
              : "Còn bán"}
        </span>
      </figcaption>
      <div className="carousel-controls">
        <div
          className="carousel-dots"
          role="group"
          aria-label="Chọn tác phẩm trang chủ"
        >
          {items.map((artwork, slideIndex) => (
            <button
              key={artwork.id}
              className={slideIndex === index ? "is-active" : ""}
              aria-label={`Hiển thị ${artwork.title}`}
              aria-pressed={slideIndex === index}
              onClick={() => change(slideIndex)}
            >
              <span />
            </button>
          ))}
        </div>
        <div className="carousel-arrows">
          <button
            className="icon-button"
            aria-label="Tác phẩm trước"
            onClick={() => change(index - 1)}
          >
            <Icon
              name="arrow"
              size={17}
              style={{ transform: "rotate(180deg)" }}
            />
          </button>
          <button
            className="icon-button carousel-play"
            aria-label={
              paused || reducedMotion
                ? "Bật chuyển cảnh tự động"
                : "Tạm dừng chuyển cảnh"
            }
            onClick={() => {
              if (reducedMotion) {
                setReducedMotion(false);
                setPaused(false);
                setExplicitPlay(true);
              } else {
                setPaused(!paused);
                setExplicitPlay(paused);
              }
            }}
          >
            {paused || reducedMotion ? (
              <span aria-hidden="true">▶</span>
            ) : (
              <span aria-hidden="true">Ⅱ</span>
            )}
          </button>
          <button
            className="icon-button"
            aria-label="Tác phẩm tiếp theo"
            onClick={() => change(index + 1)}
          >
            <Icon name="arrow" size={17} />
          </button>
        </div>
      </div>
    </figure>
  );
}
