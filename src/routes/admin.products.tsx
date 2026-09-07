import { createFileRoute } from "@tanstack/react-router";
import { Plus, Edit2, Trash2, Search, X, Check, Sparkles } from "lucide-react";
import * as React from "react";

import { useAdminStore } from "@/lib/admin-store.tsx";
import { formatPrice, type Product, type ProductCategory, type WeightVariant } from "@/lib/products";
import { Button } from "@/components/ui-kit";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useAdminStore();
  const [search, setSearch] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<Product | null>(null);

  // Form State
  const [formName, setFormName] = React.useState("");
  const [formSlug, setFormSlug] = React.useState("");
  const [formTagline, setFormTagline] = React.useState("");
  const [formCategory, setFormCategory] = React.useState<ProductCategory>("Sweets");
  const [formDescription, setFormDescription] = React.useState("");
  const [formBadge, setFormBadge] = React.useState("");
  const [formIngredients, setFormIngredients] = React.useState("");
  const [formAllergens, setFormAllergens] = React.useState("");
  const [formStorage, setFormStorage] = React.useState("");
  const [formShelfLife, setFormShelfLife] = React.useState("");
  const [formDietaryTags, setFormDietaryTags] = React.useState("");
  const [formWeights, setFormWeights] = React.useState<WeightVariant[]>([
    { label: "250g", weightGrams: 250, price: 349, msrp: 399 },
  ]);

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setFormName("");
    setFormSlug("");
    setFormTagline("");
    setFormCategory("Sweets");
    setFormDescription("");
    setFormBadge("");
    setFormIngredients("Rice starch sheets, organic sugar, pure cow ghee.");
    setFormAllergens("Contains dairy.");
    setFormStorage("Airtight container at room temperature.");
    setFormShelfLife("15 days from preparation date.");
    setFormDietaryTags("Vegetarian, Traditional");
    setFormWeights([{ label: "250g (6 pcs)", weightGrams: 250, price: 349, msrp: 399 }]);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormSlug(p.slug);
    setFormTagline(p.tagline);
    setFormCategory(p.category);
    setFormDescription(p.description);
    setFormBadge(p.badge || "");
    setFormIngredients(p.ingredients);
    setFormAllergens(p.allergens);
    setFormStorage(p.storage);
    setFormShelfLife(p.shelfLife);
    setFormDietaryTags((p.dietaryTags || []).join(", "));
    setFormWeights(p.weights || [{ label: "250g", weightGrams: 250, price: 349 }]);
    setIsModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = formSlug || formName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const productData: Product = {
      slug,
      name: formName,
      tagline: formTagline,
      category: formCategory,
      description: formDescription,
      image: editingProduct?.image || products[0].image,
      badge: formBadge || undefined,
      rating: editingProduct?.rating || 4.9,
      reviewsCount: editingProduct?.reviewsCount || 100,
      weights: formWeights,
      ingredients: formIngredients,
      allergens: formAllergens,
      storage: formStorage,
      shelfLife: formShelfLife,
      dietaryTags: formDietaryTags.split(",").map((t) => t.trim()).filter(Boolean),
      flavorProfile: "Rich & Authentic",
      ratingHistogram: editingProduct?.ratingHistogram || { 5: 90, 4: 10, 3: 0, 2: 0, 1: 0 },
      customerReviews: editingProduct?.customerReviews || [],
    };

    if (editingProduct) {
      updateProduct(productData);
    } else {
      addProduct(productData);
    }

    setIsModalOpen(false);
  };

  const handleAddWeightRow = () => {
    setFormWeights((prev) => [...prev, { label: "500g", weightGrams: 500, price: 649, msrp: 749 }]);
  };

  const handleRemoveWeightRow = (index: number) => {
    setFormWeights((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-light text-primary">Product Inventory (CRUD)</h1>
          <p className="text-xs text-muted-foreground mt-1">Add, edit, or remove catalog items and weight variant pricing.</p>
        </div>
        <Button onClick={openAddModal} className="gap-2 text-xs">
          <Plus className="h-4 w-4" /> Add New Product
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between border-b border-border pb-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by name or category..."
            className="w-full rounded-xl border border-border bg-card py-2 pl-9 pr-4 text-xs text-primary placeholder:text-muted-foreground focus:border-accent focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {["All", "Sweets", "Savouries", "Podi & Mixes", "Gift Boxes", "Special Offers"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? "bg-accent text-accent-foreground font-bold"
                  : "bg-parchment text-muted-foreground hover:bg-border"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-parchment/50 uppercase text-[10px] text-muted-foreground font-semibold">
              <tr>
                <th className="p-3.5">Product</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Weight Variants</th>
                <th className="p-3.5">Base Price</th>
                <th className="p-3.5">Rating</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredProducts.map((p) => (
                <tr key={p.slug} className="hover:bg-parchment/30 transition-colors">
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="h-10 w-10 rounded-lg object-cover border border-border shrink-0" />
                      <div>
                        <p className="font-bold text-primary">{p.name}</p>
                        <p className="text-[11px] text-muted-foreground truncate max-w-xs">{p.tagline}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className="rounded-md bg-parchment px-2 py-0.5 text-[10px] font-semibold text-primary">
                      {p.category}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <div className="flex flex-wrap gap-1">
                      {p.weights.map((w, idx) => (
                        <span key={idx} className="rounded bg-accent/10 px-1.5 py-0.5 text-[10px] font-semibold text-accent">
                          {w.label}: {formatPrice(w.price)}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3.5 font-bold text-primary">{formatPrice(p.weights[0]?.price || 0)}</td>
                  <td className="p-3.5 font-medium">{p.rating} ★ ({p.reviewsCount})</td>
                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(p)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent/10 hover:text-accent"
                        title="Edit Product"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete ${p.name}?`)) deleteProduct(p.slug);
                        }}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        title="Delete Product"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT PRODUCT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-cream rounded-2xl border border-border p-6 shadow-lift space-y-4 my-8 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-display text-xl text-primary font-bold">
                {editingProduct ? `Edit Product: ${editingProduct.name}` : "Add New Catalog Product"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-primary">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-primary mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Royal Kaju Katli"
                    className="w-full rounded-lg border border-border bg-card p-2 text-primary focus:border-accent focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-primary mb-1">Slug URL Identifier</label>
                  <input
                    type="text"
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    placeholder="royal-kaju-katli"
                    className="w-full rounded-lg border border-border bg-card p-2 text-primary focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-primary mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full rounded-lg border border-border bg-card p-2 text-primary focus:border-accent focus:outline-none"
                  >
                    <option value="Sweets">Sweets</option>
                    <option value="Savouries">Savouries</option>
                    <option value="Podi & Mixes">Podi &amp; Mixes</option>
                    <option value="Gift Boxes">Gift Boxes</option>
                    <option value="Special Offers">Special Offers</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-primary mb-1">Highlight Badge (Optional)</label>
                  <input
                    type="text"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    placeholder="Bestseller / Must Try / Luxury"
                    className="w-full rounded-lg border border-border bg-card p-2 text-primary focus:border-accent focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-primary mb-1">Short Tagline</label>
                <input
                  type="text"
                  required
                  value={formTagline}
                  onChange={(e) => setFormTagline(e.target.value)}
                  placeholder="e.g. Pure cashew diamond delights cooked in ghee"
                  className="w-full rounded-lg border border-border bg-card p-2 text-primary focus:border-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-primary mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full rounded-lg border border-border bg-card p-2 text-primary focus:border-accent focus:outline-none"
                />
              </div>

              {/* Weight Variants Manager */}
              <div className="border-t border-border pt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-primary">Weight Variants &amp; Pricing</label>
                  <button
                    type="button"
                    onClick={handleAddWeightRow}
                    className="text-accent font-bold hover:underline flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" /> Add Weight Option
                  </button>
                </div>

                {formWeights.map((w, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-parchment/40 p-2 rounded-lg">
                    <input
                      type="text"
                      placeholder="Label (250g)"
                      value={w.label}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormWeights((prev) => prev.map((item, i) => (i === idx ? { ...item, label: val } : item)));
                      }}
                      className="w-1/3 rounded border border-border bg-card p-1.5"
                    />
                    <input
                      type="number"
                      placeholder="Price (₹)"
                      value={w.price}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setFormWeights((prev) => prev.map((item, i) => (i === idx ? { ...item, price: val } : item)));
                      }}
                      className="w-1/3 rounded border border-border bg-card p-1.5"
                    />
                    <input
                      type="number"
                      placeholder="MSRP (₹)"
                      value={w.msrp || ""}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setFormWeights((prev) => prev.map((item, i) => (i === idx ? { ...item, msrp: val } : item)));
                      }}
                      className="w-1/3 rounded border border-border bg-card p-1.5"
                    />
                    {formWeights.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveWeightRow(idx)}
                        className="text-destructive p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 border-t border-border pt-3">
                <div>
                  <label className="block font-semibold text-primary mb-1">Ingredients</label>
                  <input
                    type="text"
                    value={formIngredients}
                    onChange={(e) => setFormIngredients(e.target.value)}
                    className="w-full rounded-lg border border-border bg-card p-2 text-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-primary mb-1">Dietary Tags (comma separated)</label>
                  <input
                    type="text"
                    value={formDietaryTags}
                    onChange={(e) => setFormDietaryTags(e.target.value)}
                    placeholder="Pure A2 Ghee, Vegetarian"
                    className="w-full rounded-lg border border-border bg-card p-2 text-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-border flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="gap-1">
                  <Check className="h-4 w-4" /> Save Product
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
