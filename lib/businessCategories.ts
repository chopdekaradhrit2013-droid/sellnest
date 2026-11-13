export interface BusinessCategoryOption {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const BUSINESS_CATEGORIES: BusinessCategoryOption[] = [
  {
    id: "bakery",
    name: "Bakery & Desserts",
    icon: "🧁",
    description: "Cakes, pastries, cookies, brownies & artisanal bakes",
  },
  {
    id: "clothing",
    name: "Clothing & Apparel",
    icon: "👗",
    description: "Fashion, streetwear, ethnic wear & everyday apparel",
  },
  {
    id: "jewellery",
    name: "Jewellery & Accessories",
    icon: "✨",
    description: "Handmade jewellery, silver, charms, beads & rings",
  },
  {
    id: "candles",
    name: "Candles & Home Fragrances",
    icon: "🕯️",
    description: "Scented soy candles, wax melts, diffusers & incense",
  },
  {
    id: "pottery_decor",
    name: "Ceramics, Pottery & Home Decor",
    icon: "🏺",
    description: "Studio pottery, tableware, planters & artisanal decor",
  },
  {
    id: "beauty_skincare",
    name: "Beauty, Bath & Skincare",
    icon: "🌿",
    description: "Handmade soaps, organic serums, lip balms & oils",
  },
  {
    id: "gourmet_foods",
    name: "Gourmet Foods & Pantry",
    icon: "🍫",
    description: "Chocolates, sauces, coffee, teas, spices & snacks",
  },
  {
    id: "art_stationery",
    name: "Art, Prints & Stationery",
    icon: "🎨",
    description: "Original illustrations, art prints, stickers & journals",
  },
  {
    id: "gifts_hampers",
    name: "Custom Gifts & Hampers",
    icon: "🎁",
    description: "Curated hampers, personalized gift boxes & party favors",
  },
  {
    id: "crochet_textiles",
    name: "Crochet, Knitting & Textiles",
    icon: "🧶",
    description: "Crochet plushies, tote bags, handmade rugs & knitwear",
  },
  {
    id: "other",
    name: "Other",
    icon: "🪄",
    description: "Specify your custom business niche or craft",
  },
];

export function getResolvedCategory(selectedId: string, customText?: string): string {
  if (selectedId === "other") {
    return customText?.trim() || "Other";
  }
  const match = BUSINESS_CATEGORIES.find((c) => c.id === selectedId);
  return match ? match.name : selectedId || "General";
}
