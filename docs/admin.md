# RUST24 Admin

The admin panel is a private, server-rendered area under `/admin`. It is intentionally excluded from public SEO surfaces and must remain unavailable to regular users.

## Access

- `OWNER` and `ADMIN` can access the admin panel.
- `OWNER` is required for editing payment provider secrets and Telegram bot tokens.
- `MODERATOR` may access limited moderation sections where explicitly allowed by `lib/admin/permissions.ts`.
- `USER` and unauthenticated visitors are denied before admin data is rendered.

Admin access is enforced on the server through `lib/admin/require-admin.ts`. Client-side checks are only UI convenience and are not a security boundary.

## Routes

- `/admin`
- `/admin/servers`
- `/admin/servers/new`
- `/admin/servers/{serverId}`
- `/admin/servers/{serverId}/edit`
- `/admin/servers/{serverId}/products`
- `/admin/servers/{serverId}/products/new`
- `/admin/servers/{serverId}/products/{productId}/edit`
- `/admin/products`
- `/admin/products/new`
- `/admin/products/categories`
- `/admin/products/categories/new`
- `/admin/products/categories/{categoryId}/edit`
- `/admin/coupons`
- `/admin/coupons/new`
- `/admin/coupons/{couponId}/edit`
- `/admin/sales`
- `/admin/sales/new`
- `/admin/sales/{saleId}/edit`
- `/admin/static-pages`
- `/admin/static-pages/new`
- `/admin/static-pages/{pageId}/edit`
- `/admin/media`
- `/admin/payment-systems`
- `/admin/payment-systems/{provider}/edit`
- `/admin/payment-notifications`
- `/admin/orders`
- `/admin/payments`
- `/admin/delivery`
- `/admin/delivery/{jobId}`
- `/admin/audit-log`

Admin pages use centralized noindex metadata through `createAdminMetadata`, are not added to the sitemap, and `/admin` is disallowed in `robots.txt`.

## Secrets

The admin stores configuration for future RCON, payment systems, and Telegram notifications, but it does not execute RCON, process real payments, or send automatic payment notifications.

Secret values must be encrypted with `ADMIN_SECRET_ENCRYPTION_KEY` before storage:

- RCON passwords
- payment provider secret config
- Telegram bot tokens

Stored secrets are never displayed after saving. Forms should show configured/not configured state and ask for a replacement value only when the admin wants to rotate the secret. Audit logs may record that a secret was updated, but must never include the secret value.

## Writes

Admin writes require:

- server-side RBAC
- zod validation
- PostgreSQL availability
- audit log entries
- no stack traces or raw internal errors in user-facing responses

Public fallback data remains for public pages only. Admin writes must not use mock fallback data.

Coupon and sale admin validation is centralized in `lib/admin/discount-validation.ts`. Coupon usage limits represent unique accounts, enforced by the `CouponRedemption` unique `(couponId, userId)` relation. Public prices are not silently changed by coupons or sale campaigns in the current stage; checkout/public pricing integration is deferred until it can keep visible prices and Product JSON-LD in sync.

## Deferred Work

These features are deliberately not implemented yet:

- real payment provider API calls
- paid/succeeded payment states
- product delivery
- RCON execution
- automatic Telegram notifications from payment events
- complex CMS/rich text editing
- direct media uploads

Any future work that enables payments or RCON must add dedicated tests, security review, and explicit product approval before it is wired into checkout or delivery.
