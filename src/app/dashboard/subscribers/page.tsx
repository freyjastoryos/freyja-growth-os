import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { subscribers } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { formatDistanceToNow } from "@/lib/date";

export default async function SubscribersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const subs = await db
    .select()
    .from(subscribers)
    .where(eq(subscribers.creatorId, user.id))
    .orderBy(desc(subscribers.subscribedAt));

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Subscribers</h1>
        <p className="text-gray-500 mt-1">{subs.length.toLocaleString()} total</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {subs.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            No subscribers yet. Share your landing page to get started.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Email</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Name</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Source</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Status</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {subs.map((sub) => (
                <tr key={sub.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-gray-900 font-medium">{sub.email}</td>
                  <td className="px-5 py-3 text-gray-600">{sub.firstName ?? "—"}</td>
                  <td className="px-5 py-3 text-gray-400 text-xs">{sub.source ?? "direct"}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      sub.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-500"
                    }`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-400">{formatDistanceToNow(sub.subscribedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
