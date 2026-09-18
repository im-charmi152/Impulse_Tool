import { useEffect, useState } from "react";
import { GitBranch, Check, AlertTriangle, X, Clock3 } from "lucide-react";

import SectionCard from "../common/SectionCard";

/* ============================================================
   FLOW STEPS
============================================================ */

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
    name: "C:E / MQ",
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

/* ============================================================
   STATUS CONFIG
============================================================ */

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

/* ============================================================
   EDI STATES
============================================================ */

const EDI_SUCCESS_STATES = new Set([
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
  "10EDP740",
  "9999OMIT",
]);

/* ============================================================
   GET EDI STATUS
============================================================ */

function getEdiStatus(eoStateCd) {
  if (!eoStateCd) {
    return "pending";
  }

  const normalizedState = String(eoStateCd)
    .trim()
    .toUpperCase();

  if (EDI_SUCCESS_STATES.has(normalizedState)) {
    return "success";
  }

  if (EDI_WARNING_STATES.has(normalizedState)) {
    return "warning";
  }

  return "pending";
}

/* ============================================================
   LEGEND
============================================================ */

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

/* ============================================================
   MAIN COMPONENT
============================================================ */

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

  /* ==========================================================
     RESTART ANIMATION WHEN STATE CHANGES
  ========================================================== */

  useEffect(() => {
    setCurrentStep(-1);

    if (ediStatus === "pending") {
      return;
    }

    /*
     * Small initial delay.
     */
    const startTimer = setTimeout(() => {
      setCurrentStep(0);
    }, 300);

    return () => clearTimeout(startTimer);
  }, [eoStateCd, ediStatus]);

  /* ==========================================================
     MOVE TO NEXT STEP
  ========================================================== */

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
    if (
      ediStatus === "success" &&
      currentStep >= FLOW_STEPS.length - 1
    ) {
      return;
    }

    /*
     * Move quickly to next step.
     *
     * 600ms gives a fast progress-bar
     * feeling without being instant.
     */
    const timer = setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, 600);

    return () => clearTimeout(timer);
  }, [currentStep, ediStatus]);

  /* ============================================================
     STEP STATUS
  ============================================================ */

  function getStepStatus(index) {
    /*
     * Animation has not started.
     */
    if (currentStep < 0) {
      return "pending";
    }

    /* ----------------------------------------------------------
       SUCCESS
    ---------------------------------------------------------- */

    if (ediStatus === "success") {
      if (index <= currentStep) {
        return "success";
      }

      return "pending";
    }

    /* ----------------------------------------------------------
       WARNING
    ---------------------------------------------------------- */

    if (ediStatus === "warning") {
      /*
       * Steps before warning point become green.
       */
      if (index < 3 && index <= currentStep) {
        return "success";
      }

      /*
       * Warning node.
       */
      if (index === 3 && currentStep >= 3) {
        return "warning";
      }

      /*
       * Final step stays pending.
       */
      return "pending";
    }

    return "pending";
  }

  /* ============================================================
     CONNECTOR STATUS
  ============================================================ */

  function getConnectorStatus(index) {
    /*
     * SUCCESS
     *
     * Connector becomes permanently green
     * after destination step is reached.
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
     * Connectors before warning point
     * become green as the flow progresses.
     */
    if (ediStatus === "warning") {
      if (index < 3 && index < currentStep) {
        return "success";
      }

      return "pending";
    }

    return "pending";
  }

  /* ============================================================
     CURRENT ANIMATING CONNECTOR
  ============================================================ */

  function isAnimatingConnector(index) {
    if (ediStatus === "pending") {
      return false;
    }

    /*
     * Current connector is the connector
     * immediately after the current step.
     */
    return (
      index === currentStep &&
      currentStep < FLOW_STEPS.length - 1 &&
      !(
        ediStatus === "warning" &&
        currentStep >= 3
      )
    );
  }

  /* ============================================================
     RENDER
  ============================================================ */

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

          {FLOW_STEPS.map((step, index) => {
            const stepStatus = getStepStatus(index);

            const cfg = STATUS[stepStatus];

            const Icon = cfg.icon;

            const connectorStatus =
              getConnectorStatus(index);

            const connectorAnimating =
              isAnimatingConnector(index);

            return (
              <div
                key={step.id}
                className="
                  relative
                  flex
                  flex-col
                  items-center
                  flex-1
                "
              >

                {/* =================================================
                    CONNECTOR
                ================================================= */}

                {index !== FLOW_STEPS.length - 1 && (
                  <div
                    className={`
                      absolute
                      top-4
                      left-1/2
                      w-full
                      h-[4px]
                      rounded-full
                      overflow-hidden
                      transition-colors
                      duration-200

                      ${
                        connectorStatus === "success"
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }
                    `}
                    style={{
                      zIndex: 0,
                    }}
                  >

                    {/* ------------------------------------------------
                        GREEN PROGRESS BAR
                    ------------------------------------------------ */}

                    {connectorAnimating && (
                      <span className="flow-travel-particle" />
                    )}

                  </div>
                )}

                {/* =================================================
                    CIRCLE
                ================================================= */}

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
                    duration-200

                    ${cfg.bg}

                    ${
                      stepStatus === "success"
                        ? "flow-success-pop"
                        : ""
                    }

                    ${
                      stepStatus === "warning"
                        ? "flow-warning-pop"
                        : ""
                    }
                  `}
                >
                  <Icon
                    size={15}
                    className={
                      stepStatus === "pending"
                        ? "text-gray-500"
                        : "text-white"
                    }
                  />
                </div>

                {/* =================================================
                    LABEL
                ================================================= */}

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

      {/* ============================================================
          ANIMATION CSS
      ============================================================ */}

      <style>
        {`

          /* ==========================================================
             GREEN PROGRESS BAR
          ========================================================== */

          @keyframes flowTravel {

            0% {
              width: 0%;
              opacity: 1;
            }

            100% {
              width: 100%;
              opacity: 1;
            }

          }


          /*
           * This is no longer a white moving dot.
           *
           * It behaves like a progress bar:
           *
           * LEFT → RIGHT
           *
           * 0% → 100%
           */

          .flow-travel-particle {

            position: absolute;

            top: 0;
            left: 0;

            width: 0%;
            height: 100%;

            border-radius: 999px;

            background: #22c55e;

            box-shadow:
              0 0 5px rgba(34, 197, 94, 0.9),
              0 0 10px rgba(34, 197, 94, 0.65),
              0 0 16px rgba(34, 197, 94, 0.35);

            animation:
              flowTravel
              0.6s
              cubic-bezier(0.4, 0, 0.2, 1)
              forwards;

          }


          /* ==========================================================
             SUCCESS NODE POP
          ========================================================== */

          @keyframes successPop {

            0% {
              transform: scale(0.75);
              opacity: 0.5;
            }

            60% {
              transform: scale(1.12);
              opacity: 1;
            }

            100% {
              transform: scale(1);
              opacity: 1;
            }

          }


          .flow-success-pop {

            animation:
              successPop
              0.25s
              ease-out;

          }


          /* ==========================================================
             WARNING NODE POP
          ========================================================== */

          @keyframes warningPop {

            0% {
              transform: scale(0.75);
              opacity: 0.5;
            }

            60% {
              transform: scale(1.12);
              opacity: 1;
            }

            100% {
              transform: scale(1);
              opacity: 1;
            }

          }


          .flow-warning-pop {

            animation:
              warningPop
              0.25s
              ease-out;

          }

        `}
      </style>
    </SectionCard>
  );
}