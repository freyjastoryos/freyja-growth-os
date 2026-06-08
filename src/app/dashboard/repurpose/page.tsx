"use client";

import { useState } from "react";
import { trpc } from "@/trpc/client";
import { Copy, Check, Sparkles } from "lucide-react";

const PLATFORMS: Record<string, { label: string; color: string }> = {
  twitter: { label: "X / Twitter", color: "bg-black" },
  linkedin: { label: "LinkedIn", color: "bg-blue-600" },
  threads: { label: "Threads", color: "bg-gray-900" },
};

export default function RepurposePage() {
  const [content, setContent] = useState("");
  const [sourceType, setSourceType] = useState<"blog_post" | "newsletter" | "essay" | "other">("essay");
  const [posts, setPosts] = useState<Array<{ platform: string; text: string; characterCount: number }>>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const generate = trpc.repurpose.generate.useMutation({
    onSuccess: (data) => setPosts(data.posts),
  });

  function copy(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Repurpose Content</h1>
        <p className="text-gray-500 mt-1">
          Paste any piece of writing. Get social posts ready to publish.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5 mb-8">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Content type</label>
          <select
            value={sourceType}
            onChange={(e) => setSourceType(e.target.value as typeof sourceType)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="essay">Essay</option>
            <option value="newsletter">Newsletter</option>
            <option value="blog_post">Blog post</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700">Your content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
            placeholder="Paste your essay, newsletter, or blog post here..."
          />
          <p className="text-xs text-gray-400">{content.length} characters</p>
        </div>

        <button
          onClick={() => generate.mutate({ sourceContent: content, sourceType })}
          disabled={generate.isPending || content.length < 50}
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
        >
          <Sparkles className="h-4 w-4" />
          {generate.isPending ? "Generating…" : "Generate posts"}
        </button>

        {generate.error && (
          <p className="text-sm text-red-600">{generate.error.message}</p>
        )}
      </div>

      {posts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Generated posts</h2>
          {posts.map((post) => {
            const platform = PLATFORMS[post.platform];
            return (
              <div key={post.platform} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${platform?.color ?? "bg-gray-400"}`} />
                    <span className="text-sm font-medium text-gray-700">
                      {platform?.label ?? post.platform}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">{post.characterCount} chars</span>
                    <button
                      onClick={() => copy(post.text, post.platform)}
                      className="flex items-center gap-1.5 text-xs text-brand-600 hover:text-brand-700 font-medium"
                    >
                      {copiedId === post.platform ? (
                        <><Check className="h-3.5 w-3.5" /> Copied</>
                      ) : (
                        <><Copy className="h-3.5 w-3.5" /> Copy</>
                      )}
                    </button>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {post.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
