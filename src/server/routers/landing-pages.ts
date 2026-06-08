import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { landingPages } from "@/db/schema";

const upsertSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z
    .string()
    .min(3)
    .max(60)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  headline: z.string().min(5).max(120),
  subheadline: z.string().max(200).optional(),
  bodyCopy: z.string().max(2000).optional(),
  ctaText: z.string().min(2).max(60).default("Get Free Access"),
  leadMagnetId: z.string().uuid().nullable().optional(),
  published: z.boolean().default(false),
});

export const landingPagesRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select()
      .from(landingPages)
      .where(eq(landingPages.creatorId, ctx.user.id));
  }),

  byId: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [page] = await ctx.db
        .select()
        .from(landingPages)
        .where(
          and(
            eq(landingPages.id, input.id),
            eq(landingPages.creatorId, ctx.user.id)
          )
        );
      return page ?? null;
    }),

  bySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx }) => {
      // Used by the public landing page renderer
      return null; // resolved in the page itself via direct DB query
    }),

  upsert: protectedProcedure
    .input(upsertSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...values } = input;

      if (id) {
        const [updated] = await ctx.db
          .update(landingPages)
          .set({ ...values, updatedAt: new Date() })
          .where(
            and(
              eq(landingPages.id, id),
              eq(landingPages.creatorId, ctx.user.id)
            )
          )
          .returning();
        return updated;
      }

      const [created] = await ctx.db
        .insert(landingPages)
        .values({ ...values, creatorId: ctx.user.id })
        .returning();
      return created;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(landingPages)
        .where(
          and(
            eq(landingPages.id, input.id),
            eq(landingPages.creatorId, ctx.user.id)
          )
        );
    }),
});
