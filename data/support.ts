import type { SupportChannel } from "@/types/content";

export const supportChannels: SupportChannel[] = [
  {
    id: "telegram",
    title: { ru: "Telegram", en: "Telegram" },
    description: {
      ru: "Плейсхолдер для новостей, быстрых объявлений и связи с командой.",
      en: "A placeholder for news, quick announcements, and team contact."
    },
    responseTime: { ru: "обычно в течение дня", en: "usually within a day" },
    href: "#"
  },
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
    id: "vk",
    title: { ru: "VK", en: "VK" },
    description: {
      ru: "Плейсхолдер для локальных публикаций и справочной информации.",
      en: "A placeholder for local posts and reference information."
    },
    responseTime: { ru: "по расписанию публикаций", en: "on publishing schedule" },
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
