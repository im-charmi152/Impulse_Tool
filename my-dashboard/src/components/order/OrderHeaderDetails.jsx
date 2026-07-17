import { AlignLeft } from "lucide-react";
import SectionCard from "../common/SectionCard";
import DetailRow from "../common/DetailRow";

function OrderHeaderDetails({ order }) {
  const rows = [
    ["Order Number", order.orderNumber],
    ["Order Date", order.orderDate],
    ["Account Number", order.accountNumber],
    ["Customer PO number", order.accountName],
    ["Partner ID", order.partnerId],
    ["Partner Name", order.partnerName],
    ["PO Number", order.poNumber],
    ["Order Source", order.orderSource],
    ["Total Line Items", order.totalLineItems],
    ["Order Total", order.orderTotal],
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
