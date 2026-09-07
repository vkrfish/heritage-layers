import classic from "@/assets/product-classic.jpg";
import ghee from "@/assets/product-ghee.jpg";
import dryfruit from "@/assets/product-dryfruit.jpg";
import jaggery from "@/assets/product-jaggery.jpg";
import giftbox from "@/assets/product-giftbox.jpg";

export type WeightVariant = {
  label: string;
  weightGrams: number;
  price: number;
  msrp?: number;
};

export type Review = {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
  location?: string;
};

export type ProductCategory = "Sweets" | "Savouries" | "Podi & Mixes" | "Gift Boxes" | "Special Offers";

export type Product = {
  slug: string;
  name: string;
  tagline: string;
  category: ProductCategory;
  description: string;
  image: string;
  badge?: string;
  rating: number;
  reviewsCount: number;
  weights: WeightVariant[];
  ingredients: string;
  allergens: string;
  storage: string;
  shelfLife: string;
  dietaryTags: string[];
  flavorProfile: string;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isGiftingFavorite?: boolean;
  isSpecialOffer?: boolean;
  isUnder99?: boolean;
  ratingHistogram: { 5: number; 4: number; 3: number; 2: number; 1: number };
  customerReviews: Review[];
  frequentlyBoughtWithSlugs?: string[];
};

