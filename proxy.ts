import createMiddleware from "next-intl/middleware";
import { routing } from "@/config/locales";

export default createMiddleware(routing);

export const config = {
  matcher: ["/", "/((?!admin|api|_next|_vercel|.*\\..*).*)"]
};
