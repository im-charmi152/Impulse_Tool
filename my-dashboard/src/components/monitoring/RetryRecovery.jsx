import { RotateCcw, CheckCircle2, Clock } from "lucide-react";
import SectionCard from "../common/SectionCard";

function RetryRecovery({ retryCandidates }) {
  const needsRetry = retryCandidates.length > 0;

  return (
    <SectionCard icon={RotateCcw} title="Retry / Recovery Information">
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
            needsRetry ? "bg-amber-100" : "bg-green-100"
          }`}
        >
          {needsRetry ? (
            <Clock size={24} className="text-amber-500" strokeWidth={2} />
          ) : (
            <CheckCircle2 size={24} className="text-green-500" strokeWidth={2} />
          )}
        </div>
        <div className="text-sm font-semibold text-gray-700 mb-1">
          {needsRetry ? "Retry Recommended" : "No Retries"}
        </div>
        {needsRetry ? (
          <ul className="text-xs text-gray-500 space-y-1">
            {retryCandidates.map((r, i) => (
              <li key={i}>
                <span className="font-medium text-gray-700">{r.system}:</span> {r.remarks}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-xs text-gray-400">
            No retry attempts were required for this transaction.
          </div>
        )}
      </div>
    </SectionCard>
  );
}

export default RetryRecovery;
