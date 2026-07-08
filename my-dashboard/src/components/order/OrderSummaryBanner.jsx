import { FileText, RefreshCw } from "lucide-react";
import Badge from "../common/Badge";
import { ORDER } from "../../data/mockData";

export default function OrderSummaryBanner() {
  const fields = [
    { label: "Order Number", value: ORDER.orderNumber },
    { label: "Transaction ID", value: ORDER.transactionId },
    { label: "PO Number", value: ORDER.poNumber },
    { label: "Partner ID", value: ORDER.partnerId },
    { label: "Account Number", value: ORDER.accountNumber },
    { label: "Order Date", value: ORDER.orderDate },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <FileText size={18} className="text-blue-600" />
          </div>
        </div>
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-2">
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
            <Badge color="green">{ORDER.status}</Badge>
          </div>
          <div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wide font-medium mb-0.5">
              Last Updated
            </div>
            <div className="text-xs font-semibold text-gray-800">
              {ORDER.lastUpdated}
            </div>
          </div>
          <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
