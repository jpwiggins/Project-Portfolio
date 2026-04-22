import { users, buyerProfiles, payments, type User, type UpsertUser, type BuyerProfile, type InsertBuyerProfile, type Payment, type InsertPayment } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User operations for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserCredits(userId: string, credits: number): Promise<User>;
  
  // Profile operations
  createBuyerProfile(profile: InsertBuyerProfile): Promise<BuyerProfile>;
  getBuyerProfile(id: number): Promise<BuyerProfile | undefined>;
  getUserProfiles(userId: string): Promise<BuyerProfile[]>;
  getAllProfiles(): Promise<BuyerProfile[]>;
  
  // Payment operations
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePaymentStatus(paymentIntentId: string, status: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
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

  async updateUserCredits(userId: string, credits: number): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ credits, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Profile operations
  async createBuyerProfile(profile: InsertBuyerProfile): Promise<BuyerProfile> {
    const [savedProfile] = await db
      .insert(buyerProfiles)
      .values(profile)
      .returning();
    return savedProfile;
  }

  async getBuyerProfile(id: number): Promise<BuyerProfile | undefined> {
    const [profile] = await db.select().from(buyerProfiles).where(eq(buyerProfiles.id, id));
    return profile || undefined;
  }

  async getUserProfiles(userId: string): Promise<BuyerProfile[]> {
    return await db.select().from(buyerProfiles).where(eq(buyerProfiles.userId, userId));
  }

  async getAllProfiles(): Promise<BuyerProfile[]> {
    return await db.select().from(buyerProfiles).limit(50);
  }

  // Payment operations
  async createPayment(payment: InsertPayment): Promise<Payment> {
    const [savedPayment] = await db
      .insert(payments)
      .values(payment)
      .returning();
    return savedPayment;
  }

  async updatePaymentStatus(paymentIntentId: string, status: string): Promise<void> {
    await db
      .update(payments)
      .set({ status })
      .where(eq(payments.stripePaymentIntentId, paymentIntentId));
  }
}

export const storage = new DatabaseStorage();
