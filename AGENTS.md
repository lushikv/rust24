# AGENTS.md

## Repository Conventions

- Use Next.js App Router with TypeScript.
- Keep routes under `app/[locale]` for localized public pages.
- Supported locales are `ru` and `en`; default locale is `ru`.
- Use `@/*` imports for project-local modules.
- Keep reusable UI in `components/`, configuration in `config/`, and shared helpers in `lib/`.
- Keep the project shadcn/ui-ready by preserving a clean component structure.
- Use centralized SEO helpers in `lib/seo.ts` for metadata.
- Keep public sitemap entries generated from `config/routes.ts`.
- Public pages should call repository functions from `lib/repositories/`.
- Keep typed mock data as repository fallback until deployment database availability is guaranteed.
- Store category and product detail pages must stay SEO-indexable and use repository data with fallback.
- Use Prisma schema and migrations for database changes.
- Keep authentication helpers server-only under `lib/auth/`.
- Keep payment helpers server-only under `lib/payments/`.
- Keep Redis and server status helpers server-only under `lib/redis.ts` and `lib/server-status/`.
- Keep admin permissions, guards, and repositories server-only under `lib/admin/`.

## Commands

Run these after meaningful changes:

```bash
npm run lint
npm run typecheck
npm run build
npm run db:generate
npm run test
```

Use `npm run dev` for local development.

## Stage Rules

