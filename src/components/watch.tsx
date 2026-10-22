import { cx } from "@/lib/cx";
import { Badge, Words } from "./ui";

const FEED = [
  { t: "02:58", who: "Rent · Manila", amt: "₱38,200", ok: true },
  { t: "03:01", who: "Mum · Dhaka", amt: "৳20,000", ok: true },
  { t: "03:04", who: "School fees · Nairobi", amt: "KSh 64,500", ok: true },
  { t: "03:12", who: "New payee · Lagos", amt: "₦4,060,000", ok: false },
  { t: "03:15", who: "Savings · EUR balance", amt: "€1,200", ok: true },
  { t: "03:19", who: "Wedding gift · Mumbai", amt: "₹25,000", ok: true },
];

const RULES = [
  { h: "Ring-fenced balances", p: "Your money sits in safeguarded accounts at tier-one banks. We can't lend it, invest it or borrow against it.", d: "M8 1.8 13 4v4c0 3-2.2 5.3-5 6.2C5.2 13.3 3 11 3 8V4z" },
  { h: "Two keys for big sends", p: "Anything well outside your usual pattern needs a second confirmation from a device you trust.", d: "M5.5 9.5a3 3 0 1 1 2.4-4.8L14 4.7v2.2h-1.6v1.6h-2.2L8.6 7A3 3 0 0 1 5.5 9.5z" },
  { h: "Licensed where we pay out", p: "Regulated as a payment institution in all 31 countries we pay out in, and audited every year.", d: "M3 13.5h10M4 11.5V7M8 11.5V7M12 11.5V7M2.5 6l5.5-3.5L13.5 6z" },
  { h: "One-tap freeze", p: "Lost your phone? Freeze cards and transfers from any browser. Unfreezing takes one tap too.", d: "M8 2v12M3 5l10 6M13 5 3 11" },
];

/** Security, told as a radar: a sweep passes over the feed, and the one transfer it holds stays lit. */
export function Watch() {
  return (
    <section id="security" className="relative overflow-hidden bg-ink py-24 text-white sm:py-32">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(45%_60%_at_15%_60%,rgb(184_228_60/.14),transparent_70%),radial-gradient(40%_40%_at_90%_10%,rgb(94_143_82/.2),transparent_70%)]" />
      <div className="shell relative grid gap-14 lg:grid-cols-12 lg:items-center lg:gap-14">
        <div className="reveal lg:order-2 lg:col-span-6 lg:col-start-7">
          <Badge dark>Security</Badge>
          <h2 className="type-section words mt-6 text-[clamp(34px,4.6vw,56px)]">
            <Words text="We don’t freeze your account on a hunch." />{" "}
            <span className="text-white/45">
              <Words text="We hold one transfer and ask you." offset={8} />
            </span>
          </h2>

          <dl className="cascade mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2">
            {RULES.map((r) => (
              <div key={r.h} className="group/rule">
                <dt className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-full bg-white/8 text-lime-400 ring-1 ring-white/10 transition-[background-color,color,transform] duration-300 ease-spring group-hover/rule:scale-110 group-hover/rule:bg-lime-400 group-hover/rule:text-ink">
                    <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true">
                      <path d={r.d} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <span className="font-display text-[17px] font-semibold tracking-[-.03em]">{r.h}</span>
                </dt>
                <dd className="mt-2.5 text-[14px] leading-relaxed text-white/55">{r.p}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="reveal lg:order-1 lg:col-span-6">
          <div className="relative overflow-hidden rounded-[30px] bg-coal p-3 ring-1 ring-white/8 sm:p-4">
            {/* Radar sweep, centred on the held transfer's row. */}
            <div aria-hidden="true" className="absolute top-[56%] left-1/2 aspect-square w-[130%] -translate-x-1/2 -translate-y-1/2 mask-[radial-gradient(circle,black_30%,transparent_68%)]">
              <div className="radar size-full animate-sweep rounded-full" />
              {[30, 55, 80].map((s) => (
                <span key={s} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full ring-1 ring-white/5" style={{ width: `${s}%`, height: `${s}%` }} />
              ))}
            </div>

            <div className="relative flex items-center justify-between px-3 pt-2 pb-4">
              <p className="text-[12.5px] font-medium text-white/60">Live screening · 03:00–03:20</p>
              <p className="rounded-full bg-lime-400/12 px-2.5 py-1 text-[11.5px] font-medium text-lime-300">6 checked · 1 held</p>
            </div>
            <ul className="cascade relative grid gap-1.5">
              {FEED.map((f) => (
                <li
                  key={f.t}
                  className={cx(
                    "grid grid-cols-[48px_1fr_auto] items-center gap-3 rounded-2xl px-4 py-3.5 text-[13.5px]",
                    f.ok ? "bg-white/[.035] text-white/70" : "bg-white text-ink shadow-[0_0_0_4px_rgb(184_228_60/.35),0_20px_40px_-10px_rgb(184_228_60/.35)]",
                  )}
                >
                  <span className={cx("font-mono text-[12px] tabular-nums", f.ok ? "text-white/40" : "text-ink-3")}>{f.t}</span>
                  <span className="flex min-w-0 items-center gap-2 truncate">
                    {f.ok ? (
                      <svg viewBox="0 0 12 12" className="size-3 shrink-0 text-lime-400" aria-hidden="true">
                        <path d="m2.5 6.2 2.2 2.2 4.8-4.8" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
                      </svg>
                    ) : (
                      <span className="shrink-0 rounded-full bg-ink px-2 py-0.5 text-[10.5px] font-semibold text-lime-400">Held</span>
                    )}
                    <span className="truncate font-medium">{f.who}</span>
                  </span>
                  <span className="font-mono text-[12.5px] tabular-nums">{f.amt}</span>
                  {!f.ok && <span className="col-span-3 mt-1 text-[13px] leading-snug text-ink-2">New device, 3 a.m., four times your usual amount. We&rsquo;ve texted you to check it&rsquo;s really you.</span>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
