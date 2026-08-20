import {
  FileText,
  Hash,
  CalendarDays,
  Flag,
  Users,
  CircleCheck,
} from "lucide-react";
import Badge from "../common/Badge";
import { formatDateTime } from "../../utils/format";

function OrderSummaryBanner({ order }) {
  const tiles = [
    {
      key: "custPo",
      label: "Customer PO",
      value: order?.custPoNbr || order?.poNumber || "—",
      icon: FileText,
    },
    {
      key: "orderNo",
      label: "Order Number",
      value: order?.imiAsgdOrdrNbr || order?.orderNumber || "—",
      icon: Hash,
    },
    {
      key: "custPoDate",
      label: "Customer PO Date",
      value: order?.custPoDt ? formatDateTime(order.custPoDt) : "—",
      icon: CalendarDays,
    },
    {
      key: "country",
      label: "Country Code",
      value: order?.custCoCd || "—",
      icon: Flag,
    },
    {
      key: "orderSource",
      label: "Order Source",
      value: order?.termId || "—",
      icon: FileText,
    },
    {
      key: "status",
      label: "Status",
      value: order?.ordSt || "Found",
      icon: CircleCheck,
      isStatus: true,
    },
  ];

  return (
  <div className="enterprise-card border border-[#D6E4F7] rounded-xl shadow-sm bg-white overflow-hidden">
    <div className="grid grid-cols-[1.5fr_1.4fr_1.6fr_1fr_1.2fr_1fr] divide-x divide-[#D6E4F7]">

      {tiles.map((tile) => {
        const Icon = tile.icon;

        return (
          <div
            key={tile.key}
            className="flex items-center gap-2 px-3 py-2 min-w-0"
          >
            <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded bg-[#EEF6FF]">
              <Icon
                size={12}
                strokeWidth={2}
                className="text-[#0F6CBD]"
              />
            </div>

            <div className="flex-1 min-w-0">

              <div className="text-[9px] uppercase font-semibold tracking-wide text-slate-500 leading-none">
                {tile.label}
              </div>

              <div className="mt-0.5">
                {tile.isStatus ? (
                  <Badge
                    color="green"
                    className="text-[9px] px-2 py-0"
                  >
                    {tile.value}
                  </Badge>
                ) : (
                  <div className="truncate text-[15px] font-semibold text-slate-900">
                    {tile.value}
                  </div>
                )}
              </div>

            </div>
          </div>
        );
      })}

    </div>
  </div>
);

export default OrderSummaryBanner;
