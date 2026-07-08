import { useState } from "react";
import { Search } from "lucide-react";

const FIELDS = [
  "Order Number",
  "SKU",
  "Account Number",
  "Partner ID",
  "PO Number",
  "Transaction ID",
];

export default function SearchBar() {
  const [values, setValues] = useState({});

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {FIELDS.map((f) => (
          <div key={f}>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              {f}
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder={`Enter ${f}`}
                value={values[f] || ""}
                onChange={(e) => setValues({ ...values, [f]: e.target.value })}
                className="w-full border border-gray-200 rounded px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-300 pr-7"
              />
              {f === "Order Number" && (
                <Search
                  size={12}
                  className="absolute right-2 top-2 text-gray-400"
                />
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-2 mt-3">
        <button
          onClick={() => setValues({})}
          className="px-4 py-1.5 text-xs font-medium text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          Clear
        </button>
        <button className="px-5 py-1.5 text-xs font-semibold text-white bg-[#003087] rounded hover:bg-[#002070] transition-colors flex items-center gap-1.5">
          <Search size={12} />
          Search
        </button>
      </div>
    </div>
  );
}
