import type { Locale } from "@/config/locales";

export type LegalSection = {
  title: string;
  items: string[];
};

export type LegalDocument = {
  title: string;
  updatedAt: string;
  intro: string;
  sections: LegalSection[];
};

export const legalCompany = {
  name: "Rust24",
  beneficiary: "Individual Entrepreneur Lushnikov Vladislav Igorevich",
  address: "Russia, Moscow, Fabritsiusa St. 18",
  email: "support@rust24.local"
};

export function getUserAgreement(locale: Locale): LegalDocument {
  if (locale === "en") {
    return {
      title: "Service Terms",
      updatedAt: "2026-05-16",
      intro:
        "These terms describe the rules for using the Rust24 website, player account area, store showcase, support tools, and future digital game services. The current project build may contain demo sections until real payment and delivery integrations are enabled.",
      sections: [
        {
          title: "1. Parties and service status",
          items: [
            `The Rust24 service is operated for ${legalCompany.name} by ${legalCompany.beneficiary}, ${legalCompany.address}.`,
            "Website materials are informational and do not constitute a public offer unless a specific paid service page expressly states otherwise.",
            "Rust24 is an independent Rust server network project and is not affiliated with Facepunch Studios, Valve, or Steam."
          ]
        },
        {
          title: "2. Account and Steam profile",
          items: [
            "A Steam account may be used to identify a player and access private profile areas.",
            "The user is responsible for keeping their Steam account secure and for actions performed through their authenticated session.",
            "Rust24 may restrict access to website features or game servers if rules, security requirements, or fair-play standards are violated."
          ]
        },
        {
          title: "3. Game services and store",
          items: [
            "Store pages may describe future digital services, privileges, kits, or other game-related options for Rust24 servers.",
            "Checkout, real payments, and product delivery are not active until a later production stage is explicitly enabled.",
            "Service descriptions, prices, availability, and limits may be updated before a purchase is completed."
          ]
        },
        {
          title: "4. Payments and refunds",
          items: [
            "No real payment provider is enabled in the current build. Any mock or draft checkout flow is for development testing only.",
            "When real payments are enabled, refund rules, payment provider details, and delivery terms must be shown before payment.",
            "Refund requests will be reviewed through support based on the service status, delivery status, and applicable law."
          ]
        },
        {
          title: "5. Server rules and responsibility",
          items: [
            "Players must follow Rust24 rules, fair-play requirements, and moderation decisions.",
            "Rust24 is not responsible for interruptions caused by third-party infrastructure, Steam availability, hosting failures, DDoS attacks, or game updates.",
            "The service may be changed, suspended, or limited for maintenance, security, or gameplay balance reasons."
          ]
        },
        {
          title: "6. Contact",
          items: [
            `Questions about these terms can be sent to ${legalCompany.email}.`,
            "The current version published on the website replaces previous versions from the moment it is posted."
          ]
        }
      ]
    };
  }

  return {
    title: "Условия предоставления услуг",
    updatedAt: "2026-05-16",
    intro:
      "Настоящие условия описывают правила использования сайта Rust24, личного кабинета игрока, витрины магазина, поддержки и будущих цифровых игровых услуг. Текущая сборка проекта может содержать демонстрационные разделы до подключения реальных платежей и выдачи товаров.",
    sections: [
      {
        title: "1. Стороны и статус сервиса",
        items: [
          `Сервис Rust24 ведётся для ${legalCompany.name}. Бенефициар: ${legalCompany.beneficiary}, ${legalCompany.address}.`,
          "Материалы на сайте носят информационный характер и не являются публичной офертой, если на конкретной странице платной услуги прямо не указано иное.",
          "Rust24 является независимым проектом серверов Rust и не аффилирован с Facepunch Studios, Valve или Steam."
        ]
      },
      {
        title: "2. Аккаунт и Steam-профиль",
        items: [
          "Steam-аккаунт может использоваться для идентификации игрока и доступа к приватным разделам профиля.",
          "Пользователь самостоятельно отвечает за безопасность своего Steam-аккаунта и действия, совершённые через авторизованную сессию.",
          "Rust24 может ограничить доступ к функциям сайта или игровым серверам при нарушении правил, требований безопасности или принципов честной игры."
        ]
      },
      {
        title: "3. Игровые услуги и магазин",
        items: [
          "Страницы магазина могут описывать будущие цифровые услуги, привилегии, наборы или другие игровые возможности для серверов Rust24.",
          "Checkout, реальные платежи и выдача товаров не активны до отдельного production-этапа.",
          "Описание услуг, цены, доступность и ограничения могут обновляться до момента совершения покупки."
        ]
      },
      {
        title: "4. Платежи и возвраты",
        items: [
          "В текущей сборке не подключён реальный платёжный провайдер. Любой mock или draft checkout предназначен только для разработки.",
          "После подключения реальных платежей правила возврата, сведения о платёжном провайдере и условия выдачи должны быть показаны до оплаты.",
          "Запросы на возврат рассматриваются через поддержку с учётом статуса услуги, статуса выдачи и применимого законодательства."
        ]
      },
      {
        title: "5. Правила серверов и ответственность",
        items: [
          "Игроки обязаны соблюдать правила Rust24, требования честной игры и решения модерации.",
          "Rust24 не отвечает за перебои, вызванные сторонней инфраструктурой, доступностью Steam, сбоями хостинга, DDoS-атаками или обновлениями игры.",
          "Сервис может изменяться, приостанавливаться или ограничиваться из-за технических работ, безопасности или баланса игрового процесса."
        ]
      },
      {
        title: "6. Связь",
        items: [
          `Вопросы по условиям можно направлять на ${legalCompany.email}.`,
          "Актуальная версия, опубликованная на сайте, заменяет предыдущие версии с момента публикации."
        ]
      }
    ]
  };
}

