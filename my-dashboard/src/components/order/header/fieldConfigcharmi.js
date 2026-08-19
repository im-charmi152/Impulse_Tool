// /**
//  * fieldConfig.js  —  Single source of truth for all order header fields.
//  *
//  * Every key EXACTLY matches the real backend property name on the `order` object.
//  * To add a new field: append one entry to the correct group. Nothing else changes.
//  *
//  * Field types
//  * -----------
//  * "text"     – plain string
//  * "id"       – monospace font + copy-to-clipboard button
//  * "date"     – formatDateTime()
//  * "currency" – Intl currency formatter
//  * "status"   – ORDER_STATUS_MAP → coloured badge
//  * "hold"     – HOLD_CODE_MAP → red badge when set, green "Clear" when empty
//  * "flag"     – "Y" → Enabled (green)  |  "N" → Disabled (muted)
//  * "number"   – integer / decimal
//  */

// // ─── Order status code → human label + badge colour ──────────────────────────
// export const ORDER_STATUS_MAP = {
//   // Numeric codes from DB2
//   "10": { label: "Draft",        color: "gray"  },
//   "20": { label: "Processing",   color: "blue"  },
//   "30": { label: "Booked",       color: "blue"  },
//   "40": { label: "Completed",    color: "green" },
//   "50": { label: "Cancelled",    color: "red"   },
//   "60": { label: "On Hold",      color: "amber" },
//   "70": { label: "Backordered",  color: "amber" },
//   "80": { label: "Shipped",      color: "green" },
//   "90": { label: "Closed",       color: "gray"  },
//   // Friendly strings (mock / transformed API)
//   completed:   { label: "Completed",  color: "green" },
//   processing:  { label: "Processing", color: "blue"  },
//   cancelled:   { label: "Cancelled",  color: "red"   },
//   shipped:     { label: "Shipped",    color: "green" },
//   "on hold":   { label: "On Hold",    color: "amber" },
//   booked:      { label: "Booked",     color: "blue"  },
//   draft:       { label: "Draft",      color: "gray"  },
// };

// // ─── Hold code → human description ───────────────────────────────────────────
// export const HOLD_CODE_MAP = {
//   H1: "Credit Hold",
//   H2: "Compliance Hold",
//   H3: "Fraud Review",
//   H4: "Inventory Hold",
//   H5: "Approval Pending",
//   IM: "IM Internal Hold",
//   SA: "Sales Auth Hold",
//   VR: "Vendor Request Hold",
// };

// // ─── 12 priority fields — the always-visible summary card ────────────────────
// export const SUMMARY_FIELDS = [
//   { key: "custPoNbr",      label: "Customer PO Number", icon: "FileText",   copyable: true, type: "id"     },
//   { key: "imiAsgdBrNbr",  label: "Order Branch",       icon: "Building2",                  type: "text"   },
//   { key: "ordSt",          label: "Order Status",       icon: "Activity",                   type: "status" },
//   { key: "custNbr",        label: "Customer Number",    icon: "User",       copyable: true, type: "id"     },
//   { key: "imiAsgdOrdrNbr",label: "IMI Order Number",   icon: "Hash",       copyable: true, type: "id"     },
//   { key: "partnerId",      label: "Partner ID",         icon: "Users",      copyable: true, type: "id"     },
//   { key: "custCoCd",       label: "Company Code",       icon: "Building2",                  type: "text"   },
//   { key: "custPoDt",       label: "Customer PO Date",   icon: "Calendar",                   type: "date"   },
//   { key: "ordrCcyCd",      label: "Currency",           icon: "DollarSign",                 type: "text"   },
//   { key: "holdCd",         label: "Hold Code",          icon: "AlertCircle",                type: "hold"   },
//   { key: "ordShFr",        label: "Ship From Branch",   icon: "Truck",                      type: "text"   },
//   { key: "termId",         label: "Order Source",       icon: "Globe",                      type: "text"   },
// ];

