import * as React from "react";

import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6">
      <div>
        <h1 className="font-display text-3xl leading-none text-primary">{title}</h1>
        {subtitle ? <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function Panel({
  title,
  description,
  actions,
  className,
  children,
}: {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn("rounded-xl border border-border bg-card shadow-soft", className)}
    >
      {title ? (
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 px-5 py-4">
          <div>
            <h2 className="font-display text-xl leading-none text-primary">{title}</h2>
            {description ? (
              <p className="mt-1.5 text-xs text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {actions}
        </header>
      ) : null}
      <div className="p-5">{children}</div>
    </section>
  );
}

export function StatCard({
  label,
  value,
  delta,
  hint,
}: {
  label: string;
  value: string;
  delta?: string;
  hint?: string;
}) {
  const positive = delta?.startsWith("+");
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-soft">
      <p className="eyebrow text-muted-foreground">{label}</p>
      <p className="mt-3 font-display text-3xl leading-none text-primary">{value}</p>
      <div className="mt-3 flex items-center gap-2 text-xs">
        {delta ? (
          <span
            className={cn(
              "rounded-full px-2 py-0.5 font-medium",
              positive
                ? "bg-aqua/40 text-primary"
                : "bg-destructive/10 text-destructive",
            )}
          >
            {delta}
          </span>
        ) : null}
        {hint ? <span className="text-muted-foreground">{hint}</span> : null}
      </div>
    </div>
  );
}

const toneMap: Record<string, string> = {
  neutral: "bg-secondary text-secondary-foreground",
  positive: "bg-aqua/45 text-primary",
  warning: "bg-gold/25 text-brown",
  accent: "bg-accent/15 text-accent",
  danger: "bg-destructive/10 text-destructive",
};

export function Pill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: keyof typeof toneMap;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[0.6875rem] font-medium tracking-wide",
        toneMap[tone],
      )}
    >
      {children}
    </span>
  );
}

export function statusTone(status: string): keyof typeof toneMap {
  switch (status) {
    case "Delivered":
    case "Active":
    case "Published":
    case "Paid":
      return "positive";
    case "Pending":
    case "Draft":
    case "Scheduled":
    case "COD":
      return "warning";
    case "Processing":
    case "Shipped":
      return "accent";
    case "Cancelled":
    case "Archived":
    case "Expired":
    case "Refunded":
      return "danger";
    default:
      return "neutral";
  }
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="eyebrow block text-muted-foreground">{label}</span>
      <div className="mt-2">{children}</div>
      {hint ? <span className="mt-1.5 block text-xs text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

const controlClass =
  "w-full rounded-[10px] border border-input bg-background px-3 py-2.5 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus:border-accent focus:outline-none";

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(controlClass, props.className)} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(controlClass, "min-h-24", props.className)} />;
}

export function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(controlClass, "pr-8", props.className)} />;
}

export function Table({ head, children }: { head: string[]; children: React.ReactNode }) {
  return (
    <div className="-mx-5 overflow-x-auto px-5">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-border">
            {head.map((h) => (
              <th
                key={h}
                className="eyebrow px-3 py-3 text-left font-medium text-muted-foreground first:pl-0 last:pr-0 last:text-right"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function Td({
  children,
  className,
  colSpan,
}: {
  children?: React.ReactNode;
  className?: string;
  colSpan?: number;
}) {
  return (
    <td
      colSpan={colSpan}
      className={cn(
        "px-3 py-3.5 align-middle text-foreground first:pl-0 last:pr-0 last:text-right",
        className,
      )}
    >
      {children}
    </td>
  );
}

export function Tr({ children }: { children: React.ReactNode }) {
  return (
    <tr className="border-b border-border/60 transition-colors last:border-0 hover:bg-secondary/40">
      {children}
    </tr>
  );
}

export function MiniBarChart({ data }: { data: { label: string; value: number }[] }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="flex h-44 items-end gap-3">
      {data.map((d) => (
        <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
          <div
            className="w-full rounded-t-md bg-gradient-to-t from-primary to-teal-soft transition-all duration-500"
            style={{ height: `${(d.value / max) * 100}%` }}
            title={`${d.label}: ₹${d.value}k`}
          />
          <span className="text-[0.6875rem] text-muted-foreground">{d.label}</span>
        </div>
      ))}
    </div>
  );
}
