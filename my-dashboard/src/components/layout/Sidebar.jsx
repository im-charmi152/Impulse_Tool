import { useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { NAV_ITEMS } from "../../data/mockData";

export default function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) {
  const [activeId, setActiveId] = useState("search");

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={`
          fixed top-14 left-0 bottom-0 z-20 bg-white border-r border-gray-200 flex flex-col shadow-sm transition-all duration-300
          ${collapsed ? "w-[60px]" : "w-[200px]"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <nav className="flex-1 overflow-y-auto py-2">
          {NAV_ITEMS.map(({ icon: Icon, label, id, expandable }) => {
            const isActive = id === activeId;
            return (
              <button
                key={id}
                onClick={() => {
                  setActiveId(id);
                  setMobileOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors relative group
                  ${
                    isActive
                      ? "bg-[#EEF4FF] text-[#003087] font-semibold border-r-[3px] border-[#003087]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
              >
                <Icon
                  size={17}
                  className={isActive ? "text-[#003087]" : "text-gray-500"}
                />
                {!collapsed && (
                  <>
                    <span className="text-sm flex-1 truncate">{label}</span>
                    {expandable && (
                      <ChevronRight size={13} className="text-gray-400" />
                    )}
                  </>
                )}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                    {label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex items-center gap-2 px-3 py-3 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 border-t border-gray-100 transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </aside>
    </>
  );
}
