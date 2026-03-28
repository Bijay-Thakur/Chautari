import { NextResponse } from "next/server";

/**
 * Best-effort in-memory rate limit (per server instance).
 * For strict global limits in production, use Redis / Upstash with the same interface.
 */
const hits = new Map<string, number[]>();

function prune(key: string, windowMs: number) {
  const now = Date.now();
  const start = now - windowMs;
  const arr = hits.get(key) ?? [];
  const next = arr.filter((t) => t > start);
  hits.set(key, next);
  return next;
}

function clientKey(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) {
    const first = fwd.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = req.headers.get("x-real-ip")?.trim();
  if (real) return real;
  return "unknown";
}

export type RateLimitOptions = {
  /** e.g. "come-sit:transcribe" */
  namespace: string;
  max: number;
  windowMs: number;
};

/**
 * @returns NextResponse 429 if over limit, otherwise null (caller continues).
 */
export function rateLimitResponse(req: Request, opts: RateLimitOptions): NextResponse | null {
  const id = clientKey(req);
  const key = `${opts.namespace}:${id}`;
  const arr = prune(key, opts.windowMs);
  if (arr.length >= opts.max) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a few minutes before trying again." },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(opts.windowMs / 1000 / 2)),
        },
      }
    );
  }
  arr.push(Date.now());
  hits.set(key, arr);
  return null;
}
