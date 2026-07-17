import { AlignLeft } from "lucide-react";
import SectionCard from "../common/SectionCard";
import DetailRow from "../common/DetailRow";
import { formatDateTime, formatCurrency } from "../../utils/format";

function OrderHeaderDetails({ order }) {
  const rows = [
    ["Order Number", order.orderNumber],
    ["Order Date", order.orderDate ? formatDateTime(order.orderDate) : "—"],
    ["Account Number", order.accountNumber],
    ["Account Name", order.accountName || "Not available"],
    ["Partner ID", order.partnerId],
    ["Partner Name", order.partnerName || "Not available"],
    ["PO Number", order.poNumber],
    ["Order Source", order.orderSource],
    ["Total Line Items", order.totalLineItems],
    ["Order Total", formatCurrency(order.orderTotal, order.currency !== "—" ? order.currency : "USD")],
    ["Currency", order.currency],
  ];

  return (
    <SectionCard icon={AlignLeft} title="Order Header Details">
      <div className="space-y-0">
        {rows.map(([label, value]) => (
          <DetailRow key={label} label={label} value={value} />
        ))}
      </div>
    </SectionCard>
  );
}

export default OrderHeaderDetails;