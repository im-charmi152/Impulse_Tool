import { useMemo, useState } from "react";
import { Download, Layers, Activity, Settings, CheckCircle2, Database, Server } from "lucide-react";

import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import SearchBar from "./components/search/SearchBar";
import OrderSummaryBanner from "./components/order/OrderSummaryBanner";
import OrderHeaderDetails from "./components/order/OrderHeaderDetails";
import LineItemDetails from "./components/order/LineItemDetails";
import FlowTraceStatus from "./components/flow/FlowTraceStatus";
import SetupConfigDetails from "./components/setup/SetupConfigDetails";
import SetupValidation from "./components/setup/SetupValidation";
import DatadogPanel from "./components/monitoring/DatadogPanel";
import MQQueueStatus from "./components/monitoring/MQQueueStatus";
import FailureReason from "./components/monitoring/FailureReason";
import RetryRecovery from "./components/monitoring/RetryRecovery";
import { LoadingState, EmptyState, ErrorState, IdleState } from "./components/common/StatusStates";
import RawResponsePanel from "./components/common/RawResponsePanel";
import NotAvailablePanel from "./components/common/NotAvailablePanel";

import { useOrderSearch } from "./hooks/useOrderSearch";

export default function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data, status, error, search, reset } = useOrderSearch();

  const { failures, retryCandidates } = useMemo(() => {
    if (!data) return { failures: [], retryCandidates: [] };
    const allRows = Object.values(data.flowTrace || {}).flat();
    return {
      failures: allRows.filter((r) => (r.status || "").toLowerCase() === "failed"),
      retryCandidates: allRows.filter((r) =>
        ["queue delay", "pending"].includes((r.status || "").toLowerCase())
      ),
    };
  }, [data]);

  const isAvailable = (section) => data?._meta?.availableSections?.includes(section);

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Header toggleSidebar={() => setMobileOpen(!mobileOpen)} />
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <main
        className={`pt-14 transition-all duration-300 hidden-mobile-margin ${sidebarCollapsed ? "md:ml-[60px]" : "md:ml-[200px]"}`}
      >
        <div className="p-4 md:p-5 max-w-[1400px]">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-800">Order / Transaction Search</h1>
              <p className="text-xs text-gray-400 mt-0.5">Search and view consolidated transaction details</p>
            </div>
            <button className="flex items-center gap-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded px-3 py-1.5 hover:bg-blue-50 transition-colors whitespace-nowrap">
              <Download size={12} />
              Save Search
            </button>
          </div>

          <SearchBar onSearch={search} loading={status === "loading"} />

          <div className="mt-4">
            {status === "idle" && <IdleState />}
            {status === "loading" && <LoadingState />}
            {status === "empty" && <EmptyState />}
            {status === "error" && <ErrorState message={error} onRetry={reset} />}

            {status === "success" && data && (
              <>
                <OrderSummaryBanner
                  order={data.order}
                  onRefresh={() => search({ poNumber: data.order.poNumber, countryCode: data.order.countryCode })}
                />

                <div className="mt-4 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)_minmax(0,1.2fr)] gap-4">
                  <OrderHeaderDetails order={data.order} />

                  {isAvailable("lineItems") ? (
                    <LineItemDetails items={data.lineItems} />
                  ) : (
                    <NotAvailablePanel icon={Layers} title="Line-Item Details" note="Line items aren't returned by GetOrder yet." />
                  )}

                  <div className="flex flex-col gap-4">
                    {isAvailable("flowTrace") ? (
                      <FlowTraceStatus steps={data.processingSteps} flowTrace={data.flowTrace} />
                    ) : (
                      <NotAvailablePanel icon={Activity} title="Processing Flow Status" note="No flow-trace data source yet on the backend." />
                    )}
                    {isAvailable("setupConfig") ? (
                      <SetupConfigDetails config={data.setupConfig} />
                    ) : (
                      <NotAvailablePanel icon={Settings} title="Setup / Configuration Details" />
                    )}
                    {isAvailable("setupValidation") ? (
                      <SetupValidation validations={data.setupValidation} />
                    ) : (
                      <NotAvailablePanel icon={CheckCircle2} title="Setup Validation" />
                    )}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {isAvailable("logs") ? (
                    <DatadogPanel logs={data.logs} alerts={data.datadogAlerts} />
                  ) : (
                    <NotAvailablePanel icon={Database} title="Datadog" note="Not connected yet on the backend." />
                  )}
                  {isAvailable("mqQueues") ? (
                    <MQQueueStatus queues={data.mqQueues} />
                  ) : (
                    <NotAvailablePanel icon={Server} title="MQ Queue Status" note="No MQ integration yet on the backend." />
                  )}
                  {isAvailable("flowTrace") ? (
                    <>
                      <FailureReason failures={failures} />
                      <RetryRecovery retryCandidates={retryCandidates} />
                    </>
                  ) : (
                    <NotAvailablePanel icon={Activity} title="Failure / Retry Analysis" note="Derived from flow-trace data, which isn't available yet." />
                  )}
                </div>

                <div className="mt-4">
                  <RawResponsePanel raw={data._raw} />
                </div>
              </>
            )}
          </div>

          <div className="mt-6 pb-4 text-center text-[10px] text-gray-400 flex items-center justify-between">
            <span>© 2024 Ingram Micro Inc. All Rights Reserved.</span>
            <div className="flex gap-4">
              <button className="hover:text-gray-600">Privacy Policy</button>
              <button className="hover:text-gray-600">Terms of Use</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}