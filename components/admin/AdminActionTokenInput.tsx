import { ADMIN_ACTION_TOKEN_FIELD, createAdminActionToken } from "@/lib/admin/action-token";
import { readSession } from "@/lib/auth/session";

export async function AdminActionTokenInput() {
  const session = await readSession();

  if (!session) return null;

  return (
    <input
      name={ADMIN_ACTION_TOKEN_FIELD}
      type="hidden"
      value={createAdminActionToken(session)}
    />
  );
}
