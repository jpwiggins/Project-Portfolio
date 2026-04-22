import { 
  type User, 
  type InsertUser, 
  type MealPlan, 
  type InsertMealPlan, 
  type SavedMeal,
  type WellnessEntry,
  type NutritionInsight,
  type InsertWellnessInput,
  type InsertNutritionInput,
  type MoodFoodEntry,
  type InsertMoodFoodEntry
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createMealPlan(mealPlan: InsertMealPlan): Promise<MealPlan>;
  getMealPlan(id: string): Promise<MealPlan | undefined>;
  getMealPlansByUser(userId: string): Promise<MealPlan[]>;
  updateMealPlan(id: string, updates: Partial<MealPlan>): Promise<MealPlan | undefined>;
  deleteMealPlan(id: string): Promise<boolean>;
  
  saveMeal(userId: string, mealPlanId: string): Promise<SavedMeal>;
  getSavedMeals(userId: string): Promise<SavedMeal[]>;
  removeSavedMeal(userId: string, mealPlanId: string): Promise<boolean>;

  // Wellness tracking methods
  createWellnessEntry(entry: InsertWellnessInput): Promise<WellnessEntry>;
  getWellnessHistory(days: number): Promise<WellnessEntry[]>;
  createNutritionInsight(insight: InsertNutritionInput): Promise<NutritionInsight>;
  
  // Mood-Food learning methods
  createMoodFoodEntry(entry: InsertMoodFoodEntry): Promise<MoodFoodEntry>;
  getMoodFoodEntries(userId: string, days?: number): Promise<MoodFoodEntry[]>;
  getAllMoodFoodEntries(): Promise<MoodFoodEntry[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private mealPlans: Map<string, MealPlan>;
  private savedMeals: Map<string, SavedMeal>;
  private wellnessEntries: Map<string, WellnessEntry>;
  private nutritionInsights: Map<string, NutritionInsight>;
  private moodFoodEntries: Map<string, MoodFoodEntry>;

  constructor() {
    this.users = new Map();
    this.mealPlans = new Map();
    this.savedMeals = new Map();
    this.wellnessEntries = new Map();
    this.nutritionInsights = new Map();
    this.moodFoodEntries = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createMealPlan(insertMealPlan: InsertMealPlan): Promise<MealPlan> {
    const id = randomUUID();
    const mealPlan: MealPlan = {
      ...insertMealPlan,
      id,
      userId: insertMealPlan.userId || null,
      budget: insertMealPlan.budget.toString(),
      totalCost: insertMealPlan.totalCost.toString(),
      store: insertMealPlan.store || null,
      createdAt: new Date(),
      isFavorite: false,
    };
    this.mealPlans.set(id, mealPlan);
    return mealPlan;
  }

  async getMealPlan(id: string): Promise<MealPlan | undefined> {
    return this.mealPlans.get(id);
  }

  async getMealPlansByUser(userId: string): Promise<MealPlan[]> {
    return Array.from(this.mealPlans.values()).filter(
      (plan) => plan.userId === userId,
    );
  }

  async updateMealPlan(id: string, updates: Partial<MealPlan>): Promise<MealPlan | undefined> {
    const existing = this.mealPlans.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.mealPlans.set(id, updated);
    return updated;
  }

  async deleteMealPlan(id: string): Promise<boolean> {
    return this.mealPlans.delete(id);
  }

  async saveMeal(userId: string, mealPlanId: string): Promise<SavedMeal> {
    const id = randomUUID();
    const savedMeal: SavedMeal = {
      id,
      userId,
      mealPlanId,
      createdAt: new Date(),
    };
    this.savedMeals.set(id, savedMeal);
    return savedMeal;
  }

  async getSavedMeals(userId: string): Promise<SavedMeal[]> {
    return Array.from(this.savedMeals.values()).filter(
      (saved) => saved.userId === userId,
    );
  }

  async removeSavedMeal(userId: string, mealPlanId: string): Promise<boolean> {
    const saved = Array.from(this.savedMeals.entries()).find(
      ([_, meal]) => meal.userId === userId && meal.mealPlanId === mealPlanId
    );
    if (!saved) return false;
    return this.savedMeals.delete(saved[0]);
  }

  // Wellness tracking methods
  async createWellnessEntry(entry: InsertWellnessInput): Promise<WellnessEntry> {
    const id = randomUUID();
    const wellnessEntry: WellnessEntry = {
      id,
      userId: "demo-user", // In a real app, get from authenticated session
      date: entry.date || new Date(),
      createdAt: new Date(),
      moodRating: entry.moodRating || null,
      stressLevel: entry.stressLevel || null,
      energyLevel: entry.energyLevel || null,
      sleepHours: entry.sleepHours || null,
      workoutCompleted: entry.workoutCompleted || false,
      workoutType: entry.workoutType || null,
      meditationMinutes: entry.meditationMinutes || null,
      notes: entry.notes || null,
    };
    this.wellnessEntries.set(id, wellnessEntry);
    return wellnessEntry;
  }

  async getWellnessHistory(days: number): Promise<WellnessEntry[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return Array.from(this.wellnessEntries.values())
      .filter(entry => entry.date && entry.date >= cutoffDate)
      .sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0));
  }

  async createNutritionInsight(insight: InsertNutritionInput): Promise<NutritionInsight> {
    const id = randomUUID();
    const nutritionInsight: NutritionInsight = {
      id,
      userId: "demo-user", // In a real app, get from authenticated session
      date: insight.date || new Date(),
      createdAt: new Date(),
      mealPlanId: insight.mealPlanId || null,
      totalCalories: insight.totalCalories || null,
      protein: insight.protein || null,
      carbs: insight.carbs || null,
      fat: insight.fat || null,
      fiber: insight.fiber || null,
      sodium: insight.sodium || null,
      magnesium: insight.magnesium || null,
      omega3: insight.omega3 || null,
      vitaminD: insight.vitaminD || null,
      recommendations: insight.recommendations || null,
    };
    this.nutritionInsights.set(id, nutritionInsight);
    return nutritionInsight;
  }

  // Mood-Food learning methods
  async createMoodFoodEntry(entry: InsertMoodFoodEntry): Promise<MoodFoodEntry> {
    const id = randomUUID();
    const moodFoodEntry: MoodFoodEntry = {
      id,
      userId: entry.userId || "demo-user",
      date: entry.date || new Date(),
      meals: entry.meals as string[],
      moodBefore: entry.moodBefore || null,
      moodAfter: entry.moodAfter || null,
      energyLevel: entry.energyLevel || null,
      stressLevel: entry.stressLevel || null,
      workoutDone: entry.workoutDone || null,
      stressReliefDone: entry.stressReliefDone || null,
      createdAt: new Date(),
    };
    this.moodFoodEntries.set(id, moodFoodEntry);
    return moodFoodEntry;
  }

  async getMoodFoodEntries(userId: string, days: number = 30): Promise<MoodFoodEntry[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return Array.from(this.moodFoodEntries.values())
      .filter(entry => entry.userId === userId && entry.date >= cutoffDate)
      .sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0));
  }

  async getAllMoodFoodEntries(): Promise<MoodFoodEntry[]> {
    return Array.from(this.moodFoodEntries.values())
      .sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0));
  }
}

export const storage = new MemStorage();
