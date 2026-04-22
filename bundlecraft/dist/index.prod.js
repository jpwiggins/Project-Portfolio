var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// vite.config.ts
var vite_config_exports = {};
__export(vite_config_exports, {
  default: () => vite_config_default
});
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
var __filename, __dirname, isDocker, projectRoot, clientPath, clientSrcPath, vite_config_default;
var init_vite_config = __esm({
  "vite.config.ts"() {
    "use strict";
    __filename = fileURLToPath(import.meta.url);
    __dirname = path.dirname(__filename);
    isDocker = !!process.env.CONTAINER;
    projectRoot = isDocker ? "/app" : __dirname;
    clientPath = path.resolve(projectRoot, "client");
    clientSrcPath = path.resolve(projectRoot, "client", "src");
    vite_config_default = defineConfig({
      plugins: [
        react()
      ],
      resolve: {
        alias: {
          "@": clientSrcPath,
          "@shared": path.resolve(projectRoot, "shared"),
          "@assets": path.resolve(projectRoot, "attached_assets")
        }
      },
      // Set root to client for proper resolution
      root: clientPath,
      // Explicitly set the build input
      build: {
        rollupOptions: {
          input: path.resolve(clientPath, "index.html")
        },
        outDir: path.resolve(projectRoot, "dist/public"),
        emptyOutDir: true
      },
      server: {
        fs: {
          strict: true,
          deny: ["**/.*"]
        }
      }
    });
  }
});

// server/index.prod.ts
import express3 from "express";

// server/routes.ts
import express from "express";
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  bundles: () => bundles,
  insertBundleSchema: () => insertBundleSchema,
  insertPriceAnalyticsSchema: () => insertPriceAnalyticsSchema,
  insertProductSchema: () => insertProductSchema,
  priceAnalytics: () => priceAnalytics,
  products: () => products,
  sessions: () => sessions,
  users: () => users
});
import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  decimal,
  integer
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull()
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);
var users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  printifyApiKey: text("printify_api_key"),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  subscriptionStatus: varchar("subscription_status").default("inactive"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var products = pgTable("products", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  printifyId: varchar("printify_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  sku: varchar("sku"),
  category: varchar("category"),
  imageUrl: text("image_url"),
  variants: jsonb("variants"),
  tags: jsonb("tags"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var bundles = pgTable("bundles", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description"),
  discountPercentage: decimal("discount_percentage", { precision: 5, scale: 2 }),
  bundlePrice: decimal("bundle_price", { precision: 10, scale: 2 }),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  productIds: integer("product_ids").array().notNull(),
  etsyDescription: text("etsy_description"),
  etsyListingData: text("etsy_listing_data"),
  productSkus: jsonb("product_skus"),
  variantDetails: jsonb("variant_details"),
  seoTags: jsonb("seo_tags"),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  status: varchar("status").default("draft"),
  suggestedPrice: decimal("suggested_price", { precision: 10, scale: 2 }),
  competitorAnalysis: jsonb("competitor_analysis"),
  marketTrends: jsonb("market_trends"),
  priceOptimizationScore: decimal("price_optimization_score", { precision: 5, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var priceAnalytics = pgTable("price_analytics", {
  id: serial("id").primaryKey(),
  bundleId: integer("bundle_id").notNull().references(() => bundles.id),
  marketSegment: varchar("market_segment").notNull(),
  averageMarketPrice: decimal("average_market_price", { precision: 10, scale: 2 }),
  competitorPrices: jsonb("competitor_prices"),
  demandScore: decimal("demand_score", { precision: 5, scale: 2 }),
  seasonalTrend: varchar("seasonal_trend"),
  recommendedPriceRange: jsonb("recommended_price_range"),
  analysisDate: timestamp("analysis_date").defaultNow()
});
var insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertBundleSchema = createInsertSchema(bundles).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
var insertPriceAnalyticsSchema = createInsertSchema(priceAnalytics).omit({
  id: true,
  analysisDate: true
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, and, inArray, desc } from "drizzle-orm";
var DatabaseStorage = class {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }
  async upsertUser(userData) {
    const [user] = await db.insert(users).values(userData).onConflictDoUpdate({
      target: users.id,
      set: {
        ...userData,
        updatedAt: /* @__PURE__ */ new Date()
      }
    }).returning();
    return user;
  }
  async updateUserPrintifyKey(userId, apiKey) {
    const [user] = await db.update(users).set({ printifyApiKey: apiKey, updatedAt: /* @__PURE__ */ new Date() }).where(eq(users.id, userId)).returning();
    return user;
  }
  async updateUserStripeInfo(userId, customerId, subscriptionId) {
    const [user] = await db.update(users).set({
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      subscriptionStatus: "active",
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(users.id, userId)).returning();
    return user;
  }
  // Product operations
  async getProductsByUserId(userId) {
    return await db.select().from(products).where(eq(products.userId, userId));
  }
  async createProduct(product) {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }
  async createManyProducts(productList) {
    if (productList.length === 0) return [];
    return await db.insert(products).values(productList).returning();
  }
  async deleteProductsByUserId(userId) {
    await db.delete(products).where(eq(products.userId, userId));
  }
  async getProductsByIds(productIds) {
    if (productIds.length === 0) return [];
    return await db.select().from(products).where(inArray(products.id, productIds));
  }
  // Bundle operations
  async getBundlesByUserId(userId) {
    return await db.select().from(bundles).where(eq(bundles.userId, userId));
  }
  async createBundle(bundle) {
    const [newBundle] = await db.insert(bundles).values(bundle).returning();
    return newBundle;
  }
  async updateBundle(id, bundleUpdate) {
    const [bundle] = await db.update(bundles).set({ ...bundleUpdate, updatedAt: /* @__PURE__ */ new Date() }).where(eq(bundles.id, id)).returning();
    return bundle;
  }
  async deleteBundle(id, userId) {
    await db.delete(bundles).where(and(eq(bundles.id, id), eq(bundles.userId, userId)));
  }
  async deleteBundleAdmin(id) {
    await db.delete(bundles).where(eq(bundles.id, id));
  }
  async getBundleById(id, userId) {
    const [bundle] = await db.select().from(bundles).where(and(eq(bundles.id, id), eq(bundles.userId, userId)));
    return bundle;
  }
  // Price Analytics operations
  async createPriceAnalytics(analytics) {
    const [newAnalytics] = await db.insert(priceAnalytics).values(analytics).returning();
    return newAnalytics;
  }
  async getPriceAnalyticsByBundleId(bundleId) {
    const [analytics] = await db.select().from(priceAnalytics).where(eq(priceAnalytics.bundleId, bundleId)).orderBy(desc(priceAnalytics.analysisDate)).limit(1);
    return analytics;
  }
  async updateBundlePricing(bundleId, pricing) {
    const [bundle] = await db.update(bundles).set({
      ...pricing,
      updatedAt: /* @__PURE__ */ new Date()
    }).where(eq(bundles.id, bundleId)).returning();
    return bundle;
  }
};
var storage = new DatabaseStorage();

// server/auth.ts
import session from "express-session";
import connectPg from "connect-pg-simple";
function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1e3;
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl,
    tableName: "sessions"
  });
  return session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: true,
    // Create sessions for unauthenticated users
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      // Enable secure cookies in production
      maxAge: sessionTtl,
      sameSite: "lax",
      domain: void 0,
      path: "/"
    }
  });
}
async function setupAuth(app2) {
  app2.set("trust proxy", 1);
  app2.use(getSession());
  app2.get("/api/logout", (req, res) => {
    console.log("\u{1F6AA} Logout request - Session ID:", req.sessionID);
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
      }
      res.clearCookie("connect.sid", {
        path: "/",
        domain: void 0,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
      });
      res.clearCookie("connect.sid");
      console.log("\u2705 Session destroyed and cookies cleared");
      res.json({ message: "Logout successful" });
    });
  });
}

