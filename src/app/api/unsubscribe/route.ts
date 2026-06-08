export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { subscribers } from "@/db/schema";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  await db
    .update(subscribers)
    .set({ status: "unsubscribed" })
    .where(eq(subscribers.id, id));

  return new NextResponse(
    `<!DOCTYPE html><html><body style="font-family:sans-serif;text-align:center;padding:60px">
      <h2>You've been unsubscribed.</h2>
      <p>You won't receive any more emails from this creator.</p>
    </body></html>`,
    { headers: { "Content-Type": "text/html" } }
  );
}
