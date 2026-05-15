import type { ReactNode } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import type { AuthUser } from "@/lib/auth/types";

export function AdminShell({
  children,
  user
}: {
  children: ReactNode;
  user: AuthUser;
}) {
  return (
    <div className="min-h-screen bg-[#08090d] text-white">
      <div className="lg:flex">
        <AdminSidebar />
        <div className="min-w-0 flex-1">
          <AdminHeader user={user} />
          <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
