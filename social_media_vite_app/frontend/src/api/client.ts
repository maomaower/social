import axios from "axios";

// Automatically fallback to localhost:8000 for local development
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const client = axios.create({
  baseURL: API_URL,
});

export default client;
