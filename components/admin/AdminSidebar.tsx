import Link from "next/link";

const items = [
  ["Dashboard", "/admin"],
  ["Servers", "/admin/servers"],
  ["Products", "/admin/products"],
  ["Orders", "/admin/orders"],
  ["Payments", "/admin/payments"],
  ["Delivery", "/admin/delivery"],
  ["Bans", "/admin/bans"],
  ["FAQ", "/admin/faq"],
  ["Rules", "/admin/rules"],
  ["Money Race", "/admin/money-race"],
  ["Support", "/admin/support"],
  ["Audit Log", "/admin/audit-log"]
] as const;

export function AdminSidebar() {
  return (
    <aside className="border-b border-white/10 bg-black/20 p-4 lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
      <Link className="block text-xl font-black text-white" href="/admin">
        <span className="text-orange-500">RUST</span>24 Admin
      </Link>
      <nav className="mt-6" aria-label="Admin navigation">
        <ul className="grid gap-1 sm:grid-cols-2 lg:grid-cols-1">
          {items.map(([label, href]) => (
            <li key={href}>
              <Link
                className="block rounded-md px-3 py-2 text-sm font-bold text-zinc-300 transition hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-orange-300"
                href={href}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
