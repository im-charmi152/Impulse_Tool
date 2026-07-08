import {
  LayoutDashboard,
  Search,
  ShoppingCart,
  ArrowLeftRight,
  Activity,
  ListOrdered,
  FileText,
  BarChart2,
  AlertTriangle,
  Settings,
  Wrench,
} from "lucide-react";

// ─── Order / Transaction Data ─────────────────────────────────────────────

export const ORDER = {
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

export const LINE_ITEMS = [
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

export const PROCESSING_STEPS = [
  { label: "Order\nReceived", time: "May 15, 10:30 AM" },
  { label: "Validation", time: "May 15, 10:30 AM" },
  { label: "Pricing &\nAvailability", time: "May 15, 10:31 AM" },
  { label: "Order\nBooking", time: "May 16, 10:32 AM" },
  { label: "Fulfillment", time: "May 15, 10:35 AM" },
  { label: "Completed", time: "May 15, 10:40 AM" },
];

export const SETUP_CONFIG = [
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

export const LOGS = [
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

export const MQ_QUEUES = [
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

export const NAV_ITEMS = [
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
