import { DeliveryStatus, DeliveryTarget } from "@prisma/client";
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DeliveryError } from "@/lib/delivery/delivery-errors";
import { assertDeliveryTransition, canTransitionDeliveryStatus } from "@/lib/delivery/delivery-state";
import { createDeliveryCommandPreview } from "@/lib/delivery/delivery-preview";

describe("delivery safety", () => {
  it("allows only configured delivery transitions", () => {
    assert.equal(canTransitionDeliveryStatus(DeliveryStatus.PENDING, DeliveryStatus.PROCESSING), true);
    assert.equal(canTransitionDeliveryStatus(DeliveryStatus.COMPLETED, DeliveryStatus.PROCESSING), false);
    assert.throws(() => assertDeliveryTransition(DeliveryStatus.CANCELLED, DeliveryStatus.PROCESSING), DeliveryError);
  });

  it("creates dry-run command previews only", () => {
    const preview = createDeliveryCommandPreview({
      productSlug: "starter-pass",
      quantity: 1,
      steamId: "76561198000000000",
      serverSlug: "main",
      target: DeliveryTarget.GAME_SERVER
    });

    assert.match(preview.commandPreview, /DRY_RUN/);
    assert.match(preview.warning, /not implemented/);
  });
});
