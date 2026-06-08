import { z } from "zod";
import Anthropic from "@anthropic-ai/sdk";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { repurposedContent } from "@/db/schema";

const client = new Anthropic();

const PLATFORMS = [
  { name: "twitter", maxChars: 280, label: "X / Twitter" },
  { name: "linkedin", maxChars: 3000, label: "LinkedIn" },
  { name: "threads", maxChars: 500, label: "Threads" },
];

export const repurposeRouter = createTRPCRouter({
  generate: protectedProcedure
    .input(
      z.object({
        sourceContent: z.string().min(50).max(10000),
        sourceType: z.enum(["blog_post", "newsletter", "essay", "other"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const prompt = `You are a social media strategist helping a creator repurpose their content.

The creator wrote this ${input.sourceType}:

<content>
${input.sourceContent}
</content>

Create social media posts for each platform below. Each post should:
- Capture the most compelling insight or hook from the original
- Feel native to that platform's culture and tone
- Stand alone without requiring the original content
- NOT use generic phrases like "Great post!" or "Check this out"

Return a JSON array with this exact structure:
[
  { "platform": "twitter", "text": "...", "characterCount": 0 },
  { "platform": "linkedin", "text": "...", "characterCount": 0 },
  { "platform": "threads", "text": "...", "characterCount": 0 }
]

Constraints:
- Twitter: max 280 characters
- LinkedIn: professional tone, can be 150-300 words, use line breaks
- Threads: conversational, max 500 characters

Return only valid JSON, no other text.`;

      const message = await client.messages.create({
        model: "claude-sonnet-4-6",
        max_tokens: 2048,
        messages: [{ role: "user", content: prompt }],
      });

      const textContent = message.content.find((c) => c.type === "text");
      if (!textContent || textContent.type !== "text") {
        throw new Error("No text response from AI");
      }

      const generatedPosts = JSON.parse(textContent.text) as Array<{
        platform: string;
        text: string;
        characterCount: number;
      }>;

      // Update character counts accurately
      const postsWithCounts = generatedPosts.map((p) => ({
        ...p,
        characterCount: p.text.length,
      }));

      // Save to DB
      const [saved] = await ctx.db
        .insert(repurposedContent)
        .values({
          creatorId: ctx.user.id,
          sourceContent: input.sourceContent,
          sourceType: input.sourceType,
          generatedPosts: postsWithCounts,
        })
        .returning();

      return { id: saved.id, posts: postsWithCounts };
    }),

  history: protectedProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ ctx, input }) => {
      const { eq, desc } = await import("drizzle-orm");
      return ctx.db
        .select()
        .from(repurposedContent)
        .where(eq(repurposedContent.creatorId, ctx.user.id))
        .orderBy(desc(repurposedContent.createdAt))
        .limit(input.limit);
    }),
});
