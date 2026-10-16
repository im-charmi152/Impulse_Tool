
const API_BASE = (
  import.meta.env.VITE_ORDER_API_BASE_URL || ""
)
  .replace(/\/api\/order\/?$/, "")
  .replace(/\/$/, "");

const SESSION_KEY = "radius-analytics-session-id";

let fallbackSessionId;

function getSessionId() {
  try {
    let sessionId = sessionStorage.getItem(SESSION_KEY);

    if (!sessionId) {
      sessionId =
        typeof crypto !== "undefined" &&
        typeof crypto.randomUUID === "function"
          ? `anonymous-${crypto.randomUUID()}`
          : `anonymous-${Date.now()}-${Math.random()
              .toString(36)
              .slice(2)}`;

      sessionStorage.setItem(SESSION_KEY, sessionId);
    }

    return sessionId;
  } catch {
    // Keep a stable ID if sessionStorage is unavailable.
    if (!fallbackSessionId) {
      fallbackSessionId = `anonymous-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2)}`;
    }

    return fallbackSessionId;
  }
}

export async function trackAnalyticsEvent({
  eventType,
  tab = null,
  outcome = null,
}) {
  try {
    const response = await fetch(
      `${API_BASE}/api/analytics/events`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          sessionId: getSessionId(),
          eventType,
          tab,
          outcome,
        }),
      }
    );

    if (!response.ok) {
      console.error(
        "RADIUS analytics event rejected:",
        response.status
      );
    }
  } catch (error) {
    // Analytics failures should not break order searches.
    console.error("RADIUS analytics request failed:", error);
  }
}

export function trackTabView(tab) {
  return trackAnalyticsEvent({
    eventType: "tab_view",
    tab,
  });
}

export function trackOrderSearch(outcome) {
  return trackAnalyticsEvent({
    eventType: "order_search",
    outcome,
  });
}
