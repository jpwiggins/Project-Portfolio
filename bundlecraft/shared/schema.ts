import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  decimal,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
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
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const products = pgTable("products", {
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
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const bundles = pgTable("bundles", {
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
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const priceAnalytics = pgTable("price_analytics", {
  id: serial("id").primaryKey(),
  bundleId: integer("bundle_id").notNull().references(() => bundles.id),
  marketSegment: varchar("market_segment").notNull(),
  averageMarketPrice: decimal("average_market_price", { precision: 10, scale: 2 }),
  competitorPrices: jsonb("competitor_prices"),
  demandScore: decimal("demand_score", { precision: 5, scale: 2 }),
  seasonalTrend: varchar("seasonal_trend"),
  recommendedPriceRange: jsonb("recommended_price_range"),
  analysisDate: timestamp("analysis_date").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;
export type Product = typeof products.$inferSelect;
export type InsertBundle = typeof bundles.$inferInsert;
export type Bundle = typeof bundles.$inferSelect;
export type InsertPriceAnalytics = typeof priceAnalytics.$inferInsert;
export type PriceAnalytics = typeof priceAnalytics.$inferSelect;

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBundleSchema = createInsertSchema(bundles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPriceAnalyticsSchema = createInsertSchema(priceAnalytics).omit({
  id: true,
  analysisDate: true,
});
