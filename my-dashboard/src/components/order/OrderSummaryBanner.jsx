import { FileText, Download } from "lucide-react";
import Badge from "../common/Badge";
import { formatDateTime, statusToColor } from "../../utils/format";

function OrderSummaryBanner({ order, onExport }) {
  const orderNumber = order?.imiAsgdOrdrNbr || order?.poNumber || order?.orderNumber || "—";
  const lastUpdated =
    order?.lastUpdated || order?.retrievedAt || order?.processUnitTs || order?.ordEntryDtTs || "—";

  return (
    <div className="enterprise-card">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-11 h-11 bg-[#EFF6FF] rounded-xl flex items-center justify-center flex-shrink-0">
            <FileText size={18} className="text-[#2563EB]" />
          </div>
          <div className="min-w-0">
            <div className="field-label text-[10px] uppercase tracking-wide mb-1">
              Dashboard Header
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <div>
                <div className="field-label text-[10px] uppercase tracking-wide mb-0.5">
                  Order Number
                </div>
                <div className="field-value text-sm font-semibold truncate max-w-[260px]">
                  {orderNumber}
                </div>
              </div>
              <div>
                <div className="field-label text-[10px] uppercase tracking-wide mb-0.5">
                  Status
                </div>
                <Badge color={statusToColor(order?.ordSt)}>
                  {order?.ordSt || "—"}
                </Badge>
              </div>
              <div>
                <div className="field-label text-[10px] uppercase tracking-wide mb-0.5">
                  Last Updated
                </div>
                <div className="field-value text-xs">
                  {lastUpdated !== "—" ? formatDateTime(lastUpdated) : "—"}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <button
            onClick={onExport}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl px-3.5 py-2"
            aria-label="Export dashboard"
          >
            <Download size={13} />
            Export
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderSummaryBanner;
