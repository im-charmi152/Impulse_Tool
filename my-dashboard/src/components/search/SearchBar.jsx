import { useState, useCallback, useMemo } from "react";
import { Search as SearchIcon, X, Lock } from "lucide-react";
import { SEARCH_FIELDS } from "../../data/navigation";

function normalizeDisplayValue(value) {
  if (value == null || value === "" || value === "—") return "N/A";
  return String(value);
}

function SearchBar({ onSearch, loading, resultOrder, resultLineItems }) {
  const [values, setValues] = useState({});

  const requiredParams = SEARCH_FIELDS.filter((f) => f.supported).map((f) => f.param);
  const canSearch = requiredParams.every((param) => values[param]?.trim());

  const derivedValues = useMemo(() => {
    const firstLine = Array.isArray(resultLineItems) ? resultLineItems[0] : null;

    return {
      orderNumber: normalizeDisplayValue(
        resultOrder?.imiAsgdOrdrNbr ?? resultOrder?.ordrNbr ?? resultOrder?.orderNumber,
      ),
      partnerId: normalizeDisplayValue(resultOrder?.partnerId),
      accountNumber: normalizeDisplayValue(
        resultOrder?.custNbr ?? resultOrder?.accountNumber,
      ),
      sku: normalizeDisplayValue(
        firstLine?.imPartNbr ?? firstLine?.sku,
      ),
      transactionId: normalizeDisplayValue(
        resultOrder?.xactSet ?? resultOrder?.transactionId,
      ),
    };
  }, [resultOrder, resultLineItems]);

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
        {SEARCH_FIELDS.map(({ label, param, supported }) => {
          const displayValue = supported
            ? values[param] || ""
            : derivedValues[param] || "N/A";

          return (
          <div key={param}>
            <label className="field-label flex items-center gap-1 text-xs mb-1">
              {label}
              {!supported && <Lock size={10} className="text-[#6B7280]" />}
            </label>
            <div className="relative">
              <input
                type="text"
                readOnly={!supported}
                disabled={!supported}
                placeholder={supported ? `Enter ${label}` : "N/A"}
                value={displayValue}
                onChange={(e) => handleChange(param, e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="w-full border border-[#D6E4F7] rounded-xl px-2.5 py-1.5 text-xs text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-[#0F6CBD] focus:border-transparent placeholder-[#6B7280] pr-7 disabled:bg-[#F8FAFC] disabled:text-[#6B7280] disabled:cursor-not-allowed"
              />
              {supported && values[param] && (
                <button
                  onClick={() => handleChange(param, "")}
                  className="absolute right-2 top-2 text-[#6B7280] hover:text-[#1F2937]"
                  aria-label={`Clear ${label}`}
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>
          );
        })}
      </div>
      <div className="flex items-center justify-between mt-3">
        <span className="text-[10px] text-[#6B7280]">
          Additional fields auto-populate from results. Missing values are shown as N/A.
        </span>
        <div className="flex gap-2">
          <button
            onClick={handleClear}
            className="px-4 py-1.5 text-xs font-medium text-[#6B7280] border border-[#D6E4F7] rounded-xl hover:bg-[#EFF6FF]"
          >
            Clear
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSearch || loading}
            className="px-5 py-1.5 text-xs font-semibold text-white bg-[#0F6CBD] rounded-xl hover:bg-[#0A5CA6] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
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
