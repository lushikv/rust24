import type { Locale } from "@/config/locales";

export type { Locale };

export type LocalizedString = Record<Locale, string>;

export type Currency = "RUB" | "EUR";

export type ServerStatus = "online" | "maintenance" | "offline";

export type Server = {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  mode: LocalizedString;
  region: string;
  status: ServerStatus;
  online: number;
  queue?: number;
  capacity: number;
  teamLimit: LocalizedString;
  wipeSchedule: LocalizedString;
  connectCommand: string;
  tags: LocalizedString[];
};

export type ProductCategory = {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
};

export type StoreCategory = ProductCategory & {
  slug: string;
};

export type StoreProductType = "CURRENCY" | "PRIVILEGE" | "KIT" | "SERVICE" | "BATTLE_PASS";

export type StoreProductStatus = "ACTIVE" | "DRAFT" | "ARCHIVED";

export type Product = {
  id: string;
  categoryId: string;
  title: LocalizedString;
  description: LocalizedString;
  price: Record<Currency, number>;
  discountPercent?: number;
  duration: LocalizedString;
  restrictions: LocalizedString;
  featured?: boolean;
};

export type StoreProduct = Product & {
  slug: string;
  categorySlug: string;
  category: StoreCategory;
  shortDescription: LocalizedString;
  includedItems: LocalizedString[];
  modeRestrictions: LocalizedString[];
  priceRub: number;
  priceEur?: number;
  oldPriceRub?: number;
  oldPriceEur?: number;
  durationDays?: number;
  type: StoreProductType;
  status: StoreProductStatus;
  imageUrl?: string | null;
  isFeatured: boolean;
};

export type StoreProductDetail = StoreProduct;

export type GameMode = {
  id: string;
  title: LocalizedString;
  summary: LocalizedString;
  features: LocalizedString[];
  recommendedServerId: string;
};

export type FAQCategory = {
  id: string;
  title: LocalizedString;
};

export type FAQItem = {
  id: string;
  categoryId: string;
  question: LocalizedString;
  answer: LocalizedString;
};

export type FAQCategoryWithItems = FAQCategory & {
  items: FAQItem[];
};

export type RuleSection = {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  severity: "info" | "warning";
  items: LocalizedString[];
};

export type BanRecord = {
  id: string;
  player: string;
  reason: LocalizedString;
  server: LocalizedString;
  date: string;
  status: LocalizedString;
};

export type LeaderboardEntry = {
  rank: number;
  player: string;
  score: number;
  server: LocalizedString;
};

export type TeamFormat = "solo" | "duo" | "trio" | "nolimit";

export type MoneyRaceSeason = {
  id: string;
  title: LocalizedString;
  activePeriod: LocalizedString;
  prizePool: Record<Currency, number>;
  updatedAt: string;
  rulesSummary: LocalizedString[];
  leaderboard: Record<TeamFormat, LeaderboardEntry[]>;
};

export type SupportChannel = {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  responseTime: LocalizedString;
  href: string;
};
