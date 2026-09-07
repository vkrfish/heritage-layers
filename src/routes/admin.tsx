import { createFileRoute, Outlet, Link, useNavigate, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, Package, ShoppingCart, Tag, Megaphone, ExternalLink, LogOut, Shield } from "lucide-react";
import * as React from "react";

import { useAdminStore } from "@/lib/admin-store.tsx";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { isAuthenticated, logout } = useAdminStore();
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (!isAuthenticated && location.pathname !== "/admin/login") {
      navigate({ to: "/admin/login" });
    }
  }, [isAuthenticated, location.pathname, navigate]);

  if (!isAuthenticated && location.pathname !== "/admin/login") {
    return null;
  }

  // If on login route, render login child
  if (location.pathname === "/admin/login") {
    return <Outlet />;
  }

  const navItems = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { to: "/admin/products", label: "Products (CRUD)", icon: Package },
    { to: "/admin/orders", label: "Orders Management", icon: ShoppingCart },
    { to: "/admin/discounts", label: "Promo Codes", icon: Tag },
    { to: "/admin/announcements", label: "Announcements", icon: Megaphone },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* ADMIN SIDEBAR */}
      <aside className="w-full md:w-64 bg-primary text-on-dark flex-shrink-0 border-r border-gold/20 flex flex-col justify-between p-4 md:p-6">
        <div>
          {/* Header & Logo */}
          <div className="flex items-center gap-3 pb-6 border-b border-gold/20">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-cream text-primary font-display text-lg font-bold">
              9
            </span>
            <div>
              <span className="block font-display text-lg font-bold text-on-dark leading-none">
                9 Stories Admin
              </span>
              <span className="eyebrow text-[10px] text-gold mt-1 block">
                Store Control Center
              </span>
            </div>
          </div>

          {/* Nav Items */}
          <nav aria-label="Admin Navigation" className="mt-6 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? location.pathname === item.to
                : location.pathname.startsWith(item.to);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-200",
                    isActive
                      ? "bg-accent text-accent-foreground shadow-sm"
                      : "text-on-dark-muted hover:bg-teal-soft/30 hover:text-on-dark",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-6 border-t border-gold/20 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-2 rounded-xl bg-teal-soft/20 px-3.5 py-2 text-xs font-medium text-gold hover:bg-teal-soft/40 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" /> View Live Storefront
          </Link>
          <button
            onClick={() => {
              logout();
              navigate({ to: "/admin/login" });
            }}
            className="flex w-full items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10">
        <Outlet />
      </main>
    </div>
  );
}
