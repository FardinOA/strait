"use client";

import { useState, type ReactNode } from "react";
import { useTween } from "@/lib/hooks";
import { HERO_PORTS, SOURCES, minuteWord, money, quote, type Source } from "@/lib/strait";
import { Stage } from "./stage";
import { Arrow, Badge, Roll, btn } from "./ui";

/** An editable word in the headline: lime dashed underline, a soft wash on hover and focus. */
function Slot({ children, caret }: { children: ReactNode; caret?: boolean }) {
  return (
    <span className="relative inline-flex items-baseline rounded-[.16em] border-b-[.05em] border-dashed border-lime-500 transition-colors duration-300 hover:border-ink/40 hover:bg-white/70 has-focus-visible:bg-white/80 has-focus-visible:outline-2 has-focus-visible:outline-offset-4 has-focus-visible:outline-ink">
      {children}
      {caret && (
        <svg viewBox="0 0 12 12" aria-hidden="true" className="ml-[.06em] size-[.3em] self-center text-ink/45">
          <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
}

const overlay = "absolute inset-0 size-full cursor-pointer appearance-none opacity-0 text-[16px]";
const RAILS = ["UPI", "PIX", "SPEI", "M-Pesa", "NIP", "bKash", "InstaPay", "SEPA Instant", "FedNow", "Faster Payments", "GhIPSS", "Raast"];

export function Hero() {
  const [raw, setRaw] = useState("1,000");
  const [source, setSource] = useState<Source>("GBP");
  const [portId, setPortId] = useState("lagos");
  const port = HERO_PORTS.find((p) => p.id === portId) ?? HERO_PORTS[0];
  const amount = Number(raw.replace(/,/g, "")) || 0;
  const q = quote(amount, source, port);
  const shown = useTween(q.receive);
  const sym = SOURCES[source].symbol;

  const onAmount = (v: string) => {
    const digits = v.replace(/\D/g, "").replace(/^0+(?=\d)/, "").slice(0, 7);
    setRaw(digits ? Number(digits).toLocaleString("en-US") : "");
  };

  return (
    <section id="top" className="relative isolate overflow-hidden pt-28 sm:pt-36">
      {/* Lime wash, after the reference: bright at the top right, deeper green at the lower left. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(55%_45%_at_88%_6%,#e4f8a8_0%,transparent_70%),radial-gradient(45%_55%_at_4%_62%,rgb(203_238_104/.75)_0%,transparent_70%),radial-gradient(40%_40%_at_60%_70%,rgb(221_245_154/.6)_0%,transparent_70%),linear-gradient(#ffffff,#f6f7f2)]"
      />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-linear-to-b from-transparent to-page" />

      <div className="shell flex flex-col items-center text-center">
        <Badge className="animate-rise">Real exchange rate · 74 countries</Badge>

        <h1 className="type-display mt-7 max-w-[1080px] animate-rise text-[clamp(40px,7vw,96px)] leading-[1.02] [animation-delay:.06s]">
          <span className="block">
            Send{" "}
            <Slot>
              <span className="relative inline-block">
                {sym}
                <select aria-label="Currency you send" value={source} onChange={(e) => setSource(e.target.value as Source)} className={overlay}>
                  {(Object.keys(SOURCES) as Source[]).map((s) => (
                    <option key={s} value={s}>
                      {s} · {SOURCES[s].symbol}
                    </option>
                  ))}
                </select>
              </span>
              <span className="relative inline-block tabular-nums">
                <span aria-hidden="true" className="invisible whitespace-pre">
                  {raw || "0"}
                </span>
                <input
                  aria-label={`Amount you send, in ${source}`}
                  inputMode="numeric"
                  autoComplete="off"
                  value={raw}
                  placeholder="0"
                  onChange={(e) => onAmount(e.target.value)}
                  className="absolute inset-0 w-full bg-transparent text-center tabular-nums outline-none placeholder:text-ink/25"
                />
              </span>
            </Slot>{" "}
            to{" "}
            <Slot caret>
              {port.city}
              <select aria-label="Where it goes" value={portId} onChange={(e) => setPortId(e.target.value)} className={overlay}>
                {HERO_PORTS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.city}, {p.country} ({p.code})
                  </option>
                ))}
              </select>
            </Slot>
            .
          </span>
          <span className="block">
            {port.recipient} gets{" "}
            <output key={`${port.id}-${source}`} aria-live="polite" className="pop text-lime-grad inline-block whitespace-nowrap tabular-nums">
              {port.symbol}
              {money(Math.round(shown), 0)}
            </output>
          </span>
        </h1>

        <p className="mt-7 max-w-[580px] animate-rise text-[17px] leading-relaxed text-ink-2 [animation-delay:.12s] sm:text-lg">
          It lands in {minuteWord(port.minutes)} minutes at the real exchange rate, for one{" "}
          <span className="font-semibold text-ink">
            {sym}
            {money(q.fee)}
          </span>{" "}
          fee you see before you pay. Try changing any underlined word.
        </p>

        <div className="mt-9 flex animate-rise flex-wrap items-center justify-center gap-3 [animation-delay:.18s]">
          <a href="#start" data-magnetic className={btn("ink", "lg", "pr-2")}>
            <Roll>{amount > 0 ? `Send ${sym}${raw}` : "Get started"}</Roll>
            <Arrow className="mr-0" />
          </a>
          <a href="#how" data-magnetic className={btn("ghost", "lg")}>
            <Roll>See how it works</Roll>
          </a>
        </div>
      </div>

      <div className="shell mt-16 animate-rise [animation-delay:.26s] sm:mt-20">
        <Stage source={source} port={port} amount={amount} fee={q.fee} rate={q.rate} receive={q.receive} />
      </div>

      {/* The rails we pay out on, scrolling */}
      <div className="relative mt-12 border-y border-line bg-paper py-5 sm:mt-4">
        <div className="shell flex items-center gap-8">
          <p className="hidden shrink-0 text-[13px] font-medium text-ink-3 md:block">Pays out instantly over</p>
          <div className="group flex min-w-0 flex-1 overflow-hidden mask-[linear-gradient(90deg,transparent,black_60px,black_calc(100%-60px),transparent)]">
            <div className="flex animate-marquee group-hover:[animation-play-state:paused]">
              {[0, 1].map((k) => (
                <ul key={k} aria-hidden={k === 1} className="flex shrink-0 items-center gap-12 pr-12">
                  {RAILS.map((r) => (
                    <li key={r} className="font-display text-[19px] font-semibold tracking-[-.03em] whitespace-nowrap text-ink/35">
                      {r}
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
