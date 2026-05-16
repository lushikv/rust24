import { getLocale } from "next-intl/server";
import { siteConfig } from "@/config/site";
import Link from "next/link";
import type { Locale } from "@/config/locales";
import { legalCompany } from "@/data/legal";

type SocialLink = {
  key: "vk" | "discord" | "telegram" | "email";
  label: string;
  href: string;
};

const socialLinks: SocialLink[] = [
  { key: "vk", label: "VK", href: "/support" },
  { key: "discord", label: "Discord", href: "/support" },
  { key: "telegram", label: "Telegram", href: "/support" },
  { key: "email", label: "Email", href: "/support" }
];

function SocialIcon({ type }: { type: SocialLink["key"] }) {
  if (type === "vk") {
    return (
      <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.9 17.3c-5.3 0-8.4-3.6-8.5-9.6h2.7c.1 4.4 2 6.2 3.5 6.6V7.7h2.5v3.8c1.5-.2 3-1.8 3.5-3.8h2.5a7.3 7.3 0 0 1-3.1 4.8 7.6 7.6 0 0 1 3.7 4.8H17c-.6-1.8-2-3.2-3.8-3.4v3.4h-.3Z" />
      </svg>
    );
  }

  if (type === "discord") {
    return (
      <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.8 5.3A15 15 0 0 0 15.1 4l-.2.4-.5 1a13 13 0 0 0-4.8 0l-.5-1L8.9 4a15 15 0 0 0-3.7 1.3 16 16 0 0 0-2 8.1 15 15 0 0 0 4.5 2.3l.9-1.5-1.4-.7.3-.2a10.8 10.8 0 0 0 9 0l.3.2-1.4.7.9 1.5a15 15 0 0 0 4.5-2.3 16 16 0 0 0-2-8.1ZM9.1 12.8c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8 1.6.8 1.6 1.8-.7 1.8-1.6 1.8Zm5.8 0c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8 1.6.8 1.6 1.8-.7 1.8-1.6 1.8Z" />
      </svg>
    );
  }

  if (type === "telegram") {
    return (
      <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.8 4.4 3.8 11c-1.2.5-1.2 1.1-.2 1.4L8 13.8l1.7 5.2c.2.7.4.9.8.9.4 0 .6-.2.9-.5l2.1-2 4.4 3.2c.8.4 1.4.2 1.6-.8l2.9-13.8c.3-1.2-.4-1.7-1.6-1.2Zm-3.1 3.2-8.4 7.6-.3 3-1.2-4 9.3-5.9c.4-.3.8-.1.6.3Z" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24" fill="none">
      <path
        d="M4.75 6.75h14.5v10.5H4.75V6.75Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="m5.25 7.25 6.75 5.2 6.75-5.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export async function Footer() {
  const locale = await getLocale();
  const safeLocale = locale as Locale;
  const legalNotice =
    safeLocale === "ru"
      ? "Информация, размещенная на сайте, носит исключительно информационный характер и ни при каких условиях не является публичной офертой, определяемой положениями ч. 2 ст. 437 Гражданского кодекса Российской Федерации."
      : "Information published on this website is provided for informational purposes only and is not a public offer unless expressly stated on a specific service page.";
  const companyLines =
    safeLocale === "ru"
      ? [
          `${siteConfig.name} © 2026`,
          `Beneficiary: ${legalCompany.beneficiary}`,
          `Address: ${legalCompany.address}`
        ]
      : [
          `${siteConfig.name} © 2026`,
          `Beneficiary: ${legalCompany.beneficiary}`,
          `Address: ${legalCompany.address}`
        ];
  const legalLinks = [
    {
      href: `/${safeLocale}/user-agreement`,
      label: safeLocale === "ru" ? "Условия предоставления услуг" : "Service Terms"
    },
    {
      href: `/${safeLocale}/policy`,
      label: safeLocale === "ru" ? "Политика конфиденциальности" : "Privacy Policy"
    }
  ];

  return (
    <footer className="mt-10 overflow-hidden rounded-t-lg border border-b-0 border-orange-200/10 bg-[#101116]/95 shadow-inner shadow-orange-950/10">
      <div className="mx-auto grid min-h-56 w-full max-w-7xl items-start gap-8 px-4 py-9 text-sm text-zinc-500 sm:px-6 lg:grid-cols-[minmax(0,1fr)_520px] lg:px-8">
        <div className="max-w-3xl space-y-6">
          <p className="max-w-3xl text-sm font-black leading-6 text-zinc-400 lg:pr-6">
            {legalNotice}
          </p>
          <div className="space-y-1 text-sm leading-5 text-zinc-600">
            {companyLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
        <div className="flex min-h-40 flex-col items-start justify-between gap-8 lg:items-end">
          <div className="flex items-start gap-6">
            <div className="grid grid-cols-4 gap-3" aria-label="Social links">
              {socialLinks.map((item) => (
                <Link
                  key={item.key}
                  href={`/${safeLocale}${item.href}`}
                  className="focus-ring grid h-11 w-11 place-items-center rounded-xl border border-white/10 bg-[#181b25] text-zinc-300 shadow-lg shadow-black/25 transition hover:border-orange-300/45 hover:bg-orange-500/10 hover:text-orange-200 hover:shadow-orange-950/20"
                  aria-label={item.label}
                  title={item.label}
                >
                  <SocialIcon type={item.key} />
                </Link>
              ))}
            </div>
            <a
              href="#"
              className="focus-ring hidden h-14 w-14 place-items-center rounded-full border border-white/10 bg-black/20 text-zinc-400 transition hover:border-orange-300/45 hover:bg-orange-500/10 hover:text-orange-200 lg:grid"
              aria-label={safeLocale === "ru" ? "Наверх" : "Back to top"}
              title={safeLocale === "ru" ? "Наверх" : "Back to top"}
            >
              <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24" fill="none">
                <path
                  d="m7.5 14 4.5-4.5 4.5 4.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
          <nav
            className="flex flex-wrap gap-x-8 gap-y-2 text-sm font-black text-zinc-600 lg:justify-end"
            aria-label={safeLocale === "ru" ? "Юридические ссылки" : "Legal links"}
          >
            {legalLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="focus-ring rounded-sm border-b border-transparent py-1 transition hover:border-orange-300/60 hover:text-orange-100"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
