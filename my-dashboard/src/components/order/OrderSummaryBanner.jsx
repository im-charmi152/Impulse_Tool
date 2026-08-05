import { FileText, Hash, CalendarDays, Flag, Users, CircleCheck } from "lucide-react";
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
      key: "partner",
      label: "Partner ID",
      value: order?.partnerId || "—",
      icon: Users,
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
      {tiles.map((tile) => {
        const Icon = tile.icon;
        return (
          <div
            key={tile.key}
            className="enterprise-card h-full min-h-[98px] p-3.5 flex items-start gap-2.5"
          >
            {Icon && (
              <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] flex items-center justify-center flex-shrink-0">
                <Icon size={14} className="text-[#0F6CBD]" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="field-label text-[10px] uppercase tracking-wide">
                {tile.label}
              </div>
              <div className="mt-1">
                {tile.isStatus ? (
                  <Badge color="green">{tile.value}</Badge>
                ) : (
                  <div className="field-value text-base font-semibold leading-tight break-words">
                    {tile.value}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default OrderSummaryBanner;
