"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { artworks, heroArtworkIds, type Artwork } from "@/data/artworks";
import { categories, faqs } from "@/data/site-content";
import { trackEvent } from "@/lib/analytics";
import { CommissionForm, PurchaseForm } from "./inquiry-forms";
import { Modal } from "./modal";
import { Icon } from "./icons";
import { HeroGallery } from "./hero-gallery";
import { ArtworkImages } from "./artwork-images";
import { BookingNotice } from "./booking-notice";
import { STUDIO_EMAIL, STUDIO_ZALO, STUDIO_PAGE } from "@/data/studio";
import { PricingSection } from "./pricing-section";
import { ArtworkCard } from "./artwork-card";

type Overlay =
  | { type: "commission"; source: string; inspiration?: Artwork }
  | { type: "artwork"; artwork: Artwork }
  | { type: "purchase"; artwork: Artwork }
  | { type: "contact" }
  | { type: "search" }
  | { type: "story" };
const price = (value: number | null) =>
  value === null
    ? "Liên hệ báo giá"
    : new Intl.NumberFormat("vi-VN").format(value) + " ₫";
const statusLabel = (artwork: Artwork) =>
  artwork.status === "available"
    ? "Có sẵn"
    : artwork.status === "delivered"
      ? "Tác phẩm đã thực hiện"
      : "Liên hệ báo giá";
const heroArtworks = heroArtworkIds.map(
  (id) => artworks.find((art) => art.id === id)!,
);
const availableWorks = artworks.filter((art) => art.status === "available");
const portfolioWorks = artworks.filter((art) => art.status !== "available");
const graphiteStudy = artworks.find((art) => art.id === "c1")!;
const bluePortrait = artworks.find((art) => art.id === "cc2")!;
const categoryLabel = (category: string) =>
  categories.find((item) => item.value === category)?.label || category;

