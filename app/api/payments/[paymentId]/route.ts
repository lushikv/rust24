import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { PaymentError, toPaymentError } from "@/lib/payments/payment-errors";
import { getPaymentById } from "@/lib/payments/payment-service";

type RouteProps = {
  params: Promise<{ paymentId: string }>;
};

export const dynamic = "force-dynamic";

function errorResponse(error: unknown) {
  if (error instanceof PaymentError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.status }
    );
  }

  const paymentError = toPaymentError(error);
  return NextResponse.json(
    { error: paymentError.message, code: paymentError.code },
    { status: paymentError.status }
  );
}

export async function GET(_request: Request, { params }: RouteProps) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Authentication is required." }, { status: 401 });
    }

    const { paymentId } = await params;
    const payment = await getPaymentById(paymentId, user.id);

    return NextResponse.json({ payment });
  } catch (error) {
    return errorResponse(error);
  }
}
