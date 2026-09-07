import { createFileRoute, Link } from "@tanstack/react-router";
import { DollarSign, ShoppingBag, Package, TrendingUp, Plus, ArrowUpRight, Clock, CheckCircle2, Truck } from "lucide-react";
import * as React from "react";

import { useAdminStore } from "@/lib/admin-store.tsx";
import { formatPrice } from "@/lib/products";
import { Button } from "@/components/ui-kit";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { products, orders, discounts, updateOrderStatus } = useAdminStore();

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const activeProducts = products.length;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-light text-primary">Store Performance Dashboard</h1>
          <p className="text-xs text-muted-foreground mt-1">Real-time overview of sales, orders, and product inventory.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/products">
            <Button size="sm" className="gap-1 text-xs">
              <Plus className="h-3.5 w-3.5" /> Add Product
            </Button>
          </Link>
          <Link to="/admin/discounts">
            <Button size="sm" variant="secondary" className="gap-1 text-xs">
              <Plus className="h-3.5 w-3.5" /> New Promo Code
            </Button>
          </Link>
        </div>
      </div>

      {/* STATS CARDS GRID */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Total Revenue</span>
            <div className="grid h-8 w-8 place-items-center rounded-full bg-accent/10 text-accent">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <p className="font-display text-2xl font-bold text-primary">{formatPrice(totalRevenue)}</p>
          <p className="text-[11px] text-accent flex items-center gap-1 font-semibold">
            <TrendingUp className="h-3 w-3" /> +14.2% from last week
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Total Orders</span>
            <div className="grid h-8 w-8 place-items-center rounded-full bg-accent/10 text-accent">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <p className="font-display text-2xl font-bold text-primary">{totalOrders}</p>
          <p className="text-[11px] text-muted-foreground">Across domestic &amp; global shipments</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Active Products</span>
            <div className="grid h-8 w-8 place-items-center rounded-full bg-accent/10 text-accent">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <p className="font-display text-2xl font-bold text-primary">{activeProducts}</p>
          <p className="text-[11px] text-muted-foreground">Sweets, Savouries, Podi &amp; Gift Box catalog</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Avg. Order Value</span>
            <div className="grid h-8 w-8 place-items-center rounded-full bg-accent/10 text-accent">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="font-display text-2xl font-bold text-primary">{formatPrice(avgOrderValue)}</p>
          <p className="text-[11px] text-muted-foreground">Includes multi-pack combos</p>
        </div>
      </div>

      {/* RECENT ORDERS TABLE */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h2 className="font-display text-xl text-primary font-semibold">Recent Customer Orders</h2>
            <p className="text-xs text-muted-foreground">Orders received via Express One-Click and standard checkout.</p>
          </div>
          <Link to="/admin/orders" className="text-xs font-bold text-accent hover:underline flex items-center gap-1">
            View All Orders <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-parchment/50 uppercase text-[10px] text-muted-foreground font-semibold">
              <tr>
                <th className="p-3">Order ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Items Purchased</th>
                <th className="p-3">Total Amount</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {recentOrders.map((o) => (
                <tr key={o.id} className="hover:bg-parchment/30">
                  <td className="p-3 font-bold text-primary">{o.id}</td>
                  <td className="p-3">
                    <p className="font-medium text-primary">{o.customerName}</p>
                    <p className="text-[11px] text-muted-foreground">{o.city}</p>
                  </td>
                  <td className="p-3">
                    {o.items.map((item, idx) => (
                      <span key={idx} className="block truncate max-w-xs text-muted-foreground">
                        {item.name} ({item.variant}) × {item.qty}
                      </span>
                    ))}
                  </td>
                  <td className="p-3 font-bold text-accent">{formatPrice(o.total)}</td>
                  <td className="p-3">
                    <span className="rounded-md bg-parchment px-2 py-0.5 text-[10px] font-semibold text-primary">
                      {o.paymentMethod}
                    </span>
                  </td>
                  <td className="p-3">
                    <select
                      value={o.status}
                      onChange={(e) => updateOrderStatus(o.id, e.target.value as any)}
                      className={`rounded-lg border border-border py-1 px-2 text-[11px] font-bold focus:outline-none ${
                        o.status === "Delivered"
                          ? "bg-accent/10 text-accent border-accent"
                          : o.status === "Shipped"
                          ? "bg-teal/10 text-teal border-teal"
                          : "bg-parchment text-primary"
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
