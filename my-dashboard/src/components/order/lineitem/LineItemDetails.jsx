import { useMemo, useState } from "react";
import { Download, ChevronLeft, ChevronRight, Layers } from "lucide-react";
import SectionCard from "../../common/SectionCard";
import { recordEvent } from "../../../utils/auditLog";
import { openLineItemDetailsTab } from "../../../utils/detailsNavigation";

const PAGE_SIZE_OPTIONS = [10, 25];

const LINE_ITEM_COLUMNS = [
  { key: "companyCd", label: "COMPANY_CD" },
  { key: "branchNbr", label: "BRANCH_NBR" },
  { key: "custNbr", label: "CUST_NBR" },
  { key: "custPoNbr", label: "CUST_PO_NBR" },
  { key: "ordrNbr", label: "ORDR_NBR" },
  { key: "lineNbr", label: "LINE_NBR" },
  { key: "imPartNbr", label: "IM_PART_NBR" },
  { key: "qtyOrded", label: "QTY_ORDED" },
  { key: "qtyBord", label: "QTY_BORD" },
  { key: "qtyShpd", label: "QTY_SHPD" },
  { key: "unitPrc", label: "UNIT_PRC" },
  { key: "unitCost", label: "UNIT_COST" },
  { key: "lineStus", label: "LINE_STUS" },
  { key: "lineTyp", label: "LINE_TYP" },
  { key: "custLineNbr", label: "CUST_LINE_NBR" },
  { key: "custItemNbr", label: "CUST_ITEM_NBR" },
  { key: "vendPartNbr", label: "VEND_PART_NBR" },
  { key: "upcNbr", label: "UPC_NBR" },
  { key: "entryTime", label: "ENTRY_TIME" },
  { key: "boEtaDate", label: "BO_ETA_DATE" },
  { key: "holdCode", label: "HOLD_CODE" },
  { key: "aggregateCode", label: "AGGREGATE_CODE" },
  { key: "mchgCd", label: "MCHG_CD" },
  { key: "configurationLab", label: "CONFIGURATION_LAB" },
  { key: "serialNbrAvailSw", label: "SERIAL_NBR_AVAIL_SW" },
  { key: "freeItemSw", label: "FREE_ITEM_SW" },
  { key: "vendNbr", label: "VEND_NBR" },
  { key: "relatedGovtBidVsn", label: "RELATED_GOVT_BID_VSN" },
  { key: "relatedGovtBidGsn", label: "RELATED_GOVT_BID_GSN" },
  { key: "odsLstUpdDt", label: "ODS_LST_UPD_DT" },
  { key: "custSfx", label: "CUST_SFX" },
  { key: "sdqSeqNbr", label: "SDQ_SEQ_NBR" },
  { key: "custPoDt", label: "CUST_PO_DT" },
  { key: "custPoSeqNbr", label: "CUST_PO_SEQ_NBR" },
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
                key={`${item.lineNbr ?? "line"}-${index}`}
                onClick={() => openLineItemDetailsTab(item)}
                className="border-b border-[#D6E4F7] transition-colors cursor-pointer hover:bg-[#EFF6FF]"
              >
                {LINE_ITEM_COLUMNS.map((column) => (
                  <td
                    key={`${item.lineNbr ?? index}-${column.key}`}
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
