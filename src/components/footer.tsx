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
    <section className="bg-[#1B120E] px-5 py-14 lg:px-10 lg:py-20 border-b border-white/[0.08] text-[#FAF7F2]">
      <div className="mx-auto grid max-w-3xl gap-4 text-center">
        <div>
          <Eyebrow tone="gold">Artisan Dispatch</Eyebrow>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-normal text-[#FAF7F2] tracking-tight">Stay Close to the Story</h2>
          <p className="mx-auto mt-2 max-w-lg font-sans text-sm font-normal text-[#FAF7F2]/70 leading-relaxed">
            Seasonal batches, festive gift hampers, and notes on Godavari culinary heritage.
          </p>
        </div>
        <form
          className="mx-auto flex w-full max-w-md flex-col gap-2.5 sm:flex-row mt-3"
          onSubmit={(e) => e.preventDefault()}
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Your email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            placeholder="Enter your email"
            className="h-10 min-w-0 flex-1 rounded-md border border-white/15 bg-white/[0.05] px-3.5 font-sans text-xs font-normal text-[#FAF7F2] placeholder:text-[#FAF7F2]/40 focus:border-gold focus:outline-none"
          />
          <Button type="submit" size="md" variant="accent" className="bg-[#C88A36] hover:bg-[#B4782B] text-white">
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#1B120E] px-5 py-12 lg:px-10 text-[#FAF7F2]">
      <div className="mx-auto max-w-[1200px]">
        <div className="grid gap-8 lg:grid-cols-[1.5fr_repeat(4,1fr)] pb-10">
          <div className="max-w-xs space-y-2.5">
            <div className="flex items-center gap-2.5">
              <img
                src={logoFull}
                alt="9 Stories & Co."
                className="h-10 w-auto object-contain brightness-200 invert-[0.1]"
              />
            </div>
            <p className="font-sans text-xs font-normal leading-relaxed text-[#FAF7F2]/70">
              Authentic handcrafted Putharekulu from Andhra Pradesh — made daily in small batches,
              delivered fresh across India.
            </p>
          </div>

          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <p className="font-sans text-xs font-medium uppercase tracking-[0.14em] text-gold/90">{col.title}</p>
              <ul className="mt-3 space-y-2">
                {col.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="font-sans text-xs font-normal text-[#FAF7F2]/70 transition-colors duration-150 hover:text-[#FAF7F2]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <p className="font-sans text-xs font-medium uppercase tracking-[0.14em] text-gold/90">Social</p>
            <ul className="mt-3 space-y-2">
              {["Instagram", "Facebook", "YouTube"].map((s) => (
                <li key={s}>
                  <a
                    href="#"
                    className="font-sans text-xs font-normal text-[#FAF7F2]/70 transition-colors duration-150 hover:text-[#FAF7F2]"
                  >
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/[0.08] pt-6 font-sans text-xs font-normal text-[#FAF7F2]/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} 9 Stories &amp; Co. All rights reserved.</p>
          <p>Made in Atreyapuram, Andhra Pradesh, India.</p>
        </div>
      </div>
    </footer>
  );
}
