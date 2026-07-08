import { AlignLeft } from "lucide-react";
import SectionCard from "../common/SectionCard";
import DetailRow from "../common/DetailRow";
import { ORDER } from "../../data/mockData";

export default function OrderHeaderDetails() {
  const rows = [
    ["Order Number", ORDER.orderNumber],
    ["Order Date", ORDER.orderDate],
    ["Account Number", ORDER.accountNumber],
    ["Account Name", ORDER.accountName],
    ["Partner ID", ORDER.partnerId],
    ["Partner Name", ORDER.partnerName],
    ["PO Number", ORDER.poNumber],
    ["Order Source", ORDER.orderSource],
    ["Total Line Items", ORDER.totalLineItems],
    ["Order Total", ORDER.orderTotal],
    ["Currency", ORDER.currency],
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
