import { NextResponse } from "next/server";
import type { MentalHealthBucket } from "@/data/comeSitConfig";
import { MENTAL_HEALTH_BUCKETS } from "@/data/comeSitConfig";
import { rateLimitResponse } from "@/lib/apiRateLimit";
import { parseJsonObject } from "@/lib/llmJson";

export const runtime = "nodejs";
export const maxDuration = 60;

type ClassifyBody = { text: string };

type ClassifyResponse = {
  bucket: MentalHealthBucket;
  title: string;
  howItAffects: string;
};

function isBucket(v: string): v is MentalHealthBucket {
  return (MENTAL_HEALTH_BUCKETS as string[]).includes(v);
}

export async function POST(req: Request) {
  const limited = rateLimitResponse(req, {
    namespace: "come-sit:classify",
    max: 30,
    windowMs: 15 * 60 * 1000,
  });
  if (limited) return limited;

  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "OpenAI API key is not configured (OPENAI_API_KEY)." },
      { status: 503 }
    );
  }

  let body: ClassifyBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const text = typeof body.text === "string" ? body.text.trim() : "";
  if (text.length < 3) {
    return NextResponse.json(
      { error: "Please share a bit more before continuing." },
      { status: 400 }
    );
  }

  const system = `You are a supportive mental-health education assistant (NOT a clinician, NOT diagnosing). 
Given the user's own words, infer dominant emotional themes and classify into exactly ONE bucket:
- "depression": persistent low mood, emptiness, hopelessness, loss of interest, heavy fatigue, worthlessness themes.
- "anxiety": worry, fear, panic, rumination, restlessness, hypervigilance, tension themes.
- "psychosis": ONLY if the user clearly describes hallucinations, hearing voices others don't, fixed false beliefs/delusions, or severe loss of contact with shared reality. If unclear, prefer "anxiety" over "psychosis".

Respond with JSON only, keys: bucket (string, one of depression|anxiety|psychosis), title (short compassionate headline, max 12 words), howItAffects (2-4 sentences, validating and educational, no "you have disorder X" diagnosis language).`;

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.3,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: text.slice(0, 8000) },
      ],
    }),
  });

  const raw = await res.json();
  if (!res.ok) {
    const msg =
      (raw as { error?: { message?: string } }).error?.message ?? "Classification failed.";
    return NextResponse.json({ error: msg }, { status: 502 });
  }

  const content = (raw as { choices?: { message?: { content?: string } }[] }).choices?.[0]
    ?.message?.content;
  if (!content) {
    return NextResponse.json({ error: "Empty model response." }, { status: 502 });
  }

  let parsed: ClassifyResponse;
  try {
    parsed = parseJsonObject<ClassifyResponse>(content);
  } catch {
    return NextResponse.json({ error: "Could not parse classification." }, { status: 502 });
  }

  if (!parsed.bucket || !isBucket(parsed.bucket)) {
    return NextResponse.json({ error: "Invalid bucket from model." }, { status: 502 });
  }

  return NextResponse.json({
    bucket: parsed.bucket,
    title: String(parsed.title ?? "").slice(0, 200),
    howItAffects: String(parsed.howItAffects ?? "").slice(0, 1200),
  });
}
