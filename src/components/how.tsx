"use client";

import { cx } from "@/lib/cx";
import { useSeen } from "@/lib/hooks";
import { PORTS, money, quote, rateText } from "@/lib/strait";
import { Count } from "./count";
import { Avatar, Disc, SectionHead } from "./ui";

const LAGOS = PORTS[0];
const Q = quote(1000, "GBP", LAGOS);

const STEPS = [
  {
    n: "01",
    h: "Type an amount",
    p: "See the rate, the fee and exactly what arrives before you commit. There's no small print.",
    icon: <path d="M3 5h10M3 8h10M3 11h6" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" />,
  },
  {
    n: "02",
    h: "Pay from your bank",
    p: "Use a bank transfer, Apple Pay or a debit card. We lock the rate as soon as your money lands.",
    icon: <path d="M2.5 6.5h11M3.5 6.5v5M6.5 6.5v5M9.5 6.5v5M12.5 6.5v5M2 13h12M8 2.5l5.5 3h-11z" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round" />,
  },
  {
    n: "03",
    h: "They get it in minutes",
    p: "We pay out from a local account over the country's instant rail. Your money never has to cross a border.",
    icon: <path d="m3 8.5 3 3 7-7" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />,
  },
];

const LOG = [
  { t: "16:02:11", h: "Payment received", p: "£1,000.00 from Monzo •• 2231" },
  { t: "16:02:14", h: "Rate locked", p: `${rateText(Q.rate)} NGN, mid-market · fee £${money(Q.fee)}` },
  { t: "16:02:51", h: "Paid out in Nigeria", p: `Over ${LAGOS.rail}, from our local account` },
  { t: "16:11:02", h: "Credited to Amara", p: `${LAGOS.bank} •• 4417 · text sent` },
];

export function How() {
  const [ref, seen] = useSeen<HTMLDivElement>(0.35);

  return (
    <section id="how" className="relative bg-paper py-24 sm:py-32">
      <div className="shell grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-16">
        <div className="lg:col-span-6">
          <SectionHead badge="How it works" title="Three steps. Most transfers land in under ten minutes." className="reveal" />
          <ol className="mt-10 grid gap-3">
            {STEPS.map((s) => (
              <li key={s.n} className="reveal group/step flex gap-5 rounded-[22px] p-4 transition-colors duration-300 hover:bg-page sm:p-5">
                <Disc className="transition-transform duration-500 ease-spring group-hover/step:scale-110 group-hover/step:-rotate-6">
                  <svg viewBox="0 0 16 16" className="size-[18px]" aria-hidden="true">
                    {s.icon}
                  </svg>
                </Disc>
                <div>
                  <p className="flex items-baseline gap-3">
                    <span className="font-mono text-[12px] text-ink-3">{s.n}</span>
                    <span className="font-display text-[19px] font-semibold tracking-[-.03em]">{s.h}</span>
                  </p>
                  <p className="mt-1.5 max-w-[440px] text-[14.5px] leading-relaxed text-ink-2">{s.p}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="reveal relative lg:col-span-6">
          <div ref={ref} className={cx("relative", seen && "track-on")}>
            <div aria-hidden="true" className="absolute -inset-6 rounded-[40px] bg-[radial-gradient(60%_60%_at_70%_30%,rgb(221_245_154/.8),transparent_70%)]" />
            <div className="relative rounded-[30px] bg-paper p-6 lift-lg sm:p-8">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar name="Amara Okafor" className="size-11" />
                  <div className="leading-tight">
                    <p className="text-[15px] font-semibold">To Amara Okafor</p>
                    <p className="text-[12.5px] text-ink-3">London → Lagos · #48213</p>
                  </div>
                </div>
                <span className="rounded-full bg-lime-100 px-3 py-1 text-[12px] font-semibold text-lime-800 ring-1 ring-lime-300">Delivered</span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-page p-4 ring-1 ring-line">
                  <p className="text-[12px] text-ink-3">You sent</p>
                  <p className="mt-1 font-display text-[24px] font-semibold tracking-[-.04em] tabular-nums">£1,000.00</p>
                </div>
                <div className="rounded-2xl bg-ink p-4 text-white">
                  <p className="text-[12px] text-white/55">Amara got</p>
                  <p className="mt-1 font-display text-[24px] font-semibold tracking-[-.04em] text-lime-400 tabular-nums">₦{money(Math.round(Q.receive), 0)}</p>
                </div>
              </div>

              <ol className="relative mt-7 grid gap-5 pl-9">
                <span aria-hidden="true" className="absolute top-2 bottom-2 left-[11px] w-0.5 rounded-full bg-mist" />
                <span aria-hidden="true" className="track-rail absolute top-2 bottom-2 left-[11px] w-0.5 rounded-full bg-lime-500" />
                {LOG.map((l, i) => (
                  <li key={l.t} className="track-step relative" style={{ "--i": i } as React.CSSProperties}>
                    <span aria-hidden="true" className="track-dot absolute top-1 -left-9 size-6 rounded-full ring-2 ring-lime-500" />
                    <p className="flex flex-wrap items-baseline justify-between gap-x-4">
                      <span className="text-[15px] font-semibold">{l.h}</span>
                      <span className="font-mono text-[12px] text-ink-3 tabular-nums">{l.t}</span>
                    </p>
                    <p className="mt-0.5 text-[13.5px] text-ink-2">{l.p}</p>
                  </li>
                ))}
              </ol>

              <p className="mt-7 flex items-center justify-between border-t border-line pt-5 text-[13px] text-ink-3">
                Total time
                <span className="font-display text-[22px] font-semibold tracking-[-.04em] text-ink tabular-nums">
                  <Count to={8} suffix=" min " />
                  <Count to={51} suffix=" s" />
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
