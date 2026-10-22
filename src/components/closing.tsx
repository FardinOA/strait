"use client";

import { useState } from "react";
import { Arrow, Avatar, Badge, Roll, Words, btn } from "./ui";

const FAQ = [
  { q: "What is the mid-market rate?", a: "It's the midpoint between the rates banks buy and sell a currency at, and it's the rate you see on Google. We use it as it is and charge one fee on top, which you see before you pay." },
  { q: "How can it arrive in minutes?", a: "We already hold money in every country we send to. When you pay us, we pay out from that local account over the country's own instant rail, so your money doesn't have to cross a border." },
  { q: "Does the recipient need Strait?", a: "No. They receive it in their bank account or mobile wallet as usual, and get a text with the amount and a link to track it." },
  { q: "What if a transfer fails?", a: "The money comes back to your Strait balance automatically, fee included, usually within the hour. A person, not a bot, writes to tell you why." },
];

export function Closing() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <section id="start" className="relative pb-24 sm:pb-32">
      <div className="shell grid gap-4 lg:grid-cols-12">
        <div className="reveal relative overflow-hidden rounded-[32px] bg-[radial-gradient(70%_80%_at_100%_0%,#e4f8a8_0%,transparent_60%),radial-gradient(60%_70%_at_0%_100%,#cbee68_0%,transparent_65%),linear-gradient(#ffffff,#f3f9e2)] p-7 lift sm:p-12 lg:col-span-7">
          {/* A mini send card floats in the corner. */}
          <div aria-hidden="true" className="gloss absolute top-12 -right-8 hidden w-[210px] rotate-[10deg] animate-[bob_6s_ease-in-out_infinite] rounded-[22px] p-4 text-white xl:block">
            <p className="text-[11px] text-white/55">You send</p>
            <p className="mt-1 font-display text-[26px] font-semibold tracking-[-.04em]">£500.00</p>
            <p className="mt-3 flex justify-between text-[11.5px]">
              <span className="text-white/55">Fee</span>
              <span className="font-mono text-lime-400">£0.00</span>
            </p>
            <div className="mt-3 h-8 rounded-full bg-lime-400" />
          </div>

          <div className="relative flex h-full flex-col">
            <Badge className="self-start">First £500 free</Badge>
            <h2 className="type-display words mt-6 text-[clamp(42px,5.4vw,72px)] leading-[.98]">
              <Words text="Your first transfer" />
              <br />
              <span className="text-lime-grad">
                <Words text="is on us." offset={3} />
              </span>
            </h2>
            <p className="mt-6 max-w-[420px] text-[17px] leading-relaxed text-ink-2">Opening an account takes about four minutes with a photo ID. Your first £500 goes with no fee at all.</p>

            {sent ? (
              <p role="status" className="mt-10 max-w-[460px] rounded-2xl bg-paper px-5 py-4 text-[15px] lift">
                <span className="font-semibold">Check {email}.</span> We&rsquo;ve sent you a link to finish signing up. It works for 30 minutes.
              </p>
            ) : (
              <form
                className="mt-10 flex max-w-[470px] flex-col gap-2 rounded-[28px] bg-paper p-1.5 lift sm:flex-row sm:rounded-full"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email.includes("@")) setSent(true);
                }}
              >
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-11 min-w-0 flex-1 rounded-full bg-transparent px-4 text-[16px] outline-none placeholder:text-ink-3"
                />
                <button type="submit" data-magnetic className={btn("ink", "md", "h-11 pr-2")}>
                  <Roll>Get started</Roll>
                  <Arrow className="mr-0 size-7" />
                </button>
              </form>
            )}
            <p className="mt-4 text-[12.5px] text-ink-3">No card needed. Available in 41 countries you can send from.</p>
          </div>
        </div>

        <div className="reveal rounded-[32px] bg-paper p-7 lift sm:p-10 lg:col-span-5">
          <h3 className="type-section text-[30px]">Questions, answered.</h3>
          <div className="mt-5 divide-y divide-line">
            {FAQ.map((f) => (
              <details key={f.q} className="faq py-1">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 rounded-lg py-4 text-[16px] font-semibold tracking-[-.01em]">
                  {f.q}
                  <span aria-hidden="true" className="faq-plus relative grid size-7 shrink-0 place-items-center rounded-full bg-page ring-1 ring-line before:absolute before:h-[1.5px] before:w-3 before:bg-ink after:absolute after:h-3 after:w-[1.5px] after:bg-ink after:transition-[rotate,opacity] after:duration-300" />
                </summary>
                <p className="pb-5 text-[14.5px] leading-relaxed text-ink-2">{f.a}</p>
              </details>
            ))}
          </div>
          <div className="mt-8 flex items-center gap-4 rounded-2xl bg-page p-4 ring-1 ring-line">
            <div className="flex -space-x-2">
              {["Ines Duarte", "Kofi Mensah", "Sana Iqbal"].map((n, i) => (
                <Avatar key={n} name={n} tone={i + 2} className="size-9" />
              ))}
            </div>
            <p className="flex-1 text-[13.5px] leading-snug text-ink-2">
              <span className="font-semibold text-ink">Still curious?</span> Chat with a person. Median reply: 2 minutes, any hour.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
