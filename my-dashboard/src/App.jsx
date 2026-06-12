import { useState } from "react";
import {
  Bell,
  HelpCircle,
  Search,
  RefreshCw,
  Download,
  ChevronRight,
  ChevronLeft,
  LayoutDashboard,
  ShoppingCart,
  ArrowLeftRight,
  Activity,
  ListOrdered,
  FileText,
  BarChart2,
  AlertTriangle,
  Settings,
  Wrench,
  ExternalLink,
  CheckCircle2,
  ChevronDown,
  Database,
  Server,
  RotateCcw,
  AlignLeft,
  Layers,
  X,
  Menu,
} from "lucide-react";

// ─── Static Data ──────────────────────────────────────────────────────────────

const ORDER = {
  orderNumber: "ORD123456789",
  transactionId: "TXN987654321",
  poNumber: "PO456789",
  partnerId: "P123456",
  accountNumber: "ACCT10001",
  orderDate: "May 15, 2024 10:30 AM",
  status: "Completed",
  lastUpdated: "May 15, 2024 11:45 AM",
  accountName: "ABC Technologies Inc.",
  partnerName: "XYZ Solutions",
  orderSource: "Partner Portal",
  totalLineItems: 5,
  orderTotal: "USD 15,678.90",
  currency: "USD",
};

const LINE_ITEMS = [
  {
    line: 1,
    sku: "SKU12345",
    description: "Dell PowerEdge R750",
    qty: 2,
    unitPrice: "3,250.00",
    totalPrice: "6,500.00",
    status: "Completed",
  },
  {
    line: 2,
    sku: "SKU67890",
    description: "HPE ProLiant DL380",
    qty: 1,
    unitPrice: "2,850.00",
    totalPrice: "2,850.00",
    status: "Completed",
  },
  {
    line: 3,
    sku: "SKU54321",
    description: "Cisco Catalyst 9200",
    qty: 3,
    unitPrice: "1,150.00",
    totalPrice: "3,450.00",
    status: "Completed",
  },
  {
    line: 4,
    sku: "SKU98765",
    description: "Microsoft Windows Server 2022",
    qty: 2,
    unitPrice: "1,100.00",
    totalPrice: "2,200.00",
    status: "Completed",
  },
  {
    line: 5,
    sku: "SKU11223",
    description: "Veeam Backup & Replication",
    qty: 1,
    unitPrice: "678.90",
    totalPrice: "678.90",
    status: "Completed",
  },
];

const PROCESSING_STEPS = [
  { label: "Order\nReceived", time: "May 15, 10:30 AM" },
  { label: "Validation", time: "May 15, 10:30 AM" },
  { label: "Pricing &\nAvailability", time: "May 15, 10:31 AM" },
  { label: "Order\nBooking", time: "May 16, 10:32 AM" },
  { label: "Fulfillment", time: "May 15, 10:35 AM" },
  { label: "Completed", time: "May 15, 10:40 AM" },
];

const SETUP_CONFIG = [
  ["Source System", "Partner Portal", "ERP System", "Microsoft Dynamics 365"],
  [
    "OMS Version",
    "OMS 10.2.1",
    "Integration Profile",
    "PARTNER_PORTAL_DEFAULT",
  ],
  ["Routing Rule", "DEFAULT_ORDER_ROUTING", "Workflow Version", "WF_ORD_v2.3"],
  ["Created By", "system", "Created By", "May 15, 2024 10:30 AM"],
];

const LOGS = [
  {
    time: "2024-05-15 10:30:15",
    level: "INFO",
    msg: "Order received ORD123456789 from partner P123456",
  },
  {
    time: "2024-05-15 10:30:16",
    level: "INFO",
    msg: "Order validation successful",
  },
  {
    time: "2024-05-15 10:30:18",
    level: "INFO",
    msg: "Pricing and availability check completed",
  },
  {
    time: "2024-05-15 10:30:21",
    level: "INFO",
    msg: "Order booking initiated",
  },
  {
    time: "2024-05-15 10:30:25",
    level: "INFO",
    msg: "Order booked successfully in ERP",
  },
  {
    time: "2024-05-15 10:30:30",
    level: "INFO",
    msg: "Fulfillment process started",
  },
  {
    time: "2024-05-15 10:30:35",
    level: "INFO",
    msg: "Order fulfillment completed",
  },
  {
    time: "2024-05-15 10:30:40",
    level: "INFO",
    msg: "Order processing completed successfully",
  },
];