// // ─── 8 accordion groups — all real backend fields ────────────────────────────
// export const FIELD_GROUPS = [
//   // ── 1. Order Information ────────────────────────────────────────────────
//   {
//     id: "order",
//     label: "Order Information",
//     icon: "ShoppingCart",
//     defaultOpen: true,
//     fields: [
//       { key: "custPoNbr",      label: "Customer PO Number",           copyable: true, type: "id"     },
//       { key: "imiAsgdOrdrNbr", label: "IMI Assigned Order Number",   copyable: true, type: "id"     },
//       { key: "custPoSeqNbr",   label: "Customer PO Sequence Number",                  type: "number" },
//       { key: "sdqSeqNbr",      label: "SDQ Sequence Number",                          type: "number" },
//       { key: "imiAsgdBrNbr",   label: "Order Branch",                                 type: "text"   },
//       { key: "custPoDt",       label: "Customer PO Date",                             type: "date"   },
//       { key: "orideCustPoDt",  label: "Original Customer PO Date",                   type: "date"   },
//       { key: "ordEntryDtTs",   label: "Order Entry Timestamp",                        type: "date"   },
//       { key: "termId",         label: "Order Source / Terminal",                      type: "text"   },
//       { key: "ordrType",       label: "Order Type",                                   type: "text"   },
//       { key: "ordSt",          label: "Order Status",                                 type: "status" },
//       { key: "holdCd",         label: "Hold Code",                                    type: "hold"   },
//       { key: "stateCd",        label: "State Code",                                   type: "text"   },
//       { key: "custSfx",        label: "Customer Suffix",                              type: "text"   },
//       { key: "slaCode",        label: "SLA Code",                                     type: "text"   },
//       { key: "contNbr",        label: "Contract Number",              copyable: true, type: "id"     },
//       { key: "quoteNbr",       label: "Quote Number",                 copyable: true, type: "id"     },
//       { key: "dmdBr",          label: "Demand Branch",                                type: "text"   },
//       { key: "busRegnCd",      label: "Business Region Code",                        type: "text"   },
//       { key: "processDt",      label: "Process Date",                                 type: "date"   },
//       { key: "processTm",      label: "Process Time",                                 type: "text"   },
//       { key: "sellrSalesNbr",  label: "Seller Sales Number",         copyable: true, type: "id"     },
//     ],
//   },

//   // ── 2. Customer Information ──────────────────────────────────────────────
//   {
//     id: "customer",
//     label: "Customer Information",
//     icon: "User",
//     defaultOpen: true,
//     fields: [
//       { key: "custNbr",        label: "Customer Number",             copyable: true, type: "id"   },
//       { key: "imiAsgdOrdrNbr", label: "IMI Assigned Order Number",  copyable: true, type: "id"   },
//       { key: "custCoCd",       label: "Customer Company Code",                       type: "text" },
//       { key: "custBr",         label: "Customer Branch",                             type: "text" },
//       { key: "deptNbr",        label: "Department Number",                           type: "text" },
//       { key: "byrLoc",         label: "Buyer Location",                              type: "text" },
//       { key: "byrCntact",      label: "Buyer Contact",                               type: "text" },
//       { key: "byrPhnNbr",      label: "Buyer Phone Number",                          type: "text" },
//       { key: "byrVndrNbr",     label: "Buyer Vendor Number",        copyable: true, type: "id"   },
//     ],
//   },

//   // ── 3. Partner Information ───────────────────────────────────────────────
//   {
//     id: "partner",
//     label: "Partner Information",
//     icon: "Users",
//     defaultOpen: true,
//     fields: [
//       { key: "partnerId",      label: "Partner ID",                  copyable: true, type: "id"   },
//       { key: "sellrSalesNbr",  label: "Seller Sales Number",        copyable: true, type: "id"   },
//       { key: "poGovtTp",       label: "PO Government Type",                         type: "text" },
//       { key: "govtPgmType",    label: "Government Program Type",                    type: "text" },
//     ],
//   },

