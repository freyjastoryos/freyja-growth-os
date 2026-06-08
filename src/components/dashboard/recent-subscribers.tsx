import { formatDistanceToNow } from "@/lib/date";

interface Subscriber {
  id: string;
  email: string;
  firstName: string | null;
  source: string | null;
  subscribedAt: Date;
}

export function RecentSubscribers({ subscribers }: { subscribers: Subscriber[] }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent subscribers</h2>
      {subscribers.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">
          No subscribers yet. Share your landing page to get started.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Email</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Name</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Source</th>
                <th className="text-left px-5 py-3 text-gray-500 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub) => (
                <tr key={sub.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-5 py-3 text-gray-900">{sub.email}</td>
                  <td className="px-5 py-3 text-gray-500">{sub.firstName ?? "—"}</td>
                  <td className="px-5 py-3 text-gray-400 text-xs">{sub.source ?? "direct"}</td>
                  <td className="px-5 py-3 text-gray-400">{formatDistanceToNow(sub.subscribedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
