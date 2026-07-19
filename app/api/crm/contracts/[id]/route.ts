import { NextRequest, NextResponse } from "next/server";
import { readCrm, writeCrm } from "@/lib/crmStore";

const STATUSES = ["loyiha", "imzolangan", "bajarilmoqda", "yakunlangan", "bekor_qilingan"];

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => null);
  const data = readCrm();
  const contract = data.contracts.find((c) => c.id === params.id);
  if (!contract) {
    return NextResponse.json({ error: "Shartnoma topilmadi" }, { status: 404 });
  }

  if (body?.number !== undefined) contract.number = String(body.number).trim();
  if (body?.customerName !== undefined) contract.customerName = String(body.customerName).trim();
  if (body?.amount !== undefined) contract.amount = Number(body.amount) || 0;
  if (body?.date !== undefined) contract.date = String(body.date).trim();
  if (body?.notes !== undefined) contract.notes = String(body.notes).trim();
  if (body?.status !== undefined && STATUSES.includes(body.status)) contract.status = body.status;

  if (!contract.number || !contract.customerName) {
    return NextResponse.json({ error: "Shartnoma raqami va mijoz nomi kiritilishi shart" }, { status: 400 });
  }

  writeCrm(data);
  return NextResponse.json({ ok: true, contract });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const data = readCrm();
  const idx = data.contracts.findIndex((c) => c.id === params.id);
  if (idx === -1) {
    return NextResponse.json({ error: "Shartnoma topilmadi" }, { status: 404 });
  }
  data.contracts.splice(idx, 1);
  writeCrm(data);
  return NextResponse.json({ ok: true });
}
