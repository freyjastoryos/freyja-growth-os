import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl text-center space-y-6">
        <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 px-4 py-1.5 rounded-full text-sm font-medium">
          Now in early access
        </div>

        <h1 className="text-5xl font-bold tracking-tight text-gray-900">
          Grow your audience.{" "}
          <span className="text-brand-600">While you create.</span>
        </h1>

        <p className="text-xl text-gray-500 leading-relaxed">
          Freyja Growth OS is the autonomous marketing system for solo creators.
          Landing pages, email sequences, and AI-powered content — all running
          quietly in the background.
        </p>

        <div className="flex items-center justify-center gap-4 pt-4">
          <Link
            href="/auth/signup"
            className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
          >
            Start free
          </Link>
          <Link
            href="/auth/login"
            className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            Sign in
          </Link>
        </div>

        <p className="text-sm text-gray-400">
          Free plan includes 1 landing page and up to 500 subscribers.
        </p>
      </div>
    </main>
  );
}
