import { z } from "zod";

export const couponCodeSchema = z
  .string()
  .min(1)
  .transform((value) => value.toUpperCase())
  .pipe(z.string().regex(/^[A-Z0-9_-]+$/, "Use uppercase letters, numbers, dashes, or underscores."));

export const couponAdminSchema = z
  .object({
    code: couponCodeSchema,
    discountPercent: z.coerce.number().int().min(1).max(100),
    usageLimit: z.number().int().positive().nullable(),
    expiresAt: z.date().nullable(),
    isActive: z.boolean(),
    appliesToAllProducts: z.boolean(),
    productIds: z.string().array()
  })
  .superRefine((data, context) => {
    if (!data.appliesToAllProducts && data.productIds.length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["productIds"],
        message: "Select at least one product or apply coupon to all products."
      });
    }
  });

export const saleAdminSchema = z
  .object({
    title: z.string().min(1),
    discountPercent: z.coerce.number().int().min(1).max(100),
    startsAt: z.date(),
    endsAt: z.date(),
    isActive: z.boolean(),
    appliesToAllProducts: z.boolean(),
    productIds: z.string().array()
  })
  .superRefine((data, context) => {
    if (data.startsAt >= data.endsAt) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endsAt"],
        message: "Sale end date must be after start date."
      });
    }

    if (!data.appliesToAllProducts && data.productIds.length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["productIds"],
        message: "Select at least one product or apply sale to all products."
      });
    }
  });
