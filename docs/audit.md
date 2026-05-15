# RUST24 Codebase Audit

This document records the full codebase audit and stabilization pass after Stages 1-15.

## Scope Checked

- Next.js App Router routes, localized public pages, admin routes, API routes, and proxy routing.
- Centralized SEO helpers, sitemap, robots, JSON-LD, noindex private metadata, and Open Graph defaults.
- Server/client boundaries for Prisma, Redis, repositories, auth, cart, payment, delivery, and admin helpers.
- Prisma schema, migrations, seed script, enum usage, and no-real-payment/no-RCON safety boundaries.
- Auth cookies, cart cookies, safe redirects, origin checks, rate limits, webhook signature handling, and API errors.
- Public fallback behavior without PostgreSQL or Redis.
- Unit tests, Playwright smoke tests, build scripts, and local development startup behavior.

## Fixes Applied

- Removed duplicate generated files with ` 2` suffixes and `.DS_Store` artifacts.
- Regenerated Prisma Client after dependency restoration so public routes no longer fail on first render.
- Added server-only markers to the Prisma helper and pure service helpers that must never enter client bundles.
- Added focused tests for Product JSON-LD truthfulness and admin permission behavior.
- Added a Next WASM/Webpack wrapper script for the local Codex/macOS environment where native Next bindings are not loadable.
- Updated Playwright to use the same wrapper so e2e runs do not depend on native bindings.
- Converted the Next config to `next.config.mjs` to avoid native TypeScript config watcher loading in the local tool environment.
- Added root HTML/body tags for the admin route tree so `/admin` pages do not trigger Next root tag errors.
- Switched Prisma Client generation to the binary query engine to avoid macOS/Codex native `.dylib.node` loading failures during seed/runtime checks.

## Safety Boundaries Verified

- No code path introduces real payment providers, paid/succeeded payment state handling, or product delivery.
- Mock payments cannot mark orders paid and are not wired to delivery job creation.
- Delivery dry-runs do not execute RCON, grant products, or mark delivery as real fulfillment.
- Cart writes use server-side product and price lookup and require PostgreSQL.
- Public pages retain typed fallback data when PostgreSQL or Redis is unavailable.
- Admin and private routes remain excluded from sitemap and guarded by noindex metadata.

## Remaining Risks

- PostgreSQL-backed admin CRUD, cart writes, Steam user creation, and seed flows still require live local or staging database verification.
- Redis-backed cache behavior should be verified with a running Redis instance before production traffic.
- Admin server actions rely on server-side RBAC, validation, and audit logging; broad automated coverage for every form action is still limited.
- The local Next wrapper is an environment compatibility shim. Production deployments should still be tested on the target host with the normal Node runtime and native bindings.
- `npm run db:migrate` and `npm run db:seed` require `DATABASE_URL` from a local `.env` or deployment environment; `.env.example` contains the Docker Compose default.

## Before Real Payments

- Add a real provider only behind explicit payment-provider configuration.
- Add verified provider webhooks, idempotent success handling, and reconciliation tests.
- Introduce paid/succeeded states only together with provider verification and delivery eligibility tests.
- Keep mock provider disabled in production.

## Before RCON Delivery

- Add a dedicated RCON adapter with timeout, retry, audit, and command allow-listing.
- Prove delivery idempotency before sending game-server commands.
- Do not connect delivery execution to mock payment flows.
