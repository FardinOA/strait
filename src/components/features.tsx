"use client";

import { useId, useState, type ReactNode } from "react";
import { cx } from "@/lib/cx";
import { PORTS, history, money, rate } from "@/lib/strait";
import { Avatar, Cur, Disc, btn } from "./ui";

function Card({ title, body, children, className, footer }: { title: string; body: ReactNode; children: ReactNode; className?: string; footer?: ReactNode }) {
  return (
    <article className={cx("reveal spot relative flex flex-col overflow-hidden rounded-[24px] bg-paper p-6 lift transition-[box-shadow,transform] duration-500 ease-out-soft hover:[transform:translateY(-4px)] hover:lift-lg sm:p-7", className)}>
      <h3 className="font-display text-[19px] leading-tight font-semibold tracking-[-.03em]">{title}</h3>
      <div className="relative my-6 flex flex-1 flex-col justify-center">{children}</div>
      <p className="max-w-[400px] text-[14px] leading-relaxed text-ink-2">{body}</p>
      {footer}
    </article>
  );
}

/* ---------- Rate anchor ---------- */

const MUMBAI = PORTS[3];
const SERIES = history(MUMBAI.id, 30).map((v) => v * rate("GBP", MUMBAI));
const LO = Math.min(...SERIES);
const HI = Math.max(...SERIES);
const X = (i: number) => (i / (SERIES.length - 1)) * 600;
const Y = (v: number) => 210 - ((v - LO) / (HI - LO)) * 180;
const LINE = SERIES.map((v, i) => `${i ? "L" : "M"}${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(" ");

function Anchor() {
  const id = useId();
  const [target, setTarget] = useState(() => Number((LO + (HI - LO) * 0.7).toFixed(2)));
  const hits = SERIES.filter((v) => v >= target).length;
  const ty = Y(target);
  const fill = ((target - LO) / (HI - LO)) * 100;

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-[12.5px] font-medium text-ink-3">
            <span className="flex -space-x-1.5">
              <Cur code="GBP" className="size-5 text-[6px]" />
              <Cur code="INR" className="size-5 text-[6px]" />
            </span>
            GBP → INR · 30 days
          </p>
          <p className="mt-2 font-display text-[32px] leading-none font-semibold tracking-[-.04em] tabular-nums">{money(SERIES[SERIES.length - 1])}</p>
        </div>
        <div className="text-right">
          <p className="text-[12px] text-ink-3">Your anchor</p>
          <p className="mt-1 rounded-full bg-ink px-2.5 py-1 font-mono text-[12.5px] font-medium text-lime-400 tabular-nums">{money(target)}</p>
        </div>
      </div>

      <div className="relative mt-5">
        <svg viewBox="0 0 600 220" className="h-[190px] w-full sm:h-[220px]" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id={`${id}-a`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="var(--color-lime-400)" stopOpacity={0.45} />
              <stop offset="1" stopColor="var(--color-lime-400)" stopOpacity={0} />
            </linearGradient>
            <clipPath id={`${id}-c`}>
              <rect x={0} y={0} width={600} height={Math.max(0, ty)} />
            </clipPath>
          </defs>
          {[55, 110, 165].map((y) => (
            <line key={y} x1={0} x2={600} y1={y} y2={y} stroke="var(--color-line)" vectorEffect="non-scaling-stroke" />
          ))}
          <path d={`${LINE} L600,220 L0,220Z`} fill={`url(#${id}-a)`} />
          <path d={LINE} fill="none" stroke="var(--color-ink)" strokeWidth={2} vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
          {/* Days at or above the anchor light up: those are the days we'd have sent. */}
          <path d={LINE} fill="none" stroke="var(--color-lime-500)" strokeWidth={4} vectorEffect="non-scaling-stroke" strokeLinejoin="round" clipPath={`url(#${id}-c)`} />
          <line x1={0} x2={600} y1={ty} y2={ty} stroke="var(--color-ink)" strokeDasharray="5 5" strokeWidth={1.2} vectorEffect="non-scaling-stroke" />
        </svg>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-0 grid size-8 -translate-y-1/2 place-items-center rounded-full bg-ink text-lime-400 shadow-[0_6px_14px_-4px_rgb(10_11_9/.6)]"
          style={{ top: `${(ty / 220) * 100}%` }}
        >
          <svg viewBox="0 0 16 16" className="size-4">
            <path d="M8 4v9.5M5.5 6.5h5M3 9.5a5 5 0 0 0 10 0" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
            <circle cx={8} cy={2.8} r={1.3} fill="none" stroke="currentColor" strokeWidth={1.3} />
          </svg>
        </span>
      </div>

      <label htmlFor={`${id}-r`} className="sr-only">
        Anchor rate
      </label>
      <input
        id={`${id}-r`}
        type="range"
        min={LO}
        max={HI}
        step={0.01}
        value={target}
        onChange={(e) => setTarget(Number(e.target.value))}
        className="anchor-range mt-3"
        style={{ "--fill": `${fill}%` } as React.CSSProperties}
      />
      <p aria-live="polite" className="mt-2 text-[13px] text-ink-2">
        Reached on <span className="font-semibold text-ink">{hits} of the last 30 days</span>. Drag to set yours.
      </p>
    </div>
  );
}

