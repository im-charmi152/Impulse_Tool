import { Settings } from "lucide-react";
import SectionCard from "../common/SectionCard";

function SetupConfigDetails({ config }) {
  return (
    <SectionCard icon={Settings} title="Setup / Configuration Details">
      <div className="space-y-1">
        {config.map((row, i) => (
          <div key={i} className="grid grid-cols-2 gap-2">
            {[0, 2].map((j) => (
              <div
                key={j}
                className="flex justify-between py-1 border-b border-gray-50 last:border-0"
              >
                <span className="text-[10px] text-gray-400 min-w-0 flex-1 truncate">
                  {row[j]}
                </span>
                <span className="text-[10px] font-medium text-gray-700 text-right min-w-0 flex-1 truncate ml-1">
                  {row[j + 1]}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

export default SetupConfigDetails;
