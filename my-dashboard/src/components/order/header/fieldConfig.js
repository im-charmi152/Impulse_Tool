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

// ─── Order status code → human label + badge colour ──────────────────────────
export const ORDER_STATUS_MAP = {
  // Numeric codes from DB2
  "10": { label: "Draft",        color: "gray"  },
  "20": { label: "Processing",   color: "blue"  },
  "30": { label: "Booked",       color: "blue"  },
  "40": { label: "Completed",    color: "green" },
  "50": { label: "Cancelled",    color: "red"   },
  "60": { label: "On Hold",      color: "amber" },
  "70": { label: "Backordered",  color: "amber" },
  "80": { label: "Shipped",      color: "green" },
  "90": { label: "Closed",       color: "gray"  },
  // Friendly strings (mock / transformed API)
  completed:   { label: "Completed",  color: "green" },
  processing:  { label: "Processing", color: "blue"  },
  cancelled:   { label: "Cancelled",  color: "red"   },
  shipped:     { label: "Shipped",    color: "green" },
  "on hold":   { label: "On Hold",    color: "amber" },
  booked:      { label: "Booked",     color: "blue"  },
  draft:       { label: "Draft",      color: "gray"  },
};

// ─── Hold code → human description ───────────────────────────────────────────
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
  { key: "poNumber",       label: "PO Number",         icon: "FileText",   copyable: true, type: "id"     },
  { key: "imiAsgdBrNbr",  label: "Order Branch",       icon: "Building2",                  type: "text"   },
  { key: "ordSt",          label: "Order Status",       icon: "Activity",                   type: "status" },
  { key: "accountNumber",  label: "Customer Number",    icon: "User",       copyable: true, type: "id"     },
  { key: "accountName",    label: "Account Name",       icon: "Building",                   type: "text"   },
  { key: "partnerId",      label: "Partner ID",         icon: "Users",      copyable: true, type: "id"     },
  { key: "partnerName",    label: "Partner Name",       icon: "Users",                      type: "text"   },
  { key: "orderDate",      label: "Order Date",         icon: "Calendar",                   type: "date"   },
  { key: "ordrCcyCd",      label: "Currency",           icon: "DollarSign",                 type: "text"   },
  { key: "holdCode",       label: "Hold Code",          icon: "AlertCircle",                type: "hold"   },
  { key: "ordShFr",        label: "Ship From Branch",   icon: "Truck",                      type: "text"   },
  { key: "termId",         label: "Order Source",       icon: "Globe",                      type: "text"   },
];

