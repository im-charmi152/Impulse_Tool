import { useState } from "react";

import {
  ArrowLeft,
  Search,
  Bell,
  HelpCircle,
  ChevronDown,
  Copy,
  Check,
  Hash,
  FileText,
  Building2,
  CreditCard,
  Globe,
  DollarSign,
  MapPin,
  Flag,
  Briefcase,
  UserCheck,
  UserCircle,
  Shield,
  KeyRound,
  ToggleLeft,
  Cpu,
  Users,
  ShoppingCart,
  Truck,
  Settings,
  Calendar,
} from "lucide-react";

import {
  FIELD_GROUPS,
  SUMMARY_FIELDS,
} from "../components/order/header/fieldConfig";

import { loadDetailsRecord } from "../utils/detailsNavigation";
import { formatDateTime } from "../utils/format";

const ICON_MAP = {
  Hash,
  FileText,
  Building2,
  CreditCard,
  Globe,
  DollarSign,
  MapPin,
  Flag,
  Briefcase,
  UserCheck,
  UserCircle,
  Shield,
  KeyRound,
  ToggleLeft,
  Cpu,
  Users,
  ShoppingCart,
  Truck,
  Settings,
  Calendar,
};

/* -------------------------------------------------------------------------- */
/* TABS                                                                        */
/* -------------------------------------------------------------------------- */

const TAB_GROUP_MAP = {
  business: [
    "orderInfo",
    "customerInfo",
    "salesInfo",
    "resellerInfo",
    "endUserInfo",
    "endCustomerInfo",
  ],

  financial: [
    "billingInfo",
    "financialInfo",
  ],

  shipping: [
    "shippingInfo",
  ],

  technical: [
    "governmentInfo",
    "orderFlags",
    "configuration",
    "authorization",
  ],

  system: [
    "customerBusinessInfo",
    "processingInfo",
    "systemInfo",
  ],
};

const TABS = [
  {
    id: "business",
    label: "Business",
    icon: ShoppingCart,
  },
  {
    id: "financial",
    label: "Financial",
    icon: DollarSign,
  },
  {
    id: "shipping",
    label: "Shipping",
    icon: Truck,
  },
  {
    id: "technical",
    label: "Technical",
    icon: Cpu,
  },
  {
    id: "system",
    label: "System",
    icon: Globe,
  },
];

/* -------------------------------------------------------------------------- */
/* RECORD RESOLUTION                                                          */
/* -------------------------------------------------------------------------- */

function parseFallbackFromParams(searchParams) {
  return {
    imiAsgdOrdrNbr:
      searchParams.get("imiAsgdOrdrNbr") || null,

    custPoNbr:
      searchParams.get("custPoNbr") || null,

    custBr:
      searchParams.get("custBr") || null,
  };
}

function resolveRecord(searchParams) {
  const ref = searchParams.get("ref");

  const stored = loadDetailsRecord(
    ref,
    "order-header",
  );

  return stored || parseFallbackFromParams(searchParams);
}

