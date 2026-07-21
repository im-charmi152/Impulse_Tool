// ─── Mock Data ──────────────────────────────────────────────────────────────
// This file stands in for the "Consolidated JSON Response" the doc's
// architecture describes coming back from the API/Middleware layer after it
// fans out to DB2, ODS, TBX, MQ, and Datadog. Keeping it isolated means
// services/api.js can be pointed at a real backend later without any
// component code changing — only this file (or its usage) goes away.

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
  { line: 1, sku: "SKU12345", description: "Dell PowerEdge R750", qty: 2, unitPrice: "3,250.00", totalPrice: "6,500.00", status: "Completed" },
  { line: 2, sku: "SKU67890", description: "HPE ProLiant DL380", qty: 1, unitPrice: "2,850.00", totalPrice: "2,850.00", status: "Completed" },
  { line: 3, sku: "SKU54321", description: "Cisco Catalyst 9200", qty: 3, unitPrice: "1,150.00", totalPrice: "3,450.00", status: "Completed" },
  { line: 4, sku: "SKU98765", description: "Microsoft Windows Server 2022", qty: 2, unitPrice: "1,100.00", totalPrice: "2,200.00", status: "Completed" },
  { line: 5, sku: "SKU11223", description: "Veeam Backup & Replication", qty: 1, unitPrice: "678.90", totalPrice: "678.90", status: "Completed" },
];

// Old six-step "Processing Flow Status" stepper — still used for the
// high-level progress bar at the top of the flow card.
export const PROCESSING_STEPS = [
  { label: "Order\nReceived", time: "May 15, 10:30 AM" },
  { label: "Validation", time: "May 15, 10:30 AM" },
  { label: "Pricing &\nAvailability", time: "May 15, 10:31 AM" },
  { label: "Order\nBooking", time: "May 16, 10:32 AM" },
  { label: "Fulfillment", time: "May 15, 10:35 AM" },
  { label: "Completed", time: "May 15, 10:40 AM" },
];

// New: per-system flow trace (System / Status / Timestamp / Remarks), one
// array per order-entry flow — this is the "Flow Trace" table from the
// doc's "Result Screen" mockup, keyed by the flow ids in data/navigation.js.
export const FLOW_TRACE = {
  edi: [
    { system: "SB", status: "Success", timestamp: "10:01 AM", remarks: "Received" },
    { system: "SB Message Tracker", status: "Success", timestamp: "10:01 AM", remarks: "Logged" },
    { system: "C:D", status: "Success", timestamp: "10:02 AM", remarks: "Sent" },
    { system: "C:E", status: "Failed", timestamp: "10:03 AM", remarks: "Timeout" },
    { system: "EDI DB2 DB", status: "Success", timestamp: "10:04 AM", remarks: "Persisted" },
    { system: "Impulse DB", status: "Success", timestamp: "10:04 AM", remarks: "Persisted" },
    { system: "ODS DB", status: "Success", timestamp: "10:05 AM", remarks: "Synced" },
  ],
  "xedi-mq": [
    { system: "SB", status: "Success", timestamp: "10:01 AM", remarks: "Received" },
    { system: "SB Message Tracker", status: "Success", timestamp: "10:01 AM", remarks: "Logged" },
    { system: "XEDI", status: "Success", timestamp: "10:02 AM", remarks: "Transformed" },
    { system: "MQ", status: "Queue Delay", timestamp: "10:05 AM", remarks: "Depth High" },
    { system: "EDI DB2 DB", status: "Pending", timestamp: "—", remarks: "Awaiting MQ" },
    { system: "Impulse DB", status: "Pending", timestamp: "—", remarks: "Awaiting MQ" },
    { system: "ODS DB", status: "Pending", timestamp: "—", remarks: "Awaiting MQ" },
  ],
  x4c: [
    { system: "X4C", status: "Success", timestamp: "10:01 AM", remarks: "Received" },
    { system: "TIBCO", status: "Success", timestamp: "10:02 AM", remarks: "Routed" },
    { system: "Insideline", status: "Success", timestamp: "10:03 AM", remarks: "Processed" },
    { system: "Impulse", status: "Success", timestamp: "10:04 AM", remarks: "Booked" },
    { system: "ODS", status: "Success", timestamp: "10:05 AM", remarks: "Synced" },
  ],
};

export const SETUP_CONFIG = [
  ["Source System", "Partner Portal", "ERP System", "Microsoft Dynamics 365"],
  ["OMS Version", "OMS 10.2.1", "Integration Profile", "PARTNER_PORTAL_DEFAULT"],
  ["Routing Rule", "DEFAULT_ORDER_ROUTING", "Workflow Version", "WF_ORD_v2.3"],
  ["Created By", "system", "Created By", "May 15, 2024 10:30 AM"],
];

// New: "Setup Validation Section" from the doc's Result Screen mockup —
// distinct from SETUP_CONFIG, this reflects pass/fail mapping checks.
export const SETUP_VALIDATION = [
  { type: "DB2 Mapping", status: "OK" },
  { type: "TBX Mapping", status: "Missing" },
  { type: "ODS Setup", status: "OK" },
];

export const LOGS = [
  { time: "2024-05-15 10:30:15", level: "INFO", msg: "Order received ORD123456789 from partner P123456" },
  { time: "2024-05-15 10:30:16", level: "INFO", msg: "Order validation successful" },
  { time: "2024-05-15 10:30:18", level: "INFO", msg: "Pricing and availability check completed" },
  { time: "2024-05-15 10:30:21", level: "INFO", msg: "Order booking initiated" },
  { time: "2024-05-15 10:30:25", level: "INFO", msg: "Order booked successfully in ERP" },
  { time: "2024-05-15 10:30:30", level: "INFO", msg: "Fulfillment process started" },
  { time: "2024-05-15 10:30:35", level: "INFO", msg: "Order fulfillment completed" },
  { time: "2024-05-15 10:30:40", level: "INFO", msg: "Order processing completed successfully" },
];

// New: Datadog "Alert / Severity / Details" table from the Result Screen
// mockup — separate from raw log lines above.
export const DATADOG_ALERTS = [
  { alert: "MQ Queue High", severity: "High", details: "Queue depth exceeded threshold on ORDER.FULFILLMENT" },
  { alert: "C:E Timeout", severity: "Medium", details: "Downstream response exceeded 5s SLA" },
];

export const MQ_QUEUES = [
  { name: "ORDER.IN", status: "Active", messages: 0, updated: "May 15, 11:45 AM" },
  { name: "ORDER.VALIDATION", status: "Active", messages: 0, updated: "May 15, 11:45 AM" },
  { name: "ORDER.BOOKING", status: "Active", messages: 0, updated: "May 15, 11:45 AM" },
  { name: "ORDER.FULFILLMENT", status: "Active", messages: 3, updated: "May 15, 11:45 AM" },
  { name: "ORDER.NOTIFICATION", status: "Active", messages: 0, updated: "May 15, 11:45 AM" },
];

// Bundles everything a "search" resolves to, mirroring the doc's
// "Consolidated JSON Response". services/api.js returns this shape.
export function buildConsolidatedResponse() {
  return {
    order: ORDER,
    lineItems: LINE_ITEMS,
    processingSteps: PROCESSING_STEPS,
    flowTrace: FLOW_TRACE,
    setupConfig: SETUP_CONFIG,
    setupValidation: SETUP_VALIDATION,
    logs: LOGS,
    datadogAlerts: DATADOG_ALERTS,
    mqQueues: MQ_QUEUES,
  };
}
