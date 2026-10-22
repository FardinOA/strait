import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

type Variant = "ink" | "lime" | "ghost";

const VARIANTS: Record<Variant, string> = {
  ink: "bg-ink text-white shadow-[inset_0_1px_0_rgb(255_255_255/.16),0_1px_2px_rgb(10_11_9/.2),0_10px_24px_-10px_rgb(10_11_9/.6)] hover:bg-coal",
  lime: "bg-lime-400 text-ink shadow-[inset_0_1px_0_rgb(255_255_255/.5),0_1px_2px_rgb(46_62_14/.2),0_12px_24px_-10px_rgb(122_163_21/.7)] hover:bg-lime-300",
  ghost: "bg-paper text-ink ring-1 ring-line-2 hover:ring-ink/30 lift",
};

export const btn = (variant: Variant, size: "md" | "lg" = "md", className?: string) =>
  cx(
    "group/btn relative inline-flex cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full font-medium tracking-[-.01em] whitespace-nowrap",
    "transition-[translate,scale,background-color,box-shadow] duration-300 ease-out-soft hover:-translate-y-px active:translate-y-0 active:scale-[.97]",
    size === "lg" ? "h-12 px-6 text-[15px]" : "h-10 px-4.5 text-sm",
    VARIANTS[variant],
    className,
  );

/** The label inside a button rolls up and a copy rolls in from below. */
export function Roll({ children }: { children: string }) {
  return (
    <span className="relative inline-flex overflow-hidden">
      <span className="transition-transform duration-500 ease-out-soft group-hover/btn:-translate-y-full">{children}</span>
      <span aria-hidden="true" className="absolute inset-0 translate-y-full transition-transform duration-500 ease-out-soft group-hover/btn:translate-y-0">
        {children}
      </span>
    </span>
  );
}

/** Arrow in a small disc, which slides on hover. */
export function Arrow({ className, disc = true }: { className?: string; disc?: boolean }) {
  return (
    <span className={cx("grid place-items-center", disc && "-mr-3 ml-1 size-8 rounded-full bg-white/15 group-hover/btn:bg-white/25", className)}>
      <svg viewBox="0 0 16 16" aria-hidden="true" className="size-3.5 transition-transform duration-300 ease-out-soft group-hover/btn:translate-x-0.5">
        <path d="M3 8h9.5M8.5 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

/** A route from one point to another, curving through the middle. */
export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <rect width={32} height={32} rx={9} fill="#0a0b09" />
      <path d="M9 21.5c4.5 0 5-11 13.5-11" fill="none" stroke="#b8e43c" strokeWidth={3} strokeLinecap="round" />
      <circle cx={9} cy={21.5} r={2.6} fill="#fff" />
      <circle cx={23} cy={10.5} r={2.6} fill="#b8e43c" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cx("inline-flex items-center gap-2", className)}>
      <Logo className="size-7" />
      <span className="font-display text-[20px] font-semibold tracking-[-.045em]">Strait</span>
    </span>
  );
}

/** Small pill label with a lime bolt, as in the reference's badge. */
export function Badge({ children, className, dark }: { children: ReactNode; className?: string; dark?: boolean }) {
  return (
    <p
      className={cx(
        "inline-flex items-center gap-2 rounded-full py-1 pr-3.5 pl-1 text-[13px] font-medium",
        dark ? "bg-white/8 text-white/80 ring-1 ring-white/12" : "bg-paper/80 text-ink-2 ring-1 ring-line-2 backdrop-blur",
        className,
      )}
    >
      <span className="grid size-5.5 place-items-center rounded-full bg-lime-400 text-ink">
        <svg viewBox="0 0 16 16" aria-hidden="true" className="size-3">
          <path d="M9 1.5 3.5 9H8l-1 5.5L12.5 7H8z" fill="currentColor" />
        </svg>
      </span>
      {children}
    </p>
  );
}

