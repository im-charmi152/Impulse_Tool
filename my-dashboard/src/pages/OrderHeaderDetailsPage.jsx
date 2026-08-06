import {
  ArrowLeft,
  ShoppingCart,
  User,
  Users,
  Truck,
  DollarSign,
  Settings,
  Flag,
  Cpu,
  FileText,
  Hash,
  Activity,
  Building2,
  Calendar,
  AlertCircle,
  Building,
  Globe,
} from "lucide-react";
import {
  FIELD_GROUPS,
  SUMMARY_FIELDS,
} from "../components/order/header/fieldConfig";
import { loadDetailsRecord } from "../utils/detailsNavigation";
import {
  AccordionCard,
  DetailFieldRow,
  SummaryTile,
  formatDetailValue,
} from "../components/details/DetailsLayout";

const ICON_MAP = {
  ShoppingCart,
  User,
  Users,
  Truck,
  DollarSign,
  Settings,
  Flag,
  Cpu,
  FileText,
  Hash,
  Activity,
  Building2,
  Calendar,
  AlertCircle,
  Building,
  Globe,
};

const SUMMARY_KEYS = new Set(SUMMARY_FIELDS.map((field) => field.key));

function parseFallbackFromParams(searchParams) {
  return {
    poNumber: searchParams.get("poNumber") || "-",
    imiAsgdBrNbr: searchParams.get("imiAsgdBrNbr") || "-",
    accountNumber: searchParams.get("accountNumber") || "-",
    partnerId: searchParams.get("partnerId") || "-",
  };
}

function resolveRecord(searchParams) {
  const ref = searchParams.get("ref");
  const stored = loadDetailsRecord(ref, "order-header");
  return stored || parseFallbackFromParams(searchParams);
}

export default function OrderHeaderDetailsPage({ searchParams }) {
  const record = resolveRecord(searchParams);

  const summaryTiles = SUMMARY_FIELDS.map((field) => ({
    ...field,
    icon: ICON_MAP[field.icon] || undefined,
    value: record[field.key],
  }));

  const detailGroups = FIELD_GROUPS.map((group) => ({
    ...group,
    iconComponent: ICON_MAP[group.icon] || FileText,
    fields: group.fields.filter((field) => !SUMMARY_KEYS.has(field.key)),
  })).filter((group) => group.fields.length > 0);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <main className="max-w-[1400px] mx-auto p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h1 className="text-xl font-bold text-[#0F6CBD]">Order Header Details</h1>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Dedicated detail page for the selected order header record
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.close()}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0F6CBD] border border-[#D6E4F7] rounded-xl px-3 py-1.5 hover:bg-[#EFF6FF]"
          >
            <ArrowLeft size={13} />
            Close Tab
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {summaryTiles.map((field) => (
            <SummaryTile
              key={field.key}
              label={field.label}
              value={formatDetailValue(field, field.value)}
              icon={field.icon}
            />
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 xl:grid-cols-2 gap-4 pb-6">
          {detailGroups.map((group) => (
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
      </main>
    </div>
  );
}
