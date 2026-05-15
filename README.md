# RUST24

RUST24 is a production-grade Rust game server website project. The current implementation includes Stages 1-15 plus a full codebase audit and stabilization pass.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- next-intl
- Prisma
- PostgreSQL
- Redis
- shadcn/ui-ready component structure
- npm

## Setup

```bash
npm install
```

## Commands

```bash
npm run dev
npm run build
npm run lint
npm run typecheck
npm run test
npm run test:e2e
npm run db:generate
npm run db:migrate
npm run db:deploy
npm run db:seed
npm run db:studio
```

## Current Stage

Stage 15 production deployment preparation and SEO audit, followed by a stabilization audit.

This stage intentionally does not include real payment providers, real money processing, paid order states, RCON commands, live store fulfillment, or product delivery side effects.

## Public UI Polish

The public website has been visually upgraded with a dark cinematic Rust-inspired interface:

- tactical amber/orange accent system
- reusable surface cards, badges, CTA links, stat cards, and page heroes
- sticky translucent header and stronger footer
- polished public pages, store/product views, cart, checkout placeholders, and private profile states
- CSS-only grid/noise/radial background effects
- mobile-first responsive spacing and visible focus states

This visual pass did not change backend logic, Prisma schema, migrations, authentication, cart/order APIs, payment abstraction, admin CRUD behavior, sitemap, robots, or Product JSON-LD.

## Audit And Stabilization

The latest audit notes live in:

- `docs/audit.md`

The stabilization pass checked server/client boundaries, SEO safety, private route indexing, auth/cart/payment/delivery guardrails, fallback rendering without PostgreSQL/Redis, and local build/test tooling.

Local development and Playwright use `scripts/next-wasm.mjs`, which forces Next's Webpack/WASM path in environments where native Next bindings cannot be loaded. Production deployments should still be verified on the target host.

## Production Deployment

Deployment docs live in:

- `docs/deployment.md`
- `docs/production-checklist.md`
- `docs/seo-audit.md`

Production migration command:

```bash
npm run db:deploy
```

Use `npm run db:migrate` for local development and `npm run db:deploy` for production. Demo seed data is local/demo-only and should not be run blindly against production.

Health endpoints:

- `GET /api/health/live` - liveness, returns `200` when the app process is alive.
- `GET /api/health` - safe app/dependency summary.
- `GET /api/health/ready` - readiness, returns `503` when critical dependencies are unavailable.

The default Open Graph image is a static SVG at `/images/og/default-og.svg`.

## Static Content

- Public pages call repository functions from `lib/repositories/`.
- Repository functions use Prisma when the database is available.
- If the database is unavailable during local development or build, repositories fall back to typed mock data from `data/`.
- Shared content types live in `types/content.ts`.
- Localized display helpers live in `lib/localized.ts`.
- Game modes remain static because Stage 4 did not introduce a `GameMode` database model.
- Store category pages live at `/{locale}/store/{category}`.
- Product detail pages live at `/{locale}/store/{category}/{product}`.
- Real payment processing, real provider webhooks, and product delivery are deferred to later stages.
- Cart writes require PostgreSQL because prices are always read server-side from the product table.
- Guest carts use the signed HTTP-only `rust24_cart` cookie, which stores an opaque session id rather than cart contents.
- Checkout is a placeholder that can create a draft order for authenticated users only; it does not start payment.

## Authentication

- Steam login starts at `/api/auth/steam`.
- Steam callback is handled by `/api/auth/steam/callback`.
- Logout is handled by `/api/auth/logout`.
- Session status is available at `/api/auth/session`.
- Sessions use a signed HTTP-only `rust24_session` cookie.
- Private profile pages live under `/{locale}/profile`, `/{locale}/profile/orders`, and `/{locale}/profile/settings`.
- Profile pages use noindex/nofollow metadata and are excluded from the sitemap.

Required auth environment variables:

```bash
STEAM_API_KEY=""
STEAM_REALM="http://localhost:3000"
STEAM_RETURN_URL="http://localhost:3000/api/auth/steam/callback"
AUTH_SESSION_SECRET="replace-with-long-random-secret"
```

The Steam OpenID callback verifies the OpenID response with Steam before creating a session. If `STEAM_API_KEY` is missing, the login can still use the verified SteamID with a persona fallback; if PostgreSQL is unavailable, callback login fails gracefully and public pages continue to render.

Local smoke test:

```bash
npm run dev
open http://localhost:3000/api/auth/steam?locale=ru
```

## Cart And Checkout

