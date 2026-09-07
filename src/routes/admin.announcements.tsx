import { createFileRoute } from "@tanstack/react-router";
import { Megaphone, Plus, Trash2, Check, Sparkles } from "lucide-react";
import * as React from "react";

import { useAdminStore } from "@/lib/admin-store.tsx";
import { Button } from "@/components/ui-kit";

export const Route = createFileRoute("/admin/announcements")({
  component: AdminAnnouncements,
});

function AdminAnnouncements() {
  const { announcements, setAnnouncements } = useAdminStore();
  const [newText, setNewText] = React.useState("");

  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    setAnnouncements([...announcements, newText.trim()]);
    setNewText("");
  };

  const handleRemove = (index: number) => {
    setAnnouncements(announcements.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-light text-primary">Live Marquee Announcement Editor</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Manage the top auto-rotating announcement bar displayed across the entire store header.
        </p>
      </div>

      {/* Add New Announcement Form */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4">
        <h3 className="font-display text-lg font-semibold text-primary flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-accent" /> Add New Marquee Announcement Message
        </h3>

        <form onSubmit={handleAddAnnouncement} className="flex gap-2">
          <input
            type="text"
            required
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="e.g. 🎁 Get 15% OFF on orders above ₹1499 with code DIWALI15!"
            className="w-full rounded-xl border border-border bg-background py-2.5 px-4 text-xs text-primary placeholder:text-muted-foreground focus:border-accent focus:outline-none"
          />
          <Button type="submit" className="shrink-0 gap-1 text-xs">
            <Plus className="h-4 w-4" /> Add Message
          </Button>
        </form>
      </div>

      {/* Current Announcements List */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-soft space-y-4">
        <h3 className="font-display text-lg font-semibold text-primary">
          Active Rotating Marquee Announcements ({announcements.length})
        </h3>

        <div className="space-y-2">
          {announcements.map((text, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-4 rounded-xl border border-border bg-parchment/40 p-3.5 text-xs text-primary font-medium"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Sparkles className="h-4 w-4 text-gold shrink-0" />
                <span className="truncate">{text}</span>
              </div>
              <button
                onClick={() => handleRemove(idx)}
                className="shrink-0 text-muted-foreground hover:text-destructive p-1"
                title="Remove Message"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
