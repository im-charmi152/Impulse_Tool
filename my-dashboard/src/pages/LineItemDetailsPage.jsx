import { ArrowLeft, Layers, Hash, Package, BarChart2, DollarSign, Calendar, AlertCircle, Truck, Cpu, Building2, FileText } from "lucide-react";
import { LINE_ITEM_FIELD_GROUPS } from "../components/order/lineitem/lineItemFieldConfig";
import { loadDetailsRecord } from "../utils/detailsNavigation";
import { AccordionCard, DetailFieldRow, SummaryTile, formatDetailValue } from "../components/details/DetailsLayout";

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
};

const SUMMARY_FIELDS = [
  { key: "companyCd", label: "Company Code", icon: "Building2" },
  { key: "branchNbr", label: "Branch Number", icon: "Building2" },
  { key: "custNbr", label: "Customer Number", icon: "Hash" },
  { key: "custPoNbr", label: "Customer PO Number", icon: "FileText" },
  { key: "lineNbr", label: "Line Number", icon: "Hash" },
  { key: "imPartNbr", label: "IM Part Number", icon: "Package" },
  { key: "qtyOrded", label: "Quantity Ordered", icon: "BarChart2" },
];

const SUMMARY_KEYS = new Set(SUMMARY_FIELDS.map((field) => field.key));

function parseFallbackFromParams(searchParams) {
  return {
    lineNbr: searchParams.get("lineNbr") || "—",
    companyCd: searchParams.get("companyCd") || "—",
    branchNbr: searchParams.get("branchNbr") || "—",
    custNbr: searchParams.get("custNbr") || "—",
    custPoNbr: searchParams.get("custPoNbr") || "—",
    imPartNbr: "—",
    qtyOrded: "—",
  };
}

function resolveLineItem(searchParams) {
  const ref = searchParams.get("ref");
  const stored = loadDetailsRecord(ref, "line-item");
  return stored || parseFallbackFromParams(searchParams);
}

export default function LineItemDetailsPage({ searchParams }) {
  const item = resolveLineItem(searchParams);
  const detailGroups = LINE_ITEM_FIELD_GROUPS.map((group) => ({
    ...group,
    iconComponent: ICON_MAP[group.icon] || Layers,
    fields: group.fields.filter((field) => !SUMMARY_KEYS.has(field.key)),
  })).filter((group) => group.fields.length > 0);

  const summaryTiles = SUMMARY_FIELDS.map((field) => ({
    ...field,
    icon: ICON_MAP[field.icon] || undefined,
    value: item[field.key],
  }));

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <main className="max-w-[1400px] mx-auto p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h1 className="text-xl font-bold text-[#1D4ED8]">Line Item Details</h1>
            <p className="text-xs text-[#6B7280] mt-0.5">Dedicated detail page for the selected line item</p>
          </div>
          <button
            type="button"
            onClick={() => window.close()}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#2563EB] border border-[#DBEAFE] rounded-xl px-3 py-1.5 hover:bg-[#EFF6FF]"
          >
            <ArrowLeft size={13} />
            Close Tab
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {summaryTiles.map((field) => (
            <SummaryTile key={field.key} label={field.label} value={formatDetailValue(field, field.value)} icon={field.icon} />
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 xl:grid-cols-2 gap-4 pb-6">
          {detailGroups.map((group) => {
            return (
              <AccordionCard key={group.id} title={group.label} icon={group.iconComponent} defaultOpen={group.defaultOpen}>
                <div>
                  {group.fields.map((field) => (
                    <DetailFieldRow key={field.key} label={field.label} value={formatDetailValue(field, item[field.key])} />
                  ))}
                </div>
              </AccordionCard>
            );
          })}
        </div>
      </main>
    </div>
  );
}
