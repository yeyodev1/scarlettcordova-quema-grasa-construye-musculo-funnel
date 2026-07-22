# AGENTS.md

Vue 3 + TypeScript + Vite funnel for Scarlett Cordova's one-time digital offer, “Quema Grasa, Construye Músculo.”

For the backapp API package (`*backapp/`), see `../../AGENTS.md`.

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
- Checkout calls `POST /api/payments/ebook/prepare-box` with identity, `origin`, and extras `recipe_book`. It sends no amounts; the academy backend owns `$33 + $10` pricing.
- Configure PayPhone Developer's fixed response URL as `https://testing-storybrand-backapp.bakano.ec/api/payments/ebook/return`. That endpoint confirms immediately, then redirects to the order's validated purchase origin; PayPhone automatically reverses payments not confirmed within five minutes.
- The backend derives PayPhone's callback from the validated browser origin, including local `:5173`, the shared testing frontend, and `scarlettcordova-quemagrasa-cons-musc.netlify.app`.
- PayPhone's Caja SDK does not accept a per-transaction `responseUrl`; the Developer application's fixed URL is authoritative. `PaymentResult.vue` retains a fallback that confirms first, then corrects cross-domain callbacks through the canonical `returnUrl`.
- `PaymentResult.vue` caches only approved results and deduplicates Purchase by `clientTransactionId`. Browser and backend Purchase events share `purchase_<clientTransactionId>` for Meta deduplication.
- The coordinated backend is `../../academy/scarlett-academy-backapp`. Its ebook flow is intentionally separate from legacy monthly/annual academy payments and does not grant academy access yet.
