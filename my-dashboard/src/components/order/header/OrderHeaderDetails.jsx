// import { AlignLeft } from "lucide-react";
// import SectionCard from "../common/SectionCard";
// import DetailRow from "../common/DetailRow";
// import { formatDateTime, formatCurrency } from "../../utils/format";

// function OrderHeaderDetails({ order }) {
//   const rows = [
//     ["Order Branch", order.imiAsgdBrNbr],
//   // ["Order Number", order.imiAsgdOrdrNbr],
//   ["Cust Suffix", order.custSfx],
//   ["Order Date", order.orderDate ? formatDateTime(order.orderDate) : "—"],
//   ["Cust Number", order.accountNumber],
//   ["Account Name", order.accountName || "Not available"],
//   ["Partner ID", order.partnerId],
//   ["Partner Name", order.partnerName || "Not available"],
//   ["PO Number", order.poNumber],
//   ["Order Source", order.termId],
//   ["TAG_NBR", order.tag],
//   ["CMB_BATCH_NBR", order.cmbBtchNbr],
//   ["STATE_CD", order.stateCd],
//   ["IMI_CARR_CODE", order.imiCarCd],
//   ["ORDR_SHP_FR_BR", order.ordShFr],
//   ["Order Status", order.ordSt],
//   ["HOLD_CD", order.holdCode],

//   // Additional Header Fields
//   ["Customer Company Code", order.custCoCd],
//   ["Customer Branch", order.custBr],
//   ["Customer Number", order.custNbr],
//   ["Customer PO Number", order.custPoNbr],
//   ["Customer PO Date", order.custPoDt ? formatDateTime(order.custPoDt) : "—"],
//   ["SDQ Sequence Number", order.sdqSeqNbr],
//   ["Customer PO Sequence Number", order.custPoSeqNbr],
//   ["Related Tag Number", order.relsTagNbr],
//   ["Process Unit Timestamp", order.processUnitTs],
//   ["Application ID", order.applId],
//   ["Transaction Set", order.xactSet],
//   ["Order Type", order.ordrType],
//   ["Order Currency", order.ordrCcyCd],
//   ["Seller Sales Number", order.sellrSalesNbr],
//   ["Requested Ship Date", order.ordrReqShipDt ? formatDateTime(order.ordrReqShipDt) : "—"],
//   ["Requested Delivery Date", order.ordrReqDlvyDt ? formatDateTime(order.ordrReqDlvyDt) : "—"],
//   ["Requested Cancel Date", order.ordrReqCancDt ? formatDateTime(order.ordrReqCancDt) : "—"],
//   ["Original Customer PO Date", order.orideCustPoDt ? formatDateTime(order.orideCustPoDt) : "—"],
//   ["ETA Date", order.ordrEtaDt ? formatDateTime(order.ordrEtaDt) : "—"],
//   ["Reservation Inventory Switch", order.resvInvSw],
//   ["Government/Public/Private", order.govtPubPrivSw],
//   ["Government Program Type", order.govtPgmType],
//   ["Consignment Switch", order.cnsgnSw],
//   ["SLA Code", order.slaCode],
//   ["Delivery Flag", order.isDelvFlg],
//   ["Special Label Code", order.specLblCode],
//   ["PO Government Type", order.poGovtTp],
//   ["Department Number", order.deptNbr],
//   ["Buyer Location", order.byrLoc],
//   ["Buyer Contact", order.byrCntact],
//   ["Buyer Phone Number", order.byrPhnNbr],
//   ["Buyer Vendor Number", order.byrVndrNbr],
//   ["Transmit Hash Total", order.xmitHashTot],
//   ["Transmit Total Lines", order.xmitTotLines],
//   ["Configuration Type", order.cfgType],
//   ["Contract Number", order.contNbr],
//   ["Label Type", order.labType],
//   ["Configuration PO Type", order.configPoType],
//   ["Order Entry Timestamp", order.ordEntryDtTs ? formatDateTime(order.ordEntryDtTs) : "—"],
//   ["Customer Carrier Code", order.custCarrCode],
//   ["IMI Ship Via", order.imiShipVia],
//   ["COD Amount", order.codAmt],
//   ["Third Party Account", order.thrdPtyAct],
//   ["Branch Sequence Value", order.brSeqValu],
//   ["Distribution Depth", order.distrbDepth],
//   ["Maximum Transit Days", order.maxXitDays],
//   ["Single Warehouse", order.singleWhse],
//   ["Number of Warehouses", order.nbrOfWhse],
//   ["Ship Flag", order.shipFlg],
//   ["Order Rejected Flag", order.ordrRejFlg],
//   ["Demand Branch", order.dmdBr],
//   ["Process Date", order.processDt],
//   ["Process Time", order.processTm],
//   ["Terms", order.terms],
//   ["Currency Rate", order.ccyRate],
//   ["Drop Message", order.dropMsg],
//   ["Order Has Errors", order.ordrHasErrs],
//   ["Tax Flag", order.taxFlg],
//   ["Freight Out Code", order.frghtOutCode],
//   ["Quote Number", order.quoteNbr],
//   ["Service Indicator", order.serviceInd],
//   ["Service Level", order.serviceLevel],
//   ["Carrier Account", order.carrierAccount],
//   ["Freight Order Number", order.freightOrderNbr],
//   ["Business Region Code", order.busRegnCd],
//   ["VMF Header Hold Indicator", order.vmfHdrHldInd],
//   ["Hybrid Annuity Order Indicator", order.hybrdAnntyOrdrInd],
//   ["Hybrid Annuity Confirmation ID", order.hybrdAnntyCnfmtnId]
//   ];

