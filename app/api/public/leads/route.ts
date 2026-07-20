import { NextRequest, NextResponse } from "next/server";
import { readCrm, writeCrm, nextId, Lead } from "@/lib/crmStore";

/**
 * Server-to-server endpoint: the main cambell.uz site (buyurtma
 * configurator) pushes new leads here. Protected by the same shared
 * secret used for the news-publishing flow (ADMIN_API_KEY), not by
 * the browser login session — the caller is a trusted backend, not
 * a logged-in admin.
 */
export async function POST(req: NextRequest) {
  const apiKey = process.env.ADMIN_API_KEY;
  if (!apiKey || req.headers.get("x-admin-key") !== apiKey) {
    return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const title = String(body?.title || "").trim();
  const customerName = String(body?.customerName || "").trim();

  if (!title || !customerName) {
    return NextResponse.json({ error: "Sarlavha va mijoz nomi kiritilishi shart" }, { status: 400 });
  }

  const data = readCrm();
  const now = new Date().toISOString();
  const lead: Lead = {
    id: nextId(data.leads),
    title,
    customerName,
    phone: String(body?.phone || "").trim(),
    amount: Number(body?.amount) || 0,
    stage: "yangi",
    source: String(body?.source || "Sayt").trim(),
    notes: String(body?.notes || "").trim(),
    createdAt: now,
    updatedAt: now,
  };
  data.leads.unshift(lead);
  writeCrm(data);

  return NextResponse.json({ ok: true, lead });
}
