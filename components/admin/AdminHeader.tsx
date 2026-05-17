import { AdminLink } from "@/components/admin/AdminLink";
import type { AuthUser } from "@/lib/auth/types";

export function AdminHeader({ user }: { user: AuthUser }) {
  return (
    <header className="border-b border-white/10 bg-[#0b0d12] px-5 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-300">
            Admin MVP
          </p>
          <p className="mt-1 text-sm text-zinc-400">
            Signed in as <span className="font-bold text-white">{user.displayName}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <AdminLink
            className="rounded-md border border-white/10 px-3 py-2 text-sm font-bold text-zinc-200 transition hover:border-orange-300 hover:text-orange-200"
            href="/ru"
          >
            Public site
          </AdminLink>
          <AdminLink
            className="rounded-md bg-orange-500 px-3 py-2 text-sm font-black text-black transition hover:bg-orange-400"
            href="/api/auth/logout?returnTo=/ru"
          >
            Logout
          </AdminLink>
        </div>
      </div>
    </header>
  );
}
