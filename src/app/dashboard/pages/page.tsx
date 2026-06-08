import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { landingPages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Plus, ExternalLink, Edit } from "lucide-react";

export default async function PagesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const pages = await db
    .select()
    .from(landingPages)
    .where(eq(landingPages.creatorId, user.id));

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Landing Pages</h1>
          <p className="text-gray-500 mt-1">Build pages that capture subscribers.</p>
        </div>
        <Link
          href="/dashboard/pages/new"
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          New page
        </Link>
      </div>

      {pages.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-16 text-center">
          <p className="text-gray-400 mb-4">You haven't created any landing pages yet.</p>
          <Link
            href="/dashboard/pages/new"
            className="text-brand-600 font-medium hover:underline"
          >
            Create your first page →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {pages.map((page) => (
            <div
              key={page.id}
              className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-gray-900">{page.headline}</p>
                  {page.published ? (
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">
                      Live
                    </span>
                  ) : (
                    <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full font-medium">
                      Draft
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400 mt-0.5">/p/{page.slug}</p>
              </div>
              <div className="flex items-center gap-2">
                {page.published && (
                  <a
                    href={`/p/${page.slug}`}
                    target="_blank"
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                <Link
                  href={`/dashboard/pages/${page.id}`}
                  className="flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-700 font-medium px-3 py-1.5 rounded-lg hover:bg-brand-50 transition-colors"
                >
                  <Edit className="h-3.5 w-3.5" />
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
