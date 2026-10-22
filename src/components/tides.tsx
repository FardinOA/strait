"use client";

import { useDeferredValue, useEffect, useState } from "react";
import { cx } from "@/lib/cx";
import { PORTS, SOURCES, history, money, quote, rateText, type Source } from "@/lib/strait";
import { Cur, SectionHead, Segmented } from "./ui";

const SPARKS = Object.fromEntries(
  PORTS.map((p) => {
    const pts = history(p.id, 7);
    const lo = Math.min(...pts);
    const hi = Math.max(...pts);
    const d = pts.map((v, i) => `${i ? "L" : "M"}${((i / (pts.length - 1)) * 64).toFixed(1)},${(18 - ((v - lo) / (hi - lo || 1)) * 16).toFixed(1)}`).join(" ");
    return [p.id, { d, up: pts[pts.length - 1] >= pts[0], change: (pts[pts.length - 1] / pts[0] - 1) * 100 }];
  }),
);

/** Seconds since the last refresh, cycling every 30 s like the real feed. */
function useRefreshed() {
  const [s, setS] = useState<number | null>(null);
  useEffect(() => {
    const t0 = Date.now();
    const id = setInterval(() => setS(Math.floor((Date.now() - t0) / 1000) % 30), 1000);
    return () => clearInterval(id);
  }, []);
  return s;
}

