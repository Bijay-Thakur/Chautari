import type { MentalHealthBucket } from "@/data/comeSitConfig";
import { parseJsonObject } from "@/lib/llmJson";

export type ResourceWay = { title: string; description: string };

export type ResourcesPayload = {
  ways: ResourceWay[];
  learnMoreSummary: string;
};

const PROMPT = (bucket: MentalHealthBucket, ctx: string) => `You help compile supportive, evidence-informed mental health education (not diagnosis).
Concern area for this user: "${bucket}".
Optional user context (paraphrased): """${ctx}"""

Use reputable public-health framing (WHO, NHS, NIMH-style psychoeducation). Output JSON only:
{
  "ways": [ { "title": "short title", "description": "2-3 sentences, actionable and compassionate" } ],
  "learnMoreSummary": "one sentence on why learning more helps"
}

Provide exactly 5 items in "ways". No markdown, no code fences, JSON only.`;

function cleanWays(ways: unknown): ResourceWay[] {
  if (!Array.isArray(ways)) return [];
  return ways
    .slice(0, 5)
    .map((w: { title?: string; description?: string }) => ({
      title: String(w.title ?? "").slice(0, 120),
      description: String(w.description ?? "").slice(0, 500),
    }))
    .filter((w) => w.title && w.description);
}

function parseGeminiText(raw: unknown): string {
  const text =
    (raw as { candidates?: { content?: { parts?: { text?: string }[] } }[] })?.candidates?.[0]
      ?.content?.parts?.[0]?.text ?? "";
  return text;
}

/** Prefer 1.5 Flash first — separate quota from 2.0 Flash; many free tiers hit 2.0 limits first. */
function geminiModelCandidates(): string[] {
  const primary = process.env.GEMINI_MODEL?.trim();
  const extra = process.env.GEMINI_MODEL_FALLBACKS?.split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const defaults = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b",
    "gemini-2.0-flash",
    "gemini-2.0-flash-001",
  ];

  const list = [primary, ...(extra ?? []), ...defaults].filter(Boolean) as string[];
  return [...new Set(list)];
}

export async function tryGeminiResources(
  bucket: MentalHealthBucket,
  ctx: string,
  apiKey: string
): Promise<{ ok: true; payload: ResourcesPayload; model: string } | { ok: false; reason: string }> {
  const prompt = PROMPT(bucket, ctx);
  const models = geminiModelCandidates();

  let lastReason = "No Gemini models succeeded.";

  for (const model of models) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.4,
          responseMimeType: "application/json",
        },
      }),
    });

    const raw = await res.json();

    if (!res.ok) {
      const msg = (raw as { error?: { message?: string; status?: string } })?.error?.message ?? "";
      const status = (raw as { error?: { code?: number } })?.error?.code;
      lastReason = msg || `HTTP ${res.status}`;
      /* Quota / rate — try next model */
      if (res.status === 429 || status === 429 || /quota|limit|resource_exhausted/i.test(msg)) {
        continue;
      }
      /* Model not found — try next */
      if (res.status === 404 || /not found|invalid/i.test(msg)) {
        continue;
      }
      continue;
    }

    const text = parseGeminiText(raw);
    try {
      const parsed = parseJsonObject<ResourcesPayload>(text);
      const clean = cleanWays(parsed.ways);
      if (clean.length >= 3) {
        return {
          ok: true,
          payload: {
            ways: clean,
            learnMoreSummary: String(parsed.learnMoreSummary ?? "").slice(0, 400),
          },
          model,
        };
      }
    } catch {
      lastReason = "Invalid JSON from Gemini.";
    }
  }

  return { ok: false, reason: lastReason };
}

export async function tryOpenAIResources(
  bucket: MentalHealthBucket,
  ctx: string,
  apiKey: string
): Promise<{ ok: true; payload: ResourcesPayload } | { ok: false; reason: string }> {
  const prompt = PROMPT(bucket, ctx);
  const model = process.env.OPENAI_RESOURCES_MODEL?.trim() || "gpt-4o-mini";

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.35,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You output only valid JSON matching the user's schema. No markdown, no extra keys.",
        },
        { role: "user", content: prompt },
      ],
    }),
  });

  const raw = await res.json();
  if (!res.ok) {
    const msg = (raw as { error?: { message?: string } })?.error?.message ?? "OpenAI request failed.";
    return { ok: false, reason: msg };
  }

  const content = (raw as { choices?: { message?: { content?: string } }[] }).choices?.[0]?.message
    ?.content;
  if (!content) {
    return { ok: false, reason: "Empty OpenAI response." };
  }

  try {
    const parsed = parseJsonObject<ResourcesPayload>(content);
    const clean = cleanWays(parsed.ways);
    if (clean.length < 3) {
      return { ok: false, reason: "Too few items from OpenAI." };
    }
    return {
      ok: true,
      payload: {
        ways: clean,
        learnMoreSummary: String(parsed.learnMoreSummary ?? "").slice(0, 400),
      },
    };
  } catch {
    return { ok: false, reason: "Could not parse OpenAI JSON." };
  }
}
