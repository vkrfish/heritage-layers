import { Link, useNavigate } from "@tanstack/react-router";
import { Search, User, Heart, ShoppingBag, Menu, X, Sparkles, Home, Package } from "lucide-react";
import * as React from "react";

import { useCart } from "@/components/cart";
import { useAdminStore } from "@/lib/admin-store.tsx";
import { useCustomerAuth } from "@/lib/customer-auth.tsx";
import { IconButton } from "@/components/ui-kit";
import { formatPrice, products } from "@/lib/products";
import { cn } from "@/lib/utils";
import logoFull from "@/assets/logo-full.png";

const links = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Products" },
  { to: "/our-story", label: "Our Story" },
  { to: "/the-craft", label: "The Craft" },
  { to: "/gifting", label: "Gifting" },
  { to: "/contact", label: "Contact" },
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
    <div className="bg-brown text-cream px-3 py-1.5 text-center font-sans text-xs font-bold tracking-wider overflow-hidden border-b border-gold/30">
      <div className="flex items-center justify-center gap-2 transition-all duration-500">
        <Sparkles className="h-3 w-3 text-gold shrink-0 animate-pulse" />
        <span className="truncate uppercase text-[11px] sm:text-xs">{list[index % list.length]}</span>
        <Sparkles className="h-3 w-3 text-gold shrink-0 animate-pulse" />
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
  const { user, wishlist, setIsWishlistOpen, openAuthModal } = useCustomerAuth();
  const navigate = useNavigate();

  const handleAccountClick = () => {
    if (user) {
      navigate({ to: "/account" });
    } else {
      openAuthModal({ mode: "signin" });
    }
  };

  const productList = dynamicProducts && dynamicProducts.length > 0 ? dynamicProducts : products;

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
    <>
      <header className="sticky top-0 z-40 bg-cream">
        <MarqueeBanner />
        <div
          className={cn(
            "border-b border-brown/15 bg-cream transition-all duration-300 px-3 py-2 sm:px-6 lg:px-10",
            scrolled ? "shadow-flat" : "",
          )}
        >
          {/* Mobile Top Row (< 768px): Hamburger (Left) - Logo (Center) - Icons (Right) */}
          <div className="flex items-center justify-between gap-2 lg:hidden h-12">
            {/* Left: Hamburger */}
            <button
              aria-label="Open navigation menu"
              onClick={() => setMenuOpen(true)}
              className="grid h-10 w-10 place-items-center text-brown hover:text-terracotta cursor-pointer"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Center: Logo */}
            <Link to="/" className="flex items-center justify-center shrink-0">
              <img
                src={logoFull}
                alt="9 Stories & Co. — The Essence For Every Occasion"
                className="h-8 sm:h-10 w-auto object-contain mix-blend-multiply"
              />
            </Link>

            {/* Right: Icons */}
            <div className="flex items-center gap-1">
              <button
                aria-label="Wishlist"
                onClick={() => setIsWishlistOpen(true)}
                className="relative grid h-9 w-9 place-items-center text-brown hover:text-terracotta cursor-pointer"
              >
                <Heart className="h-5 w-5" />
                {wishlist.length > 0 && (
                  <span className="absolute top-0 right-0 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 font-sans text-[10px] font-bold text-brown">
                    {wishlist.length}
                  </span>
                )}
              </button>

              <button
                aria-label="Account"
                onClick={handleAccountClick}
                className="grid h-9 w-9 place-items-center text-brown hover:text-terracotta cursor-pointer"
              >
                <User className="h-5 w-5" />
              </button>

              <button
                aria-label="Cart"
                onClick={() => setOpen(true)}
                className="relative grid h-9 w-9 place-items-center text-brown hover:text-terracotta cursor-pointer"
              >
                <ShoppingBag className="h-5 w-5" />
                {count > 0 && (
                  <span className="absolute top-0 right-0 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 font-sans text-[10px] font-bold text-brown">
                    {count}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Second Row (< 768px): Pill Search Bar */}
          <div className="mt-1 pb-1 lg:hidden">
            <div className="relative flex items-center w-full">
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setSearchOpen(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="A2 Ghee, Putharekulu, and Fresh Sweets...."
                className="w-full h-10 rounded-full border border-brown/20 bg-cream-light pl-4 pr-10 font-sans text-xs font-bold text-brown placeholder:text-brown/50 focus:border-terracotta focus:outline-none"
              />
              <Search className="absolute right-3.5 h-4 w-4 text-brown/60 pointer-events-none" />
            </div>

            {/* Mobile Search Results Overlay */}
            {searchOpen && searchQuery.trim() !== "" && (
              <div className="absolute left-3 right-3 top-full mt-1 rounded-xl border border-brown/20 bg-cream p-3 shadow-lift z-50 max-h-64 overflow-y-auto">
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-brown/15">
                  <span className="font-sans text-xs font-bold text-brown">Search Results</span>
                  <button onClick={() => setSearchOpen(false)} className="text-brown/60 hover:text-brown">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                {searchResults.length > 0 ? (
                  <div className="space-y-2">
                    {searchResults.map((item) => (
                      <Link
                        key={item.slug}
                        to="/shop/$slug"
                        params={{ slug: item.slug }}
                        onClick={() => setSearchOpen(false)}
                        className="flex items-center gap-3 rounded-lg p-2 hover:bg-cream-light"
                      >
                        <img src={item.image} alt={item.name} className="h-10 w-10 rounded object-cover border border-brown/15" />
                        <div>
                          <p className="font-display text-base text-brown">{item.name}</p>
                          <p className="font-sans text-xs font-bold text-terracotta">{formatPrice(item.weights[0]?.price ?? 0)}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="font-sans text-xs text-center text-brown/60 py-3">No matching products found.</p>
                )}
              </div>
            )}
          </div>

          {/* Desktop Navigation Layout (lg:flex) — Untouched desktop design */}
          <nav
            aria-label="Primary Desktop"
            className={cn(
              "hidden lg:flex mx-auto max-w-[1400px] items-center justify-between gap-6 transition-all duration-300",
              scrolled ? "h-16" : "h-20",
            )}
          >
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group shrink-0">
              <img
                src={logoFull}
                alt="9 Stories & Co. — The Essence For Every Occasion"
                className={cn(
                  "object-contain mix-blend-multiply transition-all duration-300",
                  scrolled ? "h-10" : "h-13",
                )}
              />
            </Link>

            {/* Desktop Nav Links */}
            <ul className="flex items-center gap-8">
              {links.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="relative font-sans text-lg font-bold tracking-wide text-brown transition-colors duration-200 hover:text-terracotta py-1 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-terracotta after:transition-all after:duration-200 hover:after:w-full"
                    activeProps={{ className: "text-brown font-bold after:w-full" }}
                    activeOptions={{ exact: l.to === "/" }}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Desktop Icons */}
            <div className="flex items-center gap-1.5 relative">
              <IconButton label="Search" onClick={() => setSearchOpen((v) => !v)}>
                <Search className="h-5 w-5 text-brown" />
              </IconButton>
              <IconButton label="Account" onClick={handleAccountClick}>
                <User className="h-5 w-5 text-brown" />
              </IconButton>
              <IconButton label="Wishlist" onClick={() => setIsWishlistOpen(true)} className="relative">
                <Heart className="h-5 w-5 text-brown" />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 font-sans text-[10px] font-bold text-brown shadow-sm">
                    {wishlist.length}
                  </span>
                )}
              </IconButton>
              <IconButton label="Cart" onClick={() => setOpen(true)} className="relative">
                <ShoppingBag className="h-5 w-5 text-brown" />
                {count > 0 ? (
                  <span className="absolute top-1 right-1 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 font-sans text-xs font-bold text-brown shadow-sm">
                    {count}
                  </span>
                ) : null}
              </IconButton>

              {/* Desktop Live Search Overlay */}
              {searchOpen && (
                <div className="absolute right-0 top-full mt-2 w-96 rounded-xl border border-brown/20 bg-cream p-4 shadow-lift z-50">
                  <div className="flex items-center justify-between mb-3">
                    <input
                      type="text"
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search sweets, murukku, podi..."
                      className="w-full rounded-lg border border-brown/30 bg-cream-light py-2 px-3 font-sans text-base font-bold text-brown placeholder:text-brown/50 focus:border-terracotta focus:outline-none"
                    />
                    <button onClick={() => setSearchOpen(false)} className="ml-2 text-brown/70 hover:text-brown">
                      <X className="h-5 w-5" />
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
                            className="flex items-center gap-3 rounded-lg p-2 hover:bg-cream-light transition-colors"
                          >
                            <img src={item.image} alt={item.name} className="h-10 w-10 rounded-md object-cover border border-brown/20" />
                            <div>
                              <p className="font-display text-lg font-normal text-brown">{item.name}</p>
                              <p className="font-sans text-sm font-bold text-terracotta">{formatPrice(item.weights[0]?.price ?? 0)}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="font-sans text-sm text-center text-brown/60 py-4">No matching products found.</p>
                    )
                  ) : (
                    <div className="font-sans text-xs text-brown/70">
                      <p className="font-bold text-brown mb-1 text-sm">Popular Searches:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {["Ghee Putharekulu", "Jaggery Sweet", "Butter Murukku", "Kandi Podi"].map((tag) => (
                          <button
                            key={tag}
                            onClick={() => setSearchQuery(tag)}
                            className="rounded-full bg-cream-light px-3 py-1 font-sans text-xs font-bold text-brown hover:bg-gold hover:text-brown transition-colors cursor-pointer"
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
        </div>
      </header>

      {/* Slide-in Mobile Drawer Navigation */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-brown/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-[80%] max-w-[320px] h-full bg-cream p-5 shadow-lift border-r border-brown/20 flex flex-col justify-between animate-in slide-in-from-left">
            <div>
              <div className="flex items-center justify-between border-b border-brown/15 pb-4">
                <img src={logoFull} alt="9 Stories & Co." className="h-8 w-auto mix-blend-multiply" />
                <button
                  onClick={() => setMenuOpen(false)}
                  className="grid h-9 w-9 place-items-center rounded-full text-brown hover:bg-cream-light"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <ul className="mt-4 space-y-1 font-sans">
                {links.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      onClick={() => setMenuOpen(false)}
                      className="flex min-h-11 items-center rounded-lg px-3 text-base font-bold text-brown hover:bg-cream-light hover:text-terracotta"
                      activeProps={{ className: "bg-terracotta/15 text-terracotta" }}
                      activeOptions={{ exact: l.to === "/" }}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-brown/15 pt-4 font-sans text-xs font-bold text-brown/70 space-y-2">
              <p>Handcrafted Andhra Sweets</p>
              <p className="text-[11px] text-terracotta">Atreyapuram, Andhra Pradesh</p>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Mobile Bottom Navigation Bar (< 768px) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 h-[60px] bg-brown text-cream flex items-center justify-around border-t border-gold/30 shadow-lift lg:hidden">
        <Link
          to="/"
          className="flex flex-col items-center justify-center gap-0.5 text-cream hover:text-gold"
          activeProps={{ className: "text-gold font-bold" }}
          activeOptions={{ exact: true }}
        >
          <Home className="h-5 w-5" />
          <span className="font-sans text-[11px] font-bold uppercase tracking-wide">Home</span>
        </Link>

        <Link
          to="/shop"
          className="flex flex-col items-center justify-center gap-0.5 text-cream hover:text-gold"
          activeProps={{ className: "text-gold font-bold" }}
        >
          <Package className="h-5 w-5" />
          <span className="font-sans text-[11px] font-bold uppercase tracking-wide">Shop</span>
        </Link>

        <button
          onClick={() => setOpen(true)}
          className="relative flex flex-col items-center justify-center gap-0.5 text-cream hover:text-gold cursor-pointer"
        >
          <ShoppingBag className="h-5 w-5" />
          {count > 0 && (
            <span className="absolute -top-1 right-2 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 font-sans text-[10px] font-bold text-brown">
              {count}
            </span>
          )}
          <span className="font-sans text-[11px] font-bold uppercase tracking-wide">Cart</span>
        </button>

        <button
          type="button"
          onClick={handleAccountClick}
          className="flex flex-col items-center justify-center gap-0.5 text-cream hover:text-gold cursor-pointer"
        >
          <User className="h-5 w-5" />
          <span className="font-sans text-[11px] font-bold uppercase tracking-wide">Account</span>
        </button>
      </div>
    </>
  );
}
