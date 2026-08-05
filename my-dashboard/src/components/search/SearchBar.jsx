import { useState, useCallback } from "react";
import { Search as SearchIcon, X, Lock } from "lucide-react";
import { SEARCH_FIELDS } from "../../data/navigation";

function SearchBar({ onSearch, loading }) {
  const [values, setValues] = useState({});

  const requiredParams = SEARCH_FIELDS.filter((f) => f.supported).map((f) => f.param);
  const canSearch = requiredParams.every((param) => values[param]?.trim());

  const handleChange = useCallback((param, value) => {
    setValues((prev) => ({ ...prev, [param]: value }));
  }, []);

  const handleClear = useCallback(() => setValues({}), []);

  const handleSubmit = useCallback(() => {
    if (!canSearch || loading) return;
    onSearch(values);
  }, [values, canSearch, loading, onSearch]);

  return (
    <div className="enterprise-card">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {SEARCH_FIELDS.map(({ label, param, supported }) => (
          <div key={param}>
            <label className="field-label flex items-center gap-1 text-xs mb-1">
              {label}
              {!supported && <Lock size={10} className="text-[#6B7280]" />}
            </label>
            <div className="relative">
              <input
                type="text"
                disabled={!supported}
                placeholder={supported ? `Enter ${label}` : "Coming soon"}
                value={values[param] || ""}
                onChange={(e) => handleChange(param, e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="w-full border border-[#DBEAFE] rounded-xl px-2.5 py-1.5 text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent placeholder-[#6B7280] pr-7 disabled:bg-[#F8FAFC] disabled:text-[#6B7280] disabled:cursor-not-allowed"
              />
              {supported && values[param] && (
                <button
                  onClick={() => handleChange(param, "")}
                  className="absolute right-2 top-2 text-[#6B7280] hover:text-[#111827]"
                  aria-label={`Clear ${label}`}
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mt-3">
        <span className="text-[10px] text-[#6B7280]">
          Search by Order Number, SKU, Account, Partner ID, and Transaction ID is coming soon.
        </span>
        <div className="flex gap-2">
          <button
            onClick={handleClear}
            className="px-4 py-1.5 text-xs font-medium text-[#6B7280] border border-[#DBEAFE] rounded-xl hover:bg-[#EFF6FF]"
          >
            Clear
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSearch || loading}
            className="px-5 py-1.5 text-xs font-semibold text-white bg-[#2563EB] rounded-xl hover:bg-[#1D4ED8] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <SearchIcon size={12} />
            {loading ? "Searching…" : "Search"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;
