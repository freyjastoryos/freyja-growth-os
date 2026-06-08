import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { db } from "@/db";
import {
  subscribers,
  landingPages,
  leadMagnets,
  emailSequences,
  sequenceEmails,
  emailSends,
  creators,
} from "@/db/schema";
import { sendEmail } from "@/lib/email";

const bodySchema = z.object({
  email: z.string().email(),
  firstName: z.string().max(100).optional(),
  slug: z.string(), // landing page slug
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, firstName, slug } = bodySchema.parse(body);

    // Look up the landing page
    const [page] = await db
      .select()
      .from(landingPages)
      .where(and(eq(landingPages.slug, slug), eq(landingPages.published, true)));

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    // Check for duplicate
    const [existing] = await db
      .select()
      .from(subscribers)
      .where(
        and(
          eq(subscribers.creatorId, page.creatorId),
          eq(subscribers.email, email)
        )
      );

    if (existing) {
      return NextResponse.json({ ok: true, duplicate: true });
    }

    // Create subscriber
    const [subscriber] = await db
      .insert(subscribers)
      .values({
        creatorId: page.creatorId,
        email,
        firstName: firstName ?? null,
        source: slug,
      })
      .returning();

    // Get creator for sender info
    const [creator] = await db
      .select()
      .from(creators)
      .where(eq(creators.id, page.creatorId));

    // Deliver lead magnet if set
    if (page.leadMagnetId) {
      const [magnet] = await db
        .select()
        .from(leadMagnets)
        .where(eq(leadMagnets.id, page.leadMagnetId));

      if (magnet) {
        await sendEmail({
          to: email,
          from: creator?.senderName
            ? `${creator.senderName} <noreply@freyjaos.com>`
            : "Freyja Growth OS <noreply@freyjaos.com>",
          replyTo: creator?.replyToEmail ?? undefined,
          subject: `Here's your ${magnet.title}`,
          html: `
            <p>Hi${firstName ? ` ${firstName}` : ""},</p>
            <p>Thanks for signing up! Here's your free resource:</p>
            <p><a href="${magnet.fileUrl}" style="background:#7c3aed;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;display:inline-block;">Download: ${magnet.title}</a></p>
            <p>Keep an eye on your inbox — more good stuff is coming.</p>
          `,
        });
      }
    }

    // Queue welcome sequence emails
    const [sequence] = await db
      .select()
      .from(emailSequences)
      .where(
        and(
          eq(emailSequences.creatorId, page.creatorId),
          eq(emailSequences.active, true),
          eq(emailSequences.trigger, "on_subscribe")
        )
      );

    if (sequence) {
      const emails = await db
        .select()
        .from(sequenceEmails)
        .where(eq(sequenceEmails.sequenceId, sequence.id));

      const sends = emails.map((email) => {
        const scheduledFor = new Date();
        scheduledFor.setDate(scheduledFor.getDate() + email.delayDays);
        scheduledFor.setHours(9, 0, 0, 0); // send at 9am

        return {
          subscriberId: subscriber.id,
          sequenceEmailId: email.id,
          scheduledFor,
        };
      });

      if (sends.length > 0) {
        await db.insert(emailSends).values(sends);
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
