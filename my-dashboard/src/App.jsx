import { useState } from "react";
import {
  FileText,
  ListOrdered,
  Activity,
  Settings,
  GitBranch,
  Terminal,
  ToggleRight,
  Download,
} from "lucide-react";

import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import SearchBar from "./components/search/SearchBar";

import OrderSummaryBanner from "./components/order/OrderSummaryBanner";
import OrderHeaderDetails from "./components/order/header/OrderHeaderDetails";
import LineItemDetails from "./components/order/lineitem/LineItemDetails";

import FlowTraceStatus from "./components/flow/FlowTraceStatus";
import SetupConfigDetails from "./components/PartnerSetup/SetupConfigDetails";

import DatadogPanel from "./components/monitoring/DatadogPanel";

import PoSwitchSection from "./components/order/PoSwitchSection";
import ProcessFlowSection from "./components/order/ProcessFlowSection";

import {
  LoadingState,
  EmptyState,
  ErrorState,
  IdleState,
} from "./components/common/StatusStates";

import { useOrderSearch } from "./hooks/useOrderSearch";

// ============================================================
// EXPORT HELPERS
// ============================================================

function downloadBlob(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function exportAsJSON(data, filenameBase) {
  downloadBlob(JSON.stringify(data, null, 2), `${filenameBase}.json`, "application/json");
}

function exportAsCSV(rows, filenameBase) {
  if (!Array.isArray(rows) || rows.length === 0) return;
  const columns = Object.keys(rows[0]);
  const escapeCell = (val) => {
    const str = val == null ? "" : String(val);
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };
  const lines = [
    columns.join(","),
    ...rows.map((row) => columns.map((col) => escapeCell(row[col])).join(",")),
  ];
  downloadBlob(lines.join("\n"), `${filenameBase}.csv`, "text/csv");
}

export default function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Default tab after successful search
  const [activeTab, setActiveTab] = useState("order");

  const {
    data,
    status,
    error,
    search,
    reset,
  } = useOrderSearch();

  // ============================================================
  // TABS
  // ============================================================

  const tabs = [
    {
      id: "order",
      label: "Order Details",
      icon: FileText,
    },
    {
      id: "lineItems",
      label: "Line Items",
      icon: ListOrdered,
    },
    {
      id: "processing",
      label: "Processing Flow",
      icon: GitBranch,
    },
    {
      id: "flowTrace",
      label: "Flow Trace Status",
      icon: Activity,
    },
    {
      id: "poSwitch",
      label: "PO Switch",
      icon: ToggleRight,
    },
    {
      id: "setup",
      label: "Setup & Configuration",
      icon: Settings,
    },
    {
      id: "logs",
      label: "Logs & Monitoring",
      icon: Terminal,
    },
  ];

  // ============================================================
  // TAB BADGE COUNTS + EXPORT (new)
  // ============================================================

  const setupRecords = Array.isArray(data?.setupConfig)
    ? data.setupConfig
    : data?.setupConfig && typeof data.setupConfig === "object"
      ? [data.setupConfig]
      : [];

  const flowRows = Array.isArray(data?.flowTrace)
    ? data.flowTrace
    : data?.flowTrace && typeof data.flowTrace === "object"
      ? Object.values(data.flowTrace).filter(Array.isArray).flat()
      : [];

  const tabCounts = {
    order: null,
    lineItems: data?.lineItems?.length ?? 0,
    processing: null,
    flowTrace: flowRows.length,
    poSwitch: null,
    setup: setupRecords.length,
    logs: null,
  };

  const orderIdentifier = data?.order?.ordrNbr || data?.order?.custOrdrNbr || "order";

  const handleExport = () => {
    switch (activeTab) {
      case "order":
        exportAsJSON(data?.order, `${orderIdentifier}-header`);
        break;
      case "lineItems":
        if (data?.lineItems?.length) exportAsCSV(data.lineItems, `${orderIdentifier}-line-items`);
        break;
      case "flowTrace":
        if (flowRows.length) exportAsCSV(flowRows, `${orderIdentifier}-flow-trace`);
        break;
      case "setup":
        exportAsJSON(setupRecords, `${orderIdentifier}-partner-setup`);
        break;
      default:
        break;
    }
  };

  const exportDisabled =
    (activeTab === "order" && !data?.order) ||
    (activeTab === "lineItems" && !data?.lineItems?.length) ||
    (activeTab === "flowTrace" && !flowRows.length) ||
    (activeTab === "setup" && !setupRecords.length) ||
    ["processing", "poSwitch", "logs"].includes(activeTab);

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">

      {/* ========================================================
          HEADER
      ======================================================== */}

      <Header
        toggleSidebar={() => setMobileOpen(!mobileOpen)}
      />

      {/* ========================================================
          SIDEBAR
      ======================================================== */}

      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* ========================================================
          MAIN CONTENT
      ======================================================== */}

      <main
        className={`pt-14 transition-all duration-300 hidden-mobile-margin ${
          sidebarCollapsed
            ? "md:ml-[60px]"
            : "md:ml-[200px]"
        }`}
      >

        <div className="p-4 md:p-5 max-w-[1400px] mx-auto">

          {/* ======================================================
              PAGE HEADER
          ====================================================== */}

          <div className="mb-4">
            <h1 className="text-xl font-bold text-[#1F2937]">
              Order / Transaction Search
            </h1>

            <p className="text-xs text-[#6B7280] mt-1">
              Production support console for order investigation,
              processing status and issue resolution
            </p>
          </div>

          {/* ======================================================
              SEARCH
          ====================================================== */}

          <SearchBar
            onSearch={search}
            loading={status === "loading"}
            resultOrder={data?.order ?? null}
            resultLineItems={data?.lineItems ?? []}
          />

          {/* ======================================================
              STATUS
          ====================================================== */}

          <div className="mt-4">

            {status === "idle" && (
              <IdleState />
            )}

            {status === "loading" && (
              <LoadingState />
            )}

            {status === "empty" && (
              <EmptyState />
            )}

            {status === "error" && (
              <ErrorState
                message={error}
                onRetry={reset}
              />
            )}

            {/* ====================================================
                SUCCESS
            ==================================================== */}

            {status === "success" && data && (
              <>

                {/* ==================================================
                    ORDER SUMMARY
                ================================================== */}

                <OrderSummaryBanner
                  order={data.order}
                />

                {/* ==================================================
                    TAB CONTAINER
                ================================================== */}

                <div className="mt-4">

                  {/* =================================================
                      TAB HEADER
                  ================================================= */}

                  <div className="bg-white border border-[#D6E4F7] rounded-t-xl shadow-sm flex items-center justify-between">

                    <div className="flex items-center overflow-hidden">

                      {tabs.map((tab) => {

                        const Icon = tab.icon;

                        const isActive =
                          activeTab === tab.id;

                        const count = tabCounts[tab.id];

                        return (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() =>
                              setActiveTab(tab.id)
                            }
                            className={`
                              relative
                              flex
                              items-center
                              gap-2
                              px-5
                              py-3
                              text-xs
                              font-medium
                              whitespace-nowrap
                              border-b-2
                              transition-all
                              ${
                                isActive
                                  ? "text-[#0F6CBD] border-[#0F6CBD] bg-[#F8FBFF]"
                                  : "text-[#6B7280] border-transparent hover:text-[#0F6CBD] hover:bg-[#F8FAFC]"
                              }
                            `}
                          >

                            <Icon size={14} />

                            {tab.label}

                            {count != null && (
                              <span className="ml-0.5 text-[10px] font-semibold bg-slate-100 text-[#6B7280] rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                                {count}
                              </span>
                            )}

                          </button>
                        );

                      })}

                    </div>

                    <button
                      type="button"
                      onClick={handleExport}
                      disabled={exportDisabled}
                      className="flex items-center gap-1.5 text-xs font-medium text-[#0F6CBD] px-3 py-2 mr-2 rounded-md hover:bg-[#EFF6FF] disabled:opacity-30 disabled:cursor-not-allowed flex-shrink-0"
                    >
                      <Download size={13} />
                      Export
                    </button>

                  </div>


                  {/* =================================================
                      TAB CONTENT
                  ================================================= */}

                  <div className="mt-4">


                    {/* =================================================
                        1. ORDER DETAILS
                    ================================================= */}

                    {activeTab === "order" && (
                      <div className="space-y-4">

                        <OrderHeaderDetails
                          order={data.order}
                        />

                      </div>
                    )}


                    {/* =================================================
                        2. LINE ITEMS
                    ================================================= */}

                    {activeTab === "lineItems" && (
                      <div className="space-y-4">

                        <LineItemDetails
                          items={data.lineItems}
                        />

                      </div>
                    )}


                    {/* =================================================
                        3. PROCESSING FLOW
                    ================================================= */}

                    {activeTab === "processing" && (
                      <div className="space-y-4">

                        <ProcessFlowSection />

                      </div>
                    )}


                    {/* =================================================
                        4. FLOW TRACE STATUS
                    ================================================= */}

                    {activeTab === "flowTrace" && (
                      <div className="space-y-4">

                        <FlowTraceStatus
                          flowTrace={data.flowTrace}
                        />

                      </div>
                    )}


                    {/* =================================================
                        5. PO SWITCH
                    ================================================= */}

                    {activeTab === "poSwitch" && (
                      <div className="space-y-4">

                        <PoSwitchSection
                          inPoSw={data.inPoSw}
                        />

                      </div>
                    )}


                    {/* =================================================
                        6. SETUP & CONFIGURATION
                    ================================================= */}

                    {activeTab === "setup" && (
                      <div className="space-y-4">

                        <SetupConfigDetails
                          config={data.setupConfig}
                        />

                      </div>
                    )}


                    {/* =================================================
                        7. LOGS & MONITORING
                    ================================================= */}

                    {activeTab === "logs" && (
                      <div className="space-y-4">

                        <DatadogPanel
                          logs={data.logs}
                          alerts={data.datadogAlerts}
                        />

                      </div>
                    )}

                  </div>

                </div>

              </>
            )}

          </div>


          {/* ======================================================
              FOOTER
          ====================================================== */}

          <div className="mt-6 pb-4 text-center text-[10px] text-[#6B7280] flex items-center justify-between">

            <span>
              © 2024 Ingram Micro Inc. All Rights Reserved.
            </span>

            <div className="flex gap-4">

              <button className="hover:text-[#0F6CBD]">
                Privacy Policy
              </button>

              <button className="hover:text-[#0F6CBD]">
                Terms of Use
              </button>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}