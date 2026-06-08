import { createClient } from "@/lib/supabase/server";
import { db } from "@/db";
import { creators } from "@/db/schema";
import { eq } from "drizzle-orm";
import { SettingsForm } from "@/components/dashboard/settings-form";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const [creator] = await db
    .select()
    .from(creators)
    .where(eq(creators.id, user.id));

  return (
    <div className="p-8 max-w-xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Sender details and preferences.</p>
      </div>
      {creator && <SettingsForm creator={creator} />}
    </div>
  );
}
