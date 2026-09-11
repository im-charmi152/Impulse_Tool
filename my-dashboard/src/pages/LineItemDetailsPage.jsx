import { useState } from "react";
import {
  ArrowLeft,
  Hash,
  Package,
  BarChart2,
  DollarSign,
  Calendar,
  AlertCircle,
  Truck,
  Cpu,
  Building2,
  FileText,
  Receipt,
  ArrowRightLeft,
  User,
  Check,
  Copy,
  ChevronDown,
} from "lucide-react";
import { LINE_ITEM_FIELD_GROUPS } from "../components/order/lineitem/lineItemFieldConfig";
import { loadDetailsRecord } from "../utils/detailsNavigation";
import { formatDetailValue } from "../components/details/DetailsLayout";

const ICON_MAP = {
  Hash,
  Package,
  BarChart2,
  DollarSign,
  Calendar,
  AlertCircle,
  Truck,
  Cpu,
  Building2,
  FileText,
  Receipt,
  ArrowRightLeft,
  User,
};

const SUMMARY_FIELDS = [
  { key: "lineNbr", label: "LINE_NBR", icon: "Hash", type: "id", copyable: true },
  { key: "imPartNbr", label: "IM_PART_NBR", icon: "Package", type: "id", copyable: true },
  { key: "vendPartNbr", label: "VEND_PART_NBR", icon: "Package", type: "id", copyable: true },
  { key: "vendNbr", label: "VEND_NBR", icon: "Building2", type: "id", copyable: true },
  { key: "qtyOrded", label: "QTY_ORDED", icon: "BarChart2", type: "number" },
  { key: "qtyShpd", label: "QTY_SHPD", icon: "Truck", type: "number" },
  { key: "unitPrc", label: "UNIT_PRC", icon: "DollarSign", type: "number" },
  { key: "unitCost", label: "UNIT_COST", icon: "DollarSign", type: "number" },
];

const SUMMARY_KEYS = new Set(SUMMARY_FIELDS.map((field) => field.key));

function parseFallbackFromParams(searchParams) {
  return {
    lineNbr: searchParams.get("lineNbr") || "—",
    companyCd: searchParams.get("companyCd") || "—",
    branchNbr: searchParams.get("branchNbr") || "—",
    ordrNbr: searchParams.get("ordrNbr") || "—",
    imPartNbr: "—",
    vendPartNbr: "—",
    vendNbr: "—",
    qtyOrded: "—",
    qtyShpd: "—",
    unitPrc: "—",
    unitCost: "—",
  };
}

function resolveLineItem(searchParams) {
  const ref = searchParams.get("ref");
  const stored = loadDetailsRecord(ref, "line-item");
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
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#64748B]">{label}</p>
      <p className="mt-1 text-sm text-[#0F172A]">{value || "—"}</p>
    </div>
  );
}

function FlagValue({ value }) {
  const normalized = String(value ?? "").toUpperCase();

  if (["Y", "1", "TRUE", "YES"].includes(normalized)) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        Enabled
      </span>
    );
  }

  if (["N", "0", "FALSE", "NO", ""].includes(normalized)) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
        Disabled
      </span>
    );
  }

  return <span className="text-xs text-[#0F172A]">{value}</span>;
}

function renderFieldValue(field, value) {
  if (value == null || value === "") {
    return <span className="text-slate-300 text-xs">—</span>;
  }

  if (field.type === "flag") {
    return <FlagValue value={value} />;
  }

  if (field.type === "date") {
    return <span className="text-xs text-[#0F172A]">{formatDetailValue(field, value)}</span>;
  }

  if (field.type === "number") {
    return <span className="text-xs text-[#0F172A]">{value}</span>;
  }

  return (
    <span className="flex items-center gap-1 group">
      <span className={`text-xs text-[#0F172A] ${field.type === "id" ? "font-mono" : ""}`}>
        {String(value)}
      </span>

      {field.copyable && <CopyButton value={value} />}
    </span>
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

export default function LineItemDetailsPage({ searchParams }) {
  const item = resolveLineItem(searchParams);

  // ─────────────────────────────────────────
  // TWO INDEPENDENT ACCORDION STATES
  // ─────────────────────────────────────────

  const [openLeftGroupId, setOpenLeftGroupId] = useState("identity");

  const [openRightGroupId, setOpenRightGroupId] = useState("part");

  // ─────────────────────────────────────────
  // Create group lookup
  // ─────────────────────────────────────────

  const groupsById = Object.fromEntries(
    LINE_ITEM_FIELD_GROUPS.map((g) => [
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
    value: item[field.key],
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
              Selected Line Item
            </div>

            <h1 className="text-lg font-bold text-[#0033A0]">
              Order Line Item Details
            </h1>

            <p className="text-xs text-[#64748B] mt-0.5">
              Detailed information for the selected line item record
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
            LINE ITEM HERO
        ═══════════════════════════════════════ */}

        <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 mb-4 flex flex-wrap items-center gap-x-8 gap-y-3 bg-gradient-to-r from-[#EFF6FF] via-white to-[#F8FAFC] px-5 py-5 md:px-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Package size={18} className="text-[#0033A0]" />
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wide text-[#64748B]">
                Line Item
              </p>

              <p className="text-xl font-bold text-[#0F172A] leading-tight">
                {item.lineNbr ?? "—"}
              </p>
            </div>
          </div>

          <div className="hidden h-10 w-px bg-[#DBEAFE] sm:block" />

          <HeroStat label="ORDER_NBR" value={item.ordrNbr} />
          <HeroStat label="COMPANY_CD" value={item.companyCd} />
          <HeroStat label="BRANCH_NBR" value={item.branchNbr} />
          <HeroStat label="LINE_TYP" value={item.lineTyp} />
          <HeroStat label="LINE_STUS" value={item.lineStus} />
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
                record={item}
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
                record={item}
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
