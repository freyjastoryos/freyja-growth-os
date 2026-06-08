import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardNav } from "@/components/dashboard/nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-60 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-5 border-b border-gray-100">
          <Link href="/dashboard" className="text-xl font-bold text-brand-600">
            Freyja
          </Link>
          <p className="text-xs text-gray-400 mt-0.5">Growth OS</p>
        </div>
        <DashboardNav />
        <div className="p-4 mt-auto border-t border-gray-100">
          <p className="text-xs text-gray-400 truncate">{user.email}</p>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
