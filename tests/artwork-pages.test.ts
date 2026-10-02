import assert from "node:assert/strict";
import { test } from "node:test";
import { artworks } from "../src/data/artworks";
import { artworkActionHref, artworkHref, artworkStructuredData } from "../src/lib/artwork-presentation";
import { getSiteUrl, PRODUCTION_SITE_URL, serializeJsonLd } from "../src/lib/site-url";

test("production metadata never points to local development or an invalid URL", () => {
  for (const value of [undefined, "", "invalid", "http://localhost:3000", "https://127.0.0.1:3000", "https://[::1]", "https://192.168.1.1", "ftp://example.com", "https://name:password@example.com"]) {
    assert.equal(getSiteUrl(value, "production"), PRODUCTION_SITE_URL);
  }
  assert.equal(getSiteUrl("https://dart.example.com/path?query=1", "production"), "https://dart.example.com");
  assert.equal(getSiteUrl("http://localhost:3000", "development"), "http://localhost:3000");
});

test("only available catalog works expose truthful Product offers", () => {
  for (const artwork of artworks) {
    const data = artworkStructuredData(artwork);
    const product = data.find((item) => item["@type"] === "Product");
    if (artwork.status === "available" && artwork.available && artwork.price) {
      assert.ok(product && "offers" in product);
      assert.equal(product.offers.price, artwork.price);
      assert.equal(product.offers.priceCurrency, "VND");
      assert.equal(product.offers.availability, "https://schema.org/InStock");
    } else {
      assert.equal(product, undefined);
      assert.equal(JSON.stringify(data).includes('"price"'), false);
    }
  }
});

test("artwork links retain catalog slugs and prefill the correct form by ID", () => {
  const available = artworks.find((artwork) => artwork.id === "cc2")!;
  const delivered = artworks.find((artwork) => artwork.id === "c4")!;
  assert.equal(artworkHref(available), "/artworks/anh-nhin-xanh-cc2");
  assert.equal(artworkHref(delivered), "/artworks/diona-c4");
  assert.equal(artworkActionHref(available), "/?purchase=cc2");
  assert.equal(artworkActionHref(delivered), "/?commission=c4");
});

test("structured data text cannot close its script element", () => {
  const result = serializeJsonLd({ name: "</script><img src=x>" });
  assert.equal(result.includes("<"), false);
  assert.deepEqual(JSON.parse(result), { name: "</script><img src=x>" });
});
