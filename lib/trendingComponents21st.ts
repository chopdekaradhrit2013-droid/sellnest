/**
 * 21st.dev Trending Components Library for SellNest Storefront Builder
 * Curated collection of 100+ best trending modern React + Tailwind components,
 * heroes, bento grids, banners, testimonials, trust badges, and interactive widgets.
 */

export type ComponentCategory =
  | "all"
  | "hero"
  | "bento"
  | "banner"
  | "social_proof"
  | "badges"
  | "features"
  | "footer";

export interface Component21st {
  id: string;
  name: string;
  category: "hero" | "bento" | "banner" | "social_proof" | "badges" | "features" | "footer";
  author: string;
  requiredPlan: "free" | "starter" | "pro";
  badge?: "Trending 🔥" | "Most Popular" | "New" | "Staff Pick" | "Editor Choice";
  description: string;
  tags: string[];
  defaultHeadline?: string;
  defaultSubheadline?: string;
  codeSnippet: string;
}

export const CATEGORY_LABELS: Record<ComponentCategory, { label: string; icon: string; count: number }> = {
  all: { label: "All Components", icon: "Sparkles", count: 101 },
  hero: { label: "Hero Sections", icon: "Layout", count: 22 },
  bento: { label: "Bento & Grids", icon: "Grid", count: 16 },
  banner: { label: "Banners & Tickers", icon: "Megaphone", count: 12 },
  social_proof: { label: "Reviews & Proof", icon: "Star", count: 15 },
  badges: { label: "Badges & CTAs", icon: "Zap", count: 14 },
  features: { label: "Trust & Features", icon: "ShieldCheck", count: 12 },
  footer: { label: "Footers & Contact", icon: "Compass", count: 10 },
};

