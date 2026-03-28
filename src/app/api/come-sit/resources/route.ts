import { NextResponse } from "next/server";
import type { MentalHealthBucket } from "@/data/comeSitConfig";
import { MENTAL_HEALTH_BUCKETS } from "@/data/comeSitConfig";
import { rateLimitResponse } from "@/lib/apiRateLimit";
import { tryGeminiResources, tryOpenAIResources } from "@/lib/comeSitResourcesAI";

export const runtime = "nodejs";
export const maxDuration = 120;

type Body = { bucket: MentalHealthBucket; context?: string };

type Way = { title: string; description: string };

type ResourcesPayload = {
  ways: Way[];
  learnMoreSummary: string;
};

function isBucket(v: string): v is MentalHealthBucket {
  return (MENTAL_HEALTH_BUCKETS as string[]).includes(v);
}

const STATIC_FALLBACK: Record<MentalHealthBucket, ResourcesPayload> = {
  depression: {
    learnMoreSummary: "Evidence-based approaches combine routine, connection, and professional support.",
    ways: [
      {
        title: "Reach a trusted professional",
        description:
          "A GP or therapist can assess mood changes and discuss therapy or other options safely.",
      },
      {
        title: "Stabilize sleep & daylight",
        description:
          "Regular sleep and daytime light exposure often support mood regulation alongside other care.",
      },
      {
        title: "Small, repeatable actions",
        description:
          "Tiny, achievable steps (a short walk, one meal, one message) can reduce overwhelm.",
      },
      {
        title: "Stay connected",
        description:
          "Low mood shrinks our world; one safe conversation can interrupt isolation.",
      },
    ],
  },
  anxiety: {
    learnMoreSummary: "Anxiety responds well to skills training, body regulation, and guided support.",
    ways: [
      {
        title: "Grounding & breathing",
        description:
          "Slow exhale-focused breathing and 5-senses grounding can lower acute arousal.",
      },
      {
        title: "Limit stimulants & news spikes",
        description:
          "Caffeine and constant alerts can amplify physical anxiety — gentle pacing helps.",
      },
      {
        title: "Name the worry",
        description:
          "Writing worries and separating facts from fears often reduces rumination loops.",
      },
      {
        title: "Professional skills (CBT, ACT)",
        description:
          "Therapists teach evidence-based tools tailored to your triggers and goals.",
      },
    ],
  },
  psychosis: {
    learnMoreSummary: "Early, compassionate psychiatric care improves outcomes — you deserve timely support.",
    ways: [
      {
        title: "Seek urgent or emergency care if needed",
        description:
          "If you might harm yourself or others, or cannot stay safe, use local emergency services now.",
      },
      {
        title: "Psychiatrist or early psychosis team",
        description:
          "Specialized teams assess changes in perception and thinking with care and privacy.",
      },
      {
        title: "Avoid navigating alone",
        description:
          "A trusted person who knows your situation can help you reach appointments and follow-up.",
      },
      {
        title: "Reduce substances & sleep loss",
        description:
          "Alcohol, cannabis, and severe sleep deprivation can worsen perceptual symptoms.",
      },
    ],
  },
};

export async function POST(req: Request) {
  const limited = rateLimitResponse(req, {
    namespace: "come-sit:resources",
    max: 20,
    windowMs: 15 * 60 * 1000,
  });
  if (limited) return limited;

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body.bucket || !isBucket(body.bucket)) {
    return NextResponse.json({ error: "Invalid bucket." }, { status: 400 });
  }

  const bucket = body.bucket;
  const ctx = typeof body.context === "string" ? body.context.slice(0, 2000) : "";

  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  const openaiKey = process.env.OPENAI_API_KEY?.trim();

  if (!geminiKey && !openaiKey) {
    return NextResponse.json({
      ...STATIC_FALLBACK[bucket],
      source: "fallback",
      notice:
        "No AI keys configured — showing built-in guidance. Add GEMINI_API_KEY and/or OPENAI_API_KEY for personalized suggestions.",
    });
  }

  const notices: string[] = [];

  if (geminiKey) {
    const g = await tryGeminiResources(bucket, ctx, geminiKey);
    if (g.ok) {
      return NextResponse.json({
        ...g.payload,
        source: "gemini",
        model: g.model,
      });
    }
    notices.push(`Gemini: ${g.reason}`);
  }

  if (openaiKey) {
    const o = await tryOpenAIResources(bucket, ctx, openaiKey);
    if (o.ok) {
      return NextResponse.json({
        ...o.payload,
        source: "openai",
        notice:
          notices.length > 0
            ? `Used OpenAI because Gemini was unavailable (${notices[0]?.slice(0, 120)}).`
            : undefined,
      });
    }
    notices.push(`OpenAI: ${o.reason}`);
  }

  return NextResponse.json({
    ...STATIC_FALLBACK[bucket],
    source: "fallback",
    notice: notices.length ? notices.join(" · ") : "AI services unavailable.",
  });
}
