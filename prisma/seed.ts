import {
  AuditAction,
  BanStatus,
  Locale,
  PrismaClient,
  ProductStatus,
  ProductType,
  ServerStatus,
  TeamLimit
} from "@prisma/client";
import { bans } from "@/data/bans";
import { faqCategories, faqs } from "@/data/faqs";
import { moneyRaceSeason } from "@/data/money-race";
import { productCategories, products } from "@/data/products";
import { ruleSections } from "@/data/rules";
import { servers } from "@/data/servers";
import { supportChannels } from "@/data/support";
import { publicRoutes } from "@/config/routes";
import { siteConfig } from "@/config/site";

const prisma = new PrismaClient();

function statusToEnum(status: string) {
  if (status === "online") {
    return ServerStatus.ONLINE;
  }
  if (status === "maintenance") {
    return ServerStatus.MAINTENANCE;
  }
  return ServerStatus.OFFLINE;
}

function teamLimitToEnum(value: string) {
  if (value.includes("solo")) {
    return TeamLimit.SOLO;
  }
  if (value.includes("2")) {
    return TeamLimit.DUO;
  }
  if (value.includes("3")) {
    return TeamLimit.TRIO;
  }
  return TeamLimit.NO_LIMIT;
}

function durationToDays(value: string) {
  const match = value.match(/\d+/);
  return match ? Number(match[0]) : null;
}

function banStatusToEnum(value: string) {
  if (value.toLowerCase().includes("review")) {
    return BanStatus.APPEALED;
  }
  return BanStatus.ACTIVE;
}

async function seedServers() {
  for (const [index, server] of servers.entries()) {
    const dbServer = await prisma.server.upsert({
      where: { slug: server.id },
      update: {
        titleRu: server.name.ru,
        titleEn: server.name.en,
        descriptionRu: server.description.ru,
        descriptionEn: server.description.en,
        mode: server.mode.en,
        region: server.region,
        teamLimit: teamLimitToEnum(server.teamLimit.en),
        address: server.connectCommand.replace("connect ", ""),
        connectCommand: server.connectCommand,
        wipeScheduleRu: server.wipeSchedule.ru,
        wipeScheduleEn: server.wipeSchedule.en,
        capacity: server.capacity,
        sortOrder: index,
        isFeatured: index === 0,
        isActive: true
      },
      create: {
        slug: server.id,
        titleRu: server.name.ru,
        titleEn: server.name.en,
        descriptionRu: server.description.ru,
        descriptionEn: server.description.en,
        mode: server.mode.en,
        region: server.region,
        teamLimit: teamLimitToEnum(server.teamLimit.en),
        address: server.connectCommand.replace("connect ", ""),
        connectCommand: server.connectCommand,
        wipeScheduleRu: server.wipeSchedule.ru,
        wipeScheduleEn: server.wipeSchedule.en,
        capacity: server.capacity,
        sortOrder: index,
        isFeatured: index === 0,
        isActive: true
      }
    });

    await prisma.serverStatusSnapshot.deleteMany({
      where: { serverId: dbServer.id }
    });
    await prisma.serverStatusSnapshot.create({
      data: {
        serverId: dbServer.id,
        status: statusToEnum(server.status),
        online: server.online,
        queue: 0
      }
    });
  }
}

