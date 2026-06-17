export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { landingPages } from "@/db/schema";

export async function GET() {
  try {
    const pages = await db.select().from(landingPages).limit(1);
    return NextResponse.json({ ok: true, pages });
  } catch (err: unknown) {
    const error = err as Error;
    return NextResponse.json({ error: error.message, stack: error.stack?.slice(0, 500) });
  }
}