export function Tides() {
  const [source, setSource] = useState<Source>("GBP");
  const [q, setQ] = useState("");
  const query = useDeferredValue(q.trim().toLowerCase());
  const ago = useRefreshed();
  const sym = SOURCES[source].symbol;
  const rows = PORTS.filter((p) => !query || `${p.city} ${p.country} ${p.code} ${p.rail}`.toLowerCase().includes(query));

  return (
    <section id="rates" className="relative bg-paper py-24 sm:py-32">
      <div className="shell">
        <div className="reveal grid gap-10 lg:grid-cols-12 lg:items-end">
          <SectionHead badge="Live rates" title="Every corridor, every fee, every minute." lede="Today's rate, the whole fee and the typical delivery time for twelve of our 74 corridors." className="lg:col-span-7" />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:col-span-5 lg:justify-end">
            <label className="relative block sm:w-[240px]">
              <span className="sr-only">Find a country</span>
              <svg viewBox="0 0 16 16" aria-hidden="true" className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-ink-3">
                <circle cx={7} cy={7} r={4.5} fill="none" stroke="currentColor" strokeWidth={1.5} />
                <path d="m10.5 10.5 3 3" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
              </svg>
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="City, country or currency"
                className="h-10 w-full rounded-full bg-page pr-4 pl-10 text-[16px] ring-1 ring-line-2 transition-shadow outline-none placeholder:text-ink-3 focus:ring-2 focus:ring-ink sm:text-[14px]"
              />
            </label>
            <Segmented label="Currency you send" value={source} onChange={setSource} options={(Object.keys(SOURCES) as Source[]).map((s) => ({ value: s, label: s }))} className="sm:w-[200px]" />
          </div>
        </div>

        <div className="reveal mt-12 overflow-hidden rounded-[24px] bg-paper ring-1 ring-line">
          <div className="flex items-center justify-between gap-4 bg-page px-5 py-3 sm:px-6">
            <p className="text-[12.5px] text-ink-2">
              Sending <b className="font-semibold text-ink">{sym}1,000</b> · fees in {source}
            </p>
            <p className="flex items-center gap-2 text-[12px] text-ink-3 tabular-nums" aria-live="off">
              <span aria-hidden="true" className="relative size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-lime-400" />
                <span className="absolute inset-0 rounded-full bg-lime-500" />
              </span>
              {ago === null || ago === 0 ? "Updated just now" : `Updated ${ago}s ago`}
            </p>
          </div>

          <table className="w-full border-collapse text-left">
            <caption className="sr-only">Exchange rates, fees and delivery times by destination, for {sym}1,000</caption>
            <thead>
              <tr className="text-[12px] text-ink-3 [&>th]:px-3 [&>th]:py-3.5 [&>th]:font-medium first:[&>th]:pl-5 last:[&>th]:pr-5 sm:first:[&>th]:pl-6 sm:last:[&>th]:pr-6">
                <th scope="col">Destination</th>
                <th scope="col" className="hidden md:table-cell">
                  Pays out via
                </th>
                <th scope="col" className="hidden sm:table-cell">
                  Rate
                </th>
                <th scope="col" className="hidden lg:table-cell">
                  7 days
                </th>
                <th scope="col" className="hidden md:table-cell">
                  Fee
                </th>
                <th scope="col" className="text-right">
                  They get
                </th>
                <th scope="col" className="w-[104px] sm:w-[150px]">
                  Arrives in
                </th>
              </tr>
            </thead>
            <tbody className="cascade">
              {rows.map((p) => {
                const qt = quote(1000, source, p);
                const sp = SPARKS[p.id];
                return (
                  <tr key={p.id} className="group/row border-t border-line transition-colors hover:bg-lime-50/60 [&>td]:px-3 [&>td]:py-3.5 first:[&>td]:pl-5 last:[&>td]:pr-5 sm:first:[&>td]:pl-6 sm:last:[&>td]:pr-6">
                    <td>
                      <span className="flex items-center gap-3">
                        <Cur code={p.code} className="size-8 text-[8px] ring-0 transition-transform duration-500 ease-spring group-hover/row:scale-110 group-hover/row:-rotate-12" />
                        <span className="leading-tight">
                          <span className="flex items-center gap-2 text-[14.5px] font-semibold">
                            {p.city}
                            <a
                              href="#start"
                              className="hidden -translate-x-1 items-center gap-1 rounded-full bg-ink px-2 py-0.5 text-[10.5px] font-semibold text-lime-400 opacity-0 transition-[opacity,translate] duration-300 group-hover/row:translate-x-0 group-hover/row:opacity-100 focus-visible:translate-x-0 focus-visible:opacity-100 sm:inline-flex"
                            >
                              Send →
                            </a>
                          </span>
                          <span className="block text-[12.5px] text-ink-3">{p.country}</span>
                        </span>
                      </span>
                    </td>
                    <td className="hidden md:table-cell">
                      <span className="rounded-full bg-page px-2.5 py-1 text-[12px] font-medium text-ink-2 ring-1 ring-line">{p.rail}</span>
                    </td>
                    <td className="hidden font-mono text-[12.5px] whitespace-nowrap tabular-nums sm:table-cell">
                      {rateText(qt.rate)} <span className="text-ink-3">{p.code}</span>
                    </td>
                    <td className="hidden lg:table-cell">
                      <span className="flex items-center gap-2">
                        <svg viewBox="0 0 64 20" className="h-5 w-16" aria-hidden="true">
                          <path d={sp.d} fill="none" stroke={sp.up ? "var(--color-lime-600)" : "var(--color-ink-3)"} strokeWidth={1.6} strokeLinejoin="round" />
                        </svg>
                        <span className={cx("font-mono text-[11px] tabular-nums", sp.up ? "text-lime-700" : "text-ink-3")}>
                          {sp.change >= 0 ? "+" : "−"}
                          {Math.abs(sp.change).toFixed(2)}%
                        </span>
                      </span>
                    </td>
                    <td className="hidden font-mono text-[12.5px] tabular-nums md:table-cell">
                      {sym}
                      {money(qt.fee)}
                    </td>
                    <td className="text-right font-mono text-[13.5px] font-semibold whitespace-nowrap tabular-nums">
                      {p.symbol}
                      {money(Math.round(qt.receive), 0)}
                    </td>
                    <td>
                      <span className="flex items-center gap-2.5">
                        <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-mist">
                          <span className="absolute inset-y-0 left-0 rounded-full bg-lime-500" style={{ width: `${(p.minutes / 20) * 100}%` }} />
                        </span>
                        <span className="w-[44px] text-right font-mono text-[12px] tabular-nums">{p.minutes} min</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {rows.length === 0 && (
            <div className="border-t border-line px-6 py-14 text-center">
              <p className="font-display text-[22px] font-semibold tracking-[-.03em]">We don&rsquo;t send to “{q.trim()}” yet.</p>
              <p className="mx-auto mt-2 max-w-[380px] text-[14.5px] text-ink-2">We open about two new countries a month, and requests decide the order.</p>
              <a href="#start" className="mt-5 inline-block text-[14px] font-semibold underline decoration-lime-500 decoration-2 underline-offset-4">
                Request {q.trim() || "a country"}
              </a>
            </div>
          )}

          <div className="flex flex-col gap-2 border-t border-line px-5 py-4 text-[13px] text-ink-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p>Delivery time is the median for the last 30 days. Large first transfers can take longer while we check them.</p>
            <a href="#start" className="shrink-0 font-semibold text-ink underline decoration-lime-500 decoration-2 underline-offset-4">
              All 74 countries
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
