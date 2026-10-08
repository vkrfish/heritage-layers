import { cva, type VariantProps } from "class-variance-authority";
import { Star, Minus, Plus } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/products";

/* ------------------------------ Button ------------------------------ */

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg font-sans font-bold tracking-wider uppercase transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta cursor-pointer",
  {
    variants: {
      variant: {
        // Primary button: bg #4A2C20, text #FFFFFF, radius 8px, hover bg #8B3E2F
        primary:
          "bg-brown text-white hover:bg-terracotta",
        // Secondary button: transparent bg, 1.5px border #4A2C20, text #4A2C20, hover bg #4A2C20, text #FFFFFF
        secondary:
          "border-[1.5px] border-brown bg-transparent text-brown hover:bg-brown hover:text-white",
        // Accent button: bg #8B3E2F, text #FFFFFF, hover bg #4A2C20
        accent:
          "bg-terracotta text-white hover:bg-brown",
        // OnDark button: for story brown dark backgrounds
        onDark:
          "bg-cream text-brown hover:bg-gold hover:text-brown",
        ghost: "text-brown hover:text-terracotta px-2 bg-transparent",
        link: "px-0 text-terracotta underline-offset-4 hover:underline bg-transparent",
      },
      size: {
        md: "h-11 px-7 py-3 text-base",
        lg: "h-13 px-8 py-3.5 text-lg",
        sm: "h-9 px-4 text-sm",
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
        "relative grid h-11 w-11 place-items-center rounded-full text-brown transition-colors duration-200 hover:bg-brown/10 hover:text-terracotta focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta",
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
        "eyebrow inline-block font-sans font-bold uppercase tracking-[0.25em] text-xs sm:text-sm",
        tone === "terracotta" && "text-terracotta",
        tone === "gold" && "text-gold",
        tone === "green" && "text-green",
        tone === "brown" && "text-brown",
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
              "h-3.5 w-3.5",
              i <= Math.round(value) ? "fill-gold text-gold" : "text-brown/20",
            )}
          />
        ))}
      </span>
      <span className="font-sans text-xs font-bold text-brown/70">
        {value.toFixed(1)}
        {count ? ` (${count})` : ""}
      </span>
    </div>
  );
}

export function Price({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("font-sans text-xl font-bold text-terracotta tabular-nums", className)}>
      {formatPrice(value)}
    </span>
  );
}

export function Badge({ children, variant = "gold" }: { children: React.ReactNode; variant?: "gold" | "green" | "terracotta" }) {
  return (
    <span
      className={cn(
        "inline-block rounded-full px-3 py-1 font-sans text-xs font-bold uppercase tracking-wider",
        variant === "gold" && "bg-gold text-brown",
        variant === "green" && "bg-green text-white",
        variant === "terracotta" && "bg-terracotta text-white",
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
        "inline-flex items-center rounded-lg border border-brown/20 bg-cream-light",
        compact ? "h-9" : "h-11",
      )}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(1, value - 1))}
        className="grid h-full w-9 place-items-center text-brown transition-colors hover:text-terracotta"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="w-8 text-center font-sans font-bold text-sm tabular-nums text-brown">{value}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(value + 1)}
        className="grid h-full w-9 place-items-center text-brown transition-colors hover:text-terracotta"
      >
        <Plus className="h-3.5 w-3.5" />
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
          "mt-3 font-display text-3xl sm:text-5xl font-normal leading-tight",
          onDark ? "text-cream" : "text-brown",
        )}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className={cn(
            "mt-3 font-sans text-lg font-bold leading-relaxed",
            onDark ? "text-cream/80" : "text-brown/80",
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
