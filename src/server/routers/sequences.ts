import { z } from "zod";
import { eq, and, asc } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { emailSequences, sequenceEmails } from "@/db/schema";

export const sequencesRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select()
      .from(emailSequences)
      .where(eq(emailSequences.creatorId, ctx.user.id));
  }),

  withEmails: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const [sequence] = await ctx.db
        .select()
        .from(emailSequences)
        .where(
          and(
            eq(emailSequences.id, input.id),
            eq(emailSequences.creatorId, ctx.user.id)
          )
        );
      if (!sequence) return null;

      const emails = await ctx.db
        .select()
        .from(sequenceEmails)
        .where(eq(sequenceEmails.sequenceId, input.id))
        .orderBy(asc(sequenceEmails.position));

      return { ...sequence, emails };
    }),

  createSequence: protectedProcedure
    .input(z.object({ name: z.string().min(2).max(100) }))
    .mutation(async ({ ctx, input }) => {
      const [seq] = await ctx.db
        .insert(emailSequences)
        .values({ name: input.name, creatorId: ctx.user.id })
        .returning();
      return seq;
    }),

  upsertEmail: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid().optional(),
        sequenceId: z.string().uuid(),
        position: z.number().int().min(1),
        delayDays: z.number().int().min(0),
        subject: z.string().min(2).max(200),
        bodyHtml: z.string().min(10),
        bodyText: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify the sequence belongs to this creator
      const [seq] = await ctx.db
        .select()
        .from(emailSequences)
        .where(
          and(
            eq(emailSequences.id, input.sequenceId),
            eq(emailSequences.creatorId, ctx.user.id)
          )
        );
      if (!seq) throw new Error("Sequence not found");

      const { id, ...values } = input;
      if (id) {
        const [updated] = await ctx.db
          .update(sequenceEmails)
          .set(values)
          .where(eq(sequenceEmails.id, id))
          .returning();
        return updated;
      }

      const [created] = await ctx.db
        .insert(sequenceEmails)
        .values(values)
        .returning();
      return created;
    }),

  deleteEmail: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(sequenceEmails)
        .where(eq(sequenceEmails.id, input.id));
    }),
});