export function GallerySite() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [overlay, setOverlay] = useState<Overlay | null>(null);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const pageTracked = useRef(false);
  const menuToggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!pageTracked.current) {
      trackEvent("page_view", { source: "home" });
      pageTracked.current = true;
    }
    const params = new URLSearchParams(window.location.search);
    const requestedPurchase = artworks.find(art => art.id === params.get("purchase") && art.status === "available" && art.price !== null);
    const inspiration = artworks.find(art => art.id === params.get("commission"));
    // Schedule the URL-driven interaction after hydration, then consume it so
    // closing the dialog does not reopen it on a reload or history update.
    if (requestedPurchase || inspiration || params.get("commission") === "new") {
      const timer = window.setTimeout(() => {
        setOverlay(requestedPurchase ? { type: "purchase", artwork: requestedPurchase } : { type: "commission", source: "artwork_page", inspiration });
        const url = new URL(window.location.href);
        url.searchParams.delete("purchase");
        url.searchParams.delete("commission");
        window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
      }, 0);
      return () => window.clearTimeout(timer);
    }
  }, []);
  const commission = (source: string, inspiration?: Artwork) => {
    setMenuOpen(false);
    trackEvent("click_commission", { source });
    setOverlay({ type: "commission", source, inspiration });
  };
  const contact = (source: string) => {
    setMenuOpen(false);
    trackEvent("click_contact", { source });
    setOverlay({ type: "contact" });
  };
  const openArtwork = (artwork: Artwork, source = "gallery") => {
    trackEvent("click_artwork", { source, artworkId: artwork.id });
    setOverlay({ type: "artwork", artwork });
  };
  const browse = (source: string) => {
    trackEvent("click_view_artworks", { source });
    setMenuOpen(false);
    setOverlay(null);
  };
  const filtered = portfolioWorks.filter(
    (art) => category === "all" || art.category === category,
  );
  const searchResults = artworks.filter((art) =>
    `${art.id} ${art.title} ${art.artist} ${categoryLabel(art.category)}`
      .toLocaleLowerCase("vi")
      .includes(search.trim().toLocaleLowerCase("vi")),
  );

  return (
    <>
      <a className="skip-link" href="#main">
        Đến nội dung chính
      </a>
      <header className="site-header">
        <div className="header-inner page-width">
          <a href="#home" className="wordmark" aria-label="DART — Trang chủ">
            DART<span>®</span>
          </a>
          <nav className="desktop-nav" aria-label="Điều hướng chính">
            <a href="#home" className="nav-home"> Trang chủ </a>
            <a href="#artworks" onClick={() => browse("navigation")}> Tác phẩm </a>
            <a href="#commission"> Đặt tranh </a>
            <a href="#pricing">Bảng giá</a>
            <a href="#about"> Về DART </a>
            <button onClick={() => contact("navigation")}> Liên hệ </button>
          </nav>
          <div className="header-actions">
            <a className="zalo-header" href={STUDIO_ZALO} target="_blank" rel="noopener noreferrer" aria-label="Nhắn DART qua Zalo (mở tab mới)" onClick={() => trackEvent("click_contact", { source: "zalo_mobile_header" })}>Zalo</a>
            <button
              className="icon-button"
              aria-label="Tìm kiếm tác phẩm"
              onClick={() => {
                setSearch("");
                setOverlay({ type: "search" });
              }}
            >
              <Icon name="search" />
            </button>
            <button
              className="button button-primary nav-cta"
              onClick={() => commission("navigation")}
            >
              Đặt tranh theo yêu cầu <Icon name="arrow-up" size={16} />
            </button>
            <button
              ref={menuToggle}
              className="icon-button menu-toggle"
              aria-label={menuOpen ? "Đóng menu" : "Mở menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Icon name={menuOpen ? "close" : "menu"} />
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav
            id="mobile-nav"
            className="mobile-nav"
            aria-label="Điều hướng di động"
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                setMenuOpen(false);
                menuToggle.current?.focus();
              }
            }}
          >
            <a href="#home" onClick={() => setMenuOpen(false)}> Trang chủ </a>
            <a href="#artworks" onClick={() => browse("navigation")}> Tác phẩm </a>
            <a href="#commission" onClick={() => setMenuOpen(false)}> Đặt tranh </a>
            <a href="#about" onClick={() => setMenuOpen(false)}> Về DART </a>
            <a href="#pricing" onClick={() => setMenuOpen(false)}>Bảng giá</a>
            <button onClick={() => contact("navigation")}> Liên hệ </button>
            <button
              className="button button-primary"
              onClick={() => commission("navigation")}
            >
              Đặt tranh theo yêu cầu <Icon name="arrow" />
            </button>
          </nav>
        )}
      </header>

      <main id="main">
        <section
          className="hero page-width"
          id="home"
          aria-labelledby="hero-title"
        >
          <div className="hero-copy">
            <p className="eyebrow">
              <span className="small-line" /> ORIGINAL ARTWORKS. PERSONAL
              COMMISSIONS.
            </p>
            <h1 id="hero-title">
              Art made
              <br />
              <em>personal.</em>
            </h1>
            <p className="hero-description">
              Những tác phẩm được tạo ra để thuộc về không gian và câu chuyện
              của riêng bạn.
            </p>
            <div className="hero-buttons">
              <a
                href="#artworks"
                className="button button-primary"
                onClick={() => browse("hero")}
              >
                Khám phá tranh <Icon name="arrow" size={18} />
              </a>
              <button className="text-link" onClick={() => commission("hero")}>
                Đặt tranh theo yêu cầu <Icon name="arrow-up" size={17} />
              </button>
            </div>
            <div className="hero-footnote">
              <span className="asterisk">✳</span>
              <p>
                Tranh độc bản. Cảm xúc riêng.
                <br />
                <span>Dành cho những không gian có câu chuyện.</span>
              </p>
            </div>
          </div>
          <HeroGallery
            items={heroArtworks}
            onSelect={(artwork) => openArtwork(artwork, "hero")}
            suspended={overlay !== null}
          />
        </section>

        <div className="studio-strip">
          <div className="page-width">
            <span>MADE WITH INTENTION</span>
            <span>
              Vẽ bằng tay <i>✳</i> Kể bằng cảm xúc <i>✳</i> Dành riêng cho bạn
            </span>
            <span>FROM DART, WITH LOVE</span>
          </div>
        </div>

        <section className="section page-width" id="artworks" aria-labelledby="artworks-title">
          <div className="section-heading">
            <div><p className="eyebrow">01 / AVAILABLE ARTWORKS</p><h2 id="artworks-title">Tác phẩm có sẵn<span className="serif-dot">.</span></h2></div>
            <p>Chọn một tác phẩm để mang về.<br />Đơn hàng sẽ được giao trong 3–5 ngày.</p>
          </div>
          <div className="collection-intro"><span>{availableWorks.length} tác phẩm có sẵn</span><a className="text-link" href="#portfolio">Tham khảo tác phẩm đã thực hiện ↓</a></div>
          <div className="artwork-grid available-grid">{availableWorks.map(art => <ArtworkCard key={art.id} artwork={art} onOpen={openArtwork} onCommission={art => commission("gallery", art)} />)}</div>
        </section>
        <section className="section page-width portfolio-section" id="portfolio" aria-labelledby="portfolio-title">
          <div className="section-heading">
            <div><p className="eyebrow">THE DART PORTFOLIO</p><h2 id="portfolio-title">Tác phẩm đã thực hiện<span className="serif-dot">.</span></h2></div>
            <p>Tham khảo nét vẽ, chất liệu và phong cách.<br />Cùng DART phát triển một ý tưởng dành riêng cho bạn.</p>
          </div>
          <div className="collection-toolbar">
            <div className="filter-list" role="group" aria-label="Lọc tác phẩm tham khảo theo thể loại">{categories.map(item => <button key={item.value} aria-pressed={category === item.value} className={category === item.value ? "filter active" : "filter"} onClick={() => setCategory(item.value)}>{item.label}</button>)}</div>
            <span className="work-count">{filtered.length} TÁC PHẨM THAM KHẢO</span>
          </div>
          <div className="artwork-grid scene-enter" key={category} aria-live="polite">{filtered.map(art => <ArtworkCard key={art.id} artwork={art} onOpen={openArtwork} onCommission={art => commission("portfolio", art)} />)}</div>
          {filtered.length === 0 && <div className="collection-empty"><h3>DART chưa có tác phẩm thuộc thể loại này trong portfolio.</h3><button className="button button-outline" onClick={() => commission("portfolio")}>Đặt tranh theo yêu cầu <Icon name="arrow-up" size={17} /></button></div>}
          <p className="demo-caption">Giá đặt vẽ mới được niêm yết trong <a href="#pricing">bảng giá hiện tại</a> và xác nhận theo yêu cầu của bạn.</p>
        </section>

        <section
          className="commission-section"
          id="commission"
          aria-labelledby="commission-title"
        >
          <div className="page-width commission-layout">
            <div className="commission-intro">
              <p className="eyebrow">02 / MADE JUST FOR YOU</p>
              <h2 id="commission-title">
                Biến ý tưởng của bạn
                <br />
                thành <em>một tác phẩm.</em>
              </h2>
              <p>
                Một kỷ niệm, một người thương, hay một góc nhỏ trong tâm trí.
                Cùng DART kể câu chuyện ấy bằng màu sắc.
              </p>
              <button
                className="button button-ivory"
                onClick={() => commission("commission_section")}
              >
                Đặt tranh theo yêu cầu <Icon name="arrow-up" size={18} />
              </button>
              <span className="commission-note">
                Bắt đầu từ một cuộc trò chuyện.
              </span>
            </div>
            <div className="commission-process">
              {[
                {
                  title: "Gửi ý tưởng",
                  text: "Chia sẻ câu chuyện, cảm hứng hoặc hình ảnh của bạn.",
                },
                {
                  title: "Tìm tiếng nói chung",
                  text: "Cùng chọn phong cách, màu sắc và kích thước phù hợp.",
                },
                {
                  title: "Thống nhất trước khi vẽ",
                  text: "Xác nhận báo giá, tiến độ và bản phác thảo.",
                },
                {
                  title: "Đón tác phẩm của riêng bạn",
                  text: "Hoàn thiện, đóng gói và trao gửi đến không gian của bạn.",
                },
              ].map((step, index) => (
                <div className="process-step" key={step.title}>
                  <span className="step-number">0{index + 1}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                  <Icon name="arrow-up" size={20} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <PricingSection onBook={() => commission("pricing")} />

        <section
          className="why-section page-width"
          aria-label="Vì sao chọn DART"
        >
          <div className="why-heading">
            <p className="eyebrow">THE DART APPROACH</p>
            <h2>Nghệ thuật, theo cách gần gũi hơn.</h2>
          </div>
          <div className="why-grid">
            {[
              {
                icon: "spark" as const,
                title: "Tác phẩm độc bản",
                text: "Mỗi nét vẽ được thực hiện thủ công, mang một câu chuyện riêng.",
              },
              {
                icon: "brush" as const,
                title: "Dấu ấn của bạn",
                text: "Phong cách, màu sắc và kích thước được chọn cùng bạn.",
              },
              {
                icon: "chat" as const,
                title: "Trao đổi trực tiếp",
                text: "Làm việc với người vẽ tranh, từ ý tưởng đến khi hoàn thiện.",
              },
              {
                icon: "check" as const,
                title: "Rõ ràng từ đầu",
                text: "Thống nhất chi phí và tiến độ trước khi bắt đầu tác phẩm.",
              },
            ].map((item) => (
              <div className="why-item" key={item.title}>
                <Icon name={item.icon} size={29} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          className="story-section page-width"
          id="about"
          aria-labelledby="story-title"
        >
          <div className="story-image">
            <Image
              src="/images/artworks/p7.webp"
              alt="Tranh chân dung nữ bằng chì màu P7 do DART thực hiện"
              fill
              sizes="(max-width: 767px) 90vw, 48vw"
              className="object-contain studio-original"
            />
            <span className="image-caption">
              NÉT VẼ THẬT · CÂU CHUYỆN RIÊNG
            </span>
          </div>
          <div className="story-copy">
            <p className="eyebrow">03 / THE STORY BEHIND DART</p>
            <h2 id="story-title">
              Không chỉ là
              <br />
              một <em>bức tranh.</em>
            </h2>
            <p>
              Chúng mình tin rằng nghệ thuật không cần phải xa cách. Đôi khi, đó
              chỉ là một gam màu khiến bạn thấy bình yên, hay một hình ảnh gợi
              về điều bạn thương.
            </p>
            <p>
              Đội ngũ DART trực tiếp thực hiện tranh chân dung, minh họa nhân vật
              và sản phẩm vẽ theo ý tưởng riêng. Từ nét chì, bút bi đến màu trên
              canvas, mỗi chất liệu là một cách để kể câu chuyện của bạn.
            </p>
            <button
              className="text-link"
              onClick={() => setOverlay({ type: "story" })}
            >
              Tìm hiểu về DART <Icon name="arrow-up" size={18} />
            </button>
            <div className="story-signature">
              Made slowly. <em>Meant to stay.</em>
            </div>
          </div>
        </section>

        <section
          className="section page-width studio-section"
          aria-labelledby="studio-title"
        >
          <div className="section-heading">
            <div>
              <p className="eyebrow">BEHIND THE ARTWORK</p>
              <h2 id="studio-title">
                Chất liệu & nét vẽ<span className="serif-dot">.</span>
              </h2>
            </div>
            <a
              className="text-link"
              href={STUDIO_PAGE}
              target="_blank"
              rel="noopener noreferrer"
            >
              Theo dõi DART trên Facebook <Icon name="arrow-up" size={17} />
            </a>
          </div>
          <div className="studio-mosaic">
            {[
              {
                image: "/images/artworks/c4.webp",
                alt: "Tranh Diona do DART vẽ bằng chì màu",
                label: "Diona",
                href: "/artworks/diona-c4",
              },
              {
                image: graphiteStudy.image,
                alt: `Nét vẽ trong ${graphiteStudy.title}`,
                label: "Chi tiết bằng chì graphite",
                href: `/artworks/${graphiteStudy.slug}`,
              },
              {
                image: bluePortrait.image,
                alt: `Tác phẩm hoàn thiện: ${bluePortrait.title}`,
                label: "Những lớp nét bút bi",
                href: `/artworks/${bluePortrait.slug}`,
              },
              {
                image: "/images/artworks/raiden.webp",
                alt: "Tranh Raiden do DART thực hiện",
                label: "Raiden",
                href: "/artworks/raiden",
              },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="studio-tile"
                aria-label={`${item.label} — DART Studio`}
              >
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 600px) 44vw, 24vw"
                  className="object-contain studio-original"
                />
                <span>
                  {item.label}
                  <Icon name="arrow-up" size={17} />
                </span>
              </a>
            ))}
          </div>
          <p className="demo-caption">
            Những tác phẩm được vẽ tay và chụp lại bởi DART.
          </p>
        </section>

        <section className="faq-section page-width" aria-labelledby="faq-title">
          <div>
            <p className="eyebrow">A FEW THINGS TO KNOW</p>
            <h2 id="faq-title">
              Bạn hỏi,
              <br />
              <em>DART trả lời.</em>
            </h2>
            <p>Vẫn còn điều muốn biết?</p>
            <button className="text-link" onClick={() => contact("faq")}>
              Nhắn DART tư vấn <Icon name="arrow-up" size={17} />
            </button>
          </div>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <details key={faq.question} name="dart-faq">
                <summary>
                  <span className="faq-number">0{index + 1}</span>
                  {faq.question}
                  <Icon name="plus" size={18} />
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="final-cta" id="contact">
          <div className="page-width">
            <p className="eyebrow">LET’S MAKE SOMETHING MEANINGFUL</p>
            <h2>
              Bạn có một <em>ý tưởng?</em>
            </h2>
            <p>Hãy biến nó thành một tác phẩm dành riêng cho bạn.</p>
            <div>
              <button
                className="button button-primary"
                onClick={() => commission("final_cta")}
              >
                Đặt tranh theo yêu cầu <Icon name="arrow-up" size={18} />
              </button>
              <button
                className="button button-outline"
                onClick={() => contact("final_cta")}
              >
                Nhắn DART tư vấn <Icon name="arrow" size={18} />
              </button>
            </div>
            <span className="final-asterisk" aria-hidden="true">
              ✳
            </span>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="page-width">
          <div className="footer-main">
            <div className="footer-brand">
              <a href="#home" className="wordmark">
                DART<span>®</span>
              </a>
              <p>
                Original art. Personal stories.
                <br />
                Một chút nghệ thuật, một phần của bạn.
              </p>
            </div>
            <div className="footer-column">
              <h3>KHÁM PHÁ</h3>
              <a href="#artworks" onClick={() => browse("footer")}>
                Tác phẩm
              </a>
              <button onClick={() => commission("footer")}>
                Đặt tranh theo yêu cầu
              </button>
              <a href="#about">Về DART</a>
              <a href="#pricing">Bảng giá</a>
              <a href="/feedback">Gửi phản hồi sau khi nhận tranh</a>
            </div>
            <div className="footer-column">
              <h3>KẾT NỐI</h3>
              <a href={STUDIO_PAGE} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("click_contact", { source: "footer_facebook" })}>Facebook ↗</a>
              <a href={STUDIO_ZALO} target="_blank" rel="noopener noreferrer">Zalo ↗</a>
            </div>
            <div className="footer-column footer-contact">
              <h3>MỘT CUỘC TRÒ CHUYỆN?</h3>
              <a
                href={`mailto:${STUDIO_EMAIL}`}
                onClick={() =>
                  trackEvent("click_contact", { source: "footer_email" })
                }
              >
                {STUDIO_EMAIL} <Icon name="arrow-up" size={17} />
              </a>
              <span>Email chính thức của studio</span>
              <p>Câu chuyện của bạn là điểm bắt đầu.</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} DART Studio.</p>
            <div>
              <a href="/order-guide">Hướng dẫn đặt hàng</a>
              <a href="/shipping">Vận chuyển</a>
              <a href="/privacy">Chính sách bảo mật</a>
              <a href="/terms">Thanh toán & xác nhận đơn</a>
            </div>
            <span>MADE WITH A HUMAN TOUCH</span>
          </div>
        </div>
      </footer>

      {!overlay && <a
        className="zalo-contact"
        href="https://zalo.me/0963549673"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Trao đổi qua Zalo với DART, số 0963549673 (mở tab mới)"
        title="Trao đổi qua Zalo · 0963549673"
        onClick={() => trackEvent("click_contact", { source: "zalo_floating" })}
      >
        <span className="zalo-contact-badge" aria-hidden="true">
          Zalo
        </span>
        <span className="zalo-contact-copy" aria-hidden="true">
          <strong>Trao đổi qua Zalo</strong>
          <span>0963 549 673</span>
        </span>
      </a>}

      {overlay?.type === "commission" && (
        <Modal
          title="Một ý tưởng. Một khởi đầu."
          onClose={() => setOverlay(null)}
          notice={<BookingNotice />}
          wide
        >
          <CommissionForm key={overlay.inspiration?.id || "new"} source={overlay.source} inspiration={overlay.inspiration} />
        </Modal>
      )}
      {overlay?.type === "artwork" && (
        <Modal
          title="Câu chuyện của tác phẩm"
          onClose={() => setOverlay(null)}
          wide
        >
          <div className="artwork-detail">
            <ArtworkImages key={overlay.artwork.id} artwork={overlay.artwork} />
            <div className="detail-copy">
              <p className="eyebrow">
                {categoryLabel(overlay.artwork.category)}
              </p>
              <h2>{overlay.artwork.title}</h2>
              <p className="detail-artist">
                {overlay.artwork.artist}
              </p>
              {overlay.artwork.status === "available" && <><p className="detail-price">{price(overlay.artwork.price)}</p><p className="form-note">Giá chưa bao gồm khung.</p></>}
              <p>{overlay.artwork.description}</p>
              <a className="text-link" href={`/artworks/${overlay.artwork.slug}`}>Mở trang tác phẩm <Icon name="arrow-up" size={16} /></a>
              <dl>
                <div>
                  <dt>Kích thước</dt>
                  <dd>{overlay.artwork.dimensions}</dd>
                </div>
                <div>
                  <dt>Chất liệu</dt>
                  <dd>{overlay.artwork.medium}</dd>
                </div>
                <div>
                  <dt>Tình trạng</dt>
                  <dd>{statusLabel(overlay.artwork)}</dd>
                </div>
              </dl>
              {overlay.artwork.available && overlay.artwork.price !== null ? (
                <button
                  className="button button-primary"
                  onClick={() => {
                    trackEvent("click_buy_artwork", {
                      source: "artwork_detail",
                      artworkId: overlay.artwork.id,
                    });
                    setOverlay({ type: "purchase", artwork: overlay.artwork });
                  }}
                >
                  Mua tác phẩm <Icon name="arrow-up" size={18} />
                </button>
              ) : overlay.artwork.status === "inquiry" ? (
                <button
                  className="button button-primary"
                  onClick={() => contact("artwork_detail")}
                >
                  Liên hệ báo giá <Icon name="arrow-up" size={18} />
                </button>
              ) : (
                <button
                  className="button button-primary"
                  onClick={() => commission("artwork_detail", overlay.artwork)}
                >
                  Đặt tranh tương tự <Icon name="arrow-up" size={18} />
                </button>
              )}
              <button
                className="button button-outline"
                onClick={() => contact("artwork_detail")}
              >
                Nhắn DART tư vấn <Icon name="chat" size={18} />
              </button>
              <p className="form-note">
                {overlay.artwork.status === "delivered"
                  ? "Tác phẩm đã hoàn thành và giao cho khách. Bạn có thể đặt một tác phẩm mới theo phong cách tương tự."
                  : overlay.artwork.status === "inquiry"
                    ? "Tác phẩm trưng bày để tham khảo. Vui lòng liên hệ để biết giá; chưa tiếp nhận yêu cầu mua trên website."
                    : "Tác phẩm có sẵn. Gửi yêu cầu để nhân viên tư vấn hỗ trợ và xác nhận đơn hàng."}
              </p>
            </div>
          </div>
        </Modal>
      )}
      {overlay?.type === "purchase" && overlay.artwork.price !== null && (
        <Modal
          title="Tác phẩm này có thể thuộc về bạn."
          onClose={() => setOverlay(null)}
          notice={<BookingNotice purchase />}
        >
          <PurchaseForm
            artwork={{
              id: overlay.artwork.id,
              title: overlay.artwork.title,
              price: overlay.artwork.price,
            }}
            source="artwork_detail"
          />
        </Modal>
      )}
      {overlay?.type === "search" && (
        <Modal
          title="Tìm một tác phẩm chạm đến bạn."
          onClose={() => setOverlay(null)}
        >
          <label className="search-label" htmlFor="art-search">
            Tên tác phẩm, nghệ sĩ hoặc thể loại
          </label>
          <div className="search-input">
            <Icon name="search" />
            <input
              id="art-search"
              type="search"
              placeholder="Thử “phong cảnh”..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              autoFocus
            />
          </div>
          <p className="search-count" aria-live="polite">
            {searchResults.length} tác phẩm được tìm thấy
          </p>
          <div className="search-results">
            {searchResults.map((art) => (
              <button key={art.id} onClick={() => openArtwork(art, "search")}>
                <Image
                  src={art.image}
                  width={64}
                  height={72}
                  alt={art.title}
                  className="object-cover"
                />
                <span>
                  <strong>{art.title}</strong>
                  <small>
                    {art.artist} · {categoryLabel(art.category)}
                  </small>
                </span>
                <Icon name="arrow-up" size={18} />
              </button>
            ))}
            {searchResults.length === 0 && (
              <p className="empty-message">
                Chưa có tác phẩm phù hợp. Hãy thử một tên hoặc thể loại khác.
              </p>
            )}
          </div>
        </Modal>
      )}
      {overlay?.type === "contact" && (
        <Modal
          title="Bắt đầu một cuộc trò chuyện."
          onClose={() => setOverlay(null)}
        >
          <div className="contact-content">
            <p>
              Một câu hỏi về tác phẩm, một ý tưởng mới, hay đơn giản là lời chào
              — DART luôn sẵn lòng lắng nghe.
            </p>
            <div className="contact-email">
              <span>EMAIL CỦA STUDIO</span>
              <a href={`mailto:${STUDIO_EMAIL}`}>
                <strong>{STUDIO_EMAIL}</strong>
              </a>
              <p>
                Gửi email hoặc{" "}
                <a href={STUDIO_ZALO} target="_blank" rel="noopener noreferrer">
                  trao đổi qua Zalo
                </a>{" "}
                hoặc <a href={STUDIO_PAGE} target="_blank" rel="noopener noreferrer">Facebook</a> để được studio tư vấn trực tiếp.
              </p>
            </div>
            <button
              className="button button-primary"
              onClick={() => commission("contact")}
            >
              Đặt tranh theo yêu cầu <Icon name="arrow-up" />
            </button>
            <p className="form-note">
              Sau khi nhận yêu cầu đặt tranh, nhân viên tư vấn sẽ liên hệ hỗ trợ
              trực tiếp.
            </p>
          </div>
        </Modal>
      )}
      {overlay?.type === "story" && (
        <Modal
          title="DART — Nghệ thuật bắt đầu từ bạn."
          onClose={() => setOverlay(null)}
        >
          <div className="prose">
            <p>
              DART là một studio nhỏ dành cho những người muốn
              sống cùng nghệ thuật. Một tác phẩm không nhất thiết phải lớn lao:
              nó có thể giữ lại ánh sáng của một buổi chiều, nét mặt người thân
              hay một nơi chốn đặc biệt.
            </p>
            <p>
              Chúng mình bắt đầu bằng việc lắng nghe. Cùng bạn chọn chất liệu,
              sắc độ và kích thước, rồi để từng nét vẽ hoàn thiện câu chuyện.
            </p>
            <p>
              Tranh có sẵn dành cho những rung động tình cờ. Tranh đặt riêng
              dành cho những điều chưa có hình hài. Cả hai đều bắt đầu từ một
              kết nối cá nhân.
            </p>
            <button
              className="button button-primary"
              onClick={() => commission("about")}
            >
              Đặt tranh theo yêu cầu <Icon name="arrow-up" />
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
