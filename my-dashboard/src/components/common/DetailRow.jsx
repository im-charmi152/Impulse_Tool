import { memo } from "react";

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between items-start py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-500 min-w-[130px]">{label}</span>
      <span className="text-xs font-medium text-gray-800 text-right max-w-[180px] break-words">
        {value}
      </span>
    </div>
  );
}

export default memo(DetailRow);