/* ---------- Split ---------- */

const SPLIT = [
  { who: "Mum", where: "Dhaka", amt: 40000, pct: 62 },
  { who: "Rafi Hasan", where: "Chattogram", amt: 15000, pct: 23 },
  { who: "Nila Akter", where: "Sylhet", amt: 10000, pct: 15 },
];

function Split() {
  return (
    <ul className="cascade grid gap-2">
      {SPLIT.map((s, i) => (
        <li key={s.who} className="flex cursor-default items-center gap-3 rounded-2xl bg-page p-2.5 pr-3.5 ring-1 ring-line transition-[transform,background-color,box-shadow] duration-300 ease-spring hover:translate-x-1 hover:bg-lime-50 hover:ring-lime-300">
          <Avatar name={s.who} tone={i + 1} className="size-8" />
          <span className="min-w-0 flex-1 leading-tight">
            <span className="block truncate text-[13px] font-semibold">{s.who}</span>
            <span className="mt-1 block h-1 overflow-hidden rounded-full bg-mist">
              <span className="block h-full rounded-full bg-lime-500" style={{ width: `${s.pct}%` }} />
            </span>
          </span>
          <span className="font-mono text-[12px] font-medium tabular-nums">৳{s.amt.toLocaleString("en-US")}</span>
        </li>
      ))}
    </ul>
  );
}

/* ---------- Balances ---------- */

function Balances() {
  const cards = [
    { code: "GBP", amt: "£2,480.15", cls: "gloss text-white", rot: "-rotate-8 -translate-x-16" },
    { code: "EUR", amt: "€640.00", cls: "bg-paper text-ink lift", rot: "rotate-0" },
    { code: "USD", amt: "$1,215.40", cls: "bg-linear-to-br from-lime-300 to-lime-400 text-ink shadow-[0_20px_30px_-16px_rgb(122_163_21/.8)]", rot: "rotate-8 translate-x-16" },
  ];
  return (
    <div className="group/bal relative mx-auto h-[118px] w-[176px]">
      {cards.map((c, i) => (
        <div
          key={c.code}
          className={cx("absolute inset-0 flex flex-col justify-between rounded-[18px] p-3.5 transition-transform duration-500 ease-spring", c.cls, c.rot, i === 0 && "group-hover/bal:-translate-x-20", i === 2 && "group-hover/bal:translate-x-20")}
          style={{ zIndex: i === 1 ? 3 : 1 }}
        >
          <span className="flex items-center justify-between">
            <Cur code={c.code} className="size-6 text-[7px]" />
            <span className="text-[10.5px] font-medium opacity-60">Balance</span>
          </span>
          <span className="font-display text-[20px] font-semibold tracking-[-.04em] tabular-nums">{c.amt}</span>
        </div>
      ))}
    </div>
  );
}

