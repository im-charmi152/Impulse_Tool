// import {
//   ArrowLeft,
//   ShoppingCart,
//   User,
//   Users,
//   Truck,
//   DollarSign,
//   Settings,
//   Flag,
//   Cpu,
//   FileText,
//   Hash,
//   Activity,
//   Building2,
//   Calendar,
//   AlertCircle,
//   Building,
//   Globe,
//   CreditCard,
//   Briefcase,
//   UserCheck,
//   UserCircle,
//   Shield,
//   KeyRound,
//   ToggleLeft,
// } from "lucide-react";
// import {
//   FIELD_GROUPS,
//   SUMMARY_FIELDS,
// } from "../components/order/header/fieldConfig";
// import { loadDetailsRecord } from "../utils/detailsNavigation";
// import {
//   AccordionCard,
//   DetailFieldRow,
//   SummaryTile,
//   formatDetailValue,
// } from "../components/details/DetailsLayout";

// const ICON_MAP = {
//   ShoppingCart,
//   User,
//   Users,
//   Truck,
//   DollarSign,
//   Settings,
//   Flag,
//   Cpu,
//   FileText,
//   Hash,
//   Activity,
//   Building2,
//   Calendar,
//   AlertCircle,
//   Building,
//   Globe,
//   CreditCard,
//   Briefcase,
//   UserCheck,
//   UserCircle,
//   Shield,
//   KeyRound,
//   ToggleLeft,
// };

// const SUMMARY_KEYS = new Set(SUMMARY_FIELDS.map((field) => field.key));

// function parseFallbackFromParams(searchParams) {
//   return {
//     custPoNbr: searchParams.get("custPoNbr") || "-",
//     imiAsgdBrNbr: searchParams.get("imiAsgdBrNbr") || "-",
//     custNbr: searchParams.get("custNbr") || "-",
//     partnerId: searchParams.get("partnerId") || "-",
//   };
// }

// function resolveRecord(searchParams) {
//   const ref = searchParams.get("ref");
//   const stored = loadDetailsRecord(ref, "order-header");
//   return stored || parseFallbackFromParams(searchParams);
// }

// export default function OrderHeaderDetailsPage({ searchParams }) {
//   const record = resolveRecord(searchParams);

//   const summaryTiles = SUMMARY_FIELDS.map((field) => ({
//     ...field,
//     icon: ICON_MAP[field.icon] || undefined,
//     value: record[field.key],
//   }));

//   const detailGroups = FIELD_GROUPS.map((group) => ({
//     ...group,
//     iconComponent: ICON_MAP[group.icon] || FileText,
//     fields: group.fields.filter((field) => !SUMMARY_KEYS.has(field.key)),
//   })).filter((group) => group.fields.length > 0);

//   return (
//     <div className="min-h-screen bg-[#F8FAFC] font-sans">
//       <main className="max-w-[1400px] mx-auto p-4 md:p-6">
//         <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
//           <div>
//             <h1 className="text-xl font-bold text-[#0F6CBD]">
//               Order Header Details
//             </h1>
//             <p className="text-xs text-[#6B7280] mt-0.5">
//               Dedicated detail page for the selected order header record
//             </p>
//           </div>
//           <button
//             type="button"
//             onClick={() => window.close()}
//             className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0F6CBD] border border-[#D6E4F7] rounded-xl px-3 py-1.5 hover:bg-[#EFF6FF]"
//           >
//             <ArrowLeft size={13} />
//             Close Tab
//           </button>
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
//           {summaryTiles.map((field) => (
//             <SummaryTile
//               key={field.key}
//               label={field.label}
//               value={formatDetailValue(field, field.value)}
//               icon={field.icon}
//             />
//           ))}
//         </div>

//         <div className="mt-4 grid grid-cols-1 xl:grid-cols-2 gap-4 pb-6">
//           {detailGroups.map((group) => (
//             <AccordionCard
//               key={group.id}
//               title={group.label}
//               icon={group.iconComponent}
//               defaultOpen={group.defaultOpen}
//             >
//               <div>
//                 {group.fields.map((field) => (
//                   <DetailFieldRow
//                     key={field.key}
//                     label={field.label}
//                     value={formatDetailValue(field, record[field.key])}
//                   />
//                 ))}
//               </div>
//             </AccordionCard>
//           ))}
//         </div>
//       </main>
//     </div>
//   );
// }
import { useState } from "react";
import {
  ArrowLeft, Search, Bell, HelpCircle, ChevronDown, Copy, Check,
  Hash, FileText, Building2, CreditCard, Globe, DollarSign, MapPin,
  Flag, Briefcase, UserCheck, UserCircle, Shield, KeyRound, ToggleLeft,
  Cpu, AlertTriangle, Sparkles, ArrowRight, Download, ChevronRight,
  User, Users, ShoppingCart, Truck,
} from "lucide-react";
import { FIELD_GROUPS, SUMMARY_FIELDS } from "../components/order/header/fieldConfig";
import { loadDetailsRecord } from "../utils/detailsNavigation";
import { formatDateTime } from "../utils/format";

