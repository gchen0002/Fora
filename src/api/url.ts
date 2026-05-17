const configuredApiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/+$/, "");
const productionApiBaseUrl = "https://fora-api.xnohohsd1.workers.dev";

function isBrowserOnLocalhost() {
  if (typeof window === "undefined") return false;

  return ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
}

function isLoopbackApiUrl(value: string) {
  return /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?(?:\/|$)/.test(value);
}

function getApiBaseUrl() {
  if (!configuredApiBaseUrl) return "";

  if (!isBrowserOnLocalhost() && isLoopbackApiUrl(configuredApiBaseUrl)) {
    return productionApiBaseUrl;
  }

  return configuredApiBaseUrl;
}

export function apiUrl(path: `/${string}`) {
  return `${getApiBaseUrl()}${path}`;
}
