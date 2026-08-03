import { ArrowLeft, Layers, Hash, Package, BarChart2, DollarSign, Calendar, AlertCircle, Truck, Cpu } from "lucide-react";
import SectionCard from "../components/common/SectionCard";
import Badge from "../components/common/Badge";
import { LINE_ITEM_FIELD_GROUPS } from "../components/order/lineitem/lineItemFieldConfig";
import { loadDetailsRecord } from "../utils/detailsNavigation";
import { formatDateTime } from "../utils/format";

const ICON_MAP = {
  Hash,
  Package,
  BarChart2,
  DollarSign,
  Calendar,
  AlertCircle,
  Truck,
  Cpu,
};

const SUMMARY_FIELDS = [
  { key: "custCoCd", label: "Customer Company Code" },
  { key: "custBr", label: "Customer Branch" },
  { key: "custNbr", label: "Customer Number" },
  { key: "custPoNbr", label: "Customer PO Number" },
  { key: "imiLineNbr", label: "IMI Line Number" },
  { key: "imiPartNbr", label: "IMI Part Number" },
  { key: "qtyOrdered", label: "Quantity Ordered" },
];

const SUMMARY_KEYS = new Set(SUMMARY_FIELDS.map((field) => field.key));

function normalizeValue(value) {
  if (value == null || value === "") return "—";
  return value;
}

function parseFallbackFromParams(searchParams) {
  return {
    imiLineNbr: searchParams.get("imiLineNbr") || "—",
    custCoCd: searchParams.get("custCoCd") || "—",
    custBr: searchParams.get("custBr") || "—",
    custNbr: searchParams.get("custNbr") || "—",
    custPoNbr: searchParams.get("custPoNbr") || "—",
    imiPartNbr: "—",
    qtyOrdered: "—",
  };
}

function renderFieldValue(field, rawValue) {
  const value = normalizeValue(rawValue);

  if (value === "—") {
    return <span className="text-xs font-normal text-gray-300">—</span>;
  }

  if (field.type === "flag") {
    const asString = String(value).toUpperCase();
    if (asString === "Y" || asString === "1" || asString === "TRUE") {
      return <Badge color="green">Enabled</Badge>;
    }
    if (asString === "N" || asString === "0" || asString === "FALSE") {
      return <Badge color="gray">Disabled</Badge>;
    }
  }

  const formatted = field.type === "date" ? formatDateTime(value) : String(value);
  return (
    <span className={`text-xs font-normal text-gray-800 ${field.type === "id" ? "font-mono" : ""}`}>
      {formatted}
    </span>
  );
}

function FieldRow({ field, value }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[minmax(170px,36%)_1fr] gap-2 sm:gap-4 py-2.5 border-b border-gray-50 last:border-b-0">
      <span className="text-xs font-semibold text-gray-600">{field.label}</span>
      <div>{renderFieldValue(field, value)}</div>
    </div>
  );
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
    fields: group.fields.filter((field) => !SUMMARY_KEYS.has(field.key)),
  })).filter((group) => group.fields.length > 0);

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <main className="max-w-[1400px] mx-auto p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Line Item Details</h1>
            <p className="text-xs text-gray-500 mt-0.5">Dedicated detail page for the selected line item</p>
          </div>
          <button
            type="button"
            onClick={() => window.close()}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700 border border-blue-200 rounded px-3 py-1.5 hover:bg-blue-50 transition-colors"
          >
            <ArrowLeft size={13} />
            Close Tab
          </button>
        </div>

        <SectionCard icon={Layers} title="Summary">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            {SUMMARY_FIELDS.map((field) => (
              <FieldRow key={field.key} field={field} value={item[field.key]} />
            ))}
          </div>
        </SectionCard>

        <div className="mt-4 grid grid-cols-1 xl:grid-cols-2 gap-4 pb-6">
          {detailGroups.map((group) => {
            const Icon = ICON_MAP[group.icon] || Layers;
            return (
              <SectionCard key={group.id} icon={Icon} title={group.label}>
                <div>
                  {group.fields.map((field) => (
                    <FieldRow key={field.key} field={field} value={item[field.key]} />
                  ))}
                </div>
              </SectionCard>
            );
          })}
        </div>
      </main>
    </div>
  );
}
