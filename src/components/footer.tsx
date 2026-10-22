"use client";

import { useEffect, useState } from "react";
import { cx } from "@/lib/cx";
import { HERO_PORTS, SOURCES, money, rate, rateText, seeded, type Source } from "@/lib/strait";
import { Wordmark } from "./ui";

const COLS = [
  { h: "Send", links: ["Send money", "Rate anchor", "Split payments", "Multi-currency", "Strait for business"] },
  { h: "Learn", links: ["How it works", "Fees", "Exchange rates", "Security", "Countries"] },
  { h: "Company", links: ["About", "Careers", "Press", "Status", "Contact"] },
];

const RAILS = [
  { name: "UPI", where: "India", ms: 38 },
  { name: "NIP", where: "Nigeria", ms: 112 },
  { name: "PIX", where: "Brazil", ms: 54 },
  { name: "M-Pesa", where: "Kenya", ms: 96 },
  { name: "SPEI", where: "Mexico", ms: 71 },
  { name: "InstaPay", where: "Philippines", ms: 83 },
  { name: "bKash", where: "Bangladesh", ms: 140 },
  { name: "SEPA Inst.", where: "Eurozone", ms: 61 },
];

const CLOCKS = [
  { city: "London", tz: "Europe/London" },
  { city: "Lagos", tz: "Africa/Lagos" },
  { city: "Dhaka", tz: "Asia/Dhaka" },
  { city: "Manila", tz: "Asia/Manila" },
  { city: "Mexico City", tz: "America/Mexico_City" },
  { city: "Nairobi", tz: "Africa/Nairobi" },
];

const START = 14_203_881;
const BARS = (() => {
  const r = seeded(11);
  return Array.from({ length: 36 }, () => 0.35 + r() * 0.6);
})();

/** Each digit is a strip of 0–9 that slides to its value, like a mechanical counter. */
function Odometer({ value }: { value: string }) {
  return (
    <span className="inline-flex overflow-hidden leading-none" aria-label={value} role="img">
      {value.split("").map((c, i) =>
        /\d/.test(c) ? (
          <span key={value.length - i} aria-hidden="true" className="relative inline-block h-[1em] w-[.6em] overflow-hidden">
            <span className="absolute inset-x-0 top-0 flex flex-col transition-transform duration-700 ease-out-soft" style={{ transform: `translateY(-${Number(c)}em)` }}>
              {"0123456789".split("").map((d) => (
                <span key={d} className="block h-[1em] text-center">
                  {d}
                </span>
              ))}
            </span>
          </span>
        ) : (
          <span key={`s${value.length - i}`} aria-hidden="true" className="inline-block w-[.28em] text-center">
            {c}
          </span>
        ),
      )}
    </span>
  );
}

/** Live-feeling numbers: they only start moving after mount, so server and client agree. */
function useNetwork() {
  const [sent, setSent] = useState(START);
  const [bars, setBars] = useState(BARS);
  const [lat, setLat] = useState(RAILS.map((r) => r.ms));
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const first = setTimeout(() => setNow(new Date()), 0);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return () => clearTimeout(first);
    const a = setInterval(() => setSent((s) => s + Math.round(180 + Math.random() * 2600)), 900);
    const b = setInterval(() => {
      setBars((v) => [...v.slice(1), 0.3 + Math.random() * 0.68]);
      setLat(RAILS.map((r) => Math.max(12, Math.round(r.ms + (Math.random() - 0.5) * r.ms * 0.4))));
    }, 1600);
    const c = setInterval(() => setNow(new Date()), 15000);
    return () => {
      clearTimeout(first);
      [a, b, c].forEach(clearInterval);
    };
  }, []);

  return { sent, bars, lat, now };
}

