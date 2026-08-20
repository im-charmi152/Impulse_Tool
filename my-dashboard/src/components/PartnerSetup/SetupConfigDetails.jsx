import { useMemo } from "react";
import {
  BadgeCheck,
  Building2,
  Database,
  FileText,
  Globe,
  Hash,
  Send,
  Settings,
  Users,
} from "lucide-react";
import SectionCard from "../common/SectionCard";
import Badge from "../common/Badge";
import { openPartnerSetupDetailsTab } from "../../utils/detailsNavigation";
import { normalizeSetupRecord, statusColor } from "./setupDetailsUtils";

const SUMMARY_FIELDS = [
  { key: "coCd", label: "Company Code (CO_CD)", icon: Building2 },
  { key: "partnerId", label: "Partner ID", icon: Users },
  { key: "partnerTypeCd", label: "Partner Type", icon: Users },
  { key: "srceSysId", label: "Source System", icon: Globe },
  { key: "srceSysKeyId", label: "Source System Key", icon: Hash },
  { key: "formatId", label: "Format", icon: FileText },
  { key: "docId", label: "Document ID", icon: FileText },
  { key: "commuId", label: "Communication ID", icon: Send },
  { key: "internetAddrTxt", label: "Internet Address", icon: Globe },
  { key: "dirFlgCd", label: "Direction Flag", icon: BadgeCheck },
  { key: "sendThruId", label: "Send Thru ID", icon: Database },
  { key: "activeStatus", label: "Active Status", icon: Settings },
];

function SetupFieldCard({ field, value }) {
  const Icon = field.icon;
  const isEmpty = value == null || value === "";

  return (
    <div className="group flex items-start gap-2.5 rounded-xl border border-[#D6E4F7] bg-white p-3 transition-all duration-150 hover:border-[#BFDBFE] hover:shadow-sm">
      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md bg-[#EFF6FF] mt-0.5">
        <Icon size={13} className="text-[#0F6CBD]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="field-label mb-1 text-[9px] uppercase tracking-wider text-[#111827]">
          {field.label}
        </p>
        <div className="flex items-start">
          {field.key === "activeStatus" ? (
            isEmpty ? (
              <span className="text-[#111827] text-xs">—</span>
            ) : (
              <Badge color={statusColor(value)}>{value}</Badge>
            )
          ) : isEmpty ? (
            <span className="text-[#111827] text-xs">—</span>
          ) : (
            <span className="field-value text-xs leading-tight text-[#111827]">{String(value)}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function SetupConfigDetails({ config }) {
  const records = useMemo(() => {
    if (Array.isArray(config)) {
      return config
        .filter((entry) => entry && typeof entry === "object" && !Array.isArray(entry))
        .map((entry) => normalizeSetupRecord(entry));
    }

    if (config && typeof config === "object" && !Array.isArray(config)) {
      return [normalizeSetupRecord(config)];
    }

    return [];
  }, [config]);

  const fallbackRecord = useMemo(
    () => ({ ...normalizeSetupRecord({}), activeStatus: "—" }),
    [],
  );
  const primaryRecord = records[0] ?? fallbackRecord;

  return (
    <SectionCard icon={Settings} title="Partner Setup Details">
      <div
        role="button"
        tabIndex={0}
        onClick={() => openPartnerSetupDetailsTab(primaryRecord)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openPartnerSetupDetailsTab(primaryRecord);
          }
        }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 cursor-pointer"
      >
        {SUMMARY_FIELDS.map((field) => (
          <SetupFieldCard
            key={field.key}
            field={field}
            value={primaryRecord[field.key]}
          />
        ))}
      </div>
    </SectionCard>
  );
}

export default SetupConfigDetails;
