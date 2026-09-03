import { useState } from "react";
import {
  ArrowLeft,
  SlidersHorizontal,
  Clock,
  Users,
  Settings,
  Truck,
  ShoppingCart,
  BarChart2,
  Shield,
  Layers,
  FileText,
  Check,
  Copy,
  Hash,
} from "lucide-react";
import { loadDetailsRecord } from "../utils/detailsNavigation";
import { AccordionCard, DetailFieldRow, formatDetailValue } from "../components/details/DetailsLayout";
import SectionCard from "../components/common/SectionCard";

const FIELD_GROUPS = [
  {
    id: "identity",
    label: "Identity",
    icon: Users,
    defaultOpen: true,
    fields: [
      { key: "coCd", label: "CO_CD", type: "text" },
      { key: "partnerId", label: "PARTNER_ID", type: "text" },
      { key: "custPrty", label: "CUST_PRTY", type: "text" },
      { key: "dfltCustNbr", label: "DFLT_CUST_NBR", type: "text" },
      { key: "promoCustNbr", label: "PROMO_CUST_NBR", type: "text" },
      { key: "priceCustNbr", label: "PRICE_CUST_NBR", type: "text" },
      { key: "rsrvCustNbr", label: "RSRV_CUST_NBR", type: "text" },
    ],
  },
  {
    id: "timing",
    label: "Timing & Schedule",
    icon: Clock,
    defaultOpen: true,
    fields: [
      { key: "skipFrTm", label: "SKIP_FR_TM", type: "text" },
      { key: "skipToTm", label: "SKIP_TO_TM", type: "text" },
      { key: "maxFutDay", label: "MAX_FUT_DAY", type: "text" },
      { key: "ackDelayHrs", label: "ACK_DELAY_HRS", type: "text" },
      { key: "ordrCancDaysNbr", label: "ORDR_CANC_DAYS_NBR", type: "text" },
      { key: "etaDays", label: "ETA_DAYS", type: "text" },
      { key: "rsrvExpirDays", label: "RSRV_EXPIR_DAYS", type: "text" },
      { key: "lstChgTs", label: "LST_CHG_TS", type: "text" },
      { key: "lstChgNam", label: "LST_CHG_NAM", type: "text" },
    ],
  },
  {
    id: "order-flags",
    label: "Order Flags",
    icon: ShoppingCart,
    defaultOpen: true,
    fields: [
      { key: "ackPoFlg", label: "ACK_PO_FLG", type: "text" },
      { key: "ackPromoFlg", label: "ACK_PROMO_FLG", type: "text" },
      { key: "holdOrderFlg", label: "HOLD_ORDER_FLG", type: "text" },
      { key: "ackRptFlg", label: "ACK_RPT_FLG", type: "text" },
      { key: "autoPoChgFlg", label: "AUTO_PO_CHG_FLG", type: "text" },
      { key: "futOrdrSw", label: "FUT_ORDR_SW", type: "text" },
      { key: "ackDelaySw", label: "ACK_DELAY_SW", type: "text" },
      { key: "ordrCancDaysFlg", label: "ORDR_CANC_DAYS_FLG", type: "text" },
      { key: "rejOrdrHdrFlg", label: "REJ_ORDR_HDR_FLG", type: "text" },
      { key: "rejCnsCmpHdrFlg", label: "REJ_CNSCMP_HDR_FLG", type: "text" },
      { key: "preImHoldFlg", label: "PRE_IM_HOLD_FLG", type: "text" },
    ],
  },
  {
    id: "routing",
    label: "Routing & Distribution",
    icon: Truck,
    defaultOpen: false,
    fields: [
      { key: "baserateFlg", label: "BASERATE_FLG", type: "text" },
      { key: "airBrSeqFlg", label: "AIR_BR_SEQ_FLG", type: "text" },
      { key: "brSeqOrideFlg", label: "BR_SEQ_ORIDE_FLG", type: "text" },
      { key: "multBrSeqFlg", label: "MULT_BR_SEQ_FLG", type: "text" },
      { key: "exportBrSeqFlg", label: "EXPORT_BR_SEQ_FLG", type: "text" },
      { key: "distDepthFlg", label: "DIST_DEPTH_FLG", type: "text" },
      { key: "multiDistFlg", label: "MULTI_DIST_FLG", type: "text" },
      { key: "bestWhseFlg", label: "BEST_WHSE_FLG", type: "text" },
      { key: "singleWhseFlg", label: "SINGLE_WHSE_FLG", type: "text" },
      { key: "saveFrtFlg", label: "SAVE_FRT_FLG", type: "text" },
      { key: "saveDistFlg", label: "SAVE_DIST_FLG", type: "text" },
      { key: "multShpToFlg", label: "MULT_SHP_TO_FLG", type: "text" },
      { key: "multShpSortSeq", label: "MULT_SHP_SORT_SEQ", type: "text" },
    ],
  },
  {
    id: "customer",
    label: "Customer Settings",
    icon: Users,
    defaultOpen: false,
    fields: [
      { key: "chkCustPrcFlg", label: "CHK_CUST_PRC_FLG", type: "text" },
      { key: "saveCustPrcFlg", label: "SAVE_CUST_PRC_FLG", type: "text" },
      { key: "updCustSkuFlg", label: "UPD_CUST_SKU_FLG", type: "text" },
      { key: "cascadeSkuFlg", label: "CASCADE_SKU_FLG", type: "text" },
      { key: "instRebatMsgFlg", label: "INST_REBAT_MSG_FLG", type: "text" },
      { key: "specPrcFlg", label: "SPEC_PRC_FLG", type: "text" },
      { key: "vlaFlg", label: "VLA_FLG", type: "text" },
      { key: "aggCdCpblFlg", label: "AGG_CD_CPBL_FLG", type: "text" },
      { key: "prntOrdrFlg", label: "PRNT_ORDR_FLG", type: "text" },
    ],
  },
  {
    id: "processing",
    label: "Processing",
    icon: Settings,
    defaultOpen: false,
    fields: [
      { key: "systemPartsFlg", label: "SYSTEM_PARTS_FLG", type: "text" },
      { key: "voidTaxableFlg", label: "VOID_TAXABLE_FLG", type: "text" },
      { key: "casepackMsgFlg", label: "CASEPACK_MSG_FLG", type: "text" },
      { key: "boBrXferFlg", label: "BO_BR_XFER_FLG", type: "text" },
      { key: "clsXFltrTypCd", label: "CLS_X_FLTR_TYP_CD", type: "text" },
      { key: "clsSFltrTypCd", label: "CLS_S_FLTR_TYP_CD", type: "text" },
      { key: "clsXHldFlg", label: "CLS_X_HLD_FLG", type: "text" },
      { key: "autoSplitFlg", label: "AUTO_SPLIT_FLG", type: "text" },
    ],
  },
  {
    id: "advanced",
    label: "Advanced Settings",
    icon: Shield,
    defaultOpen: false,
    fields: [
      { key: "euCaptureFlg", label: "EU_CAPTURE_FLG", type: "text" },
      { key: "customCarrFlg", label: "CUSTOM_CARR_FLG", type: "text" },
      { key: "stStoreOvrRdFlg", label: "ST_STORE_OVRRD_FLG", type: "text" },
      { key: "rsrvAllowed", label: "RSRV_ALLOWED", type: "text" },
      { key: "configVisibleFlg", label: "CONFIG_VISIBLE_FLG", type: "text" },
      { key: "etaCalcFlg", label: "ETA_CALC_FLG", type: "text" },
      { key: "addrValidFlg", label: "ADDR_VALID_FLG", type: "text" },
    ],
  },
];

