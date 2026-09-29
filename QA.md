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

## Cloudflare Worker name correction — 2026-09-29

- The local repository initially had no Wrangler/OpenNext configuration. Added committed configuration with `name: "dart"` and `WORKER_SELF_REFERENCE.service: "dart"`; aligned the package name so future generated defaults match.
- Installed `@opennextjs/cloudflare` 1.20.7 and Wrangler 4.143.0, recorded in the lockfile. Added Cloudflare build/preview/deploy scripts, static asset cache headers and generated-file exclusions. No R2 bucket or other cloud resource was created.
- `npm run build:cloudflare` passed on Windows and produced `.open-next/worker.js`. OpenNext emitted its usual Windows compatibility warning, but this build completed successfully.
- `wrangler deploy --dry-run` passed: 69 assets detected, Worker bundle 5,266.41 KiB (gzip 1,103.25 KiB), and bindings explicitly reported `WORKER_SELF_REFERENCE (dart)`, `IMAGES` and `ASSETS`. This was a local packaging check, not a remote deployment or verification of account-specific settings.
- ESLint, TypeScript, all 16 booking tests and `git diff --check` passed. `.env.local` remains ignored and untracked; no `.env` files were present in the generated OpenNext output.
- `npm audit` reports four moderate toolchain advisories through OpenNext/Wrangler/Miniflare/Undici, no high or critical issues. npm's suggested remediation downgrades the adapter/CLI to versions outside the installed adapter's Wrangler peer requirement, so no forced downgrade was applied as part of this name fix.
- No Git push or Cloudflare release was performed. Workers Builds should use `npm run build:cloudflare` for build and `npx opennextjs-cloudflare deploy` for deployment, targeting Worker `dart`.

## Local availability repair — 2026-09-29

- Reproduced connection refusal at `127.0.0.1:3000`; there was no server listening and no running Next process. No application render failure was needed to explain the unavailable local page.
- Added `scripts/start-local.mjs` and `npm run local`; updated `start-dart.cmd` to launch a detached, hidden Node server with logs in ignored `.local/server.log`. The launcher checks the actual DART home page before reporting Ready, reuses an existing healthy server, and refuses to replace an unrelated service on the same port.
- Started successfully from `D:\` (outside the project), allowed the launcher process to exit, and confirmed the server remained reachable in subsequent commands. A second launch reused the same running server.
- Local HTTP verification: home 200, 27 artwork/studio images present, 67 asset/route requests successful with no failures; invalid booking data returned the expected 400. ESLint, script syntax and all 16 booking tests passed.
- Started the previously built OpenNext Worker in local Wrangler preview on port 8787: self-binding `dart` connected; home/static image/optimized image returned 200, production analytics returned 404, and invalid booking returned 400. Stopped this temporary preview afterward and left the main background server on port 3000 running.
- Updated run instructions: the background launcher window can close safely; Windows restart still requires launching again. No Windows startup service or public deployment was added. An external Cloudflare URL was not supplied, so this pass does not verify the live hosted deployment.

## Follow-up availability diagnosis — 2026-09-29, 21:45 local time

- The previously detached server had exited between sessions: no Next process and no listener on 3000; the HTTP client received connection refused. Windows had not restarted. The final server log entries were successful 200 responses, with no application exception; no matching Node crash event was found in the recent Application log. The cause of process termination is not established.
- The earlier successful checks only established availability during that session, not continued availability after it. Documentation now states that limitation and gives a foreground command to run in the user's own PowerShell window.
- A new hidden `Start-Process` launch was rejected by the tool's automatic policy review with no detailed reason. A regular foreground terminal launch succeeded; home, artwork and analytics HTTP checks returned 200. This does not establish persistence after the current agent session.

## Studio content and booking update — 2026-09-30

- Read `giá.xlsx` Sheet1 A1:C31: 9 priced artwork rows, custom-product note, 3 timing options, 12 additional charges, and shipping information. Preserved A5/A4 values and percentage surcharges; no fabricated price for blank/dash cells. User confirmed switching booking sizes to A5/A4. Historical portfolio prices remain unchanged.
- Added the supplied Facebook URL, mandatory delivery address in both booking forms/API/email, and free-shipping information for Quận 10, Quận 11 and Tân Bình. Removed generated image files from public storage and reused supplied artwork photos. Removed sample testimonials and unfinished legal/returns dialogs; kept ordering and shipping information.
- Added 1–5 star private feedback sent to the studio through `/api/reviews`. Feedback is not auto-published and no public reviews/database are fabricated. SMTP failure retains client inputs. No real email was sent during testing.
- All 21 automated tests passed, including booking address validation/email content and review input validation, bounded request bodies, recipient control, throttling and missing-credentials/SMTP-error paths. ESLint and TypeScript passed. `npm run build:cloudflare` completed and generated the Worker with both email routes.
- Headless Edge checks at 1440, 390 and 320 px passed: correct pricing and Facebook links, no generated images in DOM, both address fields, only A5/A4, conditional Custom Concept requirements, review failure preservation/success, no horizontal overflow, reduced-motion behavior and no page errors. Inspected pricing, reviews and booking screenshots in ignored `qa-results/`.
- Local `.env.local` still has no configured Gmail App Password. Real booking/review delivery remains dependent on Gmail configuration and inbox verification. No Git push or Cloudflare deployment performed.

## Gmail connection investigation — 2026-09-30

- Public home at `https://dart.dartstudio.workers.dev/` returned 200 with the updated pricing/review section; GET requests to both POST-only email endpoints returned expected 405 responses. No real booking/review was submitted during this investigation.
- A credential-free SMTP `verify()` against Gmail succeeded on Node. The same default Nodemailer transport in local Wrangler/workerd failed before authentication with `ESOCKET`, command `CONN`, message `proxy request failed, cannot connect to the specified address`.
- Supplying a verified TLS socket opened by hostname (`smtp.gmail.com:465`, explicit SNI) succeeded in the same local workerd environment. Repeated that connection check using the actual shared `getGmailSocket` implementation. Probes send no AUTH, MAIL FROM, RCPT TO or DATA, and do not access Gmail credentials.
- Applied the shared connection helper to both email endpoints; added bounded TLS timeout, socket cleanup, safe failure categories/reference IDs, and allowlisted diagnostic logging. All 25 tests passed, including hostname/SNI/certificate settings, TLS error/timeout cleanup, and exclusion of secret/customer data from logs. Lint, TypeScript and the OpenNext Cloudflare build passed.
- Production runtime logs are unavailable because Wrangler is not authenticated. This reproduces and fixes a connection failure locally; it does not yet prove the exact cause of the reported production request or real Gmail inbox delivery. Existing Worker secrets must still authenticate successfully after deployment.

## General verification limits

This MVP now includes a server email endpoint; analytics remain browser-local. Tests use synthetic example.test contacts and a mocked mail transport. No real orders, payments or external email deliveries occurred during verification. The initial responsive inspection used Chromium viewport emulation, not physical devices or Safari/Firefox. Native semantic controls and reduced-motion styles are implemented; no claim of full accessibility certification or a measured Lighthouse score is made.
