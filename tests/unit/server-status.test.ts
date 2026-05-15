import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { SERVER_STATUS_ALL_KEY, getServerStatusKey } from "@/lib/server-status/status-keys";

describe("server status cache keys", () => {
  it("uses stable Redis keys", () => {
    assert.equal(SERVER_STATUS_ALL_KEY, "rust24:server-status:all");
    assert.equal(getServerStatusKey("main"), "rust24:server-status:server:main");
  });
});
