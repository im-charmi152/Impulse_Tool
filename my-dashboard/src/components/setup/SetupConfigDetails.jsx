import { useMemo } from "react";
import { Settings } from "lucide-react";
import SectionCard from "../common/SectionCard";
import Badge from "../common/Badge";
import { openPartnerSetupDetailsTab } from "../../utils/detailsNavigation";
import { normalizeSetupRecord, statusColor } from "./setupDetailsUtils";

const SUMMARY_COLUMNS = [
  { key: "coCd", label: "Company Code (CO_CD)" },
  { key: "partnerId", label: "Partner ID" },
  { key: "partnerTypeCd", label: "Partner Type" },
  { key: "srceSysId", label: "Source System" },
  { key: "formatId", label: "Format" },
  { key: "commuId", label: "Communication ID" },
  { key: "activeStatus", label: "Active Status" },
];

function SetupConfigDetails({ config }) {
  const records = useMemo(() => {
    if (!Array.isArray(config)) return [];
    if (config.length > 0 && typeof config[0] === "object" && !Array.isArray(config[0])) {
      return config.map((entry) => normalizeSetupRecord(entry));
    }
    return [];
  }, [config]);

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
                return (
                  <tr
                    key={`${row.coCd}-${row.partnerId}-${index}`}
                    onClick={() => openPartnerSetupDetailsTab(row)}
                    className="border-b border-gray-50 transition-colors cursor-pointer hover:bg-gray-50/50"
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
    </>
  );
}

export default SetupConfigDetails;
