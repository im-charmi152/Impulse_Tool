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
    // countryCode: raw.countryCode ?? "—",
    partnerId: raw.partnerId ?? "—",
    custCoCd: raw.custCoCd ?? "—",
    custBr: raw.custBr ?? "—",
    custNbr: raw.custNbr ?? "—",
    custSfx: raw.custSfx ?? "—",
    imiAsgdBrNbr: raw.imiAsgdBrNbr ?? "—",
    imiAsgdOrdrNbr: raw.imiAsgdOrdrNbr ?? "—",
    ordShFr: raw.ordShFr ?? "error",
    tag: raw.tagNbr ?? "error",
    holdCode: raw.holdCd ?? " ",
    termId: raw.termId ?? " ",
    cmbBtchNbr:raw.cmbBtchNbr ?? " ",
    stateCd: raw.stateCd ?? " ",
    imiCarCd:raw.imiCarCd ?? " ",
    ordSt:raw.ordSt ?? " ",
    custPoDt: raw.custPoDt ?? " ",
    
    

    // "Order Number" on screen = the IMI-assigned order number.
    orderNumber: raw.imiAsgdOrdrNbr ?? "—",
    orderDate: raw.custPoDt ?? null,
    orderSource: raw.termId ?? "—",
    currency: raw.ordrCcyCd ?? "USD",
    totalLineItems: Array.isArray(raw.lineItems) ? raw.lineItems.length : 0,
    orderTotal: 0,
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
  const lineItems = rawLineItems.map((li, i) => ({
    custCoCd: li.custCoCd ?? raw.custCoCd ?? "—",
    custBr: li.custBr ?? raw.custBr ?? "—",
    custNbr: li.custNbr ?? raw.custNbr ?? "—",
    custPoNbr: li.custPoNbr ?? raw.custPoNbr ?? raw.poNumber ?? "—",
    imiLineNbr: li.imiLineNbr ?? li.lineSeqNbr ?? li.line ?? i + 1,
    imiPartNbr: li.imiPartNbr ?? li.sku ?? "—",
    qtyOrdered: Number(li.qtyOrdered ?? li.qty ?? 0),
  }));

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