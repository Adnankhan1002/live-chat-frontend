const normalizeBaseUrl = (value, fallback) => {
  const resolved = (value || fallback || "").trim();
  return resolved.replace(/\/+$/, "");
};

export const API_BASE_URL = normalizeBaseUrl(
  process.env.REACT_APP_API_BASE_URL,
  "http://localhost:5050"
);

export const SOCKET_URL = normalizeBaseUrl(
  process.env.REACT_APP_SOCKET_URL,
  API_BASE_URL
);

export const apiUrl = (path = "") => {
  if (!path) {
    return API_BASE_URL;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};