// ─── 8 accordion groups — all real backend fields ────────────────────────────
export const FIELD_GROUPS = [
  // ── 1. Order Information ────────────────────────────────────────────────
  {
    id: "order",
    label: "Order Information",
    icon: "ShoppingCart",
    defaultOpen: true,
    fields: [
      { key: "poNumber",       label: "PO Number",                    copyable: true, type: "id"     },
      { key: "custPoNbr",      label: "Customer PO Number",           copyable: true, type: "id"     },
      { key: "custPoSeqNbr",   label: "Customer PO Sequence Number",                  type: "number" },
      { key: "sdqSeqNbr",      label: "SDQ Sequence Number",                          type: "number" },
      { key: "imiAsgdBrNbr",   label: "Order Branch",                                 type: "text"   },
      { key: "orderDate",      label: "Order Date",                                   type: "date"   },
      { key: "custPoDt",       label: "Customer PO Date",                             type: "date"   },
      { key: "orideCustPoDt",  label: "Original Customer PO Date",                   type: "date"   },
      { key: "ordEntryDtTs",   label: "Order Entry Timestamp",                        type: "date"   },
      { key: "termId",         label: "Order Source / Terminal",                      type: "text"   },
      { key: "ordrType",       label: "Order Type",                                   type: "text"   },
      { key: "ordSt",          label: "Order Status",                                 type: "status" },
      { key: "holdCode",       label: "Hold Code",                                    type: "hold"   },
      { key: "stateCd",        label: "State Code",                                   type: "text"   },
      { key: "custSfx",        label: "Customer Suffix",                              type: "text"   },
      { key: "slaCode",        label: "SLA Code",                                     type: "text"   },
      { key: "contNbr",        label: "Contract Number",              copyable: true, type: "id"     },
      { key: "quoteNbr",       label: "Quote Number",                 copyable: true, type: "id"     },
      { key: "dmdBr",          label: "Demand Branch",                                type: "text"   },
      { key: "busRegnCd",      label: "Business Region Code",                        type: "text"   },
      { key: "processDt",      label: "Process Date",                                 type: "date"   },
      { key: "processTm",      label: "Process Time",                                 type: "text"   },
      { key: "sellrSalesNbr",  label: "Seller Sales Number",         copyable: true, type: "id"     },
    ],
  },

  // ── 2. Customer Information ──────────────────────────────────────────────
  {
    id: "customer",
    label: "Customer Information",
    icon: "User",
    defaultOpen: true,
    fields: [
      { key: "accountNumber",  label: "Customer Number (Account)",   copyable: true, type: "id"   },
      { key: "accountName",    label: "Account Name",                                type: "text" },
      { key: "custNbr",        label: "Customer Number (DB2)",       copyable: true, type: "id"   },
      { key: "custCoCd",       label: "Customer Company Code",                       type: "text" },
      { key: "custBr",         label: "Customer Branch",                             type: "text" },
      { key: "deptNbr",        label: "Department Number",                           type: "text" },
      { key: "byrLoc",         label: "Buyer Location",                              type: "text" },
      { key: "byrCntact",      label: "Buyer Contact",                               type: "text" },
      { key: "byrPhnNbr",      label: "Buyer Phone Number",                          type: "text" },
      { key: "byrVndrNbr",     label: "Buyer Vendor Number",        copyable: true, type: "id"   },
    ],
  },

  // ── 3. Partner Information ───────────────────────────────────────────────
  {
    id: "partner",
    label: "Partner Information",
    icon: "Users",
    defaultOpen: true,
    fields: [
      { key: "partnerId",      label: "Partner ID",                  copyable: true, type: "id"   },
      { key: "partnerName",    label: "Partner Name",                                type: "text" },
      { key: "sellrSalesNbr",  label: "Seller Sales Number",        copyable: true, type: "id"   },
      { key: "poGovtTp",       label: "PO Government Type",                         type: "text" },
      { key: "govtPgmType",    label: "Government Program Type",                    type: "text" },
    ],
  },

  // ── 4. Shipping Information ──────────────────────────────────────────────
  {
    id: "shipping",
    label: "Shipping Information",
    icon: "Truck",
    defaultOpen: false,
    fields: [
      { key: "ordShFr",         label: "Ship From Branch",                           type: "text"   },
      { key: "imiCarCd",        label: "IMI Carrier Code",                           type: "text"   },
      { key: "imiShipVia",      label: "IMI Ship Via",                               type: "text"   },
      { key: "custCarrCode",    label: "Customer Carrier Code",                      type: "text"   },
      { key: "carrierAccount",  label: "Carrier Account",            copyable: true, type: "id"     },
      { key: "ordrReqShipDt",   label: "Requested Ship Date",                        type: "date"   },
      { key: "ordrReqDlvyDt",   label: "Requested Delivery Date",                   type: "date"   },
      { key: "ordrReqCancDt",   label: "Requested Cancel Date",                     type: "date"   },
      { key: "ordrEtaDt",       label: "ETA Date",                                  type: "date"   },
      { key: "maxXitDays",      label: "Maximum Transit Days",                       type: "number" },
      { key: "singleWhse",      label: "Single Warehouse",                           type: "text"   },
      { key: "nbrOfWhse",       label: "Number of Warehouses",                       type: "number" },
      { key: "distrbDepth",     label: "Distribution Depth",                         type: "number" },
      { key: "brSeqValu",       label: "Branch Sequence Value",                      type: "text"   },
      { key: "codAmt",          label: "COD Amount",                                 type: "currency"},
      { key: "thrdPtyAct",      label: "Third Party Account",        copyable: true, type: "id"     },
      { key: "freightOrderNbr", label: "Freight Order Number",       copyable: true, type: "id"     },
      { key: "frghtOutCode",    label: "Freight Out Code",                           type: "text"   },
      { key: "isDelvFlg",       label: "Delivery Flag",                              type: "flag"   },
      { key: "shipFlg",         label: "Ship Flag",                                  type: "flag"   },
    ],
  },

  // ── 5. Financial Information ─────────────────────────────────────────────
  {
    id: "financial",
    label: "Financial Information",
    icon: "DollarSign",
    defaultOpen: false,
    fields: [
      { key: "ordrCcyCd",      label: "Order Currency",                              type: "text"   },
      { key: "ccyRate",        label: "Currency Rate",                               type: "number" },
      { key: "terms",          label: "Terms",                                       type: "text"   },
      { key: "xmitHashTot",   label: "Transmit Hash Total",                         type: "number" },
      { key: "xmitTotLines",  label: "Transmit Total Lines",                        type: "number" },
      { key: "taxFlg",         label: "Tax Flag",                                   type: "flag"   },
    ],
  },

  // ── 6. Configuration ────────────────────────────────────────────────────
  {
    id: "config",
    label: "Configuration",
    icon: "Settings",
    defaultOpen: false,
    fields: [
      { key: "cfgType",        label: "Configuration Type",                          type: "text" },
      { key: "configPoType",   label: "Configuration PO Type",                      type: "text" },
      { key: "labType",        label: "Label Type",                                  type: "text" },
      { key: "specLblCode",    label: "Special Label Code",                          type: "text" },
      { key: "serviceInd",     label: "Service Indicator",                           type: "text" },
      { key: "serviceLevel",   label: "Service Level",                               type: "text" },
      { key: "resvInvSw",      label: "Reservation Inventory Switch",                type: "flag" },
      { key: "cnsgnSw",        label: "Consignment Switch",                          type: "flag" },
    ],
  },

  // ── 7. Flags & Indicators ───────────────────────────────────────────────
  {
    id: "flags",
    label: "Flags & Indicators",
    icon: "Flag",
    defaultOpen: false,
    fields: [
      { key: "govtPubPrivSw",      label: "Government / Public / Private",          type: "text" },
      { key: "govtPgmType",        label: "Government Program Type",                type: "text" },
      { key: "ordrRejFlg",         label: "Order Rejected Flag",                    type: "flag" },
      { key: "ordrHasErrs",        label: "Order Has Errors",                       type: "flag" },
      { key: "dropMsg",            label: "Drop Message",                           type: "text" },
      { key: "vmfHdrHldInd",       label: "VMF Header Hold Indicator",              type: "flag" },
      { key: "hybrdAnntyOrdrInd",  label: "Hybrid Annuity Order Indicator",         type: "flag" },
      { key: "isDelvFlg",          label: "Delivery Flag",                          type: "flag" },
      { key: "shipFlg",            label: "Ship Flag",                              type: "flag" },
      { key: "taxFlg",             label: "Tax Flag",                               type: "flag" },
      { key: "resvInvSw",          label: "Reservation Inventory Switch",           type: "flag" },
      { key: "cnsgnSw",            label: "Consignment Switch",                     type: "flag" },
    ],
  },

  // ── 8. Technical Information — collapsed by default ─────────────────────
  {
    id: "technical",
    label: "Technical Information",
    icon: "Cpu",
    defaultOpen: false,
    technical: true,
    fields: [
      { key: "tag",               label: "Tag Number",                copyable: true, type: "id"   },
      { key: "relsTagNbr",        label: "Related Tag Number",        copyable: true, type: "id"   },
      { key: "cmbBtchNbr",        label: "CMB Batch Number",          copyable: true, type: "id"   },
      { key: "applId",            label: "Application ID",            copyable: true, type: "id"   },
      { key: "xactSet",           label: "Transaction Set",                           type: "text" },
      { key: "processUnitTs",     label: "Process Unit Timestamp",                   type: "date" },
      { key: "hybrdAnntyCnfmtnId",label: "Hybrid Annuity Confirmation ID", copyable: true, type: "id" },
    ],
  },
];

/** Count how many fields on `order` are non-null / non-empty across all groups. */
export function countAvailableFields(order) {
  if (!order) return 0;
  return FIELD_GROUPS
    .flatMap((g) => g.fields)
    .filter((f) => order[f.key] != null && order[f.key] !== "")
    .length;
}
