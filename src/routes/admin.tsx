import { createFileRoute, Outlet, Link, useNavigate, useLocation } from "@tanstack/react-router";
import { LayoutDashboard, Package, ShoppingCart, Tag, Megaphone, ExternalLink, LogOut } from "lucide-react";
import * as React from "react";
import logoFull from "@/assets/logo-full.png";

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
    <div className="min-h-screen bg-cream flex flex-col md:flex-row font-sans">
      {/* ADMIN SIDEBAR */}
      <aside className="w-full md:w-64 bg-brown text-cream flex-shrink-0 border-r border-gold/30 flex flex-col justify-between p-4 md:p-6">
        <div>
          {/* Header & Logo */}
          <div className="pb-6 border-b border-gold/30">
            <img
              src={logoFull}
              alt="Stories Admin"
              className="h-10 w-auto object-contain brightness-200 invert-[0.1]"
            />
            <span className="eyebrow text-xs text-gold mt-2 block">
              Store Control Center
            </span>
          </div>

          {/* Nav Items */}
          <nav aria-label="Admin Navigation" className="mt-6 space-y-1.5 font-sans">
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
                    "flex items-center gap-3 rounded-lg px-3.5 py-2.5 font-sans text-sm font-bold transition-all duration-200",
                    isActive
                      ? "bg-terracotta text-white shadow-flat"
                      : "text-cream/80 hover:bg-brown/80 hover:text-gold",
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
        <div className="pt-6 border-t border-gold/30 space-y-2 font-sans font-bold">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-2 rounded-lg bg-gold/20 px-3.5 py-2 text-xs text-gold hover:bg-gold hover:text-brown transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" /> View Live Storefront
          </Link>
          <button
            onClick={() => {
              logout();
              navigate({ to: "/admin/login" });
            }}
            className="flex w-full items-center gap-2 rounded-lg px-3.5 py-2 text-xs text-cream/70 hover:bg-terracotta hover:text-white transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 bg-cream">
        <Outlet />
      </main>
    </div>
  );
}
