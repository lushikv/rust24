export const routing = {
  locales: ["ru", "en"],
  defaultLocale: "ru",
  localePrefix: "always"
} as const;

export type Locale = (typeof routing.locales)[number];
