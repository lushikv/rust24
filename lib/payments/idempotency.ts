import "server-only";

import { IdempotencyScope, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { PaymentError } from "@/lib/payments/payment-errors";
import { hashRequest } from "@/lib/payments/idempotency-hash";

export { IdempotencyScope };
export { hashRequest };

export async function runWithIdempotency<T extends Prisma.InputJsonValue>({
  key,
  scope,
  request,
  handler
}: {
  key: string;
  scope: IdempotencyScope;
  request: unknown;
  handler: () => Promise<T>;
}): Promise<T> {
  const requestHash = hashRequest(request);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60);
  const existing = await prisma.idempotencyKey.findUnique({
    where: {
      key_scope: { key, scope }
    }
  });

  if (existing && existing.expiresAt > new Date()) {
    if (existing.requestHash !== requestHash) {
      throw new PaymentError("Idempotency key was already used with a different request.", 409, "IDEMPOTENCY_CONFLICT");
    }

    if (existing.response) {
      return existing.response as T;
    }
  }

  await prisma.idempotencyKey.upsert({
    where: {
      key_scope: { key, scope }
    },
    update: {
      requestHash,
      lockedAt: new Date(),
      expiresAt,
      response: Prisma.JsonNull
    },
    create: {
      key,
      scope,
      requestHash,
      lockedAt: new Date(),
      expiresAt
    }
  });

  const response = await handler();

  await prisma.idempotencyKey.update({
    where: {
      key_scope: { key, scope }
    },
    data: {
      response,
      lockedAt: null
    }
  });

  return response;
}
