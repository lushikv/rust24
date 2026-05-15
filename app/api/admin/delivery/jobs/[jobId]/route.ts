import { NextResponse } from "next/server";
import { getAdminAccess } from "@/lib/admin/require-admin";
import { getDeliveryJobById } from "@/lib/delivery/delivery-service";
import { DeliveryError, toDeliveryError } from "@/lib/delivery/delivery-errors";

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

export async function GET(_request: Request, { params }: RouteProps) {
  try {
    const access = await getAdminAccess("delivery");

    if (access.status === "unauthenticated") {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    if (access.status === "forbidden") {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    const { jobId } = await params;
    const job = await getDeliveryJobById(jobId);

    if (!job) {
      return NextResponse.json({ error: "Delivery job not found." }, { status: 404 });
    }

    return NextResponse.json({ job });
  } catch (error) {
    return errorResponse(error);
  }
}
