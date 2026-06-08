import { NextRequest, NextResponse } from "next/server";
import { eq, lte, and } from "drizzle-orm";
import { db } from "@/db";
import {
  emailSends,
  sequenceEmails,
  subscribers,
  creators,
} from "@/db/schema";
import { sendEmail } from "@/lib/email";

// Called by Vercel Cron every hour: vercel.json -> "0 * * * *"
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  // Find all queued sends that are due
  const due = await db
    .select({
      send: emailSends,
      email: sequenceEmails,
      subscriber: subscribers,
      creator: creators,
    })
    .from(emailSends)
    .innerJoin(sequenceEmails, eq(emailSends.sequenceEmailId, sequenceEmails.id))
    .innerJoin(subscribers, eq(emailSends.subscriberId, subscribers.id))
    .innerJoin(creators, eq(subscribers.creatorId, creators.id))
    .where(
      and(
        eq(emailSends.status, "queued"),
        lte(emailSends.scheduledFor, now),
        eq(subscribers.status, "active")
      )
    )
    .limit(50); // process in batches

  let sent = 0;
  let failed = 0;

  for (const row of due) {
    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://freyjaos.com";
      const unsubLink = `${appUrl}/api/unsubscribe?id=${row.subscriber.id}`;

      const htmlWithUnsub = `
        ${row.email.bodyHtml}
        <hr style="margin:40px 0;border:none;border-top:1px solid #e5e7eb"/>
        <p style="color:#9ca3af;font-size:12px;text-align:center">
          Don't want these emails? <a href="${unsubLink}" style="color:#9ca3af">Unsubscribe</a>
        </p>
      `;

      await sendEmail({
        to: row.subscriber.email,
        from: row.creator.senderName
          ? `${row.creator.senderName} <noreply@freyjaos.com>`
          : "Freyja Growth OS <noreply@freyjaos.com>",
        replyTo: row.creator.replyToEmail ?? undefined,
        subject: row.email.subject,
        html: htmlWithUnsub,
        text: row.email.bodyText ?? undefined,
      });

      await db
        .update(emailSends)
        .set({ status: "sent", sentAt: new Date() })
        .where(eq(emailSends.id, row.send.id));

      sent++;
    } catch (err) {
      console.error(`Failed to send email ${row.send.id}:`, err);
      await db
        .update(emailSends)
        .set({ status: "failed" })
        .where(eq(emailSends.id, row.send.id));
      failed++;
    }
  }

  return NextResponse.json({ sent, failed });
}
