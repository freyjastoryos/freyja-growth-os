import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { creators } from "@/db/schema";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Provision creator record if first login
      await db
        .insert(creators)
        .values({
          id: data.user.id,
          email: data.user.email!,
          name: (data.user.user_metadata?.name as string) ?? null,
        })
        .onConflictDoNothing();
    }
  }

  return NextResponse.redirect(`${origin}/dashboard`);
}
