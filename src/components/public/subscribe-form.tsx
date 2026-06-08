"use client";

import { useState } from "react";

export function SubscribeForm({ slug, ctaText }: { slug: string; ctaText: string }) {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, firstName, slug }),
    });

    if (res.ok) {
      const data = await res.json();
      setStatus("success");
      setMessage(
        data.duplicate
          ? "You're already subscribed!"
          : "You're in! Check your inbox for the download."
      );
    } else {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-4">
        <div className="text-3xl mb-3">🎉</div>
        <p className="text-gray-700 font-medium">{message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="First name (optional)"
        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        placeholder="Your email address"
        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
      />
      {status === "error" && (
        <p className="text-red-600 text-sm">{message}</p>
      )}
      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white py-3 rounded-lg font-semibold transition-colors"
      >
        {status === "loading" ? "Subscribing…" : ctaText}
      </button>
    </form>
  );
}
