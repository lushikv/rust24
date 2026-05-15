import type { BanRecord } from "@/types/content";

export const bans: BanRecord[] = [
  {
    id: "ban-001",
    player: "StoneRunner",
    reason: { ru: "Макросы отдачи", en: "Recoil macros" },
    server: { ru: "Forge Main", en: "Forge Main" },
    date: "2026-05-12",
    status: { ru: "Активен", en: "Active" }
  },
  {
    id: "ban-002",
    player: "NorthBase",
    reason: { ru: "Альянс сверх лимита", en: "Alliance above team limit" },
    server: { ru: "Oxide Duo", en: "Oxide Duo" },
    date: "2026-05-10",
    status: { ru: "На проверке", en: "Under review" }
  },
  {
    id: "ban-003",
    player: "QuietFarm",
    reason: { ru: "Использование бага", en: "Bug abuse" },
    server: { ru: "Night Solo", en: "Night Solo" },
    date: "2026-05-08",
    status: { ru: "Активен", en: "Active" }
  }
];
