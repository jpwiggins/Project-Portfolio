import { pgTable, text, serial, integer, boolean, json, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable("sessions", {
  sid: varchar("sid").primaryKey(),
  sess: json("sess").notNull(),
  expire: timestamp("expire").notNull(),
});

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  credits: integer("credits").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const buyerProfiles = pgTable("buyer_profiles", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  niche: text("niche").notNull(),
  productType: text("product_type").notNull(),
  profileData: json("profile_data").notNull(),
  designRecommendations: json("design_recommendations").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").references(() => users.id),
  stripePaymentIntentId: varchar("stripe_payment_intent_id").notNull(),
  amount: integer("amount").notNull(), // in cents
  credits: integer("credits").notNull(),
  status: varchar("status").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const upsertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
});

export const insertBuyerProfileSchema = createInsertSchema(buyerProfiles).pick({
  userId: true,
  niche: true,
  productType: true,
  profileData: true,
  designRecommendations: true,
});

export const insertPaymentSchema = createInsertSchema(payments).pick({
  userId: true,
  stripePaymentIntentId: true,
  amount: true,
  credits: true,
  status: true,
});

export const generateProfileRequestSchema = z.object({
  niche: z.string().min(1, "Niche is required"),
  productType: z.string().min(1, "Product type is required"),
});

export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertBuyerProfile = z.infer<typeof insertBuyerProfileSchema>;
export type BuyerProfile = typeof buyerProfiles.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;
export type GenerateProfileRequest = z.infer<typeof generateProfileRequestSchema>;

export interface ProfileData {
  coreDemographics: string;
  dailyLife: string;
  archetype: string;
  geographic: string;
  crossNiche: string;
  language: string;
  workLife: string;
  foodCulture: string;
  values: string;
}

export interface DesignRecommendations {
  slogans: string[];
  visualIdeas: Array<{
    name: string;
    description: string;
    icon: string;
  }>;
  fonts: {
    primary: string;
    accent: string;
    body: string;
  };
  colors: {
    palette: string[];
    description: string;
  };
  layouts: Array<{
    name: string;
    description: string;
  }>;
  mockups: Array<{
    name: string;
    description: string;
    setting: string;
  }>;
  seoOptimization: {
    productTitles: string[];
    descriptions: string[];
    tags: string[];
    keywords: string[];
  };
  trendingInsights: {
    currentTrends: Array<{
      trend: string;
      relevance: string;
      salesPotential: 'High' | 'Medium' | 'Low';
    }>;
    seasonalOpportunities: Array<{
      season: string;
      opportunity: string;
      timing: string;
    }>;
    competitorAnalysis: {
      topSellingStyles: string[];
      priceRanges: string[];
      marketGaps: string[];
    };
  };
}
