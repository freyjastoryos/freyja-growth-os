import { notFound } from "next/navigation";
import { db } from "@/db";
import { landingPages } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { SubscribeForm } from "@/components/public/subscribe-form";

export default async function PublicLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [page] = await db
    .select()
    .from(landingPages)
    .where(and(eq(landingPages.slug, slug), eq(landingPages.published, true)));

  if (!page) notFound();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full">
        <div className="text-center mb-10 space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 leading-tight">
            {page.headline}
          </h1>
          {page.subheadline && (
            <p className="text-xl text-gray-500">{page.subheadline}</p>
          )}
          {page.bodyCopy && (
            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
              {page.bodyCopy}
            </p>
          )}
        </div>

        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8">
          <SubscribeForm slug={slug} ctaText={page.ctaText} />
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          No spam. Unsubscribe any time.
        </p>
      </div>
    </div>
  );
}
