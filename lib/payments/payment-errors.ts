import "server-only";

export class PaymentError extends Error {
  constructor(
    message: string,
    public status = 400,
    public code = "PAYMENT_ERROR"
  ) {
    super(message);
  }
}

export function toPaymentError(error: unknown) {
  if (error instanceof PaymentError) {
    return error;
  }

  if (process.env.NODE_ENV !== "production") {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[payments] ${message}`);
  }

  return new PaymentError("Payment database is unavailable.", 503, "PAYMENT_DB_UNAVAILABLE");
}
