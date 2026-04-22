import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const userPreferences = pgTable("user_preferences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  allergies: jsonb("allergies").default([]), // Array of allergens like ["nuts", "dairy", "eggs"]
  dislikes: jsonb("dislikes").default([]), // Array of disliked foods/ingredients
  dietType: text("diet_type"), // "vegetarian", "vegan", "keto", "paleo", etc.
  calorieGoal: integer("calorie_goal"), // Daily calorie target
  activityLevel: text("activity_level"), // "sedentary", "light", "moderate", "active", "very_active"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const mealPlans = pgTable("meal_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  budget: decimal("budget", { precision: 10, scale: 2 }).notNull(),
  people: integer("people").notNull(),
  days: integer("days").notNull(),
  store: text("store"),
  totalCost: decimal("total_cost", { precision: 10, scale: 2 }).notNull(),
  meals: jsonb("meals").notNull(), // Array of meal objects
  groceryList: jsonb("grocery_list").notNull(), // Categorized grocery items
  isFavorite: boolean("is_favorite").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const savedMeals = pgTable("saved_meals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  mealPlanId: varchar("meal_plan_id").references(() => mealPlans.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertMealPlanSchema = createInsertSchema(mealPlans).omit({
  id: true,
  createdAt: true,
}).extend({
  budget: z.number().min(20).max(1000),
  people: z.number().min(1).max(10),
  days: z.number().min(1).max(14),
  store: z.string().optional(),
  totalCost: z.number().min(0),
});

export const mealPlanRequestSchema = z.object({
  budget: z.number().min(20).max(1000),
  people: z.number().min(1).max(10),
  days: z.number().min(1).max(14),
  store: z.string().optional(),
  allergies: z.array(z.string()).optional(),
  dislikes: z.array(z.string()).optional(),
  dietType: z.string().optional(),
  calorieGoal: z.number().min(1200).max(4000).optional(),
  activityLevel: z.string().optional(),
  // TIME + SKILL FILTERS - THE DIFFERENTIATOR!
  maxCookingTime: z.number().min(5).max(180).optional(), // 5-180 minutes
  skillLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertMealPlan = z.infer<typeof insertMealPlanSchema>;
export type MealPlan = typeof mealPlans.$inferSelect;
export type MealPlanRequest = z.infer<typeof mealPlanRequestSchema>;
export type SavedMeal = typeof savedMeals.$inferSelect;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;

export interface Meal {
  id: number;
  name: string;
  cost: number;
  calories: number;
  type: 'breakfast' | 'lunch' | 'dinner';
  day: string;
  ingredients: string[];
  cookingTime?: number; // Time in minutes
  skillLevel?: 'beginner' | 'intermediate' | 'advanced';
  cookingMethod?: string; // 'microwave', 'one-pan', 'stovetop', 'oven', 'no-cook'
  substitutions?: Array<{
    original: string;
    substitute: string;
    reason: string;
  }>;
  nutritionInfo?: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
}

export interface DayMeals {
  day: string;
  date: string;
  meals: Meal[];
  totalCost: number;
}

export interface GroceryItem {
  name: string;
  quantity: string;
  cost: number;
  category: string;
}

export interface GroceryCategory {
  name: string;
  icon: string;
  items: GroceryItem[];
  totalCost: number;
}

// Wellness tracking tables
export const wellnessTracking = pgTable("wellness_tracking", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  date: timestamp("date").defaultNow(),
  moodRating: integer("mood_rating"), // 1-10 scale
  stressLevel: integer("stress_level"), // 1-10 scale
  energyLevel: integer("energy_level"), // 1-10 scale
  sleepHours: integer("sleep_hours"),
  workoutCompleted: boolean("workout_completed").default(false),
  workoutType: varchar("workout_type"),
  meditationMinutes: integer("meditation_minutes").default(0),
  notes: varchar("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const nutritionInsights = pgTable("nutrition_insights", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  mealPlanId: varchar("meal_plan_id").references(() => mealPlans.id),
  date: timestamp("date").defaultNow(),
  totalCalories: integer("total_calories"),
  protein: integer("protein_grams"),
  carbs: integer("carbs_grams"),
  fat: integer("fat_grams"),
  fiber: integer("fiber_grams"),
  sodium: integer("sodium_mg"),
  magnesium: integer("magnesium_mg"),
  omega3: integer("omega3_mg"),
  vitaminD: integer("vitamin_d_iu"),
  recommendations: jsonb("recommendations"), // Daily wellness suggestions
  createdAt: timestamp("created_at").defaultNow(),
});

export type WellnessEntry = typeof wellnessTracking.$inferSelect;
export type InsertWellnessEntry = typeof wellnessTracking.$inferInsert;
export type NutritionInsight = typeof nutritionInsights.$inferSelect;
export type InsertNutritionInsight = typeof nutritionInsights.$inferInsert;

export const insertWellnessSchema = createInsertSchema(wellnessTracking).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const insertNutritionSchema = createInsertSchema(nutritionInsights).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export type InsertWellnessInput = z.infer<typeof insertWellnessSchema>;
export type InsertNutritionInput = z.infer<typeof insertNutritionSchema>;

export interface WellnessRecommendation {
  type: 'workout' | 'meditation' | 'nutrition' | 'lifestyle';
  title: string;
  description: string;
  reason: string;
  duration?: number; // minutes
  intensity?: 'low' | 'medium' | 'high';
  category?: string;
}

export interface DailyWellnessChart {
  date: string;
  meals: Meal[];
  nutritionSummary: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    magnesium: number;
    omega3: number;
  };
  workoutRecommendation: WellnessRecommendation;
  stressReliefTip: WellnessRecommendation;
  moodCheckIn?: {
    rating: number;
    notes?: string;
  };
}

// Mood-Food Learning Dataset
export const moodFoodEntries = pgTable("mood_food_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  date: timestamp("date").defaultNow().notNull(),
  meals: jsonb("meals").$type<string[]>().notNull(),
  moodBefore: varchar("mood_before"),
  moodAfter: varchar("mood_after"),
  energyLevel: integer("energy_level"),
  stressLevel: integer("stress_level"),
  workoutDone: varchar("workout_done"),
  stressReliefDone: varchar("stress_relief_done"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMoodFoodSchema = createInsertSchema(moodFoodEntries).omit({
  id: true,
  createdAt: true,
});

export type InsertMoodFoodEntry = z.infer<typeof insertMoodFoodSchema>;
export type MoodFoodEntry = typeof moodFoodEntries.$inferSelect;
