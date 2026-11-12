import { StoreTheme, StoreFont } from "./types";

export interface ThemeDefinition {
  id: StoreTheme;
  name: string;
  tagline: string;
  description: string;
  fontDefault: StoreFont;
  defaultAccent: string;
  defaultSecondary: string;
  styles: {
    fontFamily: string;
    bodyBg: string;
    cardBg: string;
    cardBorder: string;
    cardRadius: string;
    buttonRadius: string;
    badgeRadius: string;
    headerStyle: string;
    heroStyle: string;
    productCardStyle: string;
    accentGlow: string;
  };
}

export const STORE_THEMES: Record<string, ThemeDefinition> = {
  minimal: {
    id: "minimal",
    name: "Minimal",
    tagline: "Clean, timeless Scandinavian simplicity",
    description: "Clean white layout, sharp typography, borderless minimalism and focus on pure craft.",
    fontDefault: "sans",
    defaultAccent: "#18181B",
    defaultSecondary: "#71717A",
    styles: {
      fontFamily: "font-sans",
      bodyBg: "bg-white",
      cardBg: "bg-white",
      cardBorder: "border border-zinc-200/80 hover:border-zinc-400 transition-colors",
      cardRadius: "rounded-lg",
      buttonRadius: "rounded-md",
      badgeRadius: "rounded-sm",
      headerStyle: "bg-white/90 backdrop-blur-md border-b border-zinc-100",
      heroStyle: "bg-zinc-50 border-b border-zinc-100",
      productCardStyle: "group transition-all duration-200 hover:-translate-y-0.5",
      accentGlow: "shadow-none",
    },
  },
  modern: {
    id: "modern",
    name: "Modern",
    tagline: "Contemporary, tech-forward elegance",
    description: "Sleek glassmorphism, contemporary product cards with subtle glow, and dynamic typography.",
    fontDefault: "display",
    defaultAccent: "#7C3AED",
    defaultSecondary: "#4F46E5",
    styles: {
      fontFamily: "font-sans",
      bodyBg: "bg-[#FAFAFD]",
      cardBg: "bg-white",
      cardBorder: "border border-purple-100/60 hover:border-purple-300 shadow-sm hover:shadow-purple-glow transition-all",
      cardRadius: "rounded-2xl",
      buttonRadius: "rounded-xl",
      badgeRadius: "rounded-full",
      headerStyle: "bg-white/80 backdrop-blur-lg border-b border-purple-100/50 shadow-xs",
      heroStyle: "bg-gradient-to-b from-purple-50/70 via-white to-[#FAFAFD]",
      productCardStyle: "group transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover",
      accentGlow: "shadow-purple-glow",
    },
  },
  boutique: {
    id: "boutique",
    name: "Boutique",
    tagline: "Editorial luxury & artisanal warmth",
    description: "Warm linen tones, romantic serif titles, large full-bleed imagery and refined editorial accents.",
    fontDefault: "serif",
    defaultAccent: "#B45309",
    defaultSecondary: "#78350F",
    styles: {
      fontFamily: "font-serif",
      bodyBg: "bg-[#FAF8F5]",
      cardBg: "bg-[#FFFDF9]",
      cardBorder: "border border-amber-900/10 hover:border-amber-700/30 transition-colors shadow-xs",
      cardRadius: "rounded-xl",
      buttonRadius: "rounded-full",
      badgeRadius: "rounded-full",
      headerStyle: "bg-[#FAF8F5]/90 backdrop-blur-md border-b border-amber-900/10",
      heroStyle: "bg-[#F5F0E8] border-b border-amber-900/10",
      productCardStyle: "group transition-all duration-300 hover:-translate-y-1 hover:shadow-md",
      accentGlow: "shadow-md",
    },
  },
  playful: {
    id: "playful",
    name: "Playful",
    tagline: "Vibrant, friendly & delightfully rounded",
    description: "Bright pastel accents, ultra-rounded bubbly components, cheerful micro-interactions and bold badges.",
    fontDefault: "playful",
    defaultAccent: "#EC4899",
    defaultSecondary: "#8B5CF6",
    styles: {
      fontFamily: "font-playful",
      bodyBg: "bg-[#FFFDF9]",
      cardBg: "bg-white",
      cardBorder: "border-2 border-pink-100 hover:border-pink-300 shadow-sm hover:shadow-lg transition-all",
      cardRadius: "rounded-3xl",
      buttonRadius: "rounded-full",
      badgeRadius: "rounded-full",
      headerStyle: "bg-white/90 backdrop-blur-md border-b-2 border-pink-100/60 shadow-xs",
      heroStyle: "bg-gradient-to-r from-pink-50 via-purple-50 to-amber-50",
      productCardStyle: "group transition-all duration-300 hover:scale-[1.02] hover:-rotate-1",
      accentGlow: "shadow-lg",
    },
  },
};

