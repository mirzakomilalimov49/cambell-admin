import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const siteUrl = process.env.MAIN_SITE_URL;

  if (!siteUrl) {
    return NextResponse.json({ error: "MAIN_SITE_URL muhit o'zgaruvchisi yo'q" }, { status: 500 });
  }

  const base = siteUrl.replace(/\/$/, "");

  try {
    const res = await fetch(`${base}/assets/data/news.json?t=${Date.now()}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("news.json load failed");
    const data = await res.json();

    if (Array.isArray(data?.articles)) {
      data.articles = data.articles.map((a: { image?: string }) => ({
        ...a,
        image: a.image ? `${base}/${a.image}` : a.image,
      }));
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Yangiliklar ro'yxatini olishda xatolik" }, { status: 502 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const title = String(body?.title || "").trim();
  const text = String(body?.body || "").trim();
  const image = typeof body?.image === "string" && body.image ? body.image : undefined;

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
      body: JSON.stringify({ title, body: text, image }),
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
