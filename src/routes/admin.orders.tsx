import { createFileRoute } from "@tanstack/react-router";
import { Search, Eye, X, Truck, CheckCircle2, AlertCircle, ShoppingBag, Clock } from "lucide-react";
import * as React from "react";

import { useAdminStore, type AdminOrder, type OrderStatus } from "@/lib/admin-store.tsx";
import { formatPrice } from "@/lib/products";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrders,
});

function AdminOrders() {
  const { orders, updateOrderStatus } = useAdminStore();
  const [search, setSearch] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("All");
  const [viewingOrder, setViewingOrder] = React.useState<AdminOrder | null>(null);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone.includes(search);
    const matchesStatus = selectedStatus === "All" || o.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-light text-primary">Orders Management</h1>
          <p className="text-xs text-muted-foreground mt-1">Track customer orders, payment status, and shipping fulfillment.</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between border-b border-border pb-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order ID, Name or Phone..."
            className="w-full rounded-xl border border-border bg-card py-2 pl-9 pr-4 text-xs text-primary placeholder:text-muted-foreground focus:border-accent focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedStatus === st
                  ? "bg-accent text-accent-foreground font-bold"
                  : "bg-parchment text-muted-foreground hover:bg-border"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-parchment/50 uppercase text-[10px] text-muted-foreground font-semibold">
              <tr>
                <th className="p-3.5">Order ID</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Customer Info</th>
                <th className="p-3.5">Line Items</th>
                <th className="p-3.5">Total</th>
                <th className="p-3.5">Payment</th>
                <th className="p-3.5">Fulfillment Status</th>
                <th className="p-3.5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredOrders.map((o) => (
                <tr key={o.id} className="hover:bg-parchment/30 transition-colors">
                  <td className="p-3.5 font-bold text-primary">{o.id}</td>
                  <td className="p-3.5 text-muted-foreground">
                    {new Date(o.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="p-3.5">
                    <p className="font-semibold text-primary">{o.customerName}</p>
                    <p className="text-[11px] text-muted-foreground">+91 {o.customerPhone}</p>
                  </td>
                  <td className="p-3.5">
                    <span className="font-medium text-primary">{o.items.length} item(s)</span>
                    <span className="block text-[11px] text-muted-foreground truncate max-w-xs">
                      {o.items.map((i) => i.name).join(", ")}
                    </span>
                  </td>
                  <td className="p-3.5 font-bold text-accent">{formatPrice(o.total)}</td>
                  <td className="p-3.5">
                    <span className="rounded bg-parchment px-2 py-0.5 text-[10px] font-bold text-primary">
                      {o.paymentMethod}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <select
                      value={o.status}
                      onChange={(e) => updateOrderStatus(o.id, e.target.value as OrderStatus)}
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
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => setViewingOrder(o)}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent/10 hover:text-accent"
                      title="View Order Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ORDER DETAILS MODAL */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-cream rounded-2xl border border-border p-6 shadow-lift space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="font-display text-xl text-primary font-bold">{viewingOrder.id}</h3>
                <p className="text-xs text-muted-foreground">Order Date: {new Date(viewingOrder.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={() => setViewingOrder(null)} className="text-muted-foreground hover:text-primary">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Customer Details */}
            <div className="rounded-xl border border-border bg-parchment/40 p-3 space-y-1 text-xs">
              <p className="font-bold text-primary">Customer Details:</p>
              <p className="text-muted-foreground">{viewingOrder.customerName} ({viewingOrder.customerPhone})</p>
              <p className="text-muted-foreground">{viewingOrder.address}, {viewingOrder.city}</p>
              <p className="text-accent font-semibold pt-1">Payment: {viewingOrder.paymentMethod}</p>
            </div>

            {/* Items List */}
            <div className="space-y-2">
              <p className="eyebrow text-primary font-semibold">Ordered Line Items:</p>
              <div className="divide-y divide-border border border-border rounded-xl bg-card p-3 space-y-2 max-h-48 overflow-y-auto text-xs">
                {viewingOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1">
                    <div>
                      <p className="font-semibold text-primary">{item.name}</p>
                      <p className="text-[11px] text-muted-foreground">{item.variant} × {item.qty}</p>
                    </div>
                    <span className="font-bold text-primary">{formatPrice(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="border-t border-border pt-3 flex justify-between items-center text-sm">
              <span className="font-bold text-primary">Total Paid:</span>
              <span className="text-lg font-bold text-accent">{formatPrice(viewingOrder.total)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
