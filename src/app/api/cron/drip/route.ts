export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sb = createAdminClient();
  const now = new Date().toISOString();

  const { data: due } = await sb
    .from("email_sends")
    .select(`
      id,
      subscriber_id,
      sequence_email_id,
      sequence_emails ( subject, body_html, body_text ),
      subscribers ( email, first_name, status, creator_id ),
      status
    `)
    .eq("status", "queued")
    .lte("scheduled_for", now)
    .limit(50);

  let sent = 0;
  let failed = 0;

  for (const row of (due ?? [])) {
    const seqEmail = row.sequence_emails as { subject: string; body_html: string; body_text?: string } | null;
    const subscriber = row.subscribers as { email: string; first_name?: string; status: string; creator_id: string } | null;

    if (!seqEmail || !subscriber || subscriber.status !== "active") continue;

    try {
      const { data: creators } = await sb
        .from("creators")
        .select("sender_name, reply_to_email")
        .eq("id", subscriber.creator_id)
        .limit(1);
      const creator = creators?.[0];

      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://avavaleauthor.com";
      const unsubLink = `${appUrl}/api/unsubscribe?id=${row.subscriber_id}`;

      const html = seqEmail.body_html
        .replace(/\{\{firstName\}\}/g, subscriber.first_name || "there")
        .replace(/\{\{unsubscribeUrl\}\}/g, unsubLink);

      await sendEmail({
        to: subscriber.email,
        from: creator?.sender_name
          ? `${creator.sender_name} <welcome@avavaleauthor.com>`
          : "Ava Vale <welcome@avavaleauthor.com>",
        replyTo: creator?.reply_to_email ?? undefined,
        subject: seqEmail.subject,
        html,
        text: seqEmail.body_text ?? undefined,
      });

      await sb.from("email_sends").update({ status: "sent", sent_at: new Date().toISOString() }).eq("id", row.id);
      sent++;
    } catch (err) {
      console.error(`Failed to send ${row.id}:`, err);
      await sb.from("email_sends").update({ status: "failed" }).eq("id", row.id);
      failed++;
    }
  }

  return NextResponse.json({ sent, failed });
}
