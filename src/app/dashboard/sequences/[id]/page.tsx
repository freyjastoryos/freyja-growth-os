import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { emailSequences, sequenceEmails } from "@/db/schema";
import { and, eq, asc } from "drizzle-orm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function SequencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const [sequence] = await db
    .select()
    .from(emailSequences)
    .where(and(eq(emailSequences.id, id), eq(emailSequences.creatorId, user.id)));

  if (!sequence) notFound();

  const emails = await db
    .select()
    .from(sequenceEmails)
    .where(eq(sequenceEmails.sequenceId, id))
    .orderBy(asc(sequenceEmails.position));

  return (
    <div className="p-8 max-w-3xl">
      <Link href="/dashboard/sequences" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to sequences
      </Link>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{sequence.name}</h1>
        <p className="text-gray-500 mt-1">{emails.length} email{emails.length !== 1 ? "s" : ""} · triggered on subscribe</p>
      </div>
      {emails.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center text-gray-400">
          No emails yet. Add your first email to this sequence.
        </div>
      ) : (
        <div className="space-y-3">
          {emails.map((email) => (
            <div key={email.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{email.subject}</p>
                  <p className="text-sm text-gray-400 mt-0.5">
                    Day {email.delayDays} · Position {email.position}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
