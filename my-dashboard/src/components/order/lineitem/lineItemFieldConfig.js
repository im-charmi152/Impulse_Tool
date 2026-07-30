/**
 * lineItemFieldConfig.js — Single source of truth for all EO_LINE_INFO fields.
 *
 * Field order matches the database column order exactly, grouped only visually.
 * Field types mirror fieldConfig.js conventions:
 *   "text"    – plain string
 *   "id"      – monospace + copy-to-clipboard
 *   "number"  – integer / decimal
 *   "date"    – formatDateTime()
 *   "flag"    – "Y" → Enabled (green) | "N" → Disabled (muted)
 */

// ─── Accordion groups — all EO_LINE_INFO fields in DB column order ────────────
export const LINE_ITEM_FIELD_GROUPS = [
  // ── 1. Line Identity ──────────────────────────────────────────────────────
  {
    id: "identity",
    label: "Line Identity",
    icon: "Hash",
    defaultOpen: true,
    fields: [
      { key: "custCoCd",     label: "CUST_CO_CD",       type: "text"   },
      { key: "custBr",       label: "CUST_BR",           type: "text"   },
      { key: "custNbr",      label: "CUST_NBR",          type: "id", copyable: true },
      { key: "custSfx",      label: "CUST_SFX",          type: "text"   },
      { key: "custPoNbr",    label: "CUST_PO_NBR",       type: "id", copyable: true },
      { key: "sdqSeqNbr",    label: "SDQ_SEQ_NBR",       type: "number" },
      { key: "custPoDt",     label: "CUST_PO_DT",        type: "date"   },
      { key: "custPoSeqNbr", label: "CUST_PO_SEQ_NBR",   type: "number" },
      { key: "lineSeqNbr",   label: "LINE_SEQ_NBR",      type: "number" },
      { key: "prtnrLineNbr", label: "PRTNR_LINE_NBR",    type: "text"   },
      { key: "imiLineNbr",   label: "IMI_LINE_NBR",      type: "id", copyable: true },
    ],
  },

  // ── 2. Part Information ───────────────────────────────────────────────────
  {
    id: "part",
    label: "Part Information",
    icon: "Package",
    defaultOpen: true,
    fields: [
      { key: "imiPartNbr",    label: "IMI_PART_NBR",       type: "id", copyable: true },
      { key: "custPartNbr",   label: "CUST_PART_NBR",      type: "id", copyable: true },
      { key: "mfctrPartNbr",  label: "MFCTR_PART_NBR",     type: "id", copyable: true },
      { key: "upcPartNbr",    label: "UPC_PART_NBR",        type: "text"   },
      { key: "custPartDesc1", label: "CUST_PART_DESC_1",    type: "text"   },
      { key: "custPartDesc2", label: "CUST_PART_DESC_2",    type: "text"   },
      { key: "imiPartDesc1",  label: "IMI_PART_DESC_1",     type: "text"   },
      { key: "imiPartDesc2",  label: "IMI_PART_DESC_2",     type: "text"   },
      { key: "subPartNbr",    label: "SUB_PART_NBR",        type: "text"   },
    ],
  },

  // ── 3. Quantities ─────────────────────────────────────────────────────────
  {
    id: "quantities",
    label: "Quantities",
    icon: "BarChart2",
    fields: [
      { key: "qtyOrdered",   label: "QTY_ORDERED",     type: "number" },
      { key: "csPkQty",      label: "CS_PK_QTY",        type: "number" },
      { key: "qtyPerConfig", label: "QTY_PER_CONFIG",   type: "number" },
      { key: "configQty",    label: "CONFIG_QTY",        type: "number" },
      { key: "qtyAlloc",     label: "QTY_ALLOC",         type: "number" },
      { key: "qtyBo",        label: "QTY_BO",            type: "number" },
      { key: "svcQty",       label: "SVC_QTY",           type: "number" },
    ],
  },

  // ── 4. Pricing ────────────────────────────────────────────────────────────
  {
    id: "pricing",
    label: "Pricing",
    icon: "DollarSign",
    fields: [
      { key: "custQotdPrc",     label: "CUST_QOTD_PRC",       type: "number" },
      { key: "endUserPrc",      label: "END_USER_PRC",         type: "number" },
      { key: "unitPrc",         label: "UNIT_PRC",             type: "number" },
      { key: "rtlPrc",          label: "RTL_PRC",              type: "number" },
      { key: "frgnUnitPrc",     label: "FRGN_UNIT_PRC",        type: "number" },
      { key: "svcAmt",          label: "SVC_AMT",              type: "number" },
      { key: "hermUnitCostAmt", label: "HERM_UNIT_COST_AMT",   type: "number" },
      { key: "hermUnitPrcAmt",  label: "HERM_UNIT_PRC_AMT",    type: "number" },
      { key: "ctoUnitCostAmt",  label: "CTO_UNIT_COST_AMT",    type: "number" },
      { key: "ctoUnitPrcAmt",   label: "CTO_UNIT_PRC_AMT",     type: "number" },
      { key: "euPpPrcAmt",      label: "EU_PP_PRC_AMT",        type: "number" },
    ],
  },

  // ── 5. Dates & Delivery ───────────────────────────────────────────────────
  {
    id: "dates",
    label: "Dates & Delivery",
    icon: "Calendar",
    fields: [
      { key: "lineReqDlvyDt", label: "LINE_REQ_DLVY_DT",  type: "date" },
      { key: "lineReqShipDt", label: "LINE_REQ_SHIP_DT",  type: "date" },
      { key: "lineReqCancDt", label: "LINE_REQ_CANC_DT",  type: "date" },
      { key: "eta",           label: "ETA",                type: "text" },
      { key: "etaSrcCd",      label: "ETA_SRC_CD",         type: "text" },
      { key: "futLinePromDt", label: "FUT_LINE_PROM_DT",   type: "date" },
      { key: "euPpPurDt",     label: "EU_PP_PUR_DT",       type: "date" },
      { key: "termEndDt",     label: "TERM_END_DT",         type: "date" },
    ],
  },

  // ── 6. Status & Rejection ─────────────────────────────────────────────────
  {
    id: "status",
    label: "Status & Rejection",
    icon: "AlertCircle",
    fields: [
      { key: "imiRejCd",     label: "IMI_REJ_CD",       type: "text" },
      { key: "acptRejFlg",   label: "ACPT_REJ_FLG",     type: "text" },
      { key: "imiRejCdDesc", label: "IMI_REJ_CD_DESC",  type: "text" },
      { key: "htImiRejCd",   label: "HT_IMI_REJ_CD",    type: "text" },
      { key: "htInitRejCd",  label: "HT_INIT_REJ_CD",   type: "text" },
      { key: "imiHoldCd",    label: "IMI_HOLD_CD",       type: "text" },
    ],
  },

  // ── 7. Fulfillment & Flags ────────────────────────────────────────────────
  {
    id: "fulfillment",
    label: "Fulfillment & Flags",
    icon: "Truck",
    fields: [
      { key: "rsvInvtyFlg",  label: "RSV_INVTY_FLG",    type: "flag" },
      { key: "prcUseFlg",    label: "PRC_USE_FLG",       type: "flag" },
      { key: "lineBoFlg",    label: "LINE_BO_FLG",        type: "flag" },
      { key: "aggrCd",       label: "AGGR_CD",            type: "text" },
      { key: "miscChrgSku",  label: "MISC_CHRG_SKU",      type: "text" },
      { key: "assetTagFlg",  label: "ASSET_TAG_FLG",      type: "flag" },
      { key: "oprtSys",      label: "OPRT_SYS",           type: "text" },
      { key: "dlvyMthd",     label: "DLVY_MTHD",          type: "text" },
      { key: "labType",      label: "LAB_TYPE",            type: "text" },
      { key: "itemTypeInd",  label: "ITEM_TYPE_IND",       type: "text" },
      { key: "miscCd",       label: "MISC_CD",             type: "text" },
      { key: "lineTypeSw",   label: "LINE_TYPE_SW",        type: "text" },
      { key: "freeItemSw",   label: "FREE_ITEM_SW",        type: "flag" },
      { key: "serialNbrFlg", label: "SERIAL_NBR_FLG",      type: "flag" },
    ],
  },

  // ── 8. Technical ─────────────────────────────────────────────────────────
  {
    id: "technical",
    label: "Technical",
    icon: "Cpu",
    technical: true,
    fields: [
      { key: "busRegnCd",      label: "BUS_REGN_CD",         type: "text"   },
      { key: "custSpecHndlCd", label: "CUST_SPEC_HNDL_CD",   type: "text"   },
      { key: "euAddrLoc",      label: "EU_ADDR_LOC",          type: "text"   },
      { key: "euInfoReqFlg",   label: "EU_INFO_REQ_FLG",      type: "flag"   },
      { key: "vendNbr",        label: "VEND_NBR",             type: "id", copyable: true },
      { key: "lineVlaAuthNbr", label: "LINE_VLA_AUTH_NBR",    type: "id", copyable: true },
      { key: "bidNbr",         label: "BID_NBR",              type: "id", copyable: true },
      { key: "bidVrsnNbr",     label: "BID_VRSN_NBR",         type: "text"   },
      { key: "extVendPartNbr", label: "EXT_VEND_PART_NBR",    type: "text"   },
      { key: "origSpplPartNbr",label: "ORIG_SPPL_PART_NBR",   type: "text"   },
      { key: "hermShipFrBrNbr",label: "HERM_SHIP_FR_BR_NBR",  type: "text"   },
      { key: "hermLineTypeCd", label: "HERM_LINE_TYPE_CD",    type: "text"   },
      { key: "hermStusFlg",    label: "HERM_STUS_FLG",        type: "text"   },
      { key: "lineVmfInfoSw",  label: "LINE_VMF_INFO_SW",     type: "flag"   },
      { key: "vmfLneHldInd",   label: "VMF_LNE_HLD_IND",      type: "text"   },
      { key: "quoteLineInd",   label: "QUOTE_LINE_IND",        type: "text"   },
      { key: "linkId",         label: "LINK_ID",               type: "id", copyable: true },
    ],
  },
];