- Cart page: `/{locale}/cart`.
- Checkout placeholder: `/{locale}/checkout`.
- Placeholder result routes: `/{locale}/checkout/success` and `/{locale}/checkout/cancel`.
- API routes:
  - `GET /api/cart`
  - `DELETE /api/cart`
  - `POST /api/cart/items`
  - `PATCH /api/cart/items/{itemId}`
  - `DELETE /api/cart/items/{itemId}`
  - `POST /api/orders`
- Cart and checkout pages use noindex/nofollow metadata and are excluded from the sitemap.

Local DB flow for cart testing:

```bash
docker compose up -d postgres
npm run db:migrate -- --name cart_order_skeleton
npm run db:seed
npm run dev
```

Without PostgreSQL, cart reads render an empty/unavailable state and cart writes return `503`.

## Payment Abstraction

- Payment provider selection uses `PAYMENT_PROVIDER`.
- Default provider is `disabled`.
- Allowed provider values for Stage 9 are `disabled` and `mock`.
- Mock provider is dev-only and can only create `CHECKOUT_PENDING` sessions.
- No code path marks orders as paid.
- Mock webhook can move payments only to `FAILED`, `CANCELLED`, or `EXPIRED`.
- Checkout session POST requires authentication and an `Idempotency-Key` header.
- Webhook handlers require signature verification, including the mock webhook.

Payment API routes:

- `POST /api/payments/checkout-session`
- `GET /api/payments/{paymentId}`
- `POST /api/payments/webhook/mock`

Required payment environment variables:

```bash
PAYMENT_PROVIDER="disabled"
MOCK_PAYMENT_WEBHOOK_SECRET="replace-with-dev-only-secret"
```

Disabled provider smoke test:

```bash
curl -X POST http://localhost:3000/api/payments/checkout-session \
  -H "content-type: application/json" \
  -H "Idempotency-Key: dev-checkout-1" \
  -d '{"orderId":"order_id","locale":"ru","returnUrl":"/ru/checkout"}'
```

Enable mock provider locally:

```bash
PAYMENT_PROVIDER="mock"
MOCK_PAYMENT_WEBHOOK_SECRET="dev-secret"
```

Mock checkout URLs are clearly labeled as non-production and never simulate successful payment.

## Live Server Status

- Redis is optional and never required for build.
- Status lookup falls back in this order: Redis cache, latest Prisma `ServerStatusSnapshot`, typed mock server data.
- Every public status response exposes its source as `redis`, `database`, or `mock`.
- Stage 10 does not implement the Rust game protocol, RCON, or production live polling against real game servers.
- The `/ru/servers` page uses a small client polling component that preserves server-rendered initial content and refreshes from the public API.

Status API routes:

- `GET /api/public/servers/status`
- `GET /api/public/servers/status/{slug}`

Redis and status environment variables:

```bash
REDIS_URL="redis://localhost:6379"
SERVER_STATUS_CACHE_TTL_SECONDS="30"
SERVER_STATUS_REFRESH_INTERVAL_SECONDS="30"
PUBLIC_SERVER_STATUS_POLL_INTERVAL_MS="30000"
```

Optional Redis helper:

```bash
docker compose up -d redis
```

Run the full local infrastructure:

```bash
docker compose up -d
npm run db:migrate
npm run db:seed
npm run dev
```

## Admin MVP

- Admin routes live under `/admin`.
- Admin access is enforced server-side through `lib/admin/require-admin.ts`.
- `ADMIN` and `OWNER` roles can access the Admin MVP.
- Regular `USER` accounts are denied.
- Admin pages use noindex/nofollow metadata and are excluded from the sitemap.
- Admin repositories live under `lib/admin/repositories/` and use Prisma on the server.
- If PostgreSQL is unavailable, admin pages render a clear unavailable/empty state instead of using public mock fallback data.
- Stage 11 admin tables are view-only. There are no manual paid, delivery, RCON, or real provider actions.

Admin routes:

- `/admin`
- `/admin/servers`
- `/admin/products`
- `/admin/orders`
- `/admin/payments`
- `/admin/bans`
- `/admin/faq`
- `/admin/rules`
- `/admin/money-race`
- `/admin/support`
- `/admin/audit-log`

To promote a local user after Steam login, open Prisma Studio:

```bash
npm run db:studio
```

Then update the `User.role` field to `ADMIN` or `OWNER`.

## Delivery Queue Skeleton

