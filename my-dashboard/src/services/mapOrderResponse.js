// ─── Maps the real .NET GetOrder response into the shape the UI expects ───
//
// Confirmed against OrderResponseModel.cs + OrderRepository.cs — these are
// the EXACT fields the backend returns, no guessing needed. ASP.NET Core's
// default JSON serializer camel-cases the C# property names automatically,
// e.g. C#'s `PoNumber` arrives in the browser as `poNumber`.

export function mapOrderResponse(raw) {
  if (!raw) return null;

  const toPartnerSetupRecord = (entry) => ({
    coCd: entry.coCd ?? entry.CO_CD ?? "—",
    partnerId: entry.partnerId ?? entry.PARTNER_ID ?? "—",
    partnerTypeCd: entry.partnerTypeCd ?? entry.PARTNER_TYPE_CD ?? "—",
    srceSysId: entry.srceSysId ?? entry.SRCE_SYS_ID ?? "—",
    srceSysKeyId: entry.srceSysKeyId ?? entry.SRCE_SYS_KEY_ID ?? "—",
    formatId: entry.formatId ?? entry.FORMAT_ID ?? "—",
    docId: entry.docId ?? entry.DOC_ID ?? "—",
    commuId: entry.commuId ?? entry.COMMU_ID ?? "—",
    internetAddrTxt: entry.internetAddrTxt ?? entry.INTERNET_ADDR_TXT ?? "—",
    dirFlgCd: entry.dirFlgCd ?? entry.DIR_FLG_CD ?? "—",
    sendThruId: entry.sendThruId ?? entry.SEND_THRU_ID ?? "—",
    dataStoreMechId: entry.dataStoreMechId ?? entry.DATA_STORE_MECH_ID ?? "—",
    prcsOptnFlg: entry.prcsOptnFlg ?? entry.PRCS_OPTN_FLG ?? "—",
    batchSplitCnt: entry.batchSplitCnt ?? entry.BATCH_SPLIT_CNT ?? "—",
    ovrdApplBatchId: entry.ovrdApplBatchId ?? entry.OVRD_APPL_BATCH_ID ?? "—",
    freqId: entry.freqId ?? entry.FREQ_ID ?? "—",
    cycleIntvl: entry.cycleIntvl ?? entry.CYCLE_INTVL ?? "—",
    cycStrtTm: entry.cycStrtTm ?? entry.CYC_STRT_TM ?? "—",
    cycEndTm: entry.cycEndTm ?? entry.CYC_END_TM ?? "—",
    cycleLstRunTs: entry.cycleLstRunTs ?? entry.CYCLE_LST_RUN_TS ?? "—",
    actvDt: entry.actvDt ?? entry.ACTV_DT ?? "—",
    deactvDt: entry.deactvDt ?? entry.DEACTV_DT ?? "—",
    holdCd: entry.holdCd ?? entry.HOLD_CD ?? "—",
    lstChgTs: entry.lstChgTs ?? entry.LST_CHG_TS ?? "—",
    lstChgNam: entry.lstChgNam ?? entry.LST_CHG_NAM ?? "—",
    setupNotesTxt: entry.setupNotesTxt ?? entry.SETUP_NOTES_TXT ?? "—",
  });

  const toInPoSwRecord = (entry) => ({
    coCd: entry.coCd ?? entry.CO_CD ?? "—",
    partnerId: entry.partnerId ?? entry.PARTNER_ID ?? "—",
    skipFrTm: entry.skipFrTm ?? entry.SKIP_FR_TM ?? "—",
    skipToTm: entry.skipToTm ?? entry.SKIP_TO_TM ?? "—",
    custPrty: entry.custPrty ?? entry.CUST_PRTY ?? "—",
    ackPoFlg: entry.ackPoFlg ?? entry.ACK_PO_FLG ?? "—",
    ackPromoFlg: entry.ackPromoFlg ?? entry.ACK_PROMO_FLG ?? "—",
    baserateFlg: entry.baserateFlg ?? entry.BASERATE_FLG ?? "—",
    aggCdCpblFlg: entry.aggCdCpblFlg ?? entry.AGG_CD_CPBL_FLG ?? "—",
    preImHoldFlg: entry.preImHoldFlg ?? entry.PRE_IM_HOLD_FLG ?? "—",
    multShpToFlg: entry.multShpToFlg ?? entry.MULT_SHP_TO_FLG ?? "—",
    systemPartsFlg: entry.systemPartsFlg ?? entry.SYSTEM_PARTS_FLG ?? "—",
    voidTaxableFlg: entry.voidTaxableFlg ?? entry.VOID_TAXABLE_FLG ?? "—",
    casepackMsgFlg: entry.casepackMsgFlg ?? entry.CASEPACK_MSG_FLG ?? "—",
    chkCustPrcFlg: entry.chkCustPrcFlg ?? entry.CHK_CUST_PRC_FLG ?? "—",
    distDepthFlg: entry.distDepthFlg ?? entry.DIST_DEPTH_FLG ?? "—",
    airBrSeqFlg: entry.airBrSeqFlg ?? entry.AIR_BR_SEQ_FLG ?? "—",
    brSeqOrideFlg: entry.brSeqOrideFlg ?? entry.BR_SEQ_ORIDE_FLG ?? "—",
    multBrSeqFlg: entry.multBrSeqFlg ?? entry.MULT_BR_SEQ_FLG ?? "—",
    exportBrSeqFlg: entry.exportBrSeqFlg ?? entry.EXPORT_BR_SEQ_FLG ?? "—",
    holdOrderFlg: entry.holdOrderFlg ?? entry.HOLD_ORDER_FLG ?? "—",
    dfltCustNbr: entry.dfltCustNbr ?? entry.DFLT_CUST_NBR ?? "—",
    promoCustNbr: entry.promoCustNbr ?? entry.PROMO_CUST_NBR ?? "—",
    priceCustNbr: entry.priceCustNbr ?? entry.PRICE_CUST_NBR ?? "—",
    instRebatMsgFlg: entry.instRebatMsgFlg ?? entry.INST_REBAT_MSG_FLG ?? "—",
    vlaFlg: entry.vlaFlg ?? entry.VLA_FLG ?? "—",
    multiDistFlg: entry.multiDistFlg ?? entry.MULTI_DIST_FLG ?? "—",
    saveFrtFlg: entry.saveFrtFlg ?? entry.SAVE_FRT_FLG ?? "—",
    saveDistFlg: entry.saveDistFlg ?? entry.SAVE_DIST_FLG ?? "—",
    bestWhseFlg: entry.bestWhseFlg ?? entry.BEST_WHSE_FLG ?? "—",
    singleWhseFlg: entry.singleWhseFlg ?? entry.SINGLE_WHSE_FLG ?? "—",
    prntOrdrFlg: entry.prntOrdrFlg ?? entry.PRNT_ORDR_FLG ?? "—",
    multShpSortSeq: entry.multShpSortSeq ?? entry.MULT_SHP_SORT_SEQ ?? "—",
    maxFutDay: entry.maxFutDay ?? entry.MAX_FUT_DAY ?? "—",
    lstChgTs: entry.lstChgTs ?? entry.LST_CHG_TS ?? "—",
    lstChgNam: entry.lstChgNam ?? entry.LST_CHG_NAM ?? "—",
    clsXFltrTypCd: entry.clsXFltrTypCd ?? entry.CLS_X_FLTR_TYP_CD ?? "—",
    clsSFltrTypCd: entry.clsSFltrTypCd ?? entry.CLS_S_FLTR_TYP_CD ?? "—",
    updCustSkuFlg: entry.updCustSkuFlg ?? entry.UPD_CUST_SKU_FLG ?? "—",
    saveCustPrcFlg: entry.saveCustPrcFlg ?? entry.SAVE_CUST_PRC_FLG ?? "—",
    boBrXferFlg: entry.boBrXferFlg ?? entry.BO_BR_XFER_FLG ?? "—",
    rejOrdrHdrFlg: entry.rejOrdrHdrFlg ?? entry.REJ_ORDR_HDR_FLG ?? "—",
    rejCnsCmpHdrFlg: entry.rejCnsCmpHdrFlg ?? entry.REJ_CNSCMP_HDR_FLG ?? "—",
    ackRptFlg: entry.ackRptFlg ?? entry.ACK_RPT_FLG ?? "—",
    specPrcFlg: entry.specPrcFlg ?? entry.SPEC_PRC_FLG ?? "—",
    euCaptureFlg: entry.euCaptureFlg ?? entry.EU_CAPTURE_FLG ?? "—",
    customCarrFlg: entry.customCarrFlg ?? entry.CUSTOM_CARR_FLG ?? "—",
    cascadeSkuFlg: entry.cascadeSkuFlg ?? entry.CASCADE_SKU_FLG ?? "—",
    autoPoChgFlg: entry.autoPoChgFlg ?? entry.AUTO_PO_CHG_FLG ?? "—",
    clsXHldFlg: entry.clsXHldFlg ?? entry.CLS_X_HLD_FLG ?? "—",
    stStoreOvrRdFlg: entry.stStoreOvrRdFlg ?? entry.ST_STORE_OVRRD_FLG ?? "—",
    rsrvCustNbr: entry.rsrvCustNbr ?? entry.RSRV_CUST_NBR ?? "—",
    rsrvAllowed: entry.rsrvAllowed ?? entry.RSRV_ALLOWED ?? "—",
    rsrvExpirDays: entry.rsrvExpirDays ?? entry.RSRV_EXPIR_DAYS ?? "—",
    configVisibleFlg: entry.configVisibleFlg ?? entry.CONFIG_VISIBLE_FLG ?? "—",
    etaCalcFlg: entry.etaCalcFlg ?? entry.ETA_CALC_FLG ?? "—",
    etaDays: entry.etaDays ?? entry.ETA_DAYS ?? "—",
    addrValidFlg: entry.addrValidFlg ?? entry.ADDR_VALID_FLG ?? "—",
    autoSplitFlg: entry.autoSplitFlg ?? entry.AUTO_SPLIT_FLG ?? "—",
    ordrCancDaysFlg: entry.ordrCancDaysFlg ?? entry.ORDR_CANC_DAYS_FLG ?? "—",
    ordrCancDaysNbr: entry.ordrCancDaysNbr ?? entry.ORDR_CANC_DAYS_NBR ?? "—",
    futOrdrSw: entry.futOrdrSw ?? entry.FUT_ORDR_SW ?? "—",
    ackDelaySw: entry.ackDelaySw ?? entry.ACK_DELAY_SW ?? "—",
    ackDelayHrs: entry.ackDelayHrs ?? entry.ACK_DELAY_HRS ?? "—",
  });

  // ─── Maps the .NET GetOrder response into the shape the UI expects ────────
//
// IMPORTANT: the left side of each line below (`raw.xxx`) is the REAL JSON
// key — camelCase of the C# property name, per ASP.NET Core's default
// serializer. The right side (`companyCd:`, etc.) is the internal/UI key
// used everywhere else in the app. For most fields these are identical;
// for 11 fields they intentionally differ — see the table in chat history
// for the full list of renames and why.

  const order = {
    // ── Order Information ──
    ordrNbr: raw.imiAsgdOrdrNbr ?? "—",
    custOrdrNbr: raw.custPoNbr ?? "—",
    ordRefNbr: raw.ordRefNbr ?? "—",
    bordrStus: raw.ordrStatus ?? "—",
    entyDt: raw.entyDt ?? "—",
    entyTm: raw.entyTm ?? "—",
    entyMthd: raw.entyMthd ?? "—",
    termId: raw.termId ?? "—",
    priorityCode: raw.priorityCode ?? "—",
    contract: raw.contract ?? "—",
    campaign: raw.campaign ?? "—",
    ackCode: raw.ackCode ?? "—",
    sourceCode: raw.sourceCode ?? "—",
    copyCode: raw.copyCode ?? "—",

    // ── Customer Information ──
    companyCd: raw.custCoCd ?? "—",
    branchNbr: raw.custBr ?? "—",
    custRefNbr: raw.custRefNbr ?? "—",
    custRefNbr2: raw.custRefNbr2 ?? "—",
    capsIdCd: raw.capsIdCd ?? "—",
    capsBuyer: raw.capsBuyer ?? "—",
    custType: raw.custType ?? "—",

    // ── Billing Information ──
    billToBranchNbr: raw.billToBranchNbr ?? "—",
    billToCustNbr: raw.billToCustNbr ?? "—",
    billToSfx: raw.billToSfx ?? "—",
    splitBillToSw: raw.splitBillToSw ?? "N",
    summInvoiceCode: raw.summInvoiceCode ?? "—",
    glOffsetNbr: raw.glOffsetNbr ?? "—",
    glOffsetType: raw.glOffsetType ?? "—",
    payeeNbr: raw.payeeNbr ?? "—",
    payeeSuf: raw.payeeSuf ?? "—",
    soldToSuffix: raw.soldToSuffix ?? "—",

    // ── Shipping Information ──
    shipToSfx: raw.shipToSfx ?? "—",
    freightForwarder: raw.freightForwarder ?? "—",
    deliveryTerms: raw.deliveryTerms ?? "—",
    resdntlSw: raw.resdntlSw ?? "N",
    fulmntSw: raw.fulmntSw ?? "N",
    lastShipmentNbr: raw.lastShipmentNbr ?? "—",
    lastDistNbr: raw.lastDistNbr ?? "—",
    cuaShipFrom: raw.cuaShipFrom ?? "—",
    binTyp: raw.binTyp ?? "—",
    ordrCmpltFillSw: raw.ordrCmpltFillSw ?? "N",

    // ── Sales Information ──
    osSlsmn: raw.osSlsmn ?? "—",
    isSlsmn: raw.isSlsmn ?? "—",
    userNam: raw.userNam ?? "—",
    ediCo: raw.ediCo ?? "—",
    splitSw: raw.splitSw ?? "N",

    // ── Reseller Information ──
    resellerNbr: raw.resellerNbr ?? "—",
    vendorClaimNbr: raw.vendorClaimNbr ?? "—",
    resellerSplitPct: raw.resellerSplitPct ?? null,
    indiaGstOrderInd: raw.indiaGstOrderInd ?? "N",

    // ── Financial Information ──
    terms: raw.terms ?? "—",
    ccyCd: raw.ordrCcyCd ?? "—",
    ccyRate: raw.ccyRate ?? null,
    orderValueAtAdd: raw.orderValueAtAdd ?? null,
    crRels: raw.crRels ?? "—",
    crCrdSw: raw.crCrdSw ?? "N",
    priceRecalcSw: raw.priceRecalcSw ?? "N",

    // ── End User Information ──
    endUserPoNbr: raw.endUserPoNbr ?? "—",
    endUserNbr: raw.endUserNbr ?? "—",
    endUserDataSw: raw.endUserDataSw ?? "N",
    endUserAuthorization: raw.endUserAuthorization ?? "—",
    endUserAddrSuffix: raw.endUserAddrSuffix ?? "—",
    endUserVendorFlag: raw.endUserVendorFlag ?? "N",
    endUserContSuffix: raw.endUserContSuffix ?? "—",
    endUserOrderSw: raw.endUserOrderSw ?? "N",

    // ── End Customer Information ──
    endCustId: raw.endCustId ?? "—",
    endCustNum: raw.endCustNum ?? "—",

    // ── Government Information ──
    govtBidFlg: raw.govtBidFlg ?? "N",
    govtEndUserZip: raw.govtEndUserZip ?? "—",
    govtGsaInd: raw.govtGsaInd ?? "N",
    govtEndUserTyp: raw.govtEndUserTyp ?? "—",

    // ── Order Flags ──
    allianceSw: raw.allianceSw ?? "N",
    aodSw: raw.aodSw ?? "N",
    specialHandleSw: raw.specialHandleSw ?? "N",
    configurationFlag: raw.configurationFlag ?? "N",
    enhcdRmaSw: raw.enhancedRmaSw ?? "N",
    enhcdCrMemoSw: raw.enhancedCrMemoSw ?? "N",

    // ── Configuration ──
    baseRateOrdrSw: raw.baseRateOrdrSw ?? "N",
    extSoCode: raw.extSoCode ?? "—",
    jobAcctNbr: raw.jobAcctNbr ?? "—",

    // ── Authorization ──
    flrngAuthActnCd: raw.flrngAuthActnCd ?? "—",
    flrngAuthNbr: raw.flrngAuthNbr ?? "—",

    // ── Processing Information ──
    deleteTodaySw: raw.deleteTodaySw ?? "N",
    outsourceSkuInd: raw.outsourceSkuInd ?? "N",
    gwmdImagApplyFlag: raw.gwmdImagApplyFlag ?? "N",
    orderManagementSw: raw.orderManagementSw ?? "N",
    poCrtdSw: raw.poCrtedSw ?? "N",
    bidQotFlg: raw.bidQotFlg ?? "N",
    bidExpDt: raw.bidExpDt ?? "—",

    // ── Customer Business Information ──
    cuBusSgmt: raw.cuBusSgmt ?? "—",
    cuBusTyp: raw.cuBusTyp ?? "—",
    customersLanguageCode: raw.customersLanguageCode ?? "—",
    cityCode: raw.cityCode ?? "—",
    countyCode: raw.countyCode ?? "—",
    countryCode: raw.countryCode ?? "—",
    stateCode: raw.stateCd ?? "—",
    pstlCd: raw.postalCd ?? "—",

    // ── System Information ──
    odsLstUpdDt: raw.odsLstUpdDt ?? "—",

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

    custSfx: li.custSfx ?? "—",
    sdqSeqNbr: li.sdqSeqNbr ?? "—",
    custPoDt: li.custPoDt ?? "—",
    custPoSeqNbr: li.custPoSeqNbr ?? "—",
    lineSeqNbr: li.lineSeqNbr ?? "—",
    prtnrLineNbr: li.prtnrLineNbr ?? "—",
    custPartNbr: li.custPartNbr ?? "—",
    mfctrPartNbr: li.mfctrPartNbr ?? "—",
    upcPartNbr: li.upcPartNbr ?? "—",
    custQotdPrc: li.custQotdPrc ?? 0,
    csPkQty: li.csPkQty ?? 0,
    custPartDesc1: li.custPartDesc1 ?? "—",
    custPartDesc2: li.custPartDesc2 ?? "—",
    rsvInvtyFlg: li.rsvInvtyFlg ?? "—",
    imiPartDesc1: li.imiPartDesc1 ?? "—",
    imiPartDesc2: li.imiPartDesc2 ?? "—",
    prcUseFlg: li.prcUseFlg ?? "—",
    lineReqDlvyDt: li.lineReqDlvyDt ?? "—",
    lineReqShipDt: li.lineReqShipDt ?? "—",
    lineReqCancDt: li.lineReqCancDt ?? "—",
    lineBoFlg: li.lineBoFlg ?? "—",
    aggrCd: li.aggrCd ?? "—",
    miscChrgSku: li.miscChrgSku ?? "—",
    assetTagFlg: li.assetTagFlg ?? "—",
    oprtSys: li.oprtSys ?? "—",
    dlvyMthd: li.dlvyMthd ?? "—",
    labType: li.labType ?? "—",
    qtyPerConfig: li.qtyPerConfig ?? 0,
    configQty: li.configQty ?? 0,
    itemTypeInd: li.itemTypeInd ?? "—",
    qtyAlloc: li.qtyAlloc ?? 0,
    endUserPrc: li.endUserPrc ?? 0,
    imiRejCd: li.imiRejCd ?? "—",
    acptRejFlg: li.acptRejFlg ?? "—",
    miscCd: li.miscCd ?? "—",
    lineTypeSw: li.lineTypeSw ?? "—",
    qtyBo: li.qtyBo ?? 0,
    unitPrc: li.unitPrc ?? 0,
    rtlPrc: li.rtlPrc ?? 0,
    frgnUnitPrc: li.frgnUnitPrc ?? 0,
    subPartNbr: li.subPartNbr ?? "—",
    eta: li.eta ?? "—",
    freeItemSw: li.freeItemSw ?? "—",
    vendNbr: li.vendNbr ?? "—",
    lineVlaAuthNbr: li.lineVlaAuthNbr ?? "—",
    euAddrLoc: li.euAddrLoc ?? "—",
    euInfoReqFlg: li.euInfoReqFlg ?? "—",
    busRegnCd: li.busRegnCd ?? "—",
    custSpecHndlCd: li.custSpecHndlCd ?? "—",
    serialNbrFlg: li.serialNbrFlg ?? "—",
    svcAmt: li.svcAmt ?? 0,
    svcQty: li.svcQty ?? 0,
    htImiRejCd: li.htImiRejCd ?? "—",
    etaSrcCd: li.etaSrcCd ?? "—",
    htInitRejCd: li.htInitRejCd ?? "—",
    bidNbr: li.bidNbr ?? "—",
    bidVrsnNbr: li.bidVrsnNbr ?? "—",
    extVendPartNbr: li.extVendPartNbr ?? "—",
    origSpplPartNbr: li.origSpplPartNbr ?? "—",
    hermShipFrBrNbr: li.hermShipFrBrNbr ?? "—",
    hermUnitCostAmt: li.hermUnitCostAmt ?? 0,
    hermUnitPrcAmt: li.hermUnitPrcAmt ?? 0,
    hermLineTypeCd: li.hermLineTypeCd ?? "—",
    hermStusFlg: li.hermStusFlg ?? "—",
    imiRejCdDesc: li.imiRejCdDesc ?? "—",
    lineVmfInfoSw: li.lineVmfInfoSw ?? "—",
    futLinePromDt: li.futLinePromDt ?? "—",
    ctoUnitCostAmt: li.ctoUnitCostAmt ?? 0,
    ctoUnitPrcAmt: li.ctoUnitPrcAmt ?? 0,
    linkId: li.linkId ?? "—",
    euPpPrcAmt: li.euPpPrcAmt ?? 0,
    euPpPurDt: li.euPpPurDt ?? "—",
    termEndDt: li.termEndDt ?? "—",
    quoteLineInd: li.quoteLineInd ?? "—",
    vmfLneHldInd: li.vmfLneHldInd ?? "—",
    imiHoldCd: li.imiHoldCd ?? "—",
  }));

  const toStatusChangeRecord = (entry) => ({
    coCd: entry.coCd ?? entry.CO_CD ?? "—",
    ordrBrNbr: entry.ordrBrNbr ?? entry.ORDR_BR_NBR ?? "—",
    ordrNbr: entry.ordrNbr ?? entry.ORDR_NBR ?? "—",
    distNbr: entry.distNbr ?? entry.DIST_NBR ?? "—",
    shipNbr: entry.shipNbr ?? entry.SHIP_NBR ?? "—",
    ordrDt: entry.ordrDt ?? entry.ORDR_DT ?? "—",
    stusChgTypCd: entry.stusChgTypCd ?? entry.STUS_CHG_TYP_CD ?? "—",
    stusChgTs: entry.stusChgTs ?? entry.STUS_CHG_TS ?? "—",
    ordrLineNbr: entry.ordrLineNbr ?? entry.ORDR_LINE_NBR ?? "—",
    custBrNbr: entry.custBrNbr ?? entry.CUST_BR_NBR ?? "—",
    custNbr: entry.custNbr ?? entry.CUST_NBR ?? "—",
    webProcsFlg: entry.webProcsFlg ?? entry.WEB_PROCS_FLG ?? "—",
    tomcatProcsFlg: entry.tomcatProcsFlg ?? entry.TOMCAT_PROCS_FLG ?? "—",
    ordrChgStusCd: entry.ordrChgStusCd ?? entry.ORDR_CHG_STUS_CD ?? "—",
    configStusCd: entry.configStusCd ?? entry.CONFIG_STUS_CD ?? "—",
    aggregateId: entry.aggregateId ?? entry.AGGREGATE_ID ?? "—",
    prmsChgDt: entry.prmsChgDt ?? entry.PRMS_CHG_DT ?? "—",
    familyCd: entry.familyCd ?? entry.FAMILY_CD ?? "—",
    lstChgProgNam: entry.lstChgProgNam ?? entry.LST_CHG_PROG_NAM ?? "—",
    lstChgOperId: entry.lstChgOperId ?? entry.LST_CHG_OPER_ID ?? "—",
    updtRsnTxt: entry.updtRsnTxt ?? entry.UPDT_RSN_TXT ?? "—",
    evntRsnCd: entry.evntRsnCd ?? entry.EVNT_RSN_CD ?? "—",
    flrDnlQty: entry.flrDnlQty ?? entry.FLR_DNL_QTY ?? "—",
  });

  const rawStatusChanges =
    raw.statusChanges ?? raw.orderStatusChanges ?? raw.orOrderStusChgs ?? [];
  const statusChanges = Array.isArray(rawStatusChanges)
    ? rawStatusChanges
      .filter((entry) => entry && typeof entry === "object" && !Array.isArray(entry))
      .map((entry) => toStatusChangeRecord(entry))
    : [];

  const rawPartnerSetup =
    raw.partnerSetup ?? raw.partnerSetups ?? raw.partnerSetupDetails ?? raw.setupConfig ?? [];
  const setupConfig = Array.isArray(rawPartnerSetup)
    ? rawPartnerSetup.filter((entry) => entry && typeof entry === "object" && !Array.isArray(entry)).map(toPartnerSetupRecord)
    : rawPartnerSetup && typeof rawPartnerSetup === "object"
      ? [toPartnerSetupRecord(rawPartnerSetup)]
      : [];

  const rawInPoSw = raw.inPoSw ?? raw.ieInPoSw ?? raw.poSwitch ?? [];
  const inPoSw = Array.isArray(rawInPoSw)
    ? rawInPoSw
      .filter((entry) => entry && typeof entry === "object" && !Array.isArray(entry))
      .map((entry) => toInPoSwRecord(entry))
    : rawInPoSw && typeof rawInPoSw === "object"
      ? [toInPoSwRecord(rawInPoSw)]
      : [];

  const availableSections = ["orderHeader", "lineItems"];
  if (statusChanges.length > 0) availableSections.push("flowTrace");
  if (setupConfig.length > 0) availableSections.push("setupConfig");
  if (inPoSw.length > 0) availableSections.push("poSwitch");

  // Only these two sections have a real backend data source right now.
  // Flow Trace, Setup Validation, Datadog, and MQ still show "Not
  // available yet" placeholders in the UI — add their keys here once
  // their endpoints exist on the backend.
  return {
    order,
    lineItems,
    processingSteps: [],
    flowTrace: statusChanges,
    setupConfig,
    inPoSw,
    setupValidation: [],
    logs: [],
    datadogAlerts: [],
    mqQueues: [],
    _raw: raw,
    _meta: {
      availableSections,
    },
  };
}
