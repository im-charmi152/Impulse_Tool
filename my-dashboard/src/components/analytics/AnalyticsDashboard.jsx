
import { useState, useEffect, useCallback } from "react";
import {
  ChartNoAxesColumnIncreasing,
  Eye,
  Users,
  TrendingUp,
  Search,
  RefreshCw,
  Loader2,
  CalendarDays,
  Activity,
  ArrowUpRight,
  ChevronDown,
  Clock3,
  CircleDot,
} from "lucide-react";

const API_BASE = (
  import.meta.env.VITE_ORDER_API_BASE_URL || ""
)
  .replace(/\/api\/order\/?$/, "")
  .replace(/\/$/, "");

const DAYS_BY_RANGE = {
  today: 1,
  "7d": 7,
  "30d": 30,
};

const TAB_LABELS = {
  order_details: "Order Details",
  line_items: "Line Items",
  processing_flow: "Processing Flow",
  flow_trace_status: "Flow Trace Status",
  po_switch: "PO Switch",
  setup_configuration: "Setup & Configuration",
  logs_export: "Logs & Export",
};

const TAB_COLORS = {
  order_details: "#1687F8",
  line_items: "#08BFA5",
  processing_flow: "#9B51F5",
  flow_trace_status: "#F59E0B",
  setup_configuration: "#16B8E8",
  po_switch: "#F04475",
  logs_export: "#6F9FCB",
};

const RANGES = [
  { id: "today", label: "Today" },
  { id: "7d", label: "Last 7 days" },
  { id: "30d", label: "Last 30 days" },
];

const formatNumber = (value) =>
  Number(value || 0).toLocaleString("en-US");