/* -------------------------------------------------------------------------- */
/* COPY BUTTON                                                                 */
/* -------------------------------------------------------------------------- */

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false);

  if (
    value === null ||
    value === undefined ||
    value === "" ||
    value === "—"
  ) {
    return null;
  }

  const copyValue = () => {
    navigator.clipboard
      ?.writeText(String(value))
      .catch(() => {});

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        copyValue();
      }}
      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded text-slate-300 hover:text-[#0F6CBD] hover:bg-blue-50"
      aria-label="Copy"
    >
      {copied ? (
        <Check size={11} className="text-green-600" />
      ) : (
        <Copy size={11} />
      )}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* FLAG                                                                       */
/* -------------------------------------------------------------------------- */

function FlagValue({ value }) {
  const normalized = String(value ?? "").toUpperCase();

  if (
    normalized === "Y" ||
    normalized === "1" ||
    normalized === "TRUE" ||
    normalized === "YES"
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        Enabled
      </span>
    );
  }

  if (
    normalized === "N" ||
    normalized === "0" ||
    normalized === "FALSE" ||
    normalized === "NO"
  ) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
        Disabled
      </span>
    );
  }

  return (
    <span className="text-xs text-[#0F172A]">
      {String(value)}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* FIELD VALUE                                                                */
/* -------------------------------------------------------------------------- */

function renderFieldValue(field, value) {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    value === "—"
  ) {
    return (
      <span className="text-slate-300 text-xs">
        —
      </span>
    );
  }

  if (field.type === "flag") {
    return <FlagValue value={value} />;
  }

  if (field.type === "date") {
    return (
      <span className="text-xs text-[#0F172A]">
        {formatDateTime(value)}
      </span>
    );
  }

  if (field.type === "currency") {
    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) {
      return (
        <span className="text-xs text-[#0F172A]">
          {String(value)}
        </span>
      );
    }

    return (
      <span className="text-xs font-medium text-[#0F172A]">
        {new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(numericValue)}
      </span>
    );
  }

  return (
    <span className="flex items-center gap-1 group">
      <span
        className={`text-xs text-[#0F172A] ${
          field.type === "id" ? "font-mono" : ""
        }`}
      >
        {String(value)}
      </span>

      {field.copyable && (
        <CopyButton value={value} />
      )}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* KEY TILE                                                                   */
/* -------------------------------------------------------------------------- */

function KeyInfoTile({
  label,
  value,
  icon: Icon,
  copyable = false,
}) {
  return (
    <div className="group flex items-start gap-2.5 p-3 rounded-lg bg-white border border-[#E2E8F0] hover:border-[#0F6CBD]/30 transition-colors">
      <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center flex-shrink-0">
        <Icon size={14} className="text-[#0F6CBD]" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[9px] uppercase tracking-wide text-[#64748B] mb-0.5">
          {label}
        </p>

        <div className="flex items-center gap-1">
          <span className="text-sm font-semibold text-[#0F172A] truncate">
            {value ?? "—"}
          </span>

          {copyable && (
            <CopyButton value={value} />
          )}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* ACCORDION                                                                  */
/* -------------------------------------------------------------------------- */

function AccordionSection({
  group,
  record,
  defaultOpen = false,
}) {
  const [open, setOpen] = useState(defaultOpen);

  const filledCount = group.fields.filter(
    (field) =>
      record[field.key] !== null &&
      record[field.key] !== undefined &&
      record[field.key] !== "" &&
      record[field.key] !== "—",
  ).length;

  const Icon = group.iconComponent || FileText;

  return (
    <div className="border border-[#E2E8F0] rounded-lg overflow-hidden bg-white mb-2">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center">
            <Icon
              size={14}
              className="text-[#0F6CBD]"
            />
          </div>

          <div className="text-left">
            <div className="text-sm font-semibold text-[#0F172A]">
              {group.label}
            </div>

            <div className="text-[10px] text-[#94A3B8]">
              {filledCount} populated fields
            </div>
          </div>
        </div>

        <ChevronDown
          size={15}
          className={`text-[#64748B] transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="px-4 pb-3 border-t border-[#E2E8F0]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            {group.fields.map((field) => (
              <div
                key={field.key}
                className="flex justify-between items-center gap-4 py-2.5 border-b border-slate-50"
              >
                <span className="text-xs text-[#64748B]">
                  {field.label}
                </span>

                <div className="text-right min-w-0">
                  {renderFieldValue(
                    field,
                    record[field.key],
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* MAIN PAGE                                                                  */
/* -------------------------------------------------------------------------- */

export default function OrderHeaderDetailsPage({
  searchParams,
}) {
  const record = resolveRecord(searchParams);

  const [activeTab, setActiveTab] =
    useState("business");

  const groupsById = Object.fromEntries(
    FIELD_GROUPS.map((group) => [
      group.id,
      {
        ...group,
        iconComponent:
          ICON_MAP[group.icon] || FileText,
      },
    ]),
  );

  const activeGroups = (
    TAB_GROUP_MAP[activeTab] || []
  )
    .map((id) => groupsById[id])
    .filter(Boolean);

  /* ---------------------------------------------------------------------- */
  /* HERO                                                                    */
  /* ---------------------------------------------------------------------- */

  const heroFields = [
    {
      label: "Customer PO",
      key: "custPoNbr",
    },
    {
      label: "Company",
      key: "custCoCd",
    },
    {
      label: "Branch",
      key: "custBr",
    },
    {
      label: "Order Date",
      key: "ordrDt",
      date: true,
    },
    {
      label: "Term ID",
      key: "termId",
    },
  ];

  /* ---------------------------------------------------------------------- */
  /* KEY INFORMATION                                                        */
  /* ---------------------------------------------------------------------- */

  const keyInfoTiles = [
    {
      label: "Customer PO",
      key: "custPoNbr",
      icon: FileText,
      copyable: true,
    },
    {
      label: "Company Code",
      key: "custCoCd",
      icon: Building2,
    },
    {
      label: "Branch",
      key: "custBr",
      icon: Building2,
    },
    {
      label: "Bill-To Customer",
      key: "billToCustNbr",
      icon: CreditCard,
      copyable: true,
    },
    {
      label: "Currency",
      key: "ordrCcyCd",
      icon: DollarSign,
    },
    {
      label: "Terms",
      key: "terms",
      icon: DollarSign,
    },
    {
      label: "Country",
      key: "countryCode",
      icon: MapPin,
    },
    {
      label: "Priority",
      key: "priorityCode",
      icon: Flag,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A]">

      {/* HEADER */}

      <header className="h-14 bg-white border-b border-[#E2E8F0] flex items-center px-4 gap-4 sticky top-0 z-20">
        <button
          type="button"
          onClick={() => window.close()}
          className="flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#0F172A]"
        >
          <ArrowLeft size={15} />
          Orders
        </button>

        <div className="flex-1 max-w-md mx-auto relative hidden sm:block">
          <Search
            size={14}
            className="absolute left-3 top-2.5 text-[#64748B]"
          />

          <input
            disabled
            placeholder="Search orders, SKU, accounts, partners..."
            className="w-full pl-8 pr-14 py-2 text-xs border border-[#E2E8F0] rounded-md bg-slate-50"
          />
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <Bell
            size={16}
            className="text-[#64748B]"
          />

          <HelpCircle
            size={16}
            className="text-[#64748B]"
          />

          <div className="w-8 h-8 rounded-full bg-[#0033A0] text-white text-[10px] font-semibold flex items-center justify-center">
            {(record.userNam || "U")
              .slice(0, 2)
              .toUpperCase()}
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto p-4 md:p-6">

        {/* BREADCRUMB */}

        <div className="mb-4">
          <div className="flex items-center gap-1 text-xs text-[#64748B] mb-1">
            <span>Orders</span>
            <span>/</span>
            <span>Order Details</span>
            <span>/</span>
            <span className="text-[#0F6CBD] font-medium">
              Order Header
            </span>
          </div>

          <h1 className="text-lg font-bold text-[#0033A0]">
            Order Header Details
          </h1>

          <p className="text-xs text-[#64748B] mt-0.5">
            Detailed information for the selected order
          </p>
        </div>

        {/* ORDER HERO */}

        <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 mb-4 flex flex-wrap items-center gap-x-8 gap-y-3">

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <ShoppingCart
                size={18}
                className="text-[#0033A0]"
              />
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wide text-[#64748B]">
                Order Number
              </p>

              <p className="text-xl font-bold text-[#0F172A]">
                {record.imiAsgdOrdrNbr ?? "—"}
              </p>
            </div>
          </div>

          {heroFields.map((field) => (
            <div key={field.key}>
              <p className="text-[10px] uppercase tracking-wide text-[#64748B]">
                {field.label}
              </p>

              <p className="text-sm font-medium text-[#0F172A]">
                {field.date && record[field.key]
                  ? formatDateTime(record[field.key])
                  : record[field.key] ?? "—"}
              </p>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              navigator.clipboard?.writeText(
                String(record.imiAsgdOrdrNbr ?? ""),
              )
            }
            className="ml-auto flex items-center gap-1.5 text-xs font-medium text-[#0F6CBD] border border-[#0F6CBD]/30 rounded-md px-3 py-1.5 hover:bg-blue-50"
          >
            <Copy size={12} />
            Copy Order ID
          </button>
        </div>

        {/* KEY INFORMATION */}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
          {keyInfoTiles.map((tile) => (
            <KeyInfoTile
              key={tile.key}
              label={tile.label}
              value={record[tile.key]}
              icon={tile.icon}
              copyable={tile.copyable}
            />
          ))}
        </div>

        {/* TABS */}

        <div className="bg-white border border-[#E2E8F0] rounded-lg">

          <div className="flex gap-1 border-b border-[#E2E8F0] px-2 overflow-x-auto">

            {TABS.map((tab) => {
              const Icon = tab.icon;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() =>
                    setActiveTab(tab.id)
                  }
                  className={`flex items-center gap-1.5 px-4 py-3 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-[#0F6CBD] text-[#0F6CBD]"
                      : "border-transparent text-[#64748B] hover:text-[#0F172A]"
                  }`}
                >
                  <Icon size={14} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* CONTENT */}

          <div className="p-4">

            {activeGroups.map((group, index) => (
              <AccordionSection
                key={group.id}
                group={group}
                record={record}
                defaultOpen={index === 0}
              />
            ))}

          </div>
        </div>

      </main>
    </div>
  );
}