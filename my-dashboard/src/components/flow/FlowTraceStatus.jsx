import { useState } from "react";
import { Activity, CheckCircle2 } from "lucide-react";
import SectionCard from "../common/SectionCard";
import Badge from "../common/Badge";
import { statusToColor } from "../../utils/format";
import { FLOW_TYPES } from "../../data/navigation";

function FlowTraceStatus({ steps, flowTrace }) {
  const [flowId, setFlowId] = useState(FLOW_TYPES[0].id);
  const activeFlow = FLOW_TYPES.find((f) => f.id === flowId);
  const traceRows = flowTrace[flowId] || [];

  return (
    <SectionCard icon={Activity} title="Cycle Status">
      {/* High-level stepper */}
      <div className="overflow-x-auto pb-1">
        <div className="flex items-start min-w-[340px]">
          {steps.map((step, i) => (
            <div key={i} className="flex items-start flex-1 min-w-0">
              <div className="flex flex-col items-center flex-1 min-w-0">
                <div className="flex items-center w-full">
                  {i > 0 && (
                    <div className="flex-1 h-0.5 bg-green-400 -mt-0 min-w-[4px]" />
                  )}
                  <div className="w-7 h-7 rounded-full bg-green-500 border-2 border-green-600 flex items-center justify-center shadow-sm flex-shrink-0">
                    <CheckCircle2 size={14} className="text-white" strokeWidth={2.5} />
                  </div>
                  {i < steps.length - 1 && (
                    <div className="flex-1 h-0.5 bg-green-400 min-w-[4px]" />
                  )}
                </div>
                <div className="text-center mt-1.5 px-0.5">
                  <div className="text-[10px] font-semibold text-[#1F2937] leading-tight whitespace-pre-line">
                    {step.label}
                  </div>
                  <div className="text-[9px] text-[#6B7280] mt-0.5 leading-tight">
                    {step.time}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Per-flow trace table (System / Status / Timestamp / Remarks) */}
      <div className="mt-4 pt-4 border-t border-[#D6E4F7]">
        <div className="flex flex-wrap gap-1 mb-3">
          {FLOW_TYPES.map((flow) => (
            <button
              key={flow.id}
              onClick={() => setFlowId(flow.id)}
              className={`text-[10px] font-medium px-2.5 py-1 rounded-full transition-colors ${
                flow.id === flowId
                  ? "bg-[#0F6CBD] text-white"
                  : "bg-[#F8FAFC] text-[#6B7280] hover:bg-[#EFF6FF]"
              }`}
            >
              {flow.label}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[400px]">
            <thead>
              <tr className="border-b border-[#D6E4F7]">
                {["System", "Status", "Timestamp", "Remarks"].map((h) => (
                  <th
                    key={h}
                    className="text-left pb-1.5 text-[10px] font-semibold text-[#6B7280] uppercase tracking-wide"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {traceRows.map((row) => (
                <tr key={row.system} className="border-b border-[#D6E4F7] last:border-0">
                  <td className="py-1.5 font-medium text-[#1F2937]">{row.system}</td>
                  <td className="py-1.5">
                    <Badge color={statusToColor(row.status)}>{row.status}</Badge>
                  </td>
                  <td className="py-1.5 text-[#6B7280] text-[10px]">{row.timestamp}</td>
                  <td className="py-1.5 text-[#6B7280]">{row.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-[9px] text-[#6B7280] mt-2">
          {activeFlow.systems.join(" → ")}
        </div>
      </div>
    </SectionCard>
  );
}

export default FlowTraceStatus;