export const products: Product[] = [
  {
    slug: "classic-putharekulu",
    name: "Classic Putharekulu",
    tagline: "The original paper-thin rice sweet",
    category: "Sweets",
    description:
      "Paper-thin rice starch sheets expertly folded around fine powdered sugar and pure cow ghee. Melts effortlessly on your palate with centuries of heritage in every bite.",
    image: classic,
    rating: 4.9,
    reviewsCount: 214,
    isBestSeller: true,
    dietaryTags: ["Vegetarian", "Traditional", "Artisan"],
    flavorProfile: "Melt-in-mouth Sweet & Nutty Ghee",
    weights: [
      { label: "250g (6 pcs)", weightGrams: 250, price: 349, msrp: 399 },
      { label: "500g (12 pcs)", weightGrams: 500, price: 649, msrp: 749 },
      { label: "1kg (24 pcs)", weightGrams: 1000, price: 1199, msrp: 1399 },
    ],
    ingredients: "Rice starch sheets, powdered organic sugar, pure clarified cow ghee.",
    allergens: "Made in a facility that processes tree nuts and dairy.",
    storage: "Store in an airtight container in a cool, dry place. Do not refrigerate.",
    shelfLife: "15 days from preparation date.",
    ratingHistogram: { 5: 185, 4: 22, 3: 5, 2: 2, 1: 0 },
    frequentlyBoughtWithSlugs: ["ghee-putharekulu", "artisan-gunpowder-podi"],
    customerReviews: [
      {
        id: "r1",
        author: "Lakshmi R.",
        rating: 5,
        date: "2 days ago",
        comment: "Brought back memories of my grandmother's house in Atreyapuram. Perfectly crisp sheets and fresh ghee aroma!",
        verified: true,
        location: "Hyderabad",
      },
      {
        id: "r2",
        author: "Siddharth V.",
        rating: 5,
        date: "1 week ago",
        comment: "Shipped to USA without any damage! Amazing packaging and super authentic flavor.",
        verified: true,
        location: "San Jose, CA",
      },
    ],
  },
  {
    slug: "ghee-putharekulu",
    name: "Royal Ghee Putharekulu",
    tagline: "Double-brushed with slow-clarified A2 ghee",
    category: "Sweets",
    description:
      "Layer upon layer brushed with slow-clarified A2 cow ghee for an extra rich aroma and silky, melt-in-mouth texture.",
    image: ghee,
    badge: "Bestseller",
    rating: 4.9,
    reviewsCount: 168,
    isBestSeller: true,
    isGiftingFavorite: true,
    dietaryTags: ["Pure A2 Ghee", "Vegetarian"],
    flavorProfile: "Rich A2 Ghee & Warm Sugar",
    weights: [
      { label: "250g (6 pcs)", weightGrams: 250, price: 429, msrp: 499 },
      { label: "500g (12 pcs)", weightGrams: 500, price: 799, msrp: 899 },
      { label: "1kg (24 pcs)", weightGrams: 1000, price: 1499, msrp: 1699 },
    ],
    ingredients: "Rice starch sheets, refined sugar, slow-crafted A2 cow ghee.",
    allergens: "Contains dairy.",
    storage: "Airtight container at room temperature. Keep away from direct sunlight.",
    shelfLife: "14 days from preparation date.",
    ratingHistogram: { 5: 150, 4: 14, 3: 4, 2: 0, 1: 0 },
    frequentlyBoughtWithSlugs: ["dry-fruit-putharekulu", "premium-gift-box"],
    customerReviews: [
      {
        id: "r3",
        author: "Anand M.",
        rating: 5,
        date: "3 days ago",
        comment: "The richness of ghee is unmatched. Truly a royal treat!",
        verified: true,
        location: "Bengaluru",
      },
    ],
  },
  {
    slug: "dry-fruit-putharekulu",
    name: "Dry Fruit Putharekulu",
    tagline: "Hand-slivered almonds, pistachios & cashews",
    category: "Sweets",
    description:
      "Finely chopped Iranian pistachios, Mamra almonds, and roasted cashews layered between delicate rice wafers.",
    image: dryfruit,
    badge: "Must Try",
    rating: 4.8,
    reviewsCount: 132,
    isNewArrival: true,
    isGiftingFavorite: true,
    dietaryTags: ["Rich Nut Blend", "Vegetarian"],
    flavorProfile: "Nutty Crunch & Silky Sweetness",
    weights: [
      { label: "250g (6 pcs)", weightGrams: 250, price: 499, msrp: 599 },
      { label: "500g (12 pcs)", weightGrams: 500, price: 929, msrp: 1099 },
      { label: "1kg (24 pcs)", weightGrams: 1000, price: 1799, msrp: 1999 },
    ],
    ingredients: "Rice sheets, powdered sugar, A2 ghee, roasted almonds, pistachios, cashews.",
    allergens: "Contains tree nuts and dairy.",
    storage: "Airtight container, cool and dry.",
    shelfLife: "12 days from preparation date.",
    ratingHistogram: { 5: 110, 4: 18, 3: 4, 2: 0, 1: 0 },
    frequentlyBoughtWithSlugs: ["classic-putharekulu", "jaggery-putharekulu"],
    customerReviews: [
      {
        id: "r4",
        author: "Pooja K.",
        rating: 5,
        date: "5 days ago",
        comment: "The crunch of almonds and pistachios goes so well with the thin paper layers!",
        verified: true,
        location: "Chennai",
      },
    ],
  },
  {
    slug: "jaggery-putharekulu",
    name: "Organic Jaggery Putharekulu",
    tagline: "Unrefined palm jaggery, grand-mother's recipe",
    category: "Sweets",
    description:
      "Dark organic palm jaggery instead of refined sugar — earthier, complex caramel notes, and closer to ancient village traditions.",
    image: jaggery,
    rating: 4.7,
    reviewsCount: 96,
    isBestSeller: true,
    dietaryTags: ["Jaggery Based", "Refined Sugar Free", "Vegetarian"],
    flavorProfile: "Earthy Molasses & Rich Ghee",
    weights: [
      { label: "250g (6 pcs)", weightGrams: 250, price: 399, msrp: 449 },
      { label: "500g (12 pcs)", weightGrams: 500, price: 749, msrp: 849 },
      { label: "1kg (24 pcs)", weightGrams: 1000, price: 1399, msrp: 1599 },
    ],
    ingredients: "Rice starch sheets, organic palm jaggery, pure cow ghee.",
    allergens: "Contains dairy.",
    storage: "Airtight container, away from moisture and humidity.",
    shelfLife: "15 days from preparation date.",
    ratingHistogram: { 5: 75, 4: 15, 3: 6, 2: 0, 1: 0 },
    frequentlyBoughtWithSlugs: ["spicy-butter-murukku", "classic-putharekulu"],
    customerReviews: [
      {
        id: "r5",
        author: "Venkatesh B.",
        rating: 5,
        date: "1 week ago",
        comment: "Deep, soothing jaggery flavor. Love that there is no white sugar added!",
        verified: true,
        location: "Visakhapatnam",
      },
    ],
  },
  {
    slug: "premium-gift-box",
    name: "Royal Heritage Gift Box",
    tagline: "4 Varieties in a silk-wrapped keepsake box",
    category: "Gift Boxes",
    description:
      "A hand-crafted keepsake box holding Classic, Ghee, Dry Fruit, and Jaggery Putharekulu varieties wrapped in gold parchment.",
    image: giftbox,
    badge: "Luxury Gift",
    rating: 5.0,
    reviewsCount: 87,
    isGiftingFavorite: true,
    isBestSeller: true,
    dietaryTags: ["Assorted", "Festive Special"],
    flavorProfile: "Assorted Heritage Delights",
    weights: [
      { label: "500g (12 pcs)", weightGrams: 500, price: 1099, msrp: 1299 },
      { label: "1kg (24 pcs)", weightGrams: 1000, price: 1999, msrp: 2399 },
    ],
    ingredients: "Rice sheets, powdered sugar, palm jaggery, cow ghee, mixed nuts.",
    allergens: "Contains tree nuts and dairy.",
    storage: "Keep box closed in a cool, dry place.",
    shelfLife: "14 days from packing date.",
    ratingHistogram: { 5: 87, 4: 0, 3: 0, 2: 0, 1: 0 },
    frequentlyBoughtWithSlugs: ["artisan-gunpowder-podi", "spicy-butter-murukku"],
    customerReviews: [
      {
        id: "r6",
        author: "Meera C.",
        rating: 5,
        date: "3 days ago",
        comment: "Ordered 10 boxes for Diwali corporate gifting. Everyone was amazed by the quality!",
        verified: true,
        location: "Mumbai",
      },
    ],
  },
  {
    slug: "spicy-butter-murukku",
    name: "Spicy Butter Murukku",
    tagline: "Crunchy spiral savories crafted in pure butter",
    category: "Savouries",
    description:
      "Traditional fried spirals made with rice flour, roasted gram flour, sesame seeds, and farm-fresh butter.",
    image: ghee,
    rating: 4.8,
    reviewsCount: 112,
    isBestSeller: true,
    dietaryTags: ["Crispy", "Gluten-Free", "Vegetarian"],
    flavorProfile: "Spicy, Savory & Buttery",
    weights: [
      { label: "250g", weightGrams: 250, price: 199, msrp: 249 },
      { label: "500g", weightGrams: 500, price: 379, msrp: 449 },
      { label: "1kg", weightGrams: 1000, price: 699, msrp: 799 },
    ],
    ingredients: "Rice flour, roasted gram flour, fresh butter, cumin seeds, red chili powder, salt.",
    allergens: "Contains dairy.",
    storage: "Store in a sealed airtight jar.",
    shelfLife: "30 days from preparation date.",
    ratingHistogram: { 5: 92, 4: 16, 3: 4, 2: 0, 1: 0 },
    customerReviews: [
      {
        id: "r7",
        author: "Ramesh K.",
        rating: 5,
        date: "4 days ago",
        comment: "Super light and crispy! Perfect companion for evening tea.",
        verified: true,
        location: "Coimbatore",
      },
    ],
  },
  {
    slug: "artisan-gunpowder-podi",
    name: "Artisan Gunpowder Podi (Kandi Podi)",
    tagline: "Hand-roasted lentils, red chilies & asafoetida",
    category: "Podi & Mixes",
    description:
      "Coarsely ground blend of slow-roasted toor dal, chana dal, Byadgi red chilies, and aromatic asafoetida. Perfect with hot rice & ghee.",
    image: jaggery,
    badge: "Spice Blend",
    rating: 4.9,
    reviewsCount: 143,
    isBestSeller: true,
    dietaryTags: ["Vegan", "Gluten-Free", "Authentic Spice"],
    flavorProfile: "Fiery, Roasted & Savory",
    weights: [
      { label: "250g jar", weightGrams: 250, price: 249, msrp: 299 },
      { label: "500g pouch", weightGrams: 500, price: 449, msrp: 549 },
    ],
    ingredients: "Toor dal, chana dal, red chilies, cumin seeds, black pepper, asafoetida, rock salt.",
    allergens: "Vegan.",
    storage: "Store in a cool dry place with tight lid.",
    shelfLife: "90 days from packing date.",
    ratingHistogram: { 5: 130, 4: 10, 3: 3, 2: 0, 1: 0 },
    customerReviews: [
      {
        id: "r8",
        author: "Kavitha N.",
        rating: 5,
        date: "2 days ago",
        comment: "Just like home! The roasted aroma when mixed with hot rice and ghee is incredible.",
        verified: true,
        location: "London, UK",
      },
    ],
  },
  {
    slug: "mini-ghee-mysore-pak",
    name: "Mini Ghee Mysore Pak (100g)",
    tagline: "Rich melt-in-mouth ghee delicacy",
    category: "Special Offers",
    description:
      "Golden blocks of aromatic besan flour cooked in bubbling hot ghee until porous and velvety soft.",
    image: ghee,
    badge: "₹99 Store",
    rating: 4.7,
    reviewsCount: 64,
    isSpecialOffer: true,
    isUnder99: true,
    dietaryTags: ["Pure Ghee", "Under ₹99"],
    flavorProfile: "Rich Ghee & Cardamom",
    weights: [
      { label: "100g trial pack", weightGrams: 100, price: 99, msrp: 149 },
      { label: "250g pack", weightGrams: 250, price: 229, msrp: 279 },
    ],
    ingredients: "Gram flour (besan), sugar, pure ghee, cardamom.",
    allergens: "Contains dairy.",
    storage: "Keep in a cool dry place.",
    shelfLife: "20 days from packing date.",
    ratingHistogram: { 5: 50, 4: 10, 3: 4, 2: 0, 1: 0 },
    customerReviews: [
      {
        id: "r9",
        author: "Divya T.",
        rating: 5,
        date: "Yesterday",
        comment: "Great trial size for ₹99! Tastes heavenly.",
        verified: true,
        location: "Bengaluru",
      },
    ],
  },
];

