import OpenAI from "openai";
import NodeCache from "node-cache";

const DEFAULT_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const REQUEST_TIMEOUT_MS = 60_000; // 60s
const MAX_RETRIES = 3;
const cache = new NodeCache({ stdTTL: 60 * 5 }); // 5 min

const client = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

// helper function
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function retryWithBackoff(fn, retries = MAX_RETRIES) {
  let attempt = 0;
  let lastErr;
  while (attempt <= retries) {
    try {
      return await fn();
    } catch (error) {
      lastErr = error;
      attempt += 1;

      const status = error?.response?.status || error?.status;

      if (attempt > retries || (status && status < 500 && status != 429)) {
        throw error;
      }
      const backoff =
        Math.pow(2, attempt) * 250 + Math.floor(Math.random() * 100);
      await sleep(backoff);
    }
  }

  throw lastErr;
}

// main

async function askOpenAI(promptOrMessages, options = {}) {
  const {
    model = DEFAULT_MODEL,
    max_tokens = 800,
    temperature = 0.2,
    useCache = false,
    timeout = REQUEST_TIMEOUT_MS,
  } = options;

  const messages = Array.isArray(promptOrMessages)
    ? promptOrMessages
    : [{ role: "user", content: promptOrMessages }];

  const cacheKey = `openai:${model}:${JSON.stringify(messages)}:${max_tokens}:${temperature}`;
  if (useCache) {
    const cached = cache.get(cacheKey);
    if (cached) return cached;
  }

  const call = async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const resp = await client.chat.completions.create(
        {
          model,
          messages,
          max_tokens,
          temperature,
        },
        { signal: controller.signal }
      );

      clearTimeout(timeoutId);

      const content =
        (resp?.choices &&
          resp.choices[0] &&
          resp.choices[0].message?.content) ||
        (resp?.output &&
          Array.isArray(resp.output) &&
          resp.output[0]?.content) ||
        "";

      if (useCache) cache.set(cacheKey, content);
      return content;
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  };

  return retryWithBackoff(call);
}

async function extractStructuredFromText(
  text,
  schemaExample,
  opts = {}
) {
  const schemaJSON = JSON.stringify(schemaExample, null, 2);

  const system =
    opts.system ||
    "You are an assistant that extracts structured data from text and returns JSON only.";
  const userPrompt = `
Extract the following JSON structure exactly (no surrounding text) from the input. Schema:
${schemaJSON}

Input:
"""${text}"""

Return valid JSON that matches the schema. For dates use ISO format (YYYY-MM-DD) where possible. For missing numeric fields return 0 and for missing strings return empty string "".
`;

  const raw = await askOpenAI(
    [
      { role: "system", content: system },
      { role: "user", content: userPrompt },
    ],
    { ...opts, max_tokens: opts.max_tokens || 600 }
  );

  try {
    const jsonTextMatch = raw.match(/\{[\s\S]*\}/);
    const jsonText = jsonTextMatch ? jsonTextMatch[0] : raw;
    const parsed = JSON.parse(jsonText);
    return parsed;
  } catch (err) {
    return { raw, parseError: err.message };
  }
}

async function summarizeExpenses(expenses = [], opts = {}) {
  const sample = (expenses || []).slice(-200).map((e) => ({
    title: e.title,
    amount: Number(e.amount) || 0,
    category: e.category || "other",
    date: e.date ? new Date(e.date).toISOString().slice(0, 10) : "",
  }));

  const system =
    opts.system ||
    "You are a financial assistant that summarizes user expenses in a concise and actionable manner.";

  const userPrompt = `
Given the following expense list as JSON array, provide:
1) totalSpent
2) topCategory
3) topCategoryAmount
4) 3 concise savings suggestions
5) monthly trend sentence (rising/falling/stable)

Expenses:
${JSON.stringify(sample, null, 2)}

Return JSON like:
{
  "totalSpent": 1234.56,
  "topCategory": "food",
  "topCategoryAmount": 500,
  "suggestions": ["...","...","..."],
  "trend": "rising"
}
`;

  const raw = await askOpenAI(
    [
      { role: "system", content: system },
      { role: "user", content: userPrompt },
    ],
    { ...opts, max_tokens: opts.max_tokens || 400, temperature: 0.0 }
  );

  try {
    const jsonTextMatch = raw.match(/\{[\s\S]*\}/);
    const jsonText = jsonTextMatch ? jsonTextMatch[0] : raw;
    const parsed = JSON.parse(jsonText);
    return parsed;
  } catch (err) {
    return { raw, parseError: err.message };
  }
}

export async function parseReceiptFromImage(imageUrl) {
  const messages = [
    {
      role: "system",
      content:
        "You extract structured expense data from receipt images and return JSON only.",
    },
    {
      role: "user",
      content: [
        { type: "text", text: "Extract merchant, totalAmount, date, items, category." },
        { type: "image_url", image_url: imageUrl },
      ],
    },
  ];

  const raw = await askOpenAI(messages, {
    temperature: 0,
    max_tokens: 600,
  });

  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error("Failed to parse receipt JSON");
  }

  return JSON.parse(match[0]);
}


export { askOpenAI, extractStructuredFromText, summarizeExpenses };
