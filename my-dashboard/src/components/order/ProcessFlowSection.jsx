import { useEffect, useState } from "react";
import { GitBranch, Check, AlertTriangle, X, Clock3 } from "lucide-react";

import SectionCard from "../common/SectionCard";

const FLOW_STEPS = [
  {
    id: 1,
    name: "Seeburger (SB)",
  },
  {
    id: 2,
    name: "SB Msg Tracker",
  },
  {
    id: 4,
    name: "C : E",
  },
  {
    id: 5,
    name: "Not Processed at EDI",
  },
  {
    id: 6,
    name: "Processed at EDI",
  },
];

const STATUS = {
  success: {
    bg: "bg-green-500",
    icon: Check,
  },

  warning: {
    bg: "bg-amber-400",
    icon: AlertTriangle,
  },

  failed: {
    bg: "bg-red-500",
    icon: X,
  },

  pending: {
    bg: "bg-white border-2 border-gray-400",
    icon: Clock3,
  },
};

const EDI_SUCCESS_STATES = new Set(["75EDP799"]);

const EDI_WARNING_STATES = new Set([
  "05EDP555",
  "05EDP556",
  "05EDP700",
  "05EDP704",
  "05EDP720",
  "05EDP730",
  "05EDP731",
  "10EDP740",
  "9999OMIT",
]);

function getEdiStatus(eoStateCd) {
  if (!eoStateCd) {
    return "pending";
  }

  const normalizedState = String(eoStateCd).trim().toUpperCase();

  if (EDI_SUCCESS_STATES.has(normalizedState)) {
    return "success";
  }

  if (EDI_WARNING_STATES.has(normalizedState)) {
    return "warning";
  }

  return "pending";
}

function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`w-2.5 h-2.5 rounded-full ${color}`} />

      <span className="text-[11px] text-[#6B7280]">{label}</span>
    </div>
  );
}

