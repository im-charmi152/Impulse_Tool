import { useMemo, useState } from "react";
import { Download, ChevronLeft, ChevronRight, Layers } from "lucide-react";
import SectionCard from "../common/SectionCard";
import { recordEvent } from "../../utils/auditLog";
import { openLineItemDetailsTab } from "../../utils/detailsNavigation";

const PAGE_SIZE_OPTIONS = [10, 25];

const LINE_ITEM_COLUMNS = [
  { key: "custCoCd", label: "CUST_CO_CD" },
  { key: "custBr", label: "CUST_BR" },
  { key: "custNbr", label: "CUST_NBR" },
  { key: "custPoNbr", label: "CUST_PO_NBR" },
  { key: "imiLineNbr", label: "IMI_LINE_NBR" },
  { key: "imiPartNbr", label: "IMI_PART_NBR" },
  { key: "qtyOrdered", label: "QTY_ORDERED" },
  { key: "custSfx", label: "CUST_SFX" },
  { key: "sdqSeqNbr", label: "SDQ_SEQ_NBR" },
  { key: "custPoDt", label: "CUST_PO_DT" },
  { key: "custPoSeqNbr", label: "CUST_PO_SEQ_NBR" },
  { key: "lineSeqNbr", label: "LINE_SEQ_NBR" },
  { key: "prtnrLineNbr", label: "PRTNR_LINE_NBR" },
  { key: "custPartNbr", label: "CUST_PART_NBR" },
  { key: "mfctrPartNbr", label: "MFCTR_PART_NBR" },
  { key: "upcPartNbr", label: "UPC_PART_NBR" },
  { key: "custQotdPrc", label: "CUST_QOTD_PRC" },
  { key: "csPkQty", label: "CS_PK_QTY" },
  { key: "custPartDesc1", label: "CUST_PART_DESC_1" },
  { key: "custPartDesc2", label: "CUST_PART_DESC_2" },
  { key: "rsvInvtyFlg", label: "RSV_INVTY_FLG" },
  { key: "imiPartDesc1", label: "IMI_PART_DESC_1" },
  { key: "imiPartDesc2", label: "IMI_PART_DESC_2" },
  { key: "prcUseFlg", label: "PRC_USE_FLG" },
  { key: "lineReqDlvyDt", label: "LINE_REQ_DLVY_DT" },
  { key: "lineReqShipDt", label: "LINE_REQ_SHIP_DT" },
  { key: "lineReqCancDt", label: "LINE_REQ_CANC_DT" },
  { key: "lineBoFlg", label: "LINE_BO_FLG" },
  { key: "aggrCd", label: "AGGR_CD" },
  { key: "miscChrgSku", label: "MISC_CHRG_SKU" },
  { key: "assetTagFlg", label: "ASSET_TAG_FLG" },
  { key: "oprtSys", label: "OPRT_SYS" },
  { key: "dlvyMthd", label: "DLVY_MTHD" },
  { key: "labType", label: "LAB_TYPE" },
  { key: "qtyPerConfig", label: "QTY_PER_CONFIG" },
  { key: "configQty", label: "CONFIG_QTY" },
  { key: "itemTypeInd", label: "ITEM_TYPE_IND" },
  { key: "qtyAlloc", label: "QTY_ALLOC" },
  { key: "endUserPrc", label: "END_USER_PRC" },
  { key: "imiRejCd", label: "IMI_REJ_CD" },
  { key: "acptRejFlg", label: "ACPT_REJ_FLG" },
  { key: "miscCd", label: "MISC_CD" },
  { key: "lineTypeSw", label: "LINE_TYPE_SW" },
  { key: "qtyBo", label: "QTY_BO" },
  { key: "unitPrc", label: "UNIT_PRC" },
  { key: "rtlPrc", label: "RTL_PRC" },
  { key: "frgnUnitPrc", label: "FRGN_UNIT_PRC" },
  { key: "subPartNbr", label: "SUB_PART_NBR" },
  { key: "eta", label: "ETA" },
  { key: "freeItemSw", label: "FREE_ITEM_SW" },
  { key: "vendNbr", label: "VEND_NBR" },
  { key: "lineVlaAuthNbr", label: "LINE_VLA_AUTH_NBR" },
  { key: "euAddrLoc", label: "EU_ADDR_LOC" },
  { key: "euInfoReqFlg", label: "EU_INFO_REQ_FLG" },
  { key: "busRegnCd", label: "BUS_REGN_CD" },
  { key: "custSpecHndlCd", label: "CUST_SPEC_HNDL_CD" },
  { key: "serialNbrFlg", label: "SERIAL_NBR_FLG" },
  { key: "svcAmt", label: "SVC_AMT" },
  { key: "svcQty", label: "SVC_QTY" },
  { key: "htImiRejCd", label: "HT_IMI_REJ_CD" },
  { key: "etaSrcCd", label: "ETA_SRC_CD" },
  { key: "htInitRejCd", label: "HT_INIT_REJ_CD" },
  { key: "bidNbr", label: "BID_NBR" },
  { key: "bidVrsnNbr", label: "BID_VRSN_NBR" },
  { key: "extVendPartNbr", label: "EXT_VEND_PART_NBR" },
  { key: "origSpplPartNbr", label: "ORIG_SPPL_PART_NBR" },
  { key: "hermShipFrBrNbr", label: "HERM_SHIP_FR_BR_NBR" },
  { key: "hermUnitCostAmt", label: "HERM_UNIT_COST_AMT" },
  { key: "hermUnitPrcAmt", label: "HERM_UNIT_PRC_AMT" },
  { key: "hermLineTypeCd", label: "HERM_LINE_TYPE_CD" },
  { key: "hermStusFlg", label: "HERM_STUS_FLG" },
  { key: "imiRejCdDesc", label: "IMI_REJ_CD_DESC" },
  { key: "lineVmfInfoSw", label: "LINE_VMF_INFO_SW" },
  { key: "futLinePromDt", label: "FUT_LINE_PROM_DT" },
  { key: "ctoUnitCostAmt", label: "CTO_UNIT_COST_AMT" },
  { key: "ctoUnitPrcAmt", label: "CTO_UNIT_PRC_AMT" },
  { key: "linkId", label: "LINK_ID" },
  { key: "euPpPrcAmt", label: "EU_PP_PRC_AMT" },
  { key: "euPpPurDt", label: "EU_PP_PUR_DT" },
  { key: "termEndDt", label: "TERM_END_DT" },
  { key: "quoteLineInd", label: "QUOTE_LINE_IND" },
  { key: "vmfLneHldInd", label: "VMF_LNE_HLD_IND" },
  { key: "imiHoldCd", label: "IMI_HOLD_CD" },
];

