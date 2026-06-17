import postgres from "postgres";

const sql = postgres(
  "postgresql://postgres:FoNbM8t7Z8GwbXcP@db.eyhaoowvqberdyeaeqyp.supabase.co:5432/postgres"
);

const FILE_URL =
  "https://eyhaoowvqberdyeaeqyp.supabase.co/storage/v1/object/public/lead-magnets/ava-vale/one-more-chapter.docx";

const AUTH_USER_ID = "4d537f0d-f093-40a6-9f6f-8c75045c7e27";

const WELCOME_HTML = `<div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 40px 24px; color: #2D2A28;">
  <p style="font-size: 20px; font-style: italic; color: #B8927A; margin-bottom: 32px;">Most readers never find it.</p>
  <p>Hi {{firstName}},</p>
  <p>Welcome inside the Secret Door. I'm so glad you're here.</p>
  <p>As promised — here is your exclusive story, set after the final pages of <em>The Writer and the Waitress</em>.</p>
  <p style="text-align: center; margin: 40px 0;">
    <a href="${FILE_URL}" style="background: #A67868; color: #FDF7F2; padding: 16px 32px; border-radius: 3px; text-decoration: none; font-family: Arial, sans-serif; font-size: 12px; letter-spacing: 0.2em; text-transform: uppercase;">Read One More Chapter</a>
  </p>
  <p>Clara and Julian are waiting for you.</p>
  <p style="margin-top: 48px;">With love,</p>
  <p style="font-family: Georgia, serif; font-size: 28px; color: #B8927A; font-style: italic;">Ava Vale</p>
  <hr style="border: none; border-top: 1px solid rgba(200,178,138,0.3); margin: 40px 0;">
  <p style="font-size: 11px; color: #999; text-align: center;">You're receiving this because you joined the Ava Vale Inner Circle.<br><a href="{{unsubscribeUrl}}" style="color: #B8927A;">Unsubscribe</a></p>
</div>`;

async function run() {
  // 1. Creator (id = Supabase auth user id)
  let creatorId;
  const existing = await sql`SELECT id FROM creators WHERE id = ${AUTH_USER_ID} LIMIT 1`;
  if (existing.length > 0) {
    creatorId = existing[0].id;
    console.log("Existing creator:", creatorId);
  } else {
    const [row] = await sql`
      INSERT INTO creators (id, email, name, sender_name, reply_to_email, created_at, updated_at)
      VALUES (${AUTH_USER_ID}, 'dharma.clientdesk@gmail.com', 'Ava Vale', 'Ava Vale', 'dharma.clientdesk@gmail.com', now(), now())
      RETURNING id`;
    creatorId = row.id;
    console.log("Created creator:", creatorId);
  }

  // 2. Lead magnet
  const [magnet] = await sql`
    INSERT INTO lead_magnets (id, creator_id, title, file_url, file_type, created_at)
    VALUES (gen_random_uuid(), ${creatorId}, 'One More Chapter', ${FILE_URL}, 'pdf', now())
    RETURNING id, title`;
  console.log("Created lead magnet:", magnet.title, magnet.id);

  // 3. Landing page (headline is required, not title)
  const [page] = await sql`
    INSERT INTO landing_pages (id, creator_id, slug, headline, lead_magnet_id, published, created_at, updated_at)
    VALUES (gen_random_uuid(), ${creatorId}, 'ava-vale-inner-circle', 'You found the Secret Door', ${magnet.id}, true, now(), now())
    ON CONFLICT (slug) DO UPDATE SET lead_magnet_id = ${magnet.id}, published = true
    RETURNING id, slug`;
  console.log("Landing page:", page.slug, page.id);

  // 4. Email sequence (no updated_at column)
  const [seq] = await sql`
    INSERT INTO email_sequences (id, creator_id, name, trigger, active, created_at)
    VALUES (gen_random_uuid(), ${creatorId}, 'Ava Vale Welcome', 'on_subscribe', true, now())
    RETURNING id`;
  console.log("Created sequence:", seq.id);

  // 5. Welcome email — check sequence_emails columns
  const cols = await sql`
    SELECT column_name FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'sequence_emails'`;
  console.log("sequence_emails columns:", cols.map(c => c.column_name));

  const [email] = await sql`
    INSERT INTO sequence_emails (id, sequence_id, subject, body_html, delay_days, position, created_at)
    VALUES (gen_random_uuid(), ${seq.id}, 'You found the Secret Door 🗝️', ${WELCOME_HTML}, 0, 1, now())
    RETURNING id`;
  console.log("Created welcome email:", email.id);

  console.log("\n✅ All done. The flow is live.");
  await sql.end();
}

run().catch(async (e) => {
  console.error(e.message);
  await sql.end();
});