async function seedProducts() {
  for (const [index, category] of productCategories.entries()) {
    await prisma.productCategory.upsert({
      where: { slug: category.id },
      update: {
        titleRu: category.title.ru,
        titleEn: category.title.en,
        descriptionRu: category.description.ru,
        descriptionEn: category.description.en,
        sortOrder: index,
        isActive: true
      },
      create: {
        slug: category.id,
        titleRu: category.title.ru,
        titleEn: category.title.en,
        descriptionRu: category.description.ru,
        descriptionEn: category.description.en,
        sortOrder: index,
        isActive: true
      }
    });
  }

  for (const [index, product] of products.entries()) {
    const category = await prisma.productCategory.findUniqueOrThrow({
      where: { slug: product.categoryId }
    });
    const oldPriceRub = product.discountPercent
      ? Math.round(product.price.RUB / (1 - product.discountPercent / 100))
      : null;
    const oldPriceEur =
      product.discountPercent && product.price.EUR
        ? Math.round(product.price.EUR / (1 - product.discountPercent / 100))
        : null;

    const dbProduct = await prisma.product.upsert({
      where: { slug: product.id },
      update: {
        categoryId: category.id,
        type: product.categoryId === "cosmetic" ? ProductType.SERVICE : ProductType.PRIVILEGE,
        status: ProductStatus.ACTIVE,
        priceRub: product.price.RUB,
        priceEur: product.price.EUR,
        oldPriceRub,
        oldPriceEur,
        durationDays: durationToDays(product.duration.en),
        sortOrder: index,
        isFeatured: Boolean(product.featured)
      },
      create: {
        categoryId: category.id,
        slug: product.id,
        type: product.categoryId === "cosmetic" ? ProductType.SERVICE : ProductType.PRIVILEGE,
        status: ProductStatus.ACTIVE,
        priceRub: product.price.RUB,
        priceEur: product.price.EUR,
        oldPriceRub,
        oldPriceEur,
        durationDays: durationToDays(product.duration.en),
        sortOrder: index,
        isFeatured: Boolean(product.featured)
      }
    });

    for (const locale of [Locale.RU, Locale.EN]) {
      const key = locale === Locale.RU ? "ru" : "en";
      await prisma.productTranslation.upsert({
        where: {
          productId_locale: {
            productId: dbProduct.id,
            locale
          }
        },
        update: {
          title: product.title[key],
          description: product.description[key],
          shortDescription: product.description[key],
          includedItems: [product.duration[key]],
          modeRestrictions: [product.restrictions[key]]
        },
        create: {
          productId: dbProduct.id,
          locale,
          title: product.title[key],
          description: product.description[key],
          shortDescription: product.description[key],
          includedItems: [product.duration[key]],
          modeRestrictions: [product.restrictions[key]]
        }
      });
    }
  }
}

async function seedFaqs() {
  for (const [index, category] of faqCategories.entries()) {
    await prisma.fAQCategory.upsert({
      where: { slug: category.id },
      update: {
        titleRu: category.title.ru,
        titleEn: category.title.en,
        sortOrder: index,
        isActive: true
      },
      create: {
        slug: category.id,
        titleRu: category.title.ru,
        titleEn: category.title.en,
        sortOrder: index,
        isActive: true
      }
    });
  }

  for (const [index, faq] of faqs.entries()) {
    const category = await prisma.fAQCategory.findUniqueOrThrow({
      where: { slug: faq.categoryId }
    });
    await prisma.fAQArticle.upsert({
      where: { slug: faq.id },
      update: {
        categoryId: category.id,
        questionRu: faq.question.ru,
        questionEn: faq.question.en,
        answerRu: faq.answer.ru,
        answerEn: faq.answer.en,
        sortOrder: index,
        isPublished: true
      },
      create: {
        categoryId: category.id,
        slug: faq.id,
        questionRu: faq.question.ru,
        questionEn: faq.question.en,
        answerRu: faq.answer.ru,
        answerEn: faq.answer.en,
        sortOrder: index,
        isPublished: true
      }
    });
  }
}

async function seedRules() {
  for (const [sectionIndex, section] of ruleSections.entries()) {
    const dbSection = await prisma.ruleSection.upsert({
      where: { slug: section.id },
      update: {
        titleRu: section.title.ru,
        titleEn: section.title.en,
        descriptionRu: section.description.ru,
        descriptionEn: section.description.en,
        sortOrder: sectionIndex,
        isPublished: true
      },
      create: {
        slug: section.id,
        titleRu: section.title.ru,
        titleEn: section.title.en,
        descriptionRu: section.description.ru,
        descriptionEn: section.description.en,
        sortOrder: sectionIndex,
        isPublished: true
      }
    });

    await prisma.ruleItem.deleteMany({ where: { sectionId: dbSection.id } });
    await prisma.ruleItem.createMany({
      data: section.items.map((item, itemIndex) => ({
        sectionId: dbSection.id,
        code: `${section.id}-${itemIndex + 1}`,
        textRu: item.ru,
        textEn: item.en,
        severity: section.severity,
        sortOrder: itemIndex
      }))
    });
  }
}

