# DART — Original Art & Custom Paintings

A responsive Vietnamese art studio MVP built with Next.js App Router, React, TypeScript and Tailwind CSS. Booking requests and optional reference images are sent through a server API to the studio's Gmail after Gmail credentials are configured. There are no accounts, online payments or automatic order confirmations.

## Run locally

Use Node.js 20.9+ (Node 24 was used for validation).

### Windows: current folder `D:\Dart`

Double-click `start-dart.cmd` in the project folder. After **Ready** appears, open http://127.0.0.1:3000 and keep the terminal window open. The launcher uses its own folder, so it continues to work if the project moves again. It installs locked dependencies with `npm ci` only when Next.js is missing.

Alternatively, start it from PowerShell:

```powershell
Set-Location -LiteralPath 'D:\Dart'
npm.cmd run dev -- --hostname 127.0.0.1 --port 3000
```

If the browser reports that it cannot connect, start the server using one of these methods. A local website is available only while its server is running. If the terminal reports that port 3000 is occupied, first check the existing page at that address.

After moving the project, run `npm.cmd run build` from the new folder before using `npm.cmd start`: generated production files contain absolute paths from the folder where they were built. Images and application imports use project-relative paths.

### Other environments

```sh
npm install
npm run dev
```

Open http://localhost:3000. Open http://localhost:3000/analytics in the **same browser and origin** to inspect interactions. `localhost` and `127.0.0.1` have separate browser storage.

```sh
npm run lint
npm run typecheck
npm run build
npm start
```

The production server returns **404** for `/analytics`. The dashboard is deliberately available only with `npm run dev`. Fonts are downloaded from Google at build time by `next/font`, then self-hosted. Initial installation and builds need network access.

## Project structure and files created

