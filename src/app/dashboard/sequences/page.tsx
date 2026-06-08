import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { emailSequences, sequenceEmails } from "@/db/schema";
import { eq, count } from "drizzle-orm";
import { Plus, Mail } from "lucide-react";

export default async function SequencesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const sequences = await db
    .select()
    .from(emailSequences)
    .where(eq(emailSequences.creatorId, user.id));

  const emailCounts = await Promise.all(
    sequences.map(async (seq) => {
      const [result] = await db
        .select({ count: count() })
        .from(sequenceEmails)
        .where(eq(sequenceEmails.sequenceId, seq.id));
      return { id: seq.id, count: result?.count ?? 0 };
    })
  );

  const countMap = Object.fromEntries(emailCounts.map((e) => [e.id, e.count]));

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Email Sequences</h1>
          <p className="text-gray-500 mt-1">Automated emails sent after someone subscribes.</p>
        </div>
        <Link
          href="/dashboard/sequences/new"
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          New sequence
        </Link>
      </div>

      {sequences.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-16 text-center">
          <Mail className="h-8 w-8 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 mb-4">No sequences yet.</p>
          <Link href="/dashboard/sequences/new" className="text-brand-600 font-medium hover:underline">
            Create your welcome sequence →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {sequences.map((seq) => (
            <Link
              key={seq.id}
              href={`/dashboard/sequences/${seq.id}` as never}
              className="block bg-white rounded-xl border border-gray-200 p-5 hover:border-brand-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{seq.name}</p>
                  <p className="text-sm text-gray-400 mt-0.5">
                    {countMap[seq.id]} email{countMap[seq.id] !== 1 ? "s" : ""} · triggered on subscribe
                  </p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  seq.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                }`}>
                  {seq.active ? "Active" : "Paused"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
