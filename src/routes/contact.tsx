import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";

import { Button, SectionHeading } from "@/components/ui-kit";
import { StructuredData } from "@/components/seo";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — 9 Stories & Co. | Customer Support & Enquiries" },
      {
        name: "description",
        content:
          "Contact 9 Stories & Co. for shipping, returns, bulk orders, and customer support. Get help with your Putharekulu orders. We reply within one working day.",
      },
      { name: "keywords", content: "contact 9 Stories & Co, Putharekulu customer support, Indian sweets shipping, bulk sweets order, sweet delivery help, customer service" },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Contact & Help — 9 Stories & Co." },
      { property: "og:url", content: "https://9storiesandco.com/contact" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: "https://9storiesandco.com/contact" },
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

  const faqSchemaData = faqs.map(([question, answer]) => ({
    question,
    answer,
  }));

  return (
    <div className="bg-cream px-5 py-16 lg:px-10 lg:py-24 font-sans">
      <StructuredData type="faq" data={faqSchemaData} />
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
                <label htmlFor={f.id} className="eyebrow block text-brown mb-1">
                  {f.label}
                </label>
                <input
                  id={f.id}
                  type={f.type}
                  required
                  className="w-full rounded-lg border border-brown/30 bg-cream-light px-4 py-3 font-sans text-base font-bold text-brown placeholder:text-brown/50 focus:border-terracotta focus:outline-none"
                />
              </div>
            ))}
            <div>
              <label htmlFor="message" className="eyebrow block text-brown mb-1">
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                required
                className="w-full rounded-lg border border-brown/30 bg-cream-light p-4 font-sans text-base font-bold text-brown placeholder:text-brown/50 focus:border-terracotta focus:outline-none"
              />
            </div>
            <Button type="submit" size="lg" variant="primary" className="bg-brown text-white hover:bg-terracotta">
              {sent ? "Thank you — we'll be in touch" : "Send message"}
            </Button>
          </form>

          <div>
            <h3 className="font-display text-3xl text-brown">Frequently asked</h3>
            <dl className="mt-6 divide-y divide-brown/15 border-t border-brown/15 font-sans">
              {faqs.map(([q, a]) => (
                <div key={q} className="py-4">
                  <dt className="text-base font-bold text-brown">{q}</dt>
                  <dd className="mt-1 text-sm font-bold leading-relaxed text-brown/75">{a}</dd>
                </div>
              ))}
            </dl>
            <address className="mt-8 rounded-xl bg-brown p-8 not-italic text-cream font-sans">
              <p className="eyebrow text-gold">Visit the kitchen</p>
              <p className="mt-3 font-sans text-base font-bold leading-relaxed text-cream/80">
                Atreyapuram, East Godavari, Andhra Pradesh 533235
                <br />
                <a href="mailto:hello@9stories.co" className="hover:text-gold text-cream underline">hello@9stories.co</a> · <a href="tel:+919849000000" className="hover:text-gold text-cream underline">+91 98490 00000</a>
              </p>
            </address>
          </div>
        </div>
      </div>
    </div>
  );
}
