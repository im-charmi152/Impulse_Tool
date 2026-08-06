import {
  GitBranch,
  Check,
  AlertTriangle,
  X,
  Clock3,
} from "lucide-react";
import SectionCard from "../common/SectionCard";

const FLOW_STEPS = [
  {
    id: 1,
    name: "Seeburger (SB)",
    status: "success",
    time: "10:01:00 AM",
  },
  {
    id: 2,
    name: "SB Msg Tracker",
    status: "success",
    time: "10:01:30 AM",
  },
  {
    id: 3,
    name: "C : D",
    status: "success",
    time: "10:02:10 AM",
  },
  {
    id: 4,
    name: "C : E",
    status: "failed",
    time: "10:03:15 AM",
  },
  {
    id: 5,
    name: "EDI DB2",
    status: "pending",
    time: "10:04:00 AM",
  },
  {
    id: 6,
    name: "Impulse DB",
    status: "pending",
    time: "--",
  },
  {
    id: 7,
    name: "ODS DB",
    status: "pending",
    time: "--",
  },
];

const STATUS = {
  success: {
    bg: "bg-green-500",
    line: "bg-green-500",
    icon: Check,
  },
  warning: {
    bg: "bg-amber-400",
    line: "bg-amber-400",
    icon: AlertTriangle,
  },
  failed: {
    bg: "bg-red-500",
    line: "bg-red-500",
    icon: X,
  },
  pending: {
    bg: "bg-white border-2 border-gray-400",
    line: "bg-gray-300",
    icon: Clock3,
  },
};

function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-2.5 h-2.5 rounded-full ${color}`} />
      <span className="text-[11px] text-[#6B7280]">{label}</span>
    </div>
  );
}

export default function ProcessFlowSection() {
  return (
    <SectionCard
      icon={GitBranch}
      title="Processing Flow Status"
      actions={
        <div className="flex items-center gap-5">
          <LegendItem color="bg-green-500" label="Success" />
          <LegendItem color="bg-amber-400" label="Warning" />
          <LegendItem color="bg-red-500" label="Failed" />
          <LegendItem color="bg-gray-400" label="Pending" />
        </div>
      }
    >
      <div className="overflow-x-auto">
        <div className="flex justify-between items-start min-w-[900px] px-4 py-5">
          {FLOW_STEPS.map((step, index) => {
            const cfg = STATUS[step.status];
            const Icon = cfg.icon;

            return (
              <div
                key={step.id}
                className="relative flex flex-col items-center flex-1"
              >
                {/* Connector */}
                {index !== FLOW_STEPS.length - 1 && (
                  <div
                    className={`absolute top-4 left-1/2 w-full h-[3px] ${cfg.line}`}
                    style={{ zIndex: 0 }}
                  />
                )}

                {/* Circle */}
                <div
                  className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${cfg.bg}`}
                >
                  <Icon
                    size={15}
                    className={
                      step.status === "pending"
                        ? "text-gray-500"
                        : "text-white"
                    }
                  />
                </div>

                {/* Label */}
                <div className="mt-4 text-center">
                  <div className="text-[11px] font-semibold text-[#374151] whitespace-nowrap">
                    {step.name}
                  </div>

                  <div className="text-[10px] text-[#6B7280] mt-1">
                    {step.time}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SectionCard>
  );
}