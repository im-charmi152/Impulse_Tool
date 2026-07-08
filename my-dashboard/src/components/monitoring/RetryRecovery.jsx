import { RotateCcw, CheckCircle2 } from "lucide-react";
import SectionCard from "../common/SectionCard";

export default function RetryRecovery() {
  return (
    <SectionCard icon={RotateCcw} title="Retry / Recovery Information">
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
          <CheckCircle2 size={24} className="text-green-500" strokeWidth={2} />
        </div>
        <div className="text-sm font-semibold text-gray-700 mb-1">
          No Retries
        </div>
        <div className="text-xs text-gray-400">
          No retry attempts were required for this transaction.
        </div>
      </div>
    </SectionCard>
  );
}
