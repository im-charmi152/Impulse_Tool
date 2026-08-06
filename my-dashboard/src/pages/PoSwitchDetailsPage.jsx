import { ArrowLeft, SlidersHorizontal, Clock, Users, Settings, Truck, ShoppingCart, BarChart2, Shield } from "lucide-react";
import { loadDetailsRecord } from "../utils/detailsNavigation";
import { AccordionCard, DetailFieldRow, SummaryTile, formatDetailValue } from "../components/details/DetailsLayout";

const FIELD_GROUPS = [
  {
    id: "identity",
    label: "Identity",
    icon: Users,
    defaultOpen: true,
    fields: [
      { key: "coCd", label: "CO_CD", type: "text" },
      { key: "partnerId", label: "PARTNER_ID", type: "text" },
      { key: "custPrty", label: "CUST_PRTY", type: "text" },
      { key: "dfltCustNbr", label: "DFLT_CUST_NBR", type: "text" },
      { key: "promoCustNbr", label: "PROMO_CUST_NBR", type: "text" },
      { key: "priceCustNbr", label: "PRICE_CUST_NBR", type: "text" },
      { key: "rsrvCustNbr", label: "RSRV_CUST_NBR", type: "text" },
    ],
  },
  {
    id: "timing",
    label: "Timing & Schedule",
    icon: Clock,
    defaultOpen: true,
    fields: [
      { key: "skipFrTm", label: "SKIP_FR_TM", type: "text" },
      { key: "skipToTm", label: "SKIP_TO_TM", type: "text" },
      { key: "maxFutDay", label: "MAX_FUT_DAY", type: "text" },
      { key: "ackDelayHrs", label: "ACK_DELAY_HRS", type: "text" },
      { key: "ordrCancDaysNbr", label: "ORDR_CANC_DAYS_NBR", type: "text" },
      { key: "etaDays", label: "ETA_DAYS", type: "text" },
      { key: "rsrvExpirDays", label: "RSRV_EXPIR_DAYS", type: "text" },
      { key: "lstChgTs", label: "LST_CHG_TS", type: "text" },
      { key: "lstChgNam", label: "LST_CHG_NAM", type: "text" },
    ],
  },
  {
    id: "order-flags",
    label: "Order Flags",
    icon: ShoppingCart,
    defaultOpen: true,
    fields: [
      { key: "ackPoFlg", label: "ACK_PO_FLG", type: "text" },
      { key: "ackPromoFlg", label: "ACK_PROMO_FLG", type: "text" },
      { key: "holdOrderFlg", label: "HOLD_ORDER_FLG", type: "text" },
      { key: "ackRptFlg", label: "ACK_RPT_FLG", type: "text" },
      { key: "autoPoChgFlg", label: "AUTO_PO_CHG_FLG", type: "text" },
      { key: "futOrdrSw", label: "FUT_ORDR_SW", type: "text" },
      { key: "ackDelaySw", label: "ACK_DELAY_SW", type: "text" },
      { key: "ordrCancDaysFlg", label: "ORDR_CANC_DAYS_FLG", type: "text" },
      { key: "rejOrdrHdrFlg", label: "REJ_ORDR_HDR_FLG", type: "text" },
      { key: "rejCnsCmpHdrFlg", label: "REJ_CNSCMP_HDR_FLG", type: "text" },
      { key: "preImHoldFlg", label: "PRE_IM_HOLD_FLG", type: "text" },
    ],
  },
  {
    id: "routing",
    label: "Routing & Distribution",
    icon: Truck,
    defaultOpen: false,
    fields: [
      { key: "baserateFlg", label: "BASERATE_FLG", type: "text" },
      { key: "airBrSeqFlg", label: "AIR_BR_SEQ_FLG", type: "text" },
      { key: "brSeqOrideFlg", label: "BR_SEQ_ORIDE_FLG", type: "text" },
      { key: "multBrSeqFlg", label: "MULT_BR_SEQ_FLG", type: "text" },
      { key: "exportBrSeqFlg", label: "EXPORT_BR_SEQ_FLG", type: "text" },
      { key: "distDepthFlg", label: "DIST_DEPTH_FLG", type: "text" },
      { key: "multiDistFlg", label: "MULTI_DIST_FLG", type: "text" },
      { key: "bestWhseFlg", label: "BEST_WHSE_FLG", type: "text" },
      { key: "singleWhseFlg", label: "SINGLE_WHSE_FLG", type: "text" },
      { key: "saveFrtFlg", label: "SAVE_FRT_FLG", type: "text" },
      { key: "saveDistFlg", label: "SAVE_DIST_FLG", type: "text" },
      { key: "multShpToFlg", label: "MULT_SHP_TO_FLG", type: "text" },
      { key: "multShpSortSeq", label: "MULT_SHP_SORT_SEQ", type: "text" },
    ],
  },
  {
    id: "customer",
    label: "Customer Settings",
    icon: Users,
    defaultOpen: false,
    fields: [
      { key: "chkCustPrcFlg", label: "CHK_CUST_PRC_FLG", type: "text" },
      { key: "saveCustPrcFlg", label: "SAVE_CUST_PRC_FLG", type: "text" },
      { key: "updCustSkuFlg", label: "UPD_CUST_SKU_FLG", type: "text" },
      { key: "cascadeSkuFlg", label: "CASCADE_SKU_FLG", type: "text" },
      { key: "instRebatMsgFlg", label: "INST_REBAT_MSG_FLG", type: "text" },
      { key: "specPrcFlg", label: "SPEC_PRC_FLG", type: "text" },
      { key: "vlaFlg", label: "VLA_FLG", type: "text" },
      { key: "aggCdCpblFlg", label: "AGG_CD_CPBL_FLG", type: "text" },
      { key: "prntOrdrFlg", label: "PRNT_ORDR_FLG", type: "text" },
    ],
  },
  {
    id: "processing",
    label: "Processing",
    icon: Settings,
    defaultOpen: false,
    fields: [
      { key: "systemPartsFlg", label: "SYSTEM_PARTS_FLG", type: "text" },
      { key: "voidTaxableFlg", label: "VOID_TAXABLE_FLG", type: "text" },
      { key: "casepackMsgFlg", label: "CASEPACK_MSG_FLG", type: "text" },
      { key: "boBrXferFlg", label: "BO_BR_XFER_FLG", type: "text" },
      { key: "clsXFltrTypCd", label: "CLS_X_FLTR_TYP_CD", type: "text" },
      { key: "clsSFltrTypCd", label: "CLS_S_FLTR_TYP_CD", type: "text" },
      { key: "clsXHldFlg", label: "CLS_X_HLD_FLG", type: "text" },
      { key: "autoSplitFlg", label: "AUTO_SPLIT_FLG", type: "text" },
    ],
  },
  {
    id: "advanced",
    label: "Advanced Settings",
    icon: Shield,
    defaultOpen: false,
    fields: [
      { key: "euCaptureFlg", label: "EU_CAPTURE_FLG", type: "text" },
      { key: "customCarrFlg", label: "CUSTOM_CARR_FLG", type: "text" },
      { key: "stStoreOvrRdFlg", label: "ST_STORE_OVRRD_FLG", type: "text" },
      { key: "rsrvAllowed", label: "RSRV_ALLOWED", type: "text" },
      { key: "configVisibleFlg", label: "CONFIG_VISIBLE_FLG", type: "text" },
      { key: "etaCalcFlg", label: "ETA_CALC_FLG", type: "text" },
      { key: "addrValidFlg", label: "ADDR_VALID_FLG", type: "text" },
    ],
  },
];

