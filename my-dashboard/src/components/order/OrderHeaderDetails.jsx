import { AlignLeft } from "lucide-react";
import SectionCard from "../common/SectionCard";
import DetailRow from "../common/DetailRow";
import { formatDateTime, formatCurrency } from "../../utils/format";

function OrderHeaderDetails({ order }) {
  const rows = [
    // ["Cust PO Number", order.poNumber],
    ["Order Branch", order.imiAsgdBrNbr],
    // ["Order Number", order.imiAsgdOrdrNbr],
    ["Cust Suffix",order.custSfx],
    ["Order Date", order.orderDate ? formatDateTime(order.orderDate) : "—"],
    ["Cust Number", order.accountNumber],
    ["Account Name", order.accountName || "Not available"],
    ["Partner ID", order.partnerId],
    ["Partner Name", order.partnerName || "Not available"],
    ["PO Number", order.poNumber],
    ["Order Source", order.termId],
    ["TAG_NBR",order.tag],
    ["CMB_BATCH_NBR",order.cmbBtchNbr],
    ["STATE_CD",order.stateCd],
    ["IMI_CARR_CODE",order.imiCarCd],
    ["ORDR_SHP_FR_BR",order.ordShFr],
    ["Order Status",order.ordSt]
    ["HOLD_CD",order.holdCode],
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