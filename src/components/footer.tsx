import { Link } from "@tanstack/react-router";

import { Button, Eyebrow } from "@/components/ui-kit";

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
    <section className="bg-primary px-5 py-20 lg:px-10 lg:py-28">
      <div className="mx-auto grid max-w-4xl gap-8 text-center">
        <div>
          <Eyebrow tone="gold">Newsletter</Eyebrow>
          <h2 className="mt-4 text-4xl text-on-dark sm:text-5xl">Stay Close to the Story</h2>
          <p className="mx-auto mt-4 max-w-xl text-on-dark-muted">
            Discover new creations, festive collections and stories from our kitchen.
          </p>
        </div>
        <form
          className="mx-auto flex w-full max-w-lg flex-col gap-3 sm:flex-row"
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
            className="h-12 min-w-0 flex-1 rounded-[10px] border border-on-dark-muted/40 bg-transparent px-4 text-sm text-on-dark placeholder:text-on-dark-muted/70 focus:border-aqua focus:outline-none"
          />
          <Button type="submit" size="lg">
            Join the Story
          </Button>
        </form>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-primary px-5 pb-10 lg:px-10">
      <div className="mx-auto max-w-[1400px]">
        <div className="h-px w-full bg-aqua/30" />
        <div className="grid gap-12 py-16 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="max-w-xs">
            <p className="font-display text-2xl text-on-dark">9 Stories &amp; Co.</p>
            <p className="mt-4 text-sm leading-relaxed text-on-dark-muted">
              Authentic handcrafted Putharekulu from Andhra Pradesh — made in small batches,
              delivered with care.
            </p>
          </div>

          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="eyebrow text-on-dark">{col.title}</p>
              <ul className="mt-5 space-y-3">
                {col.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="text-sm text-on-dark-muted transition-colors duration-200 hover:text-accent"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <p className="eyebrow text-on-dark">Social</p>
            <ul className="mt-5 space-y-3">
              {["Instagram", "Facebook", "YouTube"].map((s) => (
                <li key={s}>
                  <a
                    href="#"
                    className="text-sm text-on-dark-muted transition-colors duration-200 hover:text-accent"
                  >
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-on-dark-muted/20 pt-6 text-xs text-on-dark-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} 9 Stories &amp; Co. All rights reserved.</p>
          <p>Made in Andhra Pradesh, India.</p>
        </div>
      </div>
    </footer>
  );
}
