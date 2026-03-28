import { NextResponse } from "next/server";
import { rateLimitResponse } from "@/lib/apiRateLimit";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(req: Request) {
  const limited = rateLimitResponse(req, {
    namespace: "come-sit:transcribe",
    max: 12,
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

  const form = await req.formData();
  const file = form.get("audio");
  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: "Missing audio file." }, { status: 400 });
  }

  const out = new FormData();
  out.append("file", file, "recording.webm");
  out.append("model", "whisper-1");

  const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}` },
    body: out,
  });

  const data = (await res.json()) as { text?: string; error?: { message?: string } };
  if (!res.ok) {
    return NextResponse.json(
      { error: data.error?.message ?? "Transcription failed." },
      { status: res.status >= 500 ? 502 : 400 }
    );
  }

  return NextResponse.json({ text: data.text ?? "" });
}
