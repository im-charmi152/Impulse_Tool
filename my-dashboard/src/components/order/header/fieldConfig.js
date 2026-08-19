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

// // ─── Kept exported for compatibility with HeaderDrawer.jsx's StatusBadge /
// // HoldBadge renderers. No field in the current set below uses type:"status"
// // or type:"hold" — reintroduce a mapped field here if/when an order-status
// // or hold-code column is added back.
// export const ORDER_STATUS_MAP = {
//   10: { label: "Draft", color: "gray" },
//   20: { label: "Processing", color: "blue" },
//   30: { label: "Booked", color: "blue" },
//   40: { label: "Completed", color: "green" },
//   50: { label: "Cancelled", color: "red" },
//   60: { label: "On Hold", color: "amber" },
//   70: { label: "Backordered", color: "amber" },
//   80: { label: "Shipped", color: "green" },
//   90: { label: "Closed", color: "gray" },
//   completed: { label: "Completed", color: "green" },
//   processing: { label: "Processing", color: "blue" },
//   cancelled: { label: "Cancelled", color: "red" },
//   shipped: { label: "Shipped", color: "green" },
//   "on hold": { label: "On Hold", color: "amber" },
//   booked: { label: "Booked", color: "blue" },
//   draft: { label: "Draft", color: "gray" },
// };

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
//   {
//     key: "ordrNbr",
//     label: "Order Number",
//     icon: "Hash",
//     copyable: true,
//     type: "id",
//   },
//   {
//     key: "custOrdrNbr",
//     label: "Customer Order Number",
//     icon: "FileText",
//     copyable: true,
//     type: "id",
//   },
//   {
//     key: "billToCustNbr",
//     label: "Bill-To Customer",
//     icon: "CreditCard",
//     copyable: true,
//     type: "id",
//   },
//   { key: "termId", label: "Terminal / Source", icon: "Globe", type: "text" },
//   { key: "terms", label: "Terms", icon: "DollarSign", type: "text" },
//   { key: "ccyCd", label: "Currency", icon: "DollarSign", type: "text" },
//   { key: "countryCode", label: "Country", icon: "MapPin", type: "text" },
//   { key: "custType", label: "Customer Type", icon: "User", type: "text" },
//   {
//     key: "resellerNbr",
//     label: "Reseller Number",
//     icon: "UserCheck",
//     copyable: true,
//     type: "id",
//   },
//   {
//     key: "endUserPoNbr",
//     label: "End-User PO Number",
//     icon: "FileText",
//     copyable: true,
//     type: "id",
//   },
//   { key: "priorityCode", label: "Priority Code", icon: "Flag", type: "text" },
//   { key: "contract", label: "Contract", icon: "Building2", type: "text" },
// ];

// // ─── 8 field groups ────────────────────────────────────────────────────────
// export const FIELD_GROUPS = [
//   {
//     id: "orderIds",
//     label: "Order Identification",
//     icon: "Hash",
//     defaultOpen: true,
//     fields: [
//       { key: "companyCd", label: "Company Code", type: "text" },
//       { key: "branchNbr", label: "Branch Number", type: "text" },
//       { key: "ordrNbr", label: "Order Number", copyable: true, type: "id" },
//       {
//         key: "custOrdrNbr",
//         label: "Customer Order Number",
//         copyable: true,
//         type: "id",
//       },
//       {
//         key: "ordRefNbr",
//         label: "Order Reference Number",
//         copyable: true,
//         type: "id",
//       },
//       {
//         key: "custRefNbr",
//         label: "Customer Reference Number",
//         copyable: true,
//         type: "id",
//       },
//       {
//         key: "custRefNbr2",
//         label: "Customer Reference Number 2",
//         copyable: true,
//         type: "id",
//       },
//       { key: "extSoCode", label: "External SO Code", type: "text" },
//       {
//         key: "jobAcctNbr",
//         label: "Job Account Number",
//         copyable: true,
//         type: "id",
//       },
//       { key: "entyDt", label: "Entry Date", type: "date" },
//       { key: "entyTm", label: "Entry Time", type: "text" },
//       { key: "entyMthd", label: "Entry Method", type: "text" },
//       { key: "ediCo", label: "EDI Company", type: "text" },
//       { key: "termId", label: "Terminal ID", type: "text" },
//       { key: "osSlsmn", label: "Outside Salesman", type: "text" },
//       { key: "isSlsmn", label: "Inside Salesman", type: "text" },
//       { key: "userNam", label: "User Name", type: "text" },
//       { key: "sourceCode", label: "Source Code", type: "text" },
//       { key: "copyCode", label: "Copy Code", type: "text" },
//       { key: "ackCode", label: "Acknowledgement Code", type: "text" },
//       { key: "priorityCode", label: "Priority Code", type: "text" },
//       { key: "campaign", label: "Campaign", type: "text" },
//       { key: "contract", label: "Contract", type: "text" },
//     ],
//   },

