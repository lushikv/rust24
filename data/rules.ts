import type { RuleSection } from "@/types/content";

export const rulesLastUpdated = "2026-05-14";

export const ruleSections: RuleSection[] = [
  {
    id: "fair-play",
    title: { ru: "Честная игра", en: "Fair Play" },
    description: {
      ru: "Правила защищают соревновательность и нормальный темп вайпа.",
      en: "These rules protect competition and the natural rhythm of the wipe."
    },
    severity: "warning",
    items: [
      { ru: "Запрещены читы, макросы и обходы ограничений клиента.", en: "Cheats, macros, and client restriction bypasses are forbidden." },
      { ru: "Запрещены договорные альянсы вне лимита режима.", en: "Arranged alliances beyond the mode limit are forbidden." },
      { ru: "Не используйте ошибки карты или сервера для преимущества.", en: "Do not use map or server bugs for advantage." }
    ]
  },
  {
    id: "community",
    title: { ru: "Общение", en: "Community" },
    description: {
      ru: "Конфликты в Rust нормальны, но токсичность не должна ломать игру другим.",
      en: "Conflict is part of Rust, but toxicity should not break the game for others."
    },
    severity: "info",
    items: [
      { ru: "Не публикуйте личные данные игроков.", en: "Do not publish players' personal data." },
      { ru: "Угрозы вне игры и мошенничество запрещены.", en: "Real-world threats and scams are forbidden." },
      { ru: "Выдача себя за администратора ведет к блокировке.", en: "Impersonating staff can lead to a ban." }
    ]
  }
];
