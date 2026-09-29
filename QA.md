# DART MVP verification

Initial browser validation: 2026-09-28 in Codex Chromium on Windows. Later changes and their verification scope are recorded separately below; the Gmail flow replaces the original local-only submission behavior.

## Completed checks

- Dependency installation: successful; npm audit reported zero vulnerabilities.
- ESLint, TypeScript and Next.js production build: passed.
- Production HTTP smoke test: `/` returns 200; `/analytics` returns 404.
- Responsive widths: 375, 390, 430, 768, 1024 and 1440 CSS pixels. No horizontal document overflow; images loaded successfully.
- Mobile hero and desktop hero visually inspected. Mobile commission form fits the dialog without horizontal overflow.
- Final supplied catalog: 20 records; Akaza, Raiden, p7 and p8 rotate in the hero; the remaining 16 works display in the collection.
- All 20 prices/statuses and all local image paths checked against the supplied inventory. cc1/cc2 accept inquiries; Akaza/Raiden do not expose a purchase button; all c/p works and both custom products are delivered.
- Filters verified: Chân dung 4, Character Illustration 7, Phong cảnh 0 with an empty state, Thú cưng 1, Custom Concept 4. All filters together show 16 works.
- Hero previous/next/select controls and all four slides verified. Explicit autoplay resumes while its control retains focus and advances after the six-second interval.
- Shoe detail has five selectable photographs and displays 249,000 VND; golf has two and displays 349,000 VND. Thumbnail selection changes the main image.
- Character titles and descriptions updated: c4 Diona, c6 Hayate, c7 Frieren, c8 Sucrose.
- Search finds a known artwork and displays a useful no-results state for an unmatched query.
- Artwork details display price, medium, dimensions and availability. Unavailable work offers a commission action instead of purchasing.
- Purchase flow rejects invalid phone input and records a valid local inquiry; commission rejects missing required fields and records a complete local inquiry.
- Success states explicitly say requests are saved on the device, not delivered to DART.
- Reference file picker selects a local WebP, displays its preview and filename, removes it, rejects an unsupported Markdown file and allows dismissing that error.
- Mobile navigation, Escape focus restoration, dialog close/focus restoration, empty cart exploration and body scroll restoration checked.
- Contact placeholder, Instagram/Facebook/TikTok placeholder dialogs, four footer policies and all five FAQ accordions checked.
- All page anchor targets exist. No broken loaded images.
- Analytics dashboard reflects page views, artwork clicks, commission clicks, form start/submit, purchase interaction and contact actions from browser testing. Session rates calculate correctly and remain at or below 100%.
- Analytics module regression harness: session continuity, allowed metadata only, bounded history, malformed storage, blocked storage, existing persisted history followed by blocked writes, subscriber refresh, retry recovery, cross-tab clear and provider exception isolation.

## Relocation to D:\Dart — 2026-09-29

- The old project folder on C: no longer exists. No development server was listening on port 3000 when checked, which explained the connection failure.
- Restarted Next.js from `D:\Dart`; both `/` and development `/analytics` returned HTTP 200.
- ESLint, TypeScript and production build passed in the new folder. Rebuilt production metadata now resolves `appDir` and `outputFileTracingRoot` to `D:\Dart`.
- HTTP verification passed for all 27 referenced images, 16 page bundles/fonts/styles, four optimized hero images and the favicon (48 non-empty successful responses).
- Production smoke check on temporary port 3001: `/` returned 200; `/analytics` returned the expected 404. Stopped that test server afterward.
- Preserved the floating Zalo link to `https://zalo.me/0963549673`; it is present in the rendered home page. No Zalo message was sent.
- Added `start-dart.cmd`, which starts from its own directory and keeps port 3000 explicit; verified it from outside the project (`D:\`), reached Ready and received HTTP 200. Documented the new Windows run commands. This pass used HTTP and source checks, not a new visual browser inspection.

## Gmail booking update — 2026-09-29

- Studio email updated to `dartspacestudio@gmail.com` in the footer, contact dialog and booking forms. Facebook remains pending; Zalo is the direct contact route.
- Added server-side Gmail delivery and a structured Vietnamese booking email with actual reference attachments. New bookings no longer call local test storage.
- `npm test`: 16 checks passed, covering Vietnam calendar boundaries, the seven-day minimum, A3/A4, conditional Custom Concept requirements, optional fields in other categories, file size/type, email content, catalog-derived prices/availability, mocked attachments/sending, throttling, invalid origin and failure states.
- ESLint, TypeScript and production build passed. `/api/bookings` is a dynamic Node.js route.
- Live HTTP checks: home and artwork assets returned 200; invalid form returned 400; a valid request without Gmail credentials returned 503 with a Zalo fallback and no false confirmation.
- Regression: Next's internally normalized localhost URL now uses the incoming Host header for origin comparison, so submitting from `127.0.0.1:3000` works.
- Booking notices sit inside the sticky dialog heading on both purchase and commission forms. They can be collapsed and have a bounded scroll area on short viewports. This update was checked through source, unit/API tests and HTTP, not a new visual browser pass.
- **Activation pending:** `GMAIL_APP_PASSWORD` is empty. Gmail receipt has not been verified. All successful email tests used a mocked mail transport; no real email was sent. Studio must enable Google 2-Step Verification, generate an App Password, fill `.env.local` and restart the server.

## Scope

This MVP now includes a server email endpoint; analytics remain browser-local. Tests use synthetic example.test contacts and a mocked mail transport. No real orders, payments or external email deliveries occurred during verification. The initial responsive inspection used Chromium viewport emulation, not physical devices or Safari/Firefox. Native semantic controls and reduced-motion styles are implemented; no claim of full accessibility certification or a measured Lighthouse score is made.