//   {
//     id: "billing",
//     label: "Billing Information",
//     icon: "CreditCard",
//     defaultOpen: false,
//     fields: [
//       { key: "billToBranchNbr", label: "Bill-To Branch Number", type: "text" },
//       {
//         key: "billToCustNbr",
//         label: "Bill-To Customer Number",
//         copyable: true,
//         type: "id",
//       },
//       { key: "billToSfx", label: "Bill-To Suffix", type: "text" },
//       { key: "splitBillToSw", label: "Split Bill-To Switch", type: "flag" },
//       { key: "summInvoiceCode", label: "Summary Invoice Code", type: "text" },
//       { key: "glOffsetNbr", label: "GL Offset Number", type: "text" },
//       { key: "glOffsetType", label: "GL Offset Type", type: "text" },
//       { key: "payeeNbr", label: "Payee Number", copyable: true, type: "id" },
//       { key: "payeeSuf", label: "Payee Suffix", type: "text" },
//       { key: "soldToSuffix", label: "Sold-To Suffix", type: "text" },
//     ],
//   },

//   {
//     id: "shipping",
//     label: "Ship-To & Fulfillment",
//     icon: "Truck",
//     defaultOpen: false,
//     fields: [
//       { key: "shipToSfx", label: "Ship-To Suffix", type: "text" },
//       { key: "freightForwarder", label: "Freight Forwarder", type: "text" },
//       { key: "deliveryTerms", label: "Delivery Terms", type: "text" },
//       { key: "resdntlSw", label: "Residential Switch", type: "flag" },
//       { key: "fulmntSw", label: "Fulfillment Switch", type: "flag" },
//       {
//         key: "lastShipmentNbr",
//         label: "Last Shipment Number",
//         copyable: true,
//         type: "id",
//       },
//       {
//         key: "lastDistNbr",
//         label: "Last Distribution Number",
//         copyable: true,
//         type: "id",
//       },
//       { key: "cuaShipFrom", label: "CUA Ship From", type: "text" },
//       { key: "binTyp", label: "Bin Type", type: "text" },
//     ],
//   },

//   {
//     id: "government",
//     label: "Government & Compliance",
//     icon: "Shield",
//     defaultOpen: false,
//     fields: [
//       { key: "capsIdCd", label: "CAPS ID Code", type: "text" },
//       { key: "capsBuyer", label: "CAPS Buyer", type: "text" },
//       { key: "govtBidFlg", label: "Government Bid Flag", type: "flag" },
//       { key: "govtEndUserZip", label: "Government End-User ZIP", type: "text" },
//       { key: "govtGsaInd", label: "GSA Indicator", type: "flag" },
//       {
//         key: "govtEndUserTyp",
//         label: "Government End-User Type",
//         type: "text",
//       },
//       {
//         key: "flrngAuthActnCd",
//         label: "Floor-Ready Auth Action Code",
//         type: "text",
//       },
//       {
//         key: "flrngAuthNbr",
//         label: "Floor-Ready Auth Number",
//         copyable: true,
//         type: "id",
//       },
//       {
//         key: "indiaGstOrderInd",
//         label: "India GST Order Indicator",
//         type: "flag",
//       },
//       { key: "tnSpecCd", label: "TN Special Code", type: "text" },
//     ],
//   },

