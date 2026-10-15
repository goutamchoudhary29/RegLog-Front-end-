import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

export const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

let csrfTokenCache = null;

export function clearCsrfToken() {
  csrfTokenCache = null;
}

export async function ensureCsrfToken() {
  if (csrfTokenCache) return csrfTokenCache;
  const { data } = await api.get("/csrf");
  csrfTokenCache = data?.token || null;
  return csrfTokenCache;
}

api.interceptors.request.use(async (config) => {
  const method = (config.method || "get").toLowerCase();
  if (!["get", "head", "options"].includes(method)) {
    const token = await ensureCsrfToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers["X-XSRF-TOKEN"] = token;
    }
  }
  return config;
});

export default api;