export const getProduct = (slug: string): Product | undefined =>
  products.find((p) => p.slug === slug);

export const formatPrice = (value: number, currency: string = "INR") => {
  if (currency === "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Math.round((value / 85) * 100) / 100);
  }
  if (currency === "GBP") {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(Math.round((value / 105) * 100) / 100);
  }
  if (currency === "EUR") {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(Math.round((value / 92) * 100) / 100);
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
};

export type StoreLocation = {
  id: string;
  city: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  mapUrl: string;
  isFlagship?: boolean;
};

export const physicalStores: StoreLocation[] = [
  {
    id: "st-chennai",
    city: "Chennai",
    name: "9 Stories Flagship - T. Nagar",
    address: "42 Usman Road, Near Panagal Park, T. Nagar, Chennai - 600017",
    phone: "+91 44 4890 1200",
    hours: "9:00 AM - 9:30 PM (Open All Days)",
    mapUrl: "https://maps.google.com/?q=T+Nagar+Chennai",
    isFlagship: true,
  },
  {
    id: "st-coimbatore",
    city: "Coimbatore",
    name: "9 Stories - RS Puram",
    address: "108 DB Road, Opposite Flower Market, RS Puram, Coimbatore - 641002",
    phone: "+91 422 2541 900",
    hours: "9:00 AM - 9:00 PM (Open All Days)",
    mapUrl: "https://maps.google.com/?q=RS+Puram+Coimbatore",
  },
  {
    id: "st-hyderabad",
    city: "Hyderabad",
    name: "9 Stories - Jubilee Hills",
    address: "Road No. 36, Beside Metro Station, Jubilee Hills, Hyderabad - 500033",
    phone: "+91 40 6712 3400",
    hours: "9:30 AM - 10:00 PM (Open All Days)",
    mapUrl: "https://maps.google.com/?q=Jubilee+Hills+Hyderabad",
    isFlagship: true,
  },
  {
    id: "st-bangalore",
    city: "Bengaluru",
    name: "9 Stories - Indiranagar",
    address: "100 Feet Road, Near Toit, Indiranagar, Bengaluru - 560038",
    phone: "+91 80 4123 7890",
    hours: "9:30 AM - 9:30 PM (Open All Days)",
    mapUrl: "https://maps.google.com/?q=Indiranagar+Bangalore",
  },
  {
    id: "st-london",
    city: "London (UK)",
    name: "9 Stories Global Outlet - Wembley",
    address: "14 Ealing Road, Wembley, London HA0 4TL, United Kingdom",
    phone: "+44 20 8903 1122",
    hours: "10:00 AM - 8:00 PM (Tue - Sun)",
    mapUrl: "https://maps.google.com/?q=Wembley+London",
  },
];
