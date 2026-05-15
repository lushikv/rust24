import { routing } from "@/config/locales";

export const siteConfig = {
  name: "RUST24",
  defaultTitle: "RUST24 - Rust game servers",
  titleTemplate: "%s | RUST24",
  defaultDescription:
    "RUST24 is a production-grade Rust game server website foundation with localized public pages.",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locales: routing.locales,
  defaultLocale: routing.defaultLocale,
  defaultCurrency: process.env.NEXT_PUBLIC_DEFAULT_CURRENCY ?? "RUB",
  twitterHandle: "@rust24",
  defaultOgImage: "/images/og/default-og.svg"
} as const;
