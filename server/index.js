// server/index.js
import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import path from "path";
import { fileURLToPath } from "url";

// ✅ Always load env from THIS folder (server/.env) using absolute path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
app.use(express.json({ limit: "1mb" }));

// ✅ Bulletproof CORS (DEV) - allow any localhost port + handle preflight
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (
    origin &&
    (origin.startsWith("http://localhost:") ||
      origin.startsWith("http://127.0.0.1:"))
  ) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }

  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

console.log("SERVER VERSION: ABS-PATH-ENV + CORS v1");
console.log("ENV FILE:", path.join(__dirname, ".env"));
console.log("HAS GEMINI KEY:", Boolean(process.env.GEMINI_API_KEY));

const API_KEY = process.env.GEMINI_API_KEY;
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

app.get("/health", (req, res) => res.json({ ok: true }));

const classifyServerError = (err) => {
  const msg = String(err?.message ?? err ?? "");
  const lower = msg.toLowerCase();

  if (lower.includes("429") || lower.includes("quota")) {
    return { status: 429, error: "QUOTA_EXCEEDED", detail: "Gemini quota/rate limit reached." };
  }

  if (lower.includes("api key not valid") || lower.includes("invalid api key") || lower.includes("api_key_invalid")) {
    return { status: 401, error: "API_KEY_INVALID", detail: "Gemini API key was rejected." };
  }

  if (
    lower.includes("fetch failed") ||
    lower.includes("econnrefused") ||
    lower.includes("etimedout") ||
    lower.includes("enotfound") ||
    lower.includes("network")
  ) {
    return { status: 502, error: "UPSTREAM_NETWORK_ERROR", detail: "Backend could not reach Gemini API." };
  }

  if (lower.includes("candidate") && lower.includes("blocked")) {
    return { status: 422, error: "CONTENT_BLOCKED", detail: "Gemini blocked the content or returned no usable candidate." };
  }

  return { status: 500, error: "SERVER_ERROR", detail: "Unexpected server-side AI error." };
};

app.post("/api/generate", async (req, res) => {
  try {
    if (!genAI) return res.status(500).json({ error: "SERVER_KEY_MISSING" });

    const { prompt, model = "gemini-2.5-flash" } = req.body;
    const promptStr = String(prompt ?? "");

    if (!promptStr.trim())
      return res.status(400).json({ error: "PROMPT_EMPTY" });
    if (promptStr.length > 12000)
      return res.status(400).json({ error: "PROMPT_TOO_LONG" });

    const m = genAI.getGenerativeModel({ model });

    const result = await m.generateContent({
      contents: [{ role: "user", parts: [{ text: promptStr }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 1200 },
    });

    const response = result?.response;
    const text =
      response?.candidates?.[0]?.content?.parts
        ?.map((p) => p?.text)
        .filter(Boolean)
        .join("") || "";

    return res.json({ text });
  } catch (err) {
    const msg = String(err?.message ?? err ?? "");
    const classified = classifyServerError(err);

    console.error("[AI_PROXY_ERROR]", {
      error: classified.error,
      detail: classified.detail,
      message: msg,
    });

    return res.status(classified.status).json({
      error: classified.error,
      detail: classified.detail,
      message: msg,
    });
  }
});

const PORT = process.env.PORT || 8787;
app.listen(PORT, () =>
  console.log(`AI proxy running: http://localhost:${PORT}`),
);
