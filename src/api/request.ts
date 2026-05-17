const API_REQUEST_TIMEOUT_MS = 15_000;

export async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit = {},
  timeoutMessage = "Request timed out. Try refreshing the page.",
) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), API_REQUEST_TIMEOUT_MS);

  try {
    return await fetch(input, {
      ...init,
      signal: init.signal ?? controller.signal,
    });
  } catch (cause) {
    if (controller.signal.aborted) {
      throw new Error(timeoutMessage);
    }

    throw cause;
  } finally {
    window.clearTimeout(timeoutId);
  }
}