const MQ_QUEUES = [
  {
    name: "ORDER.IN",
    status: "Active",
    messages: 0,
    updated: "May 15, 11:45 AM",
  },
  {
    name: "ORDER.VALIDATION",
    status: "Active",
    messages: 0,
    updated: "May 15, 11:45 AM",
  },
  {
    name: "ORDER.BOOKING",
    status: "Active",
    messages: 0,
    updated: "May 15, 11:45 AM",
  },
  {
    name: "ORDER.FULFILLMENT",
    status: "Active",
    messages: 0,
    updated: "May 15, 11:45 AM",
  },
  {
    name: "ORDER.NOTIFICATION",
    status: "Active",
    messages: 0,
    updated: "May 15, 11:45 AM",
  },
];

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: Search, label: "Search", id: "search", active: true },
  { icon: ShoppingCart, label: "Orders", id: "orders" },
  { icon: ArrowLeftRight, label: "Transactions", id: "transactions" },
  { icon: Activity, label: "Monitoring", id: "monitoring", expandable: true },
  { icon: ListOrdered, label: "Queues", id: "queues" },
  { icon: FileText, label: "Logs", id: "logs" },
  { icon: BarChart2, label: "Reports", id: "reports" },
  { icon: AlertTriangle, label: "Alerts", id: "alerts" },
  { icon: Settings, label: "Configuration", id: "config", expandable: true },
  { icon: Wrench, label: "Setup", id: "setup", expandable: true },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function Badge({ color = "green", children }) {
  const colors = {
    green: "bg-green-100 text-green-700 border border-green-200",
    blue: "bg-blue-100 text-blue-700 border border-blue-200",
    red: "bg-red-100 text-red-700 border border-red-200",
    gray: "bg-gray-100 text-gray-600 border border-gray-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color]}`}
    >
      {children}
    </span>
  );
}

function SectionCard({ icon: Icon, title, children, actions }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-2">
          <Icon size={15} className="text-blue-600" />
          <span className="text-sm font-semibold text-gray-700">{title}</span>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between items-start py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-500 min-w-[130px]">{label}</span>
      <span className="text-xs font-medium text-gray-800 text-right max-w-[180px] break-words">
        {value}
      </span>
    </div>
  );
}

// ─── Top Header ───────────────────────────────────────────────────────────────

