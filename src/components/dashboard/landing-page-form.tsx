"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/trpc/client";

interface InitialData {
  id: string;
  slug: string;
  headline: string;
  subheadline: string | null;
  bodyCopy: string | null;
  ctaText: string;
  published: boolean;
}

export function LandingPageForm({ initialData }: { initialData?: InitialData }) {
  const router = useRouter();
  const [form, setForm] = useState({
    slug: initialData?.slug ?? "",
    headline: initialData?.headline ?? "",
    subheadline: initialData?.subheadline ?? "",
    bodyCopy: initialData?.bodyCopy ?? "",
    ctaText: initialData?.ctaText ?? "Get Free Access",
    published: initialData?.published ?? false,
  });
  const [error, setError] = useState("");

  const upsert = trpc.landingPages.upsert.useMutation({
    onSuccess: () => router.push("/dashboard/pages"),
    onError: (err) => setError(err.message),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    upsert.mutate({
      id: initialData?.id,
      ...form,
      subheadline: form.subheadline || undefined,
      bodyCopy: form.bodyCopy || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <Field label="Page slug" hint="Used in the URL: /p/your-slug">
        <input
          value={form.slug}
          onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") }))}
          required
          className={inputCls}
          placeholder="my-free-guide"
        />
      </Field>

      <Field label="Headline" hint="Your main offer or hook">
        <input
          value={form.headline}
          onChange={(e) => setForm((f) => ({ ...f, headline: e.target.value }))}
          required
          className={inputCls}
          placeholder="Get the free guide to writing your first novel"
        />
      </Field>

      <Field label="Subheadline" hint="Optional supporting line">
        <input
          value={form.subheadline}
          onChange={(e) => setForm((f) => ({ ...f, subheadline: e.target.value }))}
          className={inputCls}
          placeholder="Everything I wish I knew before I started"
        />
      </Field>

      <Field label="Body copy" hint="Optional longer description">
        <textarea
          value={form.bodyCopy}
          onChange={(e) => setForm((f) => ({ ...f, bodyCopy: e.target.value }))}
          rows={5}
          className={inputCls}
          placeholder="Describe what subscribers get and why it matters..."
        />
      </Field>

      <Field label="Button text">
        <input
          value={form.ctaText}
          onChange={(e) => setForm((f) => ({ ...f, ctaText: e.target.value }))}
          required
          className={inputCls}
          placeholder="Get Free Access"
        />
      </Field>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={form.published}
          onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
          className="w-4 h-4 accent-brand-600"
        />
        <span className="text-sm font-medium text-gray-700">
          Publish this page (make it publicly accessible)
        </span>
      </label>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={upsert.isPending}
          className="bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
        >
          {upsert.isPending ? "Saving…" : "Save page"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors"
        >
          Cancel
        </button>
      </div>
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
