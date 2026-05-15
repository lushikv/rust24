import { NextResponse } from "next/server";
import { getCurrentUser, toPublicSessionUser } from "@/lib/auth/current-user";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ authenticated: false });
  }

  return NextResponse.json({
    authenticated: true,
    user: toPublicSessionUser(user)
  });
}
