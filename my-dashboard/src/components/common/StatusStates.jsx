import { Loader2, SearchX, AlertCircle } from "lucide-react";

export function LoadingState() {
  return (
    <div className="enterprise-card flex flex-col items-center justify-center py-24 text-center">
      <Loader2 size={28} className="text-[#2563EB] animate-spin mb-3" />
      <div className="text-sm font-medium text-[#6B7280]">
        Tracing order across DB2, ODS, TBX, MQ and Datadog…
      </div>
    </div>
  );
}

export function EmptyState() {
  return (
    <div className="enterprise-card flex flex-col items-center justify-center py-24 text-center">
      <div className="w-12 h-12 bg-[#EFF6FF] rounded-full flex items-center justify-center mb-3">
        <SearchX size={22} className="text-[#6B7280]" />
      </div>
      <div className="text-sm font-semibold text-[#111827] mb-1">
        No matching order found
      </div>
      <div className="text-xs text-[#6B7280] max-w-xs">
        Double-check the value and try another identifier — Order Number,
        SKU, Account, Partner ID, PO Number, or Transaction ID.
      </div>
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="enterprise-card flex flex-col items-center justify-center py-24 text-center border-red-200">
      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
        <AlertCircle size={22} className="text-red-500" />
      </div>
      <div className="text-sm font-semibold text-[#111827] mb-1">
        Couldn't complete the search
      </div>
      <div className="text-xs text-[#6B7280] max-w-xs mb-4">{message}</div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-xs font-semibold text-white bg-[#2563EB] rounded-xl px-4 py-1.5 hover:bg-[#1D4ED8]"
        >
          Try Again
        </button>
      )}
    </div>
  );
}

export function IdleState() {
  return (
    <div className="enterprise-card flex flex-col items-center justify-center py-24 text-center border-dashed">
      <div className="text-sm font-medium text-[#6B7280]">
        Enter an identifier above and press Search to trace an order.
      </div>
    </div>
  );
}
