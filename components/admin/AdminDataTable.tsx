import type { ReactNode } from "react";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";

export type AdminDataTableColumn<T> = {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
};

export function AdminDataTable<T>({
  columns,
  rows,
  emptyTitle = "No records",
  emptyDescription = "There is nothing to display yet."
}: {
  columns: AdminDataTableColumn<T>[];
  rows: T[];
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (rows.length === 0) {
    return <AdminEmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="overflow-x-auto rounded-md border border-white/10">
      <table className="min-w-full divide-y divide-white/10 text-sm">
        <thead className="bg-white/[0.04] text-left text-xs uppercase tracking-[0.12em] text-zinc-500">
          <tr>
            {columns.map((column) => (
              <th className="px-4 py-3 font-black" key={column.key} scope="col">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {rows.map((row, index) => (
            <tr className="bg-white/[0.02]" key={index}>
              {columns.map((column) => (
                <td className="px-4 py-3 text-zinc-300" key={column.key}>
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
