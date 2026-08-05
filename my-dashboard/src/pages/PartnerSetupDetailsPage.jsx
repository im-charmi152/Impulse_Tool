import { ArrowLeft, Settings } from "lucide-react";
import SectionCard from "../components/common/SectionCard";
import Badge from "../components/common/Badge";
import { PARTNER_SETUP_FIELD_GROUPS } from "../components/setup/setupFieldConfig";
import { normalizeSetupRecord, statusColor } from "../components/setup/setupDetailsUtils";
import { loadDetailsRecord } from "../utils/detailsNavigation";
import { formatDateTime } from "../utils/format";

const SUMMARY_FIELDS = [
  { key: "coCd", label: "Company Code" },
  { key: "partnerId", label: "Partner ID" },
  { key: "partnerTypeCd", label: "Partner Type" },
  { key: "srceSysId", label: "Source System" },
  { key: "formatId", label: "Format" },
  { key: "commuId", label: "Communication ID" },
  { key: "activeStatus", label: "Status" },
];

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

function normalizeValue(value) {
  if (value == null || value === "") return "—";
  return value;
}

function renderFieldValue(field, rawValue, row) {
  if (field.key === "activeStatus") {
    return <Badge color={statusColor(row.activeStatus)}>{row.activeStatus}</Badge>;
  }

  const value = normalizeValue(rawValue);
  if (value === "—") {
    return <span className="text-xs font-normal text-gray-300">—</span>;
  }

  const formatted = field.type === "date" ? formatDateTime(value) : String(value);
  const className = field.type === "id" ? "font-mono" : "";

  if (field.key === "setupNotesTxt") {
    return <p className={`field-value text-xs whitespace-pre-wrap ${className}`}>{formatted}</p>;
  }

  return <span className={`field-value text-xs ${className}`}>{formatted}</span>;
}

function FieldRow({ field, value, row }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[minmax(170px,36%)_1fr] gap-2 sm:gap-4 py-2.5 border-b border-[#DBEAFE] last:border-b-0">
      <span className="field-label text-xs">{field.label}</span>
      <div>{renderFieldValue(field, value, row)}</div>
    </div>
  );
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
    fields: group.fields.filter((field) => !SUMMARY_KEYS.has(field.key)),
  })).filter((group) => group.fields.length > 0);

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

        <SectionCard icon={Settings} title="Summary">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            {SUMMARY_FIELDS.map((field) => (
              <FieldRow key={field.key} field={field} value={record[field.key]} row={record} />
            ))}
          </div>
        </SectionCard>

        <div className="mt-4 grid grid-cols-1 xl:grid-cols-2 gap-4 pb-6">
          {detailGroups.map((group) => (
            <SectionCard key={group.id} icon={Settings} title={group.label}>
              <div>
                {group.fields.map((field) => (
                  <FieldRow key={field.key} field={field} value={record[field.key]} row={record} />
                ))}
              </div>
            </SectionCard>
          ))}
        </div>
      </main>
    </div>
  );
}