export function getPrivacyPolicy(locale: Locale): LegalDocument {
  if (locale === "en") {
    return {
      title: "Privacy Policy",
      updatedAt: "2026-05-16",
      intro:
        "This policy explains what data Rust24 may process when a player uses the website, Steam sign-in, cart, profile, support, and future game services.",
      sections: [
        {
          title: "1. Data controller",
          items: [
            `Rust24 data processing is managed for ${legalCompany.name} by ${legalCompany.beneficiary}, ${legalCompany.address}.`,
            `Privacy requests can be sent to ${legalCompany.email}.`
          ]
        },
        {
          title: "2. Data we may process",
          items: [
            "Steam ID, public Steam persona name, avatar URL, profile URL, selected locale, selected currency, and website session identifiers.",
            "Cart and draft order data created by the user while testing or using future checkout features.",
            "Technical data such as IP-derived rate-limit keys, request timestamps, server logs, browser metadata, and security events."
          ]
        },
        {
          title: "3. Why data is processed",
          items: [
            "To authenticate the player, show profile pages, protect admin/private routes, and provide support.",
            "To keep carts, draft orders, payment-skeleton records, audit logs, and delivery-skeleton records consistent.",
            "To protect the website from abuse, spam, unauthorized access, and technical failures."
          ]
        },
        {
          title: "4. Cookies and sessions",
          items: [
            "Rust24 uses HTTP-only session cookies for authentication and cart session cookies for guest cart continuity.",
            "Cookies are configured with sameSite lax and secure mode in production.",
            "The user can clear cookies in the browser or use the logout action to remove the active auth session."
          ]
        },
        {
          title: "5. Sharing and retention",
          items: [
            "Data is not sold. It may be processed by hosting, database, Redis, Steam, or future payment infrastructure providers only as needed to operate the service.",
            "Operational records may be retained while required for security, accounting, dispute handling, or technical diagnostics.",
            "Demo/mock records used during development should not be treated as completed payment or delivery history."
          ]
        },
        {
          title: "6. User rights",
          items: [
            "A user may request access, correction, deletion, or restriction of personal data where applicable.",
            "Some data may be retained if required to protect the service, comply with law, or resolve disputes."
          ]
        }
      ]
    };
  }

  return {
    title: "Политика конфиденциальности",
    updatedAt: "2026-05-16",
    intro:
      "Эта политика объясняет, какие данные Rust24 может обрабатывать при использовании сайта, Steam-авторизации, корзины, профиля, поддержки и будущих игровых сервисов.",
    sections: [
      {
        title: "1. Оператор данных",
        items: [
          `Обработка данных Rust24 ведётся для ${legalCompany.name}. Бенефициар: ${legalCompany.beneficiary}, ${legalCompany.address}.`,
          `Запросы по конфиденциальности можно направлять на ${legalCompany.email}.`
        ]
      },
      {
        title: "2. Какие данные могут обрабатываться",
        items: [
          "Steam ID, публичный ник Steam, URL аватара, URL профиля, выбранная локаль, выбранная валюта и идентификаторы сессий сайта.",
          "Данные корзины и черновиков заказов, созданные пользователем при тестировании или использовании будущих checkout-функций.",
          "Технические данные: ключи rate-limit на основе IP, время запросов, серверные логи, сведения о браузере и события безопасности."
        ]
      },
      {
        title: "3. Цели обработки",
        items: [
          "Авторизация игрока, отображение профиля, защита приватных/admin-маршрутов и работа поддержки.",
          "Согласованная работа корзины, черновиков заказов, платёжного skeleton, audit logs и delivery skeleton.",
          "Защита сайта от злоупотреблений, спама, несанкционированного доступа и технических сбоев."
        ]
      },
      {
        title: "4. Cookies и сессии",
        items: [
          "Rust24 использует HTTP-only cookies для авторизации и cookies гостевой корзины для сохранения корзины.",
          "Cookies настроены с sameSite lax и secure-режимом в production.",
          "Пользователь может очистить cookies в браузере или воспользоваться выходом из аккаунта для удаления активной auth-сессии."
        ]
      },
      {
        title: "5. Передача и хранение",
        items: [
          "Данные не продаются. Они могут обрабатываться провайдерами хостинга, базы данных, Redis, Steam или будущей платёжной инфраструктуры только для работы сервиса.",
          "Операционные записи могут храниться столько, сколько требуется для безопасности, учёта, разбора спорных ситуаций или технической диагностики.",
          "Demo/mock записи на этапе разработки не считаются историей завершённых платежей или реальной выдачи товаров."
        ]
      },
      {
        title: "6. Права пользователя",
        items: [
          "Пользователь может запросить доступ, исправление, удаление или ограничение обработки персональных данных, если это применимо.",
          "Часть данных может сохраняться, если это требуется для защиты сервиса, соблюдения закона или урегулирования споров."
        ]
      }
    ]
  };
}
