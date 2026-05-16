import type { MetadataRoute } from "next";

export type PublicRoute = {
  key:
    | "home"
    | "servers"
    | "store"
    | "gamemodes"
    | "faq"
    | "rules"
    | "bans"
    | "moneyRace"
    | "support"
    | "userAgreement"
    | "policy";
  path: string;
  sitemap: boolean;
  index: boolean;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
};

export const publicRoutes = [
  {
    key: "home",
    path: "/",
    sitemap: true,
    index: true,
    priority: 1,
    changeFrequency: "weekly"
  },
  {
    key: "servers",
    path: "/servers",
    sitemap: true,
    index: true,
    priority: 0.9,
    changeFrequency: "daily"
  },
  {
    key: "store",
    path: "/store",
    sitemap: true,
    index: true,
    priority: 0.8,
    changeFrequency: "weekly"
  },
  {
    key: "gamemodes",
    path: "/gamemodes",
    sitemap: true,
    index: true,
    priority: 0.7,
    changeFrequency: "monthly"
  },
  {
    key: "faq",
    path: "/faq",
    sitemap: true,
    index: true,
    priority: 0.7,
    changeFrequency: "monthly"
  },
  {
    key: "rules",
    path: "/rules",
    sitemap: true,
    index: true,
    priority: 0.7,
    changeFrequency: "monthly"
  },
  {
    key: "bans",
    path: "/bans",
    sitemap: true,
    index: true,
    priority: 0.6,
    changeFrequency: "weekly"
  },
  {
    key: "moneyRace",
    path: "/money-race",
    sitemap: true,
    index: true,
    priority: 0.6,
    changeFrequency: "weekly"
  },
  {
    key: "support",
    path: "/support",
    sitemap: true,
    index: true,
    priority: 0.7,
    changeFrequency: "monthly"
  },
  {
    key: "userAgreement",
    path: "/user-agreement",
    sitemap: true,
    index: true,
    priority: 0.3,
    changeFrequency: "yearly"
  },
  {
    key: "policy",
    path: "/policy",
    sitemap: true,
    index: true,
    priority: 0.3,
    changeFrequency: "yearly"
  }
] as const satisfies readonly PublicRoute[];

export type RouteKey = (typeof publicRoutes)[number]["key"];

export function getPublicRoute(routeKey: RouteKey) {
  return publicRoutes.find((route) => route.key === routeKey);
}
