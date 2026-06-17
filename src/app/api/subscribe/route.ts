export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email";

const bodySchema = z.object({
  email: z.string().email(),
  firstName: z.string().max(100).optional(),
  slug: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, firstName, slug } = bodySchema.parse(body);
    const sb = createAdminClient();

    // Look up landing page
    const { data: pages } = await sb
      .from("landing_pages")
      .select("*")
      .eq("slug", slug)
      .eq("published", true)
      .limit(1);

    const page = pages?.[0];
    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    // Check for duplicate
    const { data: existing } = await sb
      .from("subscribers")
      .select("id")
      .eq("creator_id", page.creator_id)
      .eq("email", email)
      .limit(1);

    if (existing?.[0]) {
      return NextResponse.json({ ok: true, duplicate: true });
    }

    // Create subscriber
    const { data: newSubs } = await sb
      .from("subscribers")
      .insert({ creator_id: page.creator_id, email, first_name: firstName ?? null, source: slug })
      .select();

    const subscriber = newSubs?.[0];
    if (!subscriber) throw new Error("Failed to create subscriber");

    // Get creator
    const { data: creators } = await sb
      .from("creators")
      .select("*")
      .eq("id", page.creator_id)
      .limit(1);
    const creator = creators?.[0];

    // Find active welcome sequence
    const { data: sequences } = await sb
      .from("email_sequences")
      .select("*")
      .eq("creator_id", page.creator_id)
      .eq("active", true)
      .eq("trigger", "on_subscribe")
      .limit(1);

    const sequence = sequences?.[0];

    if (sequence) {
      const { data: seqEmails } = await sb
        .from("sequence_emails")
        .select("*")
        .eq("sequence_id", sequence.id);

      if (seqEmails && seqEmails.length > 0) {
        const sends = seqEmails.map((e: { id: string; delay_days: number }) => {
          const scheduledFor = new Date();
          scheduledFor.setDate(scheduledFor.getDate() + e.delay_days);
          scheduledFor.setHours(9, 0, 0, 0);
          return { subscriber_id: subscriber.id, sequence_email_id: e.id, scheduled_for: scheduledFor.toISOString() };
        });
        await sb.from("email_sends").insert(sends);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.flatten() }, { status: 400 });
    }
    console.error("Subscribe error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
