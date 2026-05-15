import type { Server } from "@/types/content";

export const servers: Server[] = [
  {
    id: "forge-main",
    name: { ru: "Forge Main", en: "Forge Main" },
    description: {
      ru: "Классический вайп с высоким темпом, понятным прогрессом и стабильным онлайном.",
      en: "A classic high-tempo wipe with clear progression and steady population."
    },
    mode: { ru: "Vanilla+", en: "Vanilla+" },
    region: "EU",
    status: "online",
    online: 184,
    capacity: 250,
    teamLimit: { ru: "до 4 игроков", en: "up to 4 players" },
    wipeSchedule: { ru: "Карта: пятница, BP: раз в 2 недели", en: "Map: Friday, BP: bi-weekly" },
    connectCommand: "connect main.rust24.local:28015",
    tags: [
      { ru: "быстрый старт", en: "fast start" },
      { ru: "умеренный фарм", en: "balanced gather" }
    ]
  },
  {
    id: "oxide-duo",
    name: { ru: "Oxide Duo", en: "Oxide Duo" },
    description: {
      ru: "Сервер для дуо-команд с короткими дистанциями до конфликтов и активной картой.",
      en: "A duo server with compact routes to conflict and an active map rhythm."
    },
    mode: { ru: "Duo", en: "Duo" },
    region: "EU",
    status: "online",
    online: 96,
    capacity: 150,
    teamLimit: { ru: "до 2 игроков", en: "up to 2 players" },
    wipeSchedule: { ru: "Карта: понедельник и пятница", en: "Map: Monday and Friday" },
    connectCommand: "connect duo.rust24.local:28016",
    tags: [
      { ru: "дуо", en: "duo" },
      { ru: "короткий вайп", en: "short wipe" }
    ]
  },
  {
    id: "night-solo",
    name: { ru: "Night Solo", en: "Night Solo" },
    description: {
      ru: "Соло-среда для аккуратного прогресса, разведки и честных дуэлей.",
      en: "A solo environment for careful progression, scouting, and fair duels."
    },
    mode: { ru: "Solo", en: "Solo" },
    region: "EU",
    status: "maintenance",
    online: 0,
    capacity: 100,
    teamLimit: { ru: "только соло", en: "solo only" },
    wipeSchedule: { ru: "Техническое окно до вечера", en: "Maintenance window until evening" },
    connectCommand: "connect solo.rust24.local:28017",
    tags: [
      { ru: "соло", en: "solo" },
      { ru: "контроль темпа", en: "pace control" }
    ]
  }
];
