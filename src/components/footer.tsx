import { Link } from "@tanstack/react-router";
import { Button, Eyebrow } from "@/components/ui-kit";
import logoFull from "@/assets/logo-full.png";

const columns = [
  {
    title: "Shop",
    items: [
      { label: "All Products", to: "/shop" },
      { label: "Putharekulu", to: "/shop" },
      { label: "Gift Boxes", to: "/gifting" },
      { label: "Festive Collections", to: "/gifting" },
    ],
  },
  {
    title: "About",
    items: [
      { label: "Our Story", to: "/our-story" },
      { label: "The Craft", to: "/the-craft" },
      { label: "Journal", to: "/journal" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    title: "Help",
    items: [
      { label: "Shipping", to: "/contact" },
      { label: "Returns", to: "/contact" },
      { label: "FAQs", to: "/contact" },
      { label: "Privacy", to: "/contact" },
    ],
  },
] as const;

export function Newsletter() {
  return (
    <section className="bg-brown px-5 py-16 lg:px-10 lg:py-24 border-b border-cream/15">
      <div className="mx-auto grid max-w-4xl gap-6 text-center">
        <div>
          <Eyebrow tone="gold">Newsletter</Eyebrow>
          <h2 className="mt-3 font-display text-3xl sm:text-5xl font-normal text-cream">Stay Close to the Story</h2>
          <p className="mx-auto mt-3 max-w-xl font-sans text-base font-bold text-cream/80">
            Discover new creations, festive collections and stories from our kitchen.
          </p>
        </div>
        <form
          className="mx-auto flex w-full max-w-lg flex-col gap-3 sm:flex-row mt-2"
          onSubmit={(e) => e.preventDefault()}
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Your email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            placeholder="Your email address"
            className="h-12 min-w-0 flex-1 rounded-lg border border-cream/30 bg-brown/50 px-4 font-sans text-base font-bold text-cream placeholder:text-cream/50 focus:border-gold focus:outline-none"
          />
          <Button type="submit" size="lg" variant="accent" className="bg-terracotta hover:bg-gold hover:text-brown text-white">
            Join the Story
          </Button>
        </form>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-brown px-5 py-12 lg:px-10 text-cream">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_repeat(4,1fr)] pb-12">
          <div className="max-w-xs space-y-3">
            <div className="flex items-center gap-2.5">
              <img
                src={logoFull}
                alt="9 Stories & Co."
                className="h-12 w-auto object-contain brightness-200 invert-[0.1]"
              />
            </div>
            <p className="font-sans text-sm font-bold leading-relaxed text-cream/80">
              Authentic handcrafted Putharekulu from Andhra Pradesh — made in small batches,
              delivered with care.
            </p>
          </div>

          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="font-sans text-sm font-bold uppercase tracking-[0.2em] text-gold">{col.title}</p>
              <ul className="mt-4 space-y-2.5">
                {col.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="font-sans text-base font-bold text-cream/80 transition-colors duration-200 hover:text-gold"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <p className="font-sans text-sm font-bold uppercase tracking-[0.2em] text-gold">Social</p>
            <ul className="mt-4 space-y-2.5">
              {["Instagram", "Facebook", "YouTube"].map((s) => (
                <li key={s}>
                  <a
                    href="#"
                    className="font-sans text-base font-bold text-cream/80 transition-colors duration-200 hover:text-gold"
                  >
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-cream/15 pt-6 font-sans text-xs font-bold text-cream/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} 9 Stories &amp; Co. All rights reserved.</p>
          <p>Made in Atreyapuram, Andhra Pradesh, India.</p>
        </div>
      </div>
    </footer>
  );
}