/* ---------- Zero markup (the reference's black card in a lime frame) ---------- */

function ZeroMarkup() {
  return (
    <article className="reveal relative flex flex-col overflow-hidden rounded-[24px] bg-linear-to-b from-lime-200 via-lime-300 to-sage-400 p-3 lift transition-[box-shadow,transform] duration-500 ease-out-soft hover:[transform:translateY(-4px)] lg:col-span-3 lg:row-span-2">
      <div className="flex gap-1.5 px-2 pt-1.5 pb-3" aria-hidden="true">
        <span className="size-2.5 rounded-full bg-[#ff6159]" />
        <span className="size-2.5 rounded-full bg-[#ffbd2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
      </div>
      <div className="gloss spot spot-dark relative flex flex-1 flex-col items-center justify-center rounded-[18px] px-5 py-10 text-center text-white">
        <Disc size="sm" className="from-lime-300 to-lime-500 text-ink shadow-[0_0_0_6px_rgb(184_228_60/.15),0_0_0_14px_rgb(184_228_60/.06)]">
          <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true">
            <path d="M3 13 13 3M4.5 4.5h.01M11.5 11.5h.01" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" />
          </svg>
        </Disc>
        <p className="mt-6 font-display text-[54px] leading-none font-semibold tracking-[-.05em] tabular-nums">0.00%</p>
        <h3 className="mt-3 font-display text-[18px] font-semibold tracking-[-.03em]">Markup on the rate</h3>
        <p className="mt-2 max-w-[220px] text-[13px] leading-relaxed text-white/60">You get the rate you see on Google. Our fee is one number, shown first.</p>
        <a href="#compare" className={btn("ghost", "md", "mt-6 h-9 text-[13px] text-ink")}>
          See the maths
        </a>
      </div>
    </article>
  );
}

/* ---------- Recipient text ---------- */

function Tracking() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 sm:items-center">
      <div className="rounded-[20px] bg-page p-3.5 ring-1 ring-line">
        <div className="flex items-center gap-2">
          <span className="grid size-6 place-items-center rounded-[7px] bg-ink">
            <svg viewBox="0 0 32 32" className="size-4" aria-hidden="true">
              <path d="M9 21.5c4.5 0 5-11 13.5-11" fill="none" stroke="#b8e43c" strokeWidth={3.4} strokeLinecap="round" />
            </svg>
          </span>
          <span className="text-[12px] font-semibold">Messages</span>
          <span className="ml-auto text-[11px] text-ink-3">16:02</span>
        </div>
        <p className="mt-2 text-[13px] leading-snug">
          <b className="font-semibold">₦1,004,240</b> from Tomi is on its way. It reaches your account at about 16:11.
        </p>
        <p className="mt-2 truncate font-mono text-[11px] text-sage-600 underline">strait.to/t/k7Q2</p>
      </div>
      <div className="rounded-[20px] bg-ink p-4 text-white">
        <div className="flex items-center justify-between text-[12px]">
          <span className="text-white/60">Live tracking</span>
          <span className="font-mono text-lime-400">6 min left</span>
        </div>
        <div className="mt-3 grid grid-cols-4 gap-1" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={cx("h-1.5 rounded-full", i < 3 ? "bg-lime-400" : "animate-pulse bg-white/20")} />
          ))}
        </div>
        <p className="mt-3 text-[12px] text-white/60">Paid out via NIP · GTBank</p>
      </div>
    </div>
  );
}

/* ---------- 24/7 ---------- */