const SUMMARY_FIELDS = [
  { key: "coCd", label: "Company Code", icon: BarChart2 },
  { key: "partnerId", label: "Partner ID", icon: Users },
  { key: "custPrty", label: "Customer Priority", icon: BarChart2 },
  { key: "skipFrTm", label: "Skip From Time", icon: Clock },
  { key: "skipToTm", label: "Skip To Time", icon: Clock },
  { key: "lstChgTs", label: "Last Changed", icon: Clock },
];

const SUMMARY_KEYS = new Set(SUMMARY_FIELDS.map((f) => f.key));

const ICON_MAP = {
  Users,
  Clock,
  ShoppingCart,
  Truck,
  Settings,
  Shield,
  BarChart2,
  Hash,
  FileText,
};

function parseFallbackFromParams(searchParams) {
  return {
    coCd: searchParams.get("coCd") || "—",
    partnerId: searchParams.get("partnerId") || "—",
  };
}

function resolveRecord(searchParams) {
  const ref = searchParams.get("ref");
  const stored = loadDetailsRecord(ref, "po-switch");
  return stored || parseFallbackFromParams(searchParams);
}

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);

  if (value == null || value === "" || value === "—") return null;

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        navigator.clipboard?.writeText(String(value)).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded text-slate-300 hover:text-[#0F6CBD] hover:bg-blue-50"
      aria-label="Copy"
    >
      {copied ? <Check size={11} className="text-green-600" /> : <Copy size={11} />}
    </button>
  );
}