async function fetchAnalyticsJson(url, signal) {
  const response = await fetch(url, {
    signal,
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");

    throw new Error(
      details || `Analytics API request failed (${response.status})`
    );
  }

  return response.json();
}

function normalizeAnalyticsData(summary, dailyRows) {
  const tabs = Array.isArray(summary.tabs) ? summary.tabs : [];

  const tabBreakdown = tabs.map((item) => ({
    tab: item.tab,
    views: Number(item.views) || 0,
    uniqueSessions: Number(item.uniqueSessions) || 0,
  }));

  const mostUsedTab = [...tabBreakdown]
    .filter((item) => item.views > 0)
    .sort((a, b) => b.views - a.views)[0]?.tab ?? null;

  const dailyTrend = Array.isArray(dailyRows)
    ? dailyRows.map((day) => ({
        date: day.date,
        views: Number(day.totalTabViews) || 0,
        viewsByTab: day.tabs || {},
      }))
    : [];

  return {
    totalTabViews: Number(summary.totalTabViews) || 0,
    totalOrderSearches: Number(summary.totalSearches) || 0,
    successfulSearches: Number(summary.successfulSearches) || 0,
    failedSearches: Number(summary.failedSearches) || 0,
    tabBreakdown,
    mostUsedTab,
    dailyTrend,
  };
}

function Panel({ children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-[#E3EDF9] bg-white/95 shadow-[0_4px_18px_rgba(31,91,155,0.055)] ${className}`}
    >
      {children}
    </section>
  );
}

function PanelTitle({ icon: Icon, children, action }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="flex items-center gap-2 text-sm font-bold text-[#092F72]">
        {Icon && (
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#EAF4FF] text-[#0878E8]">
            <Icon size={16} strokeWidth={2.4} />
          </span>
        )}
        {children}
      </h2>
      {action}
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  color,
  tint,
  subtext,
}) {
  return (
    <Panel className="relative min-w-0 overflow-hidden p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(31,91,155,0.10)] md:p-5">
      <div
        className="absolute inset-x-0 top-0 h-[3px]"
        style={{
          background: `linear-gradient(90deg, ${color}, ${color}22)`,
        }}
      />

      <div className="flex items-center gap-3">
        <div
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl"
          style={{ backgroundColor: tint, color }}
        >
          <Icon size={23} strokeWidth={2.4} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.09em] text-[#6480A7] md:text-[11px]">
            {label}
          </p>

          <p className="mt-1 truncate text-xl font-extrabold leading-tight text-[#082F70] md:text-[25px]">
            {value ?? "—"}
          </p>

          <p className="mt-1.5 text-[10px] text-[#7890B2]">
            {subtext || "In selected period"}
          </p>
        </div>
      </div>
    </Panel>
  );
}

function TabBreakdownBars({ items = [] }) {
  if (!items.length) {
    return (
      <p className="py-8 text-center text-xs text-[#8AA0BE]">
        No tab views recorded in this range yet.
      </p>
    );
  }

  const max = Math.max(
    ...items.map((item) => Number(item.views) || 0),
    1
  );

  const total = items.reduce(
    (sum, item) => sum + (Number(item.views) || 0),
    0
  );

  return (
    <div className="space-y-[13px]">
      {items.map((item) => {
        const color = TAB_COLORS[item.tab] || "#1687F8";

        const percent = total
          ? ((Number(item.views || 0) / total) * 100).toFixed(1)
          : "0.0";

        return (
          <div key={item.tab}>
            <div className="mb-1.5 flex items-center justify-between gap-3 text-[11px] md:text-xs">
              <span className="flex min-w-0 items-center gap-2 font-medium text-[#35547F]">
                <span
                  className="h-2 w-2 flex-shrink-0 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="truncate">
                  {TAB_LABELS[item.tab] || item.tab}
                </span>
              </span>

              <span className="flex-shrink-0 text-[#6782A8]">
                <strong className="font-semibold text-[#244A7E]">
                  {formatNumber(item.views)}
                </strong>
                <span className="ml-1.5 text-[#8AA0BE]">
                  ({percent}%)
                </span>
              </span>
            </div>

            <div className="h-[10px] overflow-hidden rounded-full bg-[#EEF4FB]">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${(Number(item.views || 0) / max) * 100}%`,
                  background: `linear-gradient(90deg, ${color}, ${color}CC)`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DailyTrendChart({ dailyTrend = [], tabBreakdown = [] }) {
  if (!dailyTrend.length) {
    return (
      <p className="py-8 text-center text-xs text-[#8AA0BE]">
        No daily usage data available yet.
      </p>
    );
  }

  const width = 700;
  const height = 205;
  const left = 38;
  const right = 12;
  const top = 12;
  const bottom = 31;
  const plotW = width - left - right;
  const plotH = height - top - bottom;

  const maxDataValue = Math.max(
    ...dailyTrend.map((day) => Number(day.views) || 0),
    1
  );

  const maxY = Math.max(1, Math.ceil(maxDataValue / 10) * 10);

  const xAt = (index) =>
    left +
    (dailyTrend.length === 1
      ? plotW / 2
      : (index / (dailyTrend.length - 1)) * plotW);

  const yAt = (value) =>
    top + plotH - ((Number(value) || 0) / maxY) * plotH;

  // Only show per-tab series when the daily API has real counts for those tabs.
  const series = tabBreakdown
    .filter((tab) =>
      dailyTrend.some(
        (day) => Number(day.viewsByTab?.[tab.tab] || 0) > 0
      )
    )
    .map((tab) => ({
      tab: tab.tab,
      label: TAB_LABELS[tab.tab] || tab.tab,
      color: TAB_COLORS[tab.tab] || "#1687F8",
      values: dailyTrend.map(
        (day) => Number(day.viewsByTab?.[tab.tab] || 0)
      ),
    }));

  // Fall back to actual total views, not estimated tab distributions.
  if (!series.length) {
    series.push({
      tab: "total",
      label: "Total views",
      color: "#1687F8",
      values: dailyTrend.map((day) => Number(day.views) || 0),
    });
  }

  const gridValues = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div className="min-w-0">
      <div className="h-[218px] w-full">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-full w-full overflow-visible"
          role="img"
          aria-label="Daily RADIUS tab usage trend"
        >
          <defs>
            {series.map((item) => (
              <linearGradient
                key={item.tab}
                id={`area-${item.tab}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor={item.color}
                  stopOpacity="0.16"
                />
                <stop
                  offset="100%"
                  stopColor={item.color}
                  stopOpacity="0"
                />
              </linearGradient>
            ))}
          </defs>

          {gridValues.map((part, index) => {
            const y = top + (plotH * index) / 4;
            const value = Math.round(maxY * (1 - part));

            return (
              <g key={`${value}-${index}`}>
                <line
                  x1={left}
                  y1={y}
                  x2={width - right}
                  y2={y}
                  stroke="#EAF1F9"
                  strokeWidth="1"
                />
                <text
                  x={left - 8}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="10"
                  fill="#8AA0BE"
                >
                  {value}
                </text>
              </g>
            );
          })}

          {series.map((item) => {
            const points = item.values
              .map(
                (value, index) =>
                  `${xAt(index)},${yAt(value)}`
              )
              .join(" ");

            const area = `${left},${top + plotH} ${points} ${xAt(
              item.values.length - 1
            )},${top + plotH}`;

            return (
              <g key={item.tab}>
                <polygon
                  points={area}
                  fill={`url(#area-${item.tab})`}
                />

                <polyline
                  points={points}
                  fill="none"
                  stroke={item.color}
                  strokeWidth="2.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {item.values.map((value, index) => (
                  <circle
                    key={`${item.tab}-${index}`}
                    cx={xAt(index)}
                    cy={yAt(value)}
                    r="2.8"
                    fill={item.color}
                    stroke="#fff"
                    strokeWidth="1.1"
                  >
                    <title>
                      {`${item.label}: ${value} views`}
                    </title>
                  </circle>
                ))}
              </g>
            );
          })}

          {dailyTrend.map((day, index) => (
            <text
              key={`${day.date}-${index}`}
              x={xAt(index)}
              y={height - 7}
              textAnchor="middle"
              fontSize="10"
              fill="#8AA0BE"
            >
              {(day.date || "").slice(5)}
            </text>
          ))}
        </svg>
      </div>

      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-2 border-t border-[#F0F4FA] pt-3">
        {series.map((item) => (
          <span
            key={item.tab}
            className="inline-flex items-center gap-1.5 text-[10px] text-[#5E789D]"
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function RecentActivity() {
  return (
    <div className="py-6 text-center">
      <Clock3 size={22} className="mx-auto mb-2 text-[#9AB0CD]" />

      <p className="text-xs font-medium text-[#526F96]">
        Recent activity is not available yet.
      </p>

      <p className="mt-1 text-[11px] text-[#8AA0BE]">
        The current backend does not expose a recent-events API.
      </p>
    </div>
  );
}

export default function AnalyticsDashboard() {
  const [range, setRange] = useState("7d");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const load = useCallback(() => {
    setRefreshKey((key) => key + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function loadAnalytics() {
      setLoading(true);
      setError(null);

      const days = DAYS_BY_RANGE[range] ?? 7;

      try {
        const [summary, dailyRows] = await Promise.all([
          fetchAnalyticsJson(
            `${API_BASE}/api/analytics/summary?days=${days}`,
            controller.signal
          ),
          fetchAnalyticsJson(
            `${API_BASE}/api/analytics/daily?days=${days}`,
            controller.signal
          ),
        ]);

        if (!controller.signal.aborted) {
          setData(normalizeAnalyticsData(summary, dailyRows));
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setData(null);
          setError(
            err.message || "Unable to load analytics from the server."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadAnalytics();

    return () => controller.abort();
  }, [range, refreshKey]);

  const breakdown = data?.tabBreakdown || [];

  const totalBreakdown = breakdown.reduce(
    (sum, item) => sum + Number(item.views || 0),
    0
  );

  const mostUsedViews =
    breakdown.find((item) => item.tab === data?.mostUsedTab)?.views;

  const mostUsedPercent =
    mostUsedViews != null && totalBreakdown
      ? `${((mostUsedViews / totalBreakdown) * 100).toFixed(1)}% of total`
      : "No tab views yet";

  return (
    <div className="min-h-full bg-[radial-gradient(ellipse_at_top_left,_#EAF4FF_0%,_#F5F9FF_38%,_#F8FBFF_100%)] p-4 md:p-6 xl:p-7">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-6 flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
          <div>
            <h1 className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight text-[#073783] md:text-2xl">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#0878E8] shadow-sm ring-1 ring-[#DCEBFC]">
                <ChartNoAxesColumnIncreasing
                  size={21}
                  strokeWidth={2.5}
                />
              </span>
              Usage Analytics
            </h1>

            <p className="ml-0.5 mt-1.5 text-sm text-[#6480A7]">
              Understand how RADIUS is being used across features.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-xl border border-[#DDE9F8] bg-white p-1 shadow-sm">
              {RANGES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setRange(item.id)}
                  className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition md:px-4 ${
                    range === item.id
                      ? "bg-gradient-to-r from-[#1687F8] to-[#0867CE] text-white shadow-[0_3px_8px_rgba(8,103,206,0.25)]"
                      : "text-[#5C7599] hover:bg-[#F1F7FF] hover:text-[#0C64C2]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={load}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-[#DDE9F8] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#2269B3] shadow-sm transition hover:border-[#A9CEF8] hover:bg-[#F5FAFF] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={14}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <button
              type="button"
              onClick={() => setRange("30d")}
              title="View the last 30 days"
              className="inline-flex items-center gap-2 rounded-xl border border-[#DDE9F8] bg-white px-3.5 py-2.5 text-xs font-semibold text-[#6480A7] shadow-sm hover:bg-[#F5FAFF]"
            >
              <CalendarDays size={14} />
              Date range
              <ChevronDown size={13} />
            </button>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-2 rounded-2xl border border-[#E3EDF9] bg-white/90 py-16 text-sm text-[#6480A7]">
            <Loader2
              size={17}
              className="animate-spin text-[#1687F8]"
            />
            Loading analytics…
          </div>
        )}

        {error && !loading && (
          <div
            role="alert"
            className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <p className="font-semibold">
              Couldn't load analytics
            </p>
            <p className="mt-1 break-words">{error}</p>

            <button
              type="button"
              onClick={load}
              className="mt-3 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-semibold hover:bg-red-100"
            >
              Try again
            </button>
          </div>
        )}

        {data && !loading && !error && (
          <>
            <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-4">
              <StatCard
                label="Total Tab Views"
                value={formatNumber(data.totalTabViews)}
                icon={Eye}
                color="#1687F8"
                tint="#E1F3FF"
                subtext="In selected period"
              />

              <StatCard
                label="Sessions"
                value={formatNumber(data.successfulSearches)}
                icon={Search}
                color="#08BFA5"
                tint="#DDFBF4"
                subtext="Searches with success outcome"
              />

              <StatCard
                label="Most Used Tab"
                value={
                  TAB_LABELS[data.mostUsedTab] ||
                  data.mostUsedTab ||
                  "—"
                }
                icon={TrendingUp}
                color="#9955F5"
                tint="#F0E6FF"
                subtext={
                  mostUsedViews != null
                    ? `${formatNumber(mostUsedViews)} views (${mostUsedPercent})`
                    : mostUsedPercent
                }
              />

              <StatCard
                label="Total Order Searches"
                value={formatNumber(data.totalOrderSearches)}
                icon={Search}
                color="#F59E0B"
                tint="#FFF2DE"
                subtext="In selected period"
              />
            </div>

            <div className="mb-5 grid grid-cols-1 gap-4 2xl:grid-cols-[0.92fr_1.08fr]">
              <Panel className="p-4 md:p-5">
                <PanelTitle icon={ChartNoAxesColumnIncreasing}>
                  Tab Usage Breakdown
                </PanelTitle>

                <TabBreakdownBars items={breakdown} />
              </Panel>

              <Panel className="min-w-0 p-4 md:p-5">
                <PanelTitle icon={TrendingUp}>
                  Tab Usage Trend
                </PanelTitle>

                <DailyTrendChart
                  dailyTrend={data.dailyTrend || []}
                  tabBreakdown={breakdown}
                />
              </Panel>
            </div>

            <div className="grid grid-cols-1 gap-4 2xl:grid-cols-2">
              <Panel className="min-w-0 overflow-hidden p-4 md:p-5">
                <PanelTitle
                  icon={Clock3}
                  action={
                    <span className="rounded-full bg-[#EEF6FF] px-2.5 py-1 text-[10px] font-semibold text-[#2674C4]">
                      Latest events
                    </span>
                  }
                >
                  Recent Activity
                </PanelTitle>

                <RecentActivity />
              </Panel>

              {/* <Panel className="min-w-0 overflow-hidden p-4 md:p-5">
                <PanelTitle icon={Activity}>
                  Tab Usage Details
                </PanelTitle>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[480px] text-left text-[11px]">
                    <thead>
                      <tr className="border-y border-[#E8F0FA] bg-[#F5F9FE] text-[#6E86A8]">
                        <th className="px-2.5 py-2.5 font-semibold">
                          Tab Name
                        </th>
                        <th className="px-2.5 py-2.5 font-semibold">
                          Identifier
                        </th>
                        <th className="px-2.5 py-2.5 text-right font-semibold">
                          Total Views
                        </th>
                        <th className="px-2.5 py-2.5 text-right font-semibold">
                          Unique Sessions
                        </th>
                        <th className="px-2.5 py-2.5 text-right font-semibold">
                          % Total
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {!breakdown.length ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-3 py-8 text-center text-[#8AA0BE]"
                          >
                            No usage data yet.
                          </td>
                        </tr>
                      ) : (
                        breakdown.map((item) => {
                          const color =
                            TAB_COLORS[item.tab] || "#1687F8";

                          const percent = totalBreakdown
                            ? (
                                (Number(item.views || 0) /
                                  totalBreakdown) *
                                100
                              ).toFixed(1)
                            : "0.0";

                          return (
                            <tr
                              key={item.tab}
                              className="border-b border-[#EFF4FA] transition last:border-0 hover:bg-[#F8FBFF]"
                            >
                              <td className="whitespace-nowrap px-2.5 py-2.5">
                                <span className="flex items-center gap-2 font-medium text-[#294C7A]">
                                  <span
                                    className="h-2 w-2 rounded-full"
                                    style={{
                                      backgroundColor: color,
                                    }}
                                  />
                                  {TAB_LABELS[item.tab] || item.tab}
                                </span>
                              </td>

                              <td className="whitespace-nowrap px-2.5 py-2.5 font-mono text-[10px] text-[#7A91B0]">
                                {item.tab}
                              </td>

                              <td className="px-2.5 py-2.5 text-right font-bold text-[#234A7E]">
                                {formatNumber(item.views)}
                              </td>

                              <td className="px-2.5 py-2.5 text-right text-[#5F7A9F]">
                                {formatNumber(item.uniqueSessions)}
                              </td>

                              <td className="px-2.5 py-2.5 text-right">
                                <span className="rounded-full bg-[#EFF7FF] px-2 py-1 font-semibold text-[#2875C2]">
                                  {percent}%
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </Panel> */}
            </div>

            <p className="mt-4 flex items-center justify-end gap-1.5 text-[10px] text-[#91A5C0]">
              <CircleDot size={10} className="text-[#08BFA5]" />
              Analytics based on recorded usage events
            </p>
          </>
        )}
      </div>
    </div>
  );
}
