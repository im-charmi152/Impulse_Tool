import { useState } from "react";
import {
  ArrowLeft, Search, Bell, HelpCircle, ChevronDown, Copy, Check,
  Settings, Hash, Package, BarChart2, DollarSign, Calendar,
  AlertCircle, Truck, Cpu, Building2, Users, FileText, Globe,
  ChevronRight, Download,
} from "lucide-react";
import Badge from "../components/common/Badge";
import { PARTNER_SETUP_FIELD_GROUPS } from "../components/PartnerSetup/setupFieldConfig";
import { normalizeSetupRecord, statusColor } from "../components/PartnerSetup/setupDetailsUtils";
import { loadDetailsRecord } from "../utils/detailsNavigation";
import { formatDateTime } from "../utils/format";

const ICON_MAP = {
  Hash, Package, BarChart2, DollarSign, Calendar, AlertCircle,
  Truck, Cpu, Building2, Users, FileText, Globe, Settings,
};

// ── Tab grouping — reuses every existing PARTNER_SETUP_FIELD_GROUPS entry
// (general, source, communication, processing, schedule, status, audit,
// notes), just organized under 4 tabs. No fields added, removed, or
// renamed — presentation-only, same as the Order Header page.
const TAB_GROUP_MAP = {
  overview: ["general", "source"],
  communication: ["communication"],
  processing: ["processing", "schedule"],
  status: ["status", "audit", "notes"],
};

const TABS = [
  { id: "overview", label: "Overview", icon: Building2 },
  { id: "communication", label: "Communication", icon: Globe },
  { id: "processing", label: "Processing", icon: Cpu },
  { id: "status", label: "Status", icon: AlertCircle },
];

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

// ── Small building blocks — same pattern as OrderHeaderDetailsPage ──────

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);
  if (value == null || value === "" || value === "—") return null;
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
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

function renderFieldValue(field, value) {
  if (value == null || value === "" || value === "—") return <span className="text-slate-300 text-xs">—</span>;
  if (field.type === "date") return <span className="text-xs text-[#0F172A]">{formatDateTime(value)}</span>;
  if (field.type === "number") return <span className="text-xs text-[#0F172A]">{value}</span>;
  return (
    <span className="flex items-center gap-1 group">
      <span className="text-xs text-[#0F172A]">{String(value)}</span>
      {field.copyable && <CopyButton value={value} />}
    </span>
  );
}

function KeyInfoTile({ label, value, icon: Icon, copyable }) {
  return (
    <div className="group flex items-start gap-2.5 p-3 rounded-lg bg-white border border-[#E2E8F0] hover:border-[#0F6CBD]/30 transition-colors">
      <div className="w-7 h-7 rounded-md bg-blue-50 flex items-center justify-center flex-shrink-0">
        <Icon size={13} className="text-[#0F6CBD]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[9px] uppercase tracking-wide text-[#64748B] mb-0.5">{label}</p>
        <div className="flex items-center gap-1">
          <span className="text-sm font-semibold text-[#0F172A] truncate">{value ?? "—"}</span>
          {copyable && <CopyButton value={value} />}
        </div>
      </div>
    </div>
  );
}