export const FONT_OPTIONS: { id: StoreFont; name: string; preview: string; cssClass: string }[] = [
  { id: "sans", name: "Plus Jakarta Sans", preview: "Modern, clean, legible", cssClass: "font-sans" },
  { id: "serif", name: "Playfair Display", preview: "Editorial, luxury, artisanal", cssClass: "font-serif" },
  { id: "display", name: "Space Grotesk", preview: "Tech, contemporary, sharp", cssClass: "font-display" },
  { id: "playful", name: "Outfit", preview: "Friendly, soft, energetic", cssClass: "font-playful" },
];

export const PRESET_BRAND_COLORS = [
  { name: "SellNest Purple", primary: "#7C3AED", secondary: "#A78BFA" },
  { name: "Warm Amber", primary: "#D97706", secondary: "#FBBF24" },
  { name: "Deep Charcoal", primary: "#18181B", secondary: "#71717A" },
  { name: "Botanical Sage", primary: "#059669", secondary: "#34D399" },
  { name: "Artisan Terracotta", primary: "#EA580C", secondary: "#FB923C" },
  { name: "Raspberry Pink", primary: "#E11D48", secondary: "#F472B6" },
  { name: "Electric Indigo", primary: "#4F46E5", secondary: "#818CF8" },
  { name: "Ocean Teal", primary: "#0D9488", secondary: "#2DD4BF" },
];

export const PRESET_LOGOS = [
  { label: "Bakery Whisk", url: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=200&q=80" },
  { label: "Coffee Roaster", url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=200&q=80" },
  { label: "Minimal Atelier", url: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=200&q=80" },
  { label: "Ceramics & Craft", url: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=200&q=80" },
];

export const PRESET_BANNERS = [
  { label: "Artisanal Bakery Spread", url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1400&q=80" },
  { label: "Fresh Pastries & Flour", url: "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=1400&q=80" },
  { label: "Clean Minimal Studio", url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=80" },
  { label: "Craft Workshop & Warm Wood", url: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1400&q=80" },
  { label: "Boutique Floral Linen", url: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1400&q=80" },
];

export function getThemeConfig(themeKey?: string): ThemeDefinition {
  const key = (themeKey || "modern").toLowerCase();
  if (STORE_THEMES[key]) {
    return STORE_THEMES[key];
  }
  // Fallbacks for legacy theme names
  if (key === "lavender") return STORE_THEMES.modern;
  if (key === "ivory") return STORE_THEMES.boutique;
  if (key === "charcoal") return STORE_THEMES.minimal;
  if (key === "sage") return STORE_THEMES.boutique;
  return STORE_THEMES.modern;
}

export function getFontFamilyClass(font?: StoreFont): string {
  switch (font) {
    case "serif":
      return "font-serif";
    case "display":
      return "font-display";
    case "playful":
      return "font-playful";
    case "sans":
    default:
      return "font-sans";
  }
}

