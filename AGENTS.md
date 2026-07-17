# AGENTS.md

Vue 3 + TypeScript + Vite funnel for Scarlett Cordova's one-time digital offer, “Quema Grasa, Construye Músculo.”

## Tooling

- Use `pnpm`; `.npmrc` requires the hoisted linker and `pnpm-lock.yaml` is authoritative.
- `pnpm dev` starts Vite, `pnpm preview` serves the bundle, and `pnpm build` runs `vue-tsc -b` before `vite build`.
- Use `pnpm exec vue-tsc -b` for typecheck-only verification. There is no lint, formatter, test, CI, or pre-commit setup.
- TypeScript rejects unused locals and parameters, so they fail the build.

## Structure And Styling

- Keep `src/views/HomeView.vue` composition-only; rendered funnel sections belong in `src/components/funnel/`. Keep source files below 400 lines.
- Structural layouts use flex and `width: 100%`; do not introduce CSS Grid.
- `@` resolves to `src`. Vite injects `@use "@/styles/index.scss" as *;` into every SCSS block.
- `src/styles/index.scss` defines project-local `lighten()` and `darken()` wrappers; account for them before changing Sass color math.
- Scarlett photography is served from Cloudinary folder `scarlett/quema-grasa-construye-musculo`; keep delivery URLs centralized in `src/config/funnelContent.ts` and never commit Cloudinary credentials.
- Routing uses HTML5 history; preserve `public/_redirects` so `/pay-response` loads directly after PayPhone redirects.

## PayPhone Checkout

- API routing is hostname-based: local uses `http://localhost:8101`, `testing-storybrand-frontend.bakano.ec` uses `testing-storybrand-backapp.bakano.ec`, and production uses `VITE_API_BASE_URL` or same-origin when unset.
- New API services should extend `APIBase`; it appends `/api`, applies a 15-second timeout, sends `localStorage.access_token`, and normalizes failures as `{ status, message, data }`.
- Checkout calls `POST /api/payments/ebook/prepare-box` with identity, `origin`, and extras `recipe_book`/`whatsapp_vip`. It sends no amounts; the academy backend owns `$33 + $10 + $15` pricing.
- PayPhone returns to `/pay-response?id=...&clientTransactionId=...`. Confirm immediately through `POST /api/payments/ebook/confirm`; PayPhone automatically reverses payments not confirmed within five minutes.
- `PaymentResult.vue` caches only approved results and deduplicates Purchase by `clientTransactionId`. Browser and backend Purchase events share `purchase_<clientTransactionId>` for Meta deduplication.
- The coordinated backend is `../../academy/scarlett-academy-backapp`. Its ebook flow is intentionally separate from legacy monthly/annual academy payments and does not grant academy access yet.
