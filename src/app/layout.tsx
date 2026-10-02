import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { STUDIO_EMAIL, STUDIO_PAGE, STUDIO_ZALO } from "@/data/studio";
import { absoluteSiteUrl, getSiteUrl, serializeJsonLd } from "@/lib/site-url";
import "./globals.css";

const sans = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-sans",
  display: "swap",
});
const serif = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});
const title = "DART Studio — Original Art & Custom Commissions";
const description =
  "Khám phá tác phẩm có sẵn và đặt tranh theo yêu cầu tại DART Studio: chân dung, minh họa nhân vật, thú cưng và ý tưởng riêng. Xem tác phẩm thật và bảng giá.";
export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: { default: title, template: "%s | DART Studio" },
  description,
  openGraph: {
    title,
    description,
    url: "/",
    type: "website",
    locale: "vi_VN",
    siteName: "DART Studio",
    images: [{ url: "/images/artworks/p7.webp", alt: "Hoa bên mái tóc — tranh chì màu của DART Studio" }],
  },
  twitter: { card: "summary_large_image", title, description, images: ["/images/artworks/p7.webp"] },
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body className={`${sans.variable} ${serif.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd({
            "@context": "https://schema.org",
            "@type": "Organization",
            "@id": absoluteSiteUrl("/#studio"),
            name: "DART Studio",
            url: absoluteSiteUrl(),
            email: STUDIO_EMAIL,
            sameAs: [STUDIO_PAGE, STUDIO_ZALO],
          }) }}
        />
        {children}
      </body>
    </html>
  );
}
