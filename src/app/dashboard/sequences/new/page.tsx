import { NewSequenceForm } from "@/components/dashboard/new-sequence-form";

export default function NewSequencePage() {
  return (
    <div className="p-8 max-w-xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create email sequence</h1>
        <p className="text-gray-500 mt-1">Set up an automated email series for new subscribers.</p>
      </div>
      <NewSequenceForm />
    </div>
  );
}