const ICON_MAP = {
  Hash, FileText, Building2, CreditCard, Globe, DollarSign, MapPin, Flag,
  Briefcase, UserCheck, UserCircle, Shield, KeyRound, ToggleLeft, Cpu,
  User, Users, ShoppingCart, Truck,
};

// ── Tab grouping — reuses every existing FIELD_GROUPS entry, just
// organizes them under 5 tabs per the design brief. No fields added,
// removed, or renamed here — this is presentation-only.
const TAB_GROUP_MAP = {
  business: ["orderInfo", "customerInfo", "endUserInfo", "endCustomerInfo", "salesInfo", "resellerInfo"],
  financial: ["billingInfo", "financialInfo"],
  shipping: ["shippingInfo"],
  technical: ["governmentInfo", "orderFlags", "configuration", "authorization", "processingInfo"],
  system: ["customerBusinessInfo", "systemInfo"],
};

const TABS = [
  { id: "business", label: "Business", icon: ShoppingCart },
  { id: "financial", label: "Financial", icon: DollarSign },
  { id: "shipping", label: "Shipping", icon: Truck },
  { id: "technical", label: "Technical", icon: Cpu },
  { id: "system", label: "System", icon: Globe },
];

function parseFallbackFromParams(searchParams) {
  return {
    custOrdrNbr: searchParams.get("custOrdrNbr") || null,
    branchNbr: searchParams.get("branchNbr") || null,
    ordrNbr: searchParams.get("ordrNbr") || null,
  };
}

function resolveRecord(searchParams) {
  const ref = searchParams.get("ref");
  const stored = loadDetailsRecord(ref, "order-header");
  return stored || parseFallbackFromParams(searchParams);
}

// ── Small building blocks, styled to match shadcn's visual language ──────

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

function FlagValue({ value }) {
  const v = String(value ?? "").toUpperCase();
  if (["Y", "1", "TRUE", "YES"].includes(v)) {
    return <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700"><span className="w-1.5 h-1.5 rounded-full bg-green-500" />Enabled</span>;
  }
  if (["N", "0", "FALSE", "NO", ""].includes(v)) {
    return <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400"><span className="w-1.5 h-1.5 rounded-full bg-slate-300" />Disabled</span>;
  }
  return <span className="text-xs text-[#0F172A]">{value}</span>;
}

