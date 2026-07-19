import { NextRequest, NextResponse } from "next/server";
import { readCrm, writeCrm } from "@/lib/crmStore";

const STAGES = ["yangi", "aloqada", "taklif", "kelishildi", "yopildi", "yutqazildi"];

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => null);
  const data = readCrm();
  const lead = data.leads.find((l) => l.id === params.id);
  if (!lead) {
    return NextResponse.json({ error: "Lead topilmadi" }, { status: 404 });
  }

  if (body?.title !== undefined) lead.title = String(body.title).trim();
  if (body?.customerName !== undefined) lead.customerName = String(body.customerName).trim();
  if (body?.phone !== undefined) lead.phone = String(body.phone).trim();
  if (body?.amount !== undefined) lead.amount = Number(body.amount) || 0;
  if (body?.source !== undefined) lead.source = String(body.source).trim();
  if (body?.notes !== undefined) lead.notes = String(body.notes).trim();
  if (body?.stage !== undefined && STAGES.includes(body.stage)) lead.stage = body.stage;

  if (!lead.title || !lead.customerName) {
    return NextResponse.json({ error: "Sarlavha va mijoz nomi kiritilishi shart" }, { status: 400 });
  }

  lead.updatedAt = new Date().toISOString();
  writeCrm(data);
  return NextResponse.json({ ok: true, lead });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const data = readCrm();
  const idx = data.leads.findIndex((l) => l.id === params.id);
  if (idx === -1) {
    return NextResponse.json({ error: "Lead topilmadi" }, { status: 404 });
  }
  data.leads.splice(idx, 1);
  writeCrm(data);
  return NextResponse.json({ ok: true });
}
