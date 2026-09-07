import { createFileRoute } from "@tanstack/react-router";
import { Plus, Tag, X, Check, Power } from "lucide-react";
import * as React from "react";

import { useAdminStore } from "@/lib/admin-store.tsx";
import { formatPrice } from "@/lib/products";
import { Button } from "@/components/ui-kit";

export const Route = createFileRoute("/admin/discounts")({
  component: AdminDiscounts,
});

function AdminDiscounts() {
  const { discounts, addDiscount, toggleDiscount } = useAdminStore();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const [code, setCode] = React.useState("");
  const [discountType, setDiscountType] = React.useState<"percentage" | "flat">("percentage");
  const [discountValue, setDiscountValue] = React.useState(10);
  const [minSubtotal, setMinSubtotal] = React.useState(499);

  const handleAddDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    addDiscount({
      code: code.toUpperCase().replace(/\s+/g, ""),
      discountType,
      discountValue,
      minSubtotal,
      isActive: true,
    });
    setCode("");
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-light text-primary">Promo Codes &amp; Discounts</h1>
          <p className="text-xs text-muted-foreground mt-1">Manage coupon codes, minimum spend thresholds &amp; discounts.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 text-xs">
          <Plus className="h-4 w-4" /> Create Promo Code
        </Button>
      </div>

      {/* Discounts Table */}
      <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-border bg-parchment/50 uppercase text-[10px] text-muted-foreground font-semibold">
            <tr>
              <th className="p-3.5">Coupon Code</th>
              <th className="p-3.5">Discount Offer</th>
              <th className="p-3.5">Min Subtotal Threshold</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {discounts.map((d) => (
              <tr key={d.id} className="hover:bg-parchment/30 transition-colors">
                <td className="p-3.5 font-bold text-primary flex items-center gap-2">
                  <Tag className="h-4 w-4 text-accent" />
                  <span className="font-mono bg-parchment px-2 py-1 rounded text-accent font-bold">{d.code}</span>
                </td>
                <td className="p-3.5 font-semibold text-primary">
                  {d.discountType === "percentage" ? `${d.discountValue}% OFF` : `Flat ${formatPrice(d.discountValue)} OFF`}
                </td>
                <td className="p-3.5 text-muted-foreground">Orders above {formatPrice(d.minSubtotal)}</td>
                <td className="p-3.5">
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                    d.isActive ? "bg-accent/10 text-accent" : "bg-border text-muted-foreground"
                  }`}>
                    {d.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="p-3.5 text-right">
                  <button
                    onClick={() => toggleDiscount(d.id)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-accent"
                  >
                    <Power className="h-3.5 w-3.5" /> Toggle Status
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CREATE DISCOUNT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-cream rounded-2xl border border-border p-6 shadow-lift space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-display text-xl text-primary font-bold">Create Promo Code</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-primary">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddDiscount} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-primary mb-1">Coupon Code (Uppercase)</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. FESTIVE20"
                  className="w-full rounded-lg border border-border bg-card p-2 font-mono uppercase text-accent font-bold focus:border-accent focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-primary mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full rounded-lg border border-border bg-card p-2 text-primary focus:outline-none"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-primary mb-1">Value ({discountType === "percentage" ? "%" : "₹"})</label>
                  <input
                    type="number"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full rounded-lg border border-border bg-card p-2 text-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-primary mb-1">Minimum Subtotal Required (₹)</label>
                <input
                  type="number"
                  required
                  value={minSubtotal}
                  onChange={(e) => setMinSubtotal(Number(e.target.value))}
                  className="w-full rounded-lg border border-border bg-card p-2 text-primary focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-border flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="gap-1">
                  <Check className="h-4 w-4" /> Save Coupon Code
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
