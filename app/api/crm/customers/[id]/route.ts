import { NextRequest, NextResponse } from "next/server";
import { readCrm, writeCrm } from "@/lib/crmStore";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => null);
  const name = String(body?.name || "").trim();
  const phone = String(body?.phone || "").trim();

  if (!name || !phone) {
    return NextResponse.json({ error: "Ism va telefon raqami kiritilishi shart" }, { status: 400 });
  }

  const data = readCrm();
  const customer = data.customers.find((c) => c.id === params.id);
  if (!customer) {
    return NextResponse.json({ error: "Mijoz topilmadi" }, { status: 404 });
  }

  customer.name = name;
  customer.phone = phone;
  customer.company = String(body?.company || "").trim();
  customer.email = String(body?.email || "").trim();
  customer.address = String(body?.address || "").trim();
  customer.notes = String(body?.notes || "").trim();

  writeCrm(data);
  return NextResponse.json({ ok: true, customer });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const data = readCrm();
  const idx = data.customers.findIndex((c) => c.id === params.id);
  if (idx === -1) {
    return NextResponse.json({ error: "Mijoz topilmadi" }, { status: 404 });
  }
  data.customers.splice(idx, 1);
  writeCrm(data);
  return NextResponse.json({ ok: true });
}
