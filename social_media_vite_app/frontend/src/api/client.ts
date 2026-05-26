import axios from "axios";

// In production (Render), frontend is served by the same backend — use relative URLs.
// In local dev, Vite runs on :5173 and backend on :8000, so we need the full URL.
const isProd = import.meta.env.PROD;
const API_URL = isProd ? "" : "http://localhost:8000";

const client = axios.create({
  baseURL: API_URL,
});

export default client;
