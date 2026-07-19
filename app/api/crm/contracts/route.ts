import { NextRequest, NextResponse } from "next/server";
import { readCrm, writeCrm, nextId, Contract } from "@/lib/crmStore";

const STATUSES = ["loyiha", "imzolangan", "bajarilmoqda", "yakunlangan", "bekor_qilingan"];

export async function GET() {
  const data = readCrm();
  return NextResponse.json({ contracts: data.contracts });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const number = String(body?.number || "").trim();
  const customerName = String(body?.customerName || "").trim();

  if (!number || !customerName) {
    return NextResponse.json({ error: "Shartnoma raqami va mijoz nomi kiritilishi shart" }, { status: 400 });
  }

  const status = STATUSES.includes(body?.status) ? body.status : "loyiha";
  const data = readCrm();
  const contract: Contract = {
    id: nextId(data.contracts),
    number,
    customerName,
    amount: Number(body?.amount) || 0,
    status,
    date: String(body?.date || "").trim() || new Date().toISOString().slice(0, 10),
    notes: String(body?.notes || "").trim(),
    createdAt: new Date().toISOString(),
  };
  data.contracts.unshift(contract);
  writeCrm(data);

  return NextResponse.json({ ok: true, contract });
}
