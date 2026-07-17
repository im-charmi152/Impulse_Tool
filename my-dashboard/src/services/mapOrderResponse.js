// ─── Maps the real .NET GetOrder response into the shape the UI expects ───
//
// Confirmed against OrderResponseModel.cs + OrderRepository.cs — these are
// the EXACT fields the backend returns, no guessing needed. ASP.NET Core's
// default JSON serializer camel-cases the C# property names automatically,
// e.g. C#'s `PoNumber` arrives in the browser as `poNumber`.

export function mapOrderResponse(raw) {
  if (!raw) return null;

  const order = {
    poNumber: raw.poNumber ?? "—",
    countryCode: raw.countryCode ?? "—",
    partnerId: raw.partnerId ?? "—",
    custCoCd: raw.custCoCd ?? "—",
    custBr: raw.custBr ?? "—",
    custNbr: raw.custNbr ?? "—",
    imiAsgdBrNbr: raw.imiAsgdBrNbr ?? "—",
    imiAsgdOrdrNbr: raw.imiAsgdOrdrNbr ?? "—",

    // "Order Number" on screen = the IMI-assigned order number.
    orderNumber: raw.imiAsgdOrdrNbr ?? "—",
    orderDate: raw.orderDate ?? null,
    orderSource: raw.orderSource ?? "—",
    currency: raw.currency ?? "—",
    totalLineItems: raw.totalLineItems ?? 0,
    orderTotal: raw.orderTotal ?? 0,
    accountNumber: raw.custNbr ?? "—",

    // Not returned by the backend — EO_ORDR_HDR_INFO only stores numeric
    // IDs (CUST_NBR, PARTNER_ID), not human-readable names. Shown as
    // "Not available" in the UI rather than left blank, so it's clear
    // this is a known gap, not a bug.
    accountName: raw.accountName ?? null,
    partnerName: raw.partnerName ?? null,

    // Not returned by the backend — this is just "when the browser got a
    // response," not a DB2 timestamp.
    retrievedAt: new Date().toISOString(),
  };

  const rawLineItems = Array.isArray(raw.lineItems) ? raw.lineItems : [];
  const lineItems = rawLineItems.map((li, i) => {
    const qtyOrdered = li.qtyOrdered ?? 0;
    const qtyBackOrdered = li.qtyBackOrdered ?? 0;
    const unitPrice = li.unitPrice ?? 0;

    // Status isn't a column — it's derived from reject/hold codes.
    let status = "Completed";
    if (li.rejectCode) status = "Rejected";
    else if (li.holdCode) status = "On Hold";
    else if (qtyBackOrdered > 0) status = "Backordered";

    return {
      line: li.lineNumber ?? i + 1,
      sku: li.partNumber ?? "—",
      customerPartNumber: li.customerPartNumber ?? "—",
      description: li.description ?? "—",
      qty: qtyOrdered,
      unitPrice: unitPrice.toFixed ? unitPrice.toFixed(2) : unitPrice,
      totalPrice: (qtyOrdered * unitPrice).toFixed(2),
      status,
      rejectDescription: li.rejectDescription ?? null,
      eta: li.eta ?? null,
    };
  });

  // Only these two sections have a real backend data source right now.
  // Flow Trace, Setup Validation, Datadog, and MQ still show "Not
  // available yet" placeholders in the UI — add their keys here once
  // their endpoints exist on the backend.
  return {
    order,
    lineItems,
    processingSteps: [],
    flowTrace: {},
    setupConfig: [],
    setupValidation: [],
    logs: [],
    datadogAlerts: [],
    mqQueues: [],
    _raw: raw,
    _meta: {
      availableSections: ["orderHeader", "lineItems"],
    },
  };
}