import { GitBranch, Check, AlertTriangle, X, Clock3 } from "lucide-react";
import SectionCard from "../common/SectionCard";

/**
 * ============================================================
 * EDI STATE CODE STATUS MAPPING
 * ============================================================
 *
 * Backend provides stateCd.
 *
 * Warning:
 * 05EDP555
 * 05EDP556
 * 05EDP700
 * 05EDP704
 * 05EDP720
 * 05EDP730
 * 05EDP731
 * 9999OMIT
 *
 * Success:
 * 10EDP740
 * 75EDP799
 */

const EDI_PROCESSED_STATES = new Set([
  "10EDP740",
  "75EDP799",
]);

const EDI_WARNING_STATES = new Set([
  "05EDP555",
  "05EDP556",
  "05EDP700",
  "05EDP704",
  "05EDP720",
  "05EDP730",
  "05EDP731",
  "9999OMIT",
]);

/**
 * Convert backend stateCd into UI status.
 */
function getEdiStatus(stateCd) {
  if (!stateCd) {
    return "pending";
  }

  const normalizedStateCd = String(stateCd).trim().toUpperCase();

  if (EDI_PROCESSED_STATES.has(normalizedStateCd)) {
    return "success";
  }

  if (EDI_WARNING_STATES.has(normalizedStateCd)) {
    return "warning";
  }

  return "pending";
}

/**
 * ============================================================
 * STATUS CONFIGURATION
 * ============================================================
 */

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

/**
 * ============================================================
 * LEGEND
 * ============================================================
 */

function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-2.5 h-2.5 rounded-full ${color}`} />

      <span className="text-[11px] text-[#6B7280]">
        {label}
      </span>
    </div>
  );
}

/**
 * ============================================================
 * PROCESS FLOW SECTION
 * ============================================================
 *
 * stateCd comes from backend.
 *
 * Example:
 *
 * <ProcessFlowSection stateCd={data.stateCd} />
 *
 */

export default function ProcessFlowSection({ stateCd }) {
  /**
   * Determine EDI status from backend stateCd.
   */
  const ediStatus = getEdiStatus(stateCd);

  /**
   * Build flow dynamically.
   *
   * The first four steps remain as existing flow steps.
   *
   * The EDI steps are controlled by stateCd.
   */
  const flowSteps = [
    {
      id: 1,
      name: "Seeburger (SB)",
      status: "pending",
      time: " ",
    },

    {
      id: 2,
      name: "SB Msg Tracker",
      status: "pending",
      time: " ",
    },

    {
      id: 3,
      name: "C : D",
      status: "pending",
      time: " ",
    },

    {
      id: 4,
      name: "C : E",
      status: "pending",
      time: " ",
    },

    {
      id: 5,
      name: "Not Processed at EDI",
      status: ediStatus === "warning" ? "warning" : "pending",
      time: ediStatus === "warning" ? stateCd : " ",
    },

    {
      id: 6,
      name: "Processed at EDI",
      status: ediStatus === "success" ? "success" : "pending",
      time: ediStatus === "success" ? stateCd : " ",
    },
  ];

  return (
    <SectionCard
      icon={GitBranch}
      title="Processing Flow Status"
      actions={
        <div className="flex items-center gap-5">
          <LegendItem
            color="bg-green-500"
            label="Success"
          />

          <LegendItem
            color="bg-amber-400"
            label="Warning"
          />

          <LegendItem
            color="bg-red-500"
            label="Failed"
          />

          <LegendItem
            color="bg-gray-400"
            label="Pending"
          />
        </div>
      }
    >
      <div className="overflow-x-auto">
        <div className="flex justify-between items-start min-w-[900px] px-4 py-5">

          {flowSteps.map((step, index) => {
            const cfg = STATUS[step.status];
            const Icon = cfg.icon;

            return (
              <div
                key={step.id}
                className="relative flex flex-col items-center flex-1"
              >

                {/* ==================================================
                    CONNECTOR
                    ================================================== */}

                {index !== flowSteps.length - 1 && (
                  <div
                    className={`
                      absolute
                      top-4
                      left-1/2
                      w-full
                      h-[3px]
                      ${cfg.line}
                    `}
                    style={{ zIndex: 0 }}
                  />
                )}

                {/* ==================================================
                    STATUS CIRCLE
                    ================================================== */}

                <div
                  className={`
                    relative
                    z-10
                    w-8
                    h-8
                    rounded-full
                    flex
                    items-center
                    justify-center
                    shadow-sm
                    ${cfg.bg}
                  `}
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

                {/* ==================================================
                    LABEL
                    ================================================== */}

                <div className="mt-4 text-center">

                  <div
                    className="
                      text-[11px]
                      font-semibold
                      text-[#374151]
                      whitespace-nowrap
                    "
                  >
                    {step.name}
                  </div>

                  <div
                    className="
                      text-[10px]
                      text-[#6B7280]
                      mt-1
                    "
                  >
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