import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { subscribers, emailSends } from "@/db/schema";
import { eq, and, count, gte, desc } from "drizzle-orm";
import { StatCard } from "@/components/dashboard/stat-card";
import { RecentSubscribers } from "@/components/dashboard/recent-subscribers";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [totalResult] = await db
    .select({ count: count() })
    .from(subscribers)
    .where(
      and(eq(subscribers.creatorId, user.id), eq(subscribers.status, "active"))
    );

  const [last30Result] = await db
    .select({ count: count() })
    .from(subscribers)
    .where(
      and(
        eq(subscribers.creatorId, user.id),
        eq(subscribers.status, "active"),
        gte(subscribers.subscribedAt, thirtyDaysAgo)
      )
    );

  const [last7Result] = await db
    .select({ count: count() })
    .from(subscribers)
    .where(
      and(
        eq(subscribers.creatorId, user.id),
        eq(subscribers.status, "active"),
        gte(subscribers.subscribedAt, sevenDaysAgo)
      )
    );

  const recentSubs = await db
    .select()
    .from(subscribers)
    .where(eq(subscribers.creatorId, user.id))
    .orderBy(desc(subscribers.subscribedAt))
    .limit(10);

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
        <p className="text-gray-500 mt-1">Your audience growth at a glance.</p>
      </div>

      <div className="grid grid-cols-3 gap-5 mb-10">
        <StatCard
          label="Total subscribers"
          value={totalResult?.count ?? 0}
        />
        <StatCard
          label="New this month"
          value={last30Result?.count ?? 0}
          trend="month"
        />
        <StatCard
          label="New this week"
          value={last7Result?.count ?? 0}
          trend="week"
        />
      </div>

      <RecentSubscribers subscribers={recentSubs} />
    </div>
  );
}