//   return (
//     <SectionCard icon={AlignLeft} title="Order Header Details">
//       <div className="space-y-0">
//         {rows.map(([label, value]) => (
//           <DetailRow key={label} label={label} value={value} />
//         ))}
//       </div>
//     </SectionCard>
//   );
// }

// export default OrderHeaderDetails;

/**
 * OrderHeaderDetails.jsx  —  Enterprise redesign
 *
 * Replaces the flat key-value list with:
 *   1. Summary Card  — top 12 fields in a responsive icon grid (always visible)
 *   2. New-tab details navigation for all fields (matches LineItems pattern)
 *
 * Drop-in replacement: the only prop is `order` (same shape as before).
 * The component is forward-compatible — unknown keys simply don't render.
 */

import { useState, useCallback, useMemo } from "react";
import {
  FileText,
  Hash,
  Activity,
  User,
  Building2,
  Users,
  Calendar,
  DollarSign,
  AlertCircle,
  Truck,
  Copy,
  Check,
  Shield,
  ExternalLink,
  ChevronRight,
  Building,
  CreditCard,
  UserCheck,
  ToggleLeft,
  MapPin,
  Globe,
  Flag,
  Info,
} from "lucide-react";
import { SUMMARY_FIELDS, ORDER_STATUS_MAP, HOLD_CODE_MAP } from "./fieldConfig";
import { formatDateTime } from "../../../utils/format";
import SectionCard from "../../common/SectionCard";
import { openOrderHeaderDetailsTab } from "../../../utils/detailsNavigation";

// Icon map (string key → component)
// import {
//   Hash, CreditCard, Truck, Shield, UserCheck, DollarSign,
//   ToggleLeft, MapPin, FileText, Globe, User, Flag, Building2,
// } from "lucide-react";

const ICON_MAP = {
  Hash,
  CreditCard,
  Truck,
  Shield,
  UserCheck,
  DollarSign,
  ToggleLeft,
  MapPin,
  FileText,
  Globe,
  User,
  Flag,
  Building2,
};
// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ value }) {
  if (!value) return <span className="text-gray-300 text-xs">—</span>;
  const key = String(value).toLowerCase();
  const cfg = ORDER_STATUS_MAP[key] ?? ORDER_STATUS_MAP[value] ?? null;
  if (!cfg) return <span className="field-value text-xs">{value}</span>;

  const styles = {
    green: "bg-green-50 text-green-700 border-green-200",
    blue: "bg-blue-50  text-blue-700  border-blue-200",
    red: "bg-red-50   text-red-700   border-red-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    gray: "bg-[#F8FAFC]  text-[#6B7280]  border-[#DBEAFE]",
  };
  const dots = {
    green: "bg-green-500",
    blue: "bg-blue-500",
    red: "bg-red-500",
    amber: "bg-amber-500",
    gray: "bg-gray-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${styles[cfg.color]}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dots[cfg.color]}`}
      />
      {cfg.label}
    </span>
  );
}

// ─── Hold badge ───────────────────────────────────────────────────────────────
function HoldBadge({ value }) {
  if (!value || value === "N" || value === "" || value === "0") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-green-600">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        Clear
      </span>
    );
  }
  const desc = HOLD_CODE_MAP[value];
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 text-red-700 border border-red-200">
      <AlertCircle size={9} />
      {desc ? `${desc} (${value})` : `On Hold (${value})`}
    </span>
  );
}

