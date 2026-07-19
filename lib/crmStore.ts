import fs from "fs";
import path from "path";

const DATA_DIR = process.env.CRM_DATA_DIR || path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "crm.json");

export interface Customer {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  createdAt: string;
}

export type LeadStage = "yangi" | "aloqada" | "taklif" | "kelishildi" | "yopildi" | "yutqazildi";

export interface Lead {
  id: string;
  title: string;
  customerName: string;
  phone: string;
  amount: number;
  stage: LeadStage;
  source: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export type ContractStatus = "loyiha" | "imzolangan" | "bajarilmoqda" | "yakunlangan" | "bekor_qilingan";

export interface Contract {
  id: string;
  number: string;
  customerName: string;
  amount: number;
  status: ContractStatus;
  date: string;
  notes: string;
  createdAt: string;
}

export interface CrmData {
  customers: Customer[];
  leads: Lead[];
  contracts: Contract[];
}

function ensureData(): CrmData {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    const empty: CrmData = { customers: [], leads: [], contracts: [] };
    fs.writeFileSync(DATA_FILE, JSON.stringify(empty, null, 2), "utf8");
    return empty;
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

export function readCrm(): CrmData {
  return ensureData();
}

export function writeCrm(data: CrmData) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
}

export function nextId(items: { id: string }[]) {
  return String(items.reduce((max, it) => Math.max(max, Number(it.id) || 0), 0) + 1);
}