export const TRENDING_21ST_COMPONENTS: Component21st[] = [
  // ==========================================
  // CATEGORY 1: HERO SECTIONS (22 components)
  // ==========================================
  {
    id: "hero-ambient-glow",
    name: "Ambient Glow Radial Hero",
    category: "hero",
    author: "@aceternity",
    requiredPlan: "pro",
    badge: "Trending 🔥",
    description: "Multi-layered radial gradient blur with glowing backdrop and centered bold typography.",
    tags: ["glow", "radial", "gradient", "hero", "ambient"],
    defaultHeadline: "Artisanal Goodness, Baked Fresh Every Dawn",
    defaultSubheadline: "Small-batch sourdough, buttery viennoiserie, and celebration treats delivered to your doorstep.",
    codeSnippet: `<div className="relative overflow-hidden py-24 sm:py-32 bg-zinc-950 text-white rounded-3xl">
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/30 blur-[130px] rounded-full pointer-events-none" />
  <div className="relative z-10 max-w-3xl mx-auto px-6 text-center space-y-6">
    <span className="px-3.5 py-1 text-xs font-semibold rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">✨ Handcrafted Daily</span>
    <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">Artisanal Goodness, Baked Fresh</h1>
    <p className="text-zinc-400 text-sm sm:text-lg">Small-batch sourdough and celebration treats delivered directly.</p>
  </div>
</div>`,
  },
  {
    id: "hero-bento-grid",
    name: "Bento Grid Showcase Hero",
    category: "hero",
    author: "@magicui",
    requiredPlan: "starter",
    badge: "Staff Pick",
    description: "Modern asymmetric bento grid pairing headline with visual feature cards and live stats.",
    tags: ["bento", "grid", "cards", "hero", "stats"],
    defaultHeadline: "Crafted with Heritage Passion",
    defaultSubheadline: "Explore today's fresh bake cycle and our hand-laminated artisan pastries.",
    codeSnippet: `<div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto p-4">
  <div className="md:col-span-2 p-8 rounded-3xl bg-gradient-to-br from-zinc-900 to-zinc-950 text-white flex flex-col justify-between">
    <h2 className="text-3xl sm:text-4xl font-bold">Crafted with Heritage Passion</h2>
    <p className="text-zinc-400 text-sm mt-3">Hand-laminated butter pastries made fresh daily.</p>
  </div>
  <div className="p-6 rounded-3xl bg-purple-50 border border-purple-200 flex flex-col justify-between">
    <span className="text-2xl font-black text-purple-900">100% Organic</span>
    <span className="text-xs text-purple-700">0 Artificial Preservatives</span>
  </div>
</div>`,
  },
  {
    id: "hero-split-showcase",
    name: "Split Image Showcase Hero",
    category: "hero",
    author: "@shadcn",
    requiredPlan: "free",
    badge: "Most Popular",
    description: "Classic dual-column layout with compelling headline on left and visual image collage on right.",
    tags: ["split", "dual-column", "clean", "showcase"],
    defaultHeadline: "Pure Ingredients. Patient Craft.",
    defaultSubheadline: "We let dough ferment for 36 hours for exceptional crumb, aroma, and digestibility.",
    codeSnippet: `<div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
  <div className="space-y-5">
    <span className="text-xs font-bold uppercase tracking-wider text-purple-600">Pure Ingredients</span>
    <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900">Pure Ingredients. Patient Craft.</h1>
    <p className="text-zinc-600 text-sm sm:text-base">Slow fermented for exceptional crumb and digestible goodness.</p>
  </div>
  <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl">
    <img src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80" alt="Showcase" className="w-full h-full object-cover" />
  </div>
</div>`,
  },
  {
    id: "hero-spotlight-radial",
    name: "Spotlight Focus Dark Hero",
    category: "hero",
    author: "@aceternity",
    requiredPlan: "pro",
    badge: "Trending 🔥",
    description: "Cinematic dark canvas with dynamic spotlight beam pointing towards your primary call to action.",
    tags: ["spotlight", "dark", "cinematic", "beam"],
    codeSnippet: `<div className="relative py-28 bg-zinc-950 text-white rounded-3xl overflow-hidden text-center">
  <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-purple-500/40 to-transparent blur-3xl opacity-75" />
  <h1 className="text-4xl sm:text-6xl font-black relative z-10">Fresh Bakes. Unfiltered Joy.</h1>
</div>`,
  },
  {
    id: "hero-floating-badges",
    name: "Floating Social Proof Badges Hero",
    category: "hero",
    author: "@cult-ui",
    requiredPlan: "starter",
    badge: "New",
    description: "Hero with interactive floating badges: 4.9★ rating, live orders counter, and WhatsApp quick button.",
    tags: ["floating", "badges", "interactive", "rating"],
    codeSnippet: `<div className="relative py-20 px-6 text-center max-w-4xl mx-auto">
  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold mb-4">
    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
    <span>Accepting Pre-orders for Today</span>
  </div>
  <h1 className="text-4xl sm:text-5xl font-black text-zinc-900">Handmade with Genuine Care</h1>
</div>`,
  },
  {
    id: "hero-cinematic-video",
    name: "Cinematic Canvas Backdrop Hero",
    category: "hero",
    author: "@motion-primitives",
    requiredPlan: "pro",
    badge: "Editor Choice",
    description: "Full-bleed atmospheric hero with high contrast frosted overlay and warm ambient tones.",
    tags: ["cinematic", "backdrop", "video", "warm"],
    codeSnippet: `<div className="relative min-h-[460px] flex items-center justify-center rounded-3xl overflow-hidden text-white p-8">
  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent z-10" />
  <div className="relative z-20 max-w-xl mr-auto space-y-4">
    <h1 className="text-4xl font-extrabold">Baking Tradition Reimagined</h1>
  </div>
</div>`,
  },
  {
    id: "hero-glassmorphic-frost",
    name: "Glassmorphic Frosted Glass Hero",
    category: "hero",
    author: "@shadcn",
    requiredPlan: "pro",
    description: "Backdrop blur glassmorphism card floating over an organic ambient pastel gradient.",
    tags: ["glassmorphism", "blur", "frost", "clean"],
    codeSnippet: `<div className="p-8 sm:p-14 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/60 shadow-xl max-w-3xl mx-auto text-center">
  <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-900">Natural Fermentation Bakes</h1>
  <p className="text-zinc-600 mt-3 text-sm sm:text-base">Wild yeast sourdough with crisp crust and custardy crumb.</p>
</div>`,
  },
  {
    id: "hero-retro-ribbon",
    name: "Retro Heritage Ribbon Hero",
    category: "hero",
    author: "@fancy-components",
    requiredPlan: "starter",
    description: "Vintage artisan boutique style with arched decorative ribbon and nostalgic serif typography.",
    tags: ["retro", "vintage", "serif", "ribbon"],
    codeSnippet: `<div className="py-20 text-center bg-amber-50/60 border border-amber-200/60 rounded-3xl space-y-4">
  <span className="text-xs uppercase tracking-[0.3em] text-amber-900 font-bold">Est. 2024 &bull; Small Batch</span>
  <h1 className="font-serif italic text-4xl sm:text-6xl text-amber-950 font-normal">The Neighborhood Bakehouse</h1>
</div>`,
  },
  {
    id: "hero-diagonal-split",
    name: "Diagonal Geometric Split Hero",
    category: "hero",
    author: "@cult-ui",
    requiredPlan: "starter",
    description: "Dynamic angled color split creating strong visual separation between branding and action.",
    tags: ["diagonal", "geometric", "bold", "angular"],
    codeSnippet: `<div className="relative overflow-hidden rounded-3xl bg-zinc-900 text-white p-12">
  <div className="max-w-xl space-y-4">
    <h1 className="text-3xl sm:text-5xl font-black">Baked With Zero Shortcuts</h1>
  </div>
</div>`,
  },
  {
    id: "hero-fullbleed-parallax",
    name: "Full-Bleed Header Hero",
    category: "hero",
    author: "@motion-primitives",
    requiredPlan: "pro",
    description: "Expansive edge-to-edge photography banner with smooth scrim overlay for maximum visual immersion.",
    tags: ["fullbleed", "banner", "scrim", "immersion"],
    codeSnippet: `<div className="relative h-96 rounded-3xl overflow-hidden flex items-end p-8 text-white">
  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10" />
  <div className="relative z-20">
    <h1 className="text-3xl sm:text-4xl font-extrabold">Fresh Today in the Studio</h1>
  </div>
</div>`,
  },
  {
    id: "hero-dual-cta",
    name: "Dual Action Primary & WhatsApp Hero",
    category: "hero",
    author: "@shadcn",
    requiredPlan: "starter",
    badge: "Most Popular",
    description: "Conversion-optimized hero featuring instant WhatsApp ordering and interactive catalog browse.",
    tags: ["cta", "whatsapp", "conversion", "sales"],
    codeSnippet: `<div className="py-16 text-center max-w-3xl mx-auto space-y-6">
  <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-950">Daily Fresh Artisan Bakes</h1>
  <div className="flex flex-wrap items-center justify-center gap-3">
    <button className="px-6 py-3 rounded-xl bg-purple-600 text-white font-bold text-sm shadow-md">Order via WhatsApp</button>
    <button className="px-6 py-3 rounded-xl bg-zinc-100 text-zinc-900 font-semibold text-sm">Browse Menu</button>
  </div>
</div>`,
  },
  {
    id: "hero-artisan-story",
    name: "Storyteller Maker Journey Hero",
    category: "hero",
    author: "@craft-ui",
    requiredPlan: "free",
    description: "Heartfelt creator introduction with founder note, signature tag, and behind-the-scenes portrait.",
    tags: ["story", "founder", "artisan", "warm"],
    codeSnippet: `<div className="max-w-4xl mx-auto p-8 rounded-3xl bg-stone-50 border border-stone-200 grid md:grid-cols-3 gap-6 items-center">
  <div className="md:col-span-2 space-y-3">
    <span className="text-xs font-bold text-stone-500 uppercase">A Note From The Maker</span>
    <h2 className="text-2xl font-bold text-stone-900">“Every loaf has a story of patience.”</h2>
  </div>
</div>`,
  },
  {
    id: "hero-cyberpunk-neon",
    name: "Neon Glow Cyber Hero",
    category: "hero",
    author: "@aceternity",
    requiredPlan: "pro",
    description: "High-voltage vibrant border glow and high-tech typography for bold modern brands.",
    tags: ["neon", "cyber", "glow", "vibrant"],
    codeSnippet: `<div className="p-12 rounded-3xl bg-zinc-950 border border-purple-500/40 shadow-[0_0_50px_-12px_rgba(168,85,247,0.4)] text-white text-center">
  <h1 className="text-4xl sm:text-6xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">Next-Gen Street Pastries</h1>
</div>`,
  },
  {
    id: "hero-organic-flow",
    name: "Pastel Blob & Organic Flow Hero",
    category: "hero",
    author: "@fancy-components",
    requiredPlan: "starter",
    description: "Soft pastel gradients and flowing curved shapes ideal for cakes, florists, and crafts.",
    tags: ["pastel", "organic", "soft", "curved"],
    codeSnippet: `<div className="py-20 text-center bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 rounded-3xl p-8">
  <span className="text-xs font-bold text-purple-700 bg-white px-3 py-1 rounded-full shadow-xs">Handmade With Love</span>
  <h1 className="text-4xl sm:text-5xl font-black text-zinc-900 mt-4">Sweet Delights For Every Smile</h1>
</div>`,
  },
  {
    id: "hero-minimal-grid",
    name: "Modern Minimal Grid Hero",
    category: "hero",
    author: "@shadcn",
    requiredPlan: "free",
    description: "Clean Swiss-style grid with subtle dot matrix background and micro-taglines.",
    tags: ["minimal", "swiss", "grid", "clean"],
    codeSnippet: `<div className="py-20 text-center max-w-3xl mx-auto space-y-4">
  <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">[ FRESH BATCH &bull; 08:00 AM ]</span>
  <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-950">Pure Taste. No Compromise.</h1>
</div>`,
  },
  {
    id: "hero-carousel-slides",
    name: "Multi-Slide Showcase Hero",
    category: "hero",
    author: "@motion-primitives",
    requiredPlan: "pro",
    description: "Interactive horizontal slide track showing multiple hero campaigns with auto-pagination.",
    tags: ["carousel", "slider", "multi-slide", "gallery"],
    codeSnippet: `<div className="relative rounded-3xl overflow-hidden bg-zinc-900 text-white p-12 text-center">
  <span className="text-xs font-bold text-purple-400 uppercase">Season Highlight</span>
  <h2 className="text-3xl sm:text-5xl font-black mt-2">Wild Blueberry Brioche Tarts</h2>
</div>`,
  },
  {
    id: "hero-badge-counter",
    name: "Live Status & Counter Hero",
    category: "hero",
    author: "@magicui",
    requiredPlan: "pro",
    description: "Real-time stock indicator badge with countdown to next oven pull.",
    tags: ["counter", "live", "stock", "urgency"],
    codeSnippet: `<div className="py-16 text-center space-y-4">
  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
    <span>🔥 Today's Sourdough: 8 Loaves Remaining</span>
  </div>
  <h1 className="text-4xl sm:text-5xl font-extrabold">Artisan Bread, Fresh Out Of The Oven</h1>
</div>`,
  },
  {
    id: "hero-centered-luxury",
    name: "Luxury Serif Boutique Hero",
    category: "hero",
    author: "@craft-ui",
    requiredPlan: "free",
    badge: "Editor Choice",
    description: "Fine dining and luxury boutique aesthetics with gold accent lines and classic typography.",
    tags: ["luxury", "serif", "boutique", "gold"],
    codeSnippet: `<div className="py-24 text-center bg-stone-900 text-stone-100 rounded-3xl p-8 border border-amber-900/30">
  <span className="text-xs uppercase tracking-[0.4em] text-amber-400 font-medium">Haute Pâtisserie</span>
  <h1 className="font-serif italic text-4xl sm:text-6xl mt-4 font-normal">Exquisite Confections</h1>
</div>`,
  },
  {
    id: "hero-fast-commerce",
    name: "Quick-Order Fast Commerce Hero",
    category: "hero",
    author: "@shadcn",
    requiredPlan: "free",
    description: "Compact high-density banner with immediate 1-tap cart buttons for rapid ordering.",
    tags: ["commerce", "quick-order", "compact", "speed"],
    codeSnippet: `<div className="p-6 rounded-2xl bg-zinc-100 flex flex-col sm:flex-row items-center justify-between gap-4">
  <div>
    <h2 className="text-xl font-bold text-zinc-900">Morning Sourdough Bundle</h2>
    <p className="text-xs text-zinc-500">Loaf + Butter Croissant + Cinnamon Roll</p>
  </div>
  <button className="px-4 py-2 rounded-xl bg-purple-600 text-white font-bold text-xs">Add for ₹399</button>
</div>`,
  },
  {
    id: "hero-3d-perspective",
    name: "3D Perspective Card Hero",
    category: "hero",
    author: "@aceternity",
    requiredPlan: "pro",
    badge: "Trending 🔥",
    description: "Tilt card in 3D perspective showcasing your flagship specialty item.",
    tags: ["3d", "perspective", "tilt", "flagship"],
    codeSnippet: `<div className="py-16 text-center space-y-6">
  <h1 className="text-4xl font-black text-zinc-900">Flagship Sourdough Boule</h1>
  <div className="max-w-md mx-auto aspect-video rounded-3xl shadow-2xl overflow-hidden border border-zinc-200">
    <img src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80" className="w-full h-full object-cover" />
  </div>
</div>`,
  },
  {
    id: "hero-interactive-tagline",
    name: "Interactive Tagline Pill Hero",
    category: "hero",
    author: "@cult-ui",
    requiredPlan: "starter",
    description: "Hero with interactive clickable feature pills that filter products on click.",
    tags: ["interactive", "pills", "filter", "tags"],
    codeSnippet: `<div className="py-16 text-center space-y-4">
  <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-900">What Are You Craving Today?</h1>
  <div className="flex flex-wrap justify-center gap-2 pt-2">
    <span className="px-3 py-1.5 rounded-full bg-purple-100 text-purple-800 text-xs font-bold cursor-pointer">🥖 Sourdough</span>
    <span className="px-3 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold cursor-pointer">🥐 Viennoiserie</span>
    <span className="px-3 py-1.5 rounded-full bg-pink-100 text-pink-800 text-xs font-bold cursor-pointer">🎂 Celebration Cakes</span>
  </div>
</div>`,
  },
  {
    id: "hero-seasonal-special",
    name: "Seasonal Festive Special Hero",
    category: "hero",
    author: "@fancy-components",
    requiredPlan: "pro",
    description: "Festive celebration banner with holiday sparkles, gift box tags, and limited edition alert.",
    tags: ["festive", "holiday", "seasonal", "gift"],
    codeSnippet: `<div className="py-16 text-center bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white rounded-3xl p-8">
  <span className="text-xs font-bold tracking-widest uppercase">Festive Collection</span>
  <h1 className="text-3xl sm:text-5xl font-black mt-2">Holiday Gift Hampers &amp; Treats</h1>
</div>`,
  },

  // ==========================================
  // CATEGORY 2: BENTO & PRODUCT GRIDS (16 components)
  // ==========================================
  {
    id: "bento-3col-asymmetric",
    name: "Asymmetric 3-Column Bento Showcase",
    category: "bento",
    author: "@magicui",
    requiredPlan: "starter",
    badge: "Staff Pick",
    description: "A signature 21st.dev bento layout with hero product on left and dual stacked feature cards on right.",
    tags: ["bento", "asymmetric", "3-column", "showcase"],
    codeSnippet: `<div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto my-8">
  <div className="md:col-span-2 p-6 rounded-3xl bg-zinc-900 text-white flex flex-col justify-between min-h-[300px]">
    <span className="text-xs font-bold text-purple-400">SIGNATURE SPECIALTY</span>
    <h3 className="text-2xl font-bold">Country Sourdough Loaf</h3>
  </div>
  <div className="space-y-4">
    <div className="p-6 rounded-3xl bg-stone-100 min-h-[140px] flex flex-col justify-between">
      <span className="text-xs font-bold text-stone-500">DAILY FRESH</span>
      <h4 className="font-bold text-zinc-900">Almond Croissants</h4>
    </div>
    <div className="p-6 rounded-3xl bg-purple-50 min-h-[140px] flex flex-col justify-between">
      <span className="text-xs font-bold text-purple-600">ZERO COMPROMISE</span>
      <h4 className="font-bold text-purple-950">100% French Butter</h4>
    </div>
  </div>
</div>`,
  },
  {
    id: "bento-spotlight-cards",
    name: "Interactive Hover Spotlight Cards",
    category: "bento",
    author: "@aceternity",
    requiredPlan: "pro",
    badge: "Trending 🔥",
    description: "Mouse-following radial gradient glow cards illuminating card borders on hover.",
    tags: ["spotlight", "hover", "interactive", "cards"],
    codeSnippet: `<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
  <div className="group relative p-6 rounded-2xl bg-white border border-zinc-200 hover:border-purple-500 transition-all shadow-xs hover:shadow-lg">
    <h4 className="font-bold text-zinc-900">Vanilla Bean Choux</h4>
    <p className="text-xs text-zinc-500 mt-1">Crisp craquelin with Madagascar vanilla bean custard.</p>
  </div>
</div>`,
  },
  {
    id: "bento-tilt-card",
    name: "3D Tilt Card with Depth Shadow",
    category: "bento",
    author: "@aceternity",
    requiredPlan: "pro",
    description: "Smooth 3D parallax tilt on mousemove with elevated drop shadows.",
    tags: ["tilt", "depth", "3d", "shadow"],
    codeSnippet: `<div className="p-6 rounded-2xl bg-white border border-zinc-200/90 shadow-xl hover:-translate-y-1.5 transition-transform">
  <span className="text-xs font-bold text-purple-600">BESTSELLER</span>
  <h3 className="text-lg font-bold text-zinc-900 mt-1">Dark Chocolate Babka</h3>
</div>`,
  },
  {
    id: "bento-clean-minimal",
    name: "Minimalist Clean Border Card",
    category: "bento",
    author: "@shadcn",
    requiredPlan: "free",
    description: "Ultra-crisp Scandinavian minimalist product presentation with hairline borders.",
    tags: ["minimalist", "clean", "hairline", "scandinavian"],
    codeSnippet: `<div className="p-5 rounded-2xl bg-white border border-zinc-200 space-y-3">
  <div className="aspect-square bg-zinc-100 rounded-xl overflow-hidden" />
  <div className="flex justify-between items-baseline">
    <h4 className="font-semibold text-sm text-zinc-900">Sourdough Focaccia</h4>
    <span className="font-mono font-bold text-sm">₹240</span>
  </div>
</div>`,
  },
  {
    id: "bento-glassmorphic-cards",
    name: "Glassmorphic Frosted Product Cards",
    category: "bento",
    author: "@cult-ui",
    requiredPlan: "pro",
    description: "Frosted glass card with blur backing and illuminated white hairline rim.",
    tags: ["glassmorphism", "blur", "frost", "rim"],
    codeSnippet: `<div className="p-6 rounded-3xl bg-white/60 backdrop-blur-md border border-white/80 shadow-md">
  <h4 className="font-bold text-zinc-900">Cardamom Morning Bun</h4>
</div>`,
  },
  {
    id: "bento-masonry-wall",
    name: "Masonry Visual Product Wall",
    category: "bento",
    author: "@fancy-components",
    requiredPlan: "pro",
    description: "Pinterest-style masonry columns for dynamic heights and rich product storytelling.",
    tags: ["masonry", "wall", "visual", "pinterest"],
    codeSnippet: `<div className="columns-1 sm:columns-2 md:columns-3 gap-4 max-w-6xl mx-auto space-y-4">
  <div className="break-inside-avoid p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs">
    <h4 className="font-bold text-sm">Pain au Chocolat</h4>
  </div>
</div>`,
  },
  {
    id: "bento-bestseller-badge",
    name: "Best Seller Ribbon Badge Card",
    category: "bento",
    author: "@shadcn",
    requiredPlan: "free",
    description: "Product card with corner angled ribbon badge indicating best-selling status.",
    tags: ["badge", "ribbon", "bestseller", "tag"],
    codeSnippet: `<div className="relative p-5 rounded-2xl bg-white border border-purple-200 overflow-hidden shadow-xs">
  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-purple-600 text-white text-[10px] font-bold">BEST SELLER</div>
  <h4 className="font-bold text-zinc-900">Pecan Cinnamon Roll</h4>
</div>`,
  },
  {
    id: "bento-urgency-card",
    name: "Limited Stock Urgency Card",
    category: "bento",
    author: "@magicui",
    requiredPlan: "starter",
    description: "Live progress bar showing stock remaining with pulse indicator.",
    tags: ["urgency", "stock", "progress", "pulse"],
    codeSnippet: `<div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
  <span className="text-[10px] font-bold text-amber-800 uppercase">Only 3 Left Today</span>
  <div className="w-full bg-amber-200 h-1.5 rounded-full overflow-hidden">
    <div className="bg-amber-600 h-full w-4/5" />
  </div>
</div>`,
  },
  {
    id: "bento-floating-cart-btn",
    name: "Quick Add Floating Cart Card",
    category: "bento",
    author: "@shadcn",
    requiredPlan: "starter",
    description: "Overlay circular plus button with spring bounce animation on hover.",
    tags: ["floating", "cart", "button", "bounce"],
    codeSnippet: `<div className="group relative p-4 rounded-2xl bg-white border border-zinc-200">
  <button className="w-10 h-10 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold shadow-md hover:scale-110 transition-transform">+</button>
</div>`,
  },
  {
    id: "bento-dietary-pills",
    name: "Dietary & Allergen Tagged Card",
    category: "bento",
    author: "@cult-ui",
    requiredPlan: "free",
    description: "Explicit badges for Eggless, Sourdough Fermented, Nut-Free, and Vegan.",
    tags: ["dietary", "eggless", "vegan", "pills"],
    codeSnippet: `<div className="p-4 rounded-2xl bg-white border border-zinc-200 space-y-2">
  <div className="flex gap-1.5">
    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">🌱 Eggless</span>
    <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">🌾 100% Sourdough</span>
  </div>
</div>`,
  },
  {
    id: "bento-before-after",
    name: "Before/After Artisan Craft Card",
    category: "bento",
    author: "@fancy-components",
    requiredPlan: "pro",
    description: "Interactive slider showing raw dough kneading vs golden baked perfection.",
    tags: ["before-after", "craft", "slider", "artisan"],
    codeSnippet: `<div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 text-center">
  <span className="text-xs font-bold text-stone-500">36-Hour Cold Proof Process</span>
</div>`,
  },
  {
    id: "bento-matrix-compare",
    name: "Feature Comparison Grid",
    category: "bento",
    author: "@shadcn",
    requiredPlan: "pro",
    description: "Feature matrix comparing grocery bread with your artisan sourdough.",
    tags: ["comparison", "matrix", "features", "versus"],
    codeSnippet: `<div className="p-6 rounded-3xl bg-zinc-900 text-white max-w-4xl mx-auto space-y-4">
  <h3 className="text-xl font-bold">Commercial Bread vs Our Sourdough</h3>
</div>`,
  },
  {
    id: "bento-thumbnail-carousel",
    name: "Multi-Angle Thumbnail Product Card",
    category: "bento",
    author: "@motion-primitives",
    requiredPlan: "pro",
    description: "Mini thumbnail strip under main image for multi-angle bakery product view.",
    tags: ["thumbnail", "carousel", "multi-angle", "gallery"],
    codeSnippet: `<div className="p-4 rounded-2xl bg-white border border-zinc-200 space-y-3">
  <div className="aspect-video bg-zinc-100 rounded-xl" />
  <div className="flex gap-2">
    <div className="w-12 h-12 bg-zinc-200 rounded-lg" />
    <div className="w-12 h-12 bg-zinc-200 rounded-lg" />
  </div>
</div>`,
  },
  {
    id: "bento-shimmer-price",
    name: "Price Tag Discount Shimmer Card",
    category: "bento",
    author: "@magicui",
    requiredPlan: "pro",
    description: "Shimmering animated highlight on bundle pricing tags.",
    tags: ["shimmer", "discount", "bundle", "price"],
    codeSnippet: `<div className="p-5 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 flex justify-between items-center">
  <span className="font-bold text-sm text-purple-950">Weekend Breakfast Box</span>
  <span className="px-2.5 py-1 rounded-lg bg-purple-600 text-white font-mono text-xs font-bold">Save 20%</span>
</div>`,
  },
  {
    id: "bento-bakers-pick",
    name: "Chef & Maker Special Pick Card",
    category: "bento",
    author: "@craft-ui",
    requiredPlan: "starter",
    description: "Featured recommendation card with quote tag from the master baker.",
    tags: ["baker", "recommendation", "chef", "quote"],
    codeSnippet: `<div className="p-6 rounded-3xl bg-amber-50/80 border border-amber-200/90 space-y-3">
  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest">★ Baker's Choice</span>
  <h4 className="font-bold text-zinc-900 text-lg">Olive &amp; Rosemary Focaccia</h4>
</div>`,
  },
  {
    id: "bento-compact-mobile",
    name: "Compact Mobile Quick-Row Card",
    category: "bento",
    author: "@shadcn",
    requiredPlan: "free",
    description: "Streamlined horizontal row card optimized for high-speed mobile thumb shopping.",
    tags: ["mobile", "compact", "horizontal", "speed"],
    codeSnippet: `<div className="flex items-center justify-between p-3.5 rounded-xl bg-white border border-zinc-200">
  <div className="flex items-center gap-3">
    <div className="w-12 h-12 rounded-lg bg-zinc-100" />
    <div>
      <h5 className="font-bold text-xs text-zinc-900">Butter Croissant</h5>
      <span className="font-mono text-xs text-zinc-500">₹120</span>
    </div>
  </div>
  <button className="px-3 py-1 rounded-lg bg-purple-50 text-purple-700 font-bold text-xs">+ Add</button>
</div>`,
  },

  // ==========================================
  // CATEGORY 3: ANNOUNCEMENT & BANNERS (12 components)
  // ==========================================
  {
    id: "banner-infinite-marquee",
    name: "Infinite Running Marquee Ticker",
    category: "banner",
    author: "@magicui",
    requiredPlan: "starter",
    badge: "Trending 🔥",
    description: "Smooth horizontal scrolling text banner with bakery highlights, delivery alerts, and tags.",
    tags: ["marquee", "ticker", "scrolling", "announcement"],
    codeSnippet: `<div className="w-full bg-zinc-950 text-white py-2.5 overflow-hidden border-b border-zinc-800 text-xs font-semibold">
  <div className="flex items-center gap-8 whitespace-nowrap animate-marquee">
    <span>🥖 Sourdough Fermented for 36 Hours</span>
    <span>•</span>
    <span>🚚 Free Express Delivery on ₹1,000+</span>
    <span>•</span>
    <span>✨ Pure Butter Viennoiserie</span>
    <span>•</span>
    <span>🌾 100% Organic Flours</span>
  </div>
</div>`,
  },
  {
    id: "banner-shimmer-gradient",
    name: "Shimmer Gradient Top Bar",
    category: "banner",
    author: "@aceternity",
    requiredPlan: "pro",
    badge: "Staff Pick",
    description: "Animated reflective light beam passing across a vibrant purple gradient banner.",
    tags: ["shimmer", "gradient", "light", "reflective"],
    codeSnippet: `<div className="w-full bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 text-white py-2 px-4 text-center text-xs font-semibold relative overflow-hidden">
  <span className="relative z-10">🎉 Flat 10% off your first WhatsApp order with code FRESHSTART</span>
</div>`,
  },
  {
    id: "banner-countdown-sale",
    name: "Countdown Flash Sale Bar",
    category: "banner",
    author: "@shadcn",
    requiredPlan: "pro",
    description: "Live countdown clock showing hours, minutes, and seconds until today's order cutoff.",
    tags: ["countdown", "clock", "timer", "urgency"],
    codeSnippet: `<div className="bg-amber-500 text-black py-2 px-4 text-center text-xs font-bold flex items-center justify-center gap-2">
  <span>⚡ Order in next 02h 14m for Same-Day Evening Dispatch</span>
</div>`,
  },
  {
    id: "banner-free-shipping",
    name: "Free Shipping Progress Tracker",
    category: "banner",
    author: "@cult-ui",
    requiredPlan: "starter",
    description: "Dynamic visual progress meter showing how close buyer is to free delivery entitlement.",
    tags: ["shipping", "progress", "meter", "free-delivery"],
    codeSnippet: `<div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs text-emerald-900 font-medium">
  <span>Add ₹260 more for <strong>FREE Express Delivery</strong>!</span>
</div>`,
  },
  {
    id: "banner-dismissible-pill",
    name: "Floating Pill Notification",
    category: "banner",
    author: "@fancy-components",
    requiredPlan: "pro",
    description: "Floating rounded pill alert with smooth dismissal cross button.",
    tags: ["floating", "pill", "dismissible", "alert"],
    codeSnippet: `<div className="max-w-md mx-auto p-2.5 rounded-full bg-zinc-900 text-white text-xs flex items-center justify-between shadow-xl">
  <span className="pl-3">✨ Bengaluru Fresh Weekend Drop is Live</span>
  <button className="px-2 font-bold text-zinc-400 hover:text-white">&times;</button>
</div>`,
  },
  {
    id: "banner-neon-glow",
    name: "Neon Glow Accent Announcement",
    category: "banner",
    author: "@aceternity",
    requiredPlan: "pro",
    description: "High-contrast dark bar with pulsing neon cyan/violet glowing accent line.",
    tags: ["neon", "glow", "high-contrast", "dark"],
    codeSnippet: `<div className="bg-black text-white py-2 text-center text-xs font-mono border-b border-purple-500 shadow-sm">
  <span className="text-purple-400 font-bold">&gt;&gt;</span> BAKE CYCLE #412 IN PROGRESS
</div>`,
  },
  {
    id: "banner-multimessage-slider",
    name: "Multi-Message Auto Slide Bar",
    category: "banner",
    author: "@motion-primitives",
    requiredPlan: "pro",
    description: "Rotating carousel ticker smoothly transitioning between 3 promotional headlines.",
    tags: ["rotating", "slider", "messages", "carousel"],
    codeSnippet: `<div className="bg-zinc-100 py-2 text-center text-xs font-semibold text-zinc-700">
  <span>✨ All bakes made without chemicals, preservatives, or artificial improvers.</span>
</div>`,
  },
  {
    id: "banner-whatsapp-status",
    name: "WhatsApp Live Ping Status Bar",
    category: "banner",
    author: "@shadcn",
    requiredPlan: "starter",
    description: "Live connection badge showing baker is currently active and answering on WhatsApp.",
    tags: ["whatsapp", "status", "active", "online"],
    codeSnippet: `<div className="bg-emerald-600 text-white py-1.5 px-4 text-center text-xs font-semibold flex items-center justify-center gap-2">
  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
  <span>Baker is Online &bull; Instant Confirmation via WhatsApp</span>
</div>`,
  },
  {
    id: "banner-location-distance",
    name: "Local Neighborhood Radius Bar",
    category: "banner",
    author: "@cult-ui",
    requiredPlan: "free",
    description: "Hyper-local badge confirming delivery radius (e.g. Indiranagar, Koramangala, Whitefield).",
    tags: ["location", "local", "delivery", "radius"],
    codeSnippet: `<div className="bg-purple-50 py-2 text-center text-xs font-semibold text-purple-900 border-b border-purple-100">
  <span>📍 Delivering fresh across Bengaluru within 5km radius of our studio.</span>
</div>`,
  },
  {
    id: "banner-centered-minimal",
    name: "Minimalist Hairline Top Tag",
    category: "banner",
    author: "@shadcn",
    requiredPlan: "free",
    description: "Subtle 28px hairline tag at top of page with muted micro-typography.",
    tags: ["minimalist", "hairline", "subtle", "clean"],
    codeSnippet: `<div className="py-1.5 text-center text-[11px] font-mono tracking-wider text-zinc-400 border-b border-zinc-100">
  HANDMADE IN SMALL BATCHES &bull; BENGALURU
</div>`,
  },
  {
    id: "banner-seasonal-ribbon",
    name: "Festive Holiday Ribbon Bar",
    category: "banner",
    author: "@fancy-components",
    requiredPlan: "pro",
    description: "Warm crimson holiday announcement for Diwali, Christmas, or New Year treats.",
    tags: ["festive", "holiday", "ribbon", "celebration"],
    codeSnippet: `<div className="bg-rose-700 text-white py-2 px-4 text-center text-xs font-bold">
  🎁 Festive Celebration Hampers Now Open for Booking
</div>`,
  },
  {
    id: "banner-welcome-toast",
    name: "Welcome First-Time Buyer Bar",
    category: "banner",
    author: "@shadcn",
    requiredPlan: "free",
    description: "Personalized welcome message for new visitors with a complimentary gift note.",
    tags: ["welcome", "greeting", "first-time", "gift"],
    codeSnippet: `<div className="bg-amber-100/80 text-amber-900 py-2 text-center text-xs font-bold">
  👋 First time here? Enjoy a complimentary mini brioche with your first sourdough order.
</div>`,
  },

  // ==========================================
  // CATEGORY 4: SOCIAL PROOF & TESTIMONIALS (15 components)
  // ==========================================
  {
    id: "proof-marquee-reviews",
    name: "Animated Marquee Reviews Wall",
    category: "social_proof",
    author: "@magicui",
    requiredPlan: "starter",
    badge: "Trending 🔥",
    description: "Infinitely looping dual-row review cards from genuine verified buyers.",
    tags: ["reviews", "marquee", "social-proof", "infinite"],
    codeSnippet: `<div className="py-12 bg-zinc-50 overflow-hidden space-y-4">
  <div className="flex gap-4 animate-marquee">
    <div className="p-4 rounded-2xl bg-white border border-zinc-200 min-w-[280px] shadow-xs">
      <div className="flex text-amber-400 text-xs">★★★★★</div>
      <p className="text-xs text-zinc-700 mt-2">“Best sourdough in Indiranagar by a mile!”</p>
      <span className="text-[10px] text-zinc-400 mt-2 block">— Ananya R., Bengaluru</span>
    </div>
  </div>
</div>`,
  },
  {
    id: "proof-avatar-stack",
    name: "Avatar Stack with 4.9★ Aggregate",
    category: "social_proof",
    author: "@shadcn",
    requiredPlan: "starter",
    badge: "Most Popular",
    description: "Overlapping customer customer avatar circles with gold stars and verified buyer tally.",
    tags: ["avatars", "rating", "stars", "aggregate"],
    codeSnippet: `<div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-zinc-200 max-w-sm">
  <div className="flex -space-x-2">
    <div className="w-8 h-8 rounded-full bg-purple-500 border-2 border-white text-[10px] text-white flex items-center justify-center font-bold">AR</div>
    <div className="w-8 h-8 rounded-full bg-pink-500 border-2 border-white text-[10px] text-white flex items-center justify-center font-bold">SM</div>
    <div className="w-8 h-8 rounded-full bg-indigo-500 border-2 border-white text-[10px] text-white flex items-center justify-center font-bold">VK</div>
  </div>
  <div>
    <div className="text-amber-500 text-xs font-bold">★★★★★ 4.9 / 5.0</div>
    <span className="text-[11px] text-zinc-500">Over 1,200+ local happy foodies</span>
  </div>
</div>`,
  },
  {
    id: "proof-verified-cards",
    name: "Verified Buyer Quote Cards",
    category: "social_proof",
    author: "@cult-ui",
    requiredPlan: "free",
    description: "Clean customer feedback card with verified green checkmark and city badge.",
    tags: ["verified", "quote", "testimonial", "card"],
    codeSnippet: `<div className="p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm space-y-3">
  <div className="flex items-center justify-between">
    <span className="font-bold text-sm text-zinc-900">Vikram K.</span>
    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] font-bold">✓ Verified Purchase</span>
  </div>
  <p className="text-xs text-zinc-600">“The crust crackles like music. You can taste the genuine slow fermentation.”</p>
</div>`,
  },
  {
    id: "proof-instagram-grid",
    name: "Instagram Social Proof Bento Wall",
    category: "social_proof",
    author: "@fancy-components",
    requiredPlan: "pro",
    description: "Live visual grid of customer tagged photos with Instagram handle watermark.",
    tags: ["instagram", "bento", "photos", "ugc"],
    codeSnippet: `<div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-5xl mx-auto my-8">
  <div className="aspect-square bg-zinc-200 rounded-2xl overflow-hidden relative group">
    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold">@thebutterroom</div>
  </div>
</div>`,
  },
  {
    id: "proof-google-reviews",
    name: "Google 5-Star Reviews Embed Badge",
    category: "social_proof",
    author: "@shadcn",
    requiredPlan: "starter",
    description: "Official-style Google G-Logo rating badge with review counter and link.",
    tags: ["google", "rating", "badge", "reviews"],
    codeSnippet: `<div className="inline-flex items-center gap-3 p-3 rounded-2xl bg-white border border-zinc-200 shadow-xs">
  <span className="font-bold text-sm text-zinc-900">Google Rating</span>
  <span className="text-amber-500 font-bold text-xs">★ 5.0</span>
  <span className="text-xs text-zinc-400">(184 reviews)</span>
</div>`,
  },
  {
    id: "proof-press-logos",
    name: "Press & Feature Mention Strip",
    category: "social_proof",
    author: "@magicui",
    requiredPlan: "pro",
    description: "Monochrome logo strip: 'As featured in LBB, Times Food, Bangalore Mirror'.",
    tags: ["press", "features", "media", "logos"],
    codeSnippet: `<div className="py-8 text-center border-y border-zinc-100">
  <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-400">Featured &amp; Loved In</span>
  <div className="flex justify-center gap-8 mt-4 text-xs font-bold text-zinc-400 grayscale">
    <span>LBB BENGALURU</span>
    <span>TIMES FOOD</span>
    <span>WHAT'S HOT</span>
  </div>
</div>`,
  },
  {
    id: "proof-video-card",
    name: "Customer Video Review Card",
    category: "social_proof",
    author: "@motion-primitives",
    requiredPlan: "pro",
    description: "Vertical reel-style video review thumbnail with play icon overlay.",
    tags: ["video", "reel", "thumbnail", "ugc"],
    codeSnippet: `<div className="relative aspect-[9/16] w-48 rounded-2xl overflow-hidden bg-zinc-900 text-white p-4 flex flex-col justify-between">
  <span className="text-[10px] bg-red-600 px-2 py-0.5 rounded-full font-bold">REEL REVIEW</span>
  <span className="text-xs font-bold">“Unboxing the Sourdough Box”</span>
</div>`,
  },
  {
    id: "proof-live-order-toast",
    name: "Live 'Ordered 3m ago' Toast Notification",
    category: "social_proof",
    author: "@cult-ui",
    requiredPlan: "pro",
    badge: "Trending 🔥",
    description: "Floating micro toast in bottom left showing live recent purchase activity.",
    tags: ["toast", "live-orders", "fomo", "urgency"],
    codeSnippet: `<div className="fixed bottom-4 left-4 z-40 p-3 rounded-2xl bg-white border border-zinc-200 shadow-xl flex items-center gap-3">
  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
  <div className="text-xs">
    <span className="font-bold text-zinc-900">Sneha from Koramangala</span>
    <span className="text-zinc-500 block text-[10px]">Ordered Country Loaf &bull; 4 mins ago</span>
  </div>
</div>`,
  },
  {
    id: "proof-whatsapp-chat-card",
    name: "WhatsApp Chat Screenshot Card",
    category: "social_proof",
    author: "@shadcn",
    requiredPlan: "pro",
    description: "Authentic chat bubble snippet capturing genuine customer WhatsApp praise.",
    tags: ["chat", "whatsapp", "bubble", "authentic"],
    codeSnippet: `<div className="p-4 rounded-2xl bg-[#EFEAE2] border border-zinc-300 max-w-sm space-y-2">
  <div className="p-3 rounded-xl bg-white rounded-tl-none shadow-xs text-xs text-zinc-800">
    “OMG the sourdough was warm and so soft! My kids finished the whole loaf in 10 minutes.”
  </div>
</div>`,
  },
  {
    id: "proof-rating-distribution",
    name: "Star Rating Breakdown Bars",
    category: "social_proof",
    author: "@shadcn",
    requiredPlan: "pro",
    description: "Detailed 5★, 4★, 3★ breakdown bars showing 96% 5-star ratio.",
    tags: ["breakdown", "distribution", "ratings", "statistics"],
    codeSnippet: `<div className="p-6 rounded-3xl bg-white border border-zinc-200 max-w-md space-y-2 text-xs">
  <div className="flex items-center gap-2">
    <span>5 Star</span>
    <div className="flex-1 bg-zinc-100 h-2 rounded-full overflow-hidden">
      <div className="bg-amber-400 h-full w-[94%]" />
    </div>
    <span>94%</span>
  </div>
</div>`,
  },
  {
    id: "proof-community-counter",
    name: "Community Counter ('2,400+ Foodies')",
    category: "social_proof",
    author: "@magicui",
    requiredPlan: "starter",
    description: "Animated counting numbers celebrating community orders delivered.",
    tags: ["counter", "community", "milestone", "numbers"],
    codeSnippet: `<div className="p-8 text-center bg-purple-50 rounded-3xl border border-purple-200">
  <span className="text-4xl font-black text-purple-900 font-mono">2,480+</span>
  <p className="text-xs font-bold text-purple-700 mt-1">Artisan Loaves Baked &amp; Delivered in 2026</p>
</div>`,
  },
  {
    id: "proof-signature-guarantee",
    name: "Handwritten Signature Guarantee",
    category: "social_proof",
    author: "@craft-ui",
    requiredPlan: "free",
    description: "Founder signature stamp guaranteeing pure traditional sourdough craftsmanship.",
    tags: ["signature", "guarantee", "craft", "promise"],
    codeSnippet: `<div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 text-center space-y-2">
  <p className="font-serif italic text-sm text-stone-800">“If it's not the best sourdough you've had this week, we'll replace it no questions asked.”</p>
  <span className="text-xs font-bold text-stone-500">— Founder, Head Baker</span>
</div>`,
  },
  {
    id: "proof-case-study",
    name: "Celebration Cake Case Study Card",
    category: "social_proof",
    author: "@fancy-components",
    requiredPlan: "pro",
    description: "Visual spotlight on custom wedding cake creation with client testimonial.",
    tags: ["case-study", "wedding", "custom", "celebration"],
    codeSnippet: `<div className="p-6 rounded-3xl bg-white border border-zinc-200 flex gap-4 items-center">
  <div className="w-20 h-20 rounded-2xl bg-zinc-100 shrink-0" />
  <div className="space-y-1">
    <h4 className="font-bold text-sm">Ria &amp; Kabir's 3-Tier Pistachio Wedding Cake</h4>
    <p className="text-xs text-zinc-500">“Everyone kept asking where the cake came from!”</p>
  </div>
</div>`,
  },
  {
    id: "proof-trustpilot-seal",
    name: "Verified Storefront Trust Seal",
    category: "social_proof",
    author: "@shadcn",
    requiredPlan: "free",
    description: "Green verified padlock shield confirming genuine direct-from-artisan store.",
    tags: ["seal", "trust", "verified", "shield"],
    codeSnippet: `<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
  <span>🛡️ Verified Independent Artisan Storefront</span>
</div>`,
  },
  {
    id: "proof-influencer-quote",
    name: "Food Critic Recommendation Quote",
    category: "social_proof",
    author: "@craft-ui",
    requiredPlan: "pro",
    description: "High-profile foodie recommendation with avatar, publication tag, and quote.",
    tags: ["critic", "foodie", "influencer", "quote"],
    codeSnippet: `<div className="p-6 rounded-3xl bg-zinc-950 text-white space-y-3">
  <p className="text-sm italic">“The laminations on these croissants rival Paris.”</p>
  <span className="text-xs text-purple-400 font-bold block">— Bengaluru Food Diary</span>
</div>`,
  },

  // ==========================================
  // CATEGORY 5: BADGES, BUTTONS & CTAS (14 components)
  // ==========================================
  {
    id: "badge-shimmer-button",
    name: "Shimmer Border Glow Action Button",
    category: "badges",
    author: "@magicui",
    requiredPlan: "pro",
    badge: "Trending 🔥",
    description: "High-conversion CTA button with revolving border shimmer animation.",
    tags: ["shimmer", "button", "cta", "conversion"],
    codeSnippet: `<button className="relative px-6 py-3 rounded-2xl bg-purple-600 text-white font-bold text-sm shadow-xl overflow-hidden hover:scale-105 transition-transform">
  <span className="relative z-10">Order via WhatsApp Now &rarr;</span>
</button>`,
  },
  {
    id: "badge-whatsapp-pulse",
    name: "WhatsApp Direct Pulse Floating Button",
    category: "badges",
    author: "@shadcn",
    requiredPlan: "starter",
    badge: "Most Popular",
    description: "Fixed floating WhatsApp bubble in bottom right with pulsing green radar beacon.",
    tags: ["whatsapp", "floating", "pulse", "beacon"],
    codeSnippet: `<div className="fixed bottom-6 right-6 z-50">
  <a href="#" className="flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-2xl transition-all">
    <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
    <span>Order on WhatsApp</span>
  </a>
</div>`,
  },
  {
    id: "badge-magnetic-button",
    name: "Magnetic Kinetic Spring Button",
    category: "badges",
    author: "@aceternity",
    requiredPlan: "pro",
    description: "Interactive button smoothly shifting toward the user's cursor on proximity.",
    tags: ["magnetic", "kinetic", "spring", "cursor"],
    codeSnippet: `<button className="px-5 py-2.5 rounded-xl bg-zinc-900 text-white font-semibold text-xs hover:bg-black transition-colors shadow-sm">
  Explore Today's Bakes
</button>`,
  },
  {
    id: "badge-ripple-effect",
    name: "Ripple Click Effect Order Button",
    category: "badges",
    author: "@cult-ui",
    requiredPlan: "pro",
    description: "Material design water-ripple wave originating from the exact click coordinate.",
    tags: ["ripple", "click", "material", "effect"],
    codeSnippet: `<button className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs active:bg-purple-700 transition-colors">
  Add to Cart &bull; ₹180
</button>`,
  },
  {
    id: "badge-live-dot",
    name: "Animated Green Dot 'Baking Now' Pill",
    category: "badges",
    author: "@shadcn",
    requiredPlan: "starter",
    description: "Minimalist pill badge with animated status dot indicating active oven operations.",
    tags: ["live-dot", "pill", "status", "baking"],
    codeSnippet: `<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
  <span>Fresh Batch in Oven &bull; Ready at 2 PM</span>
</div>`,
  },
  {
    id: "badge-floating-cart",
    name: "Floating Quick Cart Counter Drawer",
    category: "badges",
    author: "@magicui",
    requiredPlan: "pro",
    description: "Floating action pill showing total items, running sum, and checkout button.",
    tags: ["floating", "cart", "drawer", "checkout"],
    codeSnippet: `<div className="p-3 rounded-2xl bg-zinc-950 text-white flex items-center justify-between gap-4 shadow-2xl">
  <span className="text-xs">3 Items &bull; <strong>₹540</strong></span>
  <button className="px-3 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold">Checkout &rarr;</button>
</div>`,
  },
  {
    id: "badge-share-store",
    name: "Share Storefront Native Mobile Pill",
    category: "badges",
    author: "@cult-ui",
    requiredPlan: "starter",
    description: "One-click button that invokes mobile native share dialog (WhatsApp, Instagram).",
    tags: ["share", "native", "mobile", "viral"],
    codeSnippet: `<button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-medium">
  <span>Share Store Link</span>
</button>`,
  },
  {
    id: "badge-copy-url",
    name: "Copy Store URL Quick Pill",
    category: "badges",
    author: "@shadcn",
    requiredPlan: "free",
    description: "Copy-to-clipboard button with animated 'Copied!' toast feedback.",
    tags: ["copy", "clipboard", "toast", "url"],
    codeSnippet: `<button className="px-3 py-1.5 rounded-lg border border-zinc-200 bg-white text-xs font-bold text-zinc-700 hover:bg-zinc-50">
  Copy Store URL
</button>`,
  },
  {
    id: "badge-back-to-top",
    name: "Back-to-Top Floating Chevron",
    category: "badges",
    author: "@fancy-components",
    requiredPlan: "free",
    description: "Discreet floating arrow returning shoppers to header from bottom of long catalogs.",
    tags: ["back-to-top", "chevron", "scroll", "floating"],
    codeSnippet: `<button className="w-10 h-10 rounded-full bg-white border border-zinc-200 shadow-lg flex items-center justify-center text-zinc-600 hover:text-zinc-900">&uarr;</button>`,
  },
  {
    id: "badge-bookmark-store",
    name: "Bookmark Storefront Pill",
    category: "badges",
    author: "@shadcn",
    requiredPlan: "pro",
    description: "Save / Star button to save this artisan store to buyer's browser favorites.",
    tags: ["bookmark", "favorite", "save", "star"],
    codeSnippet: `<button className="px-3 py-1 rounded-full border border-zinc-200 text-xs text-zinc-600">★ Save Store</button>`,
  },
  {
    id: "badge-instagram-dm",
    name: "Instagram Direct DM Quick Button",
    category: "badges",
    author: "@cult-ui",
    requiredPlan: "pro",
    description: "Gradient pink/purple button opening Instagram direct message thread.",
    tags: ["instagram", "dm", "social", "gradient"],
    codeSnippet: `<button className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold shadow-sm">DM on Instagram</button>`,
  },
  {
    id: "badge-upi-fast-pay",
    name: "UPI Fast Pay Floating Trigger",
    category: "badges",
    author: "@magicui",
    requiredPlan: "pro",
    description: "Instant trigger revealing dynamic QR code and 1-click UPI pay link.",
    tags: ["upi", "qr", "fast-pay", "1-click"],
    codeSnippet: `<button className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold">⚡ Pay via UPI</button>`,
  },
  {
    id: "badge-eggless-seal",
    name: "Pure Vegetarian Green Dot Seal",
    category: "badges",
    author: "@shadcn",
    requiredPlan: "free",
    description: "Standard green square with green inner dot signaling 100% vegetarian / eggless.",
    tags: ["eggless", "vegetarian", "green-dot", "seal"],
    codeSnippet: `<div className="w-4 h-4 rounded-sm border-2 border-emerald-600 flex items-center justify-center">
  <div className="w-2 h-2 rounded-full bg-emerald-600" />
</div>`,
  },
  {
    id: "badge-gluten-free",
    name: "Gluten-Sensitive Grain Tag",
    category: "badges",
    author: "@cult-ui",
    requiredPlan: "free",
    description: "Specialized amber dietary tag for almond-flour and ancient grain recipes.",
    tags: ["gluten-free", "grain", "dietary", "tag"],
    codeSnippet: `<span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">🌾 Ancient Grain</span>`,
  },

  // ==========================================
  // CATEGORY 6: TRUST SEALS & FEATURES (12 components)
  // ==========================================
  {
    id: "feat-3col-trust",
    name: "3-Column Visual Trust Icons",
    category: "features",
    author: "@shadcn",
    requiredPlan: "starter",
    badge: "Most Popular",
    description: "Classic conversion tri-fold: Fresh Daily, 0 Artificial Chemicals, Temperature Safe Delivery.",
    tags: ["trust", "icons", "conversion", "features"],
    codeSnippet: `<div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto my-12 p-6 rounded-3xl bg-white border border-zinc-200">
  <div className="text-center space-y-2">
    <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto font-bold">🥖</div>
    <h4 className="font-bold text-sm text-zinc-900">Baked Every Dawn</h4>
    <p className="text-xs text-zinc-500">Never frozen, never yesterday's stock.</p>
  </div>
  <div className="text-center space-y-2">
    <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto font-bold">🌿</div>
    <h4 className="font-bold text-sm text-zinc-900">Zero Artificial Additives</h4>
    <p className="text-xs text-zinc-500">Only flour, water, salt, and patient wild yeast.</p>
  </div>
  <div className="text-center space-y-2">
    <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto font-bold">🚚</div>
    <h4 className="font-bold text-sm text-zinc-900">Careful Eco-Packaging</h4>
    <p className="text-xs text-zinc-500">Delivered in breathable craft paper boxes.</p>
  </div>
</div>`,
  },
  {
    id: "feat-fermentation-timeline",
    name: "Fermentation Timeline Graphic",
    category: "features",
    author: "@craft-ui",
    requiredPlan: "pro",
    description: "4-step visual journey: Autolyse (2h) &rarr; Bulk Proof (6h) &rarr; Cold Retard (24h) &rarr; Hearth Bake.",
    tags: ["timeline", "fermentation", "craft", "process"],
    codeSnippet: `<div className="p-8 rounded-3xl bg-stone-50 border border-stone-200 max-w-4xl mx-auto my-8 space-y-4">
  <h3 className="font-bold text-base text-stone-900 text-center">Our 36-Hour Sourdough Cycle</h3>
</div>`,
  },
  {
    id: "feat-hygiene-seal",
    name: "Hygiene & FSSAI Standards Seal",
    category: "features",
    author: "@shadcn",
    requiredPlan: "starter",
    description: "Clean sanitation card highlighting commercial-grade kitchen cleanliness standards.",
    tags: ["hygiene", "fssai", "safety", "cleanliness"],
    codeSnippet: `<div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-center gap-3">
  <span className="text-emerald-700 font-bold text-xl">🛡️</span>
  <div>
    <h5 className="font-bold text-xs text-emerald-950">FSSAI Certified Artisan Kitchen</h5>
    <p className="text-[10px] text-emerald-800">100% stainless steel prep surfaces &amp; daily sanitization.</p>
  </div>
</div>`,
  },
  {
    id: "feat-maker-bio",
    name: "Artisan Maker Bio & Studio Journey",
    category: "features",
    author: "@craft-ui",
    requiredPlan: "pro",
    badge: "Staff Pick",
    description: "Warm founder profile with portrait, baker story, and neighborhood philosophy.",
    tags: ["founder", "bio", "portrait", "story"],
    codeSnippet: `<div className="max-w-4xl mx-auto my-12 p-8 rounded-3xl bg-white border border-zinc-200 grid md:grid-cols-3 gap-6 items-center">
  <div className="aspect-square rounded-2xl bg-zinc-100 overflow-hidden" />
  <div className="md:col-span-2 space-y-3">
    <span className="text-xs font-bold text-purple-600 uppercase">Behind The Ovens</span>
    <h3 className="text-xl font-bold text-zinc-900">“We started this bakehouse to bring real bread back to our community.”</h3>
  </div>
</div>`,
  },
  {
    id: "feat-accordion-faq",
    name: "Interactive Accordion FAQ Block",
    category: "features",
    author: "@shadcn",
    requiredPlan: "pro",
    badge: "Trending 🔥",
    description: "Collapsible answers to top questions: delivery timings, shelf life, reheating, eggless options.",
    tags: ["faq", "accordion", "answers", "questions"],
    codeSnippet: `<div className="max-w-3xl mx-auto my-12 space-y-3">
  <h3 className="font-bold text-lg text-zinc-900 mb-4">Frequently Asked Questions</h3>
  <details className="p-4 rounded-2xl bg-white border border-zinc-200">
    <summary className="font-bold text-xs cursor-pointer">How long does your sourdough stay fresh?</summary>
    <p className="text-xs text-zinc-500 mt-2">Up to 4-5 days on the counter in a bread box or sliced and frozen for 1 month.</p>
  </details>
</div>`,
  },
  {
    id: "feat-order-steps",
    name: "3-Step WhatsApp Order Guide",
    category: "features",
    author: "@shadcn",
    requiredPlan: "starter",
    description: "Visual 1 &rarr; 2 &rarr; 3 infographic explaining frictionless WhatsApp ordering.",
    tags: ["steps", "guide", "infographic", "order"],
    codeSnippet: `<div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto my-8">
  <div className="p-4 rounded-2xl bg-white border border-zinc-200 text-center">
    <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold inline-flex items-center justify-center text-xs">1</span>
    <h5 className="font-bold text-xs mt-2">Pick Your Bakes</h5>
  </div>
  <div className="p-4 rounded-2xl bg-white border border-zinc-200 text-center">
    <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold inline-flex items-center justify-center text-xs">2</span>
    <h5 className="font-bold text-xs mt-2">Send Order to WhatsApp</h5>
  </div>
  <div className="p-4 rounded-2xl bg-white border border-zinc-200 text-center">
    <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold inline-flex items-center justify-center text-xs">3</span>
    <h5 className="font-bold text-xs mt-2">Pay via UPI &amp; Enjoy</h5>
  </div>
</div>`,
  },
  {
    id: "feat-dispatch-schedule",
    name: "Operating Hours & Dispatch Schedule",
    category: "features",
    author: "@cult-ui",
    requiredPlan: "free",
    description: "Clean weekday schedule table showing morning and evening dispatch slots.",
    tags: ["schedule", "hours", "dispatch", "slots"],
    codeSnippet: `<div className="p-6 rounded-3xl bg-zinc-50 border border-zinc-200 max-w-md mx-auto space-y-2 text-xs">
  <div className="flex justify-between py-1 border-b border-zinc-200">
    <span className="font-medium text-zinc-500">Morning Bake Dispatch</span>
    <span className="font-bold text-zinc-900">08:00 AM – 11:30 AM</span>
  </div>
  <div className="flex justify-between py-1">
    <span className="font-medium text-zinc-500">Evening Sourdough Pull</span>
    <span className="font-bold text-zinc-900">04:30 PM – 07:30 PM</span>
  </div>
</div>`,
  },
  {
    id: "feat-packaging-guarantee",
    name: "Eco-Friendly Box Guarantee",
    category: "features",
    author: "@fancy-components",
    requiredPlan: "free",
    description: "Sustainability badge explaining unbleached paper boxes and zero plastic packaging.",
    tags: ["eco", "packaging", "sustainable", "zero-plastic"],
    codeSnippet: `<div className="p-4 rounded-2xl bg-stone-100 text-center text-xs text-stone-700">
  <span>🌱 Packaged in 100% recyclable, plastic-free breathable bakery kraft boxes.</span>
</div>`,
  },
  {
    id: "feat-bulk-catering",
    name: "Bulk Catering & Event Inquiries",
    category: "features",
    author: "@shadcn",
    requiredPlan: "pro",
    description: "Callout block for office catering, wedding bread baskets, and birthday treats.",
    tags: ["catering", "events", "bulk", "corporate"],
    codeSnippet: `<div className="p-8 rounded-3xl bg-zinc-900 text-white max-w-3xl mx-auto my-8 flex flex-col sm:flex-row justify-between items-center gap-4">
  <div>
    <h4 className="text-lg font-bold">Planning a Party or Event?</h4>
    <p className="text-xs text-zinc-400">Custom dessert tables and mini croissant boxes for 20 to 200 guests.</p>
  </div>
  <button className="px-4 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs shrink-0">Inquire via WhatsApp</button>
</div>`,
  },
  {
    id: "feat-custom-cake-form",
    name: "Celebration Cake Customization Note",
    category: "features",
    author: "@craft-ui",
    requiredPlan: "pro",
    description: "Guidance on lead time for custom tier cakes and buttercream messages.",
    tags: ["cake", "custom", "lead-time", "celebration"],
    codeSnippet: `<div className="p-6 rounded-2xl bg-purple-50 border border-purple-200 text-xs space-y-2">
  <h5 className="font-bold text-purple-950">Custom Celebration Cakes</h5>
  <p className="text-purple-800">Please order custom buttercream cakes at least 48 hours in advance.</p>
</div>`,
  },
  {
    id: "feat-reheat-guide",
    name: "Artisan Reheating & Storage Guide",
    category: "features",
    author: "@craft-ui",
    requiredPlan: "pro",
    description: "Tips on crisping sourdough in toaster or oven for that day-one crackle.",
    tags: ["reheat", "storage", "tips", "oven"],
    codeSnippet: `<div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs space-y-1 text-amber-900">
  <span className="font-bold">Pro Baker Tip:</span>
  <p>Spritz loaf lightly with water and toast at 190°C for 5 minutes to restore glass-like crust.</p>
</div>`,
  },
  {
    id: "feat-flavor-notes",
    name: "Flavor Profile & Grain Origin Card",
    category: "features",
    author: "@fancy-components",
    requiredPlan: "free",
    description: "Tasting notes card: lactic acidity, nutty crust, wheaty sweet finish.",
    tags: ["flavor", "tasting", "grain", "notes"],
    codeSnippet: `<div className="p-4 rounded-2xl bg-white border border-zinc-200 text-xs">
  <span className="text-[10px] uppercase font-bold text-zinc-400">Flavor Profile</span>
  <p className="text-zinc-700 mt-1">Caramelized crust &bull; Mild lactic acidity &bull; Open honeycomb crumb</p>
</div>`,
  },

  // ==========================================
  // CATEGORY 7: FOOTERS & CONTACT (10 components)
  // ==========================================
  {
    id: "footer-multi-column",
    name: "Multi-Column Modern Footer",
    category: "footer",
    author: "@shadcn",
    requiredPlan: "starter",
    badge: "Most Popular",
    description: "Comprehensive 4-column footer with brand story, menu links, operating hours, and social icons.",
    tags: ["footer", "multi-column", "links", "social"],
    codeSnippet: `<footer className="bg-zinc-950 text-white pt-16 pb-12 mt-20 border-t border-zinc-800">
  <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
    <div className="space-y-3">
      <h4 className="font-bold text-base">The Butter Room</h4>
      <p className="text-xs text-zinc-400">Small-batch artisanal sourdough and pastries in Bengaluru.</p>
    </div>
    <div className="space-y-2 text-xs">
      <h5 className="font-bold uppercase tracking-wider text-zinc-400">Menu</h5>
      <p>Sourdough Loaves</p>
      <p>Viennoiserie</p>
      <p>Celebration Cakes</p>
    </div>
    <div className="space-y-2 text-xs">
      <h5 className="font-bold uppercase tracking-wider text-zinc-400">Hours</h5>
      <p>Tue – Sun: 8 AM – 8 PM</p>
      <p>Monday: Rest &amp; Prep</p>
    </div>
    <div className="space-y-2 text-xs">
      <h5 className="font-bold uppercase tracking-wider text-zinc-400">Direct Contact</h5>
      <p>WhatsApp: +91 98765 43210</p>
      <p>Indiranagar, Bengaluru</p>
    </div>
  </div>
</footer>`,
  },
  {
    id: "footer-whatsapp-mobile",
    name: "WhatsApp-First High-Contrast Mobile Footer",
    category: "footer",
    author: "@magicui",
    requiredPlan: "pro",
    badge: "Trending 🔥",
    description: "Mobile-first footer with prominent WhatsApp call button and 1-tap customer chat.",
    tags: ["footer", "whatsapp", "mobile-first", "high-contrast"],
    codeSnippet: `<footer className="bg-zinc-900 text-white p-8 text-center space-y-4 mt-16 rounded-t-3xl">
  <h4 className="font-bold text-lg">Have a question or custom request?</h4>
  <button className="px-6 py-3 rounded-2xl bg-emerald-500 text-white font-bold text-xs shadow-lg">Chat with us on WhatsApp</button>
</footer>`,
  },
  {
    id: "footer-map-directions",
    name: "Interactive Studio Directions & Map",
    category: "footer",
    author: "@cult-ui",
    requiredPlan: "pro",
    description: "Pickup location directions with Google Maps pin button and parking notes.",
    tags: ["map", "directions", "pickup", "location"],
    codeSnippet: `<div className="p-6 rounded-3xl bg-zinc-100 max-w-xl mx-auto text-center space-y-2">
  <span className="text-xs font-bold text-zinc-500 uppercase">Studio Pickup Point</span>
  <p className="text-sm font-bold text-zinc-900">12th Main, HAL 2nd Stage, Indiranagar, Bengaluru</p>
  <button className="px-4 py-2 rounded-xl bg-white border border-zinc-200 text-xs font-bold">Open Google Maps</button>
</div>`,
  },
  {
    id: "footer-social-cluster",
    name: "Social Media Linktree Cluster",
    category: "footer",
    author: "@fancy-components",
    requiredPlan: "starter",
    description: "Compact floating badge cluster linking Instagram, Facebook, and WhatsApp.",
    tags: ["social", "linktree", "cluster", "icons"],
    codeSnippet: `<div className="flex justify-center gap-3 py-6">
  <a className="p-2.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold">Instagram</a>
  <a className="p-2.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold">WhatsApp</a>
  <a className="p-2.5 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold">Facebook</a>
</div>`,
  },
  {
    id: "footer-vip-club",
    name: "VIP Weekend Drop Notification Club",
    category: "footer",
    author: "@shadcn",
    requiredPlan: "pro",
    description: "WhatsApp broadcast signup box for first access to weekend seasonal drops.",
    tags: ["vip", "newsletter", "broadcast", "club"],
    codeSnippet: `<div className="p-8 rounded-3xl bg-purple-900 text-white text-center max-w-xl mx-auto space-y-3">
  <h4 className="font-bold text-lg">Join the Weekend Baker's List</h4>
  <p className="text-xs text-purple-200">Receive Thursday previews of our weekend specialty menu.</p>
</div>`,
  },
  {
    id: "footer-fssai-legal",
    name: "FSSAI License & Artisan Badge Footer",
    category: "footer",
    author: "@shadcn",
    requiredPlan: "free",
    description: "Legally compliant food license badge and registration details for trust.",
    tags: ["fssai", "license", "legal", "compliance"],
    codeSnippet: `<div className="py-4 text-center text-[10px] text-zinc-400 border-t border-zinc-100">
  <span>FSSAI Lic. No: 11224333000412 &bull; Registered Artisan Enterprise</span>
</div>`,
  },
  {
    id: "footer-policies-strip",
    name: "Copyright & Policies Strip",
    category: "footer",
    author: "@shadcn",
    requiredPlan: "free",
    description: "Understated hairline footer with links to Terms, Refund Policy, and Privacy.",
    tags: ["copyright", "policies", "terms", "refund"],
    codeSnippet: `<div className="py-6 text-center text-xs text-zinc-400 border-t border-zinc-100 flex flex-wrap justify-center gap-4">
  <span>&copy; 2026 The Butter Room</span>
  <span>&bull;</span>
  <span>Privacy Policy</span>
  <span>&bull;</span>
  <span>Refund Policy</span>
  <span>&bull;</span>
  <span>Powered by SellNest</span>
</div>`,
  },
  {
    id: "footer-back-to-top-crest",
    name: "Back to Top with Brand Crest",
    category: "footer",
    author: "@craft-ui",
    requiredPlan: "pro",
    description: "Centered artisan crest stamp with smooth animated scroll-to-top action.",
    tags: ["back-to-top", "crest", "stamp", "brand"],
    codeSnippet: `<div className="py-8 text-center">
  <button className="text-xs font-bold text-zinc-400 hover:text-zinc-900">&uarr; Back to Top</button>
</div>`,
  },
  {
    id: "footer-live-status-clock",
    name: "Live Open/Closed Status Indicator",
    category: "footer",
    author: "@magicui",
    requiredPlan: "pro",
    badge: "Trending 🔥",
    description: "Real-time dynamic status badge showing whether orders are actively accepted right now.",
    tags: ["status", "clock", "open", "closed"],
    codeSnippet: `<div className="inline-flex items-center gap-2 p-2 px-3 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold">
  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
  <span>Kitchen is Open &bull; Taking Orders for Today</span>
</div>`,
  },
  {
    id: "footer-minimal-centered",
    name: "Minimalist Centered Clean Footer",
    category: "footer",
    author: "@shadcn",
    requiredPlan: "free",
    description: "Compact 1-row minimalist footer ideal for clean, modern stores.",
    tags: ["minimalist", "clean", "centered", "footer"],
    codeSnippet: `<footer className="py-10 text-center text-xs text-zinc-400 border-t border-zinc-100">
  <p className="font-semibold text-zinc-900">The Butter Room</p>
  <p className="mt-1">Handcrafted with wild yeast &bull; Bengaluru, India</p>
</footer>`,
  },
];

/**
 * Helper to filter components by category, plan tier, or search term
 */
export function filterComponents21st(
  components: Component21st[],
  category: ComponentCategory = "all",
  searchQuery = "",
  planTier: "all" | "free" | "starter" | "pro" = "all"
): Component21st[] {
  return components.filter((item) => {
    if (category !== "all" && item.category !== category) {
      return false;
    }
    if (planTier !== "all") {
      if (planTier === "free" && item.requiredPlan !== "free") return false;
      if (planTier === "starter" && item.requiredPlan === "pro") return false;
      // "pro" includes all
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      const matchAuthor = item.author.toLowerCase().includes(q);
      const matchTag = item.tags.some((t) => t.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchAuthor && !matchTag) {
        return false;
      }
    }
    return true;
  });
}

/**
 * Get a component by its ID
 */
export function get21stComponentById(id: string): Component21st | undefined {
  return TRENDING_21ST_COMPONENTS.find((c) => c.id === id);
}

