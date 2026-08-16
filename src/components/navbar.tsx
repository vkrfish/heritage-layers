import { Link } from "@tanstack/react-router";
import { Search, User, Heart, ShoppingBag, Menu, X } from "lucide-react";
import * as React from "react";

import { useCart } from "@/components/cart";
import { IconButton } from "@/components/ui-kit";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/our-story", label: "Our Story" },
  { to: "/the-craft", label: "The Craft" },
  { to: "/gifting", label: "Gifting" },
  { to: "/journal", label: "Journal" },
] as const;

export function AnnouncementBar() {
  return (
    <div className="bg-primary text-center">
      <p className="eyebrow px-4 py-2.5 text-on-dark-muted">
        Handcrafted Andhra Putharekulu <span className="text-accent">•</span> Made Fresh{" "}
        <span className="text-accent">•</span> Delivered With Care
      </p>
    </div>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { count, setOpen } = useCart();

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40">
      <AnnouncementBar />
      <div
        className={cn(
          "border-b border-border/70 transition-all duration-300",
          scrolled ? "bg-cream/95 shadow-soft backdrop-blur" : "bg-cream",
        )}
      >
        <nav
          aria-label="Primary"
          className={cn(
            "mx-auto grid max-w-[1400px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 transition-all duration-300 lg:grid-cols-[1fr_auto_1fr] lg:px-10",
            scrolled ? "h-16" : "h-20",
          )}
        >
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <span
              aria-hidden="true"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gold/70 font-display text-base text-accent"
            >
              9
            </span>
            <span className="min-w-0">
              <span className="block truncate font-display text-lg leading-none text-primary sm:text-xl">
                9 Stories &amp; Co.
              </span>
              <span className="eyebrow hidden text-[0.5625rem] text-muted-foreground sm:block">
                Andhra Putharekulu
              </span>
            </span>
          </Link>

          <ul className="hidden items-center gap-8 lg:flex">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="relative text-[0.8125rem] tracking-wide text-primary transition-colors duration-200 hover:text-accent after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-accent after:transition-all after:duration-200 hover:after:w-full"
                  activeProps={{ className: "text-accent after:w-full" }}
                  activeOptions={{ exact: l.to === "/" }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-end gap-0.5">
            <IconButton label="Search" className="hidden sm:grid">
              <Search className="h-[18px] w-[18px]" />
            </IconButton>
            <IconButton label="Account" className="hidden sm:grid">
              <User className="h-[18px] w-[18px]" />
            </IconButton>
            <IconButton label="Wishlist" className="hidden sm:grid">
              <Heart className="h-[18px] w-[18px]" />
            </IconButton>
            <IconButton label="Cart" onClick={() => setOpen(true)}>
              <ShoppingBag className="h-[18px] w-[18px]" />
              {count > 0 ? (
                <span className="absolute top-1 right-1 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[0.625rem] font-medium text-accent-foreground">
                  {count}
                </span>
              ) : null}
            </IconButton>
            <IconButton
              label={menuOpen ? "Close menu" : "Open menu"}
              className="lg:hidden"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </IconButton>
          </div>
        </nav>

        {menuOpen ? (
          <ul className="border-t border-border bg-cream px-5 pb-4 lg:hidden">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-12 items-center border-b border-border/60 text-sm text-primary"
                  activeProps={{ className: "text-accent" }}
                  activeOptions={{ exact: l.to === "/" }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </header>
  );
}
