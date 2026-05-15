import "server-only";

import { DeliveryStatus } from "@prisma/client";
import { DeliveryError } from "@/lib/delivery/delivery-errors";

const allowedTransitions: Record<DeliveryStatus, DeliveryStatus[]> = {
  [DeliveryStatus.PENDING]: [DeliveryStatus.PROCESSING, DeliveryStatus.CANCELLED],
  [DeliveryStatus.PROCESSING]: [
    DeliveryStatus.COMPLETED,
    DeliveryStatus.FAILED,
    DeliveryStatus.RETRY_SCHEDULED
  ],
  [DeliveryStatus.RETRY_SCHEDULED]: [
    DeliveryStatus.PROCESSING,
    DeliveryStatus.CANCELLED
  ],
  [DeliveryStatus.FAILED]: [
    DeliveryStatus.RETRY_SCHEDULED,
    DeliveryStatus.CANCELLED
  ],
  [DeliveryStatus.COMPLETED]: [],
  [DeliveryStatus.CANCELLED]: []
};

export function canTransitionDeliveryStatus(from: DeliveryStatus, to: DeliveryStatus) {
  return allowedTransitions[from].includes(to);
}

export function assertDeliveryTransition(from: DeliveryStatus, to: DeliveryStatus) {
  if (!canTransitionDeliveryStatus(from, to)) {
    throw new DeliveryError(
      `Delivery transition ${from} -> ${to} is not allowed.`,
      409,
      "INVALID_DELIVERY_TRANSITION"
    );
  }
}
