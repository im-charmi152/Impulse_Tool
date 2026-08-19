using System.Collections.Generic;

namespace ImpulseSupportTool_Repo
{
    public class OrderResponse
    {
        public string CustCoCd { get; set; }
        public string PartnerId { get; set; }

        public string CustBr { get; set; }
        public string ImiAsgdOrdrNbr { get; set; }
        public string CustPoNbr { get; set; }

        public string BillToBranchNbr { get; set; }
        public string BillToCustNbr { get; set; }
        public string BillToSfx { get; set; }
        public string ShipToSfx { get; set; }

        public string CapsIdCd { get; set; }
        public string Terms { get; set; }
        public string ResdntlSw { get; set; }
        public string OrdrStatus { get; set; }
        public string OrdrCmpltFillSw { get; set; }
        public string CrRels { get; set; }
        public string EntyDt { get; set; }
        public string TermId { get; set; }
        public string OsSlsmn { get; set; }
        public string IsSlsmn { get; set; }
        public string PostalCd { get; set; }
        public string EntyMthd { get; set; }
        public string EdiCo { get; set; }
        public string SplitSw { get; set; }
        public string OrdRefNbr { get; set; }
        public string FulmntSw { get; set; }
        public string CrCrdSw { get; set; }
        public string EntyTm { get; set; }

        public string BidQotFlg { get; set; }
        public string BidExpDt { get; set; }

        public string OrdrCcyCd { get; set; }
        public decimal CcyRate { get; set; }

        public string PoCrtedSw { get; set; }
        public string GovtBidFlg { get; set; }
        public string EnhancedRmaSw { get; set; }
        public string FlrngAuthActnCd { get; set; }

        public string CuBusSgmt { get; set; }
        public string CuBusTyp { get; set; }
        public string CuaShipFrom { get; set; }
        public string BaseRateOrdrSw { get; set; }
        public string UserNam { get; set; }

        public string GovtEndUserZip { get; set; }
        public string BinTyp { get; set; }
        public string GovtGsaInd { get; set; }
        public string SplitBillToSw { get; set; }
        public string GovtEndUserTyp { get; set; }

        public string OdsLstUpdDt { get; set; }
        public string EnhancedCrMemoSw { get; set; }
        public string SpecialHandleSw { get; set; }
        public string ConfigurationFlag { get; set; }

        public string EndUserPoNbr { get; set; }
        public string ResellerNbr { get; set; }
        public string TnSpecCd { get; set; }
        public string EndUserDataSw { get; set; }
        public string EndUserAuthorization { get; set; }
        public string EndUserAddrSuffix { get; set; }
        public string EndUserVendorFlag { get; set; }
        public string EndUserNbr { get; set; }
        public string VendorClaimNbr { get; set; }
        public string PayeeNbr { get; set; }
        public string PayeeSuf { get; set; }

        public string Campaign { get; set; }
        public string IndiaGstOrderInd { get; set; }

        public string LastDistNbr { get; set; }
        public string LastShipmentNbr { get; set; }
        public string PriorityCode { get; set; }
        public string OutsourceSkuInd { get; set; }
        public string DeleteTodaySw { get; set; }

        public string FlrngAuthNbr { get; set; }
        public string PriceRecalcSw { get; set; }
        public string AckCode { get; set; }
        public string AllianceSw { get; set; }
        public string AodSw { get; set; }
        public string CapsBuyer { get; set; }

        public string CityCode { get; set; }
        public string Contract { get; set; }
        public string CopyCode { get; set; }
        public string CountyCode { get; set; }
        public string CountryCode { get; set; }
        public string CustomersLanguageCode { get; set; }

        public string CustRefNbr { get; set; }
        public string CustRefNbr2 { get; set; }
        public string CustType { get; set; }
        public string DeliveryTerms { get; set; }

        public string EndCustId { get; set; }
        public string EndCustNum { get; set; }
        public string EndUserContSuffix { get; set; }
        public string EndUserOrderSw { get; set; }

        public string ExtSoCode { get; set; }
        public string FreightForwarder { get; set; }

        public string GlOffsetNbr { get; set; }
        public string GlOffsetType { get; set; }
        public string GwmdImagApplyFlag { get; set; }
        public string JobAcctNbr { get; set; }

        public string OrderManagementSw { get; set; }
        public decimal OrderValueAtAdd { get; set; }
        public decimal ResellerSplitPct { get; set; }

        public string SoldToSuffix { get; set; }
        public string SourceCode { get; set; }
        public string StateCd { get; set; }
        public string SummInvoiceCode { get; set; }

