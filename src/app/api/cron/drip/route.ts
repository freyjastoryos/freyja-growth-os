export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/email";

export async function GET(req: NextRequest) {
  const cronRunId = `drip-${Date.now()}`;
  console.log(`[${cronRunId}] Drip cron started at ${new Date().toISOString()}`);

  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.warn(`[${cronRunId}] Unauthorized request — header missing or secret mismatch`);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sb = createAdminClient();
  const now = new Date().toISOString();

  const { data: due, error: fetchError } = await sb
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

  if (fetchError) {
    console.error(`[${cronRunId}] Failed to fetch due emails from Supabase:`, fetchError);
    return NextResponse.json({ error: "DB fetch failed", detail: fetchError.message }, { status: 500 });
  }

  const totalDue = due?.length ?? 0;
  console.log(`[${cronRunId}] Emails due to send: ${totalDue}`);

  let sent = 0;
  let failed = 0;
  let skipped = 0;

  for (const row of (due ?? [])) {
    const seqEmail = (Array.isArray(row.sequence_emails)
      ? row.sequence_emails[0]
      : row.sequence_emails) as { subject: string; body_html: string; body_text?: string } | null;

    const subscriber = (Array.isArray(row.subscribers)
      ? row.subscribers[0]
      : row.subscribers) as { email: string; first_name?: string; status: string; creator_id: string } | null;

    if (!seqEmail || !subscriber || subscriber.status !== "active") {
      console.log(`[${cronRunId}] Skipping send ${row.id} — missing data or subscriber inactive`);
      skipped++;
      continue;
    }

    try {
      const { data: creators, error: creatorError } = await sb
        .from("creators")
        .select("sender_name, reply_to_email")
        .eq("id", subscriber.creator_id)
        .limit(1);

      if (creatorError) {
        console.warn(`[${cronRunId}] Could not fetch creator for send ${row.id}:`, creatorError.message);
      }

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

      await sb
        .from("email_sends")
        .update({ status: "sent", sent_at: new Date().toISOString() })
        .eq("id", row.id);

      console.log(`[${cronRunId}] Sent ${row.id} → ${subscriber.email}`);
      sent++;
    } catch (err) {
      console.error(`[${cronRunId}] Failed to send ${row.id}:`, err);
      await sb.from("email_sends").update({ status: "failed" }).eq("id", row.id);
      failed++;
    }
  }

  console.log(`[${cronRunId}] Drip cron complete — due: ${totalDue}, sent: ${sent}, skipped: ${skipped}, failed: ${failed}`);
  return NextResponse.json({ cronRunId, due: totalDue, sent, skipped, failed });
}