// ─── Copy button ──────────────────────────────────────────────────────────────
function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  const handle = useCallback(
    (e) => {
      e.stopPropagation();
      navigator.clipboard?.writeText(String(value ?? "")).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    },
    [value],
  );

  return (
    <button
      onClick={handle}
      aria-label="Copy to clipboard"
      className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity
        p-0.5 rounded text-gray-300 hover:text-blue-600 hover:bg-blue-50
        focus:outline-none focus:ring-1 focus:ring-blue-400 flex-shrink-0"
    >
      {copied ? (
        <Check size={10} className="text-green-500" />
      ) : (
        <Copy size={10} />
      )}
    </button>
  );
}

// ─── Single summary field ─────────────────────────────────────────────────────
function SummaryField({ fieldDef, value }) {
  const Icon = ICON_MAP[fieldDef.icon] ?? FileText;
  const isEmpty = value == null || value === "";

  const rendered = useMemo(() => {
    if (isEmpty) return <span className="text-gray-300 text-xs">—</span>;
    if (fieldDef.type === "status") return <StatusBadge value={value} />;
    if (fieldDef.type === "hold") return <HoldBadge value={value} />;
    if (fieldDef.type === "date")
      return (
        <span className="field-value text-xs leading-tight">
          {formatDateTime(value)}
        </span>
      );
    if (fieldDef.type === "id")
      return (
        <span className="flex items-center gap-1 min-w-0 group/copy">
          <span className="font-mono text-xs field-value truncate">
            {value}
          </span>
          <CopyButton value={value} />
        </span>
      );
    return (
      <span className="field-value text-xs leading-tight truncate">
        {String(value)}
      </span>
    );
  }, [fieldDef, value, isEmpty]);

  return (
    <div
      className="group flex items-start gap-2.5 p-3 rounded-xl bg-white border border-[#DBEAFE]
      hover:border-[#BFDBFE] hover:shadow-sm transition-all duration-150"
    >
      <div className="flex-shrink-0 w-7 h-7 rounded-md bg-[#EFF6FF] flex items-center justify-center mt-0.5">
        <Icon size={13} className="text-[#2563EB]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="field-label text-[9px] uppercase tracking-wider mb-1">
          {fieldDef.label}
        </p>
        <div className="flex items-start">{rendered}</div>
      </div>
    </div>
  );
}

// ─── Skeleton loading ─────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="enterprise-card p-0 overflow-hidden">
      <div className="flex items-center px-5 py-3 border-b border-[#DBEAFE] bg-[#F8FAFC]">
        <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
      </div>
      <div className="p-5 grid grid-cols-2 md:grid-cols-3 gap-3">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="flex items-start gap-2.5 p-3 rounded-lg border border-gray-100"
          >
            <div className="w-7 h-7 rounded-md bg-gray-200 animate-pulse flex-shrink-0" />
            <div className="flex-1 space-y-1.5 pt-0.5">
              <div className="h-2 w-16 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Error state ──────────────────────────────────────────────────────────────
function ErrorCard({ message }) {
  return (
    <div className="enterprise-card border-red-200 p-8 flex flex-col items-center text-center">
      <AlertCircle size={28} className="text-red-400 mb-2" />
      <p className="text-sm font-medium text-red-700 mb-1">
        Failed to load order details
      </p>
      <p className="text-xs text-[#6B7280]">
        {message ?? "An unexpected error occurred."}
      </p>
    </div>
  );
}

// ─── Main exported component ──────────────────────────────────────────────────
/**
 * @param {{ order: object, loading?: boolean, error?: string }} props
 */
export default function OrderHeaderDetails({
  order,
  loading = false,
  error = null,
}) {
  if (loading) return <SkeletonCard />;
  if (error) return <ErrorCard message={error} />;
  if (!order) return null;

  return (
    <>
      {/* ── Summary Card ─────────────────────────────────────────────────── */}
      <SectionCard
        icon={FileText}
        title="Order Header Details"
        footer={
          <div className="flex items-center gap-1.5 px-5 py-2.5 bg-[#F8FAFC]">
            <Info size={11} className="text-[#6B7280]" />
          </div>
        }
      >
        {/* 12-field summary grid */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => openOrderHeaderDetailsTab(order)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              openOrderHeaderDetailsTab(order);
            }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 cursor-pointer"
        >
          {SUMMARY_FIELDS.map((fieldDef) => (
            <SummaryField
              key={fieldDef.key}
              fieldDef={fieldDef}
              value={order[fieldDef.key]}
            />
          ))}
        </div>
      </SectionCard>
    </>
  );
}