//   // ── 4. Shipping Information ──────────────────────────────────────────────
//   {
//     id: "shipping",
//     label: "Shipping Information",
//     icon: "Truck",
//     defaultOpen: false,
//     fields: [
//       { key: "ordShFr",         label: "Ship From Branch",                           type: "text"   },
//       { key: "imiCarCd",        label: "IMI Carrier Code",                           type: "text"   },
//       { key: "imiShipVia",      label: "IMI Ship Via",                               type: "text"   },
//       { key: "custCarrCode",    label: "Customer Carrier Code",                      type: "text"   },
//       { key: "carrierAccount",  label: "Carrier Account",            copyable: true, type: "id"     },
//       { key: "ordrReqShipDt",   label: "Requested Ship Date",                        type: "date"   },
//       { key: "ordrReqDlvyDt",   label: "Requested Delivery Date",                   type: "date"   },
//       { key: "ordrReqCancDt",   label: "Requested Cancel Date",                     type: "date"   },
//       { key: "ordrEtaDt",       label: "ETA Date",                                  type: "date"   },
//       { key: "maxXitDays",      label: "Maximum Transit Days",                       type: "number" },
//       { key: "singleWhse",      label: "Single Warehouse",                           type: "text"   },
//       { key: "nbrOfWhse",       label: "Number of Warehouses",                       type: "number" },
//       { key: "distrbDepth",     label: "Distribution Depth",                         type: "number" },
//       { key: "brSeqValu",       label: "Branch Sequence Value",                      type: "text"   },
//       { key: "codAmt",          label: "COD Amount",                                 type: "currency"},
//       { key: "thrdPtyAct",      label: "Third Party Account",        copyable: true, type: "id"     },
//       { key: "freightOrderNbr", label: "Freight Order Number",       copyable: true, type: "id"     },
//       { key: "frghtOutCode",    label: "Freight Out Code",                           type: "text"   },
//       { key: "isDelvFlg",       label: "Delivery Flag",                              type: "flag"   },
//       { key: "shipFlg",         label: "Ship Flag",                                  type: "flag"   },
//     ],
//   },

//   // ── 5. Financial Information ─────────────────────────────────────────────
//   {
//     id: "financial",
//     label: "Financial Information",
//     icon: "DollarSign",
//     defaultOpen: false,
//     fields: [
//       { key: "ordrCcyCd",      label: "Order Currency",                              type: "text"   },
//       { key: "ccyRate",        label: "Currency Rate",                               type: "number" },
//       { key: "terms",          label: "Terms",                                       type: "text"   },
//       { key: "xmitHashTot",   label: "Transmit Hash Total",                         type: "number" },
//       { key: "xmitTotLines",  label: "Transmit Total Lines",                        type: "number" },
//       { key: "taxFlg",         label: "Tax Flag",                                   type: "flag"   },
//     ],
//   },

//   // ── 6. Configuration ────────────────────────────────────────────────────
//   {
//     id: "config",
//     label: "Configuration",
//     icon: "Settings",
//     defaultOpen: false,
//     fields: [
//       { key: "cfgType",        label: "Configuration Type",                          type: "text" },
//       { key: "configPoType",   label: "Configuration PO Type",                      type: "text" },
//       { key: "labType",        label: "Label Type",                                  type: "text" },
//       { key: "specLblCode",    label: "Special Label Code",                          type: "text" },
//       { key: "serviceInd",     label: "Service Indicator",                           type: "text" },
//       { key: "serviceLevel",   label: "Service Level",                               type: "text" },
//       { key: "resvInvSw",      label: "Reservation Inventory Switch",                type: "flag" },
//       { key: "cnsgnSw",        label: "Consignment Switch",                          type: "flag" },
//     ],
//   },

