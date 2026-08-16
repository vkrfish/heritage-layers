import classic from "@/assets/product-classic.jpg";
import ghee from "@/assets/product-ghee.jpg";
import dryfruit from "@/assets/product-dryfruit.jpg";
import jaggery from "@/assets/product-jaggery.jpg";
import giftbox from "@/assets/product-giftbox.jpg";

export type Weight = { label: string; price: number };

export type Product = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  badge?: string;
  rating: number;
  reviews: number;
  weights: Weight[];
  ingredients: string;
  allergens: string;
  storage: string;
  shelfLife: string;
};

export const products: Product[] = [
  {
    slug: "classic-putharekulu",
    name: "Classic Putharekulu",
    tagline: "The original paper sweet",
    description:
      "Paper-thin rice sheets folded around fine powdered sugar and a whisper of ghee. Melts the moment it meets you.",
    image: classic,
    rating: 4.9,
    reviews: 214,
    weights: [
      { label: "250 g · 6 pieces", price: 349 },
      { label: "500 g · 12 pieces", price: 649 },
      { label: "1 kg · 24 pieces", price: 1199 },
    ],
    ingredients: "Rice starch sheets, powdered sugar, cow ghee.",
    allergens: "Made in a kitchen that also handles tree nuts and dairy.",
    storage: "Keep in an airtight container, away from moisture and direct sun.",
    shelfLife: "15 days from the day it is made.",
  },
  {
    slug: "ghee-putharekulu",
    name: "Ghee Putharekulu",
    tagline: "Richer. Slower. Deeper.",
    description:
      "Layer upon layer brushed with slow-clarified cow ghee for a fuller aroma and a soft, buttery finish.",
    image: ghee,
    badge: "Bestseller",
    rating: 4.9,
    reviews: 168,
    weights: [
      { label: "250 g · 6 pieces", price: 429 },
      { label: "500 g · 12 pieces", price: 799 },
    ],
    ingredients: "Rice starch sheets, powdered sugar, pure cow ghee.",
    allergens: "Contains dairy. Handled alongside tree nuts.",
    storage: "Airtight container at room temperature. Do not refrigerate.",
    shelfLife: "12 days from the day it is made.",
  },
  {
    slug: "dry-fruit-putharekulu",
    name: "Dry Fruit Putharekulu",
    tagline: "Almond, pistachio, cashew",
    description:
      "Hand-slivered nuts pressed between the sheets, adding quiet crunch to something famously delicate.",
    image: dryfruit,
    rating: 4.8,
    reviews: 132,
    weights: [
      { label: "250 g · 6 pieces", price: 499 },
      { label: "500 g · 12 pieces", price: 929 },
    ],
    ingredients: "Rice starch sheets, powdered sugar, cow ghee, almonds, pistachios, cashews.",
    allergens: "Contains tree nuts and dairy.",
    storage: "Airtight container, cool and dry.",
    shelfLife: "12 days from the day it is made.",
  },
  {
    slug: "jaggery-putharekulu",
    name: "Jaggery Putharekulu",
    tagline: "Unrefined, the old way",
    description:
      "Dark palm jaggery instead of sugar — earthier, less sweet, and closer to how our grandmothers made it.",
    image: jaggery,
    rating: 4.7,
    reviews: 96,
    weights: [
      { label: "250 g · 6 pieces", price: 399 },
      { label: "500 g · 12 pieces", price: 749 },
    ],
    ingredients: "Rice starch sheets, palm jaggery, cow ghee.",
    allergens: "Contains dairy. Handled alongside tree nuts.",
    storage: "Airtight container, away from humidity.",
    shelfLife: "15 days from the day it is made.",
  },
  {
    slug: "premium-gift-box",
    name: "Premium Gift Box",
    tagline: "Four varieties, one keepsake box",
    description:
      "A hand-finished teal and gold box holding all four varieties, wrapped in parchment and tied with silk.",
    image: giftbox,
    badge: "Gifting",
    rating: 5,
    reviews: 87,
    weights: [
      { label: "500 g · 12 pieces", price: 1099 },
      { label: "1 kg · 24 pieces", price: 1999 },
    ],
    ingredients: "Rice starch sheets, powdered sugar, palm jaggery, cow ghee, mixed nuts.",
    allergens: "Contains tree nuts and dairy.",
    storage: "Keep the box closed, cool and dry.",
    shelfLife: "12 days from the day it is packed.",
  },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