- Do not implement future stages unless explicitly requested.
- Do not implement Steam authentication, payments, Redis, admin panels, real store logic, or server APIs unless the current stage explicitly requires it.
- Do not copy third-party assets, text, branding, layouts, or designs.
- Always run lint, typecheck, and build after meaningful changes.
- Do not create duplicated per-page metadata logic; add route data and translations, then use the SEO helper.
- Keep future private pages noindex/nofollow with metadata helpers.
- Do not rely on `robots.txt` as the only privacy or indexing control.
- Do not bypass typed mock data with ad hoc inline datasets before the data-fetching migration stage.
- Do not add real payment or authentication logic before the relevant stage.
- Do not edit `prisma/schema.prisma` without creating or updating a migration.
- Run `npm run db:generate` after Prisma schema changes.
- Keep `prisma/seed.ts` idempotent for local development.
- Do not import Prisma Client into client components.
- Client components must receive plain serializable props from server components.
- Do not remove `data/*.ts` mock files unless explicitly requested.
- Do not add Redis, live polling, payments, auth, or admin behavior before the scheduled stage.
- Product JSON-LD must only include visible and truthful product data.
- Do not add fake reviews, fake ratings, or payment availability claims.
- Do not add real payment behavior before the scheduled payment stage.
- Private pages must use centralized noindex metadata.
- Never fake successful Steam auth in production.
- Validate return paths and avoid open redirects.
- Do not expose auth secrets or raw session cookies to the client.
- Payment providers are prohibited before the payment stage.
- Cart writes must do server-side product and price lookup.
- Cart and checkout pages must stay noindex/nofollow.
- Do not add fake paid states or fake successful payments.
- Never trust client-submitted prices.
- All payment POSTs must use idempotency.
- Webhook handlers must verify signatures before processing.
- Payment pages and checkout mock pages must stay noindex/nofollow.
- Do not implement product delivery until real payment success is verified in a later explicit stage.
- Redis must remain optional for build and local development.
- Do not import Redis into Client Components.
- Live status responses must expose their data source.
- Do not fake production live status data; use explicit Redis, database snapshot, or mock source labels.
- Server status fallback order is Redis, database latest snapshot, then typed mock data.
- RCON commands and product delivery remain deferred until an explicit later stage.
- Admin pages must be protected by server-side guards.
- Admin routes must not be added to the sitemap.
- Admin pages must use noindex/nofollow metadata.
- Do not add manual paid, payment success, provider capture, or delivery actions to admin pages.
- Admin write actions require server-side validation and audit logs.
- Admin writes must use server-side RBAC, zod validation, and audit logging.
- Prefer soft delete, archive, inactive, or unpublished states over hard delete.
- Never add manual payment success actions to admin.
- Never add delivery execution or RCON actions to admin before the explicit delivery/RCON stages.
- Admin CRUD must not make build depend on PostgreSQL.
- Never send real game commands before an explicit RCON stage.
- Mock payments must not create delivery jobs.
- Delivery APIs must remain admin-only.
- Delivery admin actions require audit logs.
- Do not add public delivery endpoints.
- Delivery dry-runs must not grant items or mark jobs completed as if real delivery happened.
- Run relevant Vitest and Playwright coverage after security, API, cart, payment, delivery, auth, SEO, or admin changes.
- New state-changing APIs must validate input and use server-side auth, rate limiting, and same-origin checks, or signature verification for webhooks.
- Do not expose stack traces or raw internal errors in API responses.
- Keep private, admin, cart, checkout, payment, and delivery URLs out of the sitemap.
- Keep PostgreSQL and Redis optional for build and public fallback rendering.
- Never commit real production environment variables or secrets.
- Recheck sitemap and robots after any route changes.
- Health endpoints must never leak secrets, connection strings, raw stack traces, or provider metadata.
- Do not use `PAYMENT_PROVIDER=mock` in production.
- Production migrations should use `npm run db:deploy`; local development can use `npm run db:migrate`.
- Seed scripts must not overwrite production data unless explicitly designed and approved for production bootstrap.
- Keep deployment documentation and SEO audit docs current after production-affecting changes.
- Keep `docs/audit.md` current after broad security, deployment, SEO, or architecture stabilization work.
- If local native Next.js bindings fail in the Codex/macOS environment, use the existing `scripts/next-wasm.mjs` wrapper instead of changing application behavior.
- Keep Prisma Client on the binary query engine unless runtime verification proves a safer deployment-specific alternative.
- Do not leave generated duplicate files, Finder metadata files, or local artifacts in the repository.
- Public UI changes must preserve server rendering, centralized SEO metadata, sitemap/robots behavior, Product JSON-LD, and noindex metadata for private pages.
- Do not use copyrighted third-party assets, copied server-network layouts, copied product wording, or external branding in the RUST24 public UI.
- Avoid heavy UI, animation, analytics, or media dependencies unless there is a clear performance-safe reason and the user explicitly approves the tradeoff.
- Keep public UI accessible and performant: readable contrast, visible focus states, semantic headings, stable layout, and no unnecessary client components.
- Admin analytics must never invent revenue, paid orders, successful payments, or popular product rankings without verified real payment success data.
- New admin pages must be server-side guarded, noindex/nofollow, and excluded from sitemap/robots public indexing.
- Product command templates are configuration only; they must never execute RCON or grant products before an explicit RCON/delivery execution stage.
- Admin command template writes must reject unknown placeholders and must not expose secrets or delivery internals to public pages.
- Never expose decrypted RCON passwords in UI, API responses, logs, audit metadata, or client props.
- RCON password updates require encryption with `ADMIN_SECRET_ENCRYPTION_KEY`; fail safely if the key is unavailable.
- Never execute RCON commands before an explicit RCON execution stage.
- Static page admin content must stay plain-text/markdown-like unless a complex CMS is explicitly requested.
- Public static pages must render only published records, respect noindex metadata, and keep unpublished/private pages out of the sitemap.
- Media uploads must validate file type, size, and filename; unsafe SVG uploads remain disabled unless sanitized by an explicit later stage.
- Media registry entries must not execute files or expose private storage paths.
- Payment provider settings are configuration only until an explicit real payment integration stage wires them into checkout.
- Never expose payment provider secrets or Telegram bot tokens in UI, API responses, logs, audit metadata, or client props.
- Telegram payment notifications must not be sent automatically for mock payments or unverified payment states.
- Notification templates must reject unknown variables and render missing optional values safely.
- Keep `docs/admin.md` current after admin navigation, RBAC, secret handling, CRUD, payment settings, delivery, or RCON-related changes.
