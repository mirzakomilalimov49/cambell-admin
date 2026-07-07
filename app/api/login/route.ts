import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, createSessionToken, timingSafeEqual } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const username = String(body?.username || "");
  const password = String(body?.password || "");

  const expectedUsername = process.env.ADMIN_USERNAME;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  const secret = process.env.AUTH_SECRET;

  if (!expectedUsername || !expectedPassword || !secret) {
    return NextResponse.json(
      { error: "Server sozlanmagan: ADMIN_USERNAME / ADMIN_PASSWORD / AUTH_SECRET yo'q" },
      { status: 500 }
    );
  }

  const ok =
    username.length > 0 &&
    password.length > 0 &&
    timingSafeEqual(username, expectedUsername) &&
    timingSafeEqual(password, expectedPassword);

  if (!ok) {
    return NextResponse.json({ error: "Login yoki parol noto'g'ri" }, { status: 401 });
  }

  const token = await createSessionToken(username, secret);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60,
  });
  return res;
}
