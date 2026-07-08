import { useState } from "react";
import { Download } from "lucide-react";

import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import SearchBar from "./components/search/SearchBar";
import OrderSummaryBanner from "./components/order/OrderSummaryBanner";
import OrderHeaderDetails from "./components/order/OrderHeaderDetails";
import LineItemDetails from "./components/order/LineItemDetails";
import ProcessingFlowStatus from "./components/order/ProcessingFlowStatus";
import SetupConfigDetails from "./components/order/SetupConfigDetails";
import DatadogLogs from "./components/monitoring/DatadogLogs";
import MQQueueStatus from "./components/monitoring/MQQueueStatus";
import FailureReason from "./components/monitoring/FailureReason";
import RetryRecovery from "./components/monitoring/RetryRecovery";

export default function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <Header toggleSidebar={() => setMobileOpen(!mobileOpen)} />
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main content */}
      <main
        className={`pt-14 transition-all duration-300 hidden-mobile-margin ${sidebarCollapsed ? "md:ml-[60px]" : "md:ml-[200px]"}`}
      >
        <div className="p-4 md:p-5 max-w-[1400px]">
          {/* Page header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                Order / Transaction Search
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Search and view consolidated transaction details
              </p>
            </div>
            <button className="flex items-center gap-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded px-3 py-1.5 hover:bg-blue-50 transition-colors whitespace-nowrap">
              <Download size={12} />
              Save Search
            </button>
          </div>

          {/* Search bar */}
          <SearchBar />

          {/* Order summary banner */}
          <div className="mt-4">
            <OrderSummaryBanner />
          </div>

          {/* 3-col grid: Header + Line-items + (Flow + Config) */}
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)_minmax(0,1.2fr)] gap-4">
            {/* Col 1: Order Header */}
            <OrderHeaderDetails />

            {/* Col 2: Line Items */}
            <LineItemDetails />

            {/* Col 3: Flow + Config stacked */}
            <div className="flex flex-col gap-4">
              <ProcessingFlowStatus />
              <SetupConfigDetails />
            </div>
          </div>

          {/* 4-col bottom grid */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <DatadogLogs />
            <MQQueueStatus />
            <FailureReason />
            <RetryRecovery />
          </div>

          {/* Footer */}
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
