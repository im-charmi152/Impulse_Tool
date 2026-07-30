import { FileText, RefreshCw } from "lucide-react";
import Badge from "../common/Badge";
import { formatDateTime } from "../../utils/format";

function OrderSummaryBanner({ order, onRefresh }) {
  const fields = [
    { label: "Cust PO Number", value: order.custPoNbr },
    { label: "Order Number", value: order.imiAsgdOrdrNbr },
    {
      label: "Cust PO Date",
      value: order.custPoDt ? formatDateTime(order.custPoDt) : "—",
    },
    { label: "Country Code", value: order.custCoCd },
    { label: "Partner ID", value: order.partnerId },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <FileText size={18} className="text-blue-600" />
          </div>
        </div>
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-2">
          {fields.map(({ label, value }) => (
            <div key={label}>
              <div className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">
                {label}
              </div>
              <div className="text-xs font-semibold text-gray-800 truncate">
                {value}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 flex-shrink-0 flex-wrap">
          <div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wide font-medium mb-0.5">
              Status
            </div>
            <Badge color="green">Found</Badge>
          </div>
          <div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wide font-medium mb-0.5">
              Retrieved
            </div>
            <div className="text-xs font-semibold text-gray-800">
              {formatDateTime(order.retrievedAt)}
            </div>
          </div>
          <button
            onClick={onRefresh}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
            aria-label="Refresh"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderSummaryBanner;
