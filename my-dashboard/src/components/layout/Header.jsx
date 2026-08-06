import { Bell, HelpCircle, ChevronDown, Menu } from "lucide-react";

function Header({ toggleSidebar }) {
  return (
    <header className="h-14 bg-[#0F6CBD] border-b border-[#D6E4F7] flex items-center justify-between px-4 fixed top-0 left-0 right-0 z-30 shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="text-white p-1 rounded-lg hover:bg-white/10 md:hidden"
          aria-label="Toggle navigation"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-0.5 select-none">
          <span className="text-white font-black text-xl tracking-tight">
            IMPULSE
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button className="relative text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-400 rounded-full" />
        </button>
        <button className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10">
          <HelpCircle size={18} />
        </button>
        <button className="ml-1 flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white rounded-full pl-1.5 pr-3 py-1">
          <div className="w-7 h-7 bg-[#0A5CA6] rounded-full flex items-center justify-center text-white text-xs font-bold">
            AS
          </div>
          <span className="text-sm font-medium hidden sm:inline">
            Admin User
          </span>
          <ChevronDown size={14} className="hidden sm:inline" />
        </button>
      </div>
    </header>
  );
}

export default Header;