function renderFieldValue(field, value) {
  if (value == null || value === "") return <span className="text-slate-300 text-xs">—</span>;
  if (field.type === "flag") return <FlagValue value={value} />;
  if (field.type === "date") return <span className="text-xs text-[#0F172A]">{formatDateTime(value)}</span>;
  if (field.type === "currency") {
    const num = Number(value);
    return <span className="text-xs text-[#0F172A]">{Number.isNaN(num) ? String(value) : new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(num)}</span>;
  }
  return (
    <span className="flex items-center gap-1 group">
      <span className={`text-xs text-[#0F172A] ${field.type === "id" ? "font-mono" : ""}`}>{String(value)}</span>
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
  const filledCount = group.fields.filter((f) => record[f.key] != null && record[f.key] !== "").length;

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

export default function OrderHeaderDetailsPage({ searchParams }) {
  const record = resolveRecord(searchParams);
  const [activeTab, setActiveTab] = useState("business");

  const groupsById = Object.fromEntries(
    FIELD_GROUPS.map((g) => [g.id, { ...g, iconComponent: ICON_MAP[g.icon] || FileText }])
  );

  const activeGroups = (TAB_GROUP_MAP[activeTab] || [])
    .map((id) => groupsById[id])
    .filter(Boolean);

  // Real fields only — no fabricated status/health data.
  const heroFields = [
    { label: "Order Number", key: "ordrNbr", strong: true },
    { label: "Customer Order Number", key: "custOrdrNbr" },
    { label: "Company Code", key: "companyCd" },
    { label: "Branch Number", key: "branchNbr" },
    { label: "Terminal / Source", key: "termId" },
    { label: "Entry Date", key: "entyDt", date: true },
  ];

  const keyInfoTiles = [
    { label: "Customer PO Number", key: "custOrdrNbr", icon: FileText, copyable: true },
    { label: "Company Code", key: "companyCd", icon: Building2 },
    { label: "Branch Number", key: "branchNbr", icon: Building2 },
    { label: "Bill-To Customer", key: "billToCustNbr", icon: CreditCard, copyable: true },
    { label: "Currency", key: "ccyCd", icon: DollarSign },
    { label: "Terms", key: "terms", icon: DollarSign },
    { label: "Country", key: "countryCode", icon: MapPin },
    { label: "Priority Code", key: "priorityCode", icon: Flag },
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
            {(record.userNam || "U").slice(0, 2).toUpperCase()}
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
              <span className="text-[#0F6CBD] font-medium">Order Header</span>
            </div>
            <h1 className="text-lg font-bold text-[#0033A0]">Order Header Details</h1>
            <p className="text-xs text-[#64748B] mt-0.5">Detailed information for the selected order header record</p>
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

        {/* Order hero */}
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 mb-4 flex flex-wrap items-center gap-x-8 gap-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <ShoppingCart size={18} className="text-[#0033A0]" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-[#64748B]">Order</p>
              <p className="text-xl font-bold text-[#0F172A] leading-tight">{record.ordrNbr ?? "—"}</p>
            </div>
          </div>
          {heroFields.slice(1).map((f) => (
            <div key={f.key}>
              <p className="text-[10px] uppercase tracking-wide text-[#64748B]">{f.label}</p>
              <p className="text-sm font-medium text-[#0F172A]">
                {f.date && record[f.key] ? formatDateTime(record[f.key]) : (record[f.key] ?? "—")}
              </p>
            </div>
          ))}
          <button className="ml-auto flex items-center gap-1.5 text-xs font-medium text-[#0F6CBD] border border-[#0F6CBD]/30 rounded-md px-3 py-1.5 hover:bg-blue-50">
            <Copy size={12} />
            Copy Order ID
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
                <div className="flex justify-between"><span className="text-[#64748B]">Border Status</span><span>{record.bordrStus ?? "—"}</span></div>
                <div className="flex justify-between"><span className="text-[#64748B]">Terminal / Source</span><span>{record.termId ?? "—"}</span></div>
                <div className="flex justify-between"><span className="text-[#64748B]">Currency</span><span>{record.ccyCd ?? "—"}</span></div>
                <div className="flex justify-between"><span className="text-[#64748B]">Order Value</span><span>{record.orderValueAtAdd != null ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(record.orderValueAtAdd) : "—"}</span></div>
              </div>
            </div>

            {/* Order Health — honestly marked unavailable; no fabricated failure data */}
            {/* <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <AlertTriangle size={14} className="text-amber-600" />
                <p className="text-xs font-semibold text-amber-800">Order Health</p>
              </div>
              <p className="text-[11px] text-amber-700">
                Not available yet — no processing-status or failure-tracking data source is connected for this order.
              </p>
            </div> */}

            {/* <div className="bg-white border border-[#E2E8F0] rounded-lg p-4">
              <p className="text-xs font-semibold text-[#0F172A] mb-2">Related Actions</p>
              <div className="space-y-1.5">
                {["View Line Items", "Retry Order", "Download Documents", "View Audit Trail"].map((label) => (
                  <button key={label} className="w-full flex items-center justify-between text-xs text-[#0F6CBD] hover:bg-blue-50 rounded px-2 py-1.5 transition-colors" disabled>
                    {label}
                    <ArrowRight size={12} />
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-[#94A3B8] mt-2">Not wired up yet — placeholder actions.</p>
            </div> */}

            {/* <div className="bg-white border border-[#E2E8F0] rounded-lg p-4">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Sparkles size={13} className="text-[#0F6CBD]" />
                <p className="text-xs font-semibold text-[#0F172A]">AI Assistant</p>
              </div>
              <p className="text-[11px] text-[#64748B] mb-2">Need help understanding this order?</p>
              <button disabled className="w-full text-xs font-medium text-[#0F6CBD] border border-[#0F6CBD]/30 rounded-md py-1.5 opacity-50 cursor-not-allowed">
                Ask AI Assistant (not yet built)
              </button>
            </div> */}
          </div>
        </div>
      </main>
    </div>
  );
}