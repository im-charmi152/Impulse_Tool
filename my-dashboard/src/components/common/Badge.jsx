export default function Badge({ color = "green", children }) {
  const colors = {
    green: "bg-green-100 text-green-700 border border-green-200",
    blue: "bg-blue-100 text-blue-700 border border-blue-200",
    red: "bg-red-100 text-red-700 border border-red-200",
    gray: "bg-gray-100 text-gray-600 border border-gray-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color]}`}
    >
      {children}
    </span>
  );
}
