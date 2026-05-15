import "server-only";

import {
  AuditAction,
  DeliveryAttemptStatus,
  DeliveryStatus,
  DeliveryTarget,
  DeliveryTrigger,
  OrderStatus,
  type DeliveryJob
} from "@prisma/client";
import { writeAuditLog } from "@/lib/admin/audit";
import { prisma } from "@/lib/prisma";
import { assertDeliveryTransition } from "@/lib/delivery/delivery-state";
import { DeliveryError } from "@/lib/delivery/delivery-errors";
import { createDeliveryCommandPreview } from "@/lib/delivery/delivery-preview";
import type {
  CreateDeliveryJobsInput,
  DeliveryEligibilityResult,
  DeliveryJobAttemptDTO,
  DeliveryJobDTO,
  DeliveryProcessorResult
} from "@/lib/delivery/types";

function assertDatabaseConfigured() {
  if (!process.env.DATABASE_URL) {
    throw new DeliveryError("Database is required for delivery operations.", 503, "DATABASE_UNAVAILABLE");
  }
}

function mapAttempt(attempt: {
  id: string;
  status: DeliveryAttemptStatus;
  message: string | null;
  commandPreview: string | null;
  errorCode: string | null;
  startedAt: Date;
  finishedAt: Date | null;
}): DeliveryJobAttemptDTO {
  return {
    id: attempt.id,
    status: attempt.status,
    message: attempt.message,
    commandPreview: attempt.commandPreview,
    errorCode: attempt.errorCode,
    startedAt: attempt.startedAt.toISOString(),
    finishedAt: attempt.finishedAt?.toISOString() ?? null
  };
}

function mapJob(job: DeliveryJob & {
  attempts?: {
    id: string;
    status: DeliveryAttemptStatus;
    message: string | null;
    commandPreview: string | null;
    errorCode: string | null;
    startedAt: Date;
    finishedAt: Date | null;
  }[];
}): DeliveryJobDTO {
  const attempts = job.attempts?.map(mapAttempt) ?? [];

  return {
    id: job.id,
    orderId: job.orderId,
    orderItemId: job.orderItemId,
    userId: job.userId,
    productId: job.productId,
    target: job.target,
    trigger: job.trigger,
    status: job.status,
    productSlug: job.productSlug,
    productTitle: job.productTitle,
    quantity: job.quantity,
    steamId: job.steamId,
    serverSlug: job.serverSlug,
    commandPreview: job.commandPreview,
    errorMessage: job.errorMessage,
    availableAfter: job.availableAfter?.toISOString() ?? null,
    completedAt: job.completedAt?.toISOString() ?? null,
    createdAt: job.createdAt.toISOString(),
    updatedAt: job.updatedAt.toISOString(),
    latestAttempt: attempts[0] ?? null,
    attempts
  };
}

function getOrderEligibility(status: OrderStatus, trigger: DeliveryTrigger): DeliveryEligibilityResult {
  if (trigger === DeliveryTrigger.PAYMENT_CONFIRMED) {
    return {
      eligible: false,
      reason: "Payment-confirmed delivery is disabled until real payment success exists."
    };
  }

  if (status === OrderStatus.CANCELLED || status === OrderStatus.EXPIRED) {
    return {
      eligible: false,
      reason: `Order status ${status} is not eligible for delivery jobs.`
    };
  }

  return { eligible: true };
}

export async function createDeliveryJobsForOrder({
  orderId,
  trigger,
  actorUserId
}: CreateDeliveryJobsInput) {
  assertDatabaseConfigured();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: { include: { steamProfile: true } },
      items: true,
      deliveryJobs: true
    }
  });

  if (!order) {
    throw new DeliveryError("Order not found.", 404, "ORDER_NOT_FOUND");
  }

  const eligibility = getOrderEligibility(order.status, trigger);
  if (!eligibility.eligible) {
    return {
      created: [],
      eligibility
    };
  }

  const existingItemIds = new Set(
    order.deliveryJobs.map((job) => job.orderItemId).filter(Boolean)
  );

  const jobs = await Promise.all(
    order.items
      .filter((item) => !existingItemIds.has(item.id))
      .map((item) => {
        const target = DeliveryTarget.MANUAL;
        const preview = createDeliveryCommandPreview({
          productSlug: item.productSlug,
          quantity: item.quantity,
          steamId: order.user?.steamProfile?.steamId,
          target
        });

        return prisma.deliveryJob.create({
          data: {
            orderId: order.id,
            orderItemId: item.id,
            userId: order.userId,
            productId: item.productId,
            target,
            trigger,
            productSlug: item.productSlug,
            productTitle: item.productTitle,
            quantity: item.quantity,
            steamId: order.user?.steamProfile?.steamId,
            commandPreview: preview.commandPreview,
            metadata: { warning: preview.warning }
          },
          include: { attempts: { orderBy: { startedAt: "desc" }, take: 1 } }
        });
      })
  );

  await writeAuditLog({
    userId: actorUserId,
    action: AuditAction.CREATE,
    entityType: "DeliveryJob",
    entityId: order.id,
    message: `Created ${jobs.length} delivery job skeletons for order.`
  });

  return {
    created: jobs.map(mapJob),
    eligibility
  };
}

