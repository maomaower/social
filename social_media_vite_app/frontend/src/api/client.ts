import axios from "axios";

// Use VITE_API_URL if provided (e.g., in Vercel environment variables).
// Otherwise, default to the Render backend URL in production, or localhost in dev.
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "https://social-latest.onrender.com" : "http://localhost:8000");

const client = axios.create({
  baseURL: API_URL,
});

export default client;
