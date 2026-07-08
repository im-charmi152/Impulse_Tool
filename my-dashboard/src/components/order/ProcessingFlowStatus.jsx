import { Activity, CheckCircle2 } from "lucide-react";
import SectionCard from "../common/SectionCard";
import { PROCESSING_STEPS } from "../../data/mockData";

export default function ProcessingFlowStatus() {
  return (
    <SectionCard icon={Activity} title="Processing Flow Status">
      <div className="overflow-x-auto pb-1">
        <div className="flex items-start min-w-[340px]">
          {PROCESSING_STEPS.map((step, i) => (
            <div key={i} className="flex items-start flex-1 min-w-0">
              <div className="flex flex-col items-center flex-1 min-w-0">
                <div className="flex items-center w-full">
                  {i > 0 && (
                    <div className="flex-1 h-0.5 bg-green-400 -mt-0 min-w-[4px]" />
                  )}
                  <div className="w-7 h-7 rounded-full bg-green-500 border-2 border-green-600 flex items-center justify-center shadow-sm flex-shrink-0">
                    <CheckCircle2
                      size={14}
                      className="text-white"
                      strokeWidth={2.5}
                    />
                  </div>
                  {i < PROCESSING_STEPS.length - 1 && (
                    <div className="flex-1 h-0.5 bg-green-400 min-w-[4px]" />
                  )}
                </div>
                <div className="text-center mt-1.5 px-0.5">
                  <div className="text-[10px] font-semibold text-gray-700 leading-tight whitespace-pre-line">
                    {step.label}
                  </div>
                  <div className="text-[9px] text-gray-400 mt-0.5 leading-tight">
                    {step.time}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}
