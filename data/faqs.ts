import type { FAQCategory, FAQItem } from "@/types/content";

export const faqCategories: FAQCategory[] = [
  { id: "servers", title: { ru: "Серверы", en: "Servers" } },
  { id: "store", title: { ru: "Магазин", en: "Store" } },
  { id: "support", title: { ru: "Поддержка", en: "Support" } }
];

export const faqs: FAQItem[] = [
  {
    id: "how-connect",
    categoryId: "servers",
    question: { ru: "Как подключиться к серверу?", en: "How do I connect to a server?" },
    answer: {
      ru: "На странице серверов есть команда connect. Скопируйте ее в консоль Rust, когда сервер доступен.",
      en: "The servers page includes a connect command. Copy it into the Rust console when the server is available."
    }
  },
  {
    id: "wipes",
    categoryId: "servers",
    question: { ru: "Когда проходят вайпы?", en: "When do wipes happen?" },
    answer: {
      ru: "Для каждого сервера указан отдельный график. В Stage 3 это статичные демонстрационные данные.",
      en: "Each server has its own schedule. In Stage 3 this is static demonstration data."
    }
  },
  {
    id: "payments",
    categoryId: "store",
    question: { ru: "Можно ли уже купить товар?", en: "Can I buy an item now?" },
    answer: {
      ru: "Нет. Магазин в Stage 3 показывает только статичную витрину без оплаты, корзины и выдачи.",
      en: "No. The Stage 3 store is a static showcase without payments, cart, or delivery."
    }
  },
  {
    id: "appeal",
    categoryId: "support",
    question: { ru: "Как обжаловать бан?", en: "How do I appeal a ban?" },
    answer: {
      ru: "Используйте страницу поддержки и укажите сервер, дату и краткое описание ситуации.",
      en: "Use the support page and include the server, date, and a short situation summary."
    }
  }
];