function Clock() {
  return (
    <div className="flex items-center gap-6">
      <svg viewBox="-70 -70 140 140" className="size-[124px] shrink-0" aria-hidden="true">
        <circle r={64} fill="var(--color-page)" stroke="var(--color-line)" />
        {Array.from({ length: 24 }, (_, i) => {
          const a = (i / 24) * Math.PI * 2;
          return <circle key={i} cx={(Math.sin(a) * 52).toFixed(2)} cy={(-Math.cos(a) * 52).toFixed(2)} r={i % 6 === 0 ? 3.6 : 2.4} fill={i % 6 === 0 ? "var(--color-ink)" : "var(--color-lime-500)"} />;
        })}
        <g className="origin-center animate-[spin_12s_linear_infinite] [transform-box:view-box]">
          <line y2={-40} stroke="var(--color-ink)" strokeWidth={3} strokeLinecap="round" />
        </g>
        <circle r={5} fill="var(--color-lime-400)" stroke="var(--color-ink)" strokeWidth={2} />
      </svg>
      <dl className="grid gap-3 text-[13px]">
        {[
          ["Sat 03:12", "Lagos · 8 min"],
          ["Sun 23:40", "Manila · 3 min"],
          ["Bank hol.", "Mumbai · 40 s"],
        ].map(([k, v]) => (
          <div key={k}>
            <dt className="font-mono text-[11px] text-ink-3">{k}</dt>
            <dd className="font-medium">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="shell">
        <div className="reveal grid gap-8 lg:grid-cols-12 lg:items-end">
          <h2 className="type-section words text-[clamp(36px,5vw,60px)] lg:col-span-7">
            <span className="sr-only">Money that moves like a message.</span>
            <span aria-hidden="true">
              <span className="w"><span style={{ "--wi": 0 } as React.CSSProperties}>Money</span></span> <span className="w"><span style={{ "--wi": 1 } as React.CSSProperties}>that</span></span>{" "}
              <span className="w"><span style={{ "--wi": 2 } as React.CSSProperties}>moves</span></span>
              <br />
              <span className="w"><span style={{ "--wi": 3 } as React.CSSProperties}>like</span></span> <span className="w"><span style={{ "--wi": 4 } as React.CSSProperties}>a</span></span>{" "}
              <span className="w">
                <span style={{ "--wi": 5 } as React.CSSProperties} className="relative mx-[.06em] inline-grid size-[.8em] place-items-center rounded-full bg-ink align-middle text-lime-400">
                  <svg viewBox="0 0 16 16" className="size-[.42em] animate-[nudge_2.4s_var(--ease-out-soft)_infinite]">
                    <path d="M2 8.5 14 2.5 10.5 14 8 9z" fill="currentColor" />
                  </svg>
                </span>
              </span>{" "}
              <span className="w"><span style={{ "--wi": 6 } as React.CSSProperties}>message.</span></span>
            </span>
          </h2>
          <p className="max-w-[420px] text-[16px] leading-relaxed text-ink-2 lg:col-span-5 lg:justify-self-end">
            Send to a bank account, a mobile wallet or a cash pickup point in 74 countries, at the real exchange rate. These are the tools regular senders asked us for.
          </p>
        </div>

        <div className="mt-14 grid gap-4 lg:grid-cols-12">
          <Card title="Anchor the rate you want" body="Pick a target. When the market reaches it, we send automatically, even at 3 a.m. If it never does, nothing moves and nothing is charged." className="lg:col-span-5 lg:row-span-2">
            <Anchor />
          </Card>
          <Card title="One transfer, many people" body="Split one payment between up to 20 people. One rate, one fee, and a separate text to each of them." className="lg:col-span-4">
            <Split />
          </Card>
          <ZeroMarkup />
          <Card title="Hold 40 currencies" body="Keep balances, convert when the rate suits you, and pay from whichever one you like." className="lg:col-span-4">
            <Balances />
          </Card>
          <Card title="They see it coming" body="Recipients get a text with the exact amount and a live tracking link. They don't need an app or an account." className="lg:col-span-7">
            <Tracking />
          </Card>
          <Card title="Open at 3 a.m. on a Sunday" body="Instant payment rails never close, so neither do we. Weekends and bank holidays included." className="lg:col-span-5">
            <Clock />
          </Card>
        </div>
      </div>
    </section>
  );
}
