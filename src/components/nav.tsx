"use client";

import { useEffect, useRef, useState } from "react";
import { cx } from "@/lib/cx";
import { Roll, Wordmark, btn } from "./ui";

const LINKS = [
  { href: "#how", label: "How it works" },
  { href: "#compare", label: "Compare" },
  { href: "#features", label: "Features" },
  { href: "#rates", label: "Rates" },
  { href: "#security", label: "Security" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hover, setHover] = useState<number | null>(null);
  const [active, setActive] = useState<number | null>(null);
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null);
  const list = useRef<HTMLUListElement>(null);

  // Scrollspy: the section crossing the upper third of the screen is active.
  useEffect(() => {
    const els = LINKS.map((l) => document.querySelector(l.href)).filter(Boolean) as Element[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const i = els.indexOf(e.target);
          if (e.isIntersecting) setActive(i);
          else setActive((a) => (a === i ? null : a));
        }
      },
      { rootMargin: "-30% 0px -65% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const i = hover ?? active;
    const a = i === null ? null : list.current?.querySelectorAll("a")[i];
    setPill(a ? { x: a.offsetLeft, w: a.offsetWidth } : null);
  }, [hover, active]);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4">
      <div
        className={cx(
          "relative mx-auto max-w-[1240px] rounded-[22px] transition-[background-color,box-shadow,backdrop-filter] duration-500",
          scrolled || open ? "bg-white/80 shadow-[0_0_0_1px_rgb(10_11_9/.06),0_12px_32px_-16px_rgb(10_11_9/.25)] backdrop-blur-xl" : "bg-transparent",
        )}
      >
        <div aria-hidden="true" className={cx("pointer-events-none absolute inset-x-6 bottom-0 h-[2px] overflow-hidden rounded-full transition-opacity duration-500", scrolled ? "opacity-100" : "opacity-0")}>
          <div className="h-full origin-left rounded-full bg-linear-to-r from-lime-300 to-lime-500" style={{ transform: "scaleX(var(--scroll, 0))" }} />
        </div>
        <nav aria-label="Main" className="flex h-14 items-center justify-between gap-6 pr-2 pl-4 sm:h-16 sm:pl-5">
          <a href="#top" aria-label="Strait, home">
            <Wordmark />
          </a>

          {/* One pill slides to whichever link is hovered, or rests on the section in view. */}
          <ul ref={list} onPointerLeave={() => setHover(null)} className="relative hidden items-center gap-1 lg:flex">
            <span
              aria-hidden="true"
              className={cx("absolute top-0 left-0 h-full rounded-full bg-ink/6 transition-[translate,width,opacity] duration-500 ease-spring", pill ? "opacity-100" : "opacity-0")}
              style={pill ? { translate: `${pill.x}px 0`, width: pill.w } : undefined}
            />
            {LINKS.map((l, i) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onPointerEnter={() => setHover(i)}
                  onFocus={() => setHover(i)}
                  onBlur={() => setHover(null)}
                  aria-current={active === i ? "true" : undefined}
                  className={cx("relative block rounded-full px-3.5 py-2 text-[14px] font-medium transition-colors duration-300", active === i || hover === i ? "text-ink" : "text-ink-2")}
                >
                  {l.label}
                  <span aria-hidden="true" className={cx("absolute bottom-0.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-lime-500 transition-[opacity,scale] duration-300", active === i ? "scale-100 opacity-100" : "scale-0 opacity-0")} />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1.5">
            <a href="#start" className="hidden rounded-full px-3.5 py-2 text-[14px] font-medium text-ink-2 hover:text-ink sm:block">
              Log in
            </a>
            <a href="#start" data-magnetic className={btn("ink", "md", "max-sm:hidden")}>
              <Roll>Get started</Roll>
            </a>
            <button
              type="button"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((o) => !o)}
              className="grid size-10 cursor-pointer place-items-center rounded-full bg-ink text-white lg:hidden"
            >
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
              <span aria-hidden="true" className="relative block h-3 w-4">
                <span className={cx("absolute left-0 h-[1.5px] w-4 bg-current transition-transform duration-300", open ? "top-[5px] rotate-45" : "top-0.5")} />
                <span className={cx("absolute left-0 h-[1.5px] w-4 bg-current transition-transform duration-300", open ? "top-[5px] -rotate-45" : "top-[9px]")} />
              </span>
            </button>
          </div>
        </nav>

        <div id="mobile-menu" hidden={!open} className="px-4 pb-4 lg:hidden">
          <ul className="grid gap-0.5 border-t border-line pt-2">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} onClick={() => setOpen(false)} className="flex items-center justify-between rounded-xl px-2 py-3 text-[17px] font-medium hover:bg-mist">
                  {l.label}
                  <span aria-hidden="true" className="text-ink-3">
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <a href="#start" onClick={() => setOpen(false)} className={btn("ink", "lg", "mt-3 w-full")}>
            Get started
          </a>
        </div>
      </div>
    </header>
  );
}
