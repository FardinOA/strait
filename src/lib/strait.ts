/*
  Every number on the page comes from here so the hero, the reef, the log and
  the tide tables always agree. Rates are illustrative, not live.
*/

export type Source = "GBP" | "EUR" | "USD";

export const SOURCES: Record<Source, { symbol: string; usd: number; city: string }> = {
  GBP: { symbol: "£", usd: 1.338, city: "London" },
  EUR: { symbol: "€", usd: 1.158, city: "Berlin" },
  USD: { symbol: "$", usd: 1, city: "New York" },
};

export type Port = {
  id: string;
  city: string;
  country: string;
  code: string;
  symbol: string;
  perUsd: number;
  minutes: number;
  rail: string;
  recipient: string;
  bank: string;
};

/** The first six are the hero's destinations; the tide tables list all of them. */
export const PORTS: Port[] = [
  { id: "lagos", city: "Lagos", country: "Nigeria", code: "NGN", symbol: "₦", perUsd: 1515, minutes: 9, rail: "NIP", recipient: "Amara", bank: "GTBank" },
  { id: "dhaka", city: "Dhaka", country: "Bangladesh", code: "BDT", symbol: "৳", perUsd: 121.6, minutes: 11, rail: "bKash", recipient: "Nusrat", bank: "bKash" },
  { id: "manila", city: "Manila", country: "Philippines", code: "PHP", symbol: "₱", perUsd: 57.3, minutes: 4, rail: "InstaPay", recipient: "Lia", bank: "BPI" },
  { id: "mumbai", city: "Mumbai", country: "India", code: "INR", symbol: "₹", perUsd: 84.6, minutes: 2, rail: "UPI", recipient: "Rohan", bank: "HDFC" },
  { id: "cdmx", city: "Mexico City", country: "Mexico", code: "MXN", symbol: "MX$", perUsd: 18.7, minutes: 6, rail: "SPEI", recipient: "Inés", bank: "BBVA" },
  { id: "nairobi", city: "Nairobi", country: "Kenya", code: "KES", symbol: "KSh", perUsd: 129.2, minutes: 3, rail: "M-Pesa", recipient: "Wanjiru", bank: "M-Pesa" },
  { id: "accra", city: "Accra", country: "Ghana", code: "GHS", symbol: "GH₵", perUsd: 15.6, minutes: 7, rail: "GhIPSS", recipient: "Kojo", bank: "Ecobank" },
  { id: "karachi", city: "Karachi", country: "Pakistan", code: "PKR", symbol: "₨", perUsd: 281, minutes: 14, rail: "Raast", recipient: "Hira", bank: "Meezan" },
  { id: "hanoi", city: "Hanoi", country: "Vietnam", code: "VND", symbol: "₫", perUsd: 25400, minutes: 8, rail: "NAPAS 247", recipient: "Linh", bank: "Vietcombank" },
  { id: "bogota", city: "Bogotá", country: "Colombia", code: "COP", symbol: "COL$", perUsd: 4120, minutes: 12, rail: "Bre-B", recipient: "Camila", bank: "Bancolombia" },
  { id: "kathmandu", city: "Kathmandu", country: "Nepal", code: "NPR", symbol: "रु", perUsd: 135.4, minutes: 18, rail: "ConnectIPS", recipient: "Pema", bank: "Nabil" },
  { id: "cairo", city: "Cairo", country: "Egypt", code: "EGP", symbol: "E£", perUsd: 48.9, minutes: 20, rail: "IPN", recipient: "Youssef", bank: "CIB" },
];

export const HERO_PORTS = PORTS.slice(0, 6);

export const rate = (s: Source, p: Port) => SOURCES[s].usd * p.perUsd;

/** One fee: 65 pence/cents plus 0.35%. No spread on the rate. */
export const fee = (amount: number) => (amount > 0 ? 0.65 + amount * 0.0035 : 0);

export function quote(amount: number, s: Source, p: Port) {
  const f = fee(amount);
  const r = rate(s, p);
  return { fee: f, rate: r, receive: Math.max(0, amount - f) * r };
}

export const money = (n: number, digits = 2) =>
  n.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });

/** Rates under 10 get four decimals, like a real quote; big ones get two. */
export const rateText = (r: number) => money(r, r < 10 ? 4 : 2);

const WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"];
export const minuteWord = (n: number) => WORDS[n] ?? String(n);
export const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Deterministic noise so the server and the browser draw the same chart. */
export function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const hash = (s: string) => [...s].reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619), 2166136261);

/** A rate history for a port: `days` points around 1.0, wandering a little. */
export function history(id: string, days = 30) {
  const rnd = seeded(hash(id));
  const drift = (rnd() - 0.45) * 0.0016;
  let v = 1 - drift * days * 0.5;
  return Array.from({ length: days }, () => {
    v += drift + (rnd() - 0.5) * 0.0055;
    return v;
  });
}

export const trendWord = (pts: number[]) => {
  const d = pts[pts.length - 1] / pts[0] - 1;
  return Math.abs(d) < 0.0025 ? "steady" : d > 0 ? "rising slowly" : "falling slowly";
};

/** What other kinds of provider charge, as a fixed fee plus a markup hidden in the rate. */
export const PROVIDERS = [
  { name: "Strait", note: "Fee shown up front", fixed: 0.65, pct: 0.0035, markup: 0 },
  { name: "Typical app", note: "Small fee, thin markup", fixed: 1.99, pct: 0, markup: 0.009 },
  { name: "Card abroad", note: "Foreign card fee", fixed: 2.99, pct: 0, markup: 0.0275 },
  { name: "“Free” bank wire", note: "No fee, wide spread", fixed: 0, pct: 0, markup: 0.036 },
  { name: "Airport bureau", note: "Commission free", fixed: 0, pct: 0, markup: 0.11 },
];

/** How much each provider keeps from `amount`, compared with the mid-market rate. */
export const kept = (amount: number, p: (typeof PROVIDERS)[number]) => {
  const f = p.fixed + amount * p.pct;
  return f + (amount - f) * p.markup;
};
