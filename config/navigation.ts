import type { RouteKey } from "@/config/routes";

export type NavItem = {
  key: Exclude<RouteKey, "home">;
  href: string;
};

export const navItems: NavItem[] = [
  { key: "servers", href: "/servers" },
  { key: "store", href: "/store" },
  { key: "gamemodes", href: "/gamemodes" },
  { key: "faq", href: "/faq" },
  { key: "rules", href: "/rules" },
  { key: "bans", href: "/bans" },
  { key: "moneyRace", href: "/money-race" },
  { key: "support", href: "/support" }
];
