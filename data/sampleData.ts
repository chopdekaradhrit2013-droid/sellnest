export interface BakeryProduct {
  id: string;
  name: string;
  category: "breads" | "pastries" | "cakes" | "treats";
  categoryLabel: string;
  price: number;
  description: string;
  image: string;
  isEggless: boolean;
  isBestseller?: boolean;
  prepTime?: string;
  ingredients?: string;
}

export const BAKERY_PRODUCTS: BakeryProduct[] = [
  {
    id: "prod-1",
    name: "Wild Yeast Artisan Sourdough",
    category: "breads",
    categoryLabel: "Artisan Breads",
    price: 320,
    description: "36-hour slow cold fermentation, dark blistered crust, airy tender crumb. Made with stoneground whole wheat.",
    image: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=800&q=80",
    isEggless: true,
    isBestseller: true,
    prepTime: "Baked fresh daily at 6 AM",
    ingredients: "Stoneground flour, water, sea salt, wild starter",
  },
  {
    id: "prod-2",
    name: "Pistachio & Rose Cruffin",
    category: "pastries",
    categoryLabel: "Viennoiserie",
    price: 240,
    description: "Flaky croissant dough baked in muffin molds, filled with house-made roasted pistachio praline and rosewater curd.",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80",
    isEggless: false,
    isBestseller: true,
    prepTime: "Handcrafted in small batches",
    ingredients: "French butter, pistachio praline, organic eggs, cane sugar",
  },
  {
    id: "prod-3",
    name: "Dark Chocolate Sea Salt Babka",
    category: "breads",
    categoryLabel: "Artisan Breads",
    price: 480,
    description: "Braided buttery brioche laced with 70% Callebaut dark chocolate ganache, finished with flaky Maldon sea salt.",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
    isEggless: false,
    isBestseller: false,
    prepTime: "Pre-order 24h recommended",
    ingredients: "70% dark chocolate, brioche dough, Maldon salt flakes",
  },
  {
    id: "prod-4",
    name: "Classic Burnt Basque Cheesecake",
    category: "cakes",
    categoryLabel: "Celebration Cakes",
    price: 1250,
    description: "Caramelized mahogany top with an unctuous, molten vanilla bean center. Serves 4 to 6 people (approx 650g).",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80",
    isEggless: false,
    isBestseller: true,
    prepTime: "Same day pickup available",
    ingredients: "Cream cheese, organic cream, Madagascar vanilla bean, eggs",
  },
  {
    id: "prod-5",
    name: "Raspberry Almond Macaron Box",
    category: "treats",
    categoryLabel: "Cookies & Treats",
    price: 540,
    description: "Box of 6 delicate almond flour shells filled with tart raspberry compote and Valrhona white chocolate ganache.",
    image: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=800&q=80",
    isEggless: false,
    isBestseller: false,
    prepTime: "Box of 6 pieces",
    ingredients: "Almond flour, Valrhona chocolate, fresh raspberry coulis",
  },
  {
    id: "prod-6",
    name: "Cardamom & Brown Butter Blondies",
    category: "treats",
    categoryLabel: "Cookies & Treats",
    price: 380,
    description: "Chewy, dense brown-butter squares scented with freshly crushed green cardamom and studded with toasted pecans.",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80",
    isEggless: true,
    isBestseller: true,
    prepTime: "Box of 4 large squares",
    ingredients: "Browned butter, whole wheat flour, roasted pecans, cardamom",
  },
];

export interface MakerStory {
  id: string;
  name: string;
  handle: string;
  category: string;
  location: string;
  headline: string;
  tagline: string;
  image: string;
  productHighlight: string;
  averageWeeklyOrders: string;
}

export const MAKER_STORIES: MakerStory[] = [
  {
    id: "maker-1",
    name: "The Butter Room",
    handle: "thebutterroom",
    category: "Artisanal Bakery",
    location: "Indiranagar, Bengaluru",
    headline: "Replaced 60+ daily Instagram DM back-and-forths with direct WhatsApp orders.",
    tagline: "Small-batch sourdough & French viennoiserie",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
    productHighlight: "Wild Yeast Sourdough & Cruffins",
    averageWeeklyOrders: "85+ orders/week",
  },
  {
    id: "maker-2",
    name: "Aura & Clay",
    handle: "auraandclay",
    category: "Ceramics & Home",
    location: "Khar West, Mumbai",
    headline: "Customers browse collections like an art gallery and pay seamlessly via UPI.",
    tagline: "Wheel-thrown studio pottery & stoneware cups",
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80",
    productHighlight: "Wabi-sabi Matcha Bowls & Vases",
    averageWeeklyOrders: "40+ items per drop",
  },
  {
    id: "maker-3",
    name: "Tara Silver Atelier",
    handle: "tarasilver",
    category: "Handcrafted Jewellery",
    location: "C-Scheme, Jaipur",
    headline: "Shared our store link in Instagram bio and doubled our direct customer orders.",
    tagline: "925 silver & semi-precious stone amulets",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80",
    productHighlight: "Hand-hammered Moonstone Rings",
    averageWeeklyOrders: "120+ orders/month",
  },
  {
    id: "maker-4",
    name: "Kora Studio",
    handle: "korastudio",
    category: "Slow Fashion & Linen",
    location: "Fort Kochi, Kerala",
    headline: "Zero marketplace commissions means we keep 100% of our garment margins.",
    tagline: "Handwoven organic cotton & naturally dyed linens",
    image: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=80",
    productHighlight: "Indigo Khadi Overshirts",
    averageWeeklyOrders: "50+ pieces/month",
  },
];

