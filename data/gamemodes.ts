import type { GameMode } from "@/types/content";

export const gamemodes: GameMode[] = [
  {
    id: "vanilla-plus",
    title: { ru: "Vanilla+", en: "Vanilla+" },
    summary: {
      ru: "Близко к классическому Rust, но с аккуратными улучшениями темпа.",
      en: "Close to classic Rust with careful pacing improvements."
    },
    features: [
      { ru: "понятная экономика", en: "clear economy" },
      { ru: "умеренная скорость прогресса", en: "balanced progression speed" },
      { ru: "регулярные вайпы", en: "regular wipes" }
    ],
    recommendedServerId: "forge-main"
  },
  {
    id: "duo-compact",
    title: { ru: "Duo Compact", en: "Duo Compact" },
    summary: {
      ru: "Формат для двух игроков с быстрым поиском точек конфликта.",
      en: "A two-player format with faster routes into conflict."
    },
    features: [
      { ru: "лимит команды 2", en: "team limit 2" },
      { ru: "активная карта", en: "active map" },
      { ru: "короткие игровые циклы", en: "short play cycles" }
    ],
    recommendedServerId: "oxide-duo"
  },
  {
    id: "solo-tactical",
    title: { ru: "Solo Tactical", en: "Solo Tactical" },
    summary: {
      ru: "Больше разведки, меньше случайных перевесов и честные дуэли.",
      en: "More scouting, fewer accidental advantages, and fair duels."
    },
    features: [
      { ru: "только соло", en: "solo only" },
      { ru: "контроль альянсов", en: "alliance control" },
      { ru: "акцент на решениях", en: "decision-first gameplay" }
    ],
    recommendedServerId: "night-solo"
  }
];
