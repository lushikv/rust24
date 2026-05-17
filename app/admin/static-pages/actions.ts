"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AuditAction } from "@prisma/client";
import { z } from "zod";
import { auditAdminWrite, requireAdminWrite } from "@/lib/admin/action-utils";
import { boolFromForm, optionalString, requiredString, slugSchema } from "@/lib/admin/validation";
import { prisma } from "@/lib/prisma";

const staticPageSchema = z.object({
  slug: slugSchema,
  titleRu: z.string().min(1),
  titleEn: z.string().min(1),
  descriptionRu: z.string().nullable(),
  descriptionEn: z.string().nullable(),
  contentRu: z.string().min(1),
  contentEn: z.string().min(1),
  isPublished: z.boolean(),
  noindex: z.boolean()
});

function parseStaticPageForm(formData: FormData) {
  return staticPageSchema.parse({
    slug: requiredString(formData.get("slug")),
    titleRu: requiredString(formData.get("titleRu")),
    titleEn: requiredString(formData.get("titleEn")),
    descriptionRu: optionalString(formData.get("descriptionRu")),
    descriptionEn: optionalString(formData.get("descriptionEn")),
    contentRu: requiredString(formData.get("contentRu")),
    contentEn: requiredString(formData.get("contentEn")),
    isPublished: boolFromForm(formData, "isPublished"),
    noindex: boolFromForm(formData, "noindex")
  });
}

export async function createStaticPageAction(formData: FormData) {
  const user = await requireAdminWrite("staticPages", formData);
  const data = parseStaticPageForm(formData);
  const page = await prisma.staticPage.create({ data });

  await auditAdminWrite({
    userId: user.id,
    action: AuditAction.CREATE,
    entityType: "StaticPage",
    entityId: page.id,
    message: "Created static page.",
    metadata: {
      slug: page.slug,
      isPublished: page.isPublished,
      noindex: page.noindex
    }
  });

  revalidatePath("/admin/static-pages");
  revalidatePath(`/ru/pages/${page.slug}`);
  revalidatePath(`/en/pages/${page.slug}`);
  redirect("/admin/static-pages");
}

export async function updateStaticPageAction(pageId: string, formData: FormData) {
  const user = await requireAdminWrite("staticPages", formData);
  const data = parseStaticPageForm(formData);
  const previous = await prisma.staticPage.findUnique({
    where: { id: pageId },
    select: { slug: true }
  });
  const page = await prisma.staticPage.update({
    where: { id: pageId },
    data
  });

  await auditAdminWrite({
    userId: user.id,
    action: AuditAction.UPDATE,
    entityType: "StaticPage",
    entityId: page.id,
    message: "Updated static page.",
    metadata: {
      slug: page.slug,
      isPublished: page.isPublished,
      noindex: page.noindex
    }
  });

  revalidatePath("/admin/static-pages");
  revalidatePath(`/ru/pages/${page.slug}`);
  revalidatePath(`/en/pages/${page.slug}`);
  if (previous?.slug && previous.slug !== page.slug) {
    revalidatePath(`/ru/pages/${previous.slug}`);
    revalidatePath(`/en/pages/${previous.slug}`);
  }
  redirect("/admin/static-pages");
}
