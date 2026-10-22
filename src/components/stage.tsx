"use client";

import { useEffect, useRef, useState } from "react";
import { cx } from "@/lib/cx";
import { useTween } from "@/lib/hooks";
import { SOURCES, money, rateText, type Port, type Source } from "@/lib/strait";
import { Count } from "./count";
import { Avatar, Cur } from "./ui";

const SURNAMES: Record<string, string> = { lagos: "Okafor", dhaka: "Jahan", manila: "Santos", mumbai: "Mehta", cdmx: "Ramírez", nairobi: "Kamau" };

// The beam: one cubic from the send card to the phone, in a 400×300 box stretched over the gap.
const P0 = { x: 0, y: 196 };
const P1 = { x: 170, y: 200 };
const P2 = { x: 210, y: 40 };
const P3 = { x: 400, y: 112 };
const BEAM = `M${P0.x} ${P0.y} C${P1.x} ${P1.y} ${P2.x} ${P2.y} ${P3.x} ${P3.y}`;
const bez = (t: number) => {
  const u = 1 - t;
  return {
    x: u * u * u * P0.x + 3 * u * u * t * P1.x + 3 * u * t * t * P2.x + t * t * t * P3.x,
    y: u * u * u * P0.y + 3 * u * u * t * P1.y + 3 * u * t * t * P2.y + t * t * t * P3.y,
  };
};
const SAMPLES = Array.from({ length: 201 }, (_, i) => bez(i / 200));
const LENGTHS = SAMPLES.reduce<number[]>((acc, p, i) => {
  acc.push(i ? acc[i - 1] + Math.hypot(p.x - SAMPLES[i - 1].x, p.y - SAMPLES[i - 1].y) : 0);
  return acc;
}, []);
const TOTAL = LENGTHS[LENGTHS.length - 1];
const at = (f: number) => {
  const target = f * TOTAL;
  let i = 1;
  while (i < LENGTHS.length - 1 && LENGTHS[i] < target) i++;
  const k = (target - LENGTHS[i - 1]) / (LENGTHS[i] - LENGTHS[i - 1] || 1);
  return { x: SAMPLES[i - 1].x + (SAMPLES[i].x - SAMPLES[i - 1].x) * k, y: SAMPLES[i - 1].y + (SAMPLES[i].y - SAMPLES[i - 1].y) * k };
};

