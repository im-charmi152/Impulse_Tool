import { useMemo, useState } from "react";
import { Download, ChevronLeft, ChevronRight, Layers } from "lucide-react";
import SectionCard from "../common/SectionCard";
import { recordEvent } from "../../utils/auditLog";

const PAGE_SIZE_OPTIONS = [10, 25];

function LineItemDetails({ items }) {
  
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  const rangeStart = items.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, items.length);

  return (
    <SectionCard
      icon={Layers}
      title="Line-Item Details"
      actions={
        <button
          onClick={() => recordEvent("export", { type: "line-items" })}
          className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 border border-blue-200 rounded px-2.5 py-1 hover:bg-blue-50 transition-colors"
        >
          <Download size={11} />
          Export
        </button>
      }
    >
      <div className="overflow-x-auto -mx-1">
        <table className="w-full text-xs min-w-[760px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {[
                "CUST_CO_CD",
                "CUST_BR",
                "CUST_NBR",
                "CUST_PO_NBR",
                "IMI_LINE_NBR",
                "IMI_PART_NBR",
                "QTY_ORDERED",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-2 py-2 font-semibold text-gray-500 text-[10px] uppercase tracking-wide whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageItems.map((item, index) => (
              <tr
                key={`${item.imiLineNbr ?? "line"}-${index}`}
                className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-2 py-2 text-gray-600">{item.custCoCd ?? "—"}</td>
                <td className="px-2 py-2 text-gray-600">{item.custBr ?? "—"}</td>
                <td className="px-2 py-2 text-gray-600">{item.custNbr ?? "—"}</td>
                <td className="px-2 py-2 text-gray-600">{item.custPoNbr ?? "—"}</td>
                <td className="px-2 py-2 text-gray-700 font-medium">{item.imiLineNbr ?? "—"}</td>
                <td className="px-2 py-2 text-gray-700 font-medium">{item.imiPartNbr ?? "—"}</td>
                <td className="px-2 py-2 text-gray-700">{item.qtyOrdered ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-3 text-[10px] text-gray-400">
        <span>
          Showing {rangeStart} to {rangeEnd} of {items.length} items
        </span>
        <div className="flex items-center gap-1">
          <button
            className="p-1 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft size={11} />
          </button>
          <button className="w-6 h-6 rounded bg-[#003087] text-white text-[10px] font-bold">
            {page}
          </button>
          <button
            className="p-1 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            <ChevronRight size={11} />
          </button>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="ml-2 border border-gray-200 rounded px-1.5 py-0.5 text-[10px] focus:outline-none"
          >
            {PAGE_SIZE_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </select>
        </div>
      </div>
    </SectionCard>
  );
}

export default LineItemDetails;
