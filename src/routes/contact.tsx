import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";

import { Button, SectionHeading } from "@/components/ui-kit";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Help — 9 Stories & Co." },
      {
        name: "description",
        content:
          "Shipping, returns and bulk order enquiries for handcrafted Andhra Putharekulu. We reply within one working day.",
      },
      { property: "og:title", content: "Contact & Help — 9 Stories & Co." },
      {
        property: "og:description",
        content: "Shipping, returns and bulk order enquiries. We reply within one working day.",
      },
    ],
  }),
  component: Contact,
});

const faqs = [
  ["How fresh is my order?", "Everything is made the day it ships. Nothing is stocked in advance."],
  ["How long does delivery take?", "2–4 working days across India in insulated cartons. Metro cities are usually next-day."],
  ["What is the shelf life?", "12–15 days depending on the variety, kept airtight and away from moisture."],
  ["Do you take bulk orders?", "Yes — from 100 boxes upward, with custom sleeves and GST invoicing."],
  ["Can I return an order?", "Perishable goods can't be returned, but we replace anything damaged in transit."],
];

function Contact() {
  const [sent, setSent] = React.useState(false);

  return (
    <div className="px-5 py-20 lg:px-10 lg:py-28">
      <div className="mx-auto max-w-[1400px]">
        <SectionHeading
          eyebrow="Contact"
          title="We'd love to hear from you"
          subtitle="Questions, bulk orders or just a hello — we reply within one working day."
        />

        <div className="mt-16 grid gap-14 lg:grid-cols-2">
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            {[
              { id: "name", label: "Your name", type: "text" },
              { id: "email", label: "Email address", type: "email" },
              { id: "subject", label: "Subject", type: "text" },
            ].map((f) => (
              <div key={f.id}>
                <label htmlFor={f.id} className="eyebrow block text-muted-foreground">
                  {f.label}
                </label>
                <input
                  id={f.id}
                  type={f.type}
                  required
                  className="mt-2 h-12 w-full rounded-[10px] border border-border bg-card px-4 text-sm text-primary focus:border-accent focus:outline-none"
                />
              </div>
            ))}
            <div>
              <label htmlFor="message" className="eyebrow block text-muted-foreground">
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                required
                className="mt-2 w-full rounded-[10px] border border-border bg-card p-4 text-sm text-primary focus:border-accent focus:outline-none"
              />
            </div>
            <Button type="submit" size="lg">
              {sent ? "Thank you — we'll be in touch" : "Send message"}
            </Button>
          </form>

          <div>
            <h2 className="text-3xl text-primary">Frequently asked</h2>
            <dl className="mt-6 divide-y divide-border border-t border-border">
              {faqs.map(([q, a]) => (
                <div key={q} className="py-5">
                  <dt className="text-base font-medium text-primary">{q}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{a}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-10 rounded-[12px] bg-primary p-8">
              <p className="eyebrow text-gold">Visit the kitchen</p>
              <p className="mt-3 leading-relaxed text-on-dark-muted">
                Atreyapuram, East Godavari, Andhra Pradesh 533235
                <br />
                hello@9stories.co · +91 98490 00000
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
