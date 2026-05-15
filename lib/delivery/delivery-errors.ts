export class DeliveryError extends Error {
  constructor(
    message: string,
    public readonly status = 400,
    public readonly code = "DELIVERY_ERROR"
  ) {
    super(message);
    this.name = "DeliveryError";
  }
}

export function toDeliveryError(error: unknown) {
  if (error instanceof DeliveryError) {
    return error;
  }

  if (process.env.NODE_ENV !== "production") {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[delivery] ${message}`);
  }

  return new DeliveryError("Delivery service is unavailable.", 503, "DELIVERY_UNAVAILABLE");
}
