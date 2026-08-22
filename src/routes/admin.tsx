import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Package,
  ReceiptText,
  Users,
  FileText,
  Images,
  Ticket,
  Star,
  Settings as SettingsIcon,
  ExternalLink,
  Bell,
  Search,
} from "lucide-react";
import * as React from "react";

import { AdminProvider } from "@/components/admin/admin-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Console — 9 Stories & Co." },
      {
        name: "description",
        content:
          "Internal console for managing products, orders, customers, content and settings for 9 Stories & Co.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin Console — 9 Stories & Co." },
      {
        property: "og:description",
        content: "Manage the 9 Stories & Co. storefront: catalogue, orders, content and settings.",
      },
    ],
  }),
  component: AdminLayout,
});

type NavItem = {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
};

const nav: NavItem[] = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ReceiptText },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/content", label: "Content", icon: FileText },
  { to: "/admin/media", label: "Media", icon: Images },
  { to: "/admin/discounts", label: "Discounts", icon: Ticket },
  { to: "/admin/reviews", label: "Reviews", icon: Star },
  { to: "/admin/settings", label: "Settings", icon: SettingsIcon },
];

function AdminLayout() {
  const [open, setOpen] = React.useState(false);

  return (
    <AdminProvider>
      <div className="min-h-screen bg-background lg:grid lg:grid-cols-[260px_1fr]">
        <aside
          className={cn(
            "border-r border-primary/20 bg-primary text-on-dark lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto",
            open ? "block" : "hidden lg:block",
          )}
        >
          <div className="flex items-center gap-3 px-6 py-6">
            <span
              aria-hidden="true"
              className="grid h-9 w-9 place-items-center rounded-full border border-gold/70 font-display text-base text-gold"
            >
              9
            </span>
            <div>
              <p className="font-display text-lg leading-none">9 Stories &amp; Co.</p>
              <p className="eyebrow mt-1 text-[0.5625rem] text-on-dark-muted">Admin console</p>
            </div>
          </div>

          <nav aria-label="Admin" className="px-3 pb-6">
            <ul className="space-y-1">
              {nav.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to as "/admin"}
                    activeOptions={{ exact: item.exact ?? false }}
                    onClick={() => setOpen(false)}
                    className="flex min-h-11 items-center gap-3 rounded-[10px] px-3 text-sm text-on-dark-muted transition-colors hover:bg-cream/10 hover:text-on-dark"
                    activeProps={{ className: "bg-cream/12 text-on-dark" }}
                  >
                    <item.icon className="h-[18px] w-[18px]" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              to="/"
              className="mt-6 flex min-h-11 items-center gap-2 rounded-[10px] border border-cream/20 px-3 text-xs tracking-wide text-on-dark-muted transition-colors hover:border-accent hover:text-accent"
            >
              <ExternalLink className="h-4 w-4" /> View storefront
            </Link>
          </nav>
        </aside>

        <div className="flex min-w-0 flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-cream/95 px-5 backdrop-blur lg:px-8">
            <button
              onClick={() => setOpen((v) => !v)}
              className="rounded-[10px] border border-border px-3 py-2 text-xs tracking-wide text-primary lg:hidden"
            >
              Menu
            </button>
            <div className="relative hidden max-w-sm flex-1 md:block">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search orders, products, customers"
                className="w-full rounded-[10px] border border-input bg-card py-2.5 pr-3 pl-9 text-sm focus:border-accent focus:outline-none"
              />
            </div>
            <div className="ml-auto flex items-center gap-3">
              <button
                aria-label="Notifications"
                className="relative grid h-10 w-10 place-items-center rounded-full text-primary hover:bg-secondary"
              >
                <Bell className="h-[18px] w-[18px]" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-accent" />
              </button>
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-xs font-medium text-on-dark">
                  SR
                </span>
                <span className="hidden text-xs sm:block">
                  <span className="block text-foreground">Sai Rao</span>
                  <span className="block text-muted-foreground">Owner</span>
                </span>
              </div>
            </div>
          </header>

          <div className="min-w-0 flex-1 space-y-6 px-5 py-8 lg:px-8">
            <Outlet />
          </div>
        </div>
      </div>
    </AdminProvider>
  );
}
