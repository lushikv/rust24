import "server-only";

import type { Metadata } from "next";
import { createNoIndexMetadata } from "@/lib/seo";

export function createAdminMetadata(title: string): Metadata {
  return createNoIndexMetadata({
    locale: "ru",
    path: "/admin",
    title: `${title} | RUST24 Admin`,
    description: "Private RUST24 admin area."
  });
}