function AccordionSection({ group, record, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  const filledCount = group.fields.filter((f) => record[f.key] != null && record[f.key] !== "" && record[f.key] !== "—").length;

  return (
    <div className="border border-[#E2E8F0] rounded-lg overflow-hidden bg-white mb-2">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
        aria-expanded={open}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-md bg-blue-50 flex items-center justify-center flex-shrink-0">
            <group.iconComponent size={13} className="text-[#0F6CBD]" />
          </div>
          <div className="text-left min-w-0">
            <div className="text-sm font-semibold text-[#0F172A]">{group.label}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[10px] text-[#64748B]">{filledCount} fields</span>
          <ChevronDown size={14} className={`text-[#64748B] transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>
      {open && (
        <div className="px-4 pb-3 border-t border-[#E2E8F0]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
            {group.fields.map((field) => (
              <div key={field.key} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0 gap-3">
                <span className="text-xs text-[#64748B] flex-shrink-0">{field.label}</span>
                <div className="text-right">{renderFieldValue(field, record[field.key])}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PartnerSetupDetailsPage({ searchParams }) {
  const record = resolveRecord(searchParams);
  const [activeTab, setActiveTab] = useState("overview");

  const groupsById = Object.fromEntries(
    PARTNER_SETUP_FIELD_GROUPS.map((g) => [g.id, { ...g, iconComponent: ICON_MAP[g.icon] || Settings }])
  );

  const activeGroups = (TAB_GROUP_MAP[activeTab] || [])
    .map((id) => groupsById[id])
    .filter(Boolean);

  const heroFields = [
    { label: "Partner ID", key: "partnerId" },
    { label: "Company Code", key: "coCd" },
    { label: "Partner Type", key: "partnerTypeCd" },
    { label: "Source System", key: "srceSysId" },
    { label: "Format", key: "formatId" },
  ];

  const keyInfoTiles = [
    { label: "Company Code", key: "coCd", icon: Building2 },
    { label: "Partner ID", key: "partnerId", icon: Users, copyable: true },
    { label: "Partner Type", key: "partnerTypeCd", icon: Settings },
    { label: "Source System", key: "srceSysId", icon: Package },
    { label: "Source System Key", key: "srceSysKeyId", icon: Hash, copyable: true },
    { label: "Format", key: "formatId", icon: FileText },
    { label: "Document ID", key: "docId", icon: FileText, copyable: true },
    { label: "Communication ID", key: "commuId", icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A]">
      {/* Compact top header */}
      <header className="h-14 bg-white border-b border-[#E2E8F0] flex items-center px-4 gap-4 sticky top-0 z-20">
        <button onClick={() => window.close()} className="flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#0F172A] flex-shrink-0">
          <ArrowLeft size={15} />
          Orders
        </button>
        <div className="flex-1 max-w-md mx-auto relative hidden sm:block">
          <Search size={14} className="absolute left-3 top-2.5 text-[#64748B]" />
          <input
            disabled
            placeholder="Search orders, SKU, accounts, partners..."
            className="w-full pl-8 pr-14 py-2 text-xs border border-[#E2E8F0] rounded-md bg-slate-50 text-[#64748B] cursor-not-allowed"
          />
          <span className="absolute right-2 top-1.5 text-[9px] text-[#94A3B8] border border-[#E2E8F0] rounded px-1 py-0.5">Ctrl K</span>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 ml-auto">
          <Bell size={16} className="text-[#64748B]" />
          <HelpCircle size={16} className="text-[#64748B]" />
          <div className="w-7 h-7 rounded-full bg-[#0033A0] text-white text-[10px] font-semibold flex items-center justify-center">
            {(record.partnerId || "P").slice(0, 2).toUpperCase()}
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto p-4 md:p-6">
        {/* Breadcrumb + title */}
        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-1 text-xs text-[#64748B] mb-1">
              <span>Orders</span>
              <ChevronRight size={11} />
              <span>Order Details</span>
              <ChevronRight size={11} />
              <span className="text-[#0F6CBD] font-medium">Partner Setup</span>
            </div>
            <h1 className="text-lg font-bold text-[#0033A0]">Partner Setup Details</h1>
            <p className="text-xs text-[#64748B] mt-0.5">Detailed information for the selected partner setup record</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 text-xs font-medium text-[#0F172A] border border-[#E2E8F0] rounded-md px-3 py-2 hover:bg-slate-50">
              <Download size={13} />
              Export
              <ChevronDown size={12} />
            </button>
            <button onClick={() => window.close()} className="flex items-center gap-1.5 text-xs font-medium text-white bg-[#0033A0] rounded-md px-3 py-2 hover:bg-[#002580]">
              Close Tab
            </button>
          </div>
        </div>

        {/* Partner hero */}
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 mb-4 flex flex-wrap items-center gap-x-8 gap-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Users size={18} className="text-[#0033A0]" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-[#64748B]">Partner</p>
              <p className="text-xl font-bold text-[#0F172A] leading-tight">{record.partnerId ?? "—"}</p>
            </div>
          </div>
          {heroFields.slice(1).map((f) => (
            <div key={f.key}>
              <p className="text-[10px] uppercase tracking-wide text-[#64748B]">{f.label}</p>
              <p className="text-sm font-medium text-[#0F172A]">{record[f.key] ?? "—"}</p>
            </div>
          ))}
          <div>
            <p className="text-[10px] uppercase tracking-wide text-[#64748B]">Status</p>
            <Badge color={statusColor(record.activeStatus)}>{record.activeStatus}</Badge>
          </div>
          <button className="ml-auto flex items-center gap-1.5 text-xs font-medium text-[#0F6CBD] border border-[#0F6CBD]/30 rounded-md px-3 py-1.5 hover:bg-blue-50">
            <Copy size={12} />
            Copy Partner ID
          </button>
        </div>

        {/* Key information grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-2">
          {keyInfoTiles.map((t) => (
            <KeyInfoTile key={t.key} label={t.label} value={record[t.key]} icon={t.icon} copyable={t.copyable} />
          ))}
        </div>
        <div className="text-center mb-4">
          <button className="text-xs font-medium text-[#0F6CBD] hover:underline inline-flex items-center gap-1">
            View More Information <ChevronDown size={12} />
          </button>
        </div>

        {/* Main content: tabs+accordions (72%) + context panel (28%) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-4">
          <div>
            <div className="flex gap-1 border-b border-[#E2E8F0] mb-3 overflow-x-auto">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-[#0F6CBD] text-[#0F6CBD]"
                      : "border-transparent text-[#64748B] hover:text-[#0F172A]"
                  }`}
                >
                  <tab.icon size={13} />
                  {tab.label}
                </button>
              ))}
            </div>

            {activeGroups.map((group, i) => (
              <AccordionSection key={group.id} group={group} record={record} defaultOpen={i === 0} />
            ))}
          </div>

          {/* Right context panel */}
          <div className="space-y-3">
            <div className="bg-white border border-[#E2E8F0] rounded-lg p-4">
              <p className="text-xs font-semibold text-[#0F172A] mb-3">Quick Summary</p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-[#64748B]">Status</span>
                  <Badge color={statusColor(record.activeStatus)}>{record.activeStatus}</Badge>
                </div>
                <div className="flex justify-between"><span className="text-[#64748B]">Hold Code</span><span>{record.holdCd ?? "—"}</span></div>
                <div className="flex justify-between"><span className="text-[#64748B]">Direction Flag</span><span>{record.dirFlgCd ?? "—"}</span></div>
                <div className="flex justify-between"><span className="text-[#64748B]">Cycle Interval</span><span>{record.cycleIntvl ?? "—"}</span></div>
                <div className="flex justify-between"><span className="text-[#64748B]">Last Changed</span><span>{record.lstChgTs && record.lstChgTs !== "—" ? formatDateTime(record.lstChgTs) : "—"}</span></div>
                <div className="flex justify-between"><span className="text-[#64748B]">Changed By</span><span>{record.lstChgNam ?? "—"}</span></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}