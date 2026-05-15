# RUST24 Production Hardening Checklist

## SEO

- Public pages have title, description, canonical URL, and `hreflang` for `ru`, `en`, and `x-default`.
- Sitemap contains only public indexable URLs.
- Private and operational pages remain excluded from sitemap.
- `robots.txt` disallows `/admin`, `/profile`, `/cart`, `/checkout`, and `/api`.
- Canonical URLs and `metadataBase` use `NEXT_PUBLIC_SITE_URL`.
- Product JSON-LD appears only on product detail pages with visible, truthful product data.
- Admin, profile, cart, checkout, mock payment, and delivery pages use noindex metadata.
- Default Open Graph image exists at `/images/og/default-og.svg`.

## Security

- HTTPS is required in production.
- Use a long random `AUTH_SESSION_SECRET`; never commit real secrets.
- Steam realm and return URL must exactly match the production domain.
- Keep `PAYMENT_PROVIDER=disabled` until a real payment stage is explicitly implemented.
- Do not use the mock payment provider in production.
- State-changing API routes validate input and enforce authentication or signed webhook checks where required.
- Browser-originated mutations use same-origin checks.
- Sensitive routes use Redis-backed rate limits with safe allow-on-Redis-outage fallback.
- API responses use user-safe error messages and do not expose stack traces.
- Payment providers remain disabled by default; mock payments never mark orders as paid.
- Delivery dry-run never sends RCON or grants products.
- Admin roles are assigned manually and intentionally, preferably through Prisma Studio or a controlled operational script.
- Backups must be taken before migrations.

## Performance

- Public pages remain server-rendered where practical.
- Prisma and Redis stay server-only and out of client bundles.
- Server status polling is lightweight and keeps server-rendered fallback content.
- PostgreSQL and Redis are optional for build; public pages degrade to safe fallbacks.

## Deployment

- Run `npm run lint`, `npm run typecheck`, `npm run test`, `npm run db:generate`, and `npm run build` before release.
- Run `npm run db:deploy` in production after a database backup.
- Run `npm run db:seed` only for local/demo environments unless a seed file is explicitly production-safe.
- Verify `/api/health/live`, `/api/health/ready`, `/sitemap.xml`, and `/robots.txt` after deployment.
- Submit `/sitemap.xml` in Google Search Console and inspect `/ru`, `/en`, and representative product URLs.
