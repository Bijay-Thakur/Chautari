import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseServer, isServerSupabaseReady } from "@/lib/supabaseServer";
import { SAATHI_AUTH_COOKIE, SAATHI_AUTH_VALUE } from "@/constants/auth";

function authedResponse(body: object) {
  const res = NextResponse.json(body);
  res.cookies.set(SAATHI_AUTH_COOKIE, SAATHI_AUTH_VALUE, {
    path: "/",
    maxAge: 604800,
    sameSite: "lax",
    httpOnly: false,
  });
  return res;
}

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  const user = username?.trim()?.toLowerCase();
  const pass = password?.trim();

  if (!user || !pass) {
    return NextResponse.json({ error: "Please fill in all fields." }, { status: 400 });
  }

  // Dev fallback — no service role key configured
  if (!isServerSupabaseReady) {
    return authedResponse({ success: true, username: user, devMode: true });
  }

  const { data: row, error } = await supabaseServer
    .from("saathi_users")
    .select("id, username, password_hash, anonymous_name")
    .eq("username", user)
    .maybeSingle();

  if (error) {
    console.error("login select error:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }

  if (!row) {
    return NextResponse.json(
      { error: "No account found with that username. Please register first." },
      { status: 404 }
    );
  }

  const valid = await bcrypt.compare(pass, row.password_hash);
  if (!valid) {
    return NextResponse.json(
      { error: "Incorrect password. Please try again." },
      { status: 401 }
    );
  }

  // Fire-and-forget last_seen update
  supabaseServer
    .from("saathi_users")
    .update({ last_seen_at: new Date().toISOString() })
    .eq("id", row.id);

  return authedResponse({
    success: true,
    username: row.username,
    anonymousName: row.anonymous_name,
  });
}
