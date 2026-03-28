import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseServer, isServerSupabaseReady } from "@/lib/supabaseServer";
import { generateAnonName } from "@/lib/anonName";
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
  const { username, password, confirmPassword } = await req.json();

  const user = username?.trim()?.toLowerCase();
  const pass = password?.trim();
  const confirm = confirmPassword?.trim();

  if (!user || !pass || !confirm) {
    return NextResponse.json({ error: "Please fill in all fields." }, { status: 400 });
  }

  if (user.length < 3 || user.length > 30) {
    return NextResponse.json(
      { error: "Username must be between 3 and 30 characters." },
      { status: 400 }
    );
  }

  if (!/^[a-z0-9_]+$/.test(user)) {
    return NextResponse.json(
      { error: "Username can only contain letters, numbers, and underscores." },
      { status: 400 }
    );
  }

  if (pass.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters." },
      { status: 400 }
    );
  }

  if (pass !== confirm) {
    return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
  }

  // Dev fallback
  if (!isServerSupabaseReady) {
    return authedResponse({ success: true, username: user, devMode: true });
  }

  // Check username availability
  const { data: existing } = await supabaseServer
    .from("saathi_users")
    .select("id")
    .eq("username", user)
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: "That username is already taken. Please choose another." },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(pass, 12);
  const anonymousName = generateAnonName();

  const { error } = await supabaseServer.from("saathi_users").insert({
    username: user,
    password_hash: passwordHash,
    anonymous_name: anonymousName,
  });

  if (error) {
    // Race condition: username taken between check and insert
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "That username was just taken. Please choose another." },
        { status: 409 }
      );
    }
    console.error("register insert error:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }

  return authedResponse({ success: true, username: user, anonymousName });
}
