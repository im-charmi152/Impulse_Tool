
import { Database, ExternalLink } from "lucide-react";
import SectionCard from "../common/SectionCard";

function DatadogPanel({ logs, alerts }) {
  const openDetails = () => {
  window.open(
    "http://localhost:5173/", // Replace with your localhost URL
    "_blank",
    "noopener,noreferrer"
  );
};

  return (
    <SectionCard
      icon={Database}
      title="Datadog"
      actions={
        <button 
        onClick={openDetails}
        className="flex items-center gap-1 text-[10px] text-[#0F6CBD] hover:underline">
          More Details <ExternalLink size={10} />
        </button>
      }
    >
      <div className="flex flex-col items-center justify-center py-10">
  <Database
    size={36}
    className="text-[#0F6CBD] mb-3 opacity-80"
  />

  <p className="mt-2 text-xs text-[#6B7280] text-center max-w-md">
    View complete logs, traces, alerts and monitoring metrics
    from the Datadog dashboard.
  </p>
</div>
    </SectionCard>
  );
}

export default DatadogPanel;
