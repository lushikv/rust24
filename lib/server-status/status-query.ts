import "server-only";

import type { Server } from "@/types/content";
import type { PublicServerStatus } from "@/types/server-status";

export async function queryServerStatus(server: Server): Promise<PublicServerStatus> {
  return {
    serverId: server.id,
    slug: server.id,
    status: server.status,
    online: server.online,
    queue: server.queue ?? 0,
    capacity: server.capacity,
    capturedAt: new Date().toISOString(),
    source: "mock"
  };
}
