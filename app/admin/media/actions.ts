"use server";

import { revalidatePath } from "next/cache";
import { AuditAction } from "@prisma/client";
import { z } from "zod";
import { auditAdminWrite, requireAdminWrite } from "@/lib/admin/action-utils";
import { optionalString, requiredString } from "@/lib/admin/validation";
import { prisma } from "@/lib/prisma";

const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm"
] as const;

const mediaSchema = z.object({
  filename: z
    .string()
    .min(1)
    .regex(/^[a-zA-Z0-9._-]+$/, "Use a safe filename."),
  originalName: z.string().min(1),
  mimeType: z.enum(allowedMimeTypes),
  sizeBytes: z.coerce.number().int().positive().max(50 * 1024 * 1024),
  url: z.string().min(1).refine((value) => value.startsWith("/") || /^https?:\/\//.test(value), {
    message: "Use an internal path or http(s) URL."
  }),
  previewUrl: z
    .string()
    .nullable()
    .refine((value) => value === null || value.startsWith("/") || /^https?:\/\//.test(value), {
      message: "Use an internal preview path or http(s) URL."
    }),
  attachedToType: z.string().nullable(),
  attachedToId: z.string().nullable()
});

function parseMediaForm(formData: FormData) {
  return mediaSchema.parse({
    filename: requiredString(formData.get("filename")),
    originalName: requiredString(formData.get("originalName")),
    mimeType: requiredString(formData.get("mimeType")),
    sizeBytes: requiredString(formData.get("sizeBytes")),
    url: requiredString(formData.get("url")),
    previewUrl: optionalString(formData.get("previewUrl")),
    attachedToType: optionalString(formData.get("attachedToType")),
    attachedToId: optionalString(formData.get("attachedToId"))
  });
}

export async function registerMediaFileAction(formData: FormData) {
  const user = await requireAdminWrite("media", formData);
  const data = parseMediaForm(formData);
  const media = await prisma.mediaFile.create({ data });

  await auditAdminWrite({
    userId: user.id,
    action: AuditAction.CREATE,
    entityType: "MediaFile",
    entityId: media.id,
    message: "Registered media file.",
    metadata: {
      filename: media.filename,
      mimeType: media.mimeType,
      sizeBytes: media.sizeBytes
    }
  });

  revalidatePath("/admin/media");
}
