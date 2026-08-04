using System.Data.Odbc;
using ImpulseSupportTool_Repo;
using OrderManagement.API.Helpers;
namespace OrderManagement.API.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly IConfiguration _configuration;
        public OrderRepository(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public async Task<OrderResponse> GetOrder(OrderRequest request)
        {
            Console.WriteLine($">>> QUERY PARAMS: PoNumber='{request.PoNumber}' CountryCode='{request.CountryCode}'");

            // Resolve DB2 schema zone from country code (Z1/Z2/Z3/Z4)
            string zone = ZoneMapper.GetZone(request.CountryCode);
            Console.WriteLine($">>> RESOLVED ZONE: {zone} for CountryCode='{request.CountryCode}'");

            OrderResponse response = null;
            string password = _configuration["DB2:Password"];
            string connectionString = _configuration.GetConnectionString("DB2Connection");
            connectionString += $"PWD={password};";
            using OdbcConnection conn = new OdbcConnection(connectionString);
            await conn.OpenAsync();
            Console.WriteLine($">>> DB2 CONNECTION OPENED OK");

            // TRIM fixes trailing spaces in CHAR fixed-width columns
            string headerQuery = $@"
                SELECT
                    CUST_CO_CD, CUST_BR, CUST_NBR, CUST_SFX, CUST_PO_NBR, SDQ_SEQ_NBR,
                    CUST_PO_DT, CUST_PO_SEQ_NBR, TAG_NBR, RELS_TAG_NBR, PROCESS_UNIT_TS,
                    APPL_ID, XACT_SET, PARTNER_ID, CMB_BATCH_NBR, IMI_ASGD_BR_NBR,
                    IMI_ASGD_ORDR_NBR, ORDR_TYPE, ORDR_CCY_CD, SELLR_SALES_NBR,
                    ORDR_REQ_SHIP_DT, ORDR_REQ_DLVY_DT, ORDR_REQ_CANC_DT, ORIDE_CUST_PO_DT,
                    ORDR_ETA_DT, RESV_INV_SW, GOVT_PUB_PRIV_SW, GOVT_PGM_TYPE, CNSGN_SW,
                    SLA_CODE, IS_DELV_FLG, SPEC_LBL_CODE, PO_GOVT_TP, DEPT_NBR, BYR_LOC,
                    BYR_CNTACT, BYR_PHN_NBR, BYR_VNDR_NBR, XMIT_HASH_TOT, XMIT_TOT_LINES,
                    CFG_TYPE, CONT_NBR, LAB_TYPE, CONFIG_PO_TYPE, STATE_CD, ORD_ENTRY_DT_TS,
                    IMI_CARR_CODE, CUST_CARR_CODE, IMI_SHIP_VIA, COD_AMT, COD_FEE_SWTCH,
                    THRD_PTY_ACT, BO_ORIDE_SWTCH, BR_SEQ_VALU, DISTRB_DEPTH, MAX_XIT_DAYS,
                    AIR_BR_SEQ_FLG, BR_SEQ_FLG, MULT_BR_SEQ_FLG, EXPT_BR_SEQ_FLG,
                    SAVE_FRT_FLG, SAVE_DIST_FLG, SINGLE_WHSE, PRNT_ORDR_FLG, BASERATE_FLG,
                    MULT_DISTRB_FLG, NBR_OF_WHSE, ORDR_SHP_FR_BR, SHIP_FLG, ORDR_STATUS,
                    ORDR_REJ_FLG, DMD_BR, PROCESS_DT, PROCESS_TM, TERMS, CCY_RATE, DROP_MSG,
                    ORDR_HAS_ERRS, TAX_FLG, EU_NAME, EU_ATTN, EU_ADDR_1, EU_ADDR_2,
                    EU_ADDR_3, EU_ADDR_4, EU_CITY, EU_STATE, EU_ZIP, EU_CTRY, EU_TAX,
                    EU_CNTACT, EU_PHN_NBR, EU_PHN_NBR_EXT, EU_FAX_NBR, EU_EMAIL,
                    EU_RESALE_RSLR, EU_REF_NBR, ST_NAME, ST_ATTN, ST_ATTN_2, ST_PHONE_NBR,
                    ST_ADDR_1, ST_ADDR_2, ST_ADDR_3, ST_ADDR_4, ST_CITY, ST_STATE, ST_ZIP,
                    ST_CTRY, ST_PTNR_STORE_NBR, ST_IMI_ST_SUF, CUST_REF_NBR, CUST_REF_NBR2,
                    ORD_REF_NBR, ORD_RELS_NBR, BILL_TO_REF_NBR, IMI_REF_NBR,
                    END_CUST_ACT_NBR, END_CUST_ORD_NBR, END_CUST_PO_NBR, CUST_VDR_NBR,
                    END_CUST_REF_NBR, VLA_RLSD_FLG, VLA_RLSD_ID, VLA_RLSD_DT_TM,
                    VLA_ETA_DT, VLA_REJECT_REASON, VLA_EU_NBR, VLA_AUTH_NBR,
                    FRGHT_OUT_CODE, GOVT_SOLCTN_NBR, SPEC_FORM_SWTCH, ALL_LINES_CONFIG,
                    DB2_CRT_TS, VLA_TYPE, SPLIT_NAME_1, SPLIT_NAME_2, EO_EDI_CD,
                    BAD_ADDR_SWTCH, FULFIL_ORDER_FLG, PRE_PROCS_RPT, MAST_VEND_NBR,
                    RSLR_EMAIL, RSLR_FAX, RSLR_LOTUS_ID, IMI_BT_SUF, BUS_REGN_CD, HOLD_CD,
                    XDOCK_DIST_CTR, DV_FLG, EDD_FLG, VEND_QOT_NBR, ST_EMAIL,
                    CUSTIN_LIC_VLID_CD, RECALC_LIC_VLID_CD, CUST_FRT_FWRD_FLG,
                    IM_FRT_FWRD_FLG, SERVICE_IND, SERVICE_LEVEL, CARRIER_ACCOUNT,
                    FREIGHT_ORDER_NBR, HERM_PO_NBR, EU_DEP_ID, DEP_ORDR_NBR,
                    SHIP_TO_ATTN_FLG, CUST_DEL_STUS_FLG, ORDR_CIG_ID, ORDR_CUP_ID,
                    LN_FULFILL_SW, DPAS_TYPE_CD, DPAS_PGM_ID, VEND_AUTH_NBR,
                    FUT_ORDR_PROM_DT, PRC_CONCESSION_TXT, PREV_CONT_NBR, CONT_TYPE_CD,
                    TERM_ID, XEDI_RLSD_IND, QUOTE_NBR, XEDI_ACK_FLG, VMF_HDR_HLD_IND
                FROM {zone}.EO_ORDR_HDR_INFO
                WHERE TRIM(CUST_PO_NBR) = ? AND TRIM(CUST_CO_CD) = ?
                FETCH FIRST 10 ROWS ONLY";

            using (OdbcCommand cmd = new OdbcCommand(headerQuery, conn))
            {
                cmd.Parameters.Add("?", OdbcType.VarChar).Value = request.PoNumber.Trim();
                cmd.Parameters.Add("?", OdbcType.VarChar).Value = request.CountryCode.Trim();
                Console.WriteLine($">>> EXECUTING QUERY...");
                using OdbcDataReader reader = (OdbcDataReader)await cmd.ExecuteReaderAsync();
                Console.WriteLine($">>> READER HAS ROWS: {reader.HasRows}");
                if (await reader.ReadAsync())
                {
                    Console.WriteLine($">>> ROW FOUND - mapping response...");
                    response = new OrderResponse
                    {
                        CustCoCd = reader["CUST_CO_CD"]?.ToString()?.Trim(),
                        CustBr = reader["CUST_BR"]?.ToString()?.Trim(),
                        CustNbr = reader["CUST_NBR"]?.ToString()?.Trim(),
                        CustSfx = reader["CUST_SFX"]?.ToString()?.Trim(),
                        CustPoNbr = reader["CUST_PO_NBR"]?.ToString()?.Trim(),
                        SdqSeqNbr = reader["SDQ_SEQ_NBR"]?.ToString()?.Trim(),
                        CustPoDt = reader["CUST_PO_DT"]?.ToString()?.Trim(),
                        CustPoSeqNbr = reader["CUST_PO_SEQ_NBR"]?.ToString()?.Trim(),
                        TagNbr = reader["TAG_NBR"]?.ToString()?.Trim(),
                        RelsTagNbr = reader["RELS_TAG_NBR"]?.ToString()?.Trim(),
                        ProcessUnitTs = reader["PROCESS_UNIT_TS"]?.ToString()?.Trim(),
                        ApplId = reader["APPL_ID"]?.ToString()?.Trim(),
                        XactSet = reader["XACT_SET"]?.ToString()?.Trim(),
                        PartnerId = reader["PARTNER_ID"]?.ToString()?.Trim(),
                        CmbBtchNbr = reader["CMB_BATCH_NBR"]?.ToString()?.Trim(),
                        ImiAsgdBrNbr = reader["IMI_ASGD_BR_NBR"]?.ToString()?.Trim(),
                        ImiAsgdOrdrNbr = reader["IMI_ASGD_ORDR_NBR"]?.ToString()?.Trim(),
                        OrdrType = reader["ORDR_TYPE"]?.ToString()?.Trim(),
                        OrdrCcyCd = reader["ORDR_CCY_CD"]?.ToString()?.Trim(),
                        SellrSalesNbr = reader["SELLR_SALES_NBR"]?.ToString()?.Trim(),
                        OrdrReqShipDt = reader["ORDR_REQ_SHIP_DT"]?.ToString()?.Trim(),
                        OrdrReqDlvyDt = reader["ORDR_REQ_DLVY_DT"]?.ToString()?.Trim(),
                        OrdrReqCancDt = reader["ORDR_REQ_CANC_DT"]?.ToString()?.Trim(),
                        OrideCustPoDt = reader["ORIDE_CUST_PO_DT"]?.ToString()?.Trim(),
                        OrdrEtaDt = reader["ORDR_ETA_DT"]?.ToString()?.Trim(),
                        ResvInvSw = reader["RESV_INV_SW"]?.ToString()?.Trim(),
                        GovtPubPrivSw = reader["GOVT_PUB_PRIV_SW"]?.ToString()?.Trim(),
                        GovtPgmType = reader["GOVT_PGM_TYPE"]?.ToString()?.Trim(),
                        CnsgnSw = reader["CNSGN_SW"]?.ToString()?.Trim(),
                        SlaCode = reader["SLA_CODE"]?.ToString()?.Trim(),
                        IsDelvFlg = reader["IS_DELV_FLG"]?.ToString()?.Trim(),
                        SpecLblCode = reader["SPEC_LBL_CODE"]?.ToString()?.Trim(),
                        PoGovtTp = reader["PO_GOVT_TP"]?.ToString()?.Trim(),
                        DeptNbr = reader["DEPT_NBR"]?.ToString()?.Trim(),
                        ByrLoc = reader["BYR_LOC"]?.ToString()?.Trim(),
                        ByrCntact = reader["BYR_CNTACT"]?.ToString()?.Trim(),
                        ByrPhnNbr = reader["BYR_PHN_NBR"]?.ToString()?.Trim(),
                        ByrVndrNbr = reader["BYR_VNDR_NBR"]?.ToString()?.Trim(),
                        XmitHashTot = reader["XMIT_HASH_TOT"]?.ToString()?.Trim(),
                        XmitTotLines = reader["XMIT_TOT_LINES"]?.ToString()?.Trim(),
                        CfgType = reader["CFG_TYPE"]?.ToString()?.Trim(),
                        ContNbr = reader["CONT_NBR"]?.ToString()?.Trim(),
                        LabType = reader["LAB_TYPE"]?.ToString()?.Trim(),
                        ConfigPoType = reader["CONFIG_PO_TYPE"]?.ToString()?.Trim(),
                        StateCd = reader["STATE_CD"]?.ToString()?.Trim(),
                        OrdEntryDtTs = reader["ORD_ENTRY_DT_TS"]?.ToString()?.Trim(),
                        ImiCarCd = reader["IMI_CARR_CODE"]?.ToString()?.Trim(),
                        CustCarrCode = reader["CUST_CARR_CODE"]?.ToString()?.Trim(),
                        ImiShipVia = reader["IMI_SHIP_VIA"]?.ToString()?.Trim(),
                        CodAmt = ToDecimalSafe(reader["COD_AMT"]),
                        CodFeeSwtch = reader["COD_FEE_SWTCH"]?.ToString()?.Trim(),
                        ThrdPtyAct = reader["THRD_PTY_ACT"]?.ToString()?.Trim(),
                        BoOrideSwtch = reader["BO_ORIDE_SWTCH"]?.ToString()?.Trim(),
                        BrSeqValu = reader["BR_SEQ_VALU"]?.ToString()?.Trim(),
                        DistrbDepth = reader["DISTRB_DEPTH"]?.ToString()?.Trim(),
                        MaxXitDays = reader["MAX_XIT_DAYS"]?.ToString()?.Trim(),
                        AirBrSeqFlg = reader["AIR_BR_SEQ_FLG"]?.ToString()?.Trim(),
                        BrSeqFlg = reader["BR_SEQ_FLG"]?.ToString()?.Trim(),
                        MultBrSeqFlg = reader["MULT_BR_SEQ_FLG"]?.ToString()?.Trim(),
                        ExptBrSeqFlg = reader["EXPT_BR_SEQ_FLG"]?.ToString()?.Trim(),
                        SaveFrtFlg = reader["SAVE_FRT_FLG"]?.ToString()?.Trim(),
                        SaveDistFlg = reader["SAVE_DIST_FLG"]?.ToString()?.Trim(),
                        SingleWhse = reader["SINGLE_WHSE"]?.ToString()?.Trim(),
                        PrntOrdrFlg = reader["PRNT_ORDR_FLG"]?.ToString()?.Trim(),
                        BaserateFlg = reader["BASERATE_FLG"]?.ToString()?.Trim(),
                        MultDistrbFlg = reader["MULT_DISTRB_FLG"]?.ToString()?.Trim(),
                        NbrOfWhse = reader["NBR_OF_WHSE"]?.ToString()?.Trim(),
                        OrdShFr = reader["ORDR_SHP_FR_BR"]?.ToString()?.Trim(),
                        ShipFlg = reader["SHIP_FLG"]?.ToString()?.Trim(),
                        OrdSt = reader["ORDR_STATUS"]?.ToString()?.Trim(),
                        OrdrRejFlg = reader["ORDR_REJ_FLG"]?.ToString()?.Trim(),
                        DmdBr = reader["DMD_BR"]?.ToString()?.Trim(),
                        ProcessDt = reader["PROCESS_DT"]?.ToString()?.Trim(),
                        ProcessTm = reader["PROCESS_TM"]?.ToString()?.Trim(),
                        Terms = reader["TERMS"]?.ToString()?.Trim(),
                        CcyRate = ToDecimalSafe(reader["CCY_RATE"]),
                        DropMsg = reader["DROP_MSG"]?.ToString()?.Trim(),
                        OrdrHasErrs = reader["ORDR_HAS_ERRS"]?.ToString()?.Trim(),
                        TaxFlg = reader["TAX_FLG"]?.ToString()?.Trim(),
                        EuName = reader["EU_NAME"]?.ToString()?.Trim(),
                        EuAttn = reader["EU_ATTN"]?.ToString()?.Trim(),
                        EuAddr1 = reader["EU_ADDR_1"]?.ToString()?.Trim(),
                        EuAddr2 = reader["EU_ADDR_2"]?.ToString()?.Trim(),
                        EuAddr3 = reader["EU_ADDR_3"]?.ToString()?.Trim(),
                        EuAddr4 = reader["EU_ADDR_4"]?.ToString()?.Trim(),
                        EuCity = reader["EU_CITY"]?.ToString()?.Trim(),
                        EuState = reader["EU_STATE"]?.ToString()?.Trim(),
                        EuZip = reader["EU_ZIP"]?.ToString()?.Trim(),
                        EuCtry = reader["EU_CTRY"]?.ToString()?.Trim(),
                        EuTax = reader["EU_TAX"]?.ToString()?.Trim(),
                        EuCntact = reader["EU_CNTACT"]?.ToString()?.Trim(),
                        EuPhnNbr = reader["EU_PHN_NBR"]?.ToString()?.Trim(),
                        EuPhnNbrExt = reader["EU_PHN_NBR_EXT"]?.ToString()?.Trim(),
                        EuFaxNbr = reader["EU_FAX_NBR"]?.ToString()?.Trim(),
                        EuEmail = reader["EU_EMAIL"]?.ToString()?.Trim(),
                        EuResaleRslr = reader["EU_RESALE_RSLR"]?.ToString()?.Trim(),
                        EuRefNbr = reader["EU_REF_NBR"]?.ToString()?.Trim(),
                        StName = reader["ST_NAME"]?.ToString()?.Trim(),
                        StAttn = reader["ST_ATTN"]?.ToString()?.Trim(),
                        StAttn2 = reader["ST_ATTN_2"]?.ToString()?.Trim(),
                        StPhoneNbr = reader["ST_PHONE_NBR"]?.ToString()?.Trim(),
                        StAddr1 = reader["ST_ADDR_1"]?.ToString()?.Trim(),
                        StAddr2 = reader["ST_ADDR_2"]?.ToString()?.Trim(),
                        StAddr3 = reader["ST_ADDR_3"]?.ToString()?.Trim(),
                        StAddr4 = reader["ST_ADDR_4"]?.ToString()?.Trim(),
                        StCity = reader["ST_CITY"]?.ToString()?.Trim(),
                        StState = reader["ST_STATE"]?.ToString()?.Trim(),
                        StZip = reader["ST_ZIP"]?.ToString()?.Trim(),
                        StCtry = reader["ST_CTRY"]?.ToString()?.Trim(),
                        StPtnrStoreNbr = reader["ST_PTNR_STORE_NBR"]?.ToString()?.Trim(),
                        StImiStSuf = reader["ST_IMI_ST_SUF"]?.ToString()?.Trim(),
                        CustRefNbr = reader["CUST_REF_NBR"]?.ToString()?.Trim(),
                        CustRefNbr2 = reader["CUST_REF_NBR2"]?.ToString()?.Trim(),
                        OrdRefNbr = reader["ORD_REF_NBR"]?.ToString()?.Trim(),
                        OrdRelsNbr = reader["ORD_RELS_NBR"]?.ToString()?.Trim(),
                        BillToRefNbr = reader["BILL_TO_REF_NBR"]?.ToString()?.Trim(),
                        ImiRefNbr = reader["IMI_REF_NBR"]?.ToString()?.Trim(),
                        EndCustActNbr = reader["END_CUST_ACT_NBR"]?.ToString()?.Trim(),
                        EndCustOrdNbr = reader["END_CUST_ORD_NBR"]?.ToString()?.Trim(),
                        EndCustPoNbr = reader["END_CUST_PO_NBR"]?.ToString()?.Trim(),
                        CustVdrNbr = reader["CUST_VDR_NBR"]?.ToString()?.Trim(),
                        EndCustRefNbr = reader["END_CUST_REF_NBR"]?.ToString()?.Trim(),
                        VlaRlsdFlg = reader["VLA_RLSD_FLG"]?.ToString()?.Trim(),
                        VlaRlsdId = reader["VLA_RLSD_ID"]?.ToString()?.Trim(),
                        VlaRlsdDtTm = reader["VLA_RLSD_DT_TM"]?.ToString()?.Trim(),
                        VlaEtaDt = reader["VLA_ETA_DT"]?.ToString()?.Trim(),
                        VlaRejectReason = reader["VLA_REJECT_REASON"]?.ToString()?.Trim(),
                        VlaEuNbr = reader["VLA_EU_NBR"]?.ToString()?.Trim(),
                        VlaAuthNbr = reader["VLA_AUTH_NBR"]?.ToString()?.Trim(),
                        FrghtOutCode = reader["FRGHT_OUT_CODE"]?.ToString()?.Trim(),
                        GovtSolctnNbr = reader["GOVT_SOLCTN_NBR"]?.ToString()?.Trim(),
                        SpecFormSwtch = reader["SPEC_FORM_SWTCH"]?.ToString()?.Trim(),
                        AllLinesConfig = reader["ALL_LINES_CONFIG"]?.ToString()?.Trim(),
                        Db2CrtTs = reader["DB2_CRT_TS"]?.ToString()?.Trim(),
                        VlaType = reader["VLA_TYPE"]?.ToString()?.Trim(),
                        SplitName1 = reader["SPLIT_NAME_1"]?.ToString()?.Trim(),
                        SplitName2 = reader["SPLIT_NAME_2"]?.ToString()?.Trim(),
                        EoEdiCd = reader["EO_EDI_CD"]?.ToString()?.Trim(),
                        BadAddrSwtch = reader["BAD_ADDR_SWTCH"]?.ToString()?.Trim(),
                        FulfilOrderFlg = reader["FULFIL_ORDER_FLG"]?.ToString()?.Trim(),
                        PreProcsRpt = reader["PRE_PROCS_RPT"]?.ToString()?.Trim(),
                        MastVendNbr = reader["MAST_VEND_NBR"]?.ToString()?.Trim(),
                        RslrEmail = reader["RSLR_EMAIL"]?.ToString()?.Trim(),
                        RslrFax = reader["RSLR_FAX"]?.ToString()?.Trim(),
                        RslrLotusId = reader["RSLR_LOTUS_ID"]?.ToString()?.Trim(),
                        ImiBtSuf = reader["IMI_BT_SUF"]?.ToString()?.Trim(),
                        BusRegnCd = reader["BUS_REGN_CD"]?.ToString()?.Trim(),
                        HoldCd = reader["HOLD_CD"]?.ToString()?.Trim(),
                        XdockDistCtr = reader["XDOCK_DIST_CTR"]?.ToString()?.Trim(),
                        DvFlg = reader["DV_FLG"]?.ToString()?.Trim(),
                        EddFlg = reader["EDD_FLG"]?.ToString()?.Trim(),
                        VendQotNbr = reader["VEND_QOT_NBR"]?.ToString()?.Trim(),
                        StEmail = reader["ST_EMAIL"]?.ToString()?.Trim(),
                        CustinLicVlidCd = reader["CUSTIN_LIC_VLID_CD"]?.ToString()?.Trim(),
                        RecalcLicVlidCd = reader["RECALC_LIC_VLID_CD"]?.ToString()?.Trim(),
                        CustFrtFwrdFlg = reader["CUST_FRT_FWRD_FLG"]?.ToString()?.Trim(),
                        ImFrtFwrdFlg = reader["IM_FRT_FWRD_FLG"]?.ToString()?.Trim(),
                        ServiceInd = reader["SERVICE_IND"]?.ToString()?.Trim(),
                        ServiceLevel = reader["SERVICE_LEVEL"]?.ToString()?.Trim(),
                        CarrierAccount = reader["CARRIER_ACCOUNT"]?.ToString()?.Trim(),
                        FreightOrderNbr = reader["FREIGHT_ORDER_NBR"]?.ToString()?.Trim(),
                        HermPoNbr = reader["HERM_PO_NBR"]?.ToString()?.Trim(),
                        EuDepId = reader["EU_DEP_ID"]?.ToString()?.Trim(),
                        DepOrdrNbr = reader["DEP_ORDR_NBR"]?.ToString()?.Trim(),
                        ShipToAttnFlg = reader["SHIP_TO_ATTN_FLG"]?.ToString()?.Trim(),
                        CustDelStusFlg = reader["CUST_DEL_STUS_FLG"]?.ToString()?.Trim(),
                        OrdrCigId = reader["ORDR_CIG_ID"]?.ToString()?.Trim(),
                        OrdrCupId = reader["ORDR_CUP_ID"]?.ToString()?.Trim(),
                        LnFulfillSw = reader["LN_FULFILL_SW"]?.ToString()?.Trim(),
                        DpasTypeCd = reader["DPAS_TYPE_CD"]?.ToString()?.Trim(),
                        DpasPgmId = reader["DPAS_PGM_ID"]?.ToString()?.Trim(),
                        VendAuthNbr = reader["VEND_AUTH_NBR"]?.ToString()?.Trim(),
                        FutOrdrPromDt = reader["FUT_ORDR_PROM_DT"]?.ToString()?.Trim(),
                        PrcConcessionTxt = reader["PRC_CONCESSION_TXT"]?.ToString()?.Trim(),
                        PrevContNbr = reader["PREV_CONT_NBR"]?.ToString()?.Trim(),
                        ContTypeCd = reader["CONT_TYPE_CD"]?.ToString()?.Trim(),
                        TermId = reader["TERM_ID"]?.ToString()?.Trim(),
                        XediRlsdInd = reader["XEDI_RLSD_IND"]?.ToString()?.Trim(),
                        QuoteNbr = reader["QUOTE_NBR"]?.ToString()?.Trim(),
                        XediAckFlg = reader["XEDI_ACK_FLG"]?.ToString()?.Trim(),
                        VmfHdrHldInd = reader["VMF_HDR_HLD_IND"]?.ToString()?.Trim(),
                    };
                }
            } // reader/cmd disposed here so we can reuse conn safely

            Console.WriteLine($">>> RESULT: {(response == null ? "NULL - no data found" : "SUCCESS - data returned")}");

            if (response == null)
                return null; // no header = no point querying line items, status changes

            // ---- Line item query ----
            string lineQuery = $@"
                SELECT
                    CUST_CO_CD,
                    CUST_BR,
                    CUST_NBR,
                    CUST_SFX,
                    CUST_PO_NBR,
                    SDQ_SEQ_NBR,
                    CUST_PO_DT,
                    CUST_PO_SEQ_NBR,
                    LINE_SEQ_NBR,
                    PRTNR_LINE_NBR,
                    IMI_LINE_NBR,
                    IMI_PART_NBR,
                    CUST_PART_NBR,
                    MFCTR_PART_NBR,
                    UPC_PART_NBR,
                    QTY_ORDERED,
                    CUST_QOTD_PRC,
                    CS_PK_QTY,
                    CUST_PART_DESC_1,
                    CUST_PART_DESC_2,
                    RSV_INVTY_FLG,
                    IMI_PART_DESC_1,
                    IMI_PART_DESC_2,
                    PRC_USE_FLG,
                    LINE_REQ_DLVY_DT,
                    LINE_REQ_SHIP_DT,
                    LINE_REQ_CANC_DT,
                    LINE_BO_FLG,
                    AGGR_CD,
                    MISC_CHRG_SKU,
                    ASSET_TAG_FLG,
                    OPRT_SYS,
                    DLVY_MTHD,
                    LAB_TYPE,
                    QTY_PER_CONFIG,
                    CONFIG_QTY,
                    ITEM_TYPE_IND,
                    QTY_ALLOC,
                    END_USER_PRC,
                    IMI_REJ_CD,
                    ACPT_REJ_FLG,
                    MISC_CD,
                    LINE_TYPE_SW,
                    QTY_BO,
                    UNIT_PRC,
                    RTL_PRC,
                    FRGN_UNIT_PRC,
                    SUB_PART_NBR,
                    ETA,
                    FREE_ITEM_SW,
                    VEND_NBR,
                    LINE_VLA_AUTH_NBR,
                    EU_ADDR_LOC,
                    EU_INFO_REQ_FLG,
                    BUS_REGN_CD,
                    CUST_SPEC_HNDL_CD,
                    SERIAL_NBR_FLG,
                    SVC_AMT,
                    SVC_QTY,
                    HT_IMI_REJ_CD,
                    ETA_SRC_CD,
                    HT_INIT_REJ_CD,
                    BID_NBR,
                    BID_VRSN_NBR,
                    EXT_VEND_PART_NBR,
                    ORIG_SPPL_PART_NBR,
                    HERM_SHIP_FR_BR_NBR,
                    HERM_UNIT_COST_AMT,
                    HERM_UNIT_PRC_AMT,
                    HERM_LINE_TYPE_CD,
                    HERM_STUS_FLG,
                    IMI_REJ_CD_DESC,
                    LINE_VMF_INFO_SW,
                    FUT_LINE_PROM_DT,
                    CTO_UNIT_COST_AMT,
                    CTO_UNIT_PRC_AMT,
                    LINK_ID,
                    EU_PP_PRC_AMT,
                    EU_PP_PUR_DT,
                    TERM_END_DT,
                    QUOTE_LINE_IND,
                    VMF_LNE_HLD_IND,
                    IMI_HOLD_CD
                FROM {zone}.EO_LINE_INFO
                WHERE TRIM(CUST_PO_NBR) = ? AND TRIM(CUST_CO_CD) = ?
                ORDER BY LINE_SEQ_NBR";

            using (OdbcCommand lineCmd = new OdbcCommand(lineQuery, conn))
            {
                lineCmd.Parameters.Add("?", OdbcType.VarChar).Value = request.PoNumber.Trim();
                lineCmd.Parameters.Add("?", OdbcType.VarChar).Value = request.CountryCode.Trim();
                Console.WriteLine($">>> EXECUTING LINE ITEM QUERY...");
                using OdbcDataReader lineReader = (OdbcDataReader)await lineCmd.ExecuteReaderAsync();
                Console.WriteLine($">>> LINE READER HAS ROWS: {lineReader.HasRows}");
                while (await lineReader.ReadAsync())
                {
                    response.LineItems.Add(new OrderLineItem
                    {
                        CustCoCd = lineReader["CUST_CO_CD"]?.ToString()?.Trim(),
                        CustBr = lineReader["CUST_BR"]?.ToString()?.Trim(),
                        CustNbr = lineReader["CUST_NBR"]?.ToString()?.Trim(),
                        CustSfx = lineReader["CUST_SFX"]?.ToString()?.Trim(),
                        CustPoNbr = lineReader["CUST_PO_NBR"]?.ToString()?.Trim(),
                        SdqSeqNbr = lineReader["SDQ_SEQ_NBR"]?.ToString()?.Trim(),
                        CustPoDt = lineReader["CUST_PO_DT"]?.ToString()?.Trim(),
                        CustPoSeqNbr = lineReader["CUST_PO_SEQ_NBR"]?.ToString()?.Trim(),
                        LineSeqNbr = lineReader["LINE_SEQ_NBR"]?.ToString()?.Trim(),
                        PrtnrLineNbr = lineReader["PRTNR_LINE_NBR"]?.ToString()?.Trim(),
                        ImiLineNbr = lineReader["IMI_LINE_NBR"]?.ToString()?.Trim(),
                        ImiPartNbr = lineReader["IMI_PART_NBR"]?.ToString()?.Trim(),
                        CustPartNbr = lineReader["CUST_PART_NBR"]?.ToString()?.Trim(),
                        MfctrPartNbr = lineReader["MFCTR_PART_NBR"]?.ToString()?.Trim(),
                        UpcPartNbr = lineReader["UPC_PART_NBR"]?.ToString()?.Trim(),
                        QtyOrdered = ToDecimalSafe(lineReader["QTY_ORDERED"]),
                        CustQotdPrc = ToDecimalSafe(lineReader["CUST_QOTD_PRC"]),
                        CsPkQty = ToDecimalSafe(lineReader["CS_PK_QTY"]),
                        CustPartDesc1 = lineReader["CUST_PART_DESC_1"]?.ToString()?.Trim(),
                        CustPartDesc2 = lineReader["CUST_PART_DESC_2"]?.ToString()?.Trim(),
                        RsvInvtyFlg = lineReader["RSV_INVTY_FLG"]?.ToString()?.Trim(),
                        ImiPartDesc1 = lineReader["IMI_PART_DESC_1"]?.ToString()?.Trim(),
                        ImiPartDesc2 = lineReader["IMI_PART_DESC_2"]?.ToString()?.Trim(),
                        PrcUseFlg = lineReader["PRC_USE_FLG"]?.ToString()?.Trim(),
                        LineReqDlvyDt = lineReader["LINE_REQ_DLVY_DT"]?.ToString()?.Trim(),
                        LineReqShipDt = lineReader["LINE_REQ_SHIP_DT"]?.ToString()?.Trim(),
                        LineReqCancDt = lineReader["LINE_REQ_CANC_DT"]?.ToString()?.Trim(),
                        LineBoFlg = lineReader["LINE_BO_FLG"]?.ToString()?.Trim(),
                        AggrCd = lineReader["AGGR_CD"]?.ToString()?.Trim(),
                        MiscChrgSku = lineReader["MISC_CHRG_SKU"]?.ToString()?.Trim(),
                        AssetTagFlg = lineReader["ASSET_TAG_FLG"]?.ToString()?.Trim(),
                        OprtSys = lineReader["OPRT_SYS"]?.ToString()?.Trim(),
                        DlvyMthd = lineReader["DLVY_MTHD"]?.ToString()?.Trim(),
                        LabType = lineReader["LAB_TYPE"]?.ToString()?.Trim(),
                        QtyPerConfig = ToDecimalSafe(lineReader["QTY_PER_CONFIG"]),
                        ConfigQty = ToDecimalSafe(lineReader["CONFIG_QTY"]),
                        ItemTypeInd = lineReader["ITEM_TYPE_IND"]?.ToString()?.Trim(),
                        QtyAlloc = ToDecimalSafe(lineReader["QTY_ALLOC"]),
                        EndUserPrc = ToDecimalSafe(lineReader["END_USER_PRC"]),
                        ImiRejCd = lineReader["IMI_REJ_CD"]?.ToString()?.Trim(),
                        AcptRejFlg = lineReader["ACPT_REJ_FLG"]?.ToString()?.Trim(),
                        MiscCd = lineReader["MISC_CD"]?.ToString()?.Trim(),
                        LineTypeSw = lineReader["LINE_TYPE_SW"]?.ToString()?.Trim(),
                        QtyBo = ToDecimalSafe(lineReader["QTY_BO"]),
                        UnitPrc = ToDecimalSafe(lineReader["UNIT_PRC"]),
                        RtlPrc = ToDecimalSafe(lineReader["RTL_PRC"]),
                        FrgnUnitPrc = ToDecimalSafe(lineReader["FRGN_UNIT_PRC"]),
                        SubPartNbr = lineReader["SUB_PART_NBR"]?.ToString()?.Trim(),
                        Eta = lineReader["ETA"]?.ToString()?.Trim(),
                        FreeItemSw = lineReader["FREE_ITEM_SW"]?.ToString()?.Trim(),
                        VendNbr = lineReader["VEND_NBR"]?.ToString()?.Trim(),
                        LineVlaAuthNbr = lineReader["LINE_VLA_AUTH_NBR"]?.ToString()?.Trim(),
                        EuAddrLoc = lineReader["EU_ADDR_LOC"]?.ToString()?.Trim(),
                        EuInfoReqFlg = lineReader["EU_INFO_REQ_FLG"]?.ToString()?.Trim(),
                        BusRegnCd = lineReader["BUS_REGN_CD"]?.ToString()?.Trim(),
                        CustSpecHndlCd = lineReader["CUST_SPEC_HNDL_CD"]?.ToString()?.Trim(),
                        SerialNbrFlg = lineReader["SERIAL_NBR_FLG"]?.ToString()?.Trim(),
                        SvcAmt = ToDecimalSafe(lineReader["SVC_AMT"]),
                        SvcQty = ToDecimalSafe(lineReader["SVC_QTY"]),
                        HtImiRejCd = lineReader["HT_IMI_REJ_CD"]?.ToString()?.Trim(),
                        EtaSrcCd = lineReader["ETA_SRC_CD"]?.ToString()?.Trim(),
                        HtInitRejCd = lineReader["HT_INIT_REJ_CD"]?.ToString()?.Trim(),
                        BidNbr = lineReader["BID_NBR"]?.ToString()?.Trim(),
                        BidVrsnNbr = lineReader["BID_VRSN_NBR"]?.ToString()?.Trim(),
                        ExtVendPartNbr = lineReader["EXT_VEND_PART_NBR"]?.ToString()?.Trim(),
                        OrigSpplPartNbr = lineReader["ORIG_SPPL_PART_NBR"]?.ToString()?.Trim(),
                        HermShipFrBrNbr = lineReader["HERM_SHIP_FR_BR_NBR"]?.ToString()?.Trim(),
                        HermUnitCostAmt = ToDecimalSafe(lineReader["HERM_UNIT_COST_AMT"]),
                        HermUnitPrcAmt = ToDecimalSafe(lineReader["HERM_UNIT_PRC_AMT"]),
                        HermLineTypeCd = lineReader["HERM_LINE_TYPE_CD"]?.ToString()?.Trim(),
                        HermStusFlg = lineReader["HERM_STUS_FLG"]?.ToString()?.Trim(),
                        ImiRejCdDesc = lineReader["IMI_REJ_CD_DESC"]?.ToString()?.Trim(),
                        LineVmfInfoSw = lineReader["LINE_VMF_INFO_SW"]?.ToString()?.Trim(),
                        FutLinePromDt = lineReader["FUT_LINE_PROM_DT"]?.ToString()?.Trim(),
                        CtoUnitCostAmt = ToDecimalSafe(lineReader["CTO_UNIT_COST_AMT"]),
                        CtoUnitPrcAmt = ToDecimalSafe(lineReader["CTO_UNIT_PRC_AMT"]),
                        LinkId = lineReader["LINK_ID"]?.ToString()?.Trim(),
                        EuPpPrcAmt = ToDecimalSafe(lineReader["EU_PP_PRC_AMT"]),
                        EuPpPurDt = lineReader["EU_PP_PUR_DT"]?.ToString()?.Trim(),
                        TermEndDt = lineReader["TERM_END_DT"]?.ToString()?.Trim(),
                        QuoteLineInd = lineReader["QUOTE_LINE_IND"]?.ToString()?.Trim(),
                        VmfLneHldInd = lineReader["VMF_LNE_HLD_IND"]?.ToString()?.Trim(),
                        ImiHoldCd = lineReader["IMI_HOLD_CD"]?.ToString()?.Trim(),
                    });
                }
            }

            Console.WriteLine($">>> LINE ITEMS FOUND: {response.LineItems.Count}");

            // ---- Order status changes query (NEW) ----
            // Keys reused from the header response we already mapped above (NOT from the incoming request):
            //   response.CustCoCd       -> CO_CD
            //   response.ImiAsgdBrNbr   -> ORDR_BR_NBR  (this table also has a separate CUST_BR_NBR, so ORDR_BR_NBR
            //                                             is the IMI-assigned branch, matching ImiAsgdBrNbr)
            //   response.ImiAsgdOrdrNbr -> ORDR_NBR      (this table also has a separate CUST_NBR, confirming
            //                                             ORDR_NBR is the IMI-assigned order number)
            string statusQuery = $@"
                SELECT
                    CO_CD,
                    ORDR_BR_NBR,
                    ORDR_NBR,
                    DIST_NBR,
                    SHIP_NBR,
                    ORDR_DT,
                    STUS_CHG_TYP_CD,
                    STUS_CHG_TS,
                    ORDR_LINE_NBR,
                    CUST_BR_NBR,
                    CUST_NBR,
                    WEB_PROCS_FLG,
                    TOMCAT_PROCS_FLG,
                    ORDR_CHG_STUS_CD,
                    CONFIG_STUS_CD,
                    AGGREGATE_ID,
                    PRMS_CHG_DT,
                    FAMILY_CD,
                    LST_CHG_PROG_NAM,
                    LST_CHG_OPER_ID,
                    UPDT_RSN_TXT,
                    EVNT_RSN_CD,
                    FLR_DNL_QTY
                FROM {zone}.OR_ORDER_STUS_CHGS
                WHERE CO_CD = ? AND ORDR_BR_NBR = ? AND ORDR_NBR = ?
                ORDER BY STUS_CHG_TS";
            // NOTE: no TRIM() around the columns here. TRIM(col) = ? prevents DB2 from
            // using any index on CO_CD/ORDR_BR_NBR/ORDR_NBR, forcing a full table scan
            // on what looks like a large status-history table. That scan running long
            // enough is almost certainly what tripped the SQL30081N/08001 "comms error" -
            // it's a timeout, not an actual dropped connection. CHAR-column comparisons in
            // DB2 are space-padded automatically, so plain equality against a trimmed C#
            // string still matches correctly without needing TRIM() in the SQL.

            try
            {
                // Use a dedicated connection for this query. If the shared connection
                // was dropped by a firewall/idle timeout after the earlier queries,
                // reusing it here would just throw the same comms error again.
                using OdbcConnection statusConn = new OdbcConnection(connectionString);
                await statusConn.OpenAsync();

                using OdbcCommand statusCmd = new OdbcCommand(statusQuery, statusConn);
                // Bound as fixed-width Char (matching the DB2 CHAR column type) rather than
                // VarChar, to avoid an implicit cast that can also block index usage.
                // Adjust the lengths below to match the actual column widths.
                statusCmd.Parameters.Add("?", OdbcType.Char, 2).Value = response.CustCoCd?.Trim();
                statusCmd.Parameters.Add("?", OdbcType.Char, 4).Value = response.ImiAsgdBrNbr?.Trim();
                statusCmd.Parameters.Add("?", OdbcType.Char, 10).Value = response.ImiAsgdOrdrNbr?.Trim();
                Console.WriteLine($">>> EXECUTING STATUS CHANGE QUERY...");
                using OdbcDataReader statusReader = (OdbcDataReader)await statusCmd.ExecuteReaderAsync();
                Console.WriteLine($">>> STATUS READER HAS ROWS: {statusReader.HasRows}");
                while (await statusReader.ReadAsync())
                {
                    response.StatusChanges.Add(new OrderStatusChange
                    {
                        CoCd = statusReader["CO_CD"]?.ToString()?.Trim(),
                        OrdrBrNbr = statusReader["ORDR_BR_NBR"]?.ToString()?.Trim(),
                        OrdrNbr = statusReader["ORDR_NBR"]?.ToString()?.Trim(),
                        DistNbr = statusReader["DIST_NBR"]?.ToString()?.Trim(),
                        ShipNbr = statusReader["SHIP_NBR"]?.ToString()?.Trim(),
                        OrdrDt = statusReader["ORDR_DT"]?.ToString()?.Trim(),
                        StusChgTypCd = statusReader["STUS_CHG_TYP_CD"]?.ToString()?.Trim(),
                        StusChgTs = statusReader["STUS_CHG_TS"]?.ToString()?.Trim(),
                        OrdrLineNbr = statusReader["ORDR_LINE_NBR"]?.ToString()?.Trim(),
                        CustBrNbr = statusReader["CUST_BR_NBR"]?.ToString()?.Trim(),
                        CustNbr = statusReader["CUST_NBR"]?.ToString()?.Trim(),
                        WebProcsFlg = statusReader["WEB_PROCS_FLG"]?.ToString()?.Trim(),
                        TomcatProcsFlg = statusReader["TOMCAT_PROCS_FLG"]?.ToString()?.Trim(),
                        OrdrChgStusCd = statusReader["ORDR_CHG_STUS_CD"]?.ToString()?.Trim(),
                        ConfigStusCd = statusReader["CONFIG_STUS_CD"]?.ToString()?.Trim(),
                        AggregateId = statusReader["AGGREGATE_ID"]?.ToString()?.Trim(),
                        PrmsChgDt = statusReader["PRMS_CHG_DT"]?.ToString()?.Trim(),
                        FamilyCd = statusReader["FAMILY_CD"]?.ToString()?.Trim(),
                        LstChgProgNam = statusReader["LST_CHG_PROG_NAM"]?.ToString()?.Trim(),
                        LstChgOperId = statusReader["LST_CHG_OPER_ID"]?.ToString()?.Trim(),
                        UpdtRsnTxt = statusReader["UPDT_RSN_TXT"]?.ToString()?.Trim(),
                        EvntRsnCd = statusReader["EVNT_RSN_CD"]?.ToString()?.Trim(),
                        FlrDnlQty = ToDecimalSafe(statusReader["FLR_DNL_QTY"]),
                    });
                }
            }
            catch (OdbcException ex)
            {
                // Don't let a status-history failure (comms drop, missing grant, etc.)
                // take down the whole GetOrder response — header + lines are still valid.
                Console.WriteLine($">>> STATUS CHANGE QUERY FAILED: {ex.Message}");
            }

            Console.WriteLine($">>> STATUS CHANGES FOUND: {response.StatusChanges.Count}");

            // ---- Partner setup query (NEW) ----
            // Keys reused from the already-mapped header response (NOT from the incoming request):
            //   response.CustCoCd  -> CO_CD
            //   response.PartnerId -> PARTNER_ID
            // No TRIM() on the WHERE columns and Char (not VarChar) parameter binding, same as the
            // fix applied to the status query above - TRIM(col) = ? blocks index usage on DB2 and
            // can turn a quick indexed lookup into a full table scan, which is what caused the
            // earlier SQL30081N/08001 comms-timeout issue on OR_ORDER_STUS_CHGS.
            string partnerQuery = $@"
        SELECT
            CO_CD,
            PARTNER_ID,
            PARTNER_TYPE_CD,
            SRCE_SYS_ID,
            SRCE_SYS_KEY_ID,
            FORMAT_ID,
            DIR_FLG_CD,
            DOC_ID,
            FREQ_ID,
            DATA_STORE_MECH_ID,
            COMMU_ID,
            INTERNET_ADDR_TXT,
            ACTV_DT,
            DEACTV_DT,
            HOLD_CD,
            SETUP_NOTES_TXT,
            SEND_THRU_ID,
            LST_CHG_TS,
            LST_CHG_NAM,
            PRCS_OPTN_FLG,
            CYCLE_INTVL,
            CYCLE_LST_RUN_TS,
            BATCH_SPLIT_CNT,
            CYC_STRT_TM
        FROM {zone}.IE_PARTNER_SETUP
        WHERE CO_CD = ? AND PARTNER_ID = ?";

            // Convert incoming country/company code for Partner Setup lookup
            string partnerCoCd = response.CustCoCd?.Trim() switch
            {
                "MD" => "US",
                "FT" => "CA",
                _ => response.CustCoCd?.Trim()
            };

            Console.WriteLine(
                $">>> PARTNER SETUP CO_CD: Incoming={response.CustCoCd}, QueryValue={partnerCoCd}"
            );

            try
            {
                using OdbcConnection partnerConn = new OdbcConnection(connectionString);
                await partnerConn.OpenAsync();

                using OdbcCommand partnerCmd = new OdbcCommand(partnerQuery, partnerConn);

                // First ? = CO_CD
                partnerCmd.Parameters.Add("?", OdbcType.Char, 2).Value = partnerCoCd;

                // Second ? = PARTNER_ID
                partnerCmd.Parameters.Add("?", OdbcType.Char, 15).Value =
                    response.PartnerId?.Trim();

                Console.WriteLine($">>> EXECUTING PARTNER SETUP QUERY...");
                Console.WriteLine($">>> PARTNER CO_CD PARAMETER: {partnerCoCd}");
                Console.WriteLine($">>> PARTNER ID PARAMETER: {response.PartnerId?.Trim()}");

                using OdbcDataReader partnerReader =
                    (OdbcDataReader)await partnerCmd.ExecuteReaderAsync();

                Console.WriteLine(
                    $">>> PARTNER READER HAS ROWS: {partnerReader.HasRows}"
                );

                if (await partnerReader.ReadAsync())
                {
                    response.PartnerSetup.Add(new OrderPartnerSetup
                    {
                        CoCd = partnerReader["CO_CD"]?.ToString()?.Trim(),
                        PartnerId = partnerReader["PARTNER_ID"]?.ToString()?.Trim(),
                        PartnerTypeCd = partnerReader["PARTNER_TYPE_CD"]?.ToString()?.Trim(),
                        SrceSysId = partnerReader["SRCE_SYS_ID"]?.ToString()?.Trim(),
                        SrceSysKeyId = partnerReader["SRCE_SYS_KEY_ID"]?.ToString()?.Trim(),
                        FormatId = partnerReader["FORMAT_ID"]?.ToString()?.Trim(),
                        DirFlgCd = partnerReader["DIR_FLG_CD"]?.ToString()?.Trim(),
                        DocId = partnerReader["DOC_ID"]?.ToString()?.Trim(),
                        FreqId = partnerReader["FREQ_ID"]?.ToString()?.Trim(),
                        DataStoreMechId = partnerReader["DATA_STORE_MECH_ID"]?.ToString()?.Trim(),
                        CommuId = partnerReader["COMMU_ID"]?.ToString()?.Trim(),
                        InternetAddrTxt = partnerReader["INTERNET_ADDR_TXT"]?.ToString()?.Trim(),
                        ActvDt = partnerReader["ACTV_DT"]?.ToString()?.Trim(),
                        DeactvDt = partnerReader["DEACTV_DT"]?.ToString()?.Trim(),
                        HoldCd = partnerReader["HOLD_CD"]?.ToString()?.Trim(),
                        SetupNotesTxt = partnerReader["SETUP_NOTES_TXT"]?.ToString()?.Trim(),
                        SendThruId = partnerReader["SEND_THRU_ID"]?.ToString()?.Trim(),
                        LstChgTs = partnerReader["LST_CHG_TS"]?.ToString()?.Trim(),
                        LstChgNam = partnerReader["LST_CHG_NAM"]?.ToString()?.Trim(),
                        PrcsOptnFlg = partnerReader["PRCS_OPTN_FLG"]?.ToString()?.Trim(),
                        CycleIntvl = partnerReader["CYCLE_INTVL"]?.ToString()?.Trim(),
                        CycleLstRunTs = partnerReader["CYCLE_LST_RUN_TS"]?.ToString()?.Trim(),
                        BatchSplitCnt = partnerReader["BATCH_SPLIT_CNT"]?.ToString()?.Trim(),
                        CycStrtTm = partnerReader["CYC_STRT_TM"]?.ToString()?.Trim(),
                    });
                }
            }
            catch (OdbcException ex)
            {
                Console.WriteLine(
                    $">>> PARTNER SETUP QUERY FAILED: {ex.Message}"
                );
            }

            Console.WriteLine(
                $">>> PARTNER SETUP FOUND: {(response.PartnerSetup == null ? "NO" : "YES")}"
            );

            // ---- IE_IN_PO_SW query ----
            // Uses the same CO_CD and PARTNER_ID obtained from EO_ORDR_HDR_INFO.
            // For MD -> US and FT -> CA, use the same mapped CO_CD as Partner Setup.

            string inPoSwQuery = $@"
            SELECT
                CO_CD,
                PARTNER_ID,
                SKIP_FR_TM,
                SKIP_TO_TM,
                CUST_PRTY,
                ACK_PO_FLG,
                ACK_PROMO_FLG,
                BASERATE_FLG,
                AGG_CD_CPBL_FLG,
                PRE_IM_HOLD_FLG,
                MULT_SHP_TO_FLG,
                SYSTEM_PARTS_FLG,
                VOID_TAXABLE_FLG,
                CASEPACK_MSG_FLG,
                CHK_CUST_PRC_FLG,
                DIST_DEPTH_FLG,
                AIR_BR_SEQ_FLG,
                BR_SEQ_ORIDE_FLG,
                MULT_BR_SEQ_FLG,
                EXPORT_BR_SEQ_FLG,
                HOLD_ORDER_FLG,
                DFLT_CUST_NBR,
                PROMO_CUST_NBR,
                PRICE_CUST_NBR,
                INST_REBAT_MSG_FLG,
                VLA_FLG,
                MULTI_DIST_FLG,
                SAVE_FRT_FLG,
                SAVE_DIST_FLG,
                BEST_WHSE_FLG,
                SINGLE_WHSE_FLG,
                PRNT_ORDR_FLG,
                MULT_SHP_SORT_SEQ,
                MAX_FUT_DAY,
                LST_CHG_TS,
                LST_CHG_NAM,
                CLS_X_FLTR_TYP_CD,
                CLS_S_FLTR_TYP_CD,
                UPD_CUST_SKU_FLG,
                SAVE_CUST_PRC_FLG,
                BO_BR_XFER_FLG,
                REJ_ORDR_HDR_FLG,
                REJ_CNSCMP_HDR_FLG,
                ACK_RPT_FLG,
                SPEC_PRC_FLG,
                EU_CAPTURE_FLG,
                CUSTOM_CARR_FLG,
                CASCADE_SKU_FLG,
                AUTO_PO_CHG_FLG,
                CLS_X_HLD_FLG,
                ST_STORE_OVRRD_FLG,
                RSRV_CUST_NBR,
                RSRV_ALLOWED,
                RSRV_EXPIR_DAYS,
                CONFIG_VISIBLE_FLG,
                ETA_CALC_FLG,
                ETA_DAYS,
                ADDR_VALID_FLG,
                AUTO_SPLIT_FLG,
                ORDR_CANC_DAYS_FLG,
                ORDR_CANC_DAYS_NBR,
                FUT_ORDR_SW,
                ACK_DELAY_SW,
                ACK_DELAY_HRS
            FROM {zone}.IE_IN_PO_SW
            WHERE CO_CD = ? AND PARTNER_ID = ?";

            try
            {
                using OdbcConnection inPoSwConn = new OdbcConnection(connectionString);
                await inPoSwConn.OpenAsync();

                using OdbcCommand inPoSwCmd = new OdbcCommand(inPoSwQuery, inPoSwConn);

                // First ? = CO_CD
                inPoSwCmd.Parameters.Add("?", OdbcType.Char, 2).Value = partnerCoCd;

                // Second ? = PARTNER_ID
                inPoSwCmd.Parameters.Add("?", OdbcType.Char, 15).Value =
                    response.PartnerId?.Trim();

                Console.WriteLine($">>> EXECUTING IE_IN_PO_SW QUERY...");
                Console.WriteLine($">>> IE_IN_PO_SW CO_CD: {partnerCoCd}");
                Console.WriteLine($">>> IE_IN_PO_SW PARTNER_ID: {response.PartnerId?.Trim()}");

                using OdbcDataReader inPoSwReader =
                    (OdbcDataReader)await inPoSwCmd.ExecuteReaderAsync();

                Console.WriteLine(
                    $">>> IE_IN_PO_SW READER HAS ROWS: {inPoSwReader.HasRows}"
                );

                if (await inPoSwReader.ReadAsync())
                {
                    response.InPoSw.Add(new OrderInPoSw
                    {
                        CoCd = inPoSwReader["CO_CD"]?.ToString()?.Trim(),
                        PartnerId = inPoSwReader["PARTNER_ID"]?.ToString()?.Trim(),
                        SkipFrTm = inPoSwReader["SKIP_FR_TM"]?.ToString()?.Trim(),
                        SkipToTm = inPoSwReader["SKIP_TO_TM"]?.ToString()?.Trim(),
                        CustPrty = inPoSwReader["CUST_PRTY"]?.ToString()?.Trim(),
                        AckPoFlg = inPoSwReader["ACK_PO_FLG"]?.ToString()?.Trim(),
                        AckPromoFlg = inPoSwReader["ACK_PROMO_FLG"]?.ToString()?.Trim(),
                        BaserateFlg = inPoSwReader["BASERATE_FLG"]?.ToString()?.Trim(),
                        AggCdCpblFlg = inPoSwReader["AGG_CD_CPBL_FLG"]?.ToString()?.Trim(),
                        PreImHoldFlg = inPoSwReader["PRE_IM_HOLD_FLG"]?.ToString()?.Trim(),
                        MultShpToFlg = inPoSwReader["MULT_SHP_TO_FLG"]?.ToString()?.Trim(),
                        SystemPartsFlg = inPoSwReader["SYSTEM_PARTS_FLG"]?.ToString()?.Trim(),
                        VoidTaxableFlg = inPoSwReader["VOID_TAXABLE_FLG"]?.ToString()?.Trim(),
                        CasepackMsgFlg = inPoSwReader["CASEPACK_MSG_FLG"]?.ToString()?.Trim(),
                        ChkCustPrcFlg = inPoSwReader["CHK_CUST_PRC_FLG"]?.ToString()?.Trim(),
                        DistDepthFlg = inPoSwReader["DIST_DEPTH_FLG"]?.ToString()?.Trim(),
                        AirBrSeqFlg = inPoSwReader["AIR_BR_SEQ_FLG"]?.ToString()?.Trim(),
                        BrSeqOrideFlg = inPoSwReader["BR_SEQ_ORIDE_FLG"]?.ToString()?.Trim(),
                        MultBrSeqFlg = inPoSwReader["MULT_BR_SEQ_FLG"]?.ToString()?.Trim(),
                        ExportBrSeqFlg = inPoSwReader["EXPORT_BR_SEQ_FLG"]?.ToString()?.Trim(),
                        HoldOrderFlg = inPoSwReader["HOLD_ORDER_FLG"]?.ToString()?.Trim(),
                        DfltCustNbr = inPoSwReader["DFLT_CUST_NBR"]?.ToString()?.Trim(),
                        PromoCustNbr = inPoSwReader["PROMO_CUST_NBR"]?.ToString()?.Trim(),
                        PriceCustNbr = inPoSwReader["PRICE_CUST_NBR"]?.ToString()?.Trim(),
                        InstRebatMsgFlg = inPoSwReader["INST_REBAT_MSG_FLG"]?.ToString()?.Trim(),
                        VlaFlg = inPoSwReader["VLA_FLG"]?.ToString()?.Trim(),
                        MultiDistFlg = inPoSwReader["MULTI_DIST_FLG"]?.ToString()?.Trim(),
                        SaveFrtFlg = inPoSwReader["SAVE_FRT_FLG"]?.ToString()?.Trim(),
                        SaveDistFlg = inPoSwReader["SAVE_DIST_FLG"]?.ToString()?.Trim(),
                        BestWhseFlg = inPoSwReader["BEST_WHSE_FLG"]?.ToString()?.Trim(),
                        SingleWhseFlg = inPoSwReader["SINGLE_WHSE_FLG"]?.ToString()?.Trim(),
                        PrntOrdrFlg = inPoSwReader["PRNT_ORDR_FLG"]?.ToString()?.Trim(),
                        MultShpSortSeq = inPoSwReader["MULT_SHP_SORT_SEQ"]?.ToString()?.Trim(),
                        MaxFutDay = inPoSwReader["MAX_FUT_DAY"]?.ToString()?.Trim(),
                        LstChgTs = inPoSwReader["LST_CHG_TS"]?.ToString()?.Trim(),
                        LstChgNam = inPoSwReader["LST_CHG_NAM"]?.ToString()?.Trim(),
                        ClsXFltrTypCd = inPoSwReader["CLS_X_FLTR_TYP_CD"]?.ToString()?.Trim(),
                        ClsSFltrTypCd = inPoSwReader["CLS_S_FLTR_TYP_CD"]?.ToString()?.Trim(),
                        UpdCustSkuFlg = inPoSwReader["UPD_CUST_SKU_FLG"]?.ToString()?.Trim(),
                        SaveCustPrcFlg = inPoSwReader["SAVE_CUST_PRC_FLG"]?.ToString()?.Trim(),
                        BoBrXferFlg = inPoSwReader["BO_BR_XFER_FLG"]?.ToString()?.Trim(),
                        RejOrdrHdrFlg = inPoSwReader["REJ_ORDR_HDR_FLG"]?.ToString()?.Trim(),
                        RejCnsCmpHdrFlg = inPoSwReader["REJ_CNSCMP_HDR_FLG"]?.ToString()?.Trim(),
                        AckRptFlg = inPoSwReader["ACK_RPT_FLG"]?.ToString()?.Trim(),
                        SpecPrcFlg = inPoSwReader["SPEC_PRC_FLG"]?.ToString()?.Trim(),
                        EuCaptureFlg = inPoSwReader["EU_CAPTURE_FLG"]?.ToString()?.Trim(),
                        CustomCarrFlg = inPoSwReader["CUSTOM_CARR_FLG"]?.ToString()?.Trim(),
                        CascadeSkuFlg = inPoSwReader["CASCADE_SKU_FLG"]?.ToString()?.Trim(),
                        AutoPoChgFlg = inPoSwReader["AUTO_PO_CHG_FLG"]?.ToString()?.Trim(),
                        ClsXHldFlg = inPoSwReader["CLS_X_HLD_FLG"]?.ToString()?.Trim(),
                        StStoreOvrRdFlg = inPoSwReader["ST_STORE_OVRRD_FLG"]?.ToString()?.Trim(),
                        RsrvCustNbr = inPoSwReader["RSRV_CUST_NBR"]?.ToString()?.Trim(),
                        RsrvAllowed = inPoSwReader["RSRV_ALLOWED"]?.ToString()?.Trim(),
                        RsrvExpirDays = inPoSwReader["RSRV_EXPIR_DAYS"]?.ToString()?.Trim(),
                        ConfigVisibleFlg = inPoSwReader["CONFIG_VISIBLE_FLG"]?.ToString()?.Trim(),
                        EtaCalcFlg = inPoSwReader["ETA_CALC_FLG"]?.ToString()?.Trim(),
                        EtaDays = inPoSwReader["ETA_DAYS"]?.ToString()?.Trim(),
                        AddrValidFlg = inPoSwReader["ADDR_VALID_FLG"]?.ToString()?.Trim(),
                        AutoSplitFlg = inPoSwReader["AUTO_SPLIT_FLG"]?.ToString()?.Trim(),
                        OrdrCancDaysFlg = inPoSwReader["ORDR_CANC_DAYS_FLG"]?.ToString()?.Trim(),
                        OrdrCancDaysNbr = inPoSwReader["ORDR_CANC_DAYS_NBR"]?.ToString()?.Trim(),
                        FutOrdrSw = inPoSwReader["FUT_ORDR_SW"]?.ToString()?.Trim(),
                        AckDelaySw = inPoSwReader["ACK_DELAY_SW"]?.ToString()?.Trim(),
                        AckDelayHrs = inPoSwReader["ACK_DELAY_HRS"]?.ToString()?.Trim()
                    });
                }
            }
            catch (OdbcException ex)
            {
                Console.WriteLine(
                    $">>> IE_IN_PO_SW QUERY FAILED: {ex.Message}"
                );
            }

            Console.WriteLine(
                $">>> IE_IN_PO_SW FOUND: {response.InPoSw.Count}"
            );

            return response;
        }

        // Helper: safely converts DB2 numeric columns to decimal, defaulting to 0 if null/DBNull
        private static decimal ToDecimalSafe(object value)
        {
            if (value == null || value == DBNull.Value) return 0;
            return Convert.ToDecimal(value);
        }
    }
}