const STOPS = [0.24, 0.62];
const TRAVEL = 4200;
const HOLD = 3200;
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function Check({ on }: { on: boolean }) {
  return (
    <span className={cx("grid size-5 place-items-center rounded-full transition-colors duration-300", on ? "bg-lime-400 text-ink" : "bg-mist text-ink-3")}>
      <svg viewBox="0 0 12 12" aria-hidden="true" className="size-2.5">
        <path d="m2.5 6.2 2.2 2.2 4.8-4.8" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

export function Stage({ source, port, amount, fee, rate, receive }: { source: Source; port: Port; amount: number; fee: number; rate: number; receive: number }) {
  const wrap = useRef<HTMLDivElement>(null);
  const orb = useRef<HTMLSpanElement>(null);
  const beam = useRef<SVGPathElement>(null);
  const [stage, setStage] = useState(0);
  const [arrived, setArrived] = useState(false);
  const sym = SOURCES[source].symbol;
  const name = `${port.recipient} ${SURNAMES[port.id] ?? ""}`.trim();
  const before = Math.round(receive * 0.42 + 18000);
  const balance = useTween(arrived ? before + receive : before, 900);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--p", Math.min(1, Math.max(0, 1 - r.top / innerHeight)).toFixed(3));
      });
    };
    on();
    addEventListener("scroll", on, { passive: true });
    return () => {
      removeEventListener("scroll", on);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const paint = (f: number, landed: boolean) => {
      const p = at(f);
      if (orb.current) {
        orb.current.style.left = `${(p.x / 400) * 100}%`;
        orb.current.style.top = `${(p.y / 300) * 100}%`;
        orb.current.style.opacity = landed ? "0" : "1";
      }
      if (beam.current) beam.current.style.strokeDashoffset = String(1 - f);
      setStage(STOPS.filter((s) => f >= s).length);
      setArrived(landed);
    };
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      paint(1, true);
      return;
    }
    let raf = 0;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      const e = (now - start) % (TRAVEL + HOLD);
      paint(ease(Math.min(1, e / TRAVEL)), e >= TRAVEL);
      raf = requestAnimationFrame(tick);
    };
    // Only run while the stage is on screen.
    const io = new IntersectionObserver(([en]) => {
      cancelAnimationFrame(raf);
      if (en.isIntersecting) raf = requestAnimationFrame(tick);
    });
    if (wrap.current) io.observe(wrap.current);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [port.id, source]);

  const steps = [
    { t: "+0:03", label: `Rate locked · ${rateText(rate)}` },
    { t: "+0:40", label: `Paid out via ${port.rail}` },
  ];

  return (
    <div
      ref={wrap}
      className="relative mx-auto max-w-[1120px]"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--tx", (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
        e.currentTarget.style.setProperty("--ty", (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
      }}
      onPointerLeave={(e) => {
        e.currentTarget.style.setProperty("--tx", "0");
        e.currentTarget.style.setProperty("--ty", "0");
      }}
    >
      <div className="relative grid items-start gap-6 lg:h-[500px] lg:grid-cols-[340px_1fr_272px] lg:gap-0">
        {/* Send card */}
        <div className="relative z-10 mx-auto w-full max-w-[360px] lg:mt-16 float-l">
          <div className="gloss rounded-[28px] p-5 text-white sm:p-6">
            <div className="flex items-center justify-between">
              <p className="text-[13px] text-white/60">You send</p>
              <span className="flex items-center gap-1.5 rounded-full bg-white/10 py-1 pr-2.5 pl-1 text-[12px] font-medium ring-1 ring-white/10">
                <Cur code={source} className="size-5 text-[7px] ring-0" />
                {source}
              </span>
            </div>
            <p className="mt-2 font-display text-[40px] leading-none font-semibold tracking-[-.04em] tabular-nums">
              {sym}
              {money(amount)}
            </p>
            <dl className="mt-5 grid gap-2.5 border-t border-white/10 pt-4 text-[13px]">
              <div className="flex justify-between">
                <dt className="text-white/55">Fee, all in</dt>
                <dd className="font-mono tabular-nums">
                  {sym}
                  {money(fee)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-white/55">Rate</dt>
                <dd className="flex items-center gap-2 font-mono tabular-nums">
                  <span className="rounded-full bg-lime-400/15 px-1.5 py-0.5 font-sans text-[10.5px] font-medium text-lime-300">mid-market</span>
                  {rateText(rate)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-white/55">Arrives</dt>
                <dd className="font-mono tabular-nums">~{port.minutes} min</dd>
              </div>
            </dl>
            <div className="mt-5 flex items-center gap-3 rounded-2xl bg-white/6 p-3 ring-1 ring-white/8">
              <Avatar name={name} className="size-9 ring-0" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-medium">{name}</p>
                <p className="text-[12px] text-white/50">
                  {port.bank} · •• 4417
                </p>
              </div>
              <Cur code={port.code} className="size-6 text-[7px] ring-0" />
            </div>
            <div className="mt-4 flex h-11 items-center justify-center gap-2 rounded-full bg-lime-400 text-[14px] font-semibold text-ink">
              {arrived ? "Delivered" : stage > 0 ? "On its way…" : "Send now"}
            </div>
          </div>
        </div>

        {/* Beam (desktop) */}
        <div aria-hidden="true" className="relative hidden h-full lg:block">
          <div className="absolute inset-x-[-12px] top-0 h-[300px]">
            <svg viewBox="0 0 400 300" preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible">
              <path d={BEAM} fill="none" stroke="rgb(10 11 9 / .14)" strokeWidth={2} strokeDasharray="2 7" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              <path
                ref={beam}
                d={BEAM}
                pathLength={1}
                fill="none"
                stroke="var(--color-lime-500)"
                strokeWidth={3.5}
                strokeLinecap="round"
                strokeDasharray="1 1"
                vectorEffect="non-scaling-stroke"
                style={{ strokeDashoffset: 1, filter: "drop-shadow(0 0 6px rgb(184 228 60 / .9))" }}
              />
            </svg>
            <span ref={orb} className="absolute size-0 transition-opacity duration-300" style={{ left: "0%", top: `${(P0.y / 300) * 100}%` }}>
              <span className="absolute -inset-3 animate-ping-soft rounded-full bg-lime-400/50" />
              <span className="absolute -inset-3 rounded-full bg-lime-400 shadow-[0_0_24px_6px_rgb(184_228_60/.7),inset_0_1px_0_rgb(255_255_255/.6)] ring-4 ring-white" />
            </span>
            {steps.map((s, i) => {
              const p = at(STOPS[i]);
              return (
                <span
                  key={s.t}
                  className={cx("absolute flex items-center gap-2 rounded-full bg-paper py-1.5 pr-3.5 pl-1.5 text-[12.5px] font-medium whitespace-nowrap lift transition-[opacity,translate] duration-500 ease-out-soft", stage > i ? "translate-y-0 opacity-100" : "translate-y-1 opacity-60")}
                  style={{ left: `${(p.x / 400) * 100}%`, top: `${(p.y / 300) * 100}%`, transform: `translate(-50%, ${i === 0 ? "26px" : "-58px"})` }}
                >
                  <Check on={stage > i} />
                  <span className="font-mono text-[11px] text-ink-3">{s.t}</span>
                  {s.label}
                </span>
              );
            })}
          </div>

          {/* Social proof, under the beam */}
          <div className="absolute inset-x-0 bottom-10 flex flex-col items-center gap-2">
            <p className="text-[12.5px] font-medium text-ink-2">Trusted by senders in 41 countries</p>
            <div className="flex items-center gap-3">
              <div className="group/av flex -space-x-2.5 transition-all duration-500 hover:space-x-0.5">
                {["Tomi Adeyemi", "Rafiq Hasan", "Marisol Cruz", "Dev Patel"].map((n, i) => (
                  <Avatar key={n} name={n} tone={i} />
                ))}
              </div>
              <Count to={2.4} decimals={1} suffix="M+" className="font-display text-[26px] font-semibold tracking-[-.04em] tabular-nums" />
            </div>
          </div>
        </div>

        {/* Steps (mobile) */}
        <ol className="mx-auto grid w-full max-w-[360px] gap-2 lg:hidden">
          {steps.map((s, i) => (
            <li key={s.t} className="flex items-center gap-2.5 rounded-full bg-paper py-2 pr-4 pl-2 text-[13px] font-medium lift">
              <Check on={stage > i} />
              <span className="font-mono text-[11px] text-ink-3">{s.t}</span>
              {s.label}
            </li>
          ))}
        </ol>

        {/* Recipient's phone */}
        <div className="relative mx-auto w-[272px] lg:mt-2 float-r">
          <div className="relative h-[520px] overflow-hidden rounded-[46px] bg-ink p-[9px] shadow-[0_50px_80px_-30px_rgb(10_11_9/.5),inset_0_0_0_1.5px_rgb(255_255_255/.12)] max-lg:h-[440px]">
            <div className="relative h-full overflow-hidden rounded-[38px] bg-page">
              <div className="flex items-center justify-between px-6 pt-3 text-[11px] font-semibold">
                <span className="tabular-nums">16:11</span>
                <span className="h-[22px] w-[78px] rounded-full bg-ink" />
                <span className="flex items-center gap-1">
                  <span className="h-2 w-3.5 rounded-[2px] border border-ink/70" />
                </span>
              </div>

              {/* Arrival notification drops in */}
              <div
                className={cx(
                  "absolute inset-x-2.5 top-10 z-10 rounded-[20px] bg-white/90 p-3 shadow-[0_16px_30px_-12px_rgb(10_11_9/.35)] ring-1 ring-ink/5 backdrop-blur-md transition-[translate,opacity] duration-700 ease-spring",
                  arrived ? "translate-y-0 opacity-100" : "-translate-y-24 opacity-0",
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span className="grid size-8 place-items-center rounded-[9px] bg-ink">
                    <svg viewBox="0 0 32 32" className="size-5" aria-hidden="true">
                      <path d="M9 21.5c4.5 0 5-11 13.5-11" fill="none" stroke="#b8e43c" strokeWidth={3} strokeLinecap="round" />
                    </svg>
                  </span>
                  <div className="min-w-0 flex-1 leading-tight">
                    <p className="flex justify-between text-[12px] font-semibold">
                      Strait <span className="font-normal text-ink-3">now</span>
                    </p>
                    <p className="truncate text-[12px] text-ink-2">
                      {port.symbol}
                      {money(Math.round(receive), 0)} from Tomi has arrived
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-4 pt-6">
                <div className="flex items-center gap-2.5">
                  <Avatar name={name} className="size-8" />
                  <div className="leading-tight">
                    <p className="text-[11px] text-ink-3">Good afternoon</p>
                    <p className="text-[13px] font-semibold">{port.recipient}</p>
                  </div>
                </div>

                <div className="relative mt-4 overflow-hidden rounded-[22px] bg-linear-to-br from-lime-300 via-lime-400 to-sage-400 p-4 text-ink shadow-[inset_0_1px_0_rgb(255_255_255/.5)]">
                  <div aria-hidden="true" className="absolute -top-10 -right-8 size-32 rounded-full bg-white/25 blur-2xl" />
                  <p className="relative text-[11px] font-medium text-ink/65">Available balance</p>
                  <p className="relative mt-1 font-display text-[25px] leading-none font-semibold tracking-[-.04em] tabular-nums">
                    {port.symbol}
                    {money(Math.round(balance), 0)}
                  </p>
                  <p className="relative mt-3 font-mono text-[10px] text-ink/60">
                    {port.code} · {port.bank}
                  </p>
                </div>

                <p className="mt-5 text-[12px] font-semibold">Recent</p>
                <ul className="mt-2 flex flex-col gap-1.5">
                  <li
                    className={cx(
                      "flex items-center gap-2.5 rounded-2xl p-2.5 transition-[background-color,box-shadow,opacity] duration-500",
                      arrived ? "bg-lime-100 opacity-100 shadow-[inset_0_0_0_1px_rgb(157_203_31/.45)]" : "bg-paper opacity-50",
                    )}
                  >
                    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-ink text-[11px] font-semibold text-lime-400">S</span>
                    <span className="min-w-0 flex-1 leading-tight">
                      <span className="block truncate text-[12px] font-semibold">From Tomi via Strait</span>
                      <span className="block text-[10.5px] text-ink-3">{arrived ? "Just now" : "Arriving…"}</span>
                    </span>
                    <span className="shrink-0 text-[11px] font-semibold text-lime-700 tabular-nums">
                      +{port.symbol}
                      {money(Math.round(receive), 0)}
                    </span>
                  </li>
                  {[
                    { l: "Groceries", d: "Yesterday", a: -Math.round(receive * 0.012) },
                    { l: "Electricity", d: "Mon", a: -Math.round(receive * 0.02) },
                    { l: "School fees", d: "1 Oct", a: -Math.round(receive * 0.16) },
                  ].map((r) => (
                    <li key={r.l} className="flex items-center gap-2.5 rounded-2xl bg-paper p-2.5">
                      <span className="size-8 shrink-0 rounded-full bg-mist" />
                      <span className="min-w-0 flex-1 leading-tight">
                        <span className="block text-[12px] font-medium">{r.l}</span>
                        <span className="block text-[10.5px] text-ink-3">{r.d}</span>
                      </span>
                      <span className="shrink-0 text-[11px] text-ink-2 tabular-nums">
                        −{port.symbol}
                        {money(Math.abs(r.a), 0)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p aria-live="polite" className="sr-only">
        {arrived ? `${port.recipient} has received ${port.symbol}${money(Math.round(receive), 0)}.` : ""}
      </p>
    </div>
  );
}
