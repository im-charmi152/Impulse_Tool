/**
 * LineItemDrawer.jsx
 *
 * Right-side slide-over drawer showing ALL EO_LINE_INFO fields for a
 * selected line item, organised into accordion groups with live search.
 *
 * Props
 * -----
 * open    – boolean
 * onClose – () => void
 * item    – mapped line item object (from mapOrderResponse lineItems array)
 */

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  X, Search, Copy, Check, ChevronDown, ChevronRight,
  Hash, Package, BarChart2, DollarSign, Calendar,
  AlertCircle, Truck, Cpu,
} from "lucide-react";
import { LINE_ITEM_FIELD_GROUPS } from "./lineItemFieldConfig";
import { formatDateTime } from "../../../utils/format";

// ─── Icon map ─────────────────────────────────────────────────────────────────
const ICON_MAP = {
  Hash, Package, BarChart2, DollarSign, Calendar, AlertCircle, Truck, Cpu,
};

// ─── Copy Button ──────────────────────────────────────────────────────────────
function CopyBtn({ value }) {
  const [copied, setCopied] = useState(false);
  const handle = useCallback(() => {
    navigator.clipboard?.writeText(String(value ?? "")).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [value]);

  return (
    <button
      onClick={handle}
      aria-label="Copy to clipboard"
      className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded
        text-gray-400 hover:text-blue-600 hover:bg-blue-50 focus:opacity-100 focus:outline-none
        focus:ring-2 focus:ring-blue-400"
    >
      {copied ? <Check size={11} className="text-green-500" /> : <Copy size={11} />}
    </button>
  );
}

// ─── Flag badge ───────────────────────────────────────────────────────────────
function FlagBadge({ value }) {
  if (value === "Y" || value === true || value === "1") {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">
        <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
        Enabled
      </span>
    );
  }
  if (value === "N" || value === false || value === "0") {
    return <span className="text-[10px] font-medium text-gray-400">Disabled</span>;
  }
  return <span className="text-xs text-gray-500">{String(value ?? "—")}</span>;
}

// ─── Field value renderer ─────────────────────────────────────────────────────
function FieldValue({ type, value, copyable }) {
  const empty = value == null || value === "" || value === "—";

  if (empty) return <span className="text-gray-300 text-xs">—</span>;
  if (type === "flag") return <FlagBadge value={value} />;

  const text = (() => {
    switch (type) {
      case "date":   return formatDateTime(value);
      case "number": return String(value);
      default:       return String(value);
    }
  })();

  return (
    <span className="flex items-center gap-1 group">
      <span className={`text-xs font-medium text-gray-800 ${type === "id" ? "font-mono" : ""}`}>
        {text}
      </span>
      {copyable && <CopyBtn value={text} />}
    </span>
  );
}

// ─── Single drawer field row ──────────────────────────────────────────────────
function DrawerField({ field, value, highlight }) {
  const labelEl = highlight
    ? (() => {
        const parts = field.label.split(new RegExp(`(${highlight})`, "gi"));
        return parts.map((p, i) =>
          p.toLowerCase() === highlight.toLowerCase()
            ? <mark key={i} className="bg-yellow-200 text-yellow-900 rounded-sm px-0.5">{p}</mark>
            : p
        );
      })()
    : field.label;

  return (
    <div className="group flex items-start justify-between py-2.5 border-b border-gray-50 last:border-0 gap-3">
      <span className="text-[11px] text-gray-400 min-w-[160px] leading-tight pt-0.5">{labelEl}</span>
      <div className="flex-1 text-right">
        <FieldValue type={field.type} value={value} copyable={field.copyable} />
      </div>
    </div>
  );
}

