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

const TABS = LINE_ITEM_FIELD_GROUPS.map((group) => ({
  id: group.id,
  label: group.label,
  icon: ICON_MAP[group.icon] || FileText,
}));

function splitGroupIntoSections(group) {
  const midpoint = Math.ceil(group.fields.length / 2);

  return [
    { id: `${group.id}-left`, fields: group.fields.slice(0, midpoint) },
    { id: `${group.id}-right`, fields: group.fields.slice(midpoint) },
  ].filter((section) => section.fields.length > 0);
}

function CompactDetailField({ field, value }) {
  return (
    <div className="rounded-lg border border-[#DBEAFE] bg-[#FCFDFF] px-3 py-2.5">
      <p className="field-label text-[10px] uppercase tracking-[0.12em] leading-tight">{field.label}</p>
      <div className="mt-1 text-xs text-[#0F172A] break-words">{formatDetailValue(field, value)}</div>
    </div>
  );
}

function GroupColumn({ section, item }) {
  return (
    <div className="enterprise-card h-full p-4 md:p-5">
      <div className="grid grid-cols-1 gap-2">
        {section.fields.map((field) => (
          <CompactDetailField key={field.key} field={field} value={item[field.key]} />
        ))}
      </div>
    </div>
  );
}

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

export default function LineItemDetailsPage({ searchParams }) {
  const [activeTab, setActiveTab] = useState(LINE_ITEM_FIELD_GROUPS[0]?.id || "identity");
  const item = resolveLineItem(searchParams);
  const groupsById = Object.fromEntries(LINE_ITEM_FIELD_GROUPS.map((group) => [
    group.id,
    {
      ...group,
      iconComponent: ICON_MAP[group.icon] || FileText,
      fields: group.fields.filter((field) => !SUMMARY_KEYS.has(field.key)),
    },
  ]));

  const activeGroup = groupsById[activeTab];
  const columns = activeGroup && activeGroup.fields.length > 0
    ? splitGroupIntoSections(activeGroup)
    : [];

  const summaryTiles = SUMMARY_FIELDS.map((field) => ({
    ...field,
    value: item[field.key],
  }));

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A]">
      <main className="mx-auto max-w-[1440px] p-4 md:p-6">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="mb-2 inline-flex items-center rounded-full border border-[#DBEAFE] bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#0F6CBD]">
              Selected Line Item
            </div>
            <h1 className="text-lg font-semibold uppercase text-[#0033A0]">
              ORDER LINE ITEMS DETAILS
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

      {/* Left Side */}
      <div className="min-w-0">
        <div className="flex flex-wrap items-end gap-x-5 gap-y-3">

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#64748B]">
              LINE_NBR
            </p>
            <p className="mt-1 text-3xl font-black tracking-tight text-[#0033A0]">
              {item.lineNbr || "—"}
            </p>
          </div>

          <div className="hidden h-10 w-px bg-[#DBEAFE] sm:block" />

          <HeroStat label="ORDER_NBR" value={item.ordrNbr} />
          <HeroStat label="COMPANY_CD" value={item.companyCd} />
          <HeroStat label="BRANCH_NBR" value={item.branchNbr} />

        </div>
      </div>

      {/* Right Side - Only Line Type & Line Status */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-3 xl:min-w-[260px]">
        <HeroStat label="LINE_TYP" value={item.lineTyp} />
        <HeroStat label="LINE_STUS" value={item.lineStus} />
      </div>
      </div>
      </div>
      </div>

        <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {summaryTiles.map((field) => (
            <SummaryInfoTile key={field.key} field={field} value={field.value} />
          ))}
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-[#D6E4F7] bg-white shadow-sm">
          <div className="flex gap-1 overflow-x-auto border-b border-[#D6E4F7] bg-[#F8FAFC] px-3 pt-3">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-1.5 rounded-t-xl border-b-2 px-3 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-[#0F6CBD] bg-white text-[#0F6CBD]"
                    : "border-transparent text-[#64748B] hover:text-[#0F172A]"
                }`}
              >
                <tab.icon size={13} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:p-5">
            {columns.map((section) => (
              <GroupColumn
                key={section.id}
                section={section}
                item={item}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
