export default function StatusBadge({ status }: { status: string }) {
  const base =
    "text-xs px-2 py-1 rounded-full font-medium transition";
  const styles = {
    pending: "bg-yellow-100 text-yellow-800",
    accepted: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    default: "bg-gray-200 text-gray-600"
  };

  const statusClass = styles[status] || styles.default;

  return <span className={`${base} ${statusClass}`}>{status}</span>;
}