function RateAlert() {
  const [source, setSource] = useState<Source>("GBP");
  const [portId, setPortId] = useState(HERO_PORTS[0].id);
  const port = HERO_PORTS.find((p) => p.id === portId) ?? HERO_PORTS[0];
  const current = rate(source, port);
  const [target, setTarget] = useState("");
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const goal = Number(target.replace(/,/g, "")) || current * 1.005;

  if (done) {
    return (
      <div role="status" className="rounded-[22px] bg-lime-400 p-5 text-ink">
        <p className="font-display text-[19px] font-semibold tracking-[-.03em]">Alert set.</p>
        <p className="mt-1 text-[14px] text-ink/70">
          We&rsquo;ll email {email} when {source}/{port.code} reaches {rateText(goal)}. It&rsquo;s {rateText(current)} now.
        </p>
        <button type="button" onClick={() => setDone(false)} className="mt-3 cursor-pointer text-[13px] font-semibold underline underline-offset-4">
          Set another
        </button>
      </div>
    );
  }

  return (
    <form
      className="rounded-[22px] bg-white/[.04] p-5 ring-1 ring-white/10"
      onSubmit={(e) => {
        e.preventDefault();
        if (email.includes("@")) setDone(true);
      }}
    >
      <p className="font-display text-[17px] font-semibold tracking-[-.03em]">Get a rate alert</p>
      <p className="mt-1 text-[13px] text-white/50">One email when your rate arrives. Nothing else.</p>
      <div className="mt-4 grid grid-cols-[auto_auto_1fr] items-center gap-2 text-[13.5px]">
        <label className="sr-only" htmlFor="ra-from">
          From
        </label>
        <select id="ra-from" value={source} onChange={(e) => setSource(e.target.value as Source)} className="h-10 cursor-pointer rounded-full bg-white/8 px-3 text-[14px] ring-1 ring-white/10 outline-none focus-visible:ring-lime-400">
          {(Object.keys(SOURCES) as Source[]).map((s) => (
            <option key={s} value={s} className="text-ink">
              {s}
            </option>
          ))}
        </select>
        <label className="sr-only" htmlFor="ra-to">
          To
        </label>
        <select id="ra-to" value={portId} onChange={(e) => setPortId(e.target.value)} className="h-10 cursor-pointer rounded-full bg-white/8 px-3 text-[14px] ring-1 ring-white/10 outline-none focus-visible:ring-lime-400">
          {HERO_PORTS.map((p) => (
            <option key={p.id} value={p.id} className="text-ink">
              {p.code}
            </option>
          ))}
        </select>
        <label className="sr-only" htmlFor="ra-target">
          Target rate
        </label>
        <input
          id="ra-target"
          inputMode="decimal"
          value={target}
          onChange={(e) => setTarget(e.target.value.replace(/[^\d.,]/g, ""))}
          placeholder={rateText(current * 1.005)}
          className="h-10 min-w-0 rounded-full bg-white/8 px-3.5 font-mono text-[14px] tabular-nums ring-1 ring-white/10 outline-none placeholder:text-white/40 focus:ring-lime-400"
        />
      </div>
      <p className="mt-2 font-mono text-[11.5px] text-white/40 tabular-nums">
        Now {rateText(current)} · {goal >= current ? "+" : "−"}
        {Math.abs((goal / current - 1) * 100).toFixed(2)}% to go
      </p>
      <div className="mt-3 flex gap-2">
        <label className="sr-only" htmlFor="ra-email">
          Email
        </label>
        <input
          id="ra-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="h-10 min-w-0 flex-1 rounded-full bg-white/8 px-4 text-[16px] ring-1 ring-white/10 outline-none placeholder:text-white/40 focus:ring-lime-400 sm:text-[14px]"
        />
        <button type="submit" data-magnetic className="h-10 shrink-0 cursor-pointer rounded-full bg-lime-400 px-4 text-[13.5px] font-semibold text-ink transition-[background-color,translate,scale] duration-300 hover:bg-lime-300 active:scale-95">
          Notify me
        </button>
      </div>
    </form>
  );
}

