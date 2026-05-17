import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { encryptSecret } from "@/lib/security/encryption";

const originalEncryptionKey = process.env.ADMIN_SECRET_ENCRYPTION_KEY;

afterEach(() => {
  if (originalEncryptionKey === undefined) {
    delete process.env.ADMIN_SECRET_ENCRYPTION_KEY;
    return;
  }

  process.env.ADMIN_SECRET_ENCRYPTION_KEY = originalEncryptionKey;
});

describe("admin secret encryption", () => {
  it("stores secrets as an opaque encrypted envelope", () => {
    process.env.ADMIN_SECRET_ENCRYPTION_KEY = "12345678901234567890123456789012";

    const encrypted = encryptSecret("rcon-password-example");

    assert.match(encrypted, /^v1:[A-Za-z0-9+/=]+:[A-Za-z0-9+/=]+:[A-Za-z0-9+/=]+$/);
    assert.equal(encrypted.includes("rcon-password-example"), false);
  });

  it("fails safely when the encryption key is missing", () => {
    delete process.env.ADMIN_SECRET_ENCRYPTION_KEY;

    assert.throws(() => encryptSecret("secret"), /ADMIN_SECRET_ENCRYPTION_KEY is not configured/);
  });
});
