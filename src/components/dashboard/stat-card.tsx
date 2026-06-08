interface StatCardProps {
  label: string;
  value: number;
  trend?: "week" | "month";
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="text-4xl font-bold text-gray-900 mt-2">
        {value.toLocaleString()}
      </p>
    </div>
  );
}
