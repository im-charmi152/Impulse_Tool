// ─── Maps the real .NET GetOrder response into the shape the UI expects ───
//
// I don't yet know your exact response DTO (field names, casing, nesting),
// so this is written defensively: it tries a few likely shapes/casings and
// falls back to sensible empty defaults rather than throwing, so a mismatch
// shows up as an empty section in the UI (visible, debuggable) instead of a
// crash. The raw response is always attached as `_raw` so you can inspect
// exactly what the backend returned — see RawResponsePanel.
//
// TODO (once you share the real DTO or a sample response): replace the
// `pick(...)` guesses below with exact field names. That's the only file
// that needs to change.

function pick(obj, ...keys) {
  for (const key of keys) {
    if (obj && obj[key] !== undefined && obj[key] !== null) return obj[key];
  }
  return undefined;
}

function pickArray(obj, ...keys) {
  const val = pick(obj, ...keys);
  return Array.isArray(val) ? val : [];
}

export function mapOrderResponse(raw) {
  if (!raw) return null;

  // Some .NET APIs wrap the payload in { data: {...} } or { result: {...} }.
  const root = pick(raw, "data", "result", "Data", "Result") || raw;

  const orderSource =
    pick(root, "order", "Order", "orderHeader", "OrderHeader") || root;

  const order = {
    orderNumber: pick(orderSource, "orderNumber", "OrderNumber", "poNumber", "PoNumber") ?? "—",
    transactionId: pick(orderSource, "transactionId", "TransactionId") ?? "—",
    poNumber: pick(orderSource, "poNumber", "PoNumber") ?? "—",
    partnerId: pick(orderSource, "partnerId", "PartnerId") ?? "—",
    accountNumber: pick(orderSource, "accountNumber", "AccountNumber") ?? "—",
    orderDate: pick(orderSource, "orderDate", "OrderDate", "createdDate", "CreatedDate") ?? "—",
    status: pick(orderSource, "status", "Status", "orderStatus", "OrderStatus") ?? "Unknown",
    lastUpdated: pick(orderSource, "lastUpdated", "LastUpdated", "updatedDate", "UpdatedDate") ?? "—",
    accountName: pick(orderSource, "accountName", "AccountName") ?? "—",
    partnerName: pick(orderSource, "partnerName", "PartnerName") ?? "—",
    orderSource: pick(orderSource, "orderSource", "OrderSource", "source", "Source") ?? "—",
    countryCode: pick(orderSource, "countryCode", "CountryCode") ?? "—",
    totalLineItems: pick(orderSource, "totalLineItems", "TotalLineItems"),
    orderTotal: pick(orderSource, "orderTotal", "OrderTotal") ?? "—",
    currency: pick(orderSource, "currency", "Currency") ?? "—",
  };

  const rawLineItems = pickArray(root, "lineItems", "LineItems", "items", "Items");
  const lineItems = rawLineItems.map((li, i) => ({
    line: pick(li, "line", "Line", "lineNumber", "LineNumber") ?? i + 1,
    sku: pick(li, "sku", "Sku", "SKU") ?? "—",
    description: pick(li, "description", "Description") ?? "—",
    qty: pick(li, "qty", "Qty", "quantity", "Quantity") ?? 0,
    unitPrice: pick(li, "unitPrice", "UnitPrice") ?? "—",
    totalPrice: pick(li, "totalPrice", "TotalPrice") ?? "—",
    status: pick(li, "status", "Status") ?? "Unknown",
  }));

  order.totalLineItems = order.totalLineItems ?? lineItems.length;

  const flowTraceRaw = pick(root, "flowTrace", "FlowTrace") || {};
  const flowTrace =
    Object.keys(flowTraceRaw).length > 0
      ? flowTraceRaw
      : { edi: pickArray(root, "flow", "Flow", "systemTrace", "SystemTrace") };

  const processingSteps = pickArray(root, "processingSteps", "ProcessingSteps");
  const setupConfig = pickArray(root, "setupConfig", "SetupConfig");
  const setupValidation = pickArray(root, "setupValidation", "SetupValidation");
  const logs = pickArray(root, "logs", "Logs");
  const datadogAlerts = pickArray(root, "datadogAlerts", "DatadogAlerts", "alerts", "Alerts");
  const mqQueues = pickArray(root, "mqQueues", "MqQueues", "queues", "Queues");

  return {
    order,
    lineItems,
    processingSteps,
    flowTrace,
    setupConfig,
    setupValidation,
    logs,
    datadogAlerts,
    mqQueues,
    _raw: raw,
  };
}