async function seedBans() {
  await prisma.banRecord.deleteMany();
  await prisma.banRecord.createMany({
    data: bans.map((ban) => ({
      playerName: ban.player,
      playerPublicId: ban.id,
      reasonRu: ban.reason.ru,
      reasonEn: ban.reason.en,
      serverName: ban.server.en,
      status: banStatusToEnum(ban.status.en),
      bannedAt: new Date(ban.date)
    }))
  });
}

async function seedMoneyRace() {
  const season = await prisma.moneyRaceSeason.upsert({
    where: { slug: moneyRaceSeason.id },
    update: {
      titleRu: moneyRaceSeason.title.ru,
      titleEn: moneyRaceSeason.title.en,
      prizePoolRub: moneyRaceSeason.prizePool.RUB,
      startsAt: new Date("2026-05-01T00:00:00.000Z"),
      endsAt: new Date("2026-05-29T00:00:00.000Z"),
      isActive: true
    },
    create: {
      slug: moneyRaceSeason.id,
      titleRu: moneyRaceSeason.title.ru,
      titleEn: moneyRaceSeason.title.en,
      prizePoolRub: moneyRaceSeason.prizePool.RUB,
      startsAt: new Date("2026-05-01T00:00:00.000Z"),
      endsAt: new Date("2026-05-29T00:00:00.000Z"),
      isActive: true
    }
  });

  await prisma.moneyRaceWeek.deleteMany({ where: { seasonId: season.id } });
  await prisma.moneyRaceWeek.createMany({
    data: [0, 1, 2, 3].map((week) => ({
      seasonId: season.id,
      weekNumber: week + 1,
      startsAt: new Date(Date.UTC(2026, 4, 1 + week * 7)),
      endsAt: new Date(Date.UTC(2026, 4, 8 + week * 7))
    }))
  });

  await prisma.leaderboardEntry.deleteMany({ where: { seasonId: season.id } });
  await prisma.leaderboardEntry.createMany({
    data: Object.entries(moneyRaceSeason.leaderboard).flatMap(
      ([format, entries]) =>
        entries.map((entry) => ({
          seasonId: season.id,
          format,
          rank: entry.rank,
          playerName: entry.player,
          points: entry.score,
          rewardRub: entry.rank === 1 ? 5000 : 2500
        }))
    )
  });
}

async function seedSupport() {
  for (const [index, channel] of supportChannels.entries()) {
    await prisma.supportChannel.upsert({
      where: { slug: channel.id },
      update: {
        titleRu: channel.title.ru,
        titleEn: channel.title.en,
        descriptionRu: channel.description.ru,
        descriptionEn: channel.description.en,
        url: channel.href,
        sortOrder: index,
        isActive: true
      },
      create: {
        slug: channel.id,
        titleRu: channel.title.ru,
        titleEn: channel.title.en,
        descriptionRu: channel.description.ru,
        descriptionEn: channel.description.en,
        url: channel.href,
        sortOrder: index,
        isActive: true
      }
    });
  }
}

async function seedSeoMeta() {
  for (const route of publicRoutes) {
    for (const locale of [Locale.RU, Locale.EN]) {
      const code = locale === Locale.RU ? "ru" : "en";
      const title =
        route.key === "home"
          ? siteConfig.defaultTitle
          : `${route.key} | ${siteConfig.name}`;
      await prisma.seoMeta.upsert({
        where: {
          path_locale: {
            path: `/${code}${route.path === "/" ? "" : route.path}`,
            locale
          }
        },
        update: {
          title,
          description: siteConfig.defaultDescription,
          noindex: !route.index
        },
        create: {
          path: `/${code}${route.path === "/" ? "" : route.path}`,
          locale,
          title,
          description: siteConfig.defaultDescription,
          noindex: !route.index
        }
      });
    }
  }
}

async function main() {
  await seedServers();
  await seedProducts();
  await seedFaqs();
  await seedRules();
  await seedBans();
  await seedMoneyRace();
  await seedSupport();
  await seedSeoMeta();

  await prisma.auditLog.create({
    data: {
      action: AuditAction.SYSTEM,
      entityType: "Seed",
      message: "Seeded Stage 4 demo data"
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
