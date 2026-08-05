import { memo } from "react";

const COLORS = {
  green: "bg-green-100 text-green-700 border border-green-200",
  blue: "bg-blue-100 text-[#1D4ED8] border border-[#DBEAFE]",
  red: "bg-red-100 text-red-700 border border-red-200",
  amber: "bg-amber-100 text-amber-700 border border-amber-200",
  gray: "bg-[#F8FAFC] text-[#6B7280] border border-[#DBEAFE]",
};

function Badge({ color = "gray", children }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${COLORS[color] || COLORS.gray}`}
    >
      {children}
    </span>
  );
}

export default memo(Badge);
