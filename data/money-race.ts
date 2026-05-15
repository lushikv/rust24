import type { MoneyRaceSeason } from "@/types/content";

export const moneyRaceSeason: MoneyRaceSeason = {
  id: "spring-briefing",
  title: { ru: "Spring Briefing", en: "Spring Briefing" },
  activePeriod: { ru: "Недели 1-4 текущего сезона", en: "Weeks 1-4 of the current season" },
  prizePool: { RUB: 24000, EUR: 240 },
  updatedAt: "2026-05-14T15:00:00.000Z",
  rulesSummary: [
    { ru: "Таблица в Stage 3 является статичным примером.", en: "The Stage 3 leaderboard is a static example." },
    { ru: "Учитываются только честные игровые действия.", en: "Only fair gameplay actions count." },
    { ru: "Форматы команд разделены по вкладкам.", en: "Team formats are separated into tabs." }
  ],
  leaderboard: {
    solo: [
      { rank: 1, player: "IronPath", score: 18420, server: { ru: "Night Solo", en: "Night Solo" } },
      { rank: 2, player: "RedHarbor", score: 17110, server: { ru: "Night Solo", en: "Night Solo" } }
    ],
    duo: [
      { rank: 1, player: "OxidePair", score: 32100, server: { ru: "Oxide Duo", en: "Oxide Duo" } },
      { rank: 2, player: "TwoDoors", score: 30440, server: { ru: "Oxide Duo", en: "Oxide Duo" } }
    ],
    trio: [
      { rank: 1, player: "ThirdShift", score: 40220, server: { ru: "Forge Main", en: "Forge Main" } },
      { rank: 2, player: "RoadCrew", score: 38960, server: { ru: "Forge Main", en: "Forge Main" } }
    ],
    nolimit: [
      { rank: 1, player: "BigCompound", score: 61200, server: { ru: "Forge Main", en: "Forge Main" } },
      { rank: 2, player: "DepotLine", score: 58880, server: { ru: "Forge Main", en: "Forge Main" } }
    ]
  }
};
