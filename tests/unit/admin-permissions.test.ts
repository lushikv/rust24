import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { UserRole } from "@prisma/client";
import { canAccessAdminSection, isAdminRole } from "@/lib/admin/permissions";

describe("admin permissions", () => {
  it("allows only admin and owner as full admin roles", () => {
    assert.equal(isAdminRole(UserRole.ADMIN), true);
    assert.equal(isAdminRole(UserRole.OWNER), true);
    assert.equal(isAdminRole(UserRole.MODERATOR), false);
    assert.equal(isAdminRole(UserRole.USER), false);
  });

  it("limits moderator access to safe sections", () => {
    assert.equal(canAccessAdminSection(UserRole.MODERATOR, "bans"), true);
    assert.equal(canAccessAdminSection(UserRole.MODERATOR, "support"), true);
    assert.equal(canAccessAdminSection(UserRole.MODERATOR, "payments"), false);
    assert.equal(canAccessAdminSection(UserRole.USER, "bans"), false);
  });
});
