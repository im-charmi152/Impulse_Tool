import { AlignLeft } from "lucide-react";
import SectionCard from "../common/SectionCard";
import DetailRow from "../common/DetailRow";
import { formatDateTime, formatCurrency } from "../../utils/format";

function OrderHeaderDetails({ order }) {
  const rows = [
    ["Cust PO Number", order.poNumber],
    ["Order Branch", order.imiAsgdBrNbr],
    ["Order Number", order.imiAsgdOrdrNbr],
    ["Order Date", order.orderDate ? formatDateTime(order.orderDate) : "—"],
    ["Cust Number", order.accountNumber],
    ["Account Name", order.accountName || "Not available"],
    ["Partner ID", order.partnerId],
    ["Partner Name", order.partnerName || "Not available"],
    ["PO Number", order.poNumber],
    ["Order Source", order.orderSource],
    ["TAG_NBR",order.tag],
    ["CMB_BATCH_NBR",order.batch],
    ["STATE_CD",order.stateCode],
    ["IMI_CARR_CODE",order.carrierCode],
    ["ORDR_SHP_FR_BR",order.odShFr],
    ["HOLD_CD",order.holdCode],
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