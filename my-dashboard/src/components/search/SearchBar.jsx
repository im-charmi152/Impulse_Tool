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
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {SEARCH_FIELDS.map(({ label, param, supported }) => (
          <div key={param}>
            <label className="flex items-center gap-1 text-xs font-medium text-gray-600 mb-1">
              {label}
              {!supported && <Lock size={10} className="text-gray-300" />}
            </label>
            <div className="relative">
              <input
                type="text"
                disabled={!supported}
                placeholder={supported ? `Enter ${label}` : "Coming soon"}
                value={values[param] || ""}
                onChange={(e) => handleChange(param, e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-300 pr-7 disabled:bg-gray-50 disabled:text-gray-300 disabled:cursor-not-allowed"
              />
              {supported && values[param] && (
                <button
                  onClick={() => handleChange(param, "")}
                  className="absolute right-2 top-2 text-gray-300 hover:text-gray-500"
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
        <span className="text-[10px] text-gray-400">
          Search by Order Number, SKU, Account, Partner ID, and Transaction ID is coming soon.
        </span>
        <div className="flex gap-2">
          <button
            onClick={handleClear}
            className="px-4 py-1.5 text-xs font-medium text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSearch || loading}
            className="px-5 py-1.5 text-xs font-semibold text-white bg-[#003087] rounded hover:bg-[#002070] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
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