//   // ── 7. Flags & Indicators ───────────────────────────────────────────────
//   {
//     id: "flags",
//     label: "Flags & Indicators",
//     icon: "Flag",
//     defaultOpen: false,
//     fields: [
//       { key: "govtPubPrivSw",      label: "Government / Public / Private",          type: "text" },
//       { key: "govtPgmType",        label: "Government Program Type",                type: "text" },
//       { key: "ordrRejFlg",         label: "Order Rejected Flag",                    type: "flag" },
//       { key: "ordrHasErrs",        label: "Order Has Errors",                       type: "flag" },
//       { key: "dropMsg",            label: "Drop Message",                           type: "text" },
//       { key: "vmfHdrHldInd",       label: "VMF Header Hold Indicator",              type: "flag" },
//       { key: "hybrdAnntyOrdrInd",  label: "Hybrid Annuity Order Indicator",         type: "flag" },
//       { key: "isDelvFlg",          label: "Delivery Flag",                          type: "flag" },
//       { key: "shipFlg",            label: "Ship Flag",                              type: "flag" },
//       { key: "taxFlg",             label: "Tax Flag",                               type: "flag" },
//       { key: "resvInvSw",          label: "Reservation Inventory Switch",           type: "flag" },
//       { key: "cnsgnSw",            label: "Consignment Switch",                     type: "flag" },
//     ],
//   },

//   // ── 8. Technical Information — collapsed by default ─────────────────────
//   {
//     id: "technical",
//     label: "Technical Information",
//     icon: "Cpu",
//     defaultOpen: false,
//     technical: true,
//     fields: [
//       { key: "tagNbr",            label: "Tag Number",                copyable: true, type: "id"   },
//       { key: "relsTagNbr",        label: "Related Tag Number",        copyable: true, type: "id"   },
//       { key: "cmbBtchNbr",        label: "CMB Batch Number",          copyable: true, type: "id"   },
//       { key: "applId",            label: "Application ID",            copyable: true, type: "id"   },
//       { key: "xactSet",           label: "Transaction Set",                           type: "text" },
//       { key: "processUnitTs",     label: "Process Unit Timestamp",                   type: "date" },
//       { key: "hybrdAnntyCnfmtnId",label: "Hybrid Annuity Confirmation ID", copyable: true, type: "id" },
//     ],
//   },
// ];

// /** Count how many fields on `order` are non-null / non-empty across all groups. */
// export function countAvailableFields(order) {
//   if (!order) return 0;
//   return FIELD_GROUPS
//     .flatMap((g) => g.fields)
//     .filter((f) => order[f.key] != null && order[f.key] !== "")
//     .length;
// }
/**
 * fieldConfig.js  —  Single source of truth for all order header fields.
 *
 * Every key EXACTLY matches the real backend property name on the `order` object.
 * To add a new field: append one entry to the correct group. Nothing else changes.
 *
 * Field types
 * -----------
 * "text"     – plain string
 * "id"       – monospace font + copy-to-clipboard button
 * "date"     – formatDateTime()
 * "currency" – Intl currency formatter
 * "status"   – ORDER_STATUS_MAP → coloured badge
 * "hold"     – HOLD_CODE_MAP → red badge when set, green "Clear" when empty
 * "flag"     – "Y" → Enabled (green)  |  "N" → Disabled (muted)
 * "number"   – integer / decimal
 */

// ─── Kept exported for compatibility with HeaderDrawer.jsx's StatusBadge /
// HoldBadge renderers. No field in the current set below uses type:"status"
// or type:"hold" — reintroduce a mapped field here if/when an order-status
// or hold-code column is added back.
export const ORDER_STATUS_MAP = {
  10: { label: "Draft", color: "gray" },
  20: { label: "Processing", color: "blue" },
  30: { label: "Booked", color: "blue" },
  40: { label: "Completed", color: "green" },
  50: { label: "Cancelled", color: "red" },
  60: { label: "On Hold", color: "amber" },
  70: { label: "Backordered", color: "amber" },
  80: { label: "Shipped", color: "green" },
  90: { label: "Closed", color: "gray" },
  completed: { label: "Completed", color: "green" },
  processing: { label: "Processing", color: "blue" },
  cancelled: { label: "Cancelled", color: "red" },
  shipped: { label: "Shipped", color: "green" },
  "on hold": { label: "On Hold", color: "amber" },
  booked: { label: "Booked", color: "blue" },
  draft: { label: "Draft", color: "gray" },
};

