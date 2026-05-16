import type { Locale } from "@/types/content";

export function BenefitsSection({ locale }: { locale: Locale }) {
  const copy = getBenefitsCopy(locale);

  return (
    <section className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
      <div className="surface-card p-6">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-orange-200/75">
          {copy.eyebrow}
        </p>
        <h2 className="mt-2 section-title">{copy.title}</h2>
        <p className="mt-4 text-sm leading-7 text-zinc-400">{copy.description}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {copy.items.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition duration-200 hover:border-orange-300/35 hover:bg-orange-500/[0.04]"
          >
            <div className="h-2 w-12 rounded-full bg-gradient-to-r from-orange-600 to-amber-200" />
            <h3 className="mt-5 text-lg font-black text-white">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function getBenefitsCopy(locale: Locale) {
  if (locale === "ru") {
    return {
      eyebrow: "Почему Rust24",
      title: "Понятная сетка для регулярной игры",
      description:
        "Мы не обещаем невозможного: основа проекта — стабильная структура, прозрачные разделы и быстрый доступ к ключевым действиям.",
      items: [
        {
          title: "Серверы без путаницы",
          description: "Формат, онлайн, вайпы и команда подключения видны до входа."
        },
        {
          title: "Аккуратный магазин",
          description: "Товары оформлены как витрина, без скрытого checkout на текущем этапе."
        },
        {
          title: "Поддержка игроков",
          description: "Контакты и предупреждения о мошенниках вынесены в отдельный раздел."
        },
        {
          title: "Готовность к росту",
          description: "SEO, профиль, корзина и админка уже заложены в архитектуре проекта."
        }
      ]
    };
  }

  return {
    eyebrow: "Why Rust24",
    title: "A clear network for regular play",
    description:
      "No impossible promises: the project is built around stable structure, transparent sections, and fast access to key actions.",
    items: [
      {
        title: "Servers without confusion",
        description: "Format, online, wipes, and connect command are visible before joining."
      },
      {
        title: "Clean store preview",
        description: "Items are presented as a showcase without hidden checkout at this stage."
      },
      {
        title: "Player support",
        description: "Contacts and scam warnings live in a dedicated support section."
      },
      {
        title: "Ready to grow",
        description: "SEO, profile, cart, and admin foundations are already in the architecture."
      }
    ]
  };
}