| Path                                                                                          | Purpose                                                                                                          |
| --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `src/app/page.tsx`                                                                            | Landing page route                                                                                               |
| `src/app/layout.tsx`                                                                          | Vietnamese language, self-hosted fonts, SEO and Open Graph metadata                                              |
| `src/app/globals.css`                                                                         | Tailwind import, visual tokens, gallery layouts and responsive styles                                            |
| `src/app/analytics/page.tsx`                                                                  | Development-only dashboard route                                                                                 |
| `src/components/gallery-site.tsx`                                                             | Navigation, collection filters/search, details, commission/story/gallery/FAQ/footer sections and inquiry routing |
| `src/components/hero-gallery.tsx`                                                             | Four-work hero carousel with crossfade, manual controls and automatic playback safeguards                        |
| `src/components/artwork-images.tsx`                                                           | Detail image viewer with selectable thumbnails for multi-image products                                          |
| `src/components/modal.tsx`                                                                    | Reusable native dialog with keyboard focus, Escape/backdrop dismissal and scroll locking                         |
| `src/components/inquiry-forms.tsx`                                                            | Validated commission and purchase forms; reference preview and truthful success/error states                     |
| `src/components/icons.tsx`                                                                    | Small reusable inline icon set; no icon dependency                                                               |
| `src/components/analytics-dashboard.tsx`                                                      | Metrics, session rates, recent events and CSV export                                                             |
| `src/data/artworks.ts`                                                                        | Twenty typed DART catalog records, status and price data, image lists and hero selection                         |
| `src/data/site-content.ts`                                                                    | Editable category labels, sample testimonials, FAQ and policy copy                                               |
| `src/lib/analytics.ts`                                                                        | Anonymous event recording, session IDs, storage fallback and provider adapters                                   |
| `src/lib/submissions.ts`                                                                      | Legacy local test storage; no longer used by booking forms                                                        |
| `src/app/api/bookings/route.ts`                                                               | Validates bookings and sends email with reference attachments through Gmail                                      |
| `src/lib/booking.ts`, `src/lib/booking-email.ts`                                               | Shared booking rules, Vietnam calendar dates and structured email format                                         |
| `src/data/studio.ts`, `src/components/booking-notice.tsx`                                       | Studio contacts and persistent booking notice                                                                    |
| `public/images/artworks/`                                                                     | Optimized WebP copies of the supplied artwork and product photographs                                            |
| `Picture/`                                                                                    | Preserved original source images supplied by the studio                                                          |
| `public/images/`                                                                              | Local studio illustration assets and their generation prompts                                                    |
| `public/icon.svg`                                                                             | DART favicon                                                                                                     |
| `package.json`, `package-lock.json`                                                           | Commands and locked dependencies                                                                                 |
| `tsconfig.json`, `next-env.d.ts`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs` | Framework, TypeScript, Tailwind and lint configuration                                                           |
| `.env.example`, `.gitignore`                                                                  | Example public site URL and generated-file exclusions                                                            |
| `AGENTS.md`, `CLAUDE.md`                                                                      | Guidance automatically generated by this version of Next.js                                                      |

## Edit artworks and images

Edit `src/data/artworks.ts`; the hero, gallery, search, detail view and purchase inquiry consume this shared catalog. It contains 20 records: `c1`–`c8`, `p1`, `p2`, `p3`, `p5`, `p7`, `p8`, `cc1`, `cc2`, Akaza, Raiden, one custom shoe product and one custom golf product.

`heroArtworkIds` selects `akaza`, `raiden`, `p7` and `p8`, in that order. These four records are excluded from the main collection, which displays all 16 remaining works with category filtering. Search covers the full 20-record catalog, including the hero works. Categories are **Chân dung**, **Character Illustration**, **Phong cảnh**, **Thú cưng** and **Custom Concept**. Phong cảnh currently has no supplied artwork, so its filter shows an empty state.

The hero crossfades automatically every six seconds. Visitors can select a work, move backward/forward, use the keyboard arrow keys, and pause/resume playback. Automatic playback pauses while hovered, focused, a dialog is open, or the browser tab is hidden. Reduced-motion preferences disable automatic playback initially; visitors can explicitly enable it.

Each artwork record defines `id`, `slug`, `title`, `artist`, `price` (numeric VND or `null`), `category`, `medium`, `dimensions`, `description`, `image`, `available` and `status`. Optional `images` holds the full image set for a product detail view. The shoe product has five photographs and the golf product has two, each shown as selectable thumbnails. Dimensions were not supplied; the interface identifies them as unknown instead of inventing measurements.

Keep `status`, `available` and `price` consistent:

- `cc1` is available at **79,000 VND** and `cc2` at **49,000 VND**. These are the only works currently accepting purchase inquiries.
- All `c`/`p` works and both custom products are marked `delivered`. The custom shoe price is **249,000 VND** and the golf product price is **349,000 VND**. Their detail CTA opens a new commission request.
- Akaza and Raiden have `price: null`, `status: "inquiry"` and `available: false`. They show “Liên hệ báo giá”; purchase inquiries are intentionally disabled for these two works.

Supplied original artwork and product photographs remain in `Picture/`. Optimized WebP copies are served from `public/images/artworks/`; changing web assets does not alter the originals. To add or replace an image, save an optimized copy in that folder and update `image` and, when relevant, `images` in the data record. These are studio-supplied source images; no third-party artwork citation fields or attribution metadata are required. Gallery, hero and main detail images use `object-contain` to preserve the complete composition. Next.js supplies responsive image optimization and lazy loading, with priority given to the first hero image; fixed image containers reserve layout space.

The studio illustrations `/images/dart-studio.webp` and `/images/dart-process.webp` remain separate from the actual catalog photographs. They are original AI-generated illustrative assets, with prompts and original paths recorded in `public/images/GENERATED.md`. Update their alt text and captions when replacing them with studio photographs.

## Conversion tracking

```ts
trackEvent("click_commission", { source: "hero" });
trackEvent("click_artwork", { source: "gallery", artworkId: artwork.id });
```

Events: `page_view`, `click_view_artworks`, `click_artwork`, `click_buy_artwork`, `click_commission`, `commission_form_start`, `commission_form_submit`, `click_contact`, `click_instagram`, `purchase_form_start`, `purchase_form_submit`.

Sources distinguish `hero`, `navigation`, `commission_section`, `artwork_detail`, `gallery`, `search`, `contact`, `about`, `faq`, `studio`, `studio_gallery`, `final_cta`, `cart`, `footer`, `footer_email` and `zalo_floating` where applicable. A form start fires on the first change, once per attempt. Submit events fire only after the server reports SMTP acceptance. Events are logged to the console in development.

The latest **500** events live under localStorage key `dart:analytics:v1`. A per-tab session identifier lives in sessionStorage at `dart:session:v1` and survives refresh. A new tab/session is not a unique person. Failed storage writes fall back to memory without blocking interactions. This is a local test instrument, not an aggregate audience report.

Dashboard counts show raw clicks/submissions; rates use distinct session intersections:

- Artwork CTR = sessions with a page view and artwork detail click / page-view sessions.
- Commission CTA CTR = sessions with a page view and commission click / page-view sessions.
- Form Start Rate = sessions with a commission click and form start / commission-click sessions.
- Form Completion Rate = sessions with a form start and submit / form-start sessions.

Rates cannot exceed 100% from repeated clicks. They indicate co-occurring session events, not strict timestamp-ordered funnel attribution. The 500-event retention limit can truncate earlier steps. An empty denominator displays “—”.

Register an external provider once at the client boundary with `addAnalyticsAdapter((event) => { /* send to GA4, Meta or your endpoint */ })`. The function returns an unregister callback. Components need no changes. The adapter receives only the allowlisted metadata (`source`, `artworkId`, `medium`, `price`); never pass customer form contents. Load any provider SDK and consent handling separately when ready.

## Gmail booking setup

The recipient is fixed to **dartspacestudio@gmail.com**. Both forms POST multipart data to `/api/bookings`. The API validates the form, confirms purchase availability from the catalog and sends a structured Vietnamese **PHIẾU BOOK TRANH** email. It includes a request ID, contact details, artwork/category, size, budget or catalog price, requested delivery date, idea/message and the optional image attachment. Reply-To points to the customer; recipient and prices cannot be overridden by form fields.

To enable actual sending:

1. Sign in to the studio's Google account and enable [2-Step Verification](https://myaccount.google.com/signinoptions/two-step-verification).
2. Create an [App Password](https://myaccount.google.com/apppasswords) named `DART website`. [Google's instructions](https://support.google.com/accounts/answer/185833) explain eligibility and accounts where this option is unavailable.
3. In `.env.local`, set `GMAIL_USER=dartspacestudio@gmail.com` and fill `GMAIL_APP_PASSWORD=` with that generated code. Use an App Password, not the normal account password. Never put it in `NEXT_PUBLIC_*` variables or commit it.
4. Restart the development server. On deployment, configure these same server-only environment variables on the host.

Until configured, sending returns a truthful error and offers Zalo; the page never pretends a request was sent. SMTP acceptance does not guarantee inbox placement: verify Gmail receipt after setup. No real email was sent during automated tests; the mail transport is mocked.

Rules apply in the browser and API: A3/A4 only; desired delivery at least seven calendar days after today in `Asia/Ho_Chi_Minh`; Custom Concept requires an idea of at least ten characters and a reference image. Other categories allow both fields to be omitted. JPG, PNG and WebP attachments are limited to 5 MB; the API checks binary type signatures against the declared MIME type, with a 6 MB cap on the full request. Files are attached from memory, not saved to public storage. The advisory recommends ordering a month ahead and remains at the top of the booking dialog while scrolling; customers can collapse it on small screens.

New requests are not stored in localStorage. The old `dart.submissions.v1` test data, if present, can be removed through browser site settings. Analytics remain anonymous and browser-local. Failed email attempts preserve form inputs. The API includes a same-origin check and a bounded in-memory per-email throttle; use shared rate limiting and abuse controls for a public, multi-instance deployment.

The Facebook page is pending. Set `NEXT_PUBLIC_STUDIO_PAGE_URL` when supplied, then restart/rebuild. Zalo is already linked in the booking notice and error state.

Run `npm test` for booking rule, email format, attachment and API failure-path tests without sending email.

## Before publishing publicly

1. Review the integrated DART catalog, confirm measurements and materials, and keep prices and availability current. Supply the missing dimensions and confirm a price before enabling purchase inquiries for Akaza or Raiden.
2. Replace sample reviews with permissioned real reviews, or remove that section. Replace/verify brand story and studio imagery.
3. Studio email is `dartspacestudio@gmail.com`; the fixed Zalo button links to `https://zalo.me/0963549673`. Configure Gmail sending as above and supply the remaining social URLs. The Facebook page is pending.
4. Confirm commission timing, revisions, shipping, return and ordering terms in `src/data/site-content.ts`.
5. Set `NEXT_PUBLIC_SITE_URL` to the actual HTTPS origin before the production build; review metadata in `layout.tsx`. Open Graph title/description are included; there is no fabricated social card.
6. Configure Gmail credentials, verify a real booking reaches the inbox, and confirm hosting upload/time limits cover the 5 MB attachment limit. Set up shared throttling and monitoring appropriate for public traffic. The email request is an inquiry; staff confirm stock, size, price and delivery separately.
7. Connect an analytics provider if you need cross-browser conversion results. Configure appropriate privacy/consent behavior for the audience.
8. Keep `/analytics` development-only. Run lint, typecheck, build and a production smoke check after changing content.

No public deployment was performed. The project is ready to run locally and to extend with commerce services once the conversion test supports that investment.

## Validation

See `QA.md` for checks performed, observed behavior, and scope limits.
