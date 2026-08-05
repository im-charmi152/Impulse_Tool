import { useState } from "react";
import { Database, ExternalLink } from "lucide-react";
import SectionCard from "../common/SectionCard";
import Badge from "../common/Badge";
import { statusToColor } from "../../utils/format";

function DatadogPanel({ logs, alerts }) {
  const [tab, setTab] = useState("logs");

  return (
    <SectionCard
      icon={Database}
      title="Datadog"
      actions={
        <button className="flex items-center gap-1 text-[10px] text-[#0F6CBD] hover:underline">
          Open in Datadog <ExternalLink size={10} />
        </button>
      }
    >
      <div className="flex gap-1 mb-2">
        {[
          { id: "logs", label: "Logs" },
          { id: "alerts", label: `Alerts${alerts.length ? ` (${alerts.length})` : ""}` },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`text-[10px] font-medium px-2 py-1 rounded transition-colors ${
              tab === t.id
                ? "bg-[#0F6CBD] text-white"
                : "bg-[#F8FAFC] text-[#6B7280] hover:bg-[#EFF6FF]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "logs" ? (
        <>
          <div className="font-mono text-[10px] space-y-1.5 bg-[#111827] rounded-xl p-2.5 -m-1 overflow-hidden">
            {logs.map((log, i) => (
              <div key={i} className="flex items-start gap-1.5 min-w-0">
                <span className="text-[#6B7280] whitespace-nowrap flex-shrink-0">{log.time}</span>
                <span className="text-green-400 font-bold flex-shrink-0">{log.level}</span>
                <span className="text-[#DBEAFE] truncate">{log.msg}</span>
              </div>
            ))}
          </div>
          <button className="mt-2 text-xs text-[#0F6CBD] hover:underline font-medium block text-center w-full">
            View More Logs
          </button>
        </>
      ) : (
        <div className="space-y-2">
          {alerts.length === 0 && (
            <div className="text-xs text-[#6B7280] text-center py-4">No active alerts</div>
          )}
          {alerts.map((a, i) => (
            <div key={i} className="border border-[#D6E4F7] rounded-xl p-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-[#1F2937]">{a.alert}</span>
                <Badge color={statusToColor(a.severity)}>{a.severity}</Badge>
              </div>
              <div className="text-[10px] text-[#6B7280]">{a.details}</div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}

export default DatadogPanel;
