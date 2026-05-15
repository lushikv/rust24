import { NextRequest, NextResponse } from "next/server";
import { apiRateLimited } from "@/lib/api/responses";
import { getAdminAccess } from "@/lib/admin/require-admin";
import { DeliveryError, toDeliveryError } from "@/lib/delivery/delivery-errors";
import { cancelDeliveryJob } from "@/lib/delivery/delivery-service";
import { assertSameOriginRequest } from "@/lib/security/origin";
import { checkRequestRateLimit } from "@/lib/security/rate-limit";

type RouteProps = {
  params: Promise<{ jobId: string }>;
};

export const dynamic = "force-dynamic";

function errorResponse(error: unknown) {
  const deliveryError = error instanceof DeliveryError ? error : toDeliveryError(error);
  return NextResponse.json(
    { error: deliveryError.message, code: deliveryError.code },
    { status: deliveryError.status }
  );
}

export async function POST(request: NextRequest, { params }: RouteProps) {
  try {
    const origin = assertSameOriginRequest(request);
    if (!origin.ok) return origin.response;
    const limited = await checkRequestRateLimit({ request, keyPrefix: "admin-delivery-cancel", limit: 30, windowSeconds: 60 });
    if (!limited.allowed) return apiRateLimited();

    const access = await getAdminAccess("delivery");

    if (access.status === "unauthenticated") {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    if (access.status === "forbidden") {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const { jobId } = await params;
    const job = await cancelDeliveryJob(jobId, access.user.id);
    return NextResponse.json({ job });
  } catch (error) {
    return errorResponse(error);
  }
}