// ─── Accordion group ──────────────────────────────────────────────────────────
function AccordionGroup({ group, item, searchQuery }) {
  const [open, setOpen] = useState(group.defaultOpen ?? false);
  const Icon = ICON_MAP[group.icon] ?? Hash;

  const visibleFields = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return group.fields.filter((f) => {
      const hasValue = item[f.key] != null && item[f.key] !== "" && item[f.key] !== "—";
      if (!q) return hasValue;
      return (
        f.label.toLowerCase().includes(q) ||
        String(item[f.key] ?? "").toLowerCase().includes(q)
      );
    });
  }, [group.fields, item, searchQuery]);

  const shouldOpen = (searchQuery && visibleFields.length > 0) || open;

  if (searchQuery && visibleFields.length === 0) return null;

  const filledCount = group.fields.filter(
    (f) => item[f.key] != null && item[f.key] !== "" && item[f.key] !== "—"
  ).length;

  return (
    <div
      className={`border border-gray-100 rounded-lg overflow-hidden mb-2 ${
        group.technical ? "border-l-2 border-l-orange-300" : ""
      }`}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
        aria-expanded={shouldOpen}
      >
        <div className="flex items-center gap-2.5">
          <div className={`p-1.5 rounded-md ${group.technical ? "bg-orange-100" : "bg-blue-50"}`}>
            <Icon size={13} className={group.technical ? "text-orange-500" : "text-blue-600"} />
          </div>
          <span className="text-xs font-semibold text-gray-700">{group.label}</span>
          {group.technical && (
            <span className="text-[9px] uppercase tracking-wide font-bold text-orange-500 bg-orange-50 border border-orange-200 rounded px-1.5 py-0.5">
              Technical
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-400 tabular-nums">{filledCount} fields</span>
          {shouldOpen
            ? <ChevronDown size={14} className="text-gray-400 transition-transform" />
            : <ChevronRight size={14} className="text-gray-400 transition-transform" />
          }
        </div>
      </button>

      {shouldOpen && (
        <div className="px-4 bg-white animate-in slide-in-from-top-1 duration-150">
          {visibleFields.length === 0 ? (
            <p className="py-4 text-xs text-gray-400 text-center">No data available for this section.</p>
          ) : (
            visibleFields.map((field) => (
              <DrawerField
                key={field.key}
                field={field}
                value={item[field.key]}
                highlight={searchQuery}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Drawer ──────────────────────────────────────────────────────────────
export default function LineItemDrawer({
  open,
  onClose,
  item,
  fieldGroups = LINE_ITEM_FIELD_GROUPS,
  title = "Line Item Details",
  subtitle,
  searchPlaceholder = "Search line item fields…",
  emptyMessage = "No line item selected.",
}) {
  const [search, setSearch] = useState("");
  const searchRef = useRef(null);

  // Focus search on open; clear on close
  useEffect(() => {
    if (open) {
      setTimeout(() => searchRef.current?.focus(), 150);
    } else {
      setSearch("");
    }
  }, [open]);

  // Escape → close
  useEffect(() => {
    const handle = (e) => { if (e.key === "Escape" && open) onClose(); };
    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [open, onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const matchCount = useMemo(() => {
    if (!search || !item) return 0;
    const q = search.toLowerCase();
    return fieldGroups.flatMap((g) => g.fields).filter(
      (f) => f.label.toLowerCase().includes(q) || String(item?.[f.key] ?? "").toLowerCase().includes(q)
    ).length;
  }, [search, item, fieldGroups]);

  if (!open && !item) return null;

  const defaultLineLabel = item ? `Line ${item.imiLineNbr ?? "—"}` : "Line Item";
  const partLabel = item?.imiPartNbr && item.imiPartNbr !== "—" ? ` · ${item.imiPartNbr}` : "";
  const panelSubtitle = subtitle ?? `${defaultLineLabel}${partLabel}`;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px] transition-opacity duration-200
          ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`fixed top-0 right-0 h-full z-50 w-full max-w-[500px] bg-white shadow-2xl
          flex flex-col transform transition-transform duration-250 ease-out
          ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Sticky header */}
        <div className="flex-shrink-0 border-b border-gray-200">
          {/* Title bar */}
          <div className="flex items-center justify-between px-5 py-3.5 bg-[#003087]">
            <div>
              <h2 className="text-sm font-semibold text-white">{title}</h2>
              <p className="text-[10px] text-blue-200 mt-0.5">{panelSubtitle}</p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close drawer"
              className="p-1.5 rounded-md text-blue-200 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <X size={16} />
            </button>
          </div>

          {/* Search */}
          <div className="px-4 py-3 bg-gray-50">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-2.5 text-gray-400" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-8 pr-9 py-2 text-xs border border-gray-200 rounded-lg bg-white
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  placeholder-gray-300"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600 p-0.5"
                >
                  <X size={12} />
                </button>
              )}
            </div>
            {search && (
              <p className="mt-1.5 text-[10px] text-gray-500">
                {matchCount > 0 ? (
                  <>
                    <span className="font-semibold text-blue-600">{matchCount}</span>
                    {" "}field{matchCount !== 1 ? "s" : ""} matching{" "}
                    <span className="font-medium">"{search}"</span>
                  </>
                ) : (
                  <span className="text-gray-400">No fields match "{search}"</span>
                )}
              </p>
            )}
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {item ? (
            fieldGroups.map((group) => (
              <AccordionGroup
                key={group.id}
                group={group}
                item={item}
                searchQuery={search}
              />
            ))
          ) : (
            <p className="text-xs text-gray-400 text-center py-12">{emptyMessage}</p>
          )}
        </div>
      </div>
    </>
  );
}
