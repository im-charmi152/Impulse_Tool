import { Layers, Download, ChevronLeft, ChevronRight } from "lucide-react";
import SectionCard from "../common/SectionCard";
import Badge from "../common/Badge";
import { LINE_ITEMS } from "../../data/mockData";

const COLUMNS = [
  "Line #",
  "SKU",
  "Description",
  "Qty",
  "Unit Price",
  "Total Price",
  "Status",
];

export default function LineItemDetails() {
  return (
    <SectionCard
      icon={Layers}
      title="Line-Item Details"
      actions={
        <button className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 border border-blue-200 rounded px-2.5 py-1 hover:bg-blue-50 transition-colors">
          <Download size={11} />
          Export
        </button>
      }
    >
      <div className="overflow-x-auto -mx-1">
        <table className="w-full text-xs min-w-[520px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {COLUMNS.map((h) => (
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
            {LINE_ITEMS.map((item, i) => (
              <tr
                key={i}
                className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-2 py-2 text-gray-500">{item.line}</td>
                <td className="px-2 py-2 font-medium text-blue-600">
                  {item.sku}
                </td>
                <td className="px-2 py-2 text-gray-700 max-w-[140px] truncate">
                  {item.description}
                </td>
                <td className="px-2 py-2 text-gray-600 text-center">
                  {item.qty}
                </td>
                <td className="px-2 py-2 text-gray-600 text-right">
                  {item.unitPrice}
                </td>
                <td className="px-2 py-2 font-medium text-gray-800 text-right">
                  {item.totalPrice}
                </td>
                <td className="px-2 py-2">
                  <Badge color="green">{item.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-3 text-[10px] text-gray-400">
        <span>Showing 1 to 5 of 5 items</span>
        <div className="flex items-center gap-1">
          <button
            className="p-1 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
            disabled
          >
            <ChevronLeft size={11} />
          </button>
          <button className="w-6 h-6 rounded bg-[#003087] text-white text-[10px] font-bold">
            1
          </button>
          <button
            className="p-1 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
            disabled
          >
            <ChevronRight size={11} />
          </button>
          <select className="ml-2 border border-gray-200 rounded px-1.5 py-0.5 text-[10px] focus:outline-none">
            <option>10 / page</option>
            <option>25 / page</option>
          </select>
        </div>
      </div>
    </SectionCard>
  );
}
