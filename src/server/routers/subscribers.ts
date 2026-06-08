import { z } from "zod";
import { eq, and, desc, count, gte } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { subscribers } from "@/db/schema";

export const subscribersRouter = createTRPCRouter({
  list: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.db
        .select()
        .from(subscribers)
        .where(eq(subscribers.creatorId, ctx.user.id))
        .orderBy(desc(subscribers.subscribedAt))
        .limit(input.limit)
        .offset(input.offset);
    }),

  stats: protectedProcedure.query(async ({ ctx }) => {
    const [total] = await ctx.db
      .select({ count: count() })
      .from(subscribers)
      .where(
        and(
          eq(subscribers.creatorId, ctx.user.id),
          eq(subscribers.status, "active")
        )
      );

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [last30] = await ctx.db
      .select({ count: count() })
      .from(subscribers)
      .where(
        and(
          eq(subscribers.creatorId, ctx.user.id),
          eq(subscribers.status, "active"),
          gte(subscribers.subscribedAt, thirtyDaysAgo)
        )
      );

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [last7] = await ctx.db
      .select({ count: count() })
      .from(subscribers)
      .where(
        and(
          eq(subscribers.creatorId, ctx.user.id),
          eq(subscribers.status, "active"),
          gte(subscribers.subscribedAt, sevenDaysAgo)
        )
      );

    return {
      total: total?.count ?? 0,
      last30Days: last30?.count ?? 0,
      last7Days: last7?.count ?? 0,
    };
  }),
});
