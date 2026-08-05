import { useMemo, useState } from "react";

import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import SearchBar from "./components/search/SearchBar";
import OrderSummaryBanner from "./components/order/OrderSummaryBanner";
import OrderHeaderDetails from "./components/order/OrderHeaderDetails";
import LineItemDetails from "./components/order/LineItemDetails";
import FlowTraceStatus from "./components/flow/FlowTraceStatus";
import SetupConfigDetails from "./components/setup/SetupConfigDetails";
import DatadogPanel from "./components/monitoring/DatadogPanel";
import PoSwitchSection from "./components/order/PoSwitchSection";
import { LoadingState, EmptyState, ErrorState, IdleState } from "./components/common/StatusStates";

import { useOrderSearch } from "./hooks/useOrderSearch";

export default function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data, status, error, search, reset } = useOrderSearch();

  const headerOrder = useMemo(() => data?.order ?? null, [data]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1F2937] font-sans">
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
          <SearchBar onSearch={search} loading={status === "loading"} />

          <div className="mt-4">
            {status === "idle" && <IdleState />}
            {status === "loading" && <LoadingState />}
            {status === "empty" && <EmptyState />}
            {status === "error" && <ErrorState message={error} onRetry={reset} />}

            {status === "success" && data && (
              <>
                <OrderSummaryBanner order={headerOrder} />

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                  <div className="h-full">
                    <OrderHeaderDetails order={data.order} />
                  </div>
                  <div className="h-full">
                    <SetupConfigDetails config={data.setupConfig} />
                  </div>
                </div>

                <div className="mt-4">
                  <LineItemDetails items={data.lineItems} />
                </div>

                <div className="mt-4">
                  <FlowTraceStatus steps={data.processingSteps} flowTrace={data.flowTrace} />
                </div>

                <div className="mt-4">
                  <PoSwitchSection order={data.order} />
                </div>

                <div className="mt-4">
                  <DatadogPanel logs={data.logs} alerts={data.datadogAlerts} />
                </div>
              </>
            )}
          </div>

          <div className="mt-6 pb-4 text-center text-[10px] text-[#6B7280] flex items-center justify-between">
            <span>© 2024 Ingram Micro Inc. All Rights Reserved.</span>
            <div className="flex gap-4">
              <button className="hover:text-[#0F6CBD]">Privacy Policy</button>
              <button className="hover:text-[#0F6CBD]">Terms of Use</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}