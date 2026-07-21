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
        <button className="flex items-center gap-1 text-[10px] text-blue-600 hover:underline">
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
                ? "bg-[#003087] text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "logs" ? (
        <>
          <div className="font-mono text-[10px] space-y-1.5 bg-gray-900 rounded-md p-2.5 -m-1 overflow-hidden">
            {logs.map((log, i) => (
              <div key={i} className="flex items-start gap-1.5 min-w-0">
                <span className="text-gray-500 whitespace-nowrap flex-shrink-0">{log.time}</span>
                <span className="text-green-400 font-bold flex-shrink-0">{log.level}</span>
                <span className="text-gray-300 truncate">{log.msg}</span>
              </div>
            ))}
          </div>
          <button className="mt-2 text-xs text-blue-600 hover:underline font-medium block text-center w-full">
            View More Logs
          </button>
        </>
      ) : (
        <div className="space-y-2">
          {alerts.length === 0 && (
            <div className="text-xs text-gray-400 text-center py-4">No active alerts</div>
          )}
          {alerts.map((a, i) => (
            <div key={i} className="border border-gray-100 rounded-md p-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-gray-700">{a.alert}</span>
                <Badge color={statusToColor(a.severity)}>{a.severity}</Badge>
              </div>
              <div className="text-[10px] text-gray-500">{a.details}</div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}

export default DatadogPanel;