        public List<OrderLineItem> LineItems { get; set; } = new();
        public List<OrderStatusChange>? StatusChanges { get; set; } = new();
        public List<OrderPartnerSetup> PartnerSetup { get; set; } = new();
        public List<OrderInPoSw> InPoSw { get; set; } = new();
    }
    public class OrderLineItem
        {
            public string CustCoCd { get; set; }
            public string CustBr { get; set; }
            public string CustNbr { get; set; }
            public string CustSfx { get; set; }
            public string CustPoNbr { get; set; }
            public string SdqSeqNbr { get; set; }
            public string CustPoDt { get; set; }
            public string CustPoSeqNbr { get; set; }
            public string LineSeqNbr { get; set; }
            public string PrtnrLineNbr { get; set; }
            public string ImiLineNbr { get; set; }
            public string ImiPartNbr { get; set; }
            public string CustPartNbr { get; set; }
            public string MfctrPartNbr { get; set; }
            public string UpcPartNbr { get; set; }
            public decimal QtyOrdered { get; set; }
            public decimal CustQotdPrc { get; set; }
            public decimal CsPkQty { get; set; }
            public string CustPartDesc1 { get; set; }
            public string CustPartDesc2 { get; set; }
            public string RsvInvtyFlg { get; set; }
            public string ImiPartDesc1 { get; set; }
            public string ImiPartDesc2 { get; set; }
            public string PrcUseFlg { get; set; }
            public string LineReqDlvyDt { get; set; }
            public string LineReqShipDt { get; set; }
            public string LineReqCancDt { get; set; }
            public string LineBoFlg { get; set; }
            public string AggrCd { get; set; }
            public string MiscChrgSku { get; set; }
            public string AssetTagFlg { get; set; }
            public string OprtSys { get; set; }
            public string DlvyMthd { get; set; }
            public string LabType { get; set; }
            public decimal QtyPerConfig { get; set; }
            public decimal ConfigQty { get; set; }
            public string ItemTypeInd { get; set; }
            public decimal QtyAlloc { get; set; }
            public decimal EndUserPrc { get; set; }
            public string ImiRejCd { get; set; }
            public string AcptRejFlg { get; set; }
            public string MiscCd { get; set; }
            public string LineTypeSw { get; set; }
            public decimal QtyBo { get; set; }
            public decimal UnitPrc { get; set; }
            public decimal RtlPrc { get; set; }
            public decimal FrgnUnitPrc { get; set; }
            public string SubPartNbr { get; set; }
            public string Eta { get; set; }
            public string FreeItemSw { get; set; }
            public string VendNbr { get; set; }
            public string LineVlaAuthNbr { get; set; }
            public string EuAddrLoc { get; set; }
            public string EuInfoReqFlg { get; set; }
            public string BusRegnCd { get; set; }
            public string CustSpecHndlCd { get; set; }
            public string SerialNbrFlg { get; set; }
            public decimal SvcAmt { get; set; }
            public decimal SvcQty { get; set; }
            public string HtImiRejCd { get; set; }
            public string EtaSrcCd { get; set; }
            public string HtInitRejCd { get; set; }
            public string BidNbr { get; set; }
            public string BidVrsnNbr { get; set; }
            public string ExtVendPartNbr { get; set; }
            public string OrigSpplPartNbr { get; set; }
            public string HermShipFrBrNbr { get; set; }
            public decimal HermUnitCostAmt { get; set; }
            public decimal HermUnitPrcAmt { get; set; }
            public string HermLineTypeCd { get; set; }
            public string HermStusFlg { get; set; }
            public string ImiRejCdDesc { get; set; }
            public string LineVmfInfoSw { get; set; }
            public string FutLinePromDt { get; set; }
            public decimal CtoUnitCostAmt { get; set; }
            public decimal CtoUnitPrcAmt { get; set; }
            public string LinkId { get; set; }
            public decimal EuPpPrcAmt { get; set; }
            public string EuPpPurDt { get; set; }
            public string TermEndDt { get; set; }
            public string QuoteLineInd { get; set; }
            public string VmfLneHldInd { get; set; }
            public string ImiHoldCd { get; set; }
            public string LnDirShpInd { get; set; }
        }
   
