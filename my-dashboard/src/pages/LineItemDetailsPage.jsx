import { useState } from "react";
import {
  ArrowLeft,
  Layers,
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
import { AccordionCard, DetailFieldRow, formatDetailValue } from "../components/details/DetailsLayout";
import SectionCard from "../components/common/SectionCard";

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
  icon: ICON_MAP[group.icon] || Layers,
}));

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

export default function LineItemDetailsPage({ searchParams }) {
  const [activeTab, setActiveTab] = useState(LINE_ITEM_FIELD_GROUPS[0]?.id || "identity");
  const item = resolveLineItem(searchParams);
  const groupsById = Object.fromEntries(LINE_ITEM_FIELD_GROUPS.map((group) => [
    group.id,
    {
      ...group,
      iconComponent: ICON_MAP[group.icon] || Layers,
      fields: group.fields.filter((field) => !SUMMARY_KEYS.has(field.key)),
    },
  ]));

  const activeGroups = [groupsById[activeTab]].filter((group) => group && group.fields.length > 0);

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
            <h1 className="text-2xl font-black uppercase tracking-[0.18em] text-[#0033A0] md:text-3xl">
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
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#0F6CBD]">Line Item Context</p>
                <div className="mt-2 flex flex-wrap items-end gap-x-5 gap-y-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#64748B]">LINE_NBR</p>
                    <p className="mt-1 text-3xl font-black tracking-tight text-[#0033A0]">{item.lineNbr || "—"}</p>
                  </div>
                  <div className="h-10 w-px bg-[#DBEAFE] hidden sm:block" />
                  <HeroStat label="ORDER_NBR" value={item.ordrNbr} />
                  <HeroStat label="COMPANY_CD" value={item.companyCd} />
                  <HeroStat label="BRANCH_NBR" value={item.branchNbr} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4 xl:min-w-[520px]">
                <HeroStat label="LINE_TYP" value={item.lineTyp} />
                <HeroStat label="LINE_STUS" value={item.lineStus} />
                <HeroStat label="UM" value={item.um} />
                <HeroStat label="BASE_UM" value={item.baseUm} />
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

          <div className="grid grid-cols-1 gap-4 p-4 xl:grid-cols-2 xl:p-5">
            {activeGroups.map((group, index) => (
              <AccordionCard
                key={group.id}
                title={group.label}
                icon={group.iconComponent}
                defaultOpen={index === 0 ? true : group.defaultOpen}
              >
                <div>
                  {group.fields.map((field) => (
                    <DetailFieldRow
                      key={field.key}
                      label={field.label}
                      value={formatDetailValue(field, item[field.key])}
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
