import Link from "next/link";
import type { Locale } from "@/types/content";

export function ConnectSteps({ locale }: { locale: Locale }) {
  const copy = getStepsCopy(locale);

  return (
    <section className="space-y-5">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.24em] text-orange-200/75">
          {copy.eyebrow}
        </p>
        <h2 className="mt-2 section-title">{copy.title}</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {copy.steps.map((step, index) => (
          <article
            key={step.title}
            className="surface-card surface-card-hover relative min-h-48 overflow-hidden rounded-2xl p-5"
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl border border-orange-300/25 bg-orange-500/12 text-lg font-black text-orange-200">
              {index + 1}
            </span>
            <h3 className="mt-5 text-xl font-black text-white">{step.title}</h3>
            <p className="mt-3 text-sm leading-6 text-zinc-400">{step.description}</p>
          </article>
        ))}
      </div>
      <div className="flex justify-center">
        <Link href={`/${locale}/servers`} className="secondary-cta min-w-48">
          {copy.cta}
        </Link>
      </div>
    </section>
  );
}

function getStepsCopy(locale: Locale) {
  if (locale === "ru") {
    return {
      eyebrow: "Quick start",
      title: "Как начать играть",
      cta: "Выбрать сервер",
      steps: [
        {
          title: "Войди через Steam",
          description: "Авторизация нужна для профиля, корзины и будущих покупок."
        },
        {
          title: "Выбери сервер",
          description: "Смотри онлайн, формат команды и расписание вайпа до подключения."
        },
        {
          title: "Скопируй команду",
          description: "Команда connect доступна на карточке сервера и копируется в один клик."
        },
        {
          title: "Заходи в вайп",
          description: "Начинай без лишних экранов: серверы, магазин и поддержка рядом."
        }
      ]
    };
  }

  return {
    eyebrow: "Quick start",
    title: "How to start",
    cta: "Choose server",
    steps: [
      {
        title: "Sign in with Steam",
        description: "Auth powers the profile, cart, and future purchases."
      },
      {
        title: "Pick a server",
        description: "Check online, team format, and wipe schedule before joining."
      },
      {
        title: "Copy command",
        description: "The connect command is available on each server card."
      },
      {
        title: "Enter the wipe",
        description: "Servers, store, and support stay close without extra screens."
      }
    ]
  };
}
