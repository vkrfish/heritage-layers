import { createFileRoute } from "@tanstack/react-router";
import { Search, Eye, X } from "lucide-react";
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
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-normal text-brown">Orders Management</h1>
          <p className="font-sans text-xs font-bold text-brown/70 mt-1">Track customer orders, payment status, and shipping fulfillment.</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between border-b border-brown/15 pb-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-brown/50" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order ID, Name or Phone..."
            className="w-full rounded-lg border border-brown/30 bg-cream-light py-2 pl-9 pr-4 font-sans text-xs font-bold text-brown placeholder:text-brown/50 focus:border-terracotta focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto font-sans font-bold">
          {["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`rounded-full px-3 py-1 font-sans text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                selectedStatus === st
                  ? "bg-terracotta text-white"
                  : "bg-cream-light text-brown/70 hover:bg-brown/10"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-xl border border-brown/15 bg-cream-light shadow-flat overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-bold">
            <thead className="border-b border-brown/15 bg-cream uppercase text-[10px] text-brown/70 font-bold">
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
            <tbody className="divide-y divide-brown/15">
              {filteredOrders.map((o) => (
                <tr key={o.id} className="hover:bg-cream/60 transition-colors">
                  <td className="p-3.5 font-bold text-brown">{o.id}</td>
                  <td className="p-3.5 text-brown/70">
                    {new Date(o.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td className="p-3.5">
                    <p className="font-bold text-brown">{o.customerName}</p>
                    <p className="text-[11px] text-brown/70">+91 {o.customerPhone}</p>
                  </td>
                  <td className="p-3.5">
                    <span className="font-bold text-brown">{o.items.length} item(s)</span>
                    <span className="block text-[11px] text-brown/70 truncate max-w-xs">
                      {o.items.map((i) => i.name).join(", ")}
                    </span>
                  </td>
                  <td className="p-3.5 font-bold text-terracotta">{formatPrice(o.total)}</td>
                  <td className="p-3.5">
                    <span className="rounded bg-gold/20 px-2 py-0.5 text-[10px] font-bold text-brown">
                      {o.paymentMethod}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <select
                      value={o.status}
                      onChange={(e) => updateOrderStatus(o.id, e.target.value as OrderStatus)}
                      className="rounded-lg border border-brown/20 bg-cream py-1 px-2 text-[11px] font-bold text-brown focus:outline-none focus:border-terracotta cursor-pointer"
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
                      className="rounded-lg p-1.5 text-brown/70 hover:bg-terracotta/15 hover:text-terracotta cursor-pointer"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-brown/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-cream rounded-xl border border-brown/20 p-6 shadow-lift space-y-4 animate-in zoom-in-95 font-sans font-bold">
            <div className="flex items-center justify-between border-b border-brown/15 pb-3">
              <div>
                <h3 className="font-display text-2xl text-brown">{viewingOrder.id}</h3>
                <p className="font-sans text-xs font-bold text-brown/70">Order Date: {new Date(viewingOrder.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={() => setViewingOrder(null)} className="text-brown/70 hover:text-brown cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Customer Details */}
            <div className="rounded-lg border border-brown/15 bg-cream-light p-3 space-y-1 font-sans text-xs font-bold">
              <p className="text-brown font-bold">Customer Details:</p>
              <p className="text-brown/80">{viewingOrder.customerName} ({viewingOrder.customerPhone})</p>
              <p className="text-brown/80">{viewingOrder.address}, {viewingOrder.city}</p>
              <p className="text-terracotta font-bold pt-1">Payment: {viewingOrder.paymentMethod}</p>
            </div>

            {/* Items List */}
            <div className="space-y-2 font-sans font-bold">
              <p className="eyebrow text-brown">Ordered Line Items:</p>
              <div className="divide-y divide-brown/15 border border-brown/15 rounded-lg bg-cream-light p-3 space-y-2 max-h-48 overflow-y-auto text-xs font-bold">
                {viewingOrder.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-1">
                    <div>
                      <p className="font-bold text-brown">{item.name}</p>
                      <p className="text-[11px] text-brown/70">{item.variant} × {item.qty}</p>
                    </div>
                    <span className="font-bold text-terracotta">{formatPrice(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="border-t border-brown/15 pt-3 flex justify-between items-center text-sm font-bold font-sans">
              <span className="text-brown font-bold">Total Paid:</span>
              <span className="text-xl font-bold text-terracotta">{formatPrice(viewingOrder.total)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
