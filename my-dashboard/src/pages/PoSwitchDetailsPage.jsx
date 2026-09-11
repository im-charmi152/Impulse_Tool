import { useState } from "react";
import {
  ArrowLeft,
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
  ChevronDown,
} from "lucide-react";
import { loadDetailsRecord } from "../utils/detailsNavigation";
import { formatDetailValue } from "../components/details/DetailsLayout";

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

// ─────────────────────────────────────────────────────────────
// Copy Button
// ─────────────────────────────────────────────────────────────

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);

  if (value == null || value === "" || value === "—") {
    return null;
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();

        navigator.clipboard?.writeText(String(value)).catch(() => {});

        setCopied(true);

        setTimeout(() => {
          setCopied(false);
        }, 1500);
      }}
      className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded text-slate-300 hover:text-[#0F6CBD] hover:bg-blue-50"
      aria-label="Copy"
    >
      {copied ? (
        <Check size={11} className="text-green-600" />
      ) : (
        <Copy size={11} />
      )}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Flag Value
// ─────────────────────────────────────────────────────────────

function FlagValue({ value }) {
  const v = String(value ?? "").toUpperCase();

  if (["Y", "1", "TRUE", "YES"].includes(v)) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        Enabled
      </span>
    );
  }

  if (["N", "0", "FALSE", "NO", ""].includes(v)) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
        Disabled
      </span>
    );
  }

  return <span className="text-xs text-[#0F172A]">{value}</span>;
}

// ─────────────────────────────────────────────────────────────
// Field Value Renderer
// ─────────────────────────────────────────────────────────────

function renderFieldValue(field, value) {
  if (value == null || value === "") {
    return <span className="text-slate-300 text-xs">—</span>;
  }

  if (field.type === "flag") {
    return <FlagValue value={value} />;
  }

  if (field.type === "date") {
    return (
      <span className="text-xs text-[#0F172A]">{formatDetailValue(field, value)}</span>
    );
  }

  if (field.type === "number") {
    return (
      <span className="text-xs text-[#0F172A]">
        {value}
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1 group">
      <span
        className={`text-xs text-[#0F172A] ${
          field.type === "id" ? "font-mono" : ""
        }`}
      >
        {String(value)}
      </span>

      {field.copyable && <CopyButton value={value} />}
    </span>
  );
}

function SummaryInfoTile({ field, value }) {
  const Icon = ICON_MAP[field.icon] || FileText;

  return (
    <div className="group flex items-start gap-3 rounded-xl border border-[#DBEAFE] bg-white p-3.5 hover:border-[#BFDBFE] hover:shadow-sm transition-all duration-150">
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF]">
        <Icon size={16} className="text-[#0F6CBD]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#64748B]">{field.label}</p>
        <div className="mt-1 flex items-center gap-1.5">
          <div className="min-w-0 text-sm text-[#0F172A] break-words">{formatDetailValue(field, value)}</div>
          {field.copyable && <CopyButton value={value} />}
        </div>
      </div>
    </div>
  );
}

