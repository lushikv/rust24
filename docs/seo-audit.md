# RUST24 SEO Audit

## Current Public Indexable Surface

- `/ru`
- `/en`
- localized public pages: servers, store, gamemodes, FAQ, rules, bans, money race, support
- store category pages
- store product detail pages

## Excluded Surface

The sitemap must not include:

- `/admin`
- `/profile`
- `/cart`
- `/checkout`
- `/api`
- payment URLs
- delivery URLs

`robots.txt` disallows `/admin`, `/profile`, `/cart`, `/checkout`, and `/api`. Private pages must also use noindex metadata because `robots.txt` is not a privacy mechanism.

## Metadata Checks

- `metadataBase` and canonical URLs come from `NEXT_PUBLIC_SITE_URL`.
- Every public page should have a localized title and description.
- Alternates include `ru`, `en`, and `x-default`.
- Product detail pages include Product JSON-LD only with visible truthful data.
- No fake reviews, fake ratings, fake availability claims, fake event data, or fake FAQ schema.
- Admin, profile, cart, checkout, and mock payment pages stay noindex/nofollow.
- Default OG image exists at `/images/og/default-og.svg`.

## Search Console Preparation

1. Verify the production domain.
2. Submit `/sitemap.xml`.
3. Inspect `/ru`, `/en`, `/ru/store`, and representative product URLs.
4. Check the Page indexing report for accidental private URLs.
5. Check hreflang signals for RU/EN alternates.
6. Monitor Core Web Vitals after real traffic begins.
7. Recheck Product rich results only after product pages have production content and real pricing policy.

## Manual Release Audit

Before launch, verify:

```text
/sitemap.xml returns 200
/robots.txt returns 200
/ru/store/passes/starter-pass has Product JSON-LD
/admin is noindex and protected
/ru/profile is noindex and protected
/ru/cart is noindex
/ru/checkout is noindex
/non-existing-page returns the 404 UI
```
