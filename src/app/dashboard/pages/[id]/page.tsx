import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { landingPages } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { LandingPageForm } from "@/components/dashboard/landing-page-form";

export default async function EditPagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const [page] = await db
    .select()
    .from(landingPages)
    .where(and(eq(landingPages.id, id), eq(landingPages.creatorId, user.id)));

  if (!page) notFound();

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit landing page</h1>
        <p className="text-gray-500 mt-1">/{page.slug}</p>
      </div>
      <LandingPageForm initialData={page} />
    </div>
  );
}