function Header({ toggleSidebar }) {
  return (
    <header className="h-14 bg-[#003087] flex items-center justify-between px-4 fixed top-0 left-0 right-0 z-30 shadow-lg">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="text-white p-1 rounded hover:bg-white/10 md:hidden"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-0.5 select-none">
          <span className="text-white font-black text-xl tracking-tight">
            UNIFIED IMPULSE
          </span>
          <span className="text-[#00AEEF] font-black text-xl">‑</span>
          <span className="text-white font-black text-xl tracking-tight">
            SUPPORT
          </span>
          <span className="text-white font-black text-xl ml-0.5">!</span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button className="relative text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-400 rounded-full" />
        </button>
        <button className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors">
          <HelpCircle size={18} />
        </button>
        <button className="ml-1 flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white rounded-full pl-1.5 pr-3 py-1 transition-colors">
          <div className="w-7 h-7 bg-[#005CB9] rounded-full flex items-center justify-center text-white text-xs font-bold">
            AS
          </div>
          <span className="text-sm font-medium hidden sm:inline">
            Admin User
          </span>
          <ChevronDown size={14} className="hidden sm:inline" />
        </button>
      </div>
    </header>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function Sidebar({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) {
  const [activeId, setActiveId] = useState("search");

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={`
          fixed top-14 left-0 bottom-0 z-20 bg-white border-r border-gray-200 flex flex-col shadow-sm transition-all duration-300
          ${collapsed ? "w-[60px]" : "w-[200px]"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <nav className="flex-1 overflow-y-auto py-2">
          {NAV_ITEMS.map(({ icon: Icon, label, id, expandable }) => {
            const isActive = id === activeId;
            return (
              <button
                key={id}
                onClick={() => {
                  setActiveId(id);
                  setMobileOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors relative group
                  ${
                    isActive
                      ? "bg-[#EEF4FF] text-[#003087] font-semibold border-r-[3px] border-[#003087]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
              >
                <Icon
                  size={17}
                  className={isActive ? "text-[#003087]" : "text-gray-500"}
                />
                {!collapsed && (
                  <>
                    <span className="text-sm flex-1 truncate">{label}</span>
                    {expandable && (
                      <ChevronRight size={13} className="text-gray-400" />
                    )}
                  </>
                )}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                    {label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex items-center gap-2 px-3 py-3 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 border-t border-gray-100 transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </aside>
    </>
  );
}

// ─── Search Bar ───────────────────────────────────────────────────────────────

function SearchBar() {
  const fields = [
    "Order Number",
    "SKU",
    "Account Number",
    "Partner ID",
    "PO Number",
    "Transaction ID",
  ];
  const [values, setValues] = useState({});

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {fields.map((f) => (
          <div key={f}>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              {f}
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder={`Enter ${f}`}
                value={values[f] || ""}
                onChange={(e) => setValues({ ...values, [f]: e.target.value })}
                className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-300 pr-7"
              />
              {f === "Order Number" && (
                <Search
                  size={12}
                  className="absolute right-2 top-2 text-gray-400"
                />
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-2 mt-3">
        <button
          onClick={() => setValues({})}
          className="px-4 py-1.5 text-xs font-medium text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          Clear
        </button>
        <button className="px-5 py-1.5 text-xs font-semibold text-white bg-[#003087] rounded hover:bg-[#002070] transition-colors flex items-center gap-1.5">
          <Search size={12} />
          Search
        </button>
      </div>
    </div>
  );
}

// ─── Order Summary Banner ─────────────────────────────────────────────────────

function OrderSummaryBanner() {
  const fields = [
    { label: "Order Number", value: ORDER.orderNumber },
    { label: "Transaction ID", value: ORDER.transactionId },
    { label: "PO Number", value: ORDER.poNumber },
    { label: "Partner ID", value: ORDER.partnerId },
    { label: "Account Number", value: ORDER.accountNumber },
    { label: "Order Date", value: ORDER.orderDate },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <FileText size={18} className="text-blue-600" />
          </div>
        </div>
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-2">
          {fields.map(({ label, value }) => (
            <div key={label}>
              <div className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">
                {label}
              </div>
              <div className="text-xs font-semibold text-gray-800 truncate">
                {value}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 flex-shrink-0 flex-wrap">
          <div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wide font-medium mb-0.5">
              Status
            </div>
            <Badge color="green">{ORDER.status}</Badge>
          </div>
          <div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wide font-medium mb-0.5">
              Last Updated
            </div>
            <div className="text-xs font-semibold text-gray-800">
              {ORDER.lastUpdated}
            </div>
          </div>
          <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors">
            <RefreshCw size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Order Header Details ─────────────────────────────────────────────────────

function OrderHeaderDetails() {
  const rows = [
    ["Order Number", ORDER.orderNumber],
    ["Order Date", ORDER.orderDate],
    ["Account Number", ORDER.accountNumber],
    ["Account Name", ORDER.accountName],
    ["Partner ID", ORDER.partnerId],
    ["Partner Name", ORDER.partnerName],
    ["PO Number", ORDER.poNumber],
    ["Order Source", ORDER.orderSource],
    ["Total Line Items", ORDER.totalLineItems],
    ["Order Total", ORDER.orderTotal],
    ["Currency", ORDER.currency],
  ];

  return (
    <SectionCard icon={AlignLeft} title="Order Header Details">
      <div className="space-y-0">
        {rows.map(([label, value]) => (
          <DetailRow key={label} label={label} value={value} />
        ))}
      </div>
    </SectionCard>
  );
}

// ─── Line Item Details ────────────────────────────────────────────────────────

function LineItemDetails() {
  return (
    <SectionCard
      icon={Layers}
      title="Line-Item Details"
      actions={
        <button className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 border border-blue-200 rounded px-2.5 py-1 hover:bg-blue-50 transition-colors">
          <Download size={11} />
          Export
        </button>
      }
    >
      <div className="overflow-x-auto -mx-1">
        <table className="w-full text-xs min-w-[520px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {[
                "Line #",
                "SKU",
                "Description",
                "Qty",
                "Unit Price",
                "Total Price",
                "Status",
              ].map((h) => (
                <th
                  key={h}
                  className="text-left px-2 py-2 font-semibold text-gray-500 text-[10px] uppercase tracking-wide whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {LINE_ITEMS.map((item, i) => (
              <tr
                key={i}
                className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
              >
                <td className="px-2 py-2 text-gray-500">{item.line}</td>
                <td className="px-2 py-2 font-medium text-blue-600">
                  {item.sku}
                </td>
                <td className="px-2 py-2 text-gray-700 max-w-[140px] truncate">
                  {item.description}
                </td>
                <td className="px-2 py-2 text-gray-600 text-center">
                  {item.qty}
                </td>
                <td className="px-2 py-2 text-gray-600 text-right">
                  {item.unitPrice}
                </td>
                <td className="px-2 py-2 font-medium text-gray-800 text-right">
                  {item.totalPrice}
                </td>
                <td className="px-2 py-2">
                  <Badge color="green">{item.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-3 text-[10px] text-gray-400">
        <span>Showing 1 to 5 of 5 items</span>
        <div className="flex items-center gap-1">
          <button
            className="p-1 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
            disabled
          >
            <ChevronLeft size={11} />
          </button>
          <button className="w-6 h-6 rounded bg-[#003087] text-white text-[10px] font-bold">
            1
          </button>
          <button
            className="p-1 rounded border border-gray-200 hover:bg-gray-50 disabled:opacity-40"
            disabled
          >
            <ChevronRight size={11} />
          </button>
          <select className="ml-2 border border-gray-200 rounded px-1.5 py-0.5 text-[10px] focus:outline-none">
            <option>10 / page</option>
            <option>25 / page</option>
          </select>
        </div>
      </div>
    </SectionCard>
  );
}

// ─── Processing Flow Status ───────────────────────────────────────────────────

function ProcessingFlowStatus() {
  return (
    <SectionCard icon={Activity} title="Processing Flow Status">
      <div className="overflow-x-auto pb-1">
        <div className="flex items-start min-w-[340px]">
          {PROCESSING_STEPS.map((step, i) => (
            <div key={i} className="flex items-start flex-1 min-w-0">
              <div className="flex flex-col items-center flex-1 min-w-0">
                <div className="flex items-center w-full">
                  {i > 0 && (
                    <div className="flex-1 h-0.5 bg-green-400 -mt-0 min-w-[4px]" />
                  )}
                  <div className="w-7 h-7 rounded-full bg-green-500 border-2 border-green-600 flex items-center justify-center shadow-sm flex-shrink-0">
                    <CheckCircle2
                      size={14}
                      className="text-white"
                      strokeWidth={2.5}
                    />
                  </div>
                  {i < PROCESSING_STEPS.length - 1 && (
                    <div className="flex-1 h-0.5 bg-green-400 min-w-[4px]" />
                  )}
                </div>
                <div className="text-center mt-1.5 px-0.5">
                  <div className="text-[10px] font-semibold text-gray-700 leading-tight whitespace-pre-line">
                    {step.label}
                  </div>
                  <div className="text-[9px] text-gray-400 mt-0.5 leading-tight">
                    {step.time}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}

// ─── Setup / Config Details ───────────────────────────────────────────────────

function SetupConfigDetails() {
  return (
    <SectionCard icon={Settings} title="Setup / Configuration Details">
      <div className="space-y-1">
        {SETUP_CONFIG.map((row, i) => (
          <div key={i} className="grid grid-cols-2 gap-2">
            {[0, 2].map((j) => (
              <div
                key={j}
                className="flex justify-between py-1 border-b border-gray-50 last:border-0"
              >
                <span className="text-[10px] text-gray-400 min-w-0 flex-1 truncate">
                  {row[j]}
                </span>
                <span className="text-[10px] font-medium text-gray-700 text-right min-w-0 flex-1 truncate ml-1">
                  {row[j + 1]}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

// ─── Datadog Logs ─────────────────────────────────────────────────────────────

function DatadogLogs() {
  return (
    <SectionCard
      icon={Database}
      title="Datadog Logs"
      actions={
        <button className="flex items-center gap-1 text-[10px] text-blue-600 hover:underline">
          Open in Datadog <ExternalLink size={10} />
        </button>
      }
    >
      <div className="font-mono text-[10px] space-y-1.5 bg-gray-900 rounded-md p-2.5 -m-1 overflow-hidden">
        {LOGS.map((log, i) => (
          <div key={i} className="flex items-start gap-1.5 min-w-0">
            <span className="text-gray-500 whitespace-nowrap flex-shrink-0">
              {log.time}
            </span>
            <span className="text-green-400 font-bold flex-shrink-0">
              {log.level}
            </span>
            <span className="text-gray-300 truncate">{log.msg}</span>
          </div>
        ))}
      </div>
      <button className="mt-2 text-xs text-blue-600 hover:underline font-medium block text-center w-full">
        View More Logs
      </button>
    </SectionCard>
  );
}

// ─── MQ Queue Status ──────────────────────────────────────────────────────────

function MQQueueStatus() {
  return (
    <SectionCard
      icon={Server}
      title="MQ Queue Status"
      actions={
        <button className="text-[10px] text-blue-600 hover:underline">
          View All Queues
        </button>
      }
    >
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-gray-100">
            {["Queue Name", "Status", "Messages", "Last Updated"].map((h) => (
              <th
                key={h}
                className="text-left pb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-wide"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {MQ_QUEUES.map((q, i) => (
            <tr
              key={i}
              className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50"
            >
              <td className="py-1.5 font-medium text-gray-700 text-[11px]">
                {q.name}
              </td>
              <td className="py-1.5">
                <Badge color="green">{q.status}</Badge>
              </td>
              <td className="py-1.5 text-gray-500 text-center">{q.messages}</td>
              <td className="py-1.5 text-gray-400 text-[10px]">{q.updated}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="mt-3 text-xs text-blue-600 hover:underline font-medium block text-center w-full">
        View Queue Dashboard
      </button>
    </SectionCard>
  );
}

// ─── Failure Reason ───────────────────────────────────────────────────────────

function FailureReason() {
  return (
    <SectionCard icon={AlertTriangle} title="Failure Reason">
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
          <CheckCircle2 size={24} className="text-green-500" strokeWidth={2} />
        </div>
        <div className="text-sm font-semibold text-gray-700 mb-1">
          No Failures
        </div>
        <div className="text-xs text-gray-400">
          This transaction completed successfully with no failures.
        </div>
      </div>
    </SectionCard>
  );
}

// ─── Retry / Recovery ─────────────────────────────────────────────────────────

function RetryRecovery() {
  return (
    <SectionCard icon={RotateCcw} title="Retry / Recovery Information">
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
          <CheckCircle2 size={24} className="text-green-500" strokeWidth={2} />
        </div>
        <div className="text-sm font-semibold text-gray-700 mb-1">
          No Retries
        </div>
        <div className="text-xs text-gray-400">
          No retry attempts were required for this transaction.
        </div>
      </div>
    </SectionCard>
  );
}

// ─── Root Layout ──────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarWidth = sidebarCollapsed ? 60 : 200;

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Header toggleSidebar={() => setMobileOpen(!mobileOpen)} />
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main content */}
      <main
        className={`pt-14 transition-all duration-300 hidden-mobile-margin ${sidebarCollapsed ? "md:ml-[60px]" : "md:ml-[200px]"}`}
      >
        <div className="p-4 md:p-5 max-w-[1400px]">
          {/* Page header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                Order / Transaction Search
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Search and view consolidated transaction details
              </p>
            </div>
            <button className="flex items-center gap-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded px-3 py-1.5 hover:bg-blue-50 transition-colors whitespace-nowrap">
              <Download size={12} />
              Save Search
            </button>
          </div>

          {/* Search bar */}
          <SearchBar />

          {/* Order summary banner */}
          <div className="mt-4">
            <OrderSummaryBanner />
          </div>

          {/* 3-col grid: Header + Line-items + (Flow + Config) */}
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)_minmax(0,1.2fr)] gap-4">
            {/* Col 1: Order Header */}
            <OrderHeaderDetails />

            {/* Col 2: Line Items */}
            <LineItemDetails />

            {/* Col 3: Flow + Config stacked */}
            <div className="flex flex-col gap-4">
              <ProcessingFlowStatus />
              <SetupConfigDetails />
            </div>
          </div>

          {/* 4-col bottom grid */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <DatadogLogs />
            <MQQueueStatus />
            <FailureReason />
            <RetryRecovery />
          </div>

          {/* Footer */}
          <div className="mt-6 pb-4 text-center text-[10px] text-gray-400 flex items-center justify-between">
            <span>© 2024 Ingram Micro Inc. All Rights Reserved.</span>
            <div className="flex gap-4">
              <button className="hover:text-gray-600">Privacy Policy</button>
              <button className="hover:text-gray-600">Terms of Use</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
