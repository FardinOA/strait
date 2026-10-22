"use client";

import { useEffect } from "react";

/**
 * One controller for the page's ambient motion, so components stay declarative:
 * - .reveal / .words / .cascade get .in when they enter the viewport, with a
 *   stagger between sibling reveals (--d) and between cascade children (--i);
 * - .spot elements get --sx/--sy for the cursor spotlight;
 * - [data-magnetic] elements lean toward the pointer;
 * - <html> gets --scroll (0–1) for the progress bar and the back-to-top ring.
 */
export function Motion() {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const targets = Array.from(document.querySelectorAll<HTMLElement>(".reveal, .words, .cascade"));
    targets.forEach((el) => {
      if (el.classList.contains("reveal") && !el.style.getPropertyValue("--d")) {
        const sibs = Array.from(el.parentElement?.children ?? []).filter((c) => c.classList.contains("reveal"));
        el.style.setProperty("--d", `${Math.min(sibs.indexOf(el), 6) * 90}ms`);
      }
      if (el.classList.contains("cascade")) Array.from(el.children).forEach((c, i) => (c as HTMLElement).style.setProperty("--i", String(Math.min(i, 14))));
    });

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );
    targets.forEach((t) => io.observe(t));

    let magnet: HTMLElement | null = null;
    const release = () => {
      if (magnet) magnet.style.translate = "";
      magnet = null;
    };
    const onMove = (e: PointerEvent) => {
      const t = e.target as Element | null;
      const spot = t?.closest?.<HTMLElement>(".spot");
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty("--sx", `${e.clientX - r.left}px`);
        spot.style.setProperty("--sy", `${e.clientY - r.top}px`);
      }
      if (reduce || e.pointerType !== "mouse") return;
      const m = t?.closest?.<HTMLElement>("[data-magnetic]") ?? null;
      if (m !== magnet) release();
      if (m) {
        magnet = m;
        const r = m.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        m.style.translate = `${dx * 0.18}px ${dy * 0.3}px`;
      }
    };

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = root.scrollHeight - innerHeight;
        root.style.setProperty("--scroll", String(max > 0 ? Math.min(1, scrollY / max) : 0));
      });
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", release);
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      io.disconnect();
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", release);
      removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
