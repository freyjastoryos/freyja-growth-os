export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { creators } from "@/db/schema";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  name: z.string().max(100).optional(),
  senderName: z.string().max(100).optional(),
  replyToEmail: z.string().email().optional().or(z.literal("")),
  timezone: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = schema.parse(await req.json());

  await db
    .update(creators)
    .set({
      name: body.name ?? undefined,
      senderName: body.senderName ?? undefined,
      replyToEmail: body.replyToEmail || null,
      updatedAt: new Date(),
    })
    .where(eq(creators.id, user.id));

  return NextResponse.json({ ok: true });
}
