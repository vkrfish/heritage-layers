import { cva, type VariantProps } from "class-variance-authority";
import { Star, Minus, Plus } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/products";

/* ------------------------------ Button ------------------------------ */

export const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-[10px] px-6 text-[0.8125rem] font-medium tracking-[0.08em] uppercase transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-accent-foreground hover:bg-accent-hover hover:-translate-y-0.5",
        secondary:
          "border border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground hover:-translate-y-0.5",
        onDark:
          "bg-cream text-primary hover:bg-accent hover:text-accent-foreground hover:-translate-y-0.5",
        ghost: "text-primary hover:text-accent px-2",
        link: "px-0 text-accent underline-offset-4 hover:underline",
      },
      size: {
        md: "h-11",
        lg: "h-13 px-8",
        sm: "h-11 px-4 text-[0.6875rem]",
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
        "relative grid h-11 w-11 place-items-center rounded-full text-primary transition-colors duration-200 hover:bg-parchment/70 hover:text-accent",
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
  tone = "accent",
  className,
}: {
  children: React.ReactNode;
  tone?: "accent" | "gold" | "aqua";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "eyebrow inline-block",
        tone === "accent" && "text-accent",
        tone === "gold" && "text-gold",
        tone === "aqua" && "text-aqua",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Rating({ value, count }: { value: number; count?: number }) {
  return (
    <div className="flex items-center gap-2" aria-label={`Rated ${value} out of 5`}>
      <span className="flex gap-0.5" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={cn(
              "h-3.5 w-3.5",
              i <= Math.round(value) ? "fill-gold text-gold" : "text-border",
            )}
          />
        ))}
      </span>
      <span className="text-xs text-muted-foreground">
        {value.toFixed(1)}
        {count ? ` (${count})` : ""}
      </span>
    </div>
  );
}

export function Price({ value, className }: { value: number; className?: string }) {
  return (
    <span className={cn("font-medium text-accent tabular-nums", className)}>
      {formatPrice(value)}
    </span>
  );
}

export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="eyebrow rounded-full border border-gold/60 bg-cream/90 px-3 py-1 text-brown">
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
        "inline-flex items-center rounded-[10px] border border-border bg-card",
        compact ? "h-9" : "h-11",
      )}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(1, value - 1))}
        className="grid h-full w-9 place-items-center text-primary transition-colors hover:text-accent"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="w-8 text-center text-sm tabular-nums">{value}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(value + 1)}
        className="grid h-full w-9 place-items-center text-primary transition-colors hover:text-accent"
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
      {eyebrow ? <Eyebrow tone={onDark ? "gold" : "accent"}>{eyebrow}</Eyebrow> : null}
      <h2
        className={cn(
          "mt-4 text-4xl leading-[1.1] sm:text-5xl",
          onDark ? "text-on-dark" : "text-primary",
        )}
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed",
            onDark ? "text-on-dark-muted" : "text-muted-foreground",
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
