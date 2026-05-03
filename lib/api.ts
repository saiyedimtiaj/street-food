import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://street-food-backend.vercel.app/api/v1",
  withCredentials: true,
});

export default api;