// server/routes.ts
import bcrypt from "bcrypt";
function generateSEOTags({ bundleName, products: products2, bundlePrice, description }) {
  const categories = Array.from(new Set(products2.map((p) => p.category).filter(Boolean)));
  const allTags = products2.flatMap((p) => p.tags || []);
  const uniqueTags = Array.from(new Set(allTags)).filter((tag) => tag && typeof tag === "string");
  const primaryKeywords = [
    bundleName.toLowerCase(),
    ...categories.map((c) => c.toLowerCase()),
    "bundle",
    "set",
    "collection"
  ];
  const etsySeoTags = [
    ...primaryKeywords,
    ...uniqueTags.slice(0, 8),
    // Limit to 8 product tags
    "gift",
    "printify",
    "print on demand",
    "custom",
    "design",
    bundlePrice < 30 ? "affordable" : bundlePrice > 100 ? "premium" : "quality"
  ].filter((tag, index2, arr) => arr.indexOf(tag) === index2);
  const seoTitle = `${bundleName} - ${categories.join(" & ")} Bundle | ${Math.floor(bundlePrice * 1.2)}% Off`.substring(0, 60);
  const savings = Math.round((products2.reduce((sum, p) => sum + parseFloat(p.price), 0) - bundlePrice) / products2.reduce((sum, p) => sum + parseFloat(p.price), 0) * 100);
  const seoDescription = `Get ${products2.length} premium ${categories.join(" & ").toLowerCase()} items for $${bundlePrice.toFixed(2)}. Save ${savings}% with this curated bundle. ${description}`.substring(0, 160);
  return {
    seoTags: etsySeoTags.slice(0, 13),
    // Etsy allows 13 tags max
    seoTitle,
    seoDescription
  };
}
function generateEtsyListingData({ bundleName, products: products2, bundlePrice, originalPrice, discountPercentage }) {
  const productSkus = products2.map((product) => ({
    productId: product.id,
    printifyId: product.printifyId,
    sku: product.sku || `SKU-${product.printifyId}`,
    title: product.title,
    price: product.price,
    variants: product.variants || []
  }));
  const variantDetails = products2.flatMap((product) => {
    const variants = product.variants || [];
    console.log(`Including ALL variants from ${product.title}: ${variants.length} variants`);
    if (Array.isArray(variants) && variants.length > 0) {
      return variants.map((variant) => {
        let size = "One Size";
        let color = "Default";
        if (variant.options && Array.isArray(variant.options)) {
          const sizeOption = variant.options.find(
            (opt) => opt.name && (opt.name.toLowerCase().includes("size") || ["xs", "s", "m", "l", "xl", "xxl", "3xl", "4xl", "5xl"].includes(opt.value?.toLowerCase()))
          );
          const colorOption = variant.options.find(
            (opt) => opt.name && opt.name.toLowerCase().includes("color")
          );
          if (sizeOption) size = sizeOption.value || size;
          if (colorOption) color = colorOption.value || color;
        } else if (variant.title) {
          const titleParts = variant.title.split(" / ");
          if (titleParts.length >= 2) {
            color = titleParts[0].trim();
            size = titleParts[1].trim();
          } else {
            const sizeMatch = variant.title.match(/\b(XS|S|M|L|XL|XXL|3XL|4XL|5XL|2XL)\b/i);
            if (sizeMatch) {
              size = sizeMatch[0].toUpperCase();
              color = variant.title.replace(sizeMatch[0], "").trim().replace(/[\/\-\s]+$/, "");
            }
          }
        }
        return {
          productId: product.id,
          productTitle: product.title,
          productDescription: product.description || "",
          productCategory: product.category || "General",
          productTags: product.tags || [],
          variantId: variant.id || "N/A",
          sku: variant.sku || product.sku || `SKU-${product.printifyId}`,
          title: variant.title || "Default",
          originalPrice: variant.price ? (parseFloat(variant.price) / 100).toFixed(2) : parseFloat(product.price).toFixed(2),
          bundlePrice: bundlePrice.toFixed(2),
          // Same bundle price for all variants
          size,
          color,
          material: variant.material || "Standard",
          availability: variant.is_available ? "In Stock" : "Out of Stock",
          imageUrl: product.imageUrl || "",
          printifyId: product.printifyId
        };
      });
    } else {
      return [{
        productId: product.id,
        productTitle: product.title,
        productDescription: product.description || "",
        productCategory: product.category || "General",
        productTags: product.tags || [],
        variantId: "default",
        sku: product.sku || `SKU-${product.printifyId}`,
        title: "Default Variant",
        originalPrice: parseFloat(product.price).toFixed(2),
        bundlePrice: bundlePrice.toFixed(2),
        size: "One Size",
        color: "Default",
        material: "Standard",
        availability: "In Stock",
        imageUrl: product.imageUrl || "",
        printifyId: product.printifyId
      }];
    }
  });
  const listingText = `
\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
\u{1F31F} ${bundleName.toUpperCase()} - BUNDLE LISTING \u{1F31F}
\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550

\u{1F4B0} PRICING INFORMATION:
\u2022 Bundle Price: $${bundlePrice.toFixed(2)}
\u2022 Original Total: $${originalPrice.toFixed(2)}
\u2022 Your Savings: $${(originalPrice - bundlePrice).toFixed(2)} (${discountPercentage}% OFF)

\u{1F4E6} INCLUDED PRODUCTS:
${products2.map((product, index2) => `
${index2 + 1}. ${product.title}
   \u2022 SKU: ${product.sku || `SKU-${product.printifyId}`}
   \u2022 Individual Price: $${parseFloat(product.price).toFixed(2)}
   \u2022 Category: ${product.category || "General"}
`).join("")}

\u{1F3F7}\uFE0F COMPLETE SKU & VARIANT BREAKDOWN (ALL PRODUCT INFORMATION INCLUDED):
${variantDetails.map((variant, index2) => `
Variant ${index2 + 1}:
\u2022 Product: ${variant.productTitle}
\u2022 Category: ${variant.productCategory}
\u2022 SKU: ${variant.sku}
\u2022 Variant: ${variant.title}
\u2022 Original Price: $${variant.originalPrice}
\u2022 Bundle Price: $${variant.bundlePrice}
\u2022 Size: ${variant.size}
\u2022 Color: ${variant.color}
\u2022 Material: ${variant.material}
\u2022 Status: ${variant.availability}
\u2022 Printify ID: ${variant.printifyId}
`).join("")}

\u{1F4CB} COMPLETE ETSY SKU IMPORT FORMAT (${variantDetails.length} total variants from ${products2.length} products):
${variantDetails.map(
    (variant, index2) => `${index2 + 1}. SKU: ${variant.sku} | Price: $${variant.bundlePrice} | Qty: 999 | ${variant.size} - ${variant.color} | From: ${variant.productTitle}`
  ).join("\n")}

\u{1F4CB} ETSY VARIANT SETUP:
Variation 1 (Size): ${Array.from(new Set(variantDetails.map((v) => v.size))).join(", ")}
Variation 2 (Color): ${Array.from(new Set(variantDetails.map((v) => v.color))).join(", ")}

\u{1F3AF} ETSY LISTING SETUP STEPS:
1. Create ONE product on Etsy with bundle name: "${bundleName}"
2. Add custom variations for Size and Color (see options above)
3. Copy/paste ALL ${variantDetails.length} SKUs exactly as shown above
4. Each SKU gets price $${bundlePrice.toFixed(2)} and quantity 999
5. Download mockup images from each Printify product
6. Upload images to Etsy (max 10) and link to corresponding variants
7. Set main listing price: $${bundlePrice.toFixed(2)}

\u26A0\uFE0F CRITICAL: Include ALL variants from ALL products so customers can order any size/color combination

\u{1F6A8} IMPORTANT: Each SKU must match exactly as shown above for Printify order sync

\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
Ready to paste into your Etsy listing!
\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550
`;
  return {
    listingText,
    productSkus,
    variantDetails,
    totalVariants: variantDetails.length,
    pricing: {
      bundlePrice: bundlePrice.toFixed(2),
      originalPrice: originalPrice.toFixed(2),
      savings: (originalPrice - bundlePrice).toFixed(2),
      discountPercentage: discountPercentage.toString()
    }
  };
}
function generateProfessionalEtsyDescription({ bundleName, products: products2, bundlePrice, originalPrice, discountPercentage, description }) {
  const productTitles = products2.map((p) => p.title);
  const savings = originalPrice - bundlePrice;
  const allTags = products2.flatMap((p) => p.tags || []);
  const uniqueTags = Array.from(new Set(allTags)).slice(0, 8);
  return `\u{1F31F} ${bundleName.toUpperCase()} - SPECIAL BUNDLE DEAL! \u{1F31F}

\u{1F49D} WHAT'S INCLUDED:
${productTitles.map((title) => `\u2713 ${title}`).join("\n")}

\u{1F4B0} AMAZING SAVINGS:
\u2022 Bundle Price: $${bundlePrice.toFixed(2)}
\u2022 Regular Price: $${originalPrice.toFixed(2)}
\u2022 YOU SAVE: $${savings.toFixed(2)} (${discountPercentage}% OFF!)

\u{1F3AF} WHY CHOOSE THIS BUNDLE?
${description || "Perfect combination of quality and value! These items work beautifully together and make an excellent gift or addition to your collection."}

\u{1F4E6} WHAT YOU GET:
\u2022 High-quality print-on-demand products
\u2022 Fast processing and shipping
\u2022 Professional packaging
\u2022 100% satisfaction guarantee

\u{1F3F7}\uFE0F PERFECT FOR:
\u2022 Gift giving
\u2022 Personal collection
\u2022 Special occasions
\u2022 Everyday use

\u2B50 CUSTOMER SATISFACTION:
We're committed to your happiness! If you're not completely satisfied, we'll make it right.

\u{1F69A} SHIPPING & PROCESSING:
\u2022 Fast processing time
\u2022 Careful packaging
\u2022 Tracking information provided
\u2022 Multiple shipping options available

\u{1F6CD}\uFE0F ORDER NOW and save ${discountPercentage}% on this exclusive bundle!

#${uniqueTags.join(" #")} #Bundle #Sale #PrintOnDemand #QualityProducts #FastShipping #CustomerSatisfaction`;
}
function generatePricingAnalysis({ products: products2, bundleName, bundlePrice, originalPrice }) {
  const categories = Array.from(new Set(products2.map((p) => p.category)));
  const allTags = products2.flatMap((p) => p.tags || []);
  const uniqueTags = Array.from(new Set(allTags));
  let marketSegment = "general";
  if (categories.includes("apparel")) marketSegment = "fashion";
  if (categories.includes("home")) marketSegment = "home_decor";
  if (categories.includes("drinkware")) marketSegment = "lifestyle";
  const avgMarketPrices = {
    "fashion": { min: 45, max: 85, avg: 65 },
    "home_decor": { min: 35, max: 75, avg: 55 },
    "lifestyle": { min: 25, max: 65, avg: 45 },
    "general": { min: 30, max: 70, avg: 50 }
  };
  const marketData = avgMarketPrices[marketSegment] || avgMarketPrices.general;
  const pricePosition = (bundlePrice - marketData.min) / (marketData.max - marketData.min);
  let optimizationScore = 85;
  if (bundlePrice < marketData.min * 0.8) optimizationScore = 60;
  if (bundlePrice > marketData.max * 1.2) optimizationScore = 45;
  if (bundlePrice >= marketData.avg * 0.9 && bundlePrice <= marketData.avg * 1.1) optimizationScore = 95;
  const currentMonth = (/* @__PURE__ */ new Date()).getMonth();
  let seasonalTrend = "stable";
  if ([11, 0, 1].includes(currentMonth)) seasonalTrend = "high_demand";
  if ([5, 6, 7].includes(currentMonth)) seasonalTrend = "summer_boost";
  if ([8, 9].includes(currentMonth)) seasonalTrend = "back_to_school";
  const suggestedMin = Math.max(originalPrice * 0.7, marketData.min);
  const suggestedMax = Math.min(originalPrice * 0.9, marketData.max);
  const suggestedOptimal = (suggestedMin + suggestedMax) / 2;
  const competitorAnalysis = {
    marketPosition: bundlePrice < marketData.avg ? "below_market" : bundlePrice > marketData.avg ? "above_market" : "market_average",
    competitiveAdvantage: bundlePrice < marketData.avg * 0.95 ? "price_leader" : "value_proposition",
    marketGap: marketData.avg - bundlePrice
  };
  const marketTrends = {
    demandLevel: seasonalTrend === "high_demand" ? "high" : seasonalTrend === "stable" ? "medium" : "high",
    priceDirection: "stable",
    seasonalMultiplier: seasonalTrend === "high_demand" ? 1.15 : 1,
    trendingTags: uniqueTags.slice(0, 5)
  };
  return {
    suggestedPrice: suggestedOptimal,
    competitorAnalysis,
    marketTrends,
    priceOptimizationScore: optimizationScore,
    marketSegment,
    recommendedPriceRange: {
      min: suggestedMin,
      max: suggestedMax,
      optimal: suggestedOptimal
    }
  };
}
var ADMIN_CONFIG = {
  email: "joan@example.com",
  passwordHash: "$2b$10$go7.9fagV3ZCR/mdISrITuKBir.qX6EaNSCZMQ6WT8zwbprf3yHQW"
  // your-password
};
var isAnyAuthenticated = (req, res, next) => {
  console.log("Auth check - Session ID:", req.sessionID);
  console.log("Admin session:", req.session?.adminUser);
  if (req.session?.adminUser === "admin") {
    console.log("Admin user authenticated via session");
    req.user = {
      claims: {
        sub: "admin-user",
        email: "joan@example.com"
      }
    };
    return next();
  }
  console.log("Authentication failed - admin login required");
  return res.status(401).json({ message: "Admin access required" });
};
async function registerRoutes(app2) {
  app2.use(express.urlencoded({ extended: true }));
  await setupAuth(app2);
  app2.get("/api/clear-session", (req, res) => {
    console.log("Clearing all sessions for:", req.sessionID);
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
      }
      res.clearCookie("connect.sid", {
        path: "/",
        domain: void 0,
        httpOnly: true,
        secure: false
      });
      res.json({ message: "Session cleared successfully" });
    });
  });
  app2.get("/api/health", (req, res) => {
    res.status(200).json({
      status: "ok",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV
    });
  });
  app2.post("/api/admin/login", async (req, res) => {
    try {
      console.log("\u{1F510} Admin login attempt:", req.body);
      console.log("Request headers:", req.headers["content-type"]);
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }
      if (email === ADMIN_CONFIG.email && await bcrypt.compare(password, ADMIN_CONFIG.passwordHash)) {
        req.session.regenerate((err) => {
          if (err) {
            console.error("Session regeneration error:", err);
            return res.status(500).json({ message: "Session error" });
          }
          req.session.adminUser = "admin";
          req.session.save(async (saveErr) => {
            if (saveErr) {
              console.error("Session save error:", saveErr);
              return res.status(500).json({ message: "Session save failed" });
            }
            try {
              await storage.upsertUser({
                id: "admin-user",
                email,
                firstName: "Admin",
                lastName: "User",
                profileImageUrl: null
              });
              console.log("Admin login successful, session ID:", req.sessionID);
              res.json({ message: "Admin login successful", user: { id: "admin-user", email, role: "admin" } });
            } catch (storageError) {
              console.error("Error creating admin user:", storageError);
              res.json({ message: "Admin login successful", user: { id: "admin-user", email, role: "admin" } });
            }
          });
        });
      } else {
        res.status(401).json({ message: "Invalid admin credentials" });
      }
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });
  app2.post("/api/admin/logout", (req, res) => {
    console.log("Admin logout request");
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).json({ message: "Logout failed" });
      }
      res.clearCookie("connect.sid", {
        path: "/",
        domain: void 0,
        httpOnly: true,
        secure: false
      });
      console.log("Admin session destroyed successfully");
      res.json({ message: "Admin logout successful" });
    });
  });
  app2.get("/api/auth/user", isAnyAuthenticated, async (req, res) => {
    try {
      console.log("Auth user request - Session ID:", req.sessionID);
      console.log("Authenticated user:", req.user?.claims?.sub);
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  app2.post("/api/printify/setup", isAnyAuthenticated, async (req, res) => {
    try {
      const { apiKey } = req.body;
      const userId = req.user.claims.sub;
      if (!apiKey) {
        return res.status(400).json({ message: "API key is required" });
      }
      await storage.updateUserPrintifyKey(userId, apiKey);
      res.json({ message: "API key saved successfully" });
    } catch (error) {
      console.error("Error saving API key:", error);
      res.status(500).json({ message: "Failed to save API key" });
    }
  });
  app2.get("/api/products", isAnyAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const products2 = await storage.getProductsByUserId(userId);
      res.json(products2);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });
  app2.post("/api/products/sync", isAnyAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user?.printifyApiKey) {
        return res.status(400).json({ message: "Printify API key not configured" });
      }
      const shopsResponse = await fetch("https://api.printify.com/v1/shops.json", {
        headers: {
          "Authorization": `Bearer ${user.printifyApiKey}`,
          "Content-Type": "application/json"
        }
      });
      if (!shopsResponse.ok) {
        const errorText = await shopsResponse.text();
        console.error("Printify API error:", shopsResponse.status, errorText);
        console.error("API Key (first 10 chars):", user.printifyApiKey?.substring(0, 10));
        let errorMessage = "Failed to fetch shops from Printify";
        let helpText = "";
        if (shopsResponse.status === 401) {
          errorMessage = "Your Printify API key has expired or is invalid";
          helpText = "Please get a fresh API key from Printify Account Settings > API > Generate New Token";
        } else if (shopsResponse.status === 403) {
          errorMessage = "Access denied. Your API key doesn't have required permissions";
          helpText = "Ensure your API key has 'shops.read' and 'products.read' permissions";
        } else if (shopsResponse.status === 429) {
          errorMessage = "Rate limit exceeded";
          helpText = "Please try again in a few minutes";
        }
        return res.status(400).json({
          message: errorMessage,
          helpText,
          error: errorText,
          status: shopsResponse.status,
          needsNewApiKey: shopsResponse.status === 401
        });
      }
      const shopsData = await shopsResponse.json();
      console.log("Fetched shops:", shopsData);
      const shops = Array.isArray(shopsData) ? shopsData : shopsData.data || shopsData;
      if (!shops || !Array.isArray(shops) || shops.length === 0) {
        return res.status(400).json({ message: "No shops found in your Printify account" });
      }
      console.log(`\u2705 Found ${shops.length} shops, starting product sync...`);
      let allProducts = [];
      let successfulShops = 0;
      let failedShops = 0;
      for (let i = 0; i < shops.length; i++) {
        const shop = shops[i];
        console.log(`Fetching products from shop: ${shop.title} (ID: ${shop.id})`);
        try {
          const productsResponse = await fetch(`https://api.printify.com/v1/shops/${shop.id}/products.json?limit=50`, {
            headers: {
              "Authorization": `Bearer ${user.printifyApiKey}`,
              "Content-Type": "application/json",
              "User-Agent": "BundleCraft-App"
            }
          });
          if (productsResponse.ok) {
            const productsData = await productsResponse.json();
            const products2 = productsData.data || productsData;
            console.log(`Found ${products2?.length || 0} products in shop ${shop.title}`);
            if (products2 && Array.isArray(products2)) {
              allProducts = allProducts.concat(products2);
              successfulShops++;
            }
          } else if (productsResponse.status === 429) {
            console.log(`Rate limit hit for shop ${shop.title}, waiting 2 seconds...`);
            await new Promise((resolve) => setTimeout(resolve, 2e3));
            const retryResponse = await fetch(`https://api.printify.com/v1/shops/${shop.id}/products.json?limit=50`, {
              headers: {
                "Authorization": `Bearer ${user.printifyApiKey}`,
                "Content-Type": "application/json",
                "User-Agent": "BundleCraft-App"
              }
            });
            if (retryResponse.ok) {
              const retryData = await retryResponse.json();
              const retryProducts = retryData.data || retryData;
              if (retryProducts && Array.isArray(retryProducts)) {
                allProducts = allProducts.concat(retryProducts);
                successfulShops++;
              }
            } else {
              failedShops++;
              console.error(`Failed to fetch products from shop ${shop.title} after retry:`, retryResponse.status);
            }
          } else {
            failedShops++;
            console.error(`Failed to fetch products from shop ${shop.title}:`, productsResponse.status);
          }
          if (i < shops.length - 1) {
            await new Promise((resolve) => setTimeout(resolve, 1e3));
          }
        } catch (error) {
          failedShops++;
          console.error(`Error fetching from shop ${shop.title}:`, error);
        }
      }
      console.log(`Total products found: ${allProducts.length}`);
      await storage.deleteProductsByUserId(userId);
      const productsToInsert = allProducts.map((product) => {
        const variants = product.variants || [];
        console.log(`Product ${product.title}: ${variants.length} variants imported`);
        return {
          userId,
          printifyId: product.id.toString(),
          title: product.title,
          description: product.description || "",
          price: variants?.[0]?.price ? (variants[0].price / 100).toFixed(2) : "0.00",
          sku: variants?.[0]?.sku || `SKU-${product.id}`,
          category: product.tags?.[0] || "uncategorized",
          imageUrl: product.images?.[0]?.src || "",
          variants,
          // Store ALL variants for complete bundle creation
          tags: product.tags || []
        };
      });
      const savedProducts = await storage.createManyProducts(productsToInsert);
      const totalVariants = savedProducts.reduce((total, product) => {
        return total + (product.variants?.length || 0);
      }, 0);
      let message = `Successfully synced ${savedProducts.length} products with ${totalVariants} total variants`;
      if (failedShops > 0) {
        message += ` (${failedShops} shops had sync issues - this is normal due to API rate limits)`;
      }
      res.json({
        message,
        count: savedProducts.length,
        products: savedProducts,
        stats: {
          totalShops: shops.length,
          successfulShops,
          failedShops,
          totalProducts: allProducts.length
        }
      });
    } catch (error) {
      console.error("Error syncing products:", error);
      res.status(500).json({ message: "Failed to sync products" });
    }
  });
  app2.get("/api/bundles", isAnyAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const bundles2 = await storage.getBundlesByUserId(userId);
      res.json(bundles2);
    } catch (error) {
      console.error("Error fetching bundles:", error);
      res.status(500).json({ message: "Failed to fetch bundles" });
    }
  });
  app2.post("/api/bundles", isAnyAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const bundleData = insertBundleSchema.parse({
        ...req.body,
        userId
      });
      const products2 = await storage.getProductsByIds(bundleData.productIds);
      const originalPrice = products2.reduce((sum, product) => sum + parseFloat(product.price), 0);
      const discountAmount = originalPrice * (parseFloat(bundleData.discountPercentage?.toString() || "0") / 100);
      const bundlePrice = bundleData.bundlePrice ? parseFloat(bundleData.bundlePrice.toString()) : originalPrice - discountAmount;
      const etsyDescription = generateProfessionalEtsyDescription({
        bundleName: bundleData.name,
        products: products2,
        bundlePrice,
        originalPrice,
        discountPercentage: parseFloat(bundleData.discountPercentage?.toString() || "0"),
        description: bundleData.description || ""
      });
      const etsyListingData = generateEtsyListingData({
        bundleName: bundleData.name,
        products: products2,
        bundlePrice,
        originalPrice,
        discountPercentage: parseFloat(bundleData.discountPercentage?.toString() || "0")
      });
      const seoData = generateSEOTags({
        bundleName: bundleData.name,
        products: products2,
        bundlePrice,
        description: bundleData.description || ""
      });
      const pricingAnalysis = generatePricingAnalysis({
        products: products2,
        bundleName: bundleData.name,
        bundlePrice,
        originalPrice
      });
      const bundle = await storage.createBundle({
        ...bundleData,
        originalPrice: originalPrice.toString(),
        bundlePrice: bundlePrice.toString(),
        etsyDescription,
        etsyListingData: etsyListingData.listingText,
        productSkus: etsyListingData.productSkus,
        variantDetails: etsyListingData.variantDetails,
        seoTags: seoData.seoTags,
        seoTitle: seoData.seoTitle,
        seoDescription: seoData.seoDescription,
        suggestedPrice: pricingAnalysis.suggestedPrice.toString(),
        competitorAnalysis: pricingAnalysis.competitorAnalysis,
        marketTrends: pricingAnalysis.marketTrends,
        priceOptimizationScore: pricingAnalysis.priceOptimizationScore.toString()
      });
      await storage.createPriceAnalytics({
        bundleId: bundle.id,
        marketSegment: pricingAnalysis.marketSegment,
        averageMarketPrice: "50.00",
        // This would come from real market data
        competitorPrices: pricingAnalysis.competitorAnalysis,
        demandScore: "75.00",
        seasonalTrend: pricingAnalysis.marketTrends.demandLevel,
        recommendedPriceRange: pricingAnalysis.recommendedPriceRange
      });
      res.json(bundle);
    } catch (error) {
      console.error("Error creating bundle:", error);
      res.status(500).json({ message: "Failed to create bundle" });
    }
  });
  app2.get("/api/bundles/:id", isAnyAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const bundleId = parseInt(req.params.id);
      const bundle = await storage.getBundleById(bundleId, userId);
      if (!bundle) {
        return res.status(404).json({ message: "Bundle not found" });
      }
      res.json(bundle);
    } catch (error) {
      console.error("Error fetching bundle:", error);
      res.status(500).json({ message: "Failed to fetch bundle" });
    }
  });
  app2.delete("/api/bundles/:id", isAnyAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims?.sub || req.user.userId;
      const bundleId = parseInt(req.params.id);
      const isAdmin = userId === "admin-user";
      console.log(`Delete request - User ID: ${userId}, Bundle ID: ${bundleId}, Admin: ${isAdmin}`);
      if (isAdmin) {
        await storage.deleteBundleAdmin(bundleId);
        console.log(`Bundle ${bundleId} deleted by admin`);
      } else {
        const bundle = await storage.getBundleById(bundleId, userId);
        if (!bundle) {
          console.log(`Bundle not found or doesn't belong to user: ${bundleId} for user: ${userId}`);
          return res.status(404).json({ message: "Bundle not found or access denied" });
        }
        await storage.deleteBundle(bundleId, userId);
        console.log(`Bundle ${bundleId} deleted successfully for user ${userId}`);
      }
      res.json({ message: "Bundle deleted successfully" });
    } catch (error) {
      console.error("Error deleting bundle:", error);
      res.status(500).json({ message: "Failed to delete bundle" });
    }
  });
  app2.post("/api/bundles/:id/analyze-pricing", isAnyAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const bundleId = parseInt(req.params.id);
      const bundle = await storage.getBundleById(bundleId, userId);
      if (!bundle) {
        return res.status(404).json({ message: "Bundle not found" });
      }
      const products2 = await storage.getProductsByIds(bundle.productIds);
      const originalPrice = parseFloat(bundle.originalPrice || "0");
      const currentPrice = parseFloat(bundle.bundlePrice || "0");
      const pricingAnalysis = generatePricingAnalysis({
        products: products2,
        bundleName: bundle.name,
        bundlePrice: currentPrice,
        originalPrice
      });
      const updatedBundle = await storage.updateBundlePricing(bundleId, {
        suggestedPrice: pricingAnalysis.suggestedPrice.toString(),
        competitorAnalysis: pricingAnalysis.competitorAnalysis,
        marketTrends: pricingAnalysis.marketTrends,
        priceOptimizationScore: pricingAnalysis.priceOptimizationScore.toString()
      });
      await storage.createPriceAnalytics({
        bundleId,
        marketSegment: pricingAnalysis.marketSegment,
        averageMarketPrice: "50.00",
        competitorPrices: pricingAnalysis.competitorAnalysis,
        demandScore: "75.00",
        seasonalTrend: pricingAnalysis.marketTrends.demandLevel,
        recommendedPriceRange: pricingAnalysis.recommendedPriceRange
      });
      res.json({
        bundle: updatedBundle,
        pricingAnalysis
      });
    } catch (error) {
      console.error("Error analyzing pricing:", error);
      res.status(500).json({ message: "Failed to analyze pricing" });
    }
  });
  app2.get("/api/bundles/:id/pricing-analytics", isAnyAuthenticated, async (req, res) => {
    try {
      const userId = req.user.claims.sub;
      const bundleId = parseInt(req.params.id);
      const bundle = await storage.getBundleById(bundleId, userId);
      if (!bundle) {
        return res.status(404).json({ message: "Bundle not found" });
      }
      const analytics = await storage.getPriceAnalyticsByBundleId(bundleId);
      res.json({
        bundle,
        analytics,
        hasOptimization: !!(bundle.suggestedPrice && bundle.priceOptimizationScore)
      });
    } catch (error) {
      console.error("Error fetching pricing analytics:", error);
      res.status(500).json({ message: "Failed to fetch pricing analytics" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express2 from "express";
import fs from "fs";
import path2 from "path";
import { nanoid } from "nanoid";
var createViteServer;
var createLogger;
var viteConfig;
async function initVite() {
  if (process.env.NODE_ENV === "development") {
    const viteModule = await import("vite");
    createViteServer = viteModule.createServer;
    createLogger = viteModule.createLogger;
    viteConfig = (await Promise.resolve().then(() => (init_vite_config(), vite_config_exports))).default;
  }
}
if (process.env.NODE_ENV === "development") {
  await initVite();
}
var viteLogger = createLogger ? createLogger() : null;
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
function serveStatic(app2) {
  const distPath = path2.resolve(process.cwd(), "dist", "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express2.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.prod.ts
var app = express3();
app.use(express3.json());
app.use(express3.urlencoded({ extended: false }));
app.use((req, res, next) => {
  if (app.get("env") === "development") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Content-Security-Policy", "");
  } else {
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://m.stripe.network; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://api.stripe.com;"
    );
  }
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});
var rateLimitMap = /* @__PURE__ */ new Map();
app.use((req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  if (!ip) return next();
  const now = Date.now();
  const windowMs = 15 * 60 * 1e3;
  const maxRequests = 100;
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, []);
  }
  const requests = rateLimitMap.get(ip);
  const windowStart = now - windowMs;
  while (requests.length > 0 && requests[0] < windowStart) {
    requests.shift();
  }
  if (requests.length >= maxRequests) {
    return res.status(429).json({ error: "Too many requests" });
  }
  requests.push(now);
  next();
});
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    uptime: process.uptime(),
    environment: app.get("env")
  });
});
registerRoutes(app);
serveStatic(app);
var port = parseInt(process.env.PORT || "5000", 10);
var server = app.listen(port, "0.0.0.0", () => {
  log(`Server running on port ${port} in ${app.get("env")} mode`);
});
process.on("SIGTERM", () => {
  log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    log("Process terminated");
  });
});
process.on("SIGINT", () => {
  log("SIGINT received, shutting down gracefully");
  server.close(() => {
    log("Process terminated");
  });
});
var index_prod_default = app;
export {
  index_prod_default as default
};