//   {
//     id: "endUser",
//     label: "End User & Reseller",
//     icon: "UserCheck",
//     defaultOpen: false,
//     fields: [
//       {
//         key: "endUserPoNbr",
//         label: "End-User PO Number",
//         copyable: true,
//         type: "id",
//       },
//       {
//         key: "resellerNbr",
//         label: "Reseller Number",
//         copyable: true,
//         type: "id",
//       },
//       { key: "endUserDataSw", label: "End-User Data Switch", type: "flag" },
//       {
//         key: "endUserAuthorization",
//         label: "End-User Authorization",
//         type: "text",
//       },
//       {
//         key: "endUserAddrSuffix",
//         label: "End-User Address Suffix",
//         type: "text",
//       },
//       { key: "endUserVendorFlag", label: "End-User Vendor Flag", type: "flag" },
//       {
//         key: "endUserNbr",
//         label: "End-User Number",
//         copyable: true,
//         type: "id",
//       },
//       {
//         key: "endCustId",
//         label: "End Customer ID",
//         copyable: true,
//         type: "id",
//       },
//       {
//         key: "endCustNum",
//         label: "End Customer Number",
//         copyable: true,
//         type: "id",
//       },
//       {
//         key: "endUserContSuffix",
//         label: "End-User Contact Suffix",
//         type: "text",
//       },
//       { key: "endUserOrderSw", label: "End-User Order Switch", type: "flag" },
//       { key: "resellerSplitPct", label: "Reseller Split %", type: "number" },
//       {
//         key: "vendorClaimNbr",
//         label: "Vendor Claim Number",
//         copyable: true,
//         type: "id",
//       },
//     ],
//   },

//   {
//     id: "financial",
//     label: "Financial & Pricing",
//     icon: "DollarSign",
//     defaultOpen: false,
//     fields: [
//       { key: "terms", label: "Terms", type: "text" },
//       { key: "ccyCd", label: "Currency Code", type: "text" },
//       { key: "ccyRate", label: "Currency Rate", type: "number" },
//       { key: "tradeDisc", label: "Trade Discount", type: "number" },
//       { key: "orderValueAtAdd", label: "Order Value at Add", type: "currency" },
//       { key: "priceRecalcSw", label: "Price Recalc Switch", type: "flag" },
//       { key: "crCrdSw", label: "Credit Card Switch", type: "flag" },
//       { key: "crRels", label: "Credit Release", type: "text" },
//       { key: "taxCode", label: "Tax Code", type: "text" },
//     ],
//   },

//   {
//     id: "processingFlags",
//     label: "Processing Flags & Switches",
//     icon: "ToggleLeft",
//     defaultOpen: false,
//     fields: [
//       { key: "bordrStus", label: "Border Status", type: "text" },
//       { key: "ordrCmpltFillSw", label: "Complete Fill Switch", type: "flag" },
//       { key: "splitSw", label: "Split Switch", type: "flag" },
//       { key: "bidQotFlg", label: "Bid/Quote Flag", type: "flag" },
//       { key: "bidExpDt", label: "Bid Expiration Date", type: "date" },
//       { key: "poCrtdSw", label: "PO Created Switch", type: "flag" },
//       { key: "enhcdRmaSw", label: "Enhanced RMA Switch", type: "flag" },
//       {
//         key: "enhcdCrMemoSw",
//         label: "Enhanced Credit Memo Switch",
//         type: "flag",
//       },
//       {
//         key: "specialHandleSw",
//         label: "Special Handling Switch",
//         type: "flag",
//       },
//       { key: "configurationFlag", label: "Configuration Flag", type: "flag" },
//       { key: "deleteTodaySw", label: "Delete Today Switch", type: "flag" },
//       {
//         key: "outsourceSkuInd",
//         label: "Outsource SKU Indicator",
//         type: "flag",
//       },
//       { key: "baseRateOrdrSw", label: "Base Rate Order Switch", type: "flag" },
//       { key: "allianceSw", label: "Alliance Switch", type: "flag" },
//       { key: "aodSw", label: "AOD Switch", type: "flag" },
//       {
//         key: "orderManagementSw",
//         label: "Order Management Switch",
//         type: "flag",
//       },
//       {
//         key: "gwmdImagApplyFlag",
//         label: "GWMD Image Apply Flag",
//         type: "flag",
//       },
//     ],
//   },

