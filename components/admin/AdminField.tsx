import type { ReactNode } from "react";

export function AdminField({
  label,
  name,
  defaultValue,
  type = "text",
  required,
  children
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: string;
  required?: boolean;
  children?: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-zinc-200">{label}</span>
      {children ?? (
        <input
          className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-300/30"
          defaultValue={defaultValue ?? ""}
          name={name}
          required={required}
          type={type}
        />
      )}
    </label>
  );
}

export function AdminTextarea({
  label,
  name,
  defaultValue,
  required,
  rows = 4
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  required?: boolean;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-zinc-200">{label}</span>
      <textarea
        className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-300/30"
        defaultValue={defaultValue ?? ""}
        name={name}
        required={required}
        rows={rows}
      />
    </label>
  );
}

export function AdminCheckbox({
  label,
  name,
  defaultChecked
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
}) {
  return (
    <label className="flex items-center gap-3 rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm font-bold text-zinc-200">
      <input className="h-4 w-4 accent-orange-500" defaultChecked={defaultChecked} name={name} type="checkbox" />
      {label}
    </label>
  );
}

export function AdminSelect({
  label,
  name,
  defaultValue,
  children
}: {
  label: string;
  name: string;
  defaultValue?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-zinc-200">{label}</span>
      <select
        className="mt-2 w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-300/30"
        defaultValue={defaultValue}
        name={name}
      >
        {children}
      </select>
    </label>
  );
}
