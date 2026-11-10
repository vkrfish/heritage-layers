import { cva, type VariantProps } from "class-variance-authority";
import { Star, Minus, Plus } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/products";

/* ------------------------------ Button ------------------------------ */

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-sans font-medium select-none transition-all duration-140 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C88A36] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF7F2] active:scale-[0.978] active:translate-y-[0.5px] cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "sds-btn-primary rounded-lg",
        secondary:
          "sds-btn-neutral rounded-lg",
        gold:
          "sds-btn-gold rounded-lg",
        accent:
          "sds-btn-gold rounded-lg",
        outlineGold:
          "border border-[#C88A36]/60 bg-transparent text-[#A85B24] hover:bg-[#C88A36]/8 hover:border-[#C88A36] rounded-lg",
        onDark:
          "bg-[#FAF7F2] text-[#241814] shadow-xs hover:bg-white rounded-lg",
        ghost:
          "bg-transparent text-stone-700 hover:bg-stone-200/50 hover:text-stone-900 rounded-lg",
        link:
          "p-0 h-auto text-[#A85B24] underline-offset-4 hover:underline bg-transparent rounded-none",
      },
      size: {
        xs: "h-7 px-2.5 text-[11px] rounded-md",
        sm: "h-8 px-3 text-xs rounded-md",
        md: "h-10 px-4 text-xs sm:text-sm rounded-lg",
        lg: "h-11 px-6 text-sm tracking-tight rounded-lg",
        xl: "h-12 px-7 text-sm sm:text-base font-medium rounded-xl",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export function IconButton({
  label,
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      aria-label={label}
      title={label}
      className={cn(
        "relative grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-lg border border-stone-200/80 bg-white/80 text-stone-700 shadow-2xs transition-all duration-140 hover:bg-stone-100 hover:text-stone-950 hover:border-stone-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C88A36] focus-visible:ring-offset-2 active:scale-95 cursor-pointer",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

/* ------------------------------ Bits ------------------------------ */

export function Eyebrow({
  children,
  tone = "terracotta",
  className,
}: {
  children: React.ReactNode;
  tone?: "terracotta" | "gold" | "green" | "brown";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block font-sans font-medium uppercase tracking-[0.14em] text-[11px]",
        tone === "terracotta" && "text-terracotta",
        tone === "gold" && "text-gold",
        tone === "green" && "text-green",
        tone === "brown" && "text-brown/80",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Rating({ value, count }: { value: number; count?: number }) {
  return (
    <div className="flex items-center gap-1.5" aria-label={`Rated ${value} out of 5`}>
      <span className="flex gap-0.5" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={cn(
              "h-3 w-3",
              i <= Math.round(value) ? "fill-gold text-gold" : "text-brown/20",
            )}
          />
        ))}
      </span>
      <span className="font-sans text-[11px] font-medium text-brown/70 tabular-nums">
        {value.toFixed(1)}
        {count ? ` (${count})` : ""}
      </span>
    </div>
  );
}

export function Price({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("font-sans text-lg font-semibold text-brown tabular-nums", className)}>
      {formatPrice(value)}
    </span>
  );
}

export function Badge({ children, variant = "gold" }: { children: React.ReactNode; variant?: "gold" | "green" | "terracotta" }) {
  return (
    <span
      className={cn(
        "inline-block rounded px-2 py-0.5 font-sans text-[10px] font-medium tracking-wide border",
        variant === "gold" && "bg-[#FFF9EE] border-gold/30 text-[#8F5B1D]",
        variant === "green" && "bg-[#F3F7EF] border-green/30 text-green",
        variant === "terracotta" && "bg-[#FAF1EC] border-terracotta/30 text-terracotta",
      )}
    >
      {children}
    </span>
  );
}

export function QuantitySelector({
  value,
  onChange,
  compact,
}: {
  value: number;
  onChange: (n: number) => void;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg border border-stone-200/90 bg-white shadow-2xs",
        compact ? "h-8" : "h-10",
      )}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(1, value - 1))}
        className="grid h-full w-8 sm:w-9 place-items-center text-stone-600 transition-colors hover:text-stone-950 hover:bg-stone-50 active:scale-90 cursor-pointer rounded-l-lg"
      >
        <Minus className="h-3 w-3" />
      </button>
      <span className="w-7 sm:w-8 text-center font-sans font-medium text-xs sm:text-sm tabular-nums text-stone-900">{value}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(value + 1)}
        className="grid h-full w-8 sm:w-9 place-items-center text-stone-600 transition-colors hover:text-stone-950 hover:bg-stone-50 active:scale-90 cursor-pointer rounded-r-lg"
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  onDark,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: string;
  align?: "center" | "left";
  onDark?: boolean;
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow ? <Eyebrow tone={onDark ? "gold" : "terracotta"}>{eyebrow}</Eyebrow> : null}
      <h2
        className={cn(
          "mt-2 font-display text-3xl sm:text-4xl font-normal leading-tight tracking-tight",
          onDark ? "text-cream" : "text-brown",
        )}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className={cn(
            "mt-2 font-sans text-sm sm:text-base font-normal leading-relaxed max-w-xl",
            align === "center" && "mx-auto",
            onDark ? "text-cream/75" : "text-brown/70",
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