//   {
//     id: "location",
//     label: "Location & Locale",
//     icon: "MapPin",
//     defaultOpen: false,
//     fields: [
//       { key: "pstlCd", label: "Postal Code", type: "text" },
//       { key: "cityCode", label: "City Code", type: "text" },
//       { key: "countyCode", label: "County Code", type: "text" },
//       { key: "countryCode", label: "Country Code", type: "text" },
//       { key: "stateCode", label: "State Code", type: "text" },
//       {
//         key: "customersLanguageCode",
//         label: "Customer Language Code",
//         type: "text",
//       },
//       { key: "cuBusSgmt", label: "Customer Business Segment", type: "text" },
//       { key: "cuBusTyp", label: "Customer Business Type", type: "text" },
//       { key: "custType", label: "Customer Type", type: "text" },
//       { key: "odsLstUpdDt", label: "ODS Last Updated", type: "date" },
//     ],
//   },
// ];

// /** Count how many fields on `order` are non-null / non-empty across all groups. */
// export function countAvailableFields(order) {
//   if (!order) return 0;
//   return FIELD_GROUPS.flatMap((g) => g.fields).filter(
//     (f) => order[f.key] != null && order[f.key] !== "",
//   ).length;
// }

/**
 * fieldConfig.js  —  Single source of truth for all order header fields.
 *
 * Matches the CURRENT OrderResponseModel.cs / OrderRepository.cs mapping
 * (the ~145-column EO_ORDR_HDR_INFO set). Every key EXACTLY matches the
 * real backend property name on the `order` object, camelCased.
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
    key: "custPoNbr",
    label: "Customer PO Number",
    icon: "FileText",
    copyable: true,
    type: "id",
  },
  {
    key: "imiAsgdOrdrNbr",
    label: "IMI Order Number",
    icon: "Hash",
    copyable: true,
    type: "id",
  },
  {
    key: "imiAsgdBrNbr",
    label: "Order Branch",
    icon: "Building2",
    type: "text",
  },
  {
    key: "partnerId",
    label: "Partner ID",
    icon: "Users",
    copyable: true,
    type: "id",
  },
  {
    key: "custNbr",
    label: "Customer Number",
    icon: "User",
    copyable: true,
    type: "id",
  },
  { key: "ordSt", label: "Order Status", icon: "Activity", type: "status" },
  { key: "holdCd", label: "Hold Code", icon: "AlertCircle", type: "hold" },
  { key: "custCoCd", label: "Company Code", icon: "Building2", type: "text" },
  { key: "ordrCcyCd", label: "Currency", icon: "DollarSign", type: "text" },
  {
    key: "custPoDt",
    label: "Customer PO Date",
    icon: "Calendar",
    type: "date",
  },
  { key: "ordShFr", label: "Ship From Branch", icon: "Truck", type: "text" },
  { key: "termId", label: "Order Source", icon: "Globe", type: "text" },
];

export const FIELD_GROUPS = [
  {
    id: "orderIds",
    label: "Order Identification",
    icon: "Hash",
    defaultOpen: true,
    fields: [
      {
        key: "custPoNbr",
        label: "Customer PO Number",
        copyable: true,
        type: "id",
      },
      { key: "sdqSeqNbr", label: "SDQ Sequence Number", type: "text" },
      { key: "custPoDt", label: "Customer PO Date", type: "date" },
      {
        key: "custPoSeqNbr",
        label: "Customer PO Sequence Number",
        type: "text",
      },
      { key: "tagNbr", label: "Tag Number", copyable: true, type: "id" },
      {
        key: "relsTagNbr",
        label: "Released Tag Number",
        copyable: true,
        type: "id",
      },
      { key: "processUnitTs", label: "Process Unit Timestamp", type: "date" },
      { key: "applId", label: "Application ID", type: "text" },
      { key: "xactSet", label: "Transaction Set", type: "text" },
      {
        key: "cmbBtchNbr",
        label: "Combined Batch Number",
        copyable: true,
        type: "id",
      },
      { key: "imiAsgdBrNbr", label: "Order Branch", type: "text" },
      {
        key: "imiAsgdOrdrNbr",
        label: "IMI Order Number",
        copyable: true,
        type: "id",
      },
      { key: "ordrType", label: "Order Type", type: "text" },
      {
        key: "sellrSalesNbr",
        label: "Seller Sales Number",
        copyable: true,
        type: "id",
      },
      { key: "ordEntryDtTs", label: "Order Entry Timestamp", type: "date" },
      { key: "termId", label: "Terminal / Source", type: "text" },
      { key: "quoteNbr", label: "Quote Number", copyable: true, type: "id" },
      { key: "contNbr", label: "Contract Number", copyable: true, type: "id" },
      {
        key: "prevContNbr",
        label: "Previous Contract Number",
        copyable: true,
        type: "id",
      },
      { key: "contTypeCd", label: "Contract Type Code", type: "text" },
    ],
  },

  {
    id: "customer",
    label: "Customer Information",
    icon: "User",
    defaultOpen: true,
    fields: [
      { key: "custCoCd", label: "Customer Company Code", type: "text" },
      { key: "custBr", label: "Customer Branch", type: "text" },
      { key: "custNbr", label: "Customer Number", copyable: true, type: "id" },
      { key: "custSfx", label: "Customer Suffix", type: "text" },
      { key: "deptNbr", label: "Department Number", type: "text" },
      { key: "byrLoc", label: "Buyer Location", type: "text" },
      { key: "byrCntact", label: "Buyer Contact", type: "text" },
      { key: "byrPhnNbr", label: "Buyer Phone Number", type: "text" },
      {
        key: "byrVndrNbr",
        label: "Buyer Vendor Number",
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
      {
        key: "custVdrNbr",
        label: "Customer Vendor Number",
        copyable: true,
        type: "id",
      },
    ],
  },

  {
    id: "partner",
    label: "Partner Information",
    icon: "Users",
    defaultOpen: false,
    fields: [
      { key: "partnerId", label: "Partner ID", copyable: true, type: "id" },
      {
        key: "ordRefNbr",
        label: "Order Reference Number",
        copyable: true,
        type: "id",
      },
      {
        key: "ordRelsNbr",
        label: "Order Release Number",
        copyable: true,
        type: "id",
      },
      {
        key: "billToRefNbr",
        label: "Bill-To Reference Number",
        copyable: true,
        type: "id",
      },
      {
        key: "imiRefNbr",
        label: "IMI Reference Number",
        copyable: true,
        type: "id",
      },
    ],
  },

  {
    id: "endUser",
    label: "End User Information",
    icon: "UserCheck",
    defaultOpen: false,
    fields: [
      { key: "euName", label: "End-User Name", type: "text" },
      { key: "euAttn", label: "End-User Attention", type: "text" },
      { key: "euAddr1", label: "End-User Address 1", type: "text" },
      { key: "euAddr2", label: "End-User Address 2", type: "text" },
      { key: "euAddr3", label: "End-User Address 3", type: "text" },
      { key: "euAddr4", label: "End-User Address 4", type: "text" },
      { key: "euCity", label: "End-User City", type: "text" },
      { key: "euState", label: "End-User State", type: "text" },
      { key: "euZip", label: "End-User ZIP", type: "text" },
      { key: "euCtry", label: "End-User Country", type: "text" },
      { key: "euTax", label: "End-User Tax", type: "text" },
      { key: "euCntact", label: "End-User Contact", type: "text" },
      { key: "euPhnNbr", label: "End-User Phone Number", type: "text" },
      { key: "euPhnNbrExt", label: "End-User Phone Extension", type: "text" },
      { key: "euFaxNbr", label: "End-User Fax Number", type: "text" },
      { key: "euEmail", label: "End-User Email", type: "text" },
      { key: "euResaleRslr", label: "End-User Resale Reseller", type: "text" },
      {
        key: "euRefNbr",
        label: "End-User Reference Number",
        copyable: true,
        type: "id",
      },
      { key: "euDepId", label: "End-User Department ID", type: "text" },
      {
        key: "endCustActNbr",
        label: "End Customer Account Number",
        copyable: true,
        type: "id",
      },
      {
        key: "endCustOrdNbr",
        label: "End Customer Order Number",
        copyable: true,
        type: "id",
      },
      {
        key: "endCustPoNbr",
        label: "End Customer PO Number",
        copyable: true,
        type: "id",
      },
      {
        key: "endCustRefNbr",
        label: "End Customer Reference Number",
        copyable: true,
        type: "id",
      },
    ],
  },

  {
    id: "shipTo",
    label: "Ship-To Information",
    icon: "MapPin",
    defaultOpen: false,
    fields: [
      { key: "stName", label: "Ship-To Name", type: "text" },
      { key: "stAttn", label: "Ship-To Attention", type: "text" },
      { key: "stAttn2", label: "Ship-To Attention 2", type: "text" },
      { key: "stPhoneNbr", label: "Ship-To Phone Number", type: "text" },
      { key: "stAddr1", label: "Ship-To Address 1", type: "text" },
      { key: "stAddr2", label: "Ship-To Address 2", type: "text" },
      { key: "stAddr3", label: "Ship-To Address 3", type: "text" },
      { key: "stAddr4", label: "Ship-To Address 4", type: "text" },
      { key: "stCity", label: "Ship-To City", type: "text" },
      { key: "stState", label: "Ship-To State", type: "text" },
      { key: "stZip", label: "Ship-To ZIP", type: "text" },
      { key: "stCtry", label: "Ship-To Country", type: "text" },
      {
        key: "stPtnrStoreNbr",
        label: "Ship-To Partner Store Number",
        copyable: true,
        type: "id",
      },
      { key: "stImiStSuf", label: "Ship-To IMI Suffix", type: "text" },
      { key: "stEmail", label: "Ship-To Email", type: "text" },
      { key: "shipToAttnFlg", label: "Ship-To Attention Flag", type: "flag" },
    ],
  },

  {
    id: "shipping",
    label: "Shipping & Logistics",
    icon: "Truck",
    defaultOpen: false,
    fields: [
      { key: "ordShFr", label: "Ship From Branch", type: "text" },
      { key: "shipFlg", label: "Ship Flag", type: "flag" },
      { key: "imiCarCd", label: "IMI Carrier Code", type: "text" },
      { key: "custCarrCode", label: "Customer Carrier Code", type: "text" },
      { key: "imiShipVia", label: "IMI Ship Via", type: "text" },
      { key: "thrdPtyAct", label: "Third Party Account", type: "text" },
      { key: "brSeqValu", label: "Branch Sequence Value", type: "text" },
      { key: "distrbDepth", label: "Distribution Depth", type: "text" },
      { key: "maxXitDays", label: "Max Transit Days", type: "text" },
      { key: "airBrSeqFlg", label: "Air Branch Sequence Flag", type: "flag" },
      { key: "brSeqFlg", label: "Branch Sequence Flag", type: "flag" },
      {
        key: "multBrSeqFlg",
        label: "Multi-Branch Sequence Flag",
        type: "flag",
      },
      {
        key: "exptBrSeqFlg",
        label: "Export Branch Sequence Flag",
        type: "flag",
      },
      { key: "saveFrtFlg", label: "Save Freight Flag", type: "flag" },
      { key: "saveDistFlg", label: "Save Distribution Flag", type: "flag" },
      { key: "singleWhse", label: "Single Warehouse", type: "text" },
      { key: "prntOrdrFlg", label: "Parent Order Flag", type: "flag" },
      { key: "baserateFlg", label: "Base Rate Flag", type: "flag" },
      { key: "multDistrbFlg", label: "Multi-Distribution Flag", type: "flag" },
      { key: "nbrOfWhse", label: "Number of Warehouses", type: "text" },
      { key: "frghtOutCode", label: "Freight Out Code", type: "text" },
      {
        key: "freightOrderNbr",
        label: "Freight Order Number",
        copyable: true,
        type: "id",
      },
      {
        key: "carrierAccount",
        label: "Carrier Account",
        copyable: true,
        type: "id",
      },
      {
        key: "custFrtFwrdFlg",
        label: "Customer Freight Forward Flag",
        type: "flag",
      },
      { key: "imFrtFwrdFlg", label: "IM Freight Forward Flag", type: "flag" },
      { key: "serviceInd", label: "Service Indicator", type: "text" },
      { key: "serviceLevel", label: "Service Level", type: "text" },
      {
        key: "hermPoNbr",
        label: "Hermes PO Number",
        copyable: true,
        type: "id",
      },
      {
        key: "xdockDistCtr",
        label: "Cross-Dock Distribution Center",
        type: "text",
      },
      { key: "dpasTypeCd", label: "DPAS Type Code", type: "text" },
      {
        key: "dpasPgmId",
        label: "DPAS Program ID",
        copyable: true,
        type: "id",
      },
      { key: "lnFulfillSw", label: "Line Fulfill Switch", type: "flag" },
      { key: "fulfilOrderFlg", label: "Fulfill Order Flag", type: "flag" },
      {
        key: "depOrdrNbr",
        label: "Dependent Order Number",
        copyable: true,
        type: "id",
      },
      { key: "ordrReqShipDt", label: "Requested Ship Date", type: "date" },
      { key: "ordrReqDlvyDt", label: "Requested Delivery Date", type: "date" },
      { key: "ordrReqCancDt", label: "Requested Cancel Date", type: "date" },
      {
        key: "orideCustPoDt",
        label: "Override Customer PO Date",
        type: "date",
      },
      { key: "ordrEtaDt", label: "ETA Date", type: "date" },
    ],
  },

  {
    id: "financial",
    label: "Financial & Terms",
    icon: "DollarSign",
    defaultOpen: false,
    fields: [
      { key: "ordrCcyCd", label: "Order Currency", type: "text" },
      { key: "terms", label: "Terms", type: "text" },
      { key: "ccyRate", label: "Currency Rate", type: "number" },
      { key: "codAmt", label: "COD Amount", type: "currency" },
      { key: "codFeeSwtch", label: "COD Fee Switch", type: "flag" },
      { key: "dropMsg", label: "Drop Message", type: "text" },
      { key: "ordrHasErrs", label: "Order Has Errors", type: "flag" },
      { key: "taxFlg", label: "Tax Flag", type: "flag" },
      { key: "specLblCode", label: "Special Label Code", type: "text" },
      { key: "poGovtTp", label: "PO Government Type", type: "text" },
      { key: "xmitHashTot", label: "Transmit Hash Total", type: "text" },
      { key: "xmitTotLines", label: "Transmit Total Lines", type: "text" },
      { key: "prcConcessionTxt", label: "Price Concession Text", type: "text" },
    ],
  },

  {
    id: "government",
    label: "Government, VLA & Compliance",
    icon: "Shield",
    defaultOpen: false,
    fields: [
      {
        key: "govtPubPrivSw",
        label: "Government/Public/Private Switch",
        type: "flag",
      },
      { key: "govtPgmType", label: "Government Program Type", type: "text" },
      {
        key: "govtSolctnNbr",
        label: "Government Solicitation Number",
        copyable: true,
        type: "id",
      },
      { key: "vlaRlsdFlg", label: "VLA Released Flag", type: "flag" },
      {
        key: "vlaRlsdId",
        label: "VLA Released ID",
        copyable: true,
        type: "id",
      },
      { key: "vlaRlsdDtTm", label: "VLA Released Date/Time", type: "date" },
      { key: "vlaEtaDt", label: "VLA ETA Date", type: "date" },
      { key: "vlaRejectReason", label: "VLA Reject Reason", type: "text" },
      {
        key: "vlaEuNbr",
        label: "VLA End-User Number",
        copyable: true,
        type: "id",
      },
      {
        key: "vlaAuthNbr",
        label: "VLA Authorization Number",
        copyable: true,
        type: "id",
      },
      { key: "vlaType", label: "VLA Type", type: "text" },
      {
        key: "vendAuthNbr",
        label: "Vendor Authorization Number",
        copyable: true,
        type: "id",
      },
      {
        key: "vendQotNbr",
        label: "Vendor Quote Number",
        copyable: true,
        type: "id",
      },
    ],
  },

  {
    id: "configFlags",
    label: "Configuration & Order Flags",
    icon: "ToggleLeft",
    defaultOpen: false,
    fields: [
      { key: "resvInvSw", label: "Reservation Inventory Switch", type: "flag" },
      { key: "cnsgnSw", label: "Consignment Switch", type: "flag" },
      { key: "isDelvFlg", label: "Delivery Flag", type: "flag" },
      { key: "slaCode", label: "SLA Code", type: "text" },
      { key: "cfgType", label: "Configuration Type", type: "text" },
      { key: "labType", label: "Label Type", type: "text" },
      { key: "configPoType", label: "Configuration PO Type", type: "text" },
      { key: "allLinesConfig", label: "All Lines Configuration", type: "flag" },
      { key: "specFormSwtch", label: "Special Form Switch", type: "flag" },
      { key: "boOrideSwtch", label: "Backorder Override Switch", type: "flag" },
      { key: "ordrRejFlg", label: "Order Rejected Flag", type: "flag" },
      { key: "ordSt", label: "Order Status", type: "status" },
      { key: "holdCd", label: "Hold Code", type: "hold" },
      { key: "dmdBr", label: "Demand Branch", type: "text" },
      { key: "processDt", label: "Process Date", type: "date" },
      { key: "processTm", label: "Process Time", type: "text" },
      {
        key: "custinLicVlidCd",
        label: "Customer Inbound License Valid Code",
        type: "text",
      },
      {
        key: "recalcLicVlidCd",
        label: "Recalc License Valid Code",
        type: "text",
      },
      {
        key: "custDelStusFlg",
        label: "Customer Delivery Status Flag",
        type: "flag",
      },
      { key: "ordrCigId", label: "Order CIG ID", copyable: true, type: "id" },
      { key: "ordrCupId", label: "Order CUP ID", copyable: true, type: "id" },
      { key: "dvFlg", label: "DV Flag", type: "flag" },
      { key: "eddFlg", label: "EDD Flag", type: "flag" },
      { key: "splitName1", label: "Split Name 1", type: "text" },
      { key: "splitName2", label: "Split Name 2", type: "text" },
      { key: "badAddrSwtch", label: "Bad Address Switch", type: "flag" },
      { key: "vmfHdrHldInd", label: "VMF Header Hold Indicator", type: "flag" },
      { key: "xediRlsdInd", label: "XEDI Released Indicator", type: "flag" },
      { key: "xediAckFlg", label: "XEDI Acknowledge Flag", type: "flag" },
      {
        key: "futOrdrPromDt",
        label: "Future Order Promise Date",
        type: "date",
      },
    ],
  },

  {
    id: "technical",
    label: "Technical / System",
    icon: "Cpu",
    defaultOpen: false,
    technical: true,
    fields: [
      { key: "stateCd", label: "State Code", type: "text" },
      { key: "eoEdiCd", label: "EO EDI Code", type: "text" },
      { key: "preProcsRpt", label: "Pre-Process Report", type: "text" },
      {
        key: "mastVendNbr",
        label: "Master Vendor Number",
        copyable: true,
        type: "id",
      },
      { key: "rslrEmail", label: "Reseller Email", type: "text" },
      { key: "rslrFax", label: "Reseller Fax", type: "text" },
      { key: "rslrLotusId", label: "Reseller Lotus ID", type: "text" },
      { key: "imiBtSuf", label: "IMI Bill-To Suffix", type: "text" },
      { key: "busRegnCd", label: "Business Region Code", type: "text" },
      { key: "db2CrtTs", label: "DB2 Create Timestamp", type: "date" },
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
