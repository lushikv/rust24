import type {
  DeliveryAttemptStatus,
  DeliveryStatus,
  DeliveryTarget,
  DeliveryTrigger
} from "@prisma/client";

export type DeliveryCommandPreview = {
  target: DeliveryTarget;
  commandPreview: string;
  warning: string;
};

export type DeliveryJobAttemptDTO = {
  id: string;
  status: DeliveryAttemptStatus;
  message: string | null;
  commandPreview: string | null;
  errorCode: string | null;
  startedAt: string;
  finishedAt: string | null;
};

export type DeliveryJobDTO = {
  id: string;
  orderId: string;
  orderItemId: string | null;
  userId: string | null;
  productId: string | null;
  target: DeliveryTarget;
  trigger: DeliveryTrigger;
  status: DeliveryStatus;
  productSlug: string;
  productTitle: string;
  quantity: number;
  steamId: string | null;
  serverSlug: string | null;
  commandPreview: string | null;
  errorMessage: string | null;
  availableAfter: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  latestAttempt: DeliveryJobAttemptDTO | null;
  attempts?: DeliveryJobAttemptDTO[];
};

export type CreateDeliveryJobsInput = {
  orderId: string;
  trigger: DeliveryTrigger;
  actorUserId?: string;
};

export type DeliveryEligibilityResult = {
  eligible: boolean;
  reason?: string;
};

export type DeliveryProcessorResult = {
  jobId: string;
  status: DeliveryStatus;
  attemptStatus: DeliveryAttemptStatus;
  message: string;
};
