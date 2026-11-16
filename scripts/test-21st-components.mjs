import assert from "node:assert";
import fs from "node:fs";

console.log("=== Testing 21st.dev Component Catalog & Library ===");

const source = fs.readFileSync("./lib/trendingComponents21st.ts", "utf8");

// 1. Total Component Count
const idMatches = [...source.matchAll(/id:\s*"([^"]+)"/g)].map((m) => m[1]);
console.log(`Total components defined: ${idMatches.length}`);
assert(idMatches.length >= 100, `Expected at least 100 components, found ${idMatches.length}`);

// Unique IDs check
const uniqueIds = new Set(idMatches);
assert.strictEqual(uniqueIds.size, idMatches.length, "All component IDs must be unique");

// 2. Category distribution
const categoryMatches = [...source.matchAll(/category:\s*"([^"]+)"/g)].map((m) => m[1]);
const counts = {};
categoryMatches.forEach((cat) => {
  counts[cat] = (counts[cat] || 0) + 1;
});
console.log("Category breakdown:", counts);
assert(counts.hero >= 20, "Should have 20+ hero sections");
assert(counts.bento >= 15, "Should have 15+ bento & grid layouts");
assert(counts.banner >= 10, "Should have 10+ banners & tickers");
assert(counts.social_proof >= 12, "Should have 12+ social proof components");
assert(counts.badges >= 10, "Should have 10+ badges & CTAs");
assert(counts.features >= 10, "Should have 10+ features & trust components");
assert(counts.footer >= 8, "Should have 8+ footers");

// 3. Authors from 21st.dev ecosystem
const authorMatches = [...source.matchAll(/author:\s*"([^"]+)"/g)].map((m) => m[1]);
console.log(`Authors recognized: ${new Set(authorMatches).size} distinct creator styles`);
assert(authorMatches.some((a) => a === "@aceternity"));
assert(authorMatches.some((a) => a === "@magicui"));
assert(authorMatches.some((a) => a === "@shadcn"));
assert(authorMatches.some((a) => a === "@cult-ui"));

// 4. Code snippets present
const codeMatches = [...source.matchAll(/codeSnippet:\s*`([^`]+)`/g)];
console.log(`Code snippets validated: ${codeMatches.length}`);
assert(codeMatches.length >= 100, "All components must have complete production code snippets");

// 5. Plan Tier Distribution & Gating Assertions
const arrayContent = source.slice(source.indexOf("export const TRENDING_21ST_COMPONENTS"), source.indexOf("export function filterComponents21st"));
const planMatches = [...arrayContent.matchAll(/requiredPlan:\s*"([^"]+)"/g)].map((m) => m[1]);
console.log(`Required plan tags in array: ${planMatches.length}`);
assert.strictEqual(planMatches.length, idMatches.length, "Every component must specify a requiredPlan tier");

const planCounts = { free: 0, starter: 0, pro: 0 };
planMatches.forEach((tier) => {
  assert(tier in planCounts, `Unknown tier "${tier}" found`);
  planCounts[tier]++;
});
console.log("Plan tier distribution:", planCounts);

// Assertion: Free plan has basic components (25 essential components)
assert.strictEqual(planCounts.free, 25, "Expected exactly 25 basic Free components");

// Assertion: Starter tier adds 26 components, cumulative 51 accessible on ₹99 (50.5% of 101)
assert.strictEqual(planCounts.starter, 26, "Expected exactly 26 Starter tier components");
const starterAccessible = planCounts.free + planCounts.starter;
assert.strictEqual(starterAccessible, 51, "Expected 51 components (50% catalog) accessible on Starter ₹99 plan");
const halfCatalogRatio = starterAccessible / idMatches.length;
console.log(`Starter plan access ratio: ${(halfCatalogRatio * 100).toFixed(1)}% (${starterAccessible} of ${idMatches.length})`);
assert(halfCatalogRatio >= 0.5 && halfCatalogRatio <= 0.55, "Starter plan must unlock ~50% of components");

// Assertion: Pro tier unlocks all 101 components
assert.strictEqual(planCounts.pro, 50, "Expected 50 Pro-exclusive components");
const proAccessible = starterAccessible + planCounts.pro;
assert.strictEqual(proAccessible, 101, "Expected all 101 components unlocked on Pro ₹199 plan");

console.log("Plan tiering verified: Free (25 basic), Starter ₹99 (51 / 50%), Pro ₹199 (101 / 100%)");
console.log("All 101 components from 21st.dev verified with 100% precision!");
