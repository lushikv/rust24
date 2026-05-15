import type { ServerStatus } from "@/types/content";

export type ServerStatusSource = "redis" | "database" | "mock";

export type PublicServerStatus = {
  serverId: string;
  slug: string;
  status: ServerStatus;
  online: number;
  queue: number;
  capacity: number;
  capturedAt: string;
  source: ServerStatusSource;
};

export type ServerStatusCachePayload = {
  updatedAt: string;
  statuses: PublicServerStatus[];
};

export type ServerStatusApiResponse = {
  ok: true;
  source: ServerStatusSource;
  updatedAt: string;
  servers: PublicServerStatus[];
};