function HeroStat({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#64748B]">
        {label}
      </p>
      <p className="mt-1 text-sm text-[#0F172A]">{value || "—"}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Accordion Section
// ─────────────────────────────────────────────────────────────

function AccordionSection({ group, record, open, onToggle }) {
  const filledCount = group.fields.filter(
    (field) =>
      record[field.key] !== null &&
      record[field.key] !== undefined &&
      record[field.key] !== "" &&
      record[field.key] !== "—",
  ).length;

  return (
    <div className="border border-[#E2E8F0] rounded-lg overflow-hidden bg-white">
      {/* Accordion Header */}
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-md bg-blue-50 flex items-center justify-center flex-shrink-0">
            <group.iconComponent size={13} className="text-[#0F6CBD]" />
          </div>

          <div className="text-left min-w-0">
            <div className="text-sm font-semibold text-[#0F172A]">
              {group.label}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[10px] text-[#64748B]">
            {filledCount} fields
          </span>

          <ChevronDown
            size={14}
            className={`text-[#64748B] transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Accordion Content */}
      {open && (
        <div className="px-4 pb-3 border-t border-[#E2E8F0]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            {group.fields.map((field) => (
              <div
                key={field.key}
                className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0 gap-3"
              >
                <span className="text-xs text-[#64748B] flex-shrink-0">
                  {field.label}
                </span>

                <div className="text-right">
                  {renderFieldValue(field, record[field.key])}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────

export default function PoSwitchDetailsPage({ searchParams }) {
  const record = resolveRecord(searchParams);

  // ─────────────────────────────────────────
  // TWO INDEPENDENT ACCORDION STATES
  // ─────────────────────────────────────────

  const [openLeftGroupId, setOpenLeftGroupId] = useState("identity");

  const [openRightGroupId, setOpenRightGroupId] = useState("timing");

  // ─────────────────────────────────────────
  // Create group lookup
  // ─────────────────────────────────────────

  const groupsById = Object.fromEntries(
    FIELD_GROUPS.map((g) => [
      g.id,
      {
        ...g,
        iconComponent: ICON_MAP[g.icon] || FileText,
        fields: g.fields.filter((field) => !SUMMARY_KEYS.has(field.key)),
      },
    ]),
  );

  // ─────────────────────────────────────────
  // Get all groups and split into columns
  // ─────────────────────────────────────────

  const allGroups = Object.values(groupsById);

  const leftGroups = allGroups.filter((_, index) => index % 2 === 0);

  const rightGroups = allGroups.filter((_, index) => index % 2 !== 0);

  // ─────────────────────────────────────────
  // Summary tiles
  // ─────────────────────────────────────────

  const summaryTiles = SUMMARY_FIELDS.map((field) => ({
    ...field,
    value: record[field.key],
  }));

  // ─────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A]">
      <main className="max-w-[1440px] mx-auto p-4 md:p-6">
        {/* ═══════════════════════════════════════
            TITLE & CLOSE BUTTON
        ═══════════════════════════════════════ */}

        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <div className="mb-2 inline-flex items-center rounded-full border border-[#DBEAFE] bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#0F6CBD]">
              PO Switch Record
            </div>

            <h1 className="text-lg font-bold text-[#0033A0]">
              PO Switch Details
            </h1>

            <p className="text-xs text-[#64748B] mt-0.5">
              Detailed information for the selected PO switch record
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.close()}
              className="flex items-center gap-1.5 text-xs font-medium text-white bg-[#0033A0] rounded-md px-3 py-2 hover:bg-[#002580]"
            >
              <ArrowLeft size={13} />
              Close Tab
            </button>
          </div>
        </div>

        {/* ═══════════════════════════════════════
            PO SWITCH HERO
        ═══════════════════════════════════════ */}

        <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 mb-4 flex flex-wrap items-center gap-x-8 gap-y-3 bg-gradient-to-r from-[#EFF6FF] via-white to-[#F8FAFC] px-5 py-5 md:px-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Layers size={18} className="text-[#0033A0]" />
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wide text-[#64748B]">
                PO Switch
              </p>

              <p className="text-xl font-bold text-[#0F172A] leading-tight">
                {record.coCd ?? "—"}
              </p>
            </div>
          </div>

          <div className="hidden h-10 w-px bg-[#DBEAFE] sm:block" />

          <HeroStat label="PARTNER_ID" value={record.partnerId} />
          <HeroStat label="CUST_PRTY" value={record.custPrty} />
          <HeroStat label="RSRV_CUST_NBR" value={record.rsrvCustNbr} />
          <HeroStat label="SKIP_FR_TM" value={record.skipFrTm} />
          <HeroStat label="SKIP_TO_TM" value={record.skipToTm} />
        </div>

        {/* ═══════════════════════════════════════
            SUMMARY TILES
        ═══════════════════════════════════════ */}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
          {summaryTiles.map((t) => (
            <SummaryInfoTile
              key={t.key}
              field={t}
              value={t.value}
            />
          ))}
        </div>

        {/* ═══════════════════════════════════════
            ACCORDION SECTIONS
            TWO INDEPENDENT COLUMNS
        ═══════════════════════════════════════ */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* ─────────────────────────────────────
              LEFT COLUMN
          ───────────────────────────────────── */}

          <div className="flex flex-col gap-2">
            {leftGroups.map((group) => (
              <AccordionSection
                key={group.id}
                group={group}
                record={record}
                open={openLeftGroupId === group.id}
                onToggle={() => {
                  setOpenLeftGroupId((currentId) =>
                    currentId === group.id ? null : group.id,
                  );
                }}
              />
            ))}
          </div>

          {/* ─────────────────────────────────────
              RIGHT COLUMN
          ───────────────────────────────────── */}

          <div className="flex flex-col gap-2">
            {rightGroups.map((group) => (
              <AccordionSection
                key={group.id}
                group={group}
                record={record}
                open={openRightGroupId === group.id}
                onToggle={() => {
                  setOpenRightGroupId((currentId) =>
                    currentId === group.id ? null : group.id,
                  );
                }}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
