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
    <div className="enterprise-card">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-10 h-10 bg-[#EFF6FF] rounded-xl flex items-center justify-center">
            <FileText size={18} className="text-[#2563EB]" />
          </div>
        </div>
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-2">
          {fields.map(({ label, value }) => (
            <div key={label}>
              <div className="field-label text-[10px] uppercase tracking-wide">
                {label}
              </div>
              <div className="field-value text-xs truncate">
                {value}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 flex-shrink-0 flex-wrap">
          <div>
            <div className="field-label text-[10px] uppercase tracking-wide mb-0.5">
              Status
            </div>
            <Badge color="green">Found</Badge>
          </div>
          <div>
            <div className="field-label text-[10px] uppercase tracking-wide mb-0.5">
              Retrieved
            </div>
            <div className="field-value text-xs">
              {formatDateTime(order.retrievedAt)}
            </div>
          </div>
          <button
            onClick={onRefresh}
            className="p-1.5 text-[#6B7280] hover:text-[#2563EB] hover:bg-[#EFF6FF] rounded-xl"
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
