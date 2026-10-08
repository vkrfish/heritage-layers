import { createFileRoute, Link } from "@tanstack/react-router";
import { DollarSign, ShoppingBag, Package, TrendingUp, Plus, ArrowUpRight } from "lucide-react";
import * as React from "react";

import { useAdminStore } from "@/lib/admin-store.tsx";
import { formatPrice } from "@/lib/products";
import { Button } from "@/components/ui-kit";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const { products, orders, updateOrderStatus } = useAdminStore();

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const activeProducts = products.length;
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-normal text-brown">Store Performance Dashboard</h1>
          <p className="font-sans text-xs font-bold text-brown/70 mt-1">Real-time overview of sales, orders, and product inventory.</p>
        </div>
        <div className="flex gap-2 font-sans font-bold">
          <Link to="/admin/products">
            <Button size="sm" variant="primary" className="gap-1 text-xs bg-brown text-white hover:bg-terracotta">
              <Plus className="h-3.5 w-3.5" /> Add Product
            </Button>
          </Link>
          <Link to="/admin/discounts">
            <Button size="sm" variant="secondary" className="gap-1 text-xs border-brown text-brown hover:bg-brown hover:text-white">
              <Plus className="h-3.5 w-3.5" /> New Promo Code
            </Button>
          </Link>
        </div>
      </div>

      {/* STATS CARDS GRID */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 font-sans font-bold">
        <div className="rounded-xl border border-brown/15 bg-cream-light p-5 shadow-flat space-y-2">
          <div className="flex items-center justify-between text-xs text-brown/70">
            <span>Total Revenue</span>
            <div className="grid h-8 w-8 place-items-center rounded-full bg-gold/30 text-brown">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <p className="font-display text-3xl text-brown">{formatPrice(totalRevenue)}</p>
          <p className="text-xs text-green flex items-center gap-1 font-bold">
            <TrendingUp className="h-3.5 w-3.5" /> +14.2% from last week
          </p>
        </div>

        <div className="rounded-xl border border-brown/15 bg-cream-light p-5 shadow-flat space-y-2">
          <div className="flex items-center justify-between text-xs text-brown/70">
            <span>Total Orders</span>
            <div className="grid h-8 w-8 place-items-center rounded-full bg-gold/30 text-brown">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <p className="font-display text-3xl text-brown">{totalOrders}</p>
          <p className="text-xs text-brown/70">Across domestic &amp; global shipments</p>
        </div>

        <div className="rounded-xl border border-brown/15 bg-cream-light p-5 shadow-flat space-y-2">
          <div className="flex items-center justify-between text-xs text-brown/70">
            <span>Active Products</span>
            <div className="grid h-8 w-8 place-items-center rounded-full bg-gold/30 text-brown">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <p className="font-display text-3xl text-brown">{activeProducts}</p>
          <p className="text-xs text-brown/70">Sweets, Savouries, Podi &amp; Gift Box catalog</p>
        </div>

        <div className="rounded-xl border border-brown/15 bg-cream-light p-5 shadow-flat space-y-2">
          <div className="flex items-center justify-between text-xs text-brown/70">
            <span>Avg. Order Value</span>
            <div className="grid h-8 w-8 place-items-center rounded-full bg-gold/30 text-brown">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="font-display text-3xl text-brown">{formatPrice(avgOrderValue)}</p>
          <p className="text-xs text-brown/70">Includes multi-pack combos</p>
        </div>
      </div>

      {/* RECENT ORDERS TABLE */}
      <div className="rounded-xl border border-brown/15 bg-cream-light p-6 shadow-flat space-y-4 font-sans font-bold">
        <div className="flex items-center justify-between border-b border-brown/15 pb-3">
          <div>
            <h2 className="font-display text-2xl text-brown">Recent Customer Orders</h2>
            <p className="text-xs text-brown/70">Orders received via Express One-Click and standard checkout.</p>
          </div>
          <Link to="/admin/orders" className="text-xs font-bold text-terracotta hover:underline flex items-center gap-1">
            View All Orders <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-bold">
            <thead className="border-b border-brown/15 bg-cream uppercase text-[10px] text-brown/70 font-bold">
              <tr>
                <th className="p-3">Order ID</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Items Purchased</th>
                <th className="p-3">Total Amount</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brown/15">
              {recentOrders.map((o) => (
                <tr key={o.id} className="hover:bg-cream/60">
                  <td className="p-3 font-bold text-brown">{o.id}</td>
                  <td className="p-3">
                    <p className="font-bold text-brown">{o.customerName}</p>
                    <p className="text-[11px] text-brown/70">{o.city}</p>
                  </td>
                  <td className="p-3">
                    {o.items.map((item, idx) => (
                      <span key={idx} className="block truncate max-w-xs text-brown/80">
                        {item.name} ({item.variant}) × {item.qty}
                      </span>
                    ))}
                  </td>
                  <td className="p-3 font-bold text-terracotta">{formatPrice(o.total)}</td>
                  <td className="p-3">
                    <span className="rounded-md bg-gold/20 px-2 py-0.5 text-[10px] font-bold text-brown">
                      {o.paymentMethod}
                    </span>
                  </td>
                  <td className="p-3">
                    <select
                      value={o.status}
                      onChange={(e) => updateOrderStatus(o.id, e.target.value as any)}
                      className="rounded-lg border border-brown/20 bg-cream py-1 px-2 text-[11px] font-bold text-brown focus:outline-none focus:border-terracotta cursor-pointer"
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
