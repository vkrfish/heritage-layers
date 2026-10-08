import { Leaf, Hand, Utensils, Sprout } from "lucide-react";
import { cn } from "@/lib/utils";

const trustItems = [
  {
    icon: Leaf,
    label: "Authentic Ingredients",
    subtext: "100% Pure A2 Ghee & Organic Jaggery",
  },
  {
    icon: Hand,
    label: "Handcrafted Process",
    subtext: "Made fresh in small village batches",
  },
  {
    icon: Utensils,
    label: "Indian Tradition",
    subtext: "Authentic Atreyapuram recipes",
  },
  {
    icon: Sprout,
    label: "Natural Goodness",
    subtext: "Zero artificial colors or preservatives",
  },
] as const;

export function BrandTrustStrip({ className }: { className?: string }) {
  return (
    <section className={cn("border-y border-brown/15 bg-cream py-10 px-5 lg:px-10", className)}>
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-6 sm:grid-cols-4">
        {trustItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex flex-col items-center text-center group">
              <div className="grid h-16 w-16 place-items-center rounded-full border border-brown text-brown transition-transform duration-300 group-hover:scale-105 group-hover:border-terracotta group-hover:text-terracotta bg-cream-light/60">
                <Icon className="h-7 w-7 stroke-[1.5]" />
              </div>
              <h4 className="mt-3 font-sans text-base font-bold text-brown tracking-wide">
                {item.label}
              </h4>
              <p className="mt-0.5 font-sans text-xs text-brown/70 max-w-[180px]">
                {item.subtext}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
