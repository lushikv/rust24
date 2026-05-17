import type { MetadataRoute } from "next";
import { routing } from "@/config/locales";
import { getBaseUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const localizedPrivateRoutes = routing.locales.flatMap((locale) => [
    `/${locale}/profile`,
    `/${locale}/cart`,
    `/${locale}/checkout`
  ]);

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/api",
        "/profile",
        "/cart",
        "/checkout",
        ...localizedPrivateRoutes
      ]
    },
    sitemap: `${getBaseUrl()}/sitemap.xml`
  };
}
