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
    <section className={cn("border-y border-brown/10 bg-[#FAF7F2] py-8 px-5 lg:px-10", className)}>
      <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-6 sm:grid-cols-4">
        {trustItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex flex-col items-center text-center">
              <div className="grid h-11 w-11 place-items-center rounded-full border border-brown/15 text-brown/80 bg-white mb-2.5">
                <Icon className="h-5 w-5 stroke-[1.5]" />
              </div>
              <h4 className="font-sans text-sm font-medium text-brown">
                {item.label}
              </h4>
              <p className="mt-1 font-sans text-xs font-normal text-brown/60 max-w-[190px] leading-relaxed">
                {item.subtext}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