export const HOLD_CODE_MAP = {
  H1: "Credit Hold",
  H2: "Compliance Hold",
  H3: "Fraud Review",
  H4: "Inventory Hold",
  H5: "Approval Pending",
  IM: "IM Internal Hold",
  SA: "Sales Auth Hold",
  VR: "Vendor Request Hold",
};

// ─── 12 priority fields — the always-visible summary card ────────────────────
export const SUMMARY_FIELDS = [
  {
    key: "ordrNbr",
    label: "Order Number",
    icon: "Hash",
    copyable: true,
    type: "id",
  },
  {
    key: "custOrdrNbr",
    label: "Customer Order Number",
    icon: "FileText",
    copyable: true,
    type: "id",
  },
  {
    key: "billToCustNbr",
    label: "Bill-To Customer",
    icon: "CreditCard",
    copyable: true,
    type: "id",
  },
  { key: "termId", label: "Terminal / Source", icon: "Globe", type: "text" },
  { key: "terms", label: "Terms", icon: "DollarSign", type: "text" },
  { key: "ccyCd", label: "Currency", icon: "DollarSign", type: "text" },
  { key: "countryCode", label: "Country", icon: "MapPin", type: "text" },
  { key: "custType", label: "Customer Type", icon: "User", type: "text" },
  {
    key: "resellerNbr",
    label: "Reseller Number",
    icon: "UserCheck",
    copyable: true,
    type: "id",
  },
  {
    key: "endUserPoNbr",
    label: "End-User PO Number",
    icon: "FileText",
    copyable: true,
    type: "id",
  },
  { key: "priorityCode", label: "Priority Code", icon: "Flag", type: "text" },
  { key: "contract", label: "Contract", icon: "Building2", type: "text" },
];

