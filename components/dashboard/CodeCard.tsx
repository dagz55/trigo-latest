export default function CodeCard({ data }: { data: any }) {
  return (
    <div className="rounded-xl border p-4 bg-white shadow hover:shadow-md transition">
      <h3 className="text-lg font-semibold text-indigo-600 mb-2">{data.code}</h3>
      <p className="text-sm text-gray-700">
        Status: <span className="font-medium">{data.status}</span>
      </p>
      <p className="text-xs text-gray-400 mt-1">
        Created: {new Date(data.created_at).toLocaleString()}
      </p>
    </div>
  );
}