import { NextRequest, NextResponse } from "next/server";
import { readCrm, writeCrm, nextId, Lead } from "@/lib/crmStore";

const STAGES = ["yangi", "aloqada", "taklif", "kelishildi", "yopildi", "yutqazildi"];

export async function GET() {
  const data = readCrm();
  return NextResponse.json({ leads: data.leads });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const title = String(body?.title || "").trim();
  const customerName = String(body?.customerName || "").trim();

  if (!title || !customerName) {
    return NextResponse.json({ error: "Sarlavha va mijoz nomi kiritilishi shart" }, { status: 400 });
  }

  const stage = STAGES.includes(body?.stage) ? body.stage : "yangi";
  const data = readCrm();
  const now = new Date().toISOString();
  const lead: Lead = {
    id: nextId(data.leads),
    title,
    customerName,
    phone: String(body?.phone || "").trim(),
    amount: Number(body?.amount) || 0,
    stage,
    source: String(body?.source || "").trim(),
    notes: String(body?.notes || "").trim(),
    createdAt: now,
    updatedAt: now,
  };
  data.leads.unshift(lead);
  writeCrm(data);

  return NextResponse.json({ ok: true, lead });
}
