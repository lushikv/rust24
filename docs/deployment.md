# RUST24 Deployment Guide

Stage 15 prepares RUST24 for production deployment without enabling real payments, RCON, or delivery side effects.

## Environment Variables

| Variable | Required | Public | Secret | Notes |
| --- | --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | yes | yes | no | Production origin, for example `https://rust24.example`. Drives canonical URLs, sitemap, robots, and metadata. |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | yes | yes | no | Default `ru`. |
| `NEXT_PUBLIC_DEFAULT_CURRENCY` | yes | yes | no | Default `RUB`. |
| `DATABASE_URL` | yes for production runtime | no | yes | PostgreSQL connection string. Builds must not require it, but admin/cart/auth/payment writes do. |
| `REDIS_URL` | recommended | no | yes | Redis connection string for rate limits and server status cache. Public pages fall back if unavailable. |
| `AUTH_SESSION_SECRET` | yes | no | yes | Long random value used to sign session cookies. Rotate with care because old sessions become invalid. |
| `STEAM_API_KEY` | optional for profile enrichment | no | yes | Steam OpenID can still verify SteamID without profile enrichment if missing. |
| `STEAM_REALM` | yes for Steam login | no | no | Must match production origin exactly. |
| `STEAM_RETURN_URL` | yes for Steam login | no | no | Must be the exact production callback, for example `/api/auth/steam/callback`. |
| `PAYMENT_PROVIDER` | yes | no | no | Use `disabled` in production until a real payment stage is approved. |
| `MOCK_PAYMENT_WEBHOOK_SECRET` | dev only | no | yes | Required only when using the mock provider locally. Do not use mock payments in production. |

Optional live-status tuning:

| Variable | Required | Public | Secret | Notes |
| --- | --- | --- | --- | --- |
| `SERVER_STATUS_CACHE_TTL_SECONDS` | no | no | no | Default cache TTL. |
| `SERVER_STATUS_REFRESH_INTERVAL_SECONDS` | no | no | no | Future refresh cadence. |
| `PUBLIC_SERVER_STATUS_POLL_INTERVAL_MS` | no | yes | no | Client polling interval. |

## Deployment Option A: Vercel + Managed Services

1. Provision managed PostgreSQL and Redis.
2. Configure environment variables in the hosting dashboard for production and preview environments.
3. Set `NEXT_PUBLIC_SITE_URL` to the production domain.
4. Keep `PAYMENT_PROVIDER=disabled`.
5. Run Prisma migrations in a controlled deploy step:

```bash
npm run db:deploy
```

6. Deploy the Next.js app.
7. Verify:

```text
/api/health/live
/api/health/ready
/sitemap.xml
/robots.txt
/ru
/en
```

Do not run `npm run db:seed` automatically in production.

## Deployment Option B: Self-Hosted Node/Docker

Use a Node runtime behind a reverse proxy with HTTPS. PostgreSQL and Redis can be managed separately or run as services.

Suggested process:

```bash
npm ci
npm run db:generate
npm run lint
npm run typecheck
npm run test
npm run build
npm run db:deploy
npm run start
```

Reverse proxy requirements:

- terminate HTTPS
- forward `Host`, `X-Forwarded-For`, and `X-Forwarded-Proto`
- route health checks to `/api/health/live` or `/api/health/ready`
- enforce request size limits appropriate for admin forms and APIs

The included `docker-compose.yml` is a local development helper for PostgreSQL and Redis. It is not a complete production deployment.

## Migration Strategy

- Create and review Prisma migrations before deployment.
- Back up PostgreSQL before running production migrations.
- Use `npm run db:deploy` in production, not `npm run db:migrate`.
- Keep rollback plans realistic: Prisma migrations are forward-first; restoring from backup may be required for destructive mistakes.
- Run `npm run db:generate` after schema changes.

## Seed Strategy

- `npm run db:seed` is for local/demo data.
- Do not blindly seed production.
- If production bootstrap data is needed later, create a separate audited script that is idempotent and safe for real data.

## Health Checks

- `/api/health/live` returns `200` if the app process is alive.
- `/api/health` returns safe JSON with app version, timestamp, dependency status, and payment provider mode.
- `/api/health/ready` returns `200` only when the database is reachable and Redis is either reachable or not configured.
- Health responses must never expose secrets, connection strings, stack traces, or raw provider metadata.

## Monitoring Placeholders

No heavy analytics or error reporting is enabled by default.

Recommended production additions when approved:

- Sentry for server/client error reporting.
- Uptime monitoring against `/api/health/live` and `/api/health/ready`.
- Log retention with request ids and deploy version.
- PostHog or GA4 only after privacy/cookie requirements are decided.
- Database backup monitoring and restore drills.

## Rollback Notes

- Keep the previous deployment artifact available.
- Back up before migrations.
- If a deployment fails before migration, roll back application code.
- If a migration has run, assess whether forward-fix or database restore is safer.
- Never use mock payment events or delivery dry-runs to repair production order state.