// ─── 8 field groups ────────────────────────────────────────────────────────
export const FIELD_GROUPS = [
  {
    id: "orderIds",
    label: "Order Identification",
    icon: "Hash",
    defaultOpen: true,
    fields: [
      { key: "companyCd", label: "Company Code", type: "text" },
      { key: "branchNbr", label: "Branch Number", type: "text" },
      { key: "ordrNbr", label: "Order Number", copyable: true, type: "id" },
      {
        key: "custOrdrNbr",
        label: "Customer Order Number",
        copyable: true,
        type: "id",
      },
      {
        key: "ordRefNbr",
        label: "Order Reference Number",
        copyable: true,
        type: "id",
      },
      {
        key: "custRefNbr",
        label: "Customer Reference Number",
        copyable: true,
        type: "id",
      },
      {
        key: "custRefNbr2",
        label: "Customer Reference Number 2",
        copyable: true,
        type: "id",
      },
      { key: "extSoCode", label: "External SO Code", type: "text" },
      {
        key: "jobAcctNbr",
        label: "Job Account Number",
        copyable: true,
        type: "id",
      },
      { key: "entyDt", label: "Entry Date", type: "date" },
      { key: "entyTm", label: "Entry Time", type: "text" },
      { key: "entyMthd", label: "Entry Method", type: "text" },
      { key: "ediCo", label: "EDI Company", type: "text" },
      { key: "termId", label: "Terminal ID", type: "text" },
      { key: "osSlsmn", label: "Outside Salesman", type: "text" },
      { key: "isSlsmn", label: "Inside Salesman", type: "text" },
      { key: "userNam", label: "User Name", type: "text" },
      { key: "sourceCode", label: "Source Code", type: "text" },
      { key: "copyCode", label: "Copy Code", type: "text" },
      { key: "ackCode", label: "Acknowledgement Code", type: "text" },
      { key: "priorityCode", label: "Priority Code", type: "text" },
      { key: "campaign", label: "Campaign", type: "text" },
      { key: "contract", label: "Contract", type: "text" },
    ],
  },

  {
    id: "billing",
    label: "Billing Information",
    icon: "CreditCard",
    defaultOpen: false,
    fields: [
      { key: "billToBranchNbr", label: "Bill-To Branch Number", type: "text" },
      {
        key: "billToCustNbr",
        label: "Bill-To Customer Number",
        copyable: true,
        type: "id",
      },
      { key: "billToSfx", label: "Bill-To Suffix", type: "text" },
      { key: "splitBillToSw", label: "Split Bill-To Switch", type: "flag" },
      { key: "summInvoiceCode", label: "Summary Invoice Code", type: "text" },
      { key: "glOffsetNbr", label: "GL Offset Number", type: "text" },
      { key: "glOffsetType", label: "GL Offset Type", type: "text" },
      { key: "payeeNbr", label: "Payee Number", copyable: true, type: "id" },
      { key: "payeeSuf", label: "Payee Suffix", type: "text" },
      { key: "soldToSuffix", label: "Sold-To Suffix", type: "text" },
    ],
  },

  {
    id: "shipping",
    label: "Ship-To & Fulfillment",
    icon: "Truck",
    defaultOpen: false,
    fields: [
      { key: "shipToSfx", label: "Ship-To Suffix", type: "text" },
      { key: "freightForwarder", label: "Freight Forwarder", type: "text" },
      { key: "deliveryTerms", label: "Delivery Terms", type: "text" },
      { key: "resdntlSw", label: "Residential Switch", type: "flag" },
      { key: "fulmntSw", label: "Fulfillment Switch", type: "flag" },
      {
        key: "lastShipmentNbr",
        label: "Last Shipment Number",
        copyable: true,
        type: "id",
      },
      {
        key: "lastDistNbr",
        label: "Last Distribution Number",
        copyable: true,
        type: "id",
      },
      { key: "cuaShipFrom", label: "CUA Ship From", type: "text" },
      { key: "binTyp", label: "Bin Type", type: "text" },
    ],
  },

  {
    id: "government",
    label: "Government & Compliance",
    icon: "Shield",
    defaultOpen: false,
    fields: [
      { key: "capsIdCd", label: "CAPS ID Code", type: "text" },
      { key: "capsBuyer", label: "CAPS Buyer", type: "text" },
      { key: "govtBidFlg", label: "Government Bid Flag", type: "flag" },
      { key: "govtEndUserZip", label: "Government End-User ZIP", type: "text" },
      { key: "govtGsaInd", label: "GSA Indicator", type: "flag" },
      {
        key: "govtEndUserTyp",
        label: "Government End-User Type",
        type: "text",
      },
      {
        key: "flrngAuthActnCd",
        label: "Floor-Ready Auth Action Code",
        type: "text",
      },
      {
        key: "flrngAuthNbr",
        label: "Floor-Ready Auth Number",
        copyable: true,
        type: "id",
      },
      {
        key: "indiaGstOrderInd",
        label: "India GST Order Indicator",
        type: "flag",
      },
      { key: "tnSpecCd", label: "TN Special Code", type: "text" },
    ],
  },

  {
    id: "endUser",
    label: "End User & Reseller",
    icon: "UserCheck",
    defaultOpen: false,
    fields: [
      {
        key: "endUserPoNbr",
        label: "End-User PO Number",
        copyable: true,
        type: "id",
      },
      {
        key: "resellerNbr",
        label: "Reseller Number",
        copyable: true,
        type: "id",
      },
      { key: "endUserDataSw", label: "End-User Data Switch", type: "flag" },
      {
        key: "endUserAuthorization",
        label: "End-User Authorization",
        type: "text",
      },
      {
        key: "endUserAddrSuffix",
        label: "End-User Address Suffix",
        type: "text",
      },
      { key: "endUserVendorFlag", label: "End-User Vendor Flag", type: "flag" },
      {
        key: "endUserNbr",
        label: "End-User Number",
        copyable: true,
        type: "id",
      },
      {
        key: "endCustId",
        label: "End Customer ID",
        copyable: true,
        type: "id",
      },
      {
        key: "endCustNum",
        label: "End Customer Number",
        copyable: true,
        type: "id",
      },
      {
        key: "endUserContSuffix",
        label: "End-User Contact Suffix",
        type: "text",
      },
      { key: "endUserOrderSw", label: "End-User Order Switch", type: "flag" },
      { key: "resellerSplitPct", label: "Reseller Split %", type: "number" },
      {
        key: "vendorClaimNbr",
        label: "Vendor Claim Number",
        copyable: true,
        type: "id",
      },
    ],
  },

  {
    id: "financial",
    label: "Financial & Pricing",
    icon: "DollarSign",
    defaultOpen: false,
    fields: [
      { key: "terms", label: "Terms", type: "text" },
      { key: "ccyCd", label: "Currency Code", type: "text" },
      { key: "ccyRate", label: "Currency Rate", type: "number" },
      { key: "tradeDisc", label: "Trade Discount", type: "number" },
      { key: "orderValueAtAdd", label: "Order Value at Add", type: "currency" },
      { key: "priceRecalcSw", label: "Price Recalc Switch", type: "flag" },
      { key: "crCrdSw", label: "Credit Card Switch", type: "flag" },
      { key: "crRels", label: "Credit Release", type: "text" },
      { key: "taxCode", label: "Tax Code", type: "text" },
    ],
  },

  {
    id: "processingFlags",
    label: "Processing Flags & Switches",
    icon: "ToggleLeft",
    defaultOpen: false,
    fields: [
      { key: "bordrStus", label: "Border Status", type: "text" },
      { key: "ordrCmpltFillSw", label: "Complete Fill Switch", type: "flag" },
      { key: "splitSw", label: "Split Switch", type: "flag" },
      { key: "bidQotFlg", label: "Bid/Quote Flag", type: "flag" },
      { key: "bidExpDt", label: "Bid Expiration Date", type: "date" },
      { key: "poCrtdSw", label: "PO Created Switch", type: "flag" },
      { key: "enhcdRmaSw", label: "Enhanced RMA Switch", type: "flag" },
      {
        key: "enhcdCrMemoSw",
        label: "Enhanced Credit Memo Switch",
        type: "flag",
      },
      {
        key: "specialHandleSw",
        label: "Special Handling Switch",
        type: "flag",
      },
      { key: "configurationFlag", label: "Configuration Flag", type: "flag" },
      { key: "deleteTodaySw", label: "Delete Today Switch", type: "flag" },
      {
        key: "outsourceSkuInd",
        label: "Outsource SKU Indicator",
        type: "flag",
      },
      { key: "baseRateOrdrSw", label: "Base Rate Order Switch", type: "flag" },
      { key: "allianceSw", label: "Alliance Switch", type: "flag" },
      { key: "aodSw", label: "AOD Switch", type: "flag" },
      {
        key: "orderManagementSw",
        label: "Order Management Switch",
        type: "flag",
      },
      {
        key: "gwmdImagApplyFlag",
        label: "GWMD Image Apply Flag",
        type: "flag",
      },
    ],
  },

  {
    id: "location",
    label: "Location & Locale",
    icon: "MapPin",
    defaultOpen: false,
    fields: [
      { key: "pstlCd", label: "Postal Code", type: "text" },
      { key: "cityCode", label: "City Code", type: "text" },
      { key: "countyCode", label: "County Code", type: "text" },
      { key: "countryCode", label: "Country Code", type: "text" },
      { key: "stateCode", label: "State Code", type: "text" },
      {
        key: "customersLanguageCode",
        label: "Customer Language Code",
        type: "text",
      },
      { key: "cuBusSgmt", label: "Customer Business Segment", type: "text" },
      { key: "cuBusTyp", label: "Customer Business Type", type: "text" },
      { key: "custType", label: "Customer Type", type: "text" },
      { key: "odsLstUpdDt", label: "ODS Last Updated", type: "date" },
    ],
  },
];

/** Count how many fields on `order` are non-null / non-empty across all groups. */
export function countAvailableFields(order) {
  if (!order) return 0;
  return FIELD_GROUPS.flatMap((g) => g.fields).filter(
    (f) => order[f.key] != null && order[f.key] !== "",
  ).length;
}
