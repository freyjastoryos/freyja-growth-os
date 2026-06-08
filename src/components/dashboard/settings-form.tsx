"use client";

import { useState } from "react";

interface Creator {
  id: string;
  name: string | null;
  senderName: string | null;
  replyToEmail: string | null;
  timezone: string;
}

export function SettingsForm({ creator }: { creator: Creator }) {
  const [form, setForm] = useState({
    name: creator.name ?? "",
    senderName: creator.senderName ?? "",
    replyToEmail: creator.replyToEmail ?? "",
    timezone: creator.timezone ?? "UTC",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Field label="Your name">
        <input
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className={inputCls}
          placeholder="Jane Smith"
        />
      </Field>

      <Field label="Sender name" hint="Shown as the From name in emails">
        <input
          value={form.senderName}
          onChange={(e) => setForm((f) => ({ ...f, senderName: e.target.value }))}
          className={inputCls}
          placeholder="Jane from Writing Clarity"
        />
      </Field>

      <Field label="Reply-to email" hint="Where subscribers can reply">
        <input
          type="email"
          value={form.replyToEmail}
          onChange={(e) => setForm((f) => ({ ...f, replyToEmail: e.target.value }))}
          className={inputCls}
          placeholder="jane@example.com"
        />
      </Field>

      <button
        type="submit"
        disabled={saving}
        className="bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
      >
        {saved ? "Saved!" : saving ? "Saving…" : "Save settings"}
      </button>
    </form>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
      {children}
    </div>
  );
}

const inputCls =
  "w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent";
