import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const title = String(body?.title || "").trim();
  const text = String(body?.body || "").trim();

  if (!title || !text) {
    return NextResponse.json({ error: "Sarlavha va matn kiritilishi shart" }, { status: 400 });
  }

  const siteUrl = process.env.MAIN_SITE_URL;
  const apiKey = process.env.ADMIN_API_KEY;

  if (!siteUrl || !apiKey) {
    return NextResponse.json(
      { error: "Server sozlanmagan: MAIN_SITE_URL / ADMIN_API_KEY muhit o'zgaruvchilari yo'q" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(`${siteUrl.replace(/\/$/, "")}/api/news`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": apiKey,
      },
      body: JSON.stringify({ title, body: text }),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: data?.error || "Xatolik yuz berdi" }, { status: res.status });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Asosiy saytga ulanib bo'lmadi" }, { status: 502 });
  }
}
