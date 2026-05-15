import "server-only";

import { createHash } from "node:crypto";

export function hashRequest(value: unknown) {
  return createHash("sha256")
    .update(JSON.stringify(value))
    .digest("hex");
}
