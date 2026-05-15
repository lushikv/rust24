import type { Currency, Locale, LocalizedString } from "@/types/content";

export function getLocalizedValue(value: LocalizedString, locale: Locale) {
  return value[locale];
}

export function formatCurrency(
  amount: number,
  currency: Currency,
  locale: Locale
) {
  return new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatNumber(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "ru" ? "ru-RU" : "en-US").format(
    value
  );
}
