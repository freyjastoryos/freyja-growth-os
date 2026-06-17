export const runtime = "nodejs";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const sb = createAdminClient();
  await sb.from("subscribers").update({ status: "unsubscribed" }).eq("id", id);

  return NextResponse.redirect(new URL("/goodbye", req.url));
}
