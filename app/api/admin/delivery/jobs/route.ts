import { NextResponse } from "next/server";
import { getAdminAccess } from "@/lib/admin/require-admin";
import { getAdminDeliveryJobs } from "@/lib/admin/repositories/delivery";

export const dynamic = "force-dynamic";

export async function GET() {
  const access = await getAdminAccess("delivery");

  if (access.status === "unauthenticated") {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  if (access.status === "forbidden") {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const result = await getAdminDeliveryJobs();

  if (!result.available) {
    return NextResponse.json({ error: "Database is unavailable.", jobs: [] }, { status: 503 });
  }

  return NextResponse.json({ jobs: result.data });
}
