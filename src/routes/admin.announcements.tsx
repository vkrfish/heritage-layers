import { createFileRoute } from "@tanstack/react-router";
import { Megaphone, Plus, Trash2, Sparkles } from "lucide-react";
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
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div>
        <h1 className="font-display text-4xl font-normal text-brown">Live Marquee Announcement Editor</h1>
        <p className="font-sans text-xs font-bold text-brown/70 mt-1">
          Manage the top auto-rotating announcement bar displayed across the entire store header.
        </p>
      </div>

      {/* Add New Announcement Form */}
      <div className="rounded-xl border border-brown/15 bg-cream-light p-6 shadow-flat space-y-4 font-sans font-bold">
        <h3 className="font-display text-2xl text-brown flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-terracotta" /> Add New Marquee Announcement Message
        </h3>

        <form onSubmit={handleAddAnnouncement} className="flex gap-2">
          <input
            type="text"
            required
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="e.g. 🎁 Get 15% OFF on orders above ₹1499 with code DIWALI15!"
            className="w-full rounded-lg border border-brown/30 bg-cream py-2.5 px-4 font-sans text-xs font-bold text-brown placeholder:text-brown/50 focus:border-terracotta focus:outline-none"
          />
          <Button type="submit" variant="primary" className="shrink-0 gap-1 text-xs bg-brown text-white hover:bg-terracotta">
            <Plus className="h-4 w-4" /> Add Message
          </Button>
        </form>
      </div>

      {/* Current Announcements List */}
      <div className="rounded-xl border border-brown/15 bg-cream-light p-6 shadow-flat space-y-4 font-sans font-bold">
        <h3 className="font-display text-2xl text-brown">
          Active Rotating Marquee Announcements ({announcements.length})
        </h3>

        <div className="space-y-2">
          {announcements.map((text, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between gap-4 rounded-lg border border-brown/15 bg-cream p-3.5 font-sans text-xs font-bold text-brown"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Sparkles className="h-4 w-4 text-gold shrink-0" />
                <span className="truncate">{text}</span>
              </div>
              <button
                onClick={() => handleRemove(idx)}
                className="shrink-0 text-brown/60 hover:text-terracotta p-1 cursor-pointer"
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
