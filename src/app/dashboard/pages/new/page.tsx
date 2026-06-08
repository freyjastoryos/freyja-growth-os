import { LandingPageForm } from "@/components/dashboard/landing-page-form";

export default function NewPagePage() {
  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create landing page</h1>
        <p className="text-gray-500 mt-1">Set up your subscriber capture page.</p>
      </div>
      <LandingPageForm />
    </div>
  );
}