function SummaryInfoTile({ field, value }) {
  const Icon = ICON_MAP[field.icon] || FileText;

  return (
    <div className="group flex items-start gap-3 rounded-xl border border-[#DBEAFE] bg-white p-3.5 hover:border-[#BFDBFE] hover:shadow-sm transition-all duration-150">
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF]">
        <Icon size={16} className="text-[#2563EB]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#64748B]">{field.label}</p>
        <div className="mt-1 flex items-center gap-1.5">
          <div className="min-w-0 text-sm font-semibold text-[#0F172A] break-words">{formatDetailValue(field, value)}</div>
          {field.copyable && <CopyButton value={value} />}
        </div>
      </div>
    </div>
  );
}

function HeroStat({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#64748B]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[#0F172A]">{value || "—"}</p>
    </div>
  );
}

export default function PoSwitchDetailsPage({ searchParams }) {
  const [activeTab, setActiveTab] = useState(FIELD_GROUPS[0]?.id || "identity");
  const record = resolveRecord(searchParams);

  const groupsById = Object.fromEntries(FIELD_GROUPS.map((group) => [
    group.id,
    {
      ...group,
      iconComponent: ICON_MAP[group.icon] || Layers,
      fields: group.fields.filter((f) => !SUMMARY_KEYS.has(f.key)),
    },
  ]));

  const activeGroups = [groupsById[activeTab]].filter((group) => group && group.fields.length > 0);

  const summaryFields = SUMMARY_FIELDS.map((field) => ({
    ...field,
    value: record[field.key],
  }));

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A]">
      <main className="mx-auto max-w-[1440px] p-4 md:p-6">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="mb-2 inline-flex items-center rounded-full border border-[#DBEAFE] bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#0F6CBD]">
              PO Switch Record
            </div>
            <h1 className="text-2xl font-black uppercase tracking-[0.18em] text-[#0033A0] md:text-3xl">
              PO SWITCH DETAILS
            </h1>
          </div>
          <button
            type="button"
            onClick={() => window.close()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[#D6E4F7] bg-white px-3.5 py-2 text-xs font-medium text-[#0F6CBD] shadow-sm hover:bg-[#EFF6FF]"
          >
            <ArrowLeft size={13} />
            Close Tab
          </button>
        </div>

        <div className="mb-4 overflow-hidden rounded-2xl border border-[#D6E4F7] bg-white shadow-sm">
          <div className="bg-gradient-to-r from-[#EFF6FF] via-white to-[#F8FAFC] px-5 py-5 md:px-6">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0F6CBD]">Switch Context</p>
                <div className="mt-2 flex flex-wrap items-end gap-x-5 gap-y-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#64748B]">CO_CD</p>
                    <p className="mt-1 text-3xl font-black tracking-tight text-[#0033A0]">{record.coCd || "—"}</p>
                  </div>
                  <div className="h-10 w-px bg-[#DBEAFE] hidden sm:block" />
                  <HeroStat label="PARTNER_ID" value={record.partnerId} />
                  <HeroStat label="CUST_PRTY" value={record.custPrty} />
                  <HeroStat label="RSRV_CUST_NBR" value={record.rsrvCustNbr} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4 xl:min-w-[520px]">
                <HeroStat label="SKIP_FR_TM" value={record.skipFrTm} />
                <HeroStat label="SKIP_TO_TM" value={record.skipToTm} />
                <HeroStat label="MAX_FUT_DAY" value={record.maxFutDay} />
                <HeroStat label="ACK_DELAY_HRS" value={record.ackDelayHrs} />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {summaryFields.map((field) => (
            <SummaryInfoTile key={field.key} field={field} value={field.value} />
          ))}
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-[#D6E4F7] bg-white shadow-sm">
          <div className="flex gap-1 overflow-x-auto border-b border-[#D6E4F7] bg-[#F8FAFC] px-3 pt-3">
            {FIELD_GROUPS.map((group) => (
              <button
                key={group.id}
                type="button"
                onClick={() => setActiveTab(group.id)}
                className={`inline-flex items-center gap-1.5 rounded-t-xl border-b-2 px-3 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                  activeTab === group.id
                    ? "border-[#0F6CBD] bg-white text-[#0F6CBD]"
                    : "border-transparent text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                {(() => {
                  const Icon = ICON_MAP[group.icon] || Layers;
                  return <Icon size={13} />;
                })()}
                {group.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 p-4 xl:grid-cols-2 xl:p-5">
            {activeGroups.map((group) => (
              <AccordionCard
                key={group.id}
                title={group.label}
                icon={group.iconComponent}
                defaultOpen={group.defaultOpen}
              >
                <div>
                  {group.fields.map((field) => (
                    <DetailFieldRow
                      key={field.key}
                      label={field.label}
                      value={formatDetailValue(field, record[field.key])}
                    />
                  ))}
                </div>
              </AccordionCard>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
