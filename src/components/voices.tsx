import { cx } from "@/lib/cx";
import { Count } from "./count";
import { Avatar, SectionHead } from "./ui";

const QUOTES = [
  {
    text: "It landed before Ammu had finished her tea. She rang to ask if I'd sent too much by mistake. I hadn't. That's just the real rate.",
    who: "Rafiq Hasan",
    role: "Sends to Dhaka from Leeds",
    chip: "৳20,000 · 6 min",
  },
  {
    text: "School fees paid at 9:04, and the school confirmed at 9:10. No queue at the remittance counter, and no guessing what gets taken off.",
    who: "Marisol Cruz",
    role: "Sends to Manila from Dublin",
    chip: "₱38,200 · 3 min",
  },
  {
    text: "My sister gets a text with the exact naira before it arrives, and it's always right. That alone was worth switching for.",
    who: "Tomi Adeyemi",
    role: "Sends to Lagos from Houston",
    chip: "₦1,004,240 · 9 min",
  },
];

function Stars({ className }: { className?: string }) {
  return (
    <span className={cx("flex gap-0.5", className)} aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <svg key={i} viewBox="0 0 16 16" className="size-4">
          <path d="m8 1.5 1.9 4.2 4.6.5-3.4 3.1 1 4.5L8 11.5l-4.1 2.3 1-4.5-3.4-3.1 4.6-.5z" fill="currentColor" />
        </svg>
      ))}
    </span>
  );
}

export function Voices() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="shell">
        <SectionHead center badge="Reviews" title="Loved on both ends of the transfer." className="reveal" />

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="reveal relative flex flex-col justify-between overflow-hidden rounded-[24px] bg-linear-to-br from-lime-200 via-lime-300 to-sage-400 p-7 lift transition-[box-shadow,transform] duration-500 ease-out-soft hover:[transform:translateY(-4px)]">
            <div aria-hidden="true" className="absolute -right-10 -bottom-16 size-56 rounded-full bg-white/25 blur-2xl" />
            <Stars className="relative text-ink" />
            <div className="relative">
              <p className="font-display text-[72px] leading-none font-semibold tracking-[-.06em] tabular-nums">
                <Count to={4.8} decimals={1} />
              </p>
              <p className="mt-2 text-[14px] font-medium text-ink/70">Average from <Count to={61240} /> reviews in the last 12 months</p>
            </div>
          </div>

          {QUOTES.map((q, i) => (
            <figure key={q.who} className="reveal spot relative flex flex-col overflow-hidden rounded-[24px] bg-paper p-7 lift transition-[box-shadow,transform] duration-500 ease-out-soft hover:[transform:translateY(-4px)] hover:lift-lg">
              <Stars className="text-lime-500" />
              <blockquote className="mt-5 flex-1 text-[15.5px] leading-relaxed text-ink">&ldquo;{q.text}&rdquo;</blockquote>
              <span className="mt-6 inline-flex w-fit items-center gap-1.5 rounded-full bg-lime-100 px-2.5 py-1 font-mono text-[11.5px] font-medium text-lime-800 ring-1 ring-lime-300">
                <svg viewBox="0 0 12 12" className="size-3" aria-hidden="true">
                  <path d="m2.5 6.2 2.2 2.2 4.8-4.8" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
                </svg>
                {q.chip}
              </span>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-line pt-5">
                <Avatar name={q.who} tone={i + 1} className="size-10" />
                <span className="leading-tight">
                  <span className="block text-[14px] font-semibold">{q.who}</span>
                  <span className="block text-[12.5px] text-ink-3">{q.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
