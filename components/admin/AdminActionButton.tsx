import type { ReactNode } from "react";

export function AdminActionButton({
  children,
  action,
  fields
}: {
  children: ReactNode;
  action: (formData: FormData) => void | Promise<void>;
  fields?: Record<string, string>;
}) {
  return (
    <form action={action}>
      {fields
        ? Object.entries(fields).map(([name, value]) => (
            <input key={name} name={name} type="hidden" value={value} />
          ))
        : null}
      <button
        className="rounded-md border border-white/10 px-3 py-2 text-xs font-black text-zinc-200 transition hover:border-orange-300 hover:text-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-300"
        type="submit"
      >
        {children}
      </button>
    </form>
  );
}
