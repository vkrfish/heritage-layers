import { Link } from "@tanstack/react-router";
import { Search, User, Heart, ShoppingBag, Menu, X, Sparkles } from "lucide-react";
import * as React from "react";

import { useCart } from "@/components/cart";
import { useAdminStore } from "@/lib/admin-store.tsx";
import { IconButton } from "@/components/ui-kit";
import { formatPrice, products } from "@/lib/products";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/our-story", label: "Our Story" },
  { to: "/the-craft", label: "The Craft" },
  { to: "/gifting", label: "Gifting" },
  { to: "/journal", label: "Journal" },
] as const;

export function MarqueeBanner() {
  const { announcements } = useAdminStore();
  const list = announcements && announcements.length > 0
    ? announcements
    : ["Handcrafted Andhra Putharekulu • Made Fresh • Delivered With Care"];
  
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % list.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [list.length]);

  return (
    <div className="bg-primary text-on-dark px-4 py-2 text-center text-xs font-medium tracking-wide overflow-hidden border-b border-gold/20">
      <div className="flex items-center justify-center gap-2 transition-all duration-500">
        <Sparkles className="h-3.5 w-3.5 text-gold shrink-0 animate-pulse" />
        <span className="truncate">{list[index % list.length]}</span>
        <Sparkles className="h-3.5 w-3.5 text-gold shrink-0 animate-pulse" />
      </div>
    </div>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const { count, setOpen } = useCart();
  const { products: dynamicProducts } = useAdminStore();

  const productList = dynamicProducts || products;

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const searchResults = searchQuery.trim()
    ? productList.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="sticky top-0 z-40">
      <MarqueeBanner />
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
          {/* Logo */}
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
                Handcrafted Sweets
              </span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
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

          {/* Icons & Actions */}
          <div className="flex items-center justify-end gap-1 relative">
            <IconButton label="Search" onClick={() => setSearchOpen((v) => !v)}>
              <Search className="h-[18px] w-[18px]" />
            </IconButton>
            <IconButton label="Account" className="hidden sm:grid">
              <User className="h-[18px] w-[18px]" />
            </IconButton>
            <IconButton label="Wishlist" className="hidden sm:grid">
              <Heart className="h-[18px] w-[18px]" />
            </IconButton>
            <IconButton label="Cart" onClick={() => setOpen(true)} className="relative">
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

            {/* Live Search Overlay */}
            {searchOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-xl border border-border bg-cream p-4 shadow-lift z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between mb-3">
                  <input
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search sweets, murukku, podi..."
                    className="w-full rounded-lg border border-border bg-card py-2 px-3 text-xs text-primary placeholder:text-muted-foreground focus:border-accent focus:outline-none"
                  />
                  <button onClick={() => setSearchOpen(false)} className="ml-2 text-muted-foreground hover:text-primary">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {searchQuery.trim() !== "" ? (
                  searchResults.length > 0 ? (
                    <div className="max-h-64 overflow-y-auto space-y-2">
                      {searchResults.map((item) => (
                        <Link
                          key={item.slug}
                          to="/shop/$slug"
                          params={{ slug: item.slug }}
                          onClick={() => setSearchOpen(false)}
                          className="flex items-center gap-3 rounded-lg p-2 hover:bg-parchment transition-colors"
                        >
                          <img src={item.image} alt={item.name} className="h-10 w-10 rounded-md object-cover border border-border" />
                          <div>
                            <p className="text-xs font-semibold text-primary">{item.name}</p>
                            <p className="text-[11px] text-accent">{formatPrice(item.weights[0].price)}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-center text-muted-foreground py-4">No matching products found.</p>
                  )
                ) : (
                  <div className="text-[11px] text-muted-foreground">
                    <p className="font-semibold text-primary mb-1 font-display text-xs">Popular Searches:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {["Ghee Putharekulu", "Jaggery Sweet", "Butter Murukku", "Kandi Podi"].map((tag) => (
                        <button
                          key={tag}
                          onClick={() => setSearchQuery(tag)}
                          className="rounded-full bg-parchment px-2.5 py-1 text-xs text-primary hover:bg-accent hover:text-accent-foreground"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Nav Menu */}
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
