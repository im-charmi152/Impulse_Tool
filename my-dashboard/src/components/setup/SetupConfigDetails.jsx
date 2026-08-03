import { useMemo, useState, useCallback } from "react";
import { Settings } from "lucide-react";
import SectionCard from "../common/SectionCard";
import Badge from "../common/Badge";
import LineItemDrawer from "../order/lineitem/LineItemDrawer";
import { PARTNER_SETUP_FIELD_GROUPS } from "./setupFieldConfig";

const SUMMARY_COLUMNS = [
  { key: "coCd", label: "Company Code (CO_CD)" },
  { key: "partnerId", label: "Partner ID" },
  { key: "partnerTypeCd", label: "Partner Type" },
  { key: "srceSysId", label: "Source System" },
  { key: "formatId", label: "Format" },
  { key: "commuId", label: "Communication ID" },
  { key: "activeStatus", label: "Active Status" },
];

function isPresent(value) {
  return value != null && value !== "" && value !== "—";
}

function deriveActiveStatus(setup) {
  const hold = String(setup.holdCd ?? "").trim();
  if (hold && hold !== "0" && hold.toUpperCase() !== "N") return "On Hold";
  if (isPresent(setup.deactvDt)) return "Inactive";
  if (isPresent(setup.actvDt)) return "Active";
  return "Unknown";
}

function statusColor(status) {
  if (status === "Active") return "green";
  if (status === "Inactive") return "gray";
  if (status === "On Hold") return "amber";
  return "blue";
}

function normalizeSetupRecord(record = {}) {
  const normalized = {
    coCd: record.coCd ?? record.CO_CD ?? "—",
    partnerId: record.partnerId ?? record.PARTNER_ID ?? "—",
    partnerTypeCd: record.partnerTypeCd ?? record.PARTNER_TYPE_CD ?? "—",

    srceSysId: record.srceSysId ?? record.SRCE_SYS_ID ?? "—",
    srceSysKeyId: record.srceSysKeyId ?? record.SRCE_SYS_KEY_ID ?? "—",
    formatId: record.formatId ?? record.FORMAT_ID ?? "—",
    docId: record.docId ?? record.DOC_ID ?? "—",

    commuId: record.commuId ?? record.COMMU_ID ?? "—",
    internetAddrTxt: record.internetAddrTxt ?? record.INTERNET_ADDR_TXT ?? "—",
    dirFlgCd: record.dirFlgCd ?? record.DIR_FLG_CD ?? "—",
    sendThruId: record.sendThruId ?? record.SEND_THRU_ID ?? "—",

    dataStoreMechId: record.dataStoreMechId ?? record.DATA_STORE_MECH_ID ?? "—",
    prcsOptnFlg: record.prcsOptnFlg ?? record.PRCS_OPTN_FLG ?? "—",
    batchSplitCnt: record.batchSplitCnt ?? record.BATCH_SPLIT_CNT ?? "—",
    ovrdApplBatchId: record.ovrdApplBatchId ?? record.OVRD_APPL_BATCH_ID ?? "—",

    freqId: record.freqId ?? record.FREQ_ID ?? "—",
    cycleIntvl: record.cycleIntvl ?? record.CYCLE_INTVL ?? "—",
    cycStrtTm: record.cycStrtTm ?? record.CYC_STRT_TM ?? "—",
    cycEndTm: record.cycEndTm ?? record.CYC_END_TM ?? "—",
    cycleLstRunTs: record.cycleLstRunTs ?? record.CYCLE_LST_RUN_TS ?? "—",

    actvDt: record.actvDt ?? record.ACTV_DT ?? "—",
    deactvDt: record.deactvDt ?? record.DEACTV_DT ?? "—",
    holdCd: record.holdCd ?? record.HOLD_CD ?? "—",

    lstChgTs: record.lstChgTs ?? record.LST_CHG_TS ?? "—",
    lstChgNam: record.lstChgNam ?? record.LST_CHG_NAM ?? "—",

    setupNotesTxt: record.setupNotesTxt ?? record.SETUP_NOTES_TXT ?? "—",
  };

  return { ...normalized, activeStatus: deriveActiveStatus(normalized) };
}

function SetupConfigDetails({ config }) {
  const [selectedSetup, setSelectedSetup] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const records = useMemo(() => {
    if (!Array.isArray(config)) return [];
    if (config.length > 0 && typeof config[0] === "object" && !Array.isArray(config[0])) {
      return config.map((entry) => normalizeSetupRecord(entry));
    }
    return [];
  }, [config]);

  const openDrawer = useCallback((record) => {
    setSelectedSetup(record);
    setDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  return (
    <>
      <SectionCard icon={Settings} title="Partner Setup Details">
        <div className="overflow-x-auto -mx-1 max-h-[340px] overflow-y-auto">
          <table className="w-full text-xs min-w-[760px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {SUMMARY_COLUMNS.map((column) => (
                  <th
                    key={column.key}
                    className="text-left px-2 py-2 font-semibold text-gray-500 text-[10px] uppercase tracking-wide whitespace-nowrap"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {records.map((row, index) => {
                const isSelected =
                  selectedSetup != null &&
                  selectedSetup.coCd === row.coCd &&
                  selectedSetup.partnerId === row.partnerId;

                return (
                  <tr
                    key={`${row.coCd}-${row.partnerId}-${index}`}
                    onClick={() => openDrawer(row)}
                    className={`border-b border-gray-50 transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-blue-50 border-l-2 border-l-blue-500"
                        : "hover:bg-gray-50/50"
                    }`}
                  >
                    {SUMMARY_COLUMNS.map((column) => (
                      <td
                        key={`${row.partnerId}-${column.key}`}
                        className="px-2 py-2 text-gray-600 whitespace-nowrap"
                      >
                        {column.key === "activeStatus" ? (
                          <Badge color={statusColor(row.activeStatus)}>{row.activeStatus}</Badge>
                        ) : (
                          row[column.key] ?? "—"
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <LineItemDrawer
        open={drawerOpen}
        onClose={closeDrawer}
        item={selectedSetup}
        fieldGroups={PARTNER_SETUP_FIELD_GROUPS}
        title="Partner Setup Details"
        subtitle={
          selectedSetup
            ? `${selectedSetup.coCd ?? "—"} · ${selectedSetup.partnerId ?? "—"}`
            : "Partner Setup"
        }
        searchPlaceholder="Search partner setup fields…"
        emptyMessage="No partner setup selected."
      />
    </>
  );
}

export default SetupConfigDetails;