- Delivery queue models live in Prisma as `DeliveryJob` and `DeliveryJobAttempt`.
- Admin delivery viewer lives at `/admin/delivery`.
- Optional detail view lives at `/admin/delivery/{jobId}`.
- Admin-only delivery API routes live under `/api/admin/delivery/jobs`.
- Delivery jobs are not public and are not included in the sitemap.
- Delivery actions are skeleton-only: retry, cancel, and dry-run require admin access.
- Dry-run records a `SKIPPED` attempt and does not send RCON, grant items, or mark delivery completed.
- Mock payments do not create delivery jobs.
- Delivery creation is not wired to checkout, mock webhooks, or payment abstraction until a future real payment success stage.

Delivery API routes:

- `GET /api/admin/delivery/jobs`
- `GET /api/admin/delivery/jobs/{jobId}`
- `POST /api/admin/delivery/jobs/{jobId}/retry`
- `POST /api/admin/delivery/jobs/{jobId}/cancel`
- `POST /api/admin/delivery/jobs/{jobId}/dry-run`

Future real payment confirmation can call `createDeliveryJobsForOrder(orderId, trigger)`, but Stage 12 intentionally does not connect it to mock payment flows.

## Admin CRUD MVP

- Admin writes use server actions, server-side RBAC, zod validation, and audit logs.
- DB access is required for admin writes; public repository fallback remains unchanged for public pages.
- Soft actions are preferred: active/inactive, publish/unpublish, feature/unfeature, archive.
- No bulk destructive operations are implemented.
- No admin action can mark payments paid, deliver products, or execute RCON.

CRUD areas currently implemented:

- servers
- product categories
- products with RU/EN translations
- FAQ categories and articles
- rule sections and rule items
- ban records
- support channels

## Testing And Hardening

Stage 14 added Node test-runner unit coverage, Playwright public smoke tests, security headers, same-origin checks for browser mutations, and Redis-backed rate limit integration on sensitive routes.

Test commands:

```bash
npm run test
npm run test:watch
npm run test:e2e
npm run test:e2e:ui
```

The e2e suite is designed to run against fallback public data and does not require PostgreSQL or Redis. Playwright browsers still need to be installed locally before `npm run test:e2e` can launch Chromium.

Security headers are configured in `next.config.mjs`:

- `X-Frame-Options`
- `X-Content-Type-Options`
- `Referrer-Policy`
- `Permissions-Policy`
- production-only `Strict-Transport-Security`
- production-only baseline Content Security Policy

State-changing browser API routes use same-origin checks from `lib/security/origin.ts`. Webhooks do not use origin checks because they rely on provider signatures. Rate limiting is applied through `lib/security/rate-limit.ts`; if Redis is unavailable, requests are allowed with fallback metadata so local development and builds do not fail.

Shared API response helpers live in `lib/api/responses.ts`, and the production checklist lives in `docs/production-checklist.md`.

Production checklist highlights:

- public SEO metadata and sitemap remain centralized
- private routes stay noindex and out of sitemap
- Product JSON-LD is only on product detail pages
- payment providers are disabled by default
- mock payments never create paid orders
- delivery dry-runs never send RCON or grant products
- Money Race seasons

Money Race leaderboard entry editing remains deferred; season CRUD is implemented with a one-active-season guard.

## Database

Set the local database URL in `.env`:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/rust24?schema=public"
```

Optional local PostgreSQL helper:

```bash
docker compose up -d postgres
```

Prisma workflow:

```bash
npm run db:generate
npm run db:migrate -- --name init
npm run db:deploy
npm run db:seed
npm run db:studio
```

Prisma Client is generated with the binary query engine so local seed/runtime checks avoid native library loading issues in restricted macOS environments.

The initial schema is in `prisma/schema.prisma`, the generated migration is under `prisma/migrations/`, and the seed script is `prisma/seed.ts`.

Run with local PostgreSQL-backed content:

```bash
docker compose up -d postgres
npm run db:migrate -- --name init
npm run db:seed
npm run dev
```

## SEO Architecture

- Public routes are registered in `config/routes.ts`.
- Page metadata is generated through `lib/seo.ts`.
- Metadata includes canonical URLs, RU/EN/x-default hreflang alternates, Open Graph, Twitter cards, and robots directives.
- `createNoIndexMetadata` is available for future private pages such as profile, cart, checkout, and admin pages.
- `app/sitemap.ts` is generated from the public route registry for both `ru` and `en`.
- The sitemap also includes public store category and product detail URLs generated from typed mock store data so builds do not require PostgreSQL.
- `app/robots.ts` allows public pages and disallows private/API areas.
- JSON-LD helpers live in `lib/structured-data.ts`.
- Product JSON-LD is added only on product detail pages and only uses visible, truthful product and offer data.

FAQPage and Event structured data are intentionally deferred until real page content exists. Product reviews and ratings must not be added until real review data exists.
