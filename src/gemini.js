// src/gemini.js
// Frontend -> Backend proxy -> Gemini (key is NOT exposed in browser)

const isDev = import.meta.env.DEV;
const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

// Queue AI calls instead of rejecting concurrent clicks.
let requestQueue = Promise.resolve();

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function parseRetryDelayMs(message) {
  const msg = String(message || "");

  const secondsMatch = msg.match(/retry in\s+(\d+(\.\d+)?)s/i);
  if (secondsMatch?.[1]) return Math.ceil(parseFloat(secondsMatch[1]) * 1000);

  const retryDelayMatch = msg.match(/"retryDelay"\s*:\s*"(\d+)s"/i);
  if (retryDelayMatch?.[1]) return parseInt(retryDelayMatch[1], 10) * 1000;

  return 15000;
}

function getErrorCode(resStatus, data, error) {
  if (data?.error) return data.error;
  if (resStatus === 429) return "QUOTA_EXCEEDED";
  const msg = (error?.message || "").toLowerCase();
  if (msg.includes("fetch") || msg.includes("network")) return "NETWORK_ERROR";
  return "AI_ERROR";
}

async function runProxyRequest(promptStr) {
  const callOnce = async () => {
    const baseUrl = isDev ? "" : apiBaseUrl;
    const res = await fetch(`${baseUrl}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: promptStr }),
    });

    const data = await res.json().catch(() => ({}));
    return { res, data };
  };

  if (isDev) {
    console.log("AI proxy request (prompt length):", promptStr.length);
  }

  let { res, data } = await callOnce();

  if (!res.ok && (res.status === 429 || data?.error === "QUOTA_EXCEEDED")) {
    const waitMs = parseRetryDelayMs(data?.message || "");
    if (isDev) {
      console.warn("Proxy quota hit. Retrying...", {
        waitMs,
        status: res.status,
        error: data?.error,
        detail: data?.detail,
        message: data?.message,
      });
    }
    await sleep(waitMs);
    ({ res, data } = await callOnce());
  }

  if (!res.ok) {
    if (isDev) {
      console.error("AI proxy request failed:", {
        status: res.status,
        error: data?.error,
        detail: data?.detail,
        message: data?.message,
      });
    }

    const err = new Error(data?.message || "AI service error. Please try again.");
    err.code = getErrorCode(res.status, data, err);
    err.meta = {
      status: res.status,
      data,
      detail: data?.detail || "",
    };
    throw err;
  }

  const text = String(data?.text || "");
  if (isDev) {
    console.log("AI proxy response length:", text.length);
  }

  if (!text.trim()) {
    const err = new Error("AI returned an empty response. Try shortening or changing the prompt.");
    err.code = "EMPTY_RESPONSE";
    throw err;
  }

  return text;
}

/**
 * Call backend proxy to generate text safely (Gemini key stays on server)
 */
export const generateText = async (prompt) => {
  const promptStr = String(prompt ?? "");

  if (promptStr.length > 12000) {
    const err = new Error("Your input is too long for AI generation. Please shorten it and try again.");
    err.code = "PROMPT_TOO_LONG";
    throw err;
  }

  const queuedRequest = requestQueue.then(
    () => runProxyRequest(promptStr),
    () => runProxyRequest(promptStr),
  );

  requestQueue = queuedRequest.catch(() => {});

  try {
    return await queuedRequest;
  } catch (error) {
    if (isDev) {
      console.error("AI generation failed:", {
        code: error?.code,
        message: error?.message,
        detail: error?.meta?.detail || error?.detail || "",
        status: error?.meta?.status || null,
      });
    }

    if (error?.code) throw error;

    const code = getErrorCode(null, null, error);
    const friendly = new Error(
      code === "QUOTA_EXCEEDED"
        ? "AI quota exceeded. Try again later."
        : code === "NETWORK_ERROR"
          ? "Network error. Check your connection and try again."
          : "AI service error. Please try again.",
    );
    friendly.code = code;
    friendly.cause = error;
    throw friendly;
  }
};
