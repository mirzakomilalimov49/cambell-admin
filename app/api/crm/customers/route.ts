import { NextRequest, NextResponse } from "next/server";
import { readCrm, writeCrm, nextId, Customer } from "@/lib/crmStore";

export async function GET() {
  const data = readCrm();
  return NextResponse.json({ customers: data.customers });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const name = String(body?.name || "").trim();
  const phone = String(body?.phone || "").trim();

  if (!name || !phone) {
    return NextResponse.json({ error: "Ism va telefon raqami kiritilishi shart" }, { status: 400 });
  }

  const data = readCrm();
  const customer: Customer = {
    id: nextId(data.customers),
    name,
    company: String(body?.company || "").trim(),
    phone,
    email: String(body?.email || "").trim(),
    address: String(body?.address || "").trim(),
    notes: String(body?.notes || "").trim(),
    createdAt: new Date().toISOString(),
  };
  data.customers.unshift(customer);
  writeCrm(data);

  return NextResponse.json({ ok: true, customer });
}
