import { AlignLeft } from "lucide-react";
import SectionCard from "../common/SectionCard";
import DetailRow from "../common/DetailRow";
import { formatDateTime, formatCurrency } from "../../utils/format";

function OrderHeaderDetails({ order }) {
  const rows = [
    ["Order Branch", order.imiAsgdBrNbr],
  // ["Order Number", order.imiAsgdOrdrNbr],
  ["Cust Suffix", order.custSfx],
  ["Order Date", order.orderDate ? formatDateTime(order.orderDate) : "—"],
  ["Cust Number", order.accountNumber],
  ["Account Name", order.accountName || "Not available"],
  ["Partner ID", order.partnerId],
  ["Partner Name", order.partnerName || "Not available"],
  ["PO Number", order.poNumber],
  ["Order Source", order.termId],
  ["TAG_NBR", order.tag],
  ["CMB_BATCH_NBR", order.cmbBtchNbr],
  ["STATE_CD", order.stateCd],
  ["IMI_CARR_CODE", order.imiCarCd],
  ["ORDR_SHP_FR_BR", order.ordShFr],
  ["Order Status", order.ordSt],
  ["HOLD_CD", order.holdCode],

  // Additional Header Fields
  ["Customer Company Code", order.custCoCd],
  ["Customer Branch", order.custBr],
  ["Customer Number", order.custNbr],
  ["Customer PO Number", order.custPoNbr],
  ["Customer PO Date", order.custPoDt ? formatDateTime(order.custPoDt) : "—"],
  ["SDQ Sequence Number", order.sdqSeqNbr],
  ["Customer PO Sequence Number", order.custPoSeqNbr],
  ["Related Tag Number", order.relsTagNbr],
  ["Process Unit Timestamp", order.processUnitTs],
  ["Application ID", order.applId],
  ["Transaction Set", order.xactSet],
  ["Order Type", order.ordrType],
  ["Order Currency", order.ordrCcyCd],
  ["Seller Sales Number", order.sellrSalesNbr],
  ["Requested Ship Date", order.ordrReqShipDt ? formatDateTime(order.ordrReqShipDt) : "—"],
  ["Requested Delivery Date", order.ordrReqDlvyDt ? formatDateTime(order.ordrReqDlvyDt) : "—"],
  ["Requested Cancel Date", order.ordrReqCancDt ? formatDateTime(order.ordrReqCancDt) : "—"],
  ["Original Customer PO Date", order.orideCustPoDt ? formatDateTime(order.orideCustPoDt) : "—"],
  ["ETA Date", order.ordrEtaDt ? formatDateTime(order.ordrEtaDt) : "—"],
  ["Reservation Inventory Switch", order.resvInvSw],
  ["Government/Public/Private", order.govtPubPrivSw],
  ["Government Program Type", order.govtPgmType],
  ["Consignment Switch", order.cnsgnSw],
  ["SLA Code", order.slaCode],
  ["Delivery Flag", order.isDelvFlg],
  ["Special Label Code", order.specLblCode],
  ["PO Government Type", order.poGovtTp],
  ["Department Number", order.deptNbr],
  ["Buyer Location", order.byrLoc],
  ["Buyer Contact", order.byrCntact],
  ["Buyer Phone Number", order.byrPhnNbr],
  ["Buyer Vendor Number", order.byrVndrNbr],
  ["Transmit Hash Total", order.xmitHashTot],
  ["Transmit Total Lines", order.xmitTotLines],
  ["Configuration Type", order.cfgType],
  ["Contract Number", order.contNbr],
  ["Label Type", order.labType],
  ["Configuration PO Type", order.configPoType],
  ["Order Entry Timestamp", order.ordEntryDtTs ? formatDateTime(order.ordEntryDtTs) : "—"],
  ["Customer Carrier Code", order.custCarrCode],
  ["IMI Ship Via", order.imiShipVia],
  ["COD Amount", order.codAmt],
  ["Third Party Account", order.thrdPtyAct],
  ["Branch Sequence Value", order.brSeqValu],
  ["Distribution Depth", order.distrbDepth],
  ["Maximum Transit Days", order.maxXitDays],
  ["Single Warehouse", order.singleWhse],
  ["Number of Warehouses", order.nbrOfWhse],
  ["Ship Flag", order.shipFlg],
  ["Order Rejected Flag", order.ordrRejFlg],
  ["Demand Branch", order.dmdBr],
  ["Process Date", order.processDt],
  ["Process Time", order.processTm],
  ["Terms", order.terms],
  ["Currency Rate", order.ccyRate],
  ["Drop Message", order.dropMsg],
  ["Order Has Errors", order.ordrHasErrs],
  ["Tax Flag", order.taxFlg],
  ["Freight Out Code", order.frghtOutCode],
  ["Quote Number", order.quoteNbr],
  ["Service Indicator", order.serviceInd],
  ["Service Level", order.serviceLevel],
  ["Carrier Account", order.carrierAccount],
  ["Freight Order Number", order.freightOrderNbr],
  ["Business Region Code", order.busRegnCd],
  ["VMF Header Hold Indicator", order.vmfHdrHldInd],
  ["Hybrid Annuity Order Indicator", order.hybrdAnntyOrdrInd],
  ["Hybrid Annuity Confirmation ID", order.hybrdAnntyCnfmtnId]
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