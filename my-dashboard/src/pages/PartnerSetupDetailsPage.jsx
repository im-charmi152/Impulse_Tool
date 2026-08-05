import { ArrowLeft, Settings, Hash, Package, BarChart2, DollarSign, Calendar, AlertCircle, Truck, Cpu, Building2, Users, FileText, Globe } from "lucide-react";
import Badge from "../components/common/Badge";
import { PARTNER_SETUP_FIELD_GROUPS } from "../components/setup/setupFieldConfig";
import { normalizeSetupRecord, statusColor } from "../components/setup/setupDetailsUtils";
import { loadDetailsRecord } from "../utils/detailsNavigation";
import { AccordionCard, DetailFieldRow, SummaryTile, formatDetailValue } from "../components/details/DetailsLayout";

const SUMMARY_FIELDS = [
  { key: "coCd", label: "Company Code", icon: "Building2" },
  { key: "partnerId", label: "Partner ID", icon: "Users" },
  { key: "partnerTypeCd", label: "Partner Type", icon: "Settings" },
  { key: "srceSysId", label: "Source System", icon: "Package" },
  { key: "formatId", label: "Format", icon: "FileText" },
  { key: "commuId", label: "Communication ID", icon: "Globe" },
  { key: "activeStatus", label: "Status", icon: "AlertCircle" },
];

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
  Users,
  FileText,
  Globe,
  Settings,
};

const SUMMARY_KEYS = new Set(SUMMARY_FIELDS.map((field) => field.key));

function toFallbackRecord(searchParams) {
  return normalizeSetupRecord({
    coCd: searchParams.get("coCd") || "—",
    partnerId: searchParams.get("partnerId") || "—",
    partnerTypeCd: searchParams.get("partnerTypeCd") || "—",
    srceSysId: searchParams.get("srceSysId") || "—",
    formatId: searchParams.get("formatId") || "—",
    commuId: searchParams.get("commuId") || "—",
  });
}

function resolveRecord(searchParams) {
  const ref = searchParams.get("ref");
  const stored = loadDetailsRecord(ref, "partner-setup");
  if (stored) return normalizeSetupRecord(stored);
  return toFallbackRecord(searchParams);
}

export default function PartnerSetupDetailsPage({ searchParams }) {
  const record = resolveRecord(searchParams);
  const detailGroups = PARTNER_SETUP_FIELD_GROUPS.map((group) => ({
    ...group,
    iconComponent: ICON_MAP[group.icon] || Settings,
    fields: group.fields.filter((field) => !SUMMARY_KEYS.has(field.key)),
  })).filter((group) => group.fields.length > 0);

  const summaryTiles = SUMMARY_FIELDS.map((field) => ({
    ...field,
    icon: ICON_MAP[field.icon] || undefined,
    value: record[field.key],
  }));

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <main className="max-w-[1400px] mx-auto p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h1 className="text-xl font-bold text-[#1D4ED8]">Partner Setup Details</h1>
            <p className="text-xs text-[#6B7280] mt-0.5">Dedicated detail page for the selected partner setup record</p>
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
            <SummaryTile key={field.key} label={field.label} value={field.key === "activeStatus" ? <Badge color={statusColor(record.activeStatus)}>{record.activeStatus}</Badge> : formatDetailValue({ ...field, type: field.key === "activeStatus" ? "status" : "text" }, field.value)} icon={field.icon} />
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 xl:grid-cols-2 gap-4 pb-6">
          {detailGroups.map((group) => (
            <AccordionCard key={group.id} title={group.label} icon={group.iconComponent} defaultOpen={group.defaultOpen}>
              <div>
                {group.fields.map((field) => (
                  <DetailFieldRow
                    key={field.key}
                    label={field.label}
                    value={field.key === "activeStatus" ? <Badge color={statusColor(record.activeStatus)}>{record.activeStatus}</Badge> : formatDetailValue(field, record[field.key])}
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
