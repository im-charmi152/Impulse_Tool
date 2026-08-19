using System.Data.Odbc;
using ImpulseSupportTool_Repo;
using OrderManagement.API.Helpers;
using Oracle.ManagedDataAccess.Client;


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
            // Resolve ODS schema zone from country code (Z1/Z2/Z3/Z4)
            //string zone = ZoneMapper.GetZone(request.CountryCode);
            //Console.WriteLine($">>> RESOLVED ZONE: {zone} for CountryCode='{request.CountryCode}'");
            // Get Oracle ODS connection string
            string connectionString = _configuration.GetConnectionString("ODSConnection");
            if (string.IsNullOrWhiteSpace(connectionString))
            {
                throw new InvalidOperationException(
                    "ODSConnection is not configured.");
            }
            // Create Oracle connection
            await using OracleConnection conn = new OracleConnection(connectionString);

            await conn.OpenAsync();

            Console.WriteLine(">>> ODS ORACLE CONNECTION OPENED OK");

            OrderResponse response = null;

            
            string headerQuery = @"
            SELECT
                COMPANY_CD,
                BRANCH_NBR,
                ORDR_NBR,
                CUST_ORDR_NBR,
                BILL_TO_BRANCH_NBR,
                BILL_TO_CUST_NBR,
                BILL_TO_SFX,
                SHIP_TO_SFX,
                CAPS_ID_CD,
                TERMS,
                RESDNTL_SW,
                BORDR_STUS,
                ORDR_CMPLT_FILL_SW,
                CR_RELS,
                ENTY_DT,
                TERM_ID,
                OS_SLSMN,
                IS_SLSMN,
                PSTL_CD,
                ENTY_MTHD,
                EDI_CO,
                SPLIT_SW,
                ORD_REF_NBR,
                FULMNT_SW,
                CR_CRD_SW,
                ENTY_TM,
                BID_QOT_FLG,
                BID_EXP_DT,
                CCY_CD,
                CCY_RATE,
                PO_CRTD_SW,
                GOVT_BID_FLG,
                ENHCD_RMA_SW,
                FLRNG_AUTH_ACTN_CD,
                CU_BUS_SGMT,
                CU_BUS_TYP,
                CUA_SHIP_FROM,
                BASE_RATE_ORDR_SW,
                USER_NAM,
                GOVT_END_USER_ZIP,
                BIN_TYP,
                GOVT_GSA_IND,
                SPLIT_BILL_TO_SW,
                GOVT_END_USER_TYP,
                ODS_LST_UPD_DT,
                ENHCD_CR_MEMO_SW,
                SPECIAL_HANDLE_SW,
                CONFIGURATION_FLAG,
                END_USER_PO_NBR,
                RESELLER_NBR,
                TN_SPEC_CD,
                END_USER_DATA_SW,
                END_USER_AUTHORIZATION,
                END_USER_ADDR_SUFFIX,
                END_USER_VENDOR_FLAG,
                END_USER_NBR,
                VENDOR_CLAIM_NBR,
                PAYEE_NBR,
                PAYEE_SUF,
                CAMPAIGN,
                INDIA_GST_ORDER_IND,
                LAST_DIST_NBR,
                LAST_SHIPMENT_NBR,
                PRIORITY_CODE,
                OUTSOURCE_SKU_IND,
                DELETE_TODAY_SW,
                FLRNG_AUTH_NBR,
                PRICE_RECALC_SW,
                ACK_CODE,
                ALLIANCE_SW,
                AOD_SW,
                CAPS_BUYER,
                CITY_CODE,
                CONTRACT,
                COPY_CODE,
                COUNTY_CODE,
                COUNTRY_CODE,
                CUSTOMERS_LANGUAGE_CODE,
                CUST_REF_NBR,
                CUST_REF_NBR2,
                CUST_TYPE,
                DELIVERY_TERMS,
                END_CUST_ID,
                END_CUST_NUM,
                END_USER_CONT_SUFFIX,
                END_USER_ORDER_SW,
                EXT_SO_CODE,
                FREIGHT_FORWARDER,
                GL_OFFSET_NBR,
                GL_OFFSET_TYPE,
                GWMD_IMAG_APPLY_FLAG,
                JOB_ACCT_NBR,
                ORDER_MANAGEMENT_SW,
                ORDER_VALUE_AT_ADD,
                RESELLER_SPLIT_PCT,
                SOLD_TO_SUFFIX,
                SOURCE_CODE,
                STATE_CODE,
                SUMM_INVOICE_CODE
            FROM ODS.IMS_ORDER_ORSHED
            WHERE CUST_ORDR_NBR = :poNumber
              AND COMPANY_CD = :companyCode
            FETCH FIRST 10 ROWS ONLY";

            await using OracleCommand cmd =
     new OracleCommand(headerQuery, conn);

            cmd.BindByName = true;

            cmd.Parameters.Add( "poNumber",OracleDbType.Varchar2).Value =request.PoNumber.Trim();

            cmd.Parameters.Add("companyCode",OracleDbType.Varchar2).Value =request.CountryCode.Trim();

            Console.WriteLine(
                ">>> EXECUTING ODS HEADER QUERY...");

            await using OracleDataReader reader = await cmd.ExecuteReaderAsync();

            Console.WriteLine(
                $">>> ODS HEADER READER HAS ROWS: {reader.HasRows}");

            if (await reader.ReadAsync())
            {
                Console.WriteLine(
                    ">>> ODS HEADER ROW FOUND - mapping response...");

                response = new OrderResponse
                {
                    CustCoCd = reader["COMPANY_CD"]?.ToString()?.Trim(),
                    CustBr = reader["BRANCH_NBR"]?.ToString()?.Trim(),
                    ImiAsgdOrdrNbr = reader["ORDR_NBR"]?.ToString()?.Trim(),
                    CustPoNbr = reader["CUST_ORDR_NBR"]?.ToString()?.Trim(),
                    BillToBranchNbr = reader["BILL_TO_BRANCH_NBR"]?.ToString()?.Trim(),
                    BillToCustNbr = reader["BILL_TO_CUST_NBR"]?.ToString()?.Trim(),
                    BillToSfx = reader["BILL_TO_SFX"]?.ToString()?.Trim(),
                    ShipToSfx = reader["SHIP_TO_SFX"]?.ToString()?.Trim(),
                    CapsIdCd = reader["CAPS_ID_CD"]?.ToString()?.Trim(),
                    Terms = reader["TERMS"]?.ToString()?.Trim(),
                    ResdntlSw = reader["RESDNTL_SW"]?.ToString()?.Trim(),
                    OrdrStatus = reader["BORDR_STUS"]?.ToString()?.Trim(),
                    OrdrCmpltFillSw = reader["ORDR_CMPLT_FILL_SW"]?.ToString()?.Trim(),
                    CrRels = reader["CR_RELS"]?.ToString()?.Trim(),
                    EntyDt = reader["ENTY_DT"]?.ToString()?.Trim(),
                    TermId = reader["TERM_ID"]?.ToString()?.Trim(),
                    OsSlsmn = reader["OS_SLSMN"]?.ToString()?.Trim(),
                    IsSlsmn = reader["IS_SLSMN"]?.ToString()?.Trim(),
                    PostalCd = reader["PSTL_CD"]?.ToString()?.Trim(),
                    EntyMthd = reader["ENTY_MTHD"]?.ToString()?.Trim(),
                    EdiCo = reader["EDI_CO"]?.ToString()?.Trim(),
                    SplitSw = reader["SPLIT_SW"]?.ToString()?.Trim(),
                    OrdRefNbr = reader["ORD_REF_NBR"]?.ToString()?.Trim(),
                    FulmntSw = reader["FULMNT_SW"]?.ToString()?.Trim(),
                    CrCrdSw = reader["CR_CRD_SW"]?.ToString()?.Trim(),
                    EntyTm = reader["ENTY_TM"]?.ToString()?.Trim(),
                    BidQotFlg = reader["BID_QOT_FLG"]?.ToString()?.Trim(),
                    BidExpDt = reader["BID_EXP_DT"]?.ToString()?.Trim(),
                    OrdrCcyCd = reader["CCY_CD"]?.ToString()?.Trim(),       
                    CcyRate = ToDecimalSafe(reader["CCY_RATE"]),
                    PoCrtedSw = reader["PO_CRTD_SW"]?.ToString()?.Trim(),
                    GovtBidFlg = reader["GOVT_BID_FLG"]?.ToString()?.Trim(),
                    EnhancedRmaSw = reader["ENHCD_RMA_SW"]?.ToString()?.Trim(),
                    FlrngAuthActnCd = reader["FLRNG_AUTH_ACTN_CD"]?.ToString()?.Trim(),
                    CuBusSgmt = reader["CU_BUS_SGMT"]?.ToString()?.Trim(),
                    CuBusTyp = reader["CU_BUS_TYP"]?.ToString()?.Trim(),
                    CuaShipFrom = reader["CUA_SHIP_FROM"]?.ToString()?.Trim(),
                    BaseRateOrdrSw = reader["BASE_RATE_ORDR_SW"]?.ToString()?.Trim(),
                    UserNam = reader["USER_NAM"]?.ToString()?.Trim(),
                    GovtEndUserZip = reader["GOVT_END_USER_ZIP"]?.ToString()?.Trim(),
                    BinTyp = reader["BIN_TYP"]?.ToString()?.Trim(),
                    GovtGsaInd = reader["GOVT_GSA_IND"]?.ToString()?.Trim(),
                    SplitBillToSw = reader["SPLIT_BILL_TO_SW"]?.ToString()?.Trim(),

                    GovtEndUserTyp = reader["GOVT_END_USER_TYP"]?.ToString()?.Trim(),

                    OdsLstUpdDt = reader["ODS_LST_UPD_DT"]?.ToString()?.Trim(),

                    EnhancedCrMemoSw = reader["ENHCD_CR_MEMO_SW"]?.ToString()?.Trim(),

                    SpecialHandleSw = reader["SPECIAL_HANDLE_SW"]?.ToString()?.Trim(),

                    ConfigurationFlag = reader["CONFIGURATION_FLAG"]?.ToString()?.Trim(),

                    EndUserPoNbr = reader["END_USER_PO_NBR"]?.ToString()?.Trim(),

                    EndUserNbr = reader["END_USER_NBR"]?.ToString()?.Trim(),

                    EndUserDataSw = reader["END_USER_DATA_SW"]?.ToString()?.Trim(),

                    EndUserAuthorization = reader["END_USER_AUTHORIZATION"]?.ToString()?.Trim(),

                    EndUserAddrSuffix = reader["END_USER_ADDR_SUFFIX"]?.ToString()?.Trim(),

                    EndUserVendorFlag = reader["END_USER_VENDOR_FLAG"]?.ToString()?.Trim(),

                    EndUserContSuffix = reader["END_USER_CONT_SUFFIX"]?.ToString()?.Trim(),

                    EndUserOrderSw = reader["END_USER_ORDER_SW"]?.ToString()?.Trim(),

                    ResellerNbr = reader["RESELLER_NBR"]?.ToString()?.Trim(),

                    VendorClaimNbr = reader["VENDOR_CLAIM_NBR"]?.ToString()?.Trim(),

                    PayeeNbr = reader["PAYEE_NBR"]?.ToString()?.Trim(),

                    PayeeSuf = reader["PAYEE_SUF"]?.ToString()?.Trim(),

                    Campaign = reader["CAMPAIGN"]?.ToString()?.Trim(),

                    IndiaGstOrderInd = reader["INDIA_GST_ORDER_IND"]?.ToString()?.Trim(),

                    LastDistNbr = reader["LAST_DIST_NBR"]?.ToString()?.Trim(),

                    LastShipmentNbr = reader["LAST_SHIPMENT_NBR"]?.ToString()?.Trim(),

                    PriorityCode = reader["PRIORITY_CODE"]?.ToString()?.Trim(),

                    OutsourceSkuInd = reader["OUTSOURCE_SKU_IND"]?.ToString()?.Trim(),

                    DeleteTodaySw = reader["DELETE_TODAY_SW"]?.ToString()?.Trim(),

                    FlrngAuthNbr = reader["FLRNG_AUTH_NBR"]?.ToString()?.Trim(),

                    PriceRecalcSw = reader["PRICE_RECALC_SW"]?.ToString()?.Trim(),

                    AckCode = reader["ACK_CODE"]?.ToString()?.Trim(),

                    AllianceSw = reader["ALLIANCE_SW"]?.ToString()?.Trim(),

                    AodSw = reader["AOD_SW"]?.ToString()?.Trim(),

                    CapsBuyer = reader["CAPS_BUYER"]?.ToString()?.Trim(),

                    CityCode = reader["CITY_CODE"]?.ToString()?.Trim(),

                    Contract = reader["CONTRACT"]?.ToString()?.Trim(),

                    CopyCode = reader["COPY_CODE"]?.ToString()?.Trim(),

                    CountyCode = reader["COUNTY_CODE"]?.ToString()?.Trim(),

                    CountryCode = reader["COUNTRY_CODE"]?.ToString()?.Trim(),

                    CustomersLanguageCode = reader["CUSTOMERS_LANGUAGE_CODE"]?.ToString()?.Trim(),

                    StateCd = reader["STATE_CODE"]?.ToString()?.Trim(),

                    CustRefNbr = reader["CUST_REF_NBR"]?.ToString()?.Trim(),

                    CustRefNbr2 = reader["CUST_REF_NBR2"]?.ToString()?.Trim(),

                    CustType = reader["CUST_TYPE"]?.ToString()?.Trim(),

                    DeliveryTerms = reader["DELIVERY_TERMS"]?.ToString()?.Trim(),

                    EndCustId = reader["END_CUST_ID"]?.ToString()?.Trim(),

                    EndCustNum = reader["END_CUST_NUM"]?.ToString()?.Trim(),

                    ExtSoCode = reader["EXT_SO_CODE"]?.ToString()?.Trim(),

                    FreightForwarder = reader["FREIGHT_FORWARDER"]?.ToString()?.Trim(),

                    GlOffsetNbr = reader["GL_OFFSET_NBR"]?.ToString()?.Trim(),

                    GlOffsetType = reader["GL_OFFSET_TYPE"]?.ToString()?.Trim(),

                    GwmdImagApplyFlag = reader["GWMD_IMAG_APPLY_FLAG"]?.ToString()?.Trim(),

                    JobAcctNbr = reader["JOB_ACCT_NBR"]?.ToString()?.Trim(),

                    OrderManagementSw = reader["ORDER_MANAGEMENT_SW"]?.ToString()?.Trim(),

                    OrderValueAtAdd = ToDecimalSafe(reader["ORDER_VALUE_AT_ADD"]),

                    ResellerSplitPct = ToDecimalSafe(reader["RESELLER_SPLIT_PCT"]),
                    SoldToSuffix = reader["SOLD_TO_SUFFIX"]?.ToString()?.Trim(),
                    SourceCode = reader["SOURCE_CODE"]?.ToString()?.Trim(),
                    SummInvoiceCode = reader["SUMM_INVOICE_CODE"]?.ToString()?.Trim()
                };

                Console.WriteLine(
                    $">>> ROW MAPPED SUCCESSFULLY: " +
                    $"Company={response.CustCoCd}, " +
                    $"Branch={response.CustBr}, " +
                    $"CustomerOrder={response.CustPoNbr}, " +
                    $"OrderNumber={response.ImiAsgdOrdrNbr}");
            }
            else
            {
                Console.WriteLine(
                    ">>> NO ODS HEADER ROW FOUND");
            }

         
            if (response != null)
                {
                    string lineQuery = @"SELECT
                        COMPANY_CD,
                        BRANCH_NBR,
                        ORDR_NBR,
                        LINE_NBR,
                        IM_PART_NBR,
                        CUST_ITEM_NBR,
                        CUST_LINE_NBR,
                        QTY_ORDED,
                        QTY_BORD,
                        UNIT_PRC,
                        RETAIL_PRICE,
                        VEND_NBR,
                        VEND_PART_NBR,
                        DES,
                        PRMS_DT,
                        CANC_DT,
                        BO_ETA_DATE,
                        FREE_ITEM_SW,
                        ITEM_TYP,
                        LINE_TYP,
                        AGGREGATE_CODE,
                        COMP_QTY_PER,
                        ASET_TAG_SW,
                        SERIAL_NBR_AVAIL_SW,
                        UPC_NBR,
                        HOLD_CODE,
                        RELATED_GOVT_BID_VSN,
                        RELATED_GOVT_BID_GSN,
                        ORL_FOREIGN_UNIT_PRICE,
                        UNIT_PRICE_RESELLER,
                        SPECIAL_SYSTEMS_COST,
                        CONFIGURATION_LAB,
                        ALLOC_RESV_QTY,
                        CUA_SHIP_FROM,
                        MCHG_CD
                    FROM ODS.IMS_ORDER_LINE_ORSLNE
                    WHERE TRIM(ORDR_NBR) = :orderNumber
                      AND TRIM(COMPANY_CD) = :companyCode
                    ORDER BY LINE_NBR";

                await using OracleCommand lineCmd = new OracleCommand(lineQuery, conn);
                    lineCmd.BindByName = true;
                    lineCmd.Parameters.Add("orderNumber", OracleDbType.Varchar2).Value = response.ImiAsgdOrdrNbr.Trim();
                    lineCmd.Parameters.Add("companyCode", OracleDbType.Varchar2).Value = response.CustCoCd.Trim();
                    Console.WriteLine($">>> EXECUTING ODS LINE QUERY: COMPANY_CD='{response.CustCoCd}', ORDR_NBR='{response.ImiAsgdOrdrNbr}'");
                    await using OracleDataReader lineReader = await lineCmd.ExecuteReaderAsync();
                    Console.WriteLine($">>> ODS LINE READER HAS ROWS: {lineReader.HasRows}");

                    while (await lineReader.ReadAsync())
                    {
                        response.LineItems.Add(new OrderLineItem
                        {
                            CustCoCd = lineReader["COMPANY_CD"]?.ToString()?.Trim(),
                            CustBr = lineReader["BRANCH_NBR"]?.ToString()?.Trim(),
                            ImiPartNbr = lineReader["IM_PART_NBR"]?.ToString()?.Trim(),
                            CustPartNbr = lineReader["CUST_ITEM_NBR"]?.ToString()?.Trim(),
                            PrtnrLineNbr = lineReader["CUST_LINE_NBR"]?.ToString()?.Trim(),
                            LineSeqNbr = lineReader["LINE_NBR"]?.ToString()?.Trim(),
                            QtyOrdered = ToDecimalSafe(lineReader["QTY_ORDED"]),
                            QtyBo = ToDecimalSafe(lineReader["QTY_BORD"]),
                            UnitPrc = ToDecimalSafe(lineReader["UNIT_PRC"]),
                            RtlPrc = ToDecimalSafe(lineReader["RETAIL_PRICE"]),
                            FrgnUnitPrc = ToDecimalSafe(lineReader["ORL_FOREIGN_UNIT_PRICE"]),
                            VendNbr = lineReader["VEND_NBR"]?.ToString()?.Trim(),
                            ExtVendPartNbr = lineReader["VEND_PART_NBR"]?.ToString()?.Trim(),
                            CustPartDesc1 = lineReader["DES"]?.ToString()?.Trim(),
                            LineReqDlvyDt = lineReader["PRMS_DT"]?.ToString()?.Trim(),
                            LineReqCancDt = lineReader["CANC_DT"]?.ToString()?.Trim(),
                            Eta = lineReader["BO_ETA_DATE"]?.ToString()?.Trim(),
                            FreeItemSw = lineReader["FREE_ITEM_SW"]?.ToString()?.Trim(),
                            ItemTypeInd = lineReader["ITEM_TYP"]?.ToString()?.Trim(),
                            LineTypeSw = lineReader["LINE_TYP"]?.ToString()?.Trim(),
                            AggrCd = lineReader["AGGREGATE_CODE"]?.ToString()?.Trim(),
                            QtyPerConfig = ToDecimalSafe(lineReader["COMP_QTY_PER"]),
                            AssetTagFlg = lineReader["ASET_TAG_SW"]?.ToString()?.Trim(),
                            SerialNbrFlg = lineReader["SERIAL_NBR_AVAIL_SW"]?.ToString()?.Trim(),
                            ImiHoldCd = lineReader["HOLD_CODE"]?.ToString()?.Trim(),
                            BidVrsnNbr = lineReader["RELATED_GOVT_BID_VSN"]?.ToString()?.Trim(),
                            BidNbr = lineReader["RELATED_GOVT_BID_GSN"]?.ToString()?.Trim(),
                            EndUserPrc = ToDecimalSafe(lineReader["UNIT_PRICE_RESELLER"]),
                            HermUnitCostAmt = ToDecimalSafe(lineReader["SPECIAL_SYSTEMS_COST"]),
                            LabType = lineReader["CONFIGURATION_LAB"]?.ToString()?.Trim(),
                            QtyAlloc = ToDecimalSafe(lineReader["ALLOC_RESV_QTY"]),
                            EuAddrLoc = lineReader["CUA_SHIP_FROM"]?.ToString()?.Trim(),
                            MiscCd = lineReader["MCHG_CD"]?.ToString()?.Trim()
                        });
                    }

                    Console.WriteLine($">>> ODS LINE ITEMS FOUND: {response.LineItems.Count}");
                }

            string statusQuery = @"
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
                FLR_DNL_QTY,
                LAST_CHG_APPL_ID,
                TRANS_AUTH_ID,
                CORREL_ID,
                PLAN_NAM,
                ODS_ISRT_TS,
                ODS_UPD_TS
            FROM ODS.DB2_OR_ORDER_STUS_CHGS
            WHERE TRIM(ORDR_NBR) = :orderNumber
              AND TRIM(ORDR_BR_NBR) = :branchNumber
              AND TRIM(CO_CD) = :companyCode
            ORDER BY STUS_CHG_TS";

            try
            {
                await using OracleCommand statusCmd = new OracleCommand(statusQuery, conn);
                statusCmd.BindByName = true;

                statusCmd.Parameters.Add("orderNumber", OracleDbType.Varchar2).Value = response.ImiAsgdOrdrNbr?.Trim();
                statusCmd.Parameters.Add("branchNumber", OracleDbType.Varchar2).Value = response.CustBr?.Trim();
                statusCmd.Parameters.Add("companyCode", OracleDbType.Varchar2).Value = response.CustCoCd?.Trim();

                Console.WriteLine($">>> EXECUTING ODS STATUS CHANGE QUERY...");
                Console.WriteLine($">>> STATUS PARAMS: CO_CD='{response.CustCoCd}', ORDR_BR_NBR='{response.CustBr}', ORDR_NBR='{response.ImiAsgdOrdrNbr}'");

                await using OracleDataReader statusReader = await statusCmd.ExecuteReaderAsync();

                Console.WriteLine($">>> ODS STATUS READER HAS ROWS: {statusReader.HasRows}");

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
                        LastChgApplId = statusReader["LAST_CHG_APPL_ID"]?.ToString()?.Trim(),
                        TransAuthId = statusReader["TRANS_AUTH_ID"]?.ToString()?.Trim(),
                        CorrelId = statusReader["CORREL_ID"]?.ToString()?.Trim(),
                        PlanNam = statusReader["PLAN_NAM"]?.ToString()?.Trim(),
                        OdsIsrtTs = statusReader["ODS_ISRT_TS"]?.ToString()?.Trim(),
                        OdsUpdTs = statusReader["ODS_UPD_TS"]?.ToString()?.Trim()
                    });
                }
            }
            catch (OracleException ex)
            {
                Console.WriteLine($">>> ODS STATUS CHANGE QUERY FAILED: {ex.Message}");
            }

            Console.WriteLine($">>> ODS STATUS CHANGES FOUND: {response.StatusChanges.Count}");

            string partnerQuery = @"
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
                CYC_STRT_TM,
                CYC_END_TM,
                OVRD_APPL_BATCH_ID,
                TRANS_AUTH_ID,
                CORREL_ID,
                PLAN_NAM,
                ODS_ISRT_TS,
                ODS_UPD_TS
            FROM ODS.DB2_IE_PARTNER_SETUP
            WHERE CO_CD = :companyCode
              AND PARTNER_ID = :partnerId";

            string partnerCoCd = response.CustCoCd?.Trim() switch { "MD" => "US", "FT" => "CA", _ => response.CustCoCd?.Trim() };
            Console.WriteLine($">>> PARTNER SETUP CO_CD: Incoming={response.CustCoCd}, QueryValue={partnerCoCd}");

            try
            {
                await using OracleCommand partnerCmd = new OracleCommand(partnerQuery, conn);
                partnerCmd.BindByName = true;
                partnerCmd.Parameters.Add("companyCode", OracleDbType.Varchar2).Value = partnerCoCd;
                partnerCmd.Parameters.Add("partnerId", OracleDbType.Varchar2).Value = response.PartnerId?.Trim();
                Console.WriteLine($">>> EXECUTING ODS PARTNER SETUP QUERY...");
                Console.WriteLine($">>> PARTNER CO_CD PARAMETER: {partnerCoCd}");
                Console.WriteLine($">>> PARTNER ID PARAMETER: {response.PartnerId?.Trim()}");

                await using OracleDataReader partnerReader = await partnerCmd.ExecuteReaderAsync();

                Console.WriteLine($">>> ODS PARTNER SETUP READER HAS ROWS: {partnerReader.HasRows}");

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
                        CycStrtTm = partnerReader["CYC_STRT_TM"]?.ToString()?.Trim()
                    });
                }
            }
            catch (OracleException ex)
            {
                Console.WriteLine($">>> PARTNER SETUP ORACLE ERROR: {ex.Message}");
            }

            return response;
            // TRIM fixes trailing spaces in CHAR fixed-width columns
        } 

        // Helper: safely converts DB2 numeric columns to decimal, defaulting to 0 if null/DBNull
        private static decimal ToDecimalSafe(object value)
        {
            if (value == null || value == DBNull.Value) return 0;
            return Convert.ToDecimal(value);
        }
    }
}