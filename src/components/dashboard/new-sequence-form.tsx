"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/trpc/client";

export function NewSequenceForm() {
  const [name, setName] = useState("");
  const router = useRouter();

  const create = trpc.sequences.createSequence.useMutation({
    onSuccess: (seq) => router.push(`/dashboard/sequences/${seq.id}`),
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); create.mutate({ name }); }} className="space-y-6">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700">Sequence name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          placeholder="Welcome Sequence"
        />
      </div>
      <button
        type="submit"
        disabled={create.isPending}
        className="bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
      >
        {create.isPending ? "Creating…" : "Create sequence"}
      </button>
    </form>
  );
}