        public class OrderStatusChange
        {
            public string CoCd { get; set; }
            public string OrdrBrNbr { get; set; }
            public string OrdrNbr { get; set; }
            public string DistNbr { get; set; }
            public string ShipNbr { get; set; }
            public string OrdrDt { get; set; }
            public string StusChgTypCd { get; set; }
            public string StusChgTs { get; set; }
            public string OrdrLineNbr { get; set; }
            public string CustBrNbr { get; set; }
            public string CustNbr { get; set; }
            public string WebProcsFlg { get; set; }
            public string TomcatProcsFlg { get; set; }
            public string OrdrChgStusCd { get; set; }
            public string ConfigStusCd { get; set; }
            public string AggregateId { get; set; }
            public string PrmsChgDt { get; set; }
            public string FamilyCd { get; set; }
            public string LstChgProgNam { get; set; }
            public string LstChgOperId { get; set; }
            public string UpdtRsnTxt { get; set; }
            public string EvntRsnCd { get; set; }
            public decimal FlrDnlQty { get; set; }
            public string LastChgApplId { get; set; }
            public string TransAuthId { get; set; }
            public string CorrelId { get; set; }
            public string PlanNam { get; set; }
            public string OdsIsrtTs { get; set; }
            public string OdsUpdTs { get; set; }

    }
    public class OrderPartnerSetup
    {
        public string CoCd { get; set; }
        public string PartnerId { get; set; }
        public string PartnerTypeCd { get; set; }
        public string SrceSysId { get; set; }
        public string SrceSysKeyId { get; set; }
        public string FormatId { get; set; }
        public string DirFlgCd { get; set; }
        public string DocId { get; set; }
        public string FreqId { get; set; }
        public string DataStoreMechId { get; set; }
        public string CommuId { get; set; }
        public string InternetAddrTxt { get; set; }
        public string ActvDt { get; set; }
        public string DeactvDt { get; set; }
        public string HoldCd { get; set; }
        public string SetupNotesTxt { get; set; }
        public string SendThruId { get; set; }
        public string LstChgTs { get; set; }
        public string LstChgNam { get; set; }
        public string PrcsOptnFlg { get; set; }
        public string CycleIntvl { get; set; }
        public string CycleLstRunTs { get; set; }
        public string BatchSplitCnt { get; set; }
        public string CycStrtTm { get; set; }
    }
    public class OrderInPoSw
    {
        public string CoCd { get; set; }
        public string PartnerId { get; set; }
        public string SkipFrTm { get; set; }
        public string SkipToTm { get; set; }
        public string CustPrty { get; set; }
        public string AckPoFlg { get; set; }
        public string AckPromoFlg { get; set; }
        public string BaserateFlg { get; set; }
        public string AggCdCpblFlg { get; set; }
        public string PreImHoldFlg { get; set; }
        public string MultShpToFlg { get; set; }
        public string SystemPartsFlg { get; set; }
        public string VoidTaxableFlg { get; set; }
        public string CasepackMsgFlg { get; set; }
        public string ChkCustPrcFlg { get; set; }
        public string DistDepthFlg { get; set; }
        public string AirBrSeqFlg { get; set; }
        public string BrSeqOrideFlg { get; set; }
        public string MultBrSeqFlg { get; set; }
        public string ExportBrSeqFlg { get; set; }
        public string HoldOrderFlg { get; set; }
        public string DfltCustNbr { get; set; }
        public string PromoCustNbr { get; set; }
        public string PriceCustNbr { get; set; }
        public string InstRebatMsgFlg { get; set; }
        public string VlaFlg { get; set; }
        public string MultiDistFlg { get; set; }
        public string SaveFrtFlg { get; set; }
        public string SaveDistFlg { get; set; }
        public string BestWhseFlg { get; set; }
        public string SingleWhseFlg { get; set; }
        public string PrntOrdrFlg { get; set; }
        public string MultShpSortSeq { get; set; }
        public string MaxFutDay { get; set; }
        public string LstChgTs { get; set; }
        public string LstChgNam { get; set; }
        public string ClsXFltrTypCd { get; set; }
        public string ClsSFltrTypCd { get; set; }
        public string UpdCustSkuFlg { get; set; }
        public string SaveCustPrcFlg { get; set; }
        public string BoBrXferFlg { get; set; }
        public string RejOrdrHdrFlg { get; set; }
        public string RejCnsCmpHdrFlg { get; set; }
        public string AckRptFlg { get; set; }
        public string SpecPrcFlg { get; set; }
        public string EuCaptureFlg { get; set; }
        public string CustomCarrFlg { get; set; }
        public string CascadeSkuFlg { get; set; }
        public string AutoPoChgFlg { get; set; }
        public string ClsXHldFlg { get; set; }
        public string StStoreOvrRdFlg { get; set; }
        public string RsrvCustNbr { get; set; }
        public string RsrvAllowed { get; set; }
        public string RsrvExpirDays { get; set; }
        public string ConfigVisibleFlg { get; set; }
        public string EtaCalcFlg { get; set; }
        public string EtaDays { get; set; }
        public string AddrValidFlg { get; set; }
        public string AutoSplitFlg { get; set; }
        public string OrdrCancDaysFlg { get; set; }
        public string OrdrCancDaysNbr { get; set; }
        public string FutOrdrSw { get; set; }
        public string AckDelaySw { get; set; }
        public string AckDelayHrs { get; set; }
    }

}