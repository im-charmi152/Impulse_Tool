import { Database, ExternalLink } from "lucide-react";
import SectionCard from "../common/SectionCard";
import { LOGS } from "../../data/mockData";

export default function DatadogLogs() {
  return (
    <SectionCard
      icon={Database}
      title="Datadog Logs"
      actions={
        <button className="flex items-center gap-1 text-[10px] text-blue-600 hover:underline">
          Open in Datadog <ExternalLink size={10} />
        </button>
      }
    >
      <div className="font-mono text-[10px] space-y-1.5 bg-gray-900 rounded-md p-2.5 -m-1 overflow-hidden">
        {LOGS.map((log, i) => (
          <div key={i} className="flex items-start gap-1.5 min-w-0">
            <span className="text-gray-500 whitespace-nowrap flex-shrink-0">
              {log.time}
            </span>
            <span className="text-green-400 font-bold flex-shrink-0">
              {log.level}
            </span>
            <span className="text-gray-300 truncate">{log.msg}</span>
          </div>
        ))}
      </div>
      <button className="mt-2 text-xs text-blue-600 hover:underline font-medium block text-center w-full">
        View More Logs
      </button>
    </SectionCard>
  );
}
