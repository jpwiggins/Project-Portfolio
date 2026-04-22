import {
  users,
  products,
  bundles,
  priceAnalytics,
  type User,
  type UpsertUser,
  type Product,
  type InsertProduct,
  type Bundle,
  type InsertBundle,
  type PriceAnalytics,
  type InsertPriceAnalytics,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, inArray, desc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserPrintifyKey(id: string, apiKey: string): Promise<User>;
  updateUserPrintifyKey(userId: string, apiKey: string): Promise<User>;
  updateUserStripeInfo(userId: string, customerId: string, subscriptionId: string): Promise<User>;
  
  // Product operations
  getProductsByUserId(userId: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  createManyProducts(products: InsertProduct[]): Promise<Product[]>;
  deleteProductsByUserId(userId: string): Promise<void>;
  getProductsByIds(productIds: number[]): Promise<Product[]>;
  
  // Bundle operations
  getBundlesByUserId(userId: string): Promise<Bundle[]>;
  createBundle(bundle: InsertBundle): Promise<Bundle>;
  updateBundle(id: number, bundle: Partial<InsertBundle>): Promise<Bundle>;
  deleteBundle(id: number, userId: string): Promise<void>;
  deleteBundleAdmin(id: number): Promise<void>;
  getBundleById(id: number, userId: string): Promise<Bundle | undefined>;
  
  // Price Analytics operations
  createPriceAnalytics(analytics: InsertPriceAnalytics): Promise<PriceAnalytics>;
  getPriceAnalyticsByBundleId(bundleId: number): Promise<PriceAnalytics | undefined>;
  updateBundlePricing(bundleId: number, pricing: {
    suggestedPrice?: string;
    competitorAnalysis?: any;
    marketTrends?: any;
    priceOptimizationScore?: string;
  }): Promise<Bundle>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserPrintifyKey(userId: string, apiKey: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ printifyApiKey: apiKey, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateUserStripeInfo(userId: string, customerId: string, subscriptionId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        stripeCustomerId: customerId, 
        stripeSubscriptionId: subscriptionId,
        subscriptionStatus: "active",
        updatedAt: new Date() 
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Product operations
  async getProductsByUserId(userId: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.userId, userId));
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async createManyProducts(productList: InsertProduct[]): Promise<Product[]> {
    if (productList.length === 0) return [];
    return await db.insert(products).values(productList).returning();
  }

  async deleteProductsByUserId(userId: string): Promise<void> {
    await db.delete(products).where(eq(products.userId, userId));
  }

  async getProductsByIds(productIds: number[]): Promise<Product[]> {
    if (productIds.length === 0) return [];
    return await db.select().from(products).where(inArray(products.id, productIds));
  }

  // Bundle operations
  async getBundlesByUserId(userId: string): Promise<Bundle[]> {
    return await db.select().from(bundles).where(eq(bundles.userId, userId));
  }

  async createBundle(bundle: InsertBundle): Promise<Bundle> {
    const [newBundle] = await db.insert(bundles).values(bundle).returning();
    return newBundle;
  }

  async updateBundle(id: number, bundleUpdate: Partial<InsertBundle>): Promise<Bundle> {
    const [bundle] = await db
      .update(bundles)
      .set({ ...bundleUpdate, updatedAt: new Date() })
      .where(eq(bundles.id, id))
      .returning();
    return bundle;
  }

  async deleteBundle(id: number, userId: string): Promise<void> {
    await db.delete(bundles).where(and(eq(bundles.id, id), eq(bundles.userId, userId)));
  }

  async deleteBundleAdmin(id: number): Promise<void> {
    await db.delete(bundles).where(eq(bundles.id, id));
  }

  async getBundleById(id: number, userId: string): Promise<Bundle | undefined> {
    const [bundle] = await db
      .select()
      .from(bundles)
      .where(and(eq(bundles.id, id), eq(bundles.userId, userId)));
    return bundle;
  }

  // Price Analytics operations
  async createPriceAnalytics(analytics: InsertPriceAnalytics): Promise<PriceAnalytics> {
    const [newAnalytics] = await db.insert(priceAnalytics).values(analytics).returning();
    return newAnalytics;
  }

  async getPriceAnalyticsByBundleId(bundleId: number): Promise<PriceAnalytics | undefined> {
    const [analytics] = await db
      .select()
      .from(priceAnalytics)
      .where(eq(priceAnalytics.bundleId, bundleId))
      .orderBy(desc(priceAnalytics.analysisDate))
      .limit(1);
    return analytics;
  }

  async updateBundlePricing(bundleId: number, pricing: {
    suggestedPrice?: string;
    competitorAnalysis?: any;
    marketTrends?: any;
    priceOptimizationScore?: string;
  }): Promise<Bundle> {
    const [bundle] = await db
      .update(bundles)
      .set({ 
        ...pricing, 
        updatedAt: new Date() 
      })
      .where(eq(bundles.id, bundleId))
      .returning();
    return bundle;
  }
}

export const storage = new DatabaseStorage();
