import "server-only";

import { DeliveryTarget } from "@prisma/client";
import type { DeliveryCommandPreview } from "@/lib/delivery/types";

export function createDeliveryCommandPreview({
  productSlug,
  quantity,
  steamId,
  serverSlug,
  target
}: {
  productSlug: string;
  quantity: number;
  steamId?: string | null;
  serverSlug?: string | null;
  target: DeliveryTarget;
}): DeliveryCommandPreview {
  if (target === DeliveryTarget.GAME_SERVER) {
    return {
      target,
      commandPreview: `DRY_RUN grant ${steamId ?? "<steam-id>"} ${productSlug} x${quantity} on ${serverSlug ?? "<server>"}`,
      warning: "Dry-run preview only. Real RCON delivery is not implemented."
    };
  }

  if (target === DeliveryTarget.STEAM_INVENTORY) {
    return {
      target,
      commandPreview: `DRY_RUN steam_inventory ${steamId ?? "<steam-id>"} ${productSlug} x${quantity}`,
      warning: "Dry-run preview only. Steam inventory delivery is not implemented."
    };
  }

  return {
    target,
    commandPreview: `DRY_RUN manual_delivery ${productSlug} x${quantity}`,
    warning: "Manual delivery is not implemented in Stage 12."
  };
}