function LineItemDetails({ items }) {
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  const rangeStart = items.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, items.length);

  return (
    <>
    <SectionCard
      icon={Layers}
      title="Line-Item Details"
      actions={
        <button
          onClick={() => recordEvent("export", { type: "line-items" })}
          className="flex items-center gap-1.5 text-xs text-[#0F6CBD] hover:text-[#0A5CA6] border border-[#D6E4F7] rounded-xl px-2.5 py-1 hover:bg-[#EFF6FF]"
        >
          <Download size={11} />
          Export
        </button>
      }
    >
      <div className="overflow-x-auto -mx-1">
        <table className="w-full text-xs min-w-[760px]">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#D6E4F7]">
              {LINE_ITEM_COLUMNS.map((column) => (
                <th
                  key={column.key}
                  className="text-left px-2 py-2 font-semibold text-[#6B7280] text-[10px] uppercase tracking-wide whitespace-nowrap"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageItems.map((item, index) => {
              return (
              <tr
                key={`${item.imiLineNbr ?? "line"}-${index}`}
                onClick={() => openLineItemDetailsTab(item)}
                className="border-b border-[#D6E4F7] transition-colors cursor-pointer hover:bg-[#EFF6FF]"
              >
                {LINE_ITEM_COLUMNS.map((column) => (
                  <td
                    key={`${item.imiLineNbr ?? index}-${column.key}`}
                    className="px-2 py-2 text-[#6B7280] whitespace-nowrap"
                  >
                    {item[column.key] ?? "—"}
                  </td>
                ))}
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-3 text-[10px] text-[#6B7280]">
        <span>
          Showing {rangeStart} to {rangeEnd} of {items.length} items
        </span>
        <div className="flex items-center gap-1">
          <button
            className="p-1 rounded-lg border border-[#D6E4F7] hover:bg-[#EFF6FF] disabled:opacity-40"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft size={11} />
          </button>
          <button className="w-6 h-6 rounded-lg bg-[#0F6CBD] text-white text-[10px] font-bold">
            {page}
          </button>
          <button
            className="p-1 rounded-lg border border-[#D6E4F7] hover:bg-[#EFF6FF] disabled:opacity-40"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            <ChevronRight size={11} />
          </button>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="ml-2 border border-[#D6E4F7] rounded-lg px-1.5 py-0.5 text-[10px] focus:outline-none"
          >
            {PAGE_SIZE_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n} / page
              </option>
            ))}
          </select>
        </div>
      </div>
    </SectionCard>
    </>
  );
}

export default LineItemDetails;