const SUMMARY_FIELDS = [
  { key: "coCd", label: "Company Code", icon: BarChart2 },
  { key: "partnerId", label: "Partner ID", icon: Users },
  { key: "custPrty", label: "Customer Priority", icon: BarChart2 },
  { key: "skipFrTm", label: "Skip From Time", icon: Clock },
  { key: "skipToTm", label: "Skip To Time", icon: Clock },
  { key: "lstChgTs", label: "Last Changed", icon: Clock },
];

const SUMMARY_KEYS = new Set(SUMMARY_FIELDS.map((f) => f.key));

function parseFallbackFromParams(searchParams) {
  return {
    coCd: searchParams.get("coCd") || "—",
    partnerId: searchParams.get("partnerId") || "—",
  };
}

function resolveRecord(searchParams) {
  const ref = searchParams.get("ref");
  const stored = loadDetailsRecord(ref, "po-switch");
  return stored || parseFallbackFromParams(searchParams);
}

export default function PoSwitchDetailsPage({ searchParams }) {
  const record = resolveRecord(searchParams);

  const detailGroups = FIELD_GROUPS.map((group) => ({
    ...group,
    fields: group.fields.filter((f) => !SUMMARY_KEYS.has(f.key)),
  })).filter((group) => group.fields.length > 0);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      <main className="max-w-[1400px] mx-auto p-4 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h1 className="text-xl font-bold text-[#0F6CBD]">PO Switch Details</h1>
            <p className="text-xs text-[#6B7280] mt-0.5">
              All IE_IN_PO_SW fields for CO_CD: {record.coCd} / Partner: {record.partnerId}
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.close()}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#0F6CBD] border border-[#D6E4F7] rounded-xl px-3 py-1.5 hover:bg-[#EFF6FF]"
          >
            <ArrowLeft size={13} />
            Close Tab
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {SUMMARY_FIELDS.map((field) => (
            <SummaryTile
              key={field.key}
              label={field.label}
              value={formatDetailValue(field, record[field.key])}
              icon={field.icon}
            />
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 xl:grid-cols-2 gap-4 pb-6">
          {detailGroups.map((group) => (
            <AccordionCard
              key={group.id}
              title={group.label}
              icon={group.icon}
              defaultOpen={group.defaultOpen}
            >
              <div>
                {group.fields.map((field) => (
                  <DetailFieldRow
                    key={field.key}
                    label={field.label}
                    value={formatDetailValue(field, record[field.key])}
                  />
                ))}
              </div>
            </AccordionCard>
          ))}
        </div>
      </main>
    </div>
  );
}
