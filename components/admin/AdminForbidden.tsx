import { AdminLink } from "@/components/admin/AdminLink";

export function AdminForbidden({ type }: { type: "login" | "forbidden" }) {
  const isLogin = type === "login";

  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-2xl items-center justify-center px-4">
      <div className="rounded-md border border-white/10 bg-white/[0.04] p-8 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-300">
          RUST24 Admin
        </p>
        <h1 className="mt-3 text-3xl font-black text-white">
          {isLogin ? "Login required" : "Access denied"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          {isLogin
            ? "Admin pages require an authenticated Steam session with an admin role."
            : "Your account does not have permission to access this admin area."}
        </p>
        <AdminLink
          className="mt-6 inline-flex rounded-md bg-orange-500 px-4 py-3 text-sm font-black text-black transition hover:bg-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-300"
          href={isLogin ? "/api/auth/steam?locale=ru&returnTo=/admin" : "/ru"}
        >
          {isLogin ? "Login with Steam" : "Back to site"}
        </AdminLink>
      </div>
    </div>
  );
}