/** Light-weight section head, after the reference's "Banking, Reimagined". */
export function SectionHead({ badge, title, lede, className, center }: { badge?: string; title: ReactNode; lede?: ReactNode; className?: string; center?: boolean }) {
  return (
    <div className={cx("flex max-w-[780px] flex-col", center ? "mx-auto items-center text-center" : "items-start", className)}>
      {badge && <Badge>{badge}</Badge>}
      <h2 className={cx("type-section mt-6 text-[clamp(34px,4.6vw,58px)]", typeof title === "string" && "words")}>{typeof title === "string" ? <Words text={title} /> : title}</h2>
      {lede && <p className="mt-5 max-w-[540px] text-base leading-relaxed text-ink-2 sm:text-[17px]">{lede}</p>}
    </div>
  );
}

/** Splits a headline into words that rise out of a mask in sequence (see .words in globals.css). */
export function Words({ text, offset = 0 }: { text: string; offset?: number }) {
  const words = text.split(" ");
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <span key={i}>
            <span className="w">
              <span style={{ "--wi": i + offset } as React.CSSProperties}>{w}</span>
            </span>
            {i < words.length - 1 && " "}
          </span>
        ))}
      </span>
    </>
  );
}

/** Sage disc with a soft halo, used for icons (the reference's green circles). */
export function Disc({ children, className, size = "md" }: { children: ReactNode; className?: string; size?: "sm" | "md" | "lg" }) {
  return (
    <span
      className={cx(
        "relative grid shrink-0 place-items-center rounded-full bg-linear-to-b from-sage-400 to-sage-600 text-white",
        "shadow-[inset_0_1px_0_rgb(255_255_255/.35),0_0_0_6px_rgb(94_143_82/.1),0_0_0_14px_rgb(94_143_82/.05),0_10px_20px_-6px_rgb(74_117_65/.6)]",
        size === "sm" ? "size-8" : size === "lg" ? "size-14" : "size-11",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Initials avatar with a soft gradient. */
export function Avatar({ name, tone = 0, className }: { name: string; tone?: number; className?: string }) {
  const tones = ["from-lime-200 to-lime-400", "from-sage-100 to-sage-400", "from-[#e9e2d3] to-[#c9b48c]", "from-[#dfe4ec] to-[#9fb0c8]", "from-[#f1dccf] to-[#d79f82]"];
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  return (
    <span aria-hidden="true" className={cx("grid shrink-0 place-items-center rounded-full bg-linear-to-br text-[12px] font-semibold text-ink/80 ring-2 ring-white", tones[tone % tones.length], className ?? "size-9")}>
      {initials}
    </span>
  );
}

/** Segmented switch with a sliding thumb. */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
  className?: string;
}) {
  const i = Math.max(0, options.findIndex((o) => o.value === value));
  return (
    <div role="radiogroup" aria-label={label} className={cx("relative grid rounded-full bg-mist p-1 ring-1 ring-line", className)} style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
      <span
        aria-hidden="true"
        className="absolute inset-y-1 left-1 rounded-full bg-ink shadow-[0_4px_12px_-4px_rgb(10_11_9/.5)] transition-transform duration-500 ease-spring"
        style={{ width: `calc((100% - 8px) / ${options.length})`, transform: `translateX(${i * 100}%)` }}
      />
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={o.value === value}
          onClick={() => onChange(o.value)}
          className={cx(
            "relative h-8 cursor-pointer rounded-full px-3 text-[13px] font-medium whitespace-nowrap tabular-nums transition-colors duration-300",
            o.value === value ? "text-white" : "text-ink-2 hover:text-ink",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Round currency badge: code initials on a tinted disc (no flag emoji, which render inconsistently). */
export function Cur({ code, className }: { code: string; className?: string }) {
  const tint: Record<string, string> = {
    GBP: "bg-[#1f2a44] text-white",
    EUR: "bg-[#2541b2] text-white",
    USD: "bg-[#1d5c3b] text-white",
    NGN: "bg-[#0f7a3d] text-white",
    BDT: "bg-[#0b6b4f] text-white",
    PHP: "bg-[#1b3fa0] text-white",
    INR: "bg-[#e8892b] text-white",
    MXN: "bg-[#0f6b48] text-white",
    KES: "bg-[#8b1d1d] text-white",
  };
  return (
    <span aria-hidden="true" className={cx("grid shrink-0 place-items-center rounded-full font-mono text-[9px] font-semibold tracking-tight ring-2 ring-white", tint[code] ?? "bg-ink text-white", className ?? "size-7")}>
      {code}
    </span>
  );
}