export default function ProcessFlowSection({ eoStateCd }) {
  const ediStatus = getEdiStatus(eoStateCd);

  /*
   * currentStep represents the furthest step
   * that has been reached.
   *
   * -1 = animation not started
   *  0 = Seeburger
   *  1 = SB Msg Tracker
   *  2 = C:E
   *  3 = Not Processed at EDI
   *  4 = Processed at EDI
   */
  const [currentStep, setCurrentStep] = useState(-1);

  /*
   * Start the journey again whenever eoStateCd changes.
   */
  useEffect(() => {
    setCurrentStep(-1);

    if (ediStatus === "pending") {
      return;
    }

    /*
     * Small delay before starting.
     */
    const startTimer = setTimeout(() => {
      setCurrentStep(0);
    }, 500);

    return () => clearTimeout(startTimer);
  }, [eoStateCd, ediStatus]);

  /*
   * Move from one step to the next.
   */
  useEffect(() => {
    if (currentStep < 0) {
      return;
    }

    /*
     * WARNING:
     *
     * Stop at "Not Processed at EDI"
     * which is step index 3.
     */
    if (ediStatus === "warning" && currentStep >= 3) {
      return;
    }

    /*
     * SUCCESS:
     *
     * Continue until final step.
     */
    if (ediStatus === "success" && currentStep >= FLOW_STEPS.length - 1) {
      return;
    }

    /*
     * Slowly move to the next step.
     */
    const timer = setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, 1800);

    return () => clearTimeout(timer);
  }, [currentStep, ediStatus]);

  /*
   * Determine status of each circle.
   */
  function getStepStatus(index) {
    /*
     * Before animation starts
     */
    if (currentStep < 0) {
      return "pending";
    }

    /*
     * SUCCESS:
     *
     * Steps already reached = green
     */
    if (ediStatus === "success") {
      if (index <= currentStep) {
        return "success";
      }

      return "pending";
    }

    /*
     * WARNING:
     *
     * Steps before warning point = green
     * Warning point = amber
     * After warning point = pending
     */
    if (ediStatus === "warning") {
      if (index < 3 && index <= currentStep) {
        return "success";
      }

      if (index === 3 && currentStep >= 3) {
        return "warning";
      }

      return "pending";
    }

    return "pending";
  }

  /*
   * Determine connector status.
   */
  function getConnectorStatus(index) {
    /*
     * Connector is between:
     *
     * index -> index + 1
     */

    /*
     * SUCCESS
     *
     * Connector becomes green only
     * after the destination step is reached.
     */
    if (ediStatus === "success") {
      if (index < currentStep) {
        return "success";
      }

      return "pending";
    }

    /*
     * WARNING
     *
     * Connectors up to Not Processed
     * become green as the journey progresses.
     */
    if (ediStatus === "warning") {
      if (index < 3 && index < currentStep) {
        return "success";
      }

      return "pending";
    }

    return "pending";
  }

  /*
   * Determine which connector currently
   * contains the moving particle.
   */
  function isAnimatingConnector(index) {
    if (ediStatus === "pending") {
      return false;
    }

    /*
     * Particle travels from current step
     * toward the next step.
     */
    return (
      index === currentStep &&
      currentStep < FLOW_STEPS.length - 1 &&
      !(ediStatus === "warning" && currentStep >= 3)
    );
  }

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
            const stepStatus = getStepStatus(index);
            const cfg = STATUS[stepStatus];
            const Icon = cfg.icon;

            const connectorStatus = getConnectorStatus(index);

            const connectorAnimating = isAnimatingConnector(index);

            return (
              <div
                key={step.id}
                className="relative flex flex-col items-center flex-1"
              >
                {/* =========================
                    CONNECTOR
                   ========================= */}

                {index !== FLOW_STEPS.length - 1 && (
                  <div
                    className={`
                      absolute
                      top-4
                      left-1/2
                      w-full
                      h-[3px]
                      rounded-full
                      overflow-hidden
                      transition-colors
                      duration-700
                      ${
                        connectorStatus === "success"
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }
                    `}
                    style={{ zIndex: 0 }}
                  >
                    {/* Moving particle */}
                    {connectorAnimating && (
                      <span className="flow-travel-particle" />
                    )}
                  </div>
                )}

                {/* =========================
                    CIRCLE
                   ========================= */}

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
                    transition-all
                    duration-700
                    ${cfg.bg}
                    ${stepStatus === "success" ? "flow-success-pop" : ""}
                    ${stepStatus === "warning" ? "flow-warning-pop" : ""}
                  `}
                >
                  <Icon
                    size={15}
                    className={
                      stepStatus === "pending" ? "text-gray-500" : "text-white"
                    }
                  />
                </div>

                {/* =========================
                    LABEL
                   ========================= */}

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
                    {stepStatus === "success"
                      ? "Completed"
                      : stepStatus === "warning"
                        ? "Not Processed"
                        : ""}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================
          ANIMATION CSS
         ========================= */}

      <style>
        {`
          /*
           * Moving particle.
           *
           * It starts from the LEFT
           * and slowly travels to the RIGHT.
           */
          @keyframes flowTravel {
            0% {
              left: -6px;
              opacity: 0;
            }

            15% {
              opacity: 1;
            }

            85% {
              opacity: 1;
            }

            100% {
              left: calc(100% - 6px);
              opacity: 0;
            }
          }

          .flow-travel-particle {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);

            width: 10px;
            height: 10px;

            border-radius: 50%;

            background: white;

            box-shadow:
              0 0 4px rgba(255,255,255,0.9),
              0 0 10px rgba(255,255,255,0.8),
              0 0 16px rgba(255,255,255,0.5);

            animation:
              flowTravel 1.8s
              cubic-bezier(0.4, 0, 0.2, 1)
              forwards;
          }

          /*
           * Small pop when a step becomes successful.
           */
          @keyframes successPop {
            0% {
              transform: scale(0.75);
              opacity: 0.5;
            }

            60% {
              transform: scale(1.12);
            }

            100% {
              transform: scale(1);
              opacity: 1;
            }
          }

          .flow-success-pop {
            animation:
              successPop 0.5s
              ease-out;
          }

          /*
           * Small pop for warning node.
           */
          @keyframes warningPop {
            0% {
              transform: scale(0.75);
              opacity: 0.5;
            }

            60% {
              transform: scale(1.12);
            }

            100% {
              transform: scale(1);
              opacity: 1;
            }
          }

          .flow-warning-pop {
            animation:
              warningPop 0.5s
              ease-out;
          }
        `}
      </style>
    </SectionCard>
  );
}