export function Footer() {
  const { sent, bars, lat, now } = useNetwork();
  const perMin = Math.round(bars[bars.length - 1] * 2400);

  return (
    <footer className="px-3 pb-3 sm:px-4 sm:pb-4">
      <div className="relative overflow-hidden rounded-[36px] bg-ink text-white">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(50%_60%_at_0%_0%,rgb(184_228_60/.16),transparent_70%),radial-gradient(40%_50%_at_100%_100%,rgb(94_143_82/.22),transparent_70%)]" />

        <div className="shell relative pt-14 sm:pt-20">
          {/* Live network */}
          <div className="grid gap-4 lg:grid-cols-12">
            <div className="reveal spot spot-dark relative overflow-hidden rounded-[26px] bg-white/[.04] p-6 ring-1 ring-white/10 sm:p-7 lg:col-span-5">
              <p className="flex items-center gap-2 text-[13px] font-medium text-white/60">
                <span aria-hidden="true" className="relative size-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-lime-400" />
                  <span className="absolute inset-0 rounded-full bg-lime-400" />
                </span>
                Sent through Strait today
              </p>
              <p className="mt-4 font-display text-[clamp(38px,4.4vw,56px)] font-semibold tracking-[-.04em] tabular-nums">
                <span className="text-white/40">£</span>
                <Odometer value={money(sent, 0)} />
              </p>
              <div className="mt-6 flex h-16 items-end gap-[3px]" aria-hidden="true">
                {bars.map((b, i) => (
                  <span
                    key={i}
                    className={cx("flex-1 rounded-t-[3px] transition-[height,background-color] duration-700 ease-out-soft", i === bars.length - 1 ? "bg-lime-400" : "bg-white/15")}
                    style={{ height: `${b * 100}%` }}
                  />
                ))}
              </div>
              <p className="mt-3 flex justify-between text-[12px] text-white/45">
                <span>Transfers per minute, last hour</span>
                <span className="font-mono text-lime-400 tabular-nums">{perMin.toLocaleString("en-US")}/min</span>
              </p>
            </div>

            <div className="reveal rounded-[26px] bg-white/[.04] p-6 ring-1 ring-white/10 sm:p-7 lg:col-span-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-[13px] font-medium text-white/60">Payout networks</p>
                <p className="rounded-full bg-lime-400/12 px-2.5 py-1 text-[12px] font-medium text-lime-300">All 31 operational</p>
              </div>
              <ul className="cascade mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {RAILS.map((r, i) => (
                  <li key={r.name} className="group/rail rounded-2xl bg-white/[.04] p-3.5 ring-1 ring-white/8 transition-[background-color,box-shadow,transform] duration-300 ease-spring hover:-translate-y-0.5 hover:bg-white/8 hover:ring-lime-400/50">
                    <p className="flex items-center justify-between">
                      <span className="text-[14px] font-semibold">{r.name}</span>
                      <span aria-hidden="true" className="relative size-1.5">
                        <span className="absolute inset-0 animate-ping rounded-full bg-lime-400" style={{ animationDelay: `${i * 0.27}s` }} />
                        <span className="absolute inset-0 rounded-full bg-lime-400" />
                      </span>
                    </p>
                    <p className="mt-0.5 text-[12px] text-white/45">{r.where}</p>
                    <p className="mt-3 font-mono text-[12px] text-white/70 tabular-nums transition-colors group-hover/rail:text-lime-400">{lat[i]} ms</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* World clock: it's always business hours somewhere, and always open here. */}
          <div className="reveal mt-4 overflow-hidden rounded-[26px] ring-1 ring-white/10">
            <ul className="grid grid-cols-2 divide-white/10 sm:grid-cols-3 lg:grid-cols-6 lg:divide-x">
              {CLOCKS.map((c) => (
                <li key={c.city} className="group/clock flex items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-white/[.04]">
                  <span>
                    <span className="block text-[12.5px] text-white/50">{c.city}</span>
                    <span className="block font-mono text-[16px] tabular-nums">{now ? now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: c.tz }) : "--:--"}</span>
                  </span>
                  <span className="rounded-full bg-lime-400/12 px-2 py-0.5 text-[11px] font-medium text-lime-300 transition-colors group-hover/clock:bg-lime-400 group-hover/clock:text-ink">Open</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Brand, links, alert */}
          <div className="grid gap-12 py-16 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <a href="#top" aria-label="Strait, back to top" className="[&_svg_rect]:fill-white/10">
                <Wordmark />
              </a>
              <p className="mt-5 max-w-[320px] text-[15px] leading-relaxed text-white/55">Money, straight across. The real rate, one fee you see first, and tracking you can both follow.</p>
              <ul className="mt-6 flex gap-2">
                {[
                  { n: "X", d: "M4 4l16 16M20 4 4 20" },
                  { n: "Instagram", d: "M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm5 5a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm5.5-1.5h.01" },
                  { n: "LinkedIn", d: "M4 9h4v11H4zM6 4a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM10 9h4v1.6c.6-1 1.8-1.8 3.5-1.8C20 8.8 21 10.4 21 13v7h-4v-6.2c0-1.4-.5-2.3-1.7-2.3-1.3 0-2.3.9-2.3 2.5v6h-3z" },
                ].map((s) => (
                  <li key={s.n}>
                    <a href="#top" aria-label={s.n} className="grid size-10 place-items-center rounded-full bg-white/6 text-white/70 ring-1 ring-white/10 transition-[background-color,color,transform] duration-300 ease-spring hover:-translate-y-0.5 hover:rotate-[-8deg] hover:bg-lime-400 hover:text-ink">
                      <svg viewBox="0 0 24 24" className="size-[17px]" aria-hidden="true">
                        <path d={s.d} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-5 lg:pl-4">
              {COLS.map((c) => (
                <div key={c.h}>
                  <p className="text-[13px] font-semibold">{c.h}</p>
                  <ul className="mt-4 grid gap-2.5">
                    {c.links.map((l) => (
                      <li key={l}>
                        <a href="#top" className="group/link inline-flex items-center text-[14px] whitespace-nowrap text-white/55 transition-colors hover:text-white">
                          <span aria-hidden="true" className="h-px w-0 bg-lime-400 transition-[width,margin] duration-300 ease-out-soft group-hover/link:mr-1.5 group-hover/link:w-3" />
                          {l}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>

            <div className="lg:col-span-4">
              <RateAlert />
            </div>
          </div>
        </div>

        <div className="relative border-t border-white/10">
          <div className="shell flex flex-col gap-4 py-6 text-[12.5px] text-white/45 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 Strait. A fictional company made for a design study. Rates are illustrative.</p>
            <div className="flex items-center gap-5">
              <a href="#top" className="hover:text-white">
                Privacy
              </a>
              <a href="#top" className="hover:text-white">
                Terms
              </a>
              {/* Back to top: the ring fills with how far down the page you are. */}
              <a
                href="#top"
                aria-label="Back to top"
                className="group/top relative grid size-11 place-items-center rounded-full text-white transition-transform duration-300 ease-spring hover:-translate-y-1"
                style={{ background: "conic-gradient(var(--color-lime-400) calc(var(--scroll, 0) * 360deg), rgb(255 255 255 / .12) 0)" }}
              >
                <span className="absolute inset-[2px] rounded-full bg-ink" />
                <svg viewBox="0 0 16 16" className="relative size-4 transition-transform duration-300 group-hover/top:-translate-y-0.5" aria-hidden="true">
                  <path d="M8 13V3.5M4 7.5l4-4 4 4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
