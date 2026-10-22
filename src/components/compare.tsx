"use client";

import { useState } from "react";
import { cx } from "@/lib/cx";
import { useSeen, useTween } from "@/lib/hooks";
import { PORTS, PROVIDERS, kept, money, rate, rateText } from "@/lib/strait";
import { Logo, SectionHead, Segmented } from "./ui";

const LAGOS = PORTS[0];
const R = rate("GBP", LAGOS);
const AMOUNTS = ["250", "1000", "5000", "20000"] as const;
type Amount = (typeof AMOUNTS)[number];
const FLOOR = 0.86; // bars start at 86% of the mid-market value so the gaps are visible

export function Compare() {
  const [a, setA] = useState<Amount>("1000");
  const amount = Number(a);
  const rows = PROVIDERS.map((p) => {
    const lost = kept(amount, p);
    const share = (amount - lost) / amount;
    return { ...p, lost, get: (amount - lost) * R, w: ((share - FLOOR) / (1 - FLOOR)) * 100 };
  });
  const saved = (rows[3].lost - rows[0].lost) * R;
  const [seenRef, seen] = useSeen<HTMLUListElement>(0.25);
  const savedShown = useTween(seen ? saved : 0, 1200);

  return (
    <section id="compare" className="relative py-24 sm:py-32">
      <div className="shell">
        <div className="reveal flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHead
            badge="Markup X-ray"
            title="“No fee” usually means the fee is in the rate."
            lede="Most providers hide their cut in the exchange rate. We sent the same money to Lagos five different ways and measured what each one kept."
          />
          <div className="shrink-0">
            <p className="mb-2.5 text-[13px] font-medium text-ink-3">If you send</p>
            <Segmented label="Amount to send" value={a} onChange={setA} options={AMOUNTS.map((v) => ({ value: v, label: `£${Number(v).toLocaleString("en-US")}` }))} className="w-full sm:w-[380px]" />
          </div>
        </div>

        <div className="reveal mt-12 overflow-hidden rounded-[28px] bg-paper lift">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-7">
            <p className="text-[13px] text-ink-2">
              Mid-market rate <span className="font-mono text-ink">1 GBP = {rateText(R)} NGN</span>
            </p>
            <p className="flex items-center gap-4 text-[12px] text-ink-3">
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-[3px] bg-ink" /> Arrives
              </span>
              <span className="flex items-center gap-1.5">
                <span className="hatch size-2.5 rounded-[3px] ring-1 ring-ink/15" /> Kept by provider
              </span>
            </p>
          </div>

          <ul ref={seenRef} className="cascade divide-y divide-line">
            {rows.map((r, i) => {
              const ours = i === 0;
              return (
                <li key={r.name} className={cx("group/row grid gap-3 transition-colors hover:bg-page px-5 py-5 sm:grid-cols-[200px_1fr_88px_150px] sm:items-center sm:gap-6 sm:px-7", ours && "bg-lime-50/70")}>
                  <div className="flex items-center gap-3">
                    {ours ? <Logo className="size-8" /> : <span className="grid size-8 place-items-center rounded-[9px] bg-mist font-mono text-[11px] text-ink-3">{i}</span>}
                    <div className="leading-tight">
                      <p className="text-[15px] font-semibold">{r.name}</p>
                      <p className="text-[12.5px] text-ink-3">{r.note}</p>
                    </div>
                  </div>

                  <div className="relative h-10 overflow-hidden rounded-xl hatch ring-1 ring-ink/8">
                    <div
                      className={cx(
                        "absolute inset-y-0 left-0 rounded-xl transition-[width,filter] ease-out-soft group-hover/row:brightness-110",
                        ours ? "bg-linear-to-r from-lime-300 to-lime-500 shadow-[inset_0_1px_0_rgb(255_255_255/.5)]" : "bg-ink",
                      )}
                      style={{ width: seen ? `${Math.max(2, r.w)}%` : "0%", transitionDelay: seen ? `${i * 110 + 150}ms` : "0ms", transitionDuration: "1100ms" }}
                    />
                  </div>

                  <p className="flex items-baseline justify-between gap-2 sm:block sm:text-right">
                    <span className="text-[12px] text-ink-3 sm:block">Kept</span>
                    <span className={cx("font-mono text-[14px] font-medium tabular-nums", ours ? "text-ink" : "text-ink-2")}>−£{money(r.lost)}</span>
                  </p>

                  <p className="flex items-baseline justify-between gap-2 sm:block sm:text-right">
                    <span className="text-[12px] text-ink-3 sm:block">Amara gets</span>
                    <span className={cx("text-[15px] font-semibold tabular-nums", ours && "text-lime-700")}>₦{money(Math.round(r.get), 0)}</span>
                  </p>
                </li>
              );
            })}
          </ul>

          <div className="relative overflow-hidden bg-ink px-5 py-7 text-white sm:px-7">
            <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(50%_120%_at_100%_0%,rgb(184_228_60/.25),transparent_60%)]" />
            <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-[560px] text-[17px] leading-snug text-white/75 sm:text-[19px]">
                Compared with a “free” bank wire, sending £{Number(a).toLocaleString("en-US")} with Strait puts this much more in Amara&rsquo;s account:
              </p>
              <p className="font-display text-[clamp(34px,4.4vw,52px)] leading-none font-semibold tracking-[-.045em] text-lime-400 tabular-nums">₦{money(Math.round(savedShown), 0)}</p>
            </div>
            <p className="relative mt-4 text-[12px] text-white/40">Bars start at 86% of the mid-market value so the differences are visible. Typical published spreads, Oct 2026. Illustrative only.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
