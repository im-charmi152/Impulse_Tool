import axios from "axios";

// Falls back to the value you gave me so this still runs out of the box,
// but override it via .env.local -> VITE_ORDER_API_BASE_URL for any other
// environment (a teammate's machine, staging, prod) without touching code.
const BASE_URL =
  import.meta.env.VITE_ORDER_API_BASE_URL ||
  "http://http://localhost:5174/api/order";

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

/**
 * Calls POST {BASE_URL}/GetOrder with { poNumber, countryCode }.
 * @param {string} poNumber
 * @param {string} countryCode
 * @param {AbortSignal} [signal] - lets callers cancel an in-flight request
 *   (e.g. when a newer search supersedes this one).
 */
export const getOrderDetails = async (poNumber, countryCode, signal) => {
  try {
    const response = await client.post(
      "/GetOrder",
      { poNumber, countryCode },
      { signal }
    );
    return response.data;
  } catch (error) {
    if (axios.isCancel(error) || error.code === "ERR_CANCELED") {
      throw error; // let callers distinguish cancellation from real failures
    }
    console.error("orderApi.getOrderDetails failed:", error);
    throw error;
  }
};