export async function getDeliveryJobsForOrder(orderId: string) {
  assertDatabaseConfigured();

  const jobs = await prisma.deliveryJob.findMany({
    where: { orderId },
    orderBy: { createdAt: "desc" },
    include: { attempts: { orderBy: { startedAt: "desc" } } }
  });

  return jobs.map(mapJob);
}

export async function getDeliveryJobsForUser(userId: string) {
  assertDatabaseConfigured();

  const jobs = await prisma.deliveryJob.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { attempts: { orderBy: { startedAt: "desc" } } }
  });

  return jobs.map(mapJob);
}

export async function getDeliveryJobById(jobId: string) {
  assertDatabaseConfigured();

  const job = await prisma.deliveryJob.findUnique({
    where: { id: jobId },
    include: { attempts: { orderBy: { startedAt: "desc" } } }
  });

  return job ? mapJob(job) : null;
}

async function getRawJob(jobId: string) {
  const job = await prisma.deliveryJob.findUnique({ where: { id: jobId } });
  if (!job) throw new DeliveryError("Delivery job not found.", 404, "DELIVERY_JOB_NOT_FOUND");
  return job;
}

export async function cancelDeliveryJob(jobId: string, actorUserId: string) {
  assertDatabaseConfigured();
  const job = await getRawJob(jobId);
  assertDeliveryTransition(job.status, DeliveryStatus.CANCELLED);

  const updated = await prisma.deliveryJob.update({
    where: { id: jobId },
    data: { status: DeliveryStatus.CANCELLED },
    include: { attempts: { orderBy: { startedAt: "desc" } } }
  });

  await writeAuditLog({
    userId: actorUserId,
    action: AuditAction.UPDATE,
    entityType: "DeliveryJob",
    entityId: jobId,
    message: "Cancelled delivery job skeleton."
  });

  return mapJob(updated);
}

export async function retryDeliveryJob(jobId: string, actorUserId: string) {
  assertDatabaseConfigured();
  const job = await getRawJob(jobId);
  assertDeliveryTransition(job.status, DeliveryStatus.RETRY_SCHEDULED);

  const updated = await prisma.deliveryJob.update({
    where: { id: jobId },
    data: {
      status: DeliveryStatus.RETRY_SCHEDULED,
      trigger: DeliveryTrigger.SYSTEM_RETRY,
      availableAfter: new Date()
    },
    include: { attempts: { orderBy: { startedAt: "desc" } } }
  });

  await writeAuditLog({
    userId: actorUserId,
    action: AuditAction.UPDATE,
    entityType: "DeliveryJob",
    entityId: jobId,
    message: "Scheduled delivery job retry skeleton."
  });

  return mapJob(updated);
}

export async function processDeliveryJobDryRun(
  jobId: string,
  actorUserId?: string
): Promise<DeliveryProcessorResult> {
  assertDatabaseConfigured();
  const job = await getRawJob(jobId);

  if (job.status === DeliveryStatus.COMPLETED || job.status === DeliveryStatus.CANCELLED) {
    throw new DeliveryError("Terminal delivery jobs cannot be dry-run processed.", 409, "DELIVERY_TERMINAL");
  }

  const preview = createDeliveryCommandPreview({
    productSlug: job.productSlug,
    quantity: job.quantity,
    steamId: job.steamId,
    serverSlug: job.serverSlug,
    target: job.target
  });

  await prisma.deliveryJobAttempt.create({
    data: {
      jobId,
      status: DeliveryAttemptStatus.SKIPPED,
      message: "Dry-run only. Real delivery and RCON commands are not implemented.",
      commandPreview: preview.commandPreview,
      finishedAt: new Date(),
      metadata: { warning: preview.warning }
    }
  });

  await writeAuditLog({
    userId: actorUserId,
    action: AuditAction.SYSTEM,
    entityType: "DeliveryJob",
    entityId: jobId,
    message: "Recorded delivery dry-run attempt without side effects."
  });

  return {
    jobId,
    status: job.status,
    attemptStatus: DeliveryAttemptStatus.SKIPPED,
    message: "Dry-run recorded. No commands were sent and no items were granted."
  };
}
