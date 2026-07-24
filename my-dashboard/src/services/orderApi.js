import axios from "axios";

// Falls back to this IP if no env var is set. To override, create a
// .env.local file in your project root with:
//   VITE_ORDER_API_BASE_URL=http://localhost:5298/api/order
const BASE_URL =
  import.meta.env.VITE_ORDER_API_BASE_URL ||
  "http://localhost:5298/api/order";

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

export const getOrderDetails = async (poNumber, countryCode, signal) => {
  try {
    const response = await client.post(
      "/GetOrder",
      { poNumber, countryCode },
      { signal }
    );
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};