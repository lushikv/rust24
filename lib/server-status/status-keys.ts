export const SERVER_STATUS_ALL_KEY = "rust24:server-status:all";

export function getServerStatusKey(slug: string) {
  return `rust24:server-status:server:${slug}`;
}
