import type { SupportChannel } from "@/types/content";

export const supportChannels: SupportChannel[] = [
  {
    id: "discord",
    title: { ru: "Discord", en: "Discord" },
    description: {
      ru: "Плейсхолдер для будущих голосовых комнат и обращений игроков.",
      en: "A placeholder for future voice rooms and player requests."
    },
    responseTime: { ru: "после запуска сообщества", en: "after community launch" },
    href: "#"
  },
  {
    id: "email",
    title: { ru: "Email", en: "Email" },
    description: {
      ru: "Плейсхолдер для формальных вопросов, жалоб и партнёрских тем.",
      en: "A placeholder for formal questions, reports, and partnership topics."
    },
    responseTime: { ru: "до 48 часов", en: "up to 48 hours" },
    href: "mailto:support@rust24.local"
  }
];
