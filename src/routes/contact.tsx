import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { Check, Mail, Phone, MapPin, Send } from "lucide-react";

import { SectionHeading } from "@/components/ui-kit";
import { StructuredData } from "@/components/seo";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — 9 Stories & Co. | Customer Concierge & Enquiries" },
      {
        name: "description",
        content:
          "Contact 9 Stories & Co. for orders, wedding favors, corporate gifting, and artisanal kitchen tours in Atreyapuram, Andhra Pradesh.",
      },
      { name: "keywords", content: "contact 9 Stories & Co, Putharekulu customer support, Indian sweets shipping, bulk sweets order, sweet delivery help, customer service" },
      { name: "robots", content: "index, follow" },
      { property: "og:title", content: "Contact & Concierge — 9 Stories & Co." },
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
  ["How fresh is my order?", "Every sweet is rolled by master artisans the very morning it is dispatched. Nothing is made in advance or kept in cold storage."],
  ["How long does delivery take?", "2 to 4 business days across India via express refrigerated courier. Metro addresses are typically delivered within 24 to 48 hours."],
  ["What is the authentic shelf life?", "14 to 18 days at room temperature when kept sealed away from direct humidity. Avoid refrigeration to preserve the wafer texture."],
  ["Do you cater weddings and corporate gifting?", "Yes — from 50 bespoke hampers upward, complete with monogrammed wax seals, gold foil sleeves, and GST invoicing."],
  ["Can I return or exchange perishable sweets?", "Because our delicacies are freshly prepared without chemical preservatives, returns are not accepted. We immediately replace anything affected in transit."],
];

function Contact() {
  const [sent, setSent] = React.useState(false);

  const faqSchemaData = faqs.map(([question, answer]) => ({
    question,
    answer,
  }));

  return (
    <div className="bg-[#FAF7F2] px-4 py-12 sm:py-20 lg:px-10 font-sans text-stone-900 pb-[calc(5rem+env(safe-area-inset-bottom))]">
      <StructuredData type="faq" data={faqSchemaData} />
      <div className="mx-auto max-w-[1400px]">
        <SectionHeading
          eyebrow="Concierge &amp; Enquiries"
          title="We'd love to hear from you"
          subtitle="Questions about your order, custom wedding hampers, or simply saying hello — we respond within four business hours."
        />

        <div className="mt-10 sm:mt-16 grid gap-10 lg:grid-cols-12">
          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-2xs">
            {sent ? (
              <div className="py-16 text-center space-y-3">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-100 text-emerald-800">
                  <Check className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-2xl text-[#241814]">Message Received</h3>
                <p className="text-xs sm:text-sm text-stone-600 max-w-sm mx-auto">
                  Thank you for reaching out. A culinary concierge from our kitchen will connect with you shortly.
                </p>
              </div>
            ) : (
              <form
                className="space-y-4 text-xs"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                <div>
                  <label htmlFor="name" className="block font-medium text-stone-700 mb-1">
                    Your Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    placeholder="e.g. Radhika Rao"
                    className="w-full rounded-lg border border-stone-200 bg-stone-50/50 px-3.5 py-2.5 text-xs text-stone-900 placeholder:text-stone-400 focus:border-stone-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block font-medium text-stone-700 mb-1">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="radhika@example.com"
                      className="w-full rounded-lg border border-stone-200 bg-stone-50/50 px-3.5 py-2.5 text-xs text-stone-900 placeholder:text-stone-400 focus:border-stone-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block font-medium text-stone-700 mb-1">
                      Subject
                    </label>
                    <input
                      id="subject"
                      type="text"
                      required
                      placeholder="e.g. Bulk Wedding Order"
                      className="w-full rounded-lg border border-stone-200 bg-stone-50/50 px-3.5 py-2.5 text-xs text-stone-900 placeholder:text-stone-400 focus:border-stone-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block font-medium text-stone-700 mb-1">
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    required
                    placeholder="Tell us what you have in mind..."
                    className="w-full rounded-lg border border-stone-200 bg-stone-50/50 p-3.5 text-xs text-stone-900 placeholder:text-stone-400 focus:border-stone-400 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-[#241814] px-6 py-2.5 text-xs font-medium text-white hover:bg-stone-800 active:scale-98 transition-all cursor-pointer shadow-xs"
                >
                  <Send className="h-3.5 w-3.5" /> Send Message
                </button>
              </form>
            )}
          </div>

          {/* Right Column: FAQs & Kitchen Location */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-2xs">
              <h3 className="font-serif text-xl text-[#241814] mb-3">Frequently Asked</h3>
              <dl className="divide-y divide-stone-100 font-sans text-xs">
                {faqs.map(([q, a]) => (
                  <div key={q} className="py-3">
                    <dt className="font-semibold text-stone-800">{q}</dt>
                    <dd className="mt-1 text-stone-600 leading-relaxed font-normal">{a}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <address className="rounded-2xl bg-[#241814] p-6 not-italic text-[#FAF7F2] font-sans border border-[#3D2B23]">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#E6C687] flex items-center gap-1.5 mb-2">
                <MapPin className="h-3.5 w-3.5" /> Kitchen &amp; Packaging Facility
              </p>
              <p className="text-xs text-stone-300 leading-relaxed">
                Atreyapuram, East Godavari District,
                <br />
                Andhra Pradesh 533235, India
              </p>
              <div className="mt-4 pt-3 border-t border-stone-700/60 flex flex-wrap gap-4 text-xs">
                <a
                  href="mailto:hello@9stories.co"
                  className="inline-flex items-center gap-1.5 text-stone-300 hover:text-[#E6C687] transition-colors"
                >
                  <Mail className="h-3.5 w-3.5" /> hello@9stories.co
                </a>
                <a
                  href="tel:+919849000000"
                  className="inline-flex items-center gap-1.5 text-stone-300 hover:text-[#E6C687] transition-colors"
                >
                  <Phone className="h-3.5 w-3.5" /> +91 98490 00000
                </a>
              </div>
            </address>
          </div>
        </div>
      </div>
    </div>
  );
}
