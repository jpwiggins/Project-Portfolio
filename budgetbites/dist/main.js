var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/ai-fitness-engine.ts
var ai_fitness_engine_exports = {};
__export(ai_fitness_engine_exports, {
  analyzeFoodPlate: () => analyzeFoodPlate,
  analyzeVisualMeal: () => analyzeVisualMeal,
  determineActivityLevel: () => determineActivityLevel,
  determineFitnessGoal: () => determineFitnessGoal,
  determineFitnessLevel: () => determineFitnessLevel,
  generateAINutritionAdvice: () => generateAINutritionAdvice,
  generateAIWorkoutPlan: () => generateAIWorkoutPlan,
  generateAdvancedWellnessRecommendations: () => generateAdvancedWellnessRecommendations,
  generateComprehensiveWellnessRecommendations: () => generateComprehensiveWellnessRecommendations,
  generateCustomWorkoutPlan: () => generateCustomWorkoutPlan,
  generateEnhancedWorkoutPlan: () => generateEnhancedWorkoutPlan,
  getDailyAffirmation: () => getDailyAffirmation,
  getDailyQuote: () => getDailyQuote,
  getExerciseDetails: () => getExerciseDetails,
  getWellnessMotivation: () => getWellnessMotivation,
  getWellnessTips: () => getWellnessTips
});
function determineFitnessGoal(mealCategories, userGoal) {
  if (userGoal) return userGoal;
  const categoryCount = mealCategories.reduce((acc, category) => {
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});
  if (categoryCount["protein"] > 2) return "Build muscle";
  if (categoryCount["fiber"] > 2) return "Lose weight";
  if (categoryCount["carbs"] > 2) return "Improve endurance";
  return "General fitness";
}
function determineActivityLevel(moodEntries) {
  const recentWorkouts = moodEntries.filter((entry) => entry.workoutDone && entry.workoutDone !== "none").slice(0, 7);
  if (recentWorkouts.length >= 5) return "Very Active";
  if (recentWorkouts.length >= 3) return "Active";
  if (recentWorkouts.length >= 1) return "Moderate";
  return "Light";
}
function determineFitnessLevel(moodEntries) {
  const workoutTypes = moodEntries.filter((entry) => entry.workoutDone && entry.workoutDone !== "none").map((entry) => entry.workoutDone).slice(0, 10);
  const strengthWorkouts = workoutTypes.filter(
    (workout) => workout?.includes("strength") || workout?.includes("weight")
  ).length;
  const advancedWorkouts = workoutTypes.filter(
    (workout) => workout?.includes("crossfit") || workout?.includes("hiit") || workout?.includes("advanced")
  ).length;
  if (advancedWorkouts > 3 || strengthWorkouts > 5) return "Advanced";
  if (workoutTypes.length > 5 || strengthWorkouts > 2) return "Intermediate";
  return "Beginner";
}
async function generateAIWorkoutPlan(mealCategories, moodEntries, userPreferences2) {
  if (!process.env.RAPIDAPI_KEY) {
    console.warn("RAPIDAPI_KEY not available, skipping AI workout generation");
    return null;
  }
  try {
    const goal = determineFitnessGoal(mealCategories, userPreferences2?.goal);
    const fitnessLevel = determineFitnessLevel(moodEntries);
    const requestBody = {
      goal,
      fitness_level: fitnessLevel,
      preferences: userPreferences2?.preferences || ["Weight training", "Cardio"],
      health_conditions: userPreferences2?.health_conditions || ["None"],
      schedule: {
        days_per_week: userPreferences2?.schedule?.days_per_week || 4,
        session_duration: userPreferences2?.schedule?.session_duration || 60
      },
      plan_duration_weeks: userPreferences2?.plan_duration_weeks || 4,
      lang: "en"
    };
    const response = await fetch(
      "https://ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com/generateWorkoutPlan?noqueue=1",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-rapidapi-host": "ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com",
          "x-rapidapi-key": process.env.RAPIDAPI_KEY
        },
        body: JSON.stringify(requestBody)
      }
    );
    if (!response.ok) {
      console.error("AI Workout API error:", response.status, response.statusText);
      return null;
    }
    const workoutPlan = await response.json();
    return workoutPlan;
  } catch (error) {
    console.error("Error generating AI workout plan:", error);
    return null;
  }
}
async function generateAINutritionAdvice(mealCategories, moodEntries, userPreferences2) {
  if (!process.env.RAPIDAPI_KEY) {
    console.warn("RAPIDAPI_KEY not available, skipping AI nutrition generation");
    return null;
  }
  try {
    const goal = determineFitnessGoal(mealCategories, userPreferences2?.goal);
    const activityLevel = determineActivityLevel(moodEntries);
    const dietaryRestrictions = [];
    if (mealCategories.includes("fiber") && !mealCategories.includes("protein")) {
      dietaryRestrictions.push("Vegetarian");
    }
    const requestBody = {
      goal,
      dietary_restrictions: userPreferences2?.dietary_restrictions || dietaryRestrictions,
      current_weight: userPreferences2?.current_weight,
      target_weight: userPreferences2?.target_weight,
      daily_activity_level: activityLevel,
      lang: "en"
    };
    const response = await fetch(
      "https://ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com/nutritionAdvice?noqueue=1",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-rapidapi-host": "ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com",
          "x-rapidapi-key": process.env.RAPIDAPI_KEY
        },
        body: JSON.stringify(requestBody)
      }
    );
    if (!response.ok) {
      console.error("AI Nutrition API error:", response.status, response.statusText);
      return null;
    }
    const nutritionAdvice = await response.json();
    return nutritionAdvice;
  } catch (error) {
    console.error("Error generating AI nutrition advice:", error);
    return null;
  }
}
async function generateComprehensiveWellnessRecommendations(mealCategories, moodEntries) {
  const [aiWorkoutPlan, aiNutritionAdvice] = await Promise.all([
    generateAIWorkoutPlan(mealCategories, moodEntries),
    generateAINutritionAdvice(mealCategories, moodEntries)
  ]);
  const personalizedInsights = [];
  if (aiWorkoutPlan) {
    personalizedInsights.push(
      `AI recommends ${aiWorkoutPlan.weekly_schedule.length} workout days per week based on your meal patterns`
    );
  }
  if (aiNutritionAdvice) {
    personalizedInsights.push(
      `Your optimal daily calories: ${aiNutritionAdvice.daily_calories} based on activity level`
    );
  }
  const dominantCategory = mealCategories[0];
  if (dominantCategory === "protein" && aiWorkoutPlan) {
    personalizedInsights.push(
      "Your high-protein meals are perfect for strength training - timing is key!"
    );
  }
  return {
    aiWorkoutPlan,
    aiNutritionAdvice,
    personalizedInsights
  };
}
async function getExerciseDetails(exerciseName) {
  if (!process.env.RAPIDAPI_KEY) {
    console.warn("RAPIDAPI_KEY not available, skipping exercise details");
    return null;
  }
  try {
    const response = await fetch(
      "https://ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com/exerciseDetails?noqueue=1",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-rapidapi-host": "ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com",
          "x-rapidapi-key": process.env.RAPIDAPI_KEY
        },
        body: JSON.stringify({
          exercise_name: exerciseName,
          lang: "en"
        })
      }
    );
    if (!response.ok) {
      console.error("Exercise Details API error:", response.status, response.statusText);
      return null;
    }
    const exerciseDetails = await response.json();
    return exerciseDetails;
  } catch (error) {
    console.error("Error fetching exercise details:", error);
    return null;
  }
}
async function generateEnhancedWorkoutPlan(mealCategories, moodEntries, userPreferences2) {
  const workoutPlan = await generateAIWorkoutPlan(mealCategories, moodEntries, userPreferences2);
  const exerciseDetails = {};
  if (workoutPlan) {
    const allExercises = workoutPlan.weekly_schedule.flatMap((day) => day.exercises);
    const keyExercises = allExercises.slice(0, 5);
    for (const exercise of keyExercises) {
      const details = await getExerciseDetails(exercise.name);
      if (details) {
        exerciseDetails[exercise.name] = details;
      }
    }
  }
  return { workoutPlan, exerciseDetails };
}
async function generateCustomWorkoutPlan(workoutRequest) {
  if (!process.env.RAPIDAPI_KEY) {
    console.warn("RAPIDAPI_KEY not available, skipping custom workout plan");
    return null;
  }
  try {
    const response = await fetch(
      "https://ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com/customWorkoutPlan?noqueue=1",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-rapidapi-host": "ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com",
          "x-rapidapi-key": process.env.RAPIDAPI_KEY
        },
        body: JSON.stringify({
          goal: workoutRequest.goal,
          fitness_level: workoutRequest.fitness_level,
          preferences: workoutRequest.preferences || [],
          health_conditions: workoutRequest.health_conditions || [],
          schedule: workoutRequest.schedule || {
            days_per_week: 3,
            session_duration: 45
          },
          plan_duration_weeks: workoutRequest.plan_duration_weeks || 4,
          lang: workoutRequest.lang || "en"
        })
      }
    );
    if (!response.ok) {
      console.error("Custom Workout Plan API error:", response.status, response.statusText);
      return null;
    }
    const workoutPlan = await response.json();
    return workoutPlan;
  } catch (error) {
    console.error("Error generating custom workout plan:", error);
    return null;
  }
}
async function generateAdvancedWellnessRecommendations(mealCategories, moodEntries, userPreferences2 = {}) {
  const proteinMeals = mealCategories.filter((cat) => cat.includes("protein")).length;
  const fiberMeals = mealCategories.filter((cat) => cat.includes("fiber")).length;
  const omegaMeals = mealCategories.filter((cat) => cat.includes("omega")).length;
  let suggestedGoal = userPreferences2.goal || "Improve overall fitness";
  let suggestedCustomGoals = userPreferences2.customGoals || [];
  if (proteinMeals > 3) {
    suggestedGoal = "Build muscle";
    suggestedCustomGoals = ["Increase strength", "Build lean muscle mass"];
  } else if (fiberMeals > 3) {
    suggestedGoal = "Lose weight";
    suggestedCustomGoals = ["Burn fat", "Improve cardiovascular health"];
  } else if (omegaMeals > 2) {
    suggestedGoal = "Improve overall fitness";
    suggestedCustomGoals = ["Reduce inflammation", "Improve joint health"];
  }
  const recentEntries = moodEntries.slice(-7);
  const avgEnergy = recentEntries.reduce((sum, entry) => sum + (entry.energyLevel || 3), 0) / recentEntries.length;
  const suggestedLevel = avgEnergy > 4 ? "Intermediate" : avgEnergy > 2.5 ? "Beginner" : "Beginner";
  const customWorkoutPlan = await generateCustomWorkoutPlan({
    goal: suggestedGoal,
    fitness_level: userPreferences2.fitnessLevel || suggestedLevel,
    preferences: userPreferences2.preferences || ["Full body", "Strength training"],
    health_conditions: userPreferences2.healthConditions || [],
    schedule: userPreferences2.schedule || { days_per_week: 4, session_duration: 45 },
    plan_duration_weeks: 6,
    lang: "en"
  });
  const [nutritionAdvice, enhancedPlan] = await Promise.all([
    generateAINutritionAdvice(mealCategories, moodEntries),
    customWorkoutPlan ? generateEnhancedWorkoutPlan(mealCategories, moodEntries) : null
  ]);
  const personalizedInsights = [];
  if (customWorkoutPlan) {
    personalizedInsights.push(
      `Custom ${customWorkoutPlan.duration_weeks}-week plan created based on your ${proteinMeals > 3 ? "high-protein" : fiberMeals > 3 ? "high-fiber" : "balanced"} meal pattern`
    );
    personalizedInsights.push(
      `${customWorkoutPlan.weekly_schedule.length} workout days per week targeting your specific goals`
    );
  }
  if (nutritionAdvice) {
    personalizedInsights.push(
      `Nutrition plan optimized for ${suggestedGoal.toLowerCase()} with ${nutritionAdvice.daily_calories} daily calories`
    );
  }
  return {
    customWorkoutPlan,
    nutritionAdvice,
    exerciseDetails: enhancedPlan?.exerciseDetails || {},
    personalizedInsights,
    aiRecommendations: {
      suggestedGoal,
      suggestedLevel,
      customGoals: suggestedCustomGoals,
      mealPatternAnalysis: {
        proteinMeals,
        fiberMeals,
        omegaMeals,
        primaryNutrientFocus: proteinMeals > 3 ? "protein" : fiberMeals > 3 ? "fiber" : "balanced"
      }
    }
  };
}
async function analyzeFoodPlate(imageUrl) {
  if (!process.env.RAPIDAPI_KEY) {
    console.warn("RAPIDAPI_KEY not available, skipping food plate analysis");
    return null;
  }
  try {
    const response = await fetch(
      `https://ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com/analyzeFoodPlate?imageUrl=${encodeURIComponent(imageUrl)}&lang=en&noqueue=1`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "x-rapidapi-host": "ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com",
          "x-rapidapi-key": process.env.RAPIDAPI_KEY
        }
      }
    );
    if (!response.ok) {
      console.error("Food Plate Analysis API error:", response.status, response.statusText);
      return null;
    }
    const analysis = await response.json();
    return analysis;
  } catch (error) {
    console.error("Error analyzing food plate:", error);
    return null;
  }
}
async function analyzeVisualMeal(imageUrl, userId) {
  const analysis = await analyzeFoodPlate(imageUrl);
  const recommendations = [];
  const fitnessInsights = [];
  if (!analysis) {
    return { analysis: null, recommendations: [], fitnessInsights: [] };
  }
  const { total_macros, health_analysis, foods_detected } = analysis;
  if (total_macros.protein > 25) {
    recommendations.push("Excellent protein content - perfect for muscle building and recovery");
    fitnessInsights.push("High-protein meal detected - ideal timing is post-workout for muscle synthesis");
  } else if (total_macros.protein < 15) {
    recommendations.push("Consider adding lean protein sources like chicken, fish, or legumes");
    fitnessInsights.push("Low protein - may not support optimal muscle recovery after strength training");
  }
  if (total_macros.carbs > 45) {
    recommendations.push("High carb content - great for energy and endurance activities");
    fitnessInsights.push("Carb-rich meal - perfect pre-workout fuel for high-intensity training");
  } else if (total_macros.carbs < 20) {
    recommendations.push("Low carb meal - good for fat burning and weight management");
    fitnessInsights.push("Low-carb profile - aligns well with fat-burning workout goals");
  }
  if (health_analysis.overall_score > 8) {
    recommendations.push("Outstanding nutritional balance - keep up the healthy choices!");
    fitnessInsights.push("Nutrient-dense meal supports optimal performance and recovery");
  } else if (health_analysis.overall_score < 6) {
    recommendations.push("Consider adding more vegetables and reducing processed foods");
    fitnessInsights.push("Room for improvement - better nutrition will enhance workout results");
  }
  const proteinFoods = foods_detected.filter(
    (food) => food.macronutrients.protein > food.macronutrients.carbs && food.macronutrients.protein > food.macronutrients.fats
  );
  if (proteinFoods.length > 0) {
    fitnessInsights.push(`Detected ${proteinFoods.length} protein-rich foods - excellent for strength training days`);
  }
  recommendations.push(...health_analysis.recommendations);
  return { analysis, recommendations, fitnessInsights };
}
async function getDailyAffirmation() {
  if (!process.env.RAPIDAPI_KEY) {
    console.warn("RAPIDAPI_KEY not available, skipping affirmation service");
    return null;
  }
  try {
    const response = await fetch("https://positivity-tips.p.rapidapi.com/api/positivity/affirmation", {
      method: "GET",
      headers: {
        "x-rapidapi-host": "positivity-tips.p.rapidapi.com",
        "x-rapidapi-key": process.env.RAPIDAPI_KEY
      }
    });
    if (!response.ok) {
      console.error("Positivity API error:", response.status, response.statusText);
      return null;
    }
    const data = await response.json();
    return data.affirmation || data.message || null;
  } catch (error) {
    console.error("Error fetching daily affirmation:", error);
    return null;
  }
}
async function getDailyQuote() {
  if (!process.env.RAPIDAPI_KEY) {
    console.warn("RAPIDAPI_KEY not available, skipping quote service");
    return null;
  }
  try {
    const response = await fetch("https://positivity-tips.p.rapidapi.com/api/positivity/quote", {
      method: "GET",
      headers: {
        "x-rapidapi-host": "positivity-tips.p.rapidapi.com",
        "x-rapidapi-key": process.env.RAPIDAPI_KEY
      }
    });
    if (!response.ok) {
      console.error("Quote API error:", response.status, response.statusText);
      return null;
    }
    const data = await response.json();
    return data.quote || data.message || null;
  } catch (error) {
    console.error("Error fetching daily quote:", error);
    return null;
  }
}
async function getWellnessTips() {
  if (!process.env.RAPIDAPI_KEY) {
    console.warn("RAPIDAPI_KEY not available, skipping wellness service");
    return null;
  }
  try {
    const response = await fetch("https://positivity-tips.p.rapidapi.com/api/positivity/wellness", {
      method: "GET",
      headers: {
        "x-rapidapi-host": "positivity-tips.p.rapidapi.com",
        "x-rapidapi-key": process.env.RAPIDAPI_KEY
      }
    });
    if (!response.ok) {
      console.error("Wellness API error:", response.status, response.statusText);
      return null;
    }
    const data = await response.json();
    return {
      tips: data.tips || data.wellness_tips || [],
      wellness_quote: data.wellness_quote || data.quote,
      mindfulness_tip: data.mindfulness_tip || data.mindfulness,
      stress_relief: data.stress_relief || data.stress_tip
    };
  } catch (error) {
    console.error("Error fetching wellness tips:", error);
    return null;
  }
}
async function getWellnessMotivation() {
  const [affirmation, wellnessData, dailyQuote] = await Promise.all([
    getDailyAffirmation(),
    getWellnessTips(),
    getDailyQuote()
  ]);
  const fallbackMotivationalTips = [
    "Remember: Small consistent steps lead to big transformations",
    "Your body is capable of amazing things when fueled properly",
    "Every healthy choice you make is an investment in your future self",
    "Progress, not perfection, is what matters most",
    "Celebrate every victory, no matter how small"
  ];
  const fallbackDailyFocuses = [
    "Focus on nourishing your body with wholesome foods today",
    "Prioritize movement that brings you joy and energy",
    "Listen to your body and give it what it needs",
    "Practice gratitude for your body's strength and resilience",
    "Embrace the journey of becoming your healthiest self"
  ];
  const motivationalTips = wellnessData?.tips?.length ? wellnessData.tips : fallbackMotivationalTips;
  const dailyFocus = wellnessData?.mindfulness_tip || fallbackDailyFocuses[Math.floor(Math.random() * fallbackDailyFocuses.length)];
  return {
    affirmation,
    motivationalTips,
    dailyFocus,
    wellnessTips: wellnessData?.tips,
    mindfulnessTip: wellnessData?.mindfulness_tip,
    stressRelief: wellnessData?.stress_relief,
    wellnessQuote: wellnessData?.wellness_quote,
    inspirationalQuote: dailyQuote ?? void 0
  };
}
var init_ai_fitness_engine = __esm({
  "server/ai-fitness-engine.ts"() {
    "use strict";
  }
});

// server/main.ts
import express2 from "express";
import session from "express-session";

// server/routes.ts
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

// server/storage.ts
import { randomUUID } from "crypto";
var MemStorage = class {
  users;
  mealPlans;
  savedMeals;
  wellnessEntries;
  nutritionInsights;
  moodFoodEntries;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.mealPlans = /* @__PURE__ */ new Map();
    this.savedMeals = /* @__PURE__ */ new Map();
    this.wellnessEntries = /* @__PURE__ */ new Map();
    this.nutritionInsights = /* @__PURE__ */ new Map();
    this.moodFoodEntries = /* @__PURE__ */ new Map();
  }
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = randomUUID();
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  async createMealPlan(insertMealPlan) {
    const id = randomUUID();
    const mealPlan = {
      ...insertMealPlan,
      id,
      userId: insertMealPlan.userId || null,
      budget: insertMealPlan.budget.toString(),
      totalCost: insertMealPlan.totalCost.toString(),
      store: insertMealPlan.store || null,
      createdAt: /* @__PURE__ */ new Date(),
      isFavorite: false
    };
    this.mealPlans.set(id, mealPlan);
    return mealPlan;
  }
  async getMealPlan(id) {
    return this.mealPlans.get(id);
  }
  async getMealPlansByUser(userId) {
    return Array.from(this.mealPlans.values()).filter(
      (plan) => plan.userId === userId
    );
  }
  async updateMealPlan(id, updates) {
    const existing = this.mealPlans.get(id);
    if (!existing) return void 0;
    const updated = { ...existing, ...updates };
    this.mealPlans.set(id, updated);
    return updated;
  }
  async deleteMealPlan(id) {
    return this.mealPlans.delete(id);
  }
  async saveMeal(userId, mealPlanId) {
    const id = randomUUID();
    const savedMeal = {
      id,
      userId,
      mealPlanId,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.savedMeals.set(id, savedMeal);
    return savedMeal;
  }
  async getSavedMeals(userId) {
    return Array.from(this.savedMeals.values()).filter(
      (saved) => saved.userId === userId
    );
  }
  async removeSavedMeal(userId, mealPlanId) {
    const saved = Array.from(this.savedMeals.entries()).find(
      ([_, meal]) => meal.userId === userId && meal.mealPlanId === mealPlanId
    );
    if (!saved) return false;
    return this.savedMeals.delete(saved[0]);
  }
  // Wellness tracking methods
  async createWellnessEntry(entry) {
    const id = randomUUID();
    const wellnessEntry = {
      id,
      userId: "demo-user",
      // In a real app, get from authenticated session
      date: entry.date || /* @__PURE__ */ new Date(),
      createdAt: /* @__PURE__ */ new Date(),
      moodRating: entry.moodRating || null,
      stressLevel: entry.stressLevel || null,
      energyLevel: entry.energyLevel || null,
      sleepHours: entry.sleepHours || null,
      workoutCompleted: entry.workoutCompleted || false,
      workoutType: entry.workoutType || null,
      meditationMinutes: entry.meditationMinutes || null,
      notes: entry.notes || null
    };
    this.wellnessEntries.set(id, wellnessEntry);
    return wellnessEntry;
  }
  async getWellnessHistory(days) {
    const cutoffDate = /* @__PURE__ */ new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return Array.from(this.wellnessEntries.values()).filter((entry) => entry.date && entry.date >= cutoffDate).sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0));
  }
  async createNutritionInsight(insight) {
    const id = randomUUID();
    const nutritionInsight = {
      id,
      userId: "demo-user",
      // In a real app, get from authenticated session
      date: insight.date || /* @__PURE__ */ new Date(),
      createdAt: /* @__PURE__ */ new Date(),
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
      recommendations: insight.recommendations || null
    };
    this.nutritionInsights.set(id, nutritionInsight);
    return nutritionInsight;
  }
  // Mood-Food learning methods
  async createMoodFoodEntry(entry) {
    const id = randomUUID();
    const moodFoodEntry = {
      id,
      userId: entry.userId || "demo-user",
      date: entry.date || /* @__PURE__ */ new Date(),
      meals: entry.meals,
      moodBefore: entry.moodBefore || null,
      moodAfter: entry.moodAfter || null,
      energyLevel: entry.energyLevel || null,
      stressLevel: entry.stressLevel || null,
      workoutDone: entry.workoutDone || null,
      stressReliefDone: entry.stressReliefDone || null,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.moodFoodEntries.set(id, moodFoodEntry);
    return moodFoodEntry;
  }
  async getMoodFoodEntries(userId, days = 30) {
    const cutoffDate = /* @__PURE__ */ new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    return Array.from(this.moodFoodEntries.values()).filter((entry) => entry.userId === userId && entry.date >= cutoffDate).sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0));
  }
  async getAllMoodFoodEntries() {
    return Array.from(this.moodFoodEntries.values()).sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0));
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer, jsonb, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var userPreferences = pgTable("user_preferences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  allergies: jsonb("allergies").default([]),
  // Array of allergens like ["nuts", "dairy", "eggs"]
  dislikes: jsonb("dislikes").default([]),
  // Array of disliked foods/ingredients
  dietType: text("diet_type"),
  // "vegetarian", "vegan", "keto", "paleo", etc.
  calorieGoal: integer("calorie_goal"),
  // Daily calorie target
  activityLevel: text("activity_level"),
  // "sedentary", "light", "moderate", "active", "very_active"
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});
var mealPlans = pgTable("meal_plans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  budget: decimal("budget", { precision: 10, scale: 2 }).notNull(),
  people: integer("people").notNull(),
  days: integer("days").notNull(),
  store: text("store"),
  totalCost: decimal("total_cost", { precision: 10, scale: 2 }).notNull(),
  meals: jsonb("meals").notNull(),
  // Array of meal objects
  groceryList: jsonb("grocery_list").notNull(),
  // Categorized grocery items
  isFavorite: boolean("is_favorite").default(false),
  createdAt: timestamp("created_at").defaultNow()
});
var savedMeals = pgTable("saved_meals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  mealPlanId: varchar("meal_plan_id").references(() => mealPlans.id),
  createdAt: timestamp("created_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var insertMealPlanSchema = createInsertSchema(mealPlans).omit({
  id: true,
  createdAt: true
}).extend({
  budget: z.number().min(20).max(1e3),
  people: z.number().min(1).max(10),
  days: z.number().min(1).max(14),
  store: z.string().optional(),
  totalCost: z.number().min(0)
});
var mealPlanRequestSchema = z.object({
  budget: z.number().min(20).max(1e3),
  people: z.number().min(1).max(10),
  days: z.number().min(1).max(14),
  store: z.string().optional(),
  allergies: z.array(z.string()).optional(),
  dislikes: z.array(z.string()).optional(),
  dietType: z.string().optional(),
  calorieGoal: z.number().min(1200).max(4e3).optional(),
  activityLevel: z.string().optional(),
  // TIME + SKILL FILTERS - THE DIFFERENTIATOR!
  maxCookingTime: z.number().min(5).max(180).optional(),
  // 5-180 minutes
  skillLevel: z.enum(["beginner", "intermediate", "advanced"]).optional()
});
var insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true
});
var wellnessTracking = pgTable("wellness_tracking", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  date: timestamp("date").defaultNow(),
  moodRating: integer("mood_rating"),
  // 1-10 scale
  stressLevel: integer("stress_level"),
  // 1-10 scale
  energyLevel: integer("energy_level"),
  // 1-10 scale
  sleepHours: integer("sleep_hours"),
  workoutCompleted: boolean("workout_completed").default(false),
  workoutType: varchar("workout_type"),
  meditationMinutes: integer("meditation_minutes").default(0),
  notes: varchar("notes"),
  createdAt: timestamp("created_at").defaultNow()
});
var nutritionInsights = pgTable("nutrition_insights", {
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
  recommendations: jsonb("recommendations"),
  // Daily wellness suggestions
  createdAt: timestamp("created_at").defaultNow()
});
var insertWellnessSchema = createInsertSchema(wellnessTracking).omit({
  id: true,
  userId: true,
  createdAt: true
});
var insertNutritionSchema = createInsertSchema(nutritionInsights).omit({
  id: true,
  userId: true,
  createdAt: true
});
var moodFoodEntries = pgTable("mood_food_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  date: timestamp("date").defaultNow().notNull(),
  meals: jsonb("meals").$type().notNull(),
  moodBefore: varchar("mood_before"),
  moodAfter: varchar("mood_after"),
  energyLevel: integer("energy_level"),
  stressLevel: integer("stress_level"),
  workoutDone: varchar("workout_done"),
  stressReliefDone: varchar("stress_relief_done"),
  createdAt: timestamp("created_at").defaultNow()
});
var insertMoodFoodSchema = createInsertSchema(moodFoodEntries).omit({
  id: true,
  createdAt: true
});

// server/wellness-engine.ts
var wellnessMap = {
  protein: {
    keywords: ["chicken", "eggs", "tofu", "lentils", "turkey", "fish", "beans", "quinoa", "greek yogurt", "cottage cheese"],
    workout: "Strength Training",
    workoutDescription: "Resistance exercises, weightlifting, or bodyweight strength moves",
    workoutDuration: 45,
    workoutIntensity: "high",
    stressTip: "Power Music + Dynamic Stretching",
    stressTipDescription: "Energizing playlist combined with active stretching routine",
    stressTipDuration: 15,
    scientificReason: "Protein supports muscle repair and growth - optimal for strength training recovery"
  },
  carbs: {
    keywords: ["pasta", "rice", "bread", "potatoes", "oats", "banana", "sweet potato", "quinoa", "barley"],
    workout: "Cardio or Light Jog",
    workoutDescription: "Running, cycling, dancing, or any sustained cardiovascular activity",
    workoutDuration: 30,
    workoutIntensity: "medium",
    stressTip: "Gratitude Journaling",
    stressTipDescription: "Write down 3 things you're grateful for and reflect on positive moments",
    stressTipDuration: 10,
    scientificReason: "Carbs provide quick energy for cardio; serotonin boost aids mood and gratitude practice"
  },
  omega3: {
    keywords: ["salmon", "walnuts", "chia seeds", "flaxseed", "mackerel", "sardines", "hemp seeds"],
    workout: "Yoga or Pilates",
    workoutDescription: "Flowing movements, flexibility work, and mind-body connection",
    workoutDuration: 30,
    workoutIntensity: "low",
    stressTip: "Guided Meditation",
    stressTipDescription: "Mindfulness meditation focusing on breath awareness and mental clarity",
    stressTipDuration: 15,
    scientificReason: "Omega-3s reduce inflammation and support brain health - perfect for mind-body practices"
  },
  magnesium: {
    keywords: ["spinach", "pumpkin seeds", "dark chocolate", "almonds", "avocado", "black beans", "kale"],
    workout: "Progressive Muscle Relaxation",
    workoutDescription: "Systematic tensing and releasing of muscle groups for deep relaxation",
    workoutDuration: 20,
    workoutIntensity: "low",
    stressTip: "Breathwork Session",
    stressTipDescription: "Deep breathing exercises like 4-7-8 breathing or box breathing",
    stressTipDuration: 10,
    scientificReason: "Magnesium is essential for muscle relaxation and nervous system regulation"
  },
  fiber: {
    keywords: ["broccoli", "berries", "apples", "beans", "whole grains", "artichoke", "brussels sprouts"],
    workout: "Nature Walk",
    workoutDescription: "Gentle walk outdoors, hiking, or light outdoor activity",
    workoutDuration: 25,
    workoutIntensity: "low",
    stressTip: "Mindful Eating Practice",
    stressTipDescription: "Slow, conscious eating focusing on flavors, textures, and gratitude",
    stressTipDuration: 15,
    scientificReason: "Fiber supports gut health which directly impacts mood via the gut-brain axis"
  },
  antioxidants: {
    keywords: ["blueberries", "strawberries", "green tea", "dark chocolate", "bell peppers", "tomatoes"],
    workout: "HIIT or Circuit Training",
    workoutDescription: "High-intensity intervals alternating with rest periods",
    workoutDuration: 20,
    workoutIntensity: "high",
    stressTip: "Color Therapy Visualization",
    stressTipDescription: "Visualize vibrant colors while deep breathing to reduce oxidative stress",
    stressTipDuration: 8,
    scientificReason: "Antioxidants combat exercise-induced oxidative stress, supporting recovery from intense workouts"
  },
  calcium: {
    keywords: ["dairy", "milk", "cheese", "yogurt", "kale", "broccoli", "sardines", "almonds"],
    workout: "Bone-Strengthening Exercises",
    workoutDescription: "Weight-bearing exercises like jumping, dancing, or resistance training",
    workoutDuration: 30,
    workoutIntensity: "medium",
    stressTip: "Calming Herbal Tea Ritual",
    stressTipDescription: "Prepare and mindfully sip chamomile or passionflower tea",
    stressTipDuration: 15,
    scientificReason: "Calcium supports bone health and muscle contraction; ritual creates calming routine"
  },
  iron: {
    keywords: ["red meat", "spinach", "lentils", "tofu", "pumpkin seeds", "dark leafy greens"],
    workout: "Moderate Cardio",
    workoutDescription: "Steady-state cardio like brisk walking, swimming, or cycling",
    workoutDuration: 35,
    workoutIntensity: "medium",
    stressTip: "Energy Visualization",
    stressTipDescription: "Visualize bright energy flowing through your body, enhancing vitality",
    stressTipDuration: 12,
    scientificReason: "Iron supports oxygen transport - essential for sustained cardio performance"
  }
};
function analyzeIngredientsForWellness(ingredients) {
  const categoryScores = {};
  for (const ingredient of ingredients) {
    const lowerIngredient = ingredient.toLowerCase();
    for (const [category, mapping] of Object.entries(wellnessMap)) {
      const matchCount = mapping.keywords.filter(
        (keyword) => lowerIngredient.includes(keyword.toLowerCase()) || keyword.toLowerCase().includes(lowerIngredient)
      ).length;
      categoryScores[category] = (categoryScores[category] || 0) + matchCount;
    }
  }
  const sortedCategories = Object.entries(categoryScores).filter(([_, score]) => score > 0).sort(([_, a], [__, b]) => b - a);
  const primaryCategory = sortedCategories[0]?.[0] || "carbs";
  const secondaryCategory = sortedCategories[1]?.[0];
  const primaryMapping = wellnessMap[primaryCategory];
  const secondaryMapping = secondaryCategory ? wellnessMap[secondaryCategory] : null;
  const totalIngredients = ingredients.length;
  const matchedIngredients = sortedCategories[0]?.[1] || 0;
  const confidence = Math.min(0.9, matchedIngredients / totalIngredients * 2);
  return {
    primaryCategory,
    secondaryCategory,
    workoutRecommendation: primaryMapping,
    stressReliefRecommendation: secondaryMapping || primaryMapping,
    confidence: Math.max(0.6, confidence)
    // Minimum 60% confidence
  };
}
function analyzeMacronutrientsForWellness(macros) {
  const { protein = 0, carbs = 0, fat = 0, fiber = 0 } = macros;
  let dominantMacro = "carbs";
  let maxValue = carbs;
  if (protein > maxValue) {
    dominantMacro = "protein";
    maxValue = protein;
  }
  if (fat > maxValue) {
    dominantMacro = "omega3";
    maxValue = fat;
  }
  if (fiber > 10) {
    dominantMacro = "fiber";
  }
  const workoutMapping = wellnessMap[dominantMacro];
  let stressReliefCategory = dominantMacro;
  if (dominantMacro === "protein" && carbs > 20) {
    stressReliefCategory = "carbs";
  } else if (dominantMacro === "carbs" && protein > 15) {
    stressReliefCategory = "protein";
  }
  const stressMapping = wellnessMap[stressReliefCategory];
  const total = protein + carbs + fat + fiber;
  const confidence = total > 0 ? Math.min(0.9, maxValue / total + 0.4) : 0.7;
  return {
    dominantMacro,
    workoutRecommendation: workoutMapping,
    stressReliefRecommendation: stressMapping,
    confidence: Math.max(0.6, confidence)
  };
}
function generateWellnessRecommendations(meals) {
  if (!meals || meals.length === 0) {
    return {
      workoutRecommendation: {
        type: "workout",
        title: wellnessMap.carbs.workout,
        description: wellnessMap.carbs.workoutDescription,
        reason: wellnessMap.carbs.scientificReason,
        duration: wellnessMap.carbs.workoutDuration,
        intensity: wellnessMap.carbs.workoutIntensity,
        category: "carbs",
        confidence: 0.7
      },
      stressReliefTip: {
        type: "lifestyle",
        title: wellnessMap.carbs.stressTip,
        description: wellnessMap.carbs.stressTipDescription,
        reason: wellnessMap.carbs.scientificReason,
        duration: wellnessMap.carbs.stressTipDuration,
        intensity: "low",
        confidence: 0.7
      }
    };
  }
  const allIngredients = meals.flatMap((meal) => meal.ingredients || []);
  const totalNutrition = meals.reduce((total, meal) => {
    const nutrition = meal.nutritionInfo || {};
    return {
      protein: (total.protein || 0) + (nutrition.protein || 0),
      carbs: (total.carbs || 0) + (nutrition.carbs || 0),
      fat: (total.fat || 0) + (nutrition.fat || 0),
      fiber: (total.fiber || 0) + (nutrition.fiber || 0)
    };
  }, {});
  const ingredientAnalysis = analyzeIngredientsForWellness(allIngredients);
  const macroAnalysis = analyzeMacronutrientsForWellness(totalNutrition);
  const useIngredientAnalysis = ingredientAnalysis.confidence >= macroAnalysis.confidence;
  const workoutMapping = useIngredientAnalysis ? ingredientAnalysis.workoutRecommendation : macroAnalysis.workoutRecommendation;
  const stressMapping = useIngredientAnalysis ? ingredientAnalysis.stressReliefRecommendation : macroAnalysis.stressReliefRecommendation;
  const finalConfidence = Math.max(ingredientAnalysis.confidence, macroAnalysis.confidence);
  return {
    workoutRecommendation: {
      type: "workout",
      title: workoutMapping.workout,
      description: workoutMapping.workoutDescription,
      reason: workoutMapping.scientificReason,
      duration: workoutMapping.workoutDuration,
      intensity: workoutMapping.workoutIntensity,
      category: useIngredientAnalysis ? ingredientAnalysis.primaryCategory : macroAnalysis.dominantMacro,
      confidence: finalConfidence
    },
    stressReliefTip: {
      type: stressMapping.stressTip.toLowerCase().includes("meditation") ? "meditation" : "lifestyle",
      title: stressMapping.stressTip,
      description: stressMapping.stressTipDescription,
      reason: stressMapping.scientificReason,
      duration: stressMapping.stressTipDuration,
      intensity: "low",
      confidence: finalConfidence
    }
  };
}

// server/mood-learning-engine.ts
var mockTrainingData = [
  {
    id: "entry001",
    userId: "user001",
    date: /* @__PURE__ */ new Date("2025-08-06"),
    meals: ["grilled salmon", "quinoa bowl", "yogurt parfait"],
    moodBefore: "tired",
    moodAfter: "calm",
    energyLevel: 6,
    stressLevel: 3,
    workoutDone: "yoga",
    stressReliefDone: "guided meditation",
    createdAt: /* @__PURE__ */ new Date()
  },
  {
    id: "entry002",
    userId: "user002",
    date: /* @__PURE__ */ new Date("2025-08-06"),
    meals: ["white pasta", "french fries", "soda"],
    moodBefore: "low",
    moodAfter: "anxious",
    energyLevel: 3,
    stressLevel: 7,
    workoutDone: "none",
    stressReliefDone: "breathwork",
    createdAt: /* @__PURE__ */ new Date()
  },
  {
    id: "entry003",
    userId: "user003",
    date: /* @__PURE__ */ new Date("2025-08-06"),
    meals: ["spinach salad", "almonds", "dark chocolate"],
    moodBefore: "neutral",
    moodAfter: "focused",
    energyLevel: 7,
    stressLevel: 2,
    workoutDone: "strength training",
    stressReliefDone: "stretching",
    createdAt: /* @__PURE__ */ new Date()
  },
  {
    id: "entry004",
    userId: "user004",
    date: /* @__PURE__ */ new Date("2025-08-05"),
    meals: ["oatmeal", "blueberries", "walnuts"],
    moodBefore: "sleepy",
    moodAfter: "alert",
    energyLevel: 8,
    stressLevel: 2,
    workoutDone: "cardio",
    stressReliefDone: "deep breathing",
    createdAt: /* @__PURE__ */ new Date()
  },
  {
    id: "entry005",
    userId: "user005",
    date: /* @__PURE__ */ new Date("2025-08-05"),
    meals: ["avocado toast", "green tea", "banana"],
    moodBefore: "stressed",
    moodAfter: "balanced",
    energyLevel: 6,
    stressLevel: 4,
    workoutDone: "pilates",
    stressReliefDone: "mindfulness",
    createdAt: /* @__PURE__ */ new Date()
  },
  {
    id: "entry006",
    userId: "user006",
    date: /* @__PURE__ */ new Date("2025-08-04"),
    meals: ["chicken breast", "sweet potato", "broccoli"],
    moodBefore: "unmotivated",
    moodAfter: "energized",
    energyLevel: 8,
    stressLevel: 3,
    workoutDone: "strength training",
    stressReliefDone: "progressive muscle relaxation",
    createdAt: /* @__PURE__ */ new Date()
  },
  {
    id: "entry007",
    userId: "user007",
    date: /* @__PURE__ */ new Date("2025-08-04"),
    meals: ["chia pudding", "berries", "coconut"],
    moodBefore: "anxious",
    moodAfter: "peaceful",
    energyLevel: 5,
    stressLevel: 2,
    workoutDone: "yoga",
    stressReliefDone: "meditation",
    createdAt: /* @__PURE__ */ new Date()
  },
  {
    id: "entry008",
    userId: "user008",
    date: /* @__PURE__ */ new Date("2025-08-03"),
    meals: ["eggs", "spinach", "whole grain toast"],
    moodBefore: "foggy",
    moodAfter: "clear-minded",
    energyLevel: 7,
    stressLevel: 3,
    workoutDone: "walking",
    stressReliefDone: "journaling",
    createdAt: /* @__PURE__ */ new Date()
  }
];
function categorizeMeal(meal) {
  const lowerMeal = meal.toLowerCase();
  if (lowerMeal.includes("salmon") || lowerMeal.includes("fish") || lowerMeal.includes("walnuts") || lowerMeal.includes("chia")) {
    return "omega3";
  }
  if (lowerMeal.includes("chicken") || lowerMeal.includes("eggs") || lowerMeal.includes("tofu") || lowerMeal.includes("yogurt")) {
    return "protein";
  }
  if (lowerMeal.includes("spinach") || lowerMeal.includes("almonds") || lowerMeal.includes("avocado") || lowerMeal.includes("dark chocolate")) {
    return "magnesium";
  }
  if (lowerMeal.includes("berries") || lowerMeal.includes("blueberries") || lowerMeal.includes("tea")) {
    return "antioxidants";
  }
  if (lowerMeal.includes("pasta") || lowerMeal.includes("rice") || lowerMeal.includes("oatmeal") || lowerMeal.includes("toast")) {
    return "carbs";
  }
  if (lowerMeal.includes("salad") || lowerMeal.includes("broccoli") || lowerMeal.includes("vegetables")) {
    return "fiber";
  }
  return "general";
}
function calculateMoodImprovement(before, after) {
  const moodScales = {
    "terrible": 1,
    "low": 2,
    "tired": 3,
    "stressed": 3,
    "anxious": 2,
    "sleepy": 3,
    "foggy": 3,
    "unmotivated": 2,
    "neutral": 5,
    "calm": 7,
    "focused": 8,
    "alert": 8,
    "balanced": 7,
    "energized": 9,
    "peaceful": 8,
    "clear-minded": 8,
    "amazing": 10
  };
  const beforeScore = moodScales[before.toLowerCase()] || 5;
  const afterScore = moodScales[after.toLowerCase()] || 5;
  return afterScore - beforeScore;
}
function analyzeMoodFoodPatterns(entries) {
  const categoryData = {};
  entries.forEach((entry) => {
    const categories = entry.meals.map((meal) => categorizeMeal(meal));
    const dominantCategory = categories[0] || "general";
    if (!categoryData[dominantCategory]) {
      categoryData[dominantCategory] = {
        moodImprovements: [],
        energyLevels: [],
        stressLevels: [],
        workouts: [],
        stressReliefs: []
      };
    }
    const data = categoryData[dominantCategory];
    if (entry.moodBefore && entry.moodAfter) {
      data.moodImprovements.push(calculateMoodImprovement(entry.moodBefore, entry.moodAfter));
    }
    if (entry.energyLevel) data.energyLevels.push(entry.energyLevel);
    if (entry.stressLevel) data.stressLevels.push(10 - entry.stressLevel);
    if (entry.workoutDone && entry.workoutDone !== "none") data.workouts.push(entry.workoutDone);
    if (entry.stressReliefDone) data.stressReliefs.push(entry.stressReliefDone);
  });
  const patterns = {};
  Object.entries(categoryData).forEach(([category, data]) => {
    const avgMoodImprovement = data.moodImprovements.length > 0 ? data.moodImprovements.reduce((a, b) => a + b, 0) / data.moodImprovements.length : 0;
    const avgEnergyBoost = data.energyLevels.length > 0 ? data.energyLevels.reduce((a, b) => a + b, 0) / data.energyLevels.length : 5;
    const avgStressReduction = data.stressLevels.length > 0 ? data.stressLevels.reduce((a, b) => a + b, 0) / data.stressLevels.length : 5;
    const workoutFreq = data.workouts.reduce((acc, workout) => {
      acc[workout] = (acc[workout] || 0) + 1;
      return acc;
    }, {});
    const stressReliefFreq = data.stressReliefs.reduce((acc, relief) => {
      acc[relief] = (acc[relief] || 0) + 1;
      return acc;
    }, {});
    const effectiveWorkouts = Object.keys(workoutFreq).sort((a, b) => workoutFreq[b] - workoutFreq[a]);
    const effectiveStressRelief = Object.keys(stressReliefFreq).sort((a, b) => stressReliefFreq[b] - stressReliefFreq[a]);
    const sampleSize = data.moodImprovements.length + data.energyLevels.length + data.stressLevels.length;
    const confidence = Math.min(0.95, sampleSize / 10);
    patterns[category] = {
      foodCategory: category,
      averageMoodImprovement: avgMoodImprovement,
      energyBoost: avgEnergyBoost,
      stressReduction: avgStressReduction,
      effectiveWorkouts: effectiveWorkouts.slice(0, 3),
      effectiveStressRelief: effectiveStressRelief.slice(0, 3),
      confidence,
      sampleSize
    };
  });
  return patterns;
}
function generatePersonalizedRecommendations(userMeals, currentMood, patterns) {
  const recommendations = [];
  const userCategories = userMeals.map((meal) => categorizeMeal(meal));
  const dominantCategory = userCategories[0] || "general";
  const pattern = patterns[dominantCategory];
  if (!pattern) return recommendations;
  if (pattern.effectiveWorkouts.length > 0 && pattern.energyBoost > 6) {
    recommendations.push({
      type: "workout",
      title: `Try ${pattern.effectiveWorkouts[0]}`,
      description: `Based on ${pattern.sampleSize} similar meal patterns, ${pattern.effectiveWorkouts[0]} works best with ${dominantCategory} meals`,
      confidence: pattern.confidence,
      reason: `Users with ${dominantCategory} meals showed ${Math.round(pattern.energyBoost)}/10 energy levels with this workout`,
      timing: "within 2-3 hours of eating"
    });
  }
  if (pattern.effectiveStressRelief.length > 0 && pattern.stressReduction > 5) {
    recommendations.push({
      type: "stress-relief",
      title: `${pattern.effectiveStressRelief[0]} session`,
      description: `Your meal profile suggests this stress relief method will be highly effective`,
      confidence: pattern.confidence,
      reason: `${dominantCategory} meals combined with ${pattern.effectiveStressRelief[0]} reduced stress by ${Math.round(pattern.stressReduction)}/10 on average`,
      timing: "ideal for right now"
    });
  }
  if (pattern.averageMoodImprovement > 1 && currentMood.toLowerCase().includes("tired")) {
    recommendations.push({
      type: "mood-boost",
      title: "Perfect meal choice for energy",
      description: `Your ${dominantCategory} meals typically boost mood and energy levels significantly`,
      confidence: pattern.confidence,
      reason: `Similar meals improved mood by ${Math.round(pattern.averageMoodImprovement)} points on average`
    });
  }
  return recommendations.sort((a, b) => b.confidence - a.confidence);
}
function runMoodLearningEngine(userEntries, currentMeals, currentMood = "neutral") {
  const allEntries = [...mockTrainingData, ...userEntries];
  const patterns = analyzeMoodFoodPatterns(allEntries);
  const recommendations = generatePersonalizedRecommendations(currentMeals, currentMood, patterns);
  const insights = [];
  const sortedPatterns = Object.values(patterns).filter((p) => p.sampleSize > 2).sort((a, b) => b.averageMoodImprovement - a.averageMoodImprovement);
  if (sortedPatterns.length > 0) {
    const bestPattern = sortedPatterns[0];
    insights.push(`${bestPattern.foodCategory} meals show the highest mood improvement (+${Math.round(bestPattern.averageMoodImprovement)} points)`);
  }
  if (sortedPatterns.length > 1) {
    const energeticPattern = sortedPatterns.find((p) => p.energyBoost > 7);
    if (energeticPattern) {
      insights.push(`${energeticPattern.foodCategory} meals provide the best energy boost (${Math.round(energeticPattern.energyBoost)}/10)`);
    }
  }
  return { patterns, recommendations, insights };
}

// server/routes.ts
init_ai_fitness_engine();
import { z as z2 } from "zod";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
async function generateMealPlan(budget, people, days, store, allergies, dislikes, dietType, calorieGoal, activityLevel, maxCookingTime, skillLevel) {
  const apiKey = process.env.SPOONACULAR_API_KEY || process.env.VITE_SPOONACULAR_API_KEY || "demo_key";
  try {
    let caloriesPerPerson = calorieGoal || 2e3;
    if (activityLevel) {
      const activityMultipliers = {
        "sedentary": 0.9,
        "light": 1,
        "moderate": 1.1,
        "active": 1.2,
        "very_active": 1.3
      };
      caloriesPerPerson = Math.round(caloriesPerPerson * (activityMultipliers[activityLevel] || 1));
    }
    const totalCalories = caloriesPerPerson * people;
    const excludeList = [...allergies || [], ...dislikes || []].join(",");
    const dietParam = dietType || "";
    const mealPlanResponse = await fetch(
      `https://api.spoonacular.com/mealplanner/generate?apiKey=${apiKey}&timeFrame=week&targetCalories=${totalCalories}&diet=${dietParam}&exclude=${excludeList}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    if (!mealPlanResponse.ok) {
      throw new Error(`Spoonacular API error: ${mealPlanResponse.status}`);
    }
    const mealPlanData = await mealPlanResponse.json();
    const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const meals = [];
    const groceryItems = /* @__PURE__ */ new Map();
    let totalCost = 0;
    for (let dayIndex = 0; dayIndex < Math.min(days, 7); dayIndex++) {
      const dayData = mealPlanData.week[Object.keys(mealPlanData.week)[0]];
      const dayMeals = dayData.meals || [];
      for (const meal of dayMeals) {
        const recipeResponse = await fetch(
          `https://api.spoonacular.com/recipes/${meal.id}/information?apiKey=${apiKey}&includeNutrition=true`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
        if (recipeResponse.ok) {
          const recipeData = await recipeResponse.json();
          const estimatedCost = estimateMealCost(recipeData.extendedIngredients, people);
          totalCost += estimatedCost;
          meals.push({
            id: meal.id,
            name: recipeData.title,
            cost: estimatedCost,
            calories: Math.round((recipeData.nutrition?.nutrients?.find((n) => n.name === "Calories")?.amount || 400) * people),
            type: getMealType(dayIndex, meals.length % 3),
            day: daysOfWeek[dayIndex],
            ingredients: recipeData.extendedIngredients.map((ing) => ing.original)
          });
          recipeData.extendedIngredients.forEach((ingredient) => {
            const key = ingredient.name.toLowerCase();
            if (groceryItems.has(key)) {
              const existing = groceryItems.get(key);
              existing.quantity = combineQuantities(existing.quantity, ingredient.measures.metric.amount, ingredient.measures.metric.unitShort);
              existing.cost += estimateIngredientCost(ingredient);
            } else {
              groceryItems.set(key, {
                name: ingredient.name,
                quantity: `${ingredient.measures.metric.amount} ${ingredient.measures.metric.unitShort}`,
                cost: estimateIngredientCost(ingredient),
                category: categorizeIngredient(ingredient.aisle || ingredient.name)
              });
            }
          });
        }
      }
    }
    if (totalCost > budget) {
      const reductionFactor = budget / totalCost;
      totalCost = budget * 0.95;
      meals.forEach((meal) => {
        meal.cost *= reductionFactor;
      });
      groceryItems.forEach((item) => {
        item.cost *= reductionFactor;
      });
    }
    const groceryList = organizeGroceryList(Array.from(groceryItems.values()));
    const mealPrepInstructions = generateMealPrepInstructions(meals, days);
    return {
      meals,
      totalCost,
      groceryList,
      mealPrepInstructions,
      // WORKFLOW OPTIMIZATION FEATURE!
      savings: Math.max(0, budget - totalCost)
    };
  } catch (error) {
    console.error("Error generating meal plan:", error);
    return await generateFallbackMealPlan(budget, people, days, allergies, dislikes, dietType, calorieGoal, activityLevel, maxCookingTime, skillLevel);
  }
}
function getMealType(dayIndex, mealIndex) {
  const types = ["breakfast", "lunch", "dinner"];
  return types[mealIndex % 3];
}
function estimateMealCost(ingredients, people) {
  const baseCost = ingredients.reduce((total, ing) => {
    const amount = ing.measures?.metric?.amount || 1;
    const basePrice = getIngredientBasePrice(ing.name || "");
    return total + basePrice * amount * people;
  }, 0);
  return Math.round(baseCost * 100) / 100;
}
function getIngredientBasePrice(ingredientName) {
  const name = ingredientName.toLowerCase();
  if (name.includes("chicken") || name.includes("beef") || name.includes("pork")) return 0.15;
  if (name.includes("fish") || name.includes("salmon") || name.includes("tuna")) return 0.2;
  if (name.includes("egg")) return 0.25;
  if (name.includes("milk") || name.includes("cheese") || name.includes("yogurt")) return 0.1;
  if (name.includes("rice") || name.includes("pasta") || name.includes("bread")) return 0.05;
  if (name.includes("potato") || name.includes("onion") || name.includes("carrot")) return 0.03;
  if (name.includes("tomato") || name.includes("pepper") || name.includes("lettuce")) return 0.08;
  if (name.includes("oil") || name.includes("butter")) return 0.12;
  if (name.includes("spice") || name.includes("herb") || name.includes("salt")) return 0.02;
  return 0.06;
}
function estimateIngredientCost(ingredient) {
  const amount = ingredient.measures?.metric?.amount || 1;
  const basePrice = getIngredientBasePrice(ingredient.name || "");
  return Math.round(basePrice * amount * 100) / 100;
}
function categorizeIngredient(aisle) {
  const aisleMap = {
    "Meat": "protein",
    "Seafood": "protein",
    "Dairy and Eggs": "dairy",
    "Produce": "produce",
    "Pantry": "pantry",
    "Bakery/Bread": "pantry",
    "Pasta and Rice": "pantry",
    "Canned and Jarred": "pantry",
    "Frozen": "frozen",
    "Spices and Seasonings": "pantry"
  };
  return aisleMap[aisle] || "pantry";
}
function combineQuantities(existing, newAmount, unit) {
  const match = existing.match(/^([\d.]+)\s*(.*)$/);
  if (match) {
    const existingAmount = parseFloat(match[1]);
    const existingUnit = match[2];
    if (existingUnit === unit) {
      return `${existingAmount + newAmount} ${unit}`;
    }
  }
  return `${existing} + ${newAmount} ${unit}`;
}
function organizeGroceryList(items) {
  const categories = {
    produce: { name: "Produce", icon: "apple-alt", items: [], totalCost: 0 },
    protein: { name: "Protein", icon: "drumstick-bite", items: [], totalCost: 0 },
    dairy: { name: "Dairy", icon: "cheese", items: [], totalCost: 0 },
    pantry: { name: "Pantry", icon: "box", items: [], totalCost: 0 },
    frozen: { name: "Frozen", icon: "snowflake", items: [], totalCost: 0 }
  };
  items.forEach((item) => {
    const category = categories[item.category] || categories.pantry;
    category.items.push(item);
    category.totalCost += item.cost;
  });
  return Object.values(categories).filter((cat) => cat.items.length > 0);
}
function generateMealPrepInstructions(meals, days) {
  const prepTasks = [];
  const ingredientBatches = {};
  meals.forEach((meal, index) => {
    const day = Math.floor(index / 3) + 1;
    if (meal.ingredients.includes("rice") || meal.ingredients.includes("instant rice")) {
      if (!ingredientBatches["rice"]) {
        ingredientBatches["rice"] = {
          ingredient: "rice",
          totalAmount: "3-4 cups",
          meals: [],
          day
        };
      }
      ingredientBatches["rice"].meals.push(meal.name);
    }
    if (meal.ingredients.some((ing) => ing.includes("vegetables") || ing.includes("veggies"))) {
      if (!ingredientBatches["vegetables"]) {
        ingredientBatches["vegetables"] = {
          ingredient: "vegetables",
          task: "Pre-chop all vegetables",
          meals: [],
          day: Math.min(day, 2)
          // Do early for freshness
        };
      }
      ingredientBatches["vegetables"].meals.push(meal.name);
    }
    if (meal.ingredients.includes("pasta")) {
      if (!ingredientBatches["pasta"]) {
        ingredientBatches["pasta"] = {
          ingredient: "pasta",
          task: "Cook large batch of pasta",
          meals: [],
          day
        };
      }
      ingredientBatches["pasta"].meals.push(meal.name);
    }
  });
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  if (ingredientBatches["rice"]) {
    prepTasks.push({
      day: 1,
      dayName: daysOfWeek[0],
      task: `Cook ${ingredientBatches["rice"].totalAmount} rice for multiple meals`,
      benefit: `Saves 15+ minutes daily`,
      meals: ingredientBatches["rice"].meals.slice(0, 3),
      timeRequired: "20 minutes",
      category: "batch-cooking"
    });
  }
  if (ingredientBatches["vegetables"]) {
    prepTasks.push({
      day: 2,
      dayName: daysOfWeek[1],
      task: "Pre-chop all vegetables for stir fry, omelets, and bowls",
      benefit: "Quick assembly for 3-4 meals",
      meals: ingredientBatches["vegetables"].meals.slice(0, 3),
      timeRequired: "15 minutes",
      category: "prep-work"
    });
  }
  prepTasks.push({
    day: 3,
    dayName: daysOfWeek[2],
    task: "Mix dressings and sauces for different bowls",
    benefit: "Instant flavor for quick meals",
    meals: ["Rice bowls", "Salads", "Stir fry dishes"],
    timeRequired: "10 minutes",
    category: "sauces"
  });
  const proteinMeals = meals.filter(
    (meal) => meal.ingredients.some(
      (ing) => ["chicken", "turkey", "beef", "fish", "tofu"].some(
        (protein) => ing.toLowerCase().includes(protein)
      )
    )
  );
  if (proteinMeals.length >= 3) {
    prepTasks.push({
      day: 1,
      dayName: daysOfWeek[0],
      task: "Season and marinate proteins for the week",
      benefit: "Better flavor and faster cooking",
      meals: proteinMeals.slice(0, 3).map((meal) => meal.name),
      timeRequired: "10 minutes",
      category: "protein-prep"
    });
  }
  return {
    totalPrepTime: prepTasks.reduce((total, task) => total + parseInt(task.timeRequired), 0),
    timeSavedDaily: "20-30 minutes per day",
    instructions: prepTasks,
    tips: [
      "Store prepped vegetables in airtight containers",
      "Cooked rice lasts 4-5 days in refrigerator",
      "Prep on Sunday for week-long convenience",
      "Use glass containers for better freshness"
    ]
  };
}
function generateFallbackMealPlan(budget, people, days, allergies, dislikes, dietType, calorieGoal, activityLevel, maxCookingTime, skillLevel) {
  let simpleMeals = [
    {
      name: "Oatmeal with Banana",
      type: "breakfast",
      costPerPerson: 1.5,
      calories: 320,
      contains: ["gluten"],
      ingredients: ["oats", "banana", "milk"],
      cookingTime: 5,
      // 5 minutes - MICROWAVE FRIENDLY
      skillLevel: "beginner",
      cookingMethod: "microwave",
      nutritionInfo: { protein: 8, carbs: 54, fat: 6, fiber: 8 },
      substitutions: []
    },
    {
      name: "Scrambled Eggs & Toast",
      type: "breakfast",
      costPerPerson: 2,
      calories: 285,
      contains: ["eggs", "gluten"],
      ingredients: ["eggs", "bread", "butter"],
      cookingTime: 8,
      // 8 minutes
      skillLevel: "beginner",
      cookingMethod: "stovetop",
      nutritionInfo: { protein: 15, carbs: 20, fat: 18, fiber: 2 },
      substitutions: []
    },
    {
      name: "Peanut Butter Toast",
      type: "breakfast",
      costPerPerson: 1.25,
      calories: 290,
      contains: ["nuts", "gluten"],
      ingredients: ["bread", "peanut butter"],
      cookingTime: 3,
      // 3 minutes - NO COOKING!
      skillLevel: "beginner",
      cookingMethod: "no-cook",
      nutritionInfo: { protein: 12, carbs: 28, fat: 16, fiber: 4 },
      substitutions: []
    },
    {
      name: "Fruit & Yogurt Bowl",
      type: "breakfast",
      costPerPerson: 2.25,
      calories: 250,
      contains: ["dairy"],
      ingredients: ["yogurt", "berries", "granola"],
      cookingTime: 2,
      // 2 minutes - ASSEMBLY ONLY
      skillLevel: "beginner",
      cookingMethod: "no-cook",
      nutritionInfo: { protein: 12, carbs: 35, fat: 8, fiber: 6 },
      substitutions: []
    },
    // 15-MINUTE MICROWAVE MEALS FOR BEGINNERS
    {
      name: "Microwave Burrito Bowl",
      type: "lunch",
      costPerPerson: 3.25,
      calories: 450,
      contains: [],
      ingredients: ["instant rice", "canned beans", "salsa", "cheese"],
      cookingTime: 6,
      // 6 minutes - MICROWAVE
      skillLevel: "beginner",
      cookingMethod: "microwave",
      nutritionInfo: { protein: 18, carbs: 65, fat: 12, fiber: 12 },
      substitutions: []
    },
    {
      name: "Instant Ramen Upgrade",
      type: "lunch",
      costPerPerson: 2.5,
      calories: 380,
      contains: ["gluten"],
      ingredients: ["instant ramen", "frozen vegetables", "egg"],
      cookingTime: 5,
      // 5 minutes - MICROWAVE + EGG
      skillLevel: "beginner",
      cookingMethod: "microwave",
      nutritionInfo: { protein: 15, carbs: 48, fat: 14, fiber: 4 },
      substitutions: []
    },
    {
      name: "Turkey Sandwich",
      type: "lunch",
      costPerPerson: 3.5,
      calories: 420,
      contains: ["gluten"],
      ingredients: ["turkey", "bread", "lettuce", "tomato"],
      cookingTime: 5,
      // 5 minutes - ASSEMBLY ONLY
      skillLevel: "beginner",
      cookingMethod: "no-cook",
      nutritionInfo: { protein: 25, carbs: 35, fat: 12, fiber: 4 },
      substitutions: []
    },
    {
      name: "Pasta Salad",
      type: "lunch",
      costPerPerson: 2.75,
      calories: 380,
      contains: ["gluten"],
      ingredients: ["pasta", "vegetables", "olive oil"],
      cookingTime: 15,
      // 15 minutes - BOIL PASTA
      skillLevel: "intermediate",
      cookingMethod: "stovetop",
      nutritionInfo: { protein: 8, carbs: 55, fat: 14, fiber: 5 },
      substitutions: []
    },
    {
      name: "Rice Bowl with Vegetables",
      type: "lunch",
      costPerPerson: 3,
      calories: 450,
      contains: [],
      ingredients: ["rice", "mixed vegetables", "soy sauce"],
      nutritionInfo: { protein: 10, carbs: 65, fat: 12, fiber: 6 },
      substitutions: []
    },
    {
      name: "Quinoa Salad",
      type: "lunch",
      costPerPerson: 3.25,
      calories: 400,
      contains: [],
      ingredients: ["quinoa", "vegetables", "vinaigrette"],
      nutritionInfo: { protein: 14, carbs: 58, fat: 10, fiber: 8 },
      substitutions: []
    },
    {
      name: "Chicken & Rice",
      type: "dinner",
      costPerPerson: 5.5,
      calories: 580,
      contains: [],
      ingredients: ["chicken breast", "rice", "vegetables"],
      nutritionInfo: { protein: 45, carbs: 50, fat: 12, fiber: 4 },
      substitutions: []
    },
    {
      name: "Spaghetti with Marinara",
      type: "dinner",
      costPerPerson: 4.25,
      calories: 520,
      contains: ["gluten"],
      ingredients: ["pasta", "marinara sauce", "herbs"],
      nutritionInfo: { protein: 15, carbs: 78, fat: 12, fiber: 6 },
      substitutions: []
    },
    {
      name: "Bean & Vegetable Stew",
      type: "dinner",
      costPerPerson: 3.75,
      calories: 450,
      contains: [],
      ingredients: ["beans", "vegetables", "broth"],
      nutritionInfo: { protein: 18, carbs: 65, fat: 8, fiber: 12 },
      substitutions: []
    },
    {
      name: "Grilled Fish with Vegetables",
      type: "dinner",
      costPerPerson: 6,
      calories: 480,
      contains: ["fish"],
      ingredients: ["fish fillet", "vegetables", "herbs"],
      nutritionInfo: { protein: 35, carbs: 25, fat: 20, fiber: 6 },
      substitutions: []
    },
    {
      name: "Tofu Stir Fry",
      type: "dinner",
      costPerPerson: 4,
      calories: 420,
      contains: ["soy"],
      ingredients: ["tofu", "vegetables", "stir fry sauce"],
      nutritionInfo: { protein: 20, carbs: 35, fat: 18, fiber: 8 },
      substitutions: []
    }
  ];
  const substitutionMap = {
    // Dairy substitutions
    "milk": { substitute: "almond milk", reason: "dairy-free alternative" },
    "yogurt": { substitute: "coconut yogurt", reason: "dairy-free alternative" },
    "butter": { substitute: "olive oil", reason: "dairy-free alternative" },
    "cheese": { substitute: "nutritional yeast", reason: "dairy-free alternative" },
    // Gluten substitutions
    "bread": { substitute: "gluten-free bread", reason: "gluten-free alternative" },
    "pasta": { substitute: "rice noodles", reason: "gluten-free alternative" },
    "oats": { substitute: "quinoa flakes", reason: "gluten-free alternative" },
    // Nut substitutions
    "peanut butter": { substitute: "sunflower seed butter", reason: "nut-free alternative" },
    "almonds": { substitute: "pumpkin seeds", reason: "nut-free alternative" },
    // Meat substitutions for vegetarian/vegan
    "chicken": { substitute: "tofu", reason: "plant-based protein" },
    "turkey": { substitute: "tempeh", reason: "plant-based protein" },
    "fish": { substitute: "mushrooms", reason: "plant-based alternative" },
    // Egg substitutions
    "eggs": { substitute: "flax eggs", reason: "vegan alternative" }
  };
  simpleMeals = simpleMeals.map((meal) => {
    const mealCopy = { ...meal, substitutions: [] };
    const needsSubstitution = [...allergies || [], ...dislikes || []];
    if (needsSubstitution.length > 0) {
      mealCopy.ingredients = meal.ingredients.map((ingredient) => {
        const lowerIngredient = ingredient.toLowerCase();
        for (const restriction of needsSubstitution) {
          const lowerRestriction = restriction.toLowerCase();
          if (lowerIngredient.includes(lowerRestriction) || lowerRestriction.includes("dairy") && ["milk", "yogurt", "cheese", "butter"].some((dairy) => lowerIngredient.includes(dairy)) || lowerRestriction.includes("nuts") && ["peanut", "almond", "walnut", "cashew"].some((nut) => lowerIngredient.includes(nut))) {
            const substitution = Object.entries(substitutionMap).find(
              ([key]) => lowerIngredient.includes(key)
            );
            if (substitution) {
              const [original, sub] = substitution;
              mealCopy.substitutions.push({
                original: ingredient,
                substitute: sub.substitute,
                reason: sub.reason
              });
              return sub.substitute;
            }
          }
        }
        return ingredient;
      });
    }
    return mealCopy;
  });
  if (maxCookingTime && maxCookingTime > 0) {
    simpleMeals = simpleMeals.filter((meal) => (meal.cookingTime || 30) <= maxCookingTime);
    console.log(`Filtered to ${simpleMeals.length} meals under ${maxCookingTime} minutes`);
  }
  if (skillLevel) {
    if (skillLevel === "beginner") {
      simpleMeals = simpleMeals.filter(
        (meal) => meal.skillLevel === "beginner" && (meal.cookingMethod === "microwave" || meal.cookingMethod === "no-cook" || meal.cookingMethod === "stovetop" && (meal.cookingTime || 30) <= 10)
      );
      console.log(`Filtered to ${simpleMeals.length} beginner-friendly meals`);
    } else if (skillLevel === "intermediate") {
      simpleMeals = simpleMeals.filter(
        (meal) => meal.skillLevel === "beginner" || meal.skillLevel === "intermediate"
      );
    }
  }
  if (allergies && allergies.length > 0) {
    simpleMeals = simpleMeals.filter(
      (meal) => !allergies.some(
        (allergy) => meal.contains.includes(allergy.toLowerCase()) || meal.ingredients.some(
          (ingredient) => ingredient.toLowerCase().includes(allergy.toLowerCase()) || allergy.toLowerCase().includes("dairy") && ["milk", "yogurt", "cheese", "butter"].some(
            (dairy) => ingredient.toLowerCase().includes(dairy)
          ) || allergy.toLowerCase().includes("nuts") && ["peanut", "almond", "walnut", "cashew"].some(
            (nut) => ingredient.toLowerCase().includes(nut)
          )
        )
      )
    );
  }
  if (dislikes && dislikes.length > 0) {
    simpleMeals = simpleMeals.filter(
      (meal) => !dislikes.some(
        (dislike) => meal.name.toLowerCase().includes(dislike.toLowerCase()) || meal.ingredients.some(
          (ingredient) => ingredient.toLowerCase().includes(dislike.toLowerCase())
        )
      )
    );
  }
  if (dietType) {
    switch (dietType.toLowerCase()) {
      case "vegetarian":
        simpleMeals = simpleMeals.filter(
          (meal) => !meal.ingredients.some(
            (ingredient) => ["chicken", "turkey", "beef", "pork", "fish"].some(
              (meat) => ingredient.toLowerCase().includes(meat)
            )
          )
        );
        break;
      case "vegan":
        simpleMeals = simpleMeals.filter(
          (meal) => !meal.contains.includes("dairy") && !meal.contains.includes("eggs") && !meal.ingredients.some(
            (ingredient) => ["chicken", "turkey", "beef", "pork", "fish", "milk", "yogurt", "cheese", "butter", "eggs"].some(
              (animal) => ingredient.toLowerCase().includes(animal)
            )
          )
        );
        break;
      case "pescatarian":
        simpleMeals = simpleMeals.filter(
          (meal) => !meal.ingredients.some(
            (ingredient) => ["chicken", "turkey", "beef", "pork"].some(
              (meat) => ingredient.toLowerCase().includes(meat)
            )
          )
        );
        break;
      case "gluten-free":
        simpleMeals = simpleMeals.filter((meal) => !meal.contains.includes("gluten"));
        break;
    }
  }
  if (calorieGoal && calorieGoal > 0) {
    const targetCaloriesPerMeal = Math.round(calorieGoal / 3);
    const calorieRange = Math.round(targetCaloriesPerMeal * 0.3);
    simpleMeals = simpleMeals.filter((meal) => {
      const mealCalories = meal.calories || 400;
      return mealCalories >= targetCaloriesPerMeal - calorieRange && mealCalories <= targetCaloriesPerMeal + calorieRange;
    });
    console.log(`Filtered to ${simpleMeals.length} meals matching calorie goal of ${calorieGoal} calories/day`);
  }
  const meals = [];
  let totalCost = 0;
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  for (let day = 0; day < days; day++) {
    ["breakfast", "lunch", "dinner"].forEach((mealType) => {
      const availableMeals = simpleMeals.filter((m) => m.type === mealType);
      if (availableMeals.length === 0) {
        const safeMeal = {
          name: `Safe ${mealType.charAt(0).toUpperCase() + mealType.slice(1)}`,
          costPerPerson: 3,
          calories: 400
        };
        meals.push({
          id: Math.floor(Math.random() * 1e6),
          name: safeMeal.name,
          cost: safeMeal.costPerPerson * people,
          calories: safeMeal.calories * people,
          type: mealType,
          day: daysOfWeek[day % 7],
          ingredients: []
        });
        totalCost += safeMeal.costPerPerson * people;
        return;
      }
      const meal = availableMeals[Math.floor(Math.random() * availableMeals.length)];
      const cost = meal.costPerPerson * people;
      meals.push({
        id: Math.floor(Math.random() * 1e6),
        name: meal.name,
        cost,
        calories: meal.calories * people,
        type: meal.type,
        day: daysOfWeek[day % 7],
        ingredients: meal.ingredients || [],
        substitutions: meal.substitutions || [],
        cookingTime: meal.cookingTime || 30,
        // Include cooking time
        skillLevel: meal.skillLevel || "intermediate",
        // Include skill level
        cookingMethod: meal.cookingMethod || "stovetop",
        // Include cooking method
        nutritionInfo: meal.nutritionInfo ? {
          protein: meal.nutritionInfo.protein * people,
          carbs: meal.nutritionInfo.carbs * people,
          fat: meal.nutritionInfo.fat * people,
          fiber: meal.nutritionInfo.fiber * people
        } : void 0
      });
      totalCost += cost;
    });
  }
  if (totalCost > budget) {
    const factor = budget * 0.95 / totalCost;
    totalCost = budget * 0.95;
    meals.forEach((meal) => {
      meal.cost *= factor;
    });
  }
  const mealPrepInstructions = generateMealPrepInstructions(meals, days);
  const groceryList = [
    {
      name: "Produce",
      icon: "apple-alt",
      items: [
        { name: "Bananas", quantity: "2 lbs", cost: 2.98, category: "produce" },
        { name: "Onions", quantity: "3 lbs", cost: 2.49, category: "produce" }
      ],
      totalCost: 5.47
    },
    {
      name: "Protein",
      icon: "drumstick-bite",
      items: [
        { name: "Chicken Breast", quantity: "2 lbs", cost: 7.98, category: "protein" },
        { name: "Eggs", quantity: "18 count", cost: 3.99, category: "protein" }
      ],
      totalCost: 11.97
    },
    {
      name: "Pantry",
      icon: "box",
      items: [
        { name: "Rice", quantity: "5 lbs", cost: 4.49, category: "pantry" },
        { name: "Pasta", quantity: "3 boxes", cost: 2.97, category: "pantry" },
        { name: "Bread", quantity: "2 loaves", cost: 2.98, category: "pantry" }
      ],
      totalCost: 10.44
    }
  ];
  return {
    meals,
    totalCost,
    groceryList,
    mealPrepInstructions,
    // SMART WORKFLOW OPTIMIZATION!
    savings: Math.max(0, budget - totalCost)
  };
}
async function registerRoutes(app2) {
  app2.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app2.get("/login.html", (req, res) => {
    const distPath = path.resolve(__dirname, "..", "dist", "public", "login.html");
    const publicPath = path.resolve(__dirname, "..", "client", "public", "login.html");
    res.sendFile(distPath, (err) => {
      if (err) {
        res.sendFile(publicPath, (fallbackErr) => {
          if (fallbackErr) {
            res.status(404).send("Login page not found");
          }
        });
      }
    });
  });
  app2.post("/api/wellness/track", async (req, res) => {
    try {
      const validated = insertWellnessSchema.parse(req.body);
      const wellnessEntry = await storage.createWellnessEntry(validated);
      res.json(wellnessEntry);
    } catch (error) {
      console.error("Error tracking wellness:", error);
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid wellness data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to track wellness" });
    }
  });
  app2.get("/api/wellness/history", async (req, res) => {
    try {
      const days = parseInt(req.query.days) || 30;
      const history = await storage.getWellnessHistory(days);
      res.json(history);
    } catch (error) {
      console.error("Error fetching wellness history:", error);
      res.status(500).json({ message: "Failed to fetch wellness history" });
    }
  });
  app2.post("/api/nutrition/insights", async (req, res) => {
    try {
      const validated = insertNutritionSchema.parse(req.body);
      const insight = await storage.createNutritionInsight(validated);
      res.json(insight);
    } catch (error) {
      console.error("Error creating nutrition insight:", error);
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid nutrition data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create nutrition insight" });
    }
  });
  app2.post("/api/wellness/recommendations", async (req, res) => {
    try {
      const { meals } = req.body;
      if (!meals || !Array.isArray(meals)) {
        return res.status(400).json({ message: "Invalid meals data provided" });
      }
      const recommendations = generateWellnessRecommendations(meals);
      res.json(recommendations);
    } catch (error) {
      console.error("Error generating wellness recommendations:", error);
      res.status(500).json({ message: "Failed to generate wellness recommendations" });
    }
  });
  app2.post("/api/mood-food/entry", async (req, res) => {
    try {
      const validated = insertMoodFoodSchema.parse(req.body);
      const entry = await storage.createMoodFoodEntry(validated);
      res.json(entry);
    } catch (error) {
      console.error("Error creating mood-food entry:", error);
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ message: "Invalid mood-food data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create mood-food entry" });
    }
  });
  app2.get("/api/mood-food/entries/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const days = parseInt(req.query.days) || 30;
      const entries = await storage.getMoodFoodEntries(userId, days);
      res.json(entries);
    } catch (error) {
      console.error("Error fetching mood-food entries:", error);
      res.status(500).json({ message: "Failed to fetch mood-food entries" });
    }
  });
  app2.post("/api/mood-learning/recommendations", async (req, res) => {
    try {
      const { userId, currentMeals, currentMood } = req.body;
      if (!userId || !currentMeals) {
        return res.status(400).json({ message: "userId and currentMeals are required" });
      }
      const userEntries = await storage.getMoodFoodEntries(userId, 90);
      const result = runMoodLearningEngine(userEntries, currentMeals, currentMood);
      res.json({
        personalizedRecommendations: result.recommendations,
        learnedPatterns: result.patterns,
        insights: result.insights,
        confidence: result.recommendations.length > 0 ? result.recommendations[0].confidence : 0.7
      });
    } catch (error) {
      console.error("Error generating personalized recommendations:", error);
      res.status(500).json({ message: "Failed to generate personalized recommendations" });
    }
  });
  app2.get("/api/mood-learning/insights/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const userEntries = await storage.getMoodFoodEntries(userId, 60);
      if (userEntries.length < 3) {
        return res.json({
          message: "Not enough data yet. Keep tracking your meals and mood!",
          dataPoints: userEntries.length,
          needMore: 3 - userEntries.length
        });
      }
      const result = runMoodLearningEngine(userEntries, [], "neutral");
      res.json({
        insights: result.insights,
        patterns: result.patterns,
        dataPoints: userEntries.length,
        topFoodCategories: Object.keys(result.patterns).slice(0, 5)
      });
    } catch (error) {
      console.error("Error fetching learning insights:", error);
      res.status(500).json({ message: "Failed to fetch learning insights" });
    }
  });
  app2.post("/api/ai-fitness/comprehensive-plan", async (req, res) => {
    try {
      const { userId, currentMeals } = req.body;
      if (!userId || !currentMeals) {
        return res.status(400).json({ message: "userId and currentMeals are required" });
      }
      const userEntries = await storage.getMoodFoodEntries(userId, 30);
      const recommendations = await generateComprehensiveWellnessRecommendations(
        currentMeals,
        userEntries
      );
      res.json({
        success: true,
        ...recommendations,
        message: "AI-powered wellness recommendations generated successfully"
      });
    } catch (error) {
      console.error("Error generating AI fitness recommendations:", error);
      res.status(500).json({ message: "Failed to generate AI fitness recommendations" });
    }
  });
  app2.post("/api/ai-fitness/workout-plan", async (req, res) => {
    try {
      const { userId, goal, fitnessLevel, preferences, schedule } = req.body;
      const userEntries = await storage.getMoodFoodEntries(userId || "demo-user", 30);
      const mealCategories = userEntries.flatMap((entry) => entry.meals);
      const { generateAIWorkoutPlan: generateAIWorkoutPlan2 } = await Promise.resolve().then(() => (init_ai_fitness_engine(), ai_fitness_engine_exports));
      const workoutPlan = await generateAIWorkoutPlan2(mealCategories, userEntries, {
        goal,
        fitness_level: fitnessLevel,
        preferences,
        schedule
      });
      if (!workoutPlan) {
        return res.status(503).json({
          message: "AI workout service temporarily unavailable. Please try again later."
        });
      }
      res.json(workoutPlan);
    } catch (error) {
      console.error("Error generating AI workout plan:", error);
      res.status(500).json({ message: "Failed to generate workout plan" });
    }
  });
  app2.post("/api/ai-fitness/nutrition-advice", async (req, res) => {
    try {
      const { userId, goal, dietaryRestrictions, currentWeight, targetWeight } = req.body;
      const userEntries = await storage.getMoodFoodEntries(userId || "demo-user", 30);
      const mealCategories = userEntries.flatMap((entry) => entry.meals);
      const { generateAINutritionAdvice: generateAINutritionAdvice2 } = await Promise.resolve().then(() => (init_ai_fitness_engine(), ai_fitness_engine_exports));
      const nutritionAdvice = await generateAINutritionAdvice2(mealCategories, userEntries, {
        goal,
        dietary_restrictions: dietaryRestrictions,
        current_weight: currentWeight,
        target_weight: targetWeight
      });
      if (!nutritionAdvice) {
        return res.status(503).json({
          message: "AI nutrition service temporarily unavailable. Please try again later."
        });
      }
      res.json(nutritionAdvice);
    } catch (error) {
      console.error("Error generating AI nutrition advice:", error);
      res.status(500).json({ message: "Failed to generate nutrition advice" });
    }
  });
  app2.post("/api/ai-fitness/exercise-details", async (req, res) => {
    try {
      const { exerciseName } = req.body;
      if (!exerciseName) {
        return res.status(400).json({ message: "exerciseName is required" });
      }
      const exerciseDetails = await getExerciseDetails(exerciseName);
      if (!exerciseDetails) {
        return res.status(503).json({
          message: "Exercise details service temporarily unavailable. Please try again later."
        });
      }
      res.json(exerciseDetails);
    } catch (error) {
      console.error("Error fetching exercise details:", error);
      res.status(500).json({ message: "Failed to fetch exercise details" });
    }
  });
  app2.post("/api/ai-fitness/enhanced-workout-plan", async (req, res) => {
    try {
      const { userId, goal, fitnessLevel, preferences, schedule } = req.body;
      const userEntries = await storage.getMoodFoodEntries(userId || "demo-user", 30);
      const mealCategories = userEntries.flatMap((entry) => entry.meals);
      const result = await generateEnhancedWorkoutPlan(mealCategories, userEntries, {
        goal,
        fitness_level: fitnessLevel,
        preferences,
        schedule
      });
      if (!result.workoutPlan) {
        return res.status(503).json({
          message: "AI workout service temporarily unavailable. Please try again later."
        });
      }
      res.json({
        workoutPlan: result.workoutPlan,
        exerciseDetails: result.exerciseDetails,
        message: "Enhanced workout plan with exercise details generated successfully"
      });
    } catch (error) {
      console.error("Error generating enhanced workout plan:", error);
      res.status(500).json({ message: "Failed to generate enhanced workout plan" });
    }
  });
  app2.post("/api/ai-fitness/custom-workout-plan", async (req, res) => {
    try {
      const {
        goal,
        fitnessLevel,
        preferences,
        healthConditions,
        schedule,
        planDurationWeeks
      } = req.body;
      const workoutPlan = await generateCustomWorkoutPlan({
        goal: goal || "Improve overall fitness",
        fitness_level: fitnessLevel || "Intermediate",
        preferences: preferences || [],
        health_conditions: healthConditions || [],
        schedule: schedule || { days_per_week: 4, session_duration: 45 },
        plan_duration_weeks: planDurationWeeks || 6,
        lang: "en"
      });
      if (!workoutPlan) {
        return res.status(503).json({
          message: "Custom workout service temporarily unavailable. Please try again later."
        });
      }
      res.json({
        workoutPlan,
        message: "Custom workout plan generated successfully"
      });
    } catch (error) {
      console.error("Error generating custom workout plan:", error);
      res.status(500).json({ message: "Failed to generate custom workout plan" });
    }
  });
  app2.post("/api/ai-fitness/advanced-wellness-plan", async (req, res) => {
    try {
      const {
        userId,
        userPreferences: userPreferences2 = {}
      } = req.body;
      const userEntries = await storage.getMoodFoodEntries(userId || "demo-user", 30);
      const mealCategories = userEntries.flatMap((entry) => entry.meals);
      const result = await generateAdvancedWellnessRecommendations(
        mealCategories,
        userEntries,
        userPreferences2
      );
      if (!result.customWorkoutPlan && !result.nutritionAdvice) {
        return res.status(503).json({
          message: "AI wellness services temporarily unavailable. Please try again later."
        });
      }
      res.json({
        ...result,
        message: "Advanced wellness plan with custom workout generated successfully"
      });
    } catch (error) {
      console.error("Error generating advanced wellness plan:", error);
      res.status(500).json({ message: "Failed to generate advanced wellness plan" });
    }
  });
  app2.post("/api/ai-fitness/analyze-food-plate", async (req, res) => {
    try {
      const { imageUrl } = req.body;
      if (!imageUrl) {
        return res.status(400).json({ message: "imageUrl is required" });
      }
      const analysis = await analyzeFoodPlate(imageUrl);
      if (!analysis) {
        return res.status(503).json({
          message: "Food analysis service temporarily unavailable. Please try again later."
        });
      }
      res.json({
        analysis,
        message: "Food plate analyzed successfully"
      });
    } catch (error) {
      console.error("Error analyzing food plate:", error);
      res.status(500).json({ message: "Failed to analyze food plate" });
    }
  });
  app2.post("/api/ai-fitness/visual-meal-analysis", async (req, res) => {
    try {
      const { imageUrl, userId } = req.body;
      if (!imageUrl) {
        return res.status(400).json({ message: "imageUrl is required" });
      }
      const result = await analyzeVisualMeal(imageUrl, userId || "demo-user");
      if (!result.analysis) {
        return res.status(503).json({
          message: "Visual meal analysis service temporarily unavailable. Please try again later."
        });
      }
      res.json({
        ...result,
        message: "Visual meal analysis completed successfully"
      });
    } catch (error) {
      console.error("Error in visual meal analysis:", error);
      res.status(500).json({ message: "Failed to analyze meal visually" });
    }
  });
  app2.get("/api/wellness/daily-affirmation", async (req, res) => {
    try {
      const affirmation = await getDailyAffirmation();
      if (!affirmation) {
        return res.status(503).json({
          message: "Affirmation service temporarily unavailable",
          fallback: "You are capable of achieving your wellness goals today!"
        });
      }
      res.json({
        affirmation,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        message: "Daily affirmation retrieved successfully"
      });
    } catch (error) {
      console.error("Error fetching daily affirmation:", error);
      res.status(500).json({
        message: "Failed to fetch daily affirmation",
        fallback: "Believe in yourself and your journey to better health!"
      });
    }
  });
  app2.get("/api/wellness/motivation", async (req, res) => {
    try {
      const motivation = await getWellnessMotivation();
      res.json({
        ...motivation,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        message: "Wellness motivation retrieved successfully"
      });
    } catch (error) {
      console.error("Error fetching wellness motivation:", error);
      res.status(500).json({ message: "Failed to fetch wellness motivation" });
    }
  });
  app2.get("/api/wellness/tips", async (req, res) => {
    try {
      const wellnessTips = await getWellnessTips();
      if (!wellnessTips) {
        return res.status(503).json({
          message: "Wellness tips service temporarily unavailable",
          fallback: {
            tips: [
              "Take 5 deep breaths when you feel stressed",
              "Drink water regularly throughout the day",
              "Take short breaks every hour to move your body"
            ]
          }
        });
      }
      res.json({
        ...wellnessTips,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        message: "Wellness tips retrieved successfully"
      });
    } catch (error) {
      console.error("Error fetching wellness tips:", error);
      res.status(500).json({
        message: "Failed to fetch wellness tips",
        fallback: {
          tips: ["Focus on progress, not perfection in your wellness journey"]
        }
      });
    }
  });
  app2.get("/api/wellness/quote", async (req, res) => {
    try {
      const quote = await getDailyQuote();
      if (!quote) {
        return res.status(503).json({
          message: "Quote service temporarily unavailable",
          fallback: {
            quote: "The journey of a thousand miles begins with one step."
          }
        });
      }
      res.json({
        quote,
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        message: "Daily quote retrieved successfully"
      });
    } catch (error) {
      console.error("Error fetching daily quote:", error);
      res.status(500).json({
        message: "Failed to fetch daily quote",
        fallback: {
          quote: "Every day is a new opportunity to grow stronger."
        }
      });
    }
  });
  app2.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    if (email === "admin@budgetbites.com" && password === "totalwellness2025") {
      res.json({
        success: true,
        redirect: "/home",
        message: "Login successful"
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }
  });
  app2.post("/api/admin/login", (req, res) => {
    const { username, password } = req.body;
    if (username === "admin" && password === "totalwellness2025") {
      const token = "admin_authenticated_" + Date.now();
      res.json({
        success: true,
        token,
        message: "Admin login successful"
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid admin credentials"
      });
    }
  });
  app2.get("/api/admin/stats", (req, res) => {
    res.json({
      totalUsers: 156,
      activeSubscriptions: 89,
      monthlyRevenue: 890.11,
      totalMealPlans: 1247,
      conversionRate: 57.1,
      averageOrderValue: 9.99
    });
  });
  app2.post("/api/mobilenet-recipes", async (req, res) => {
    try {
      const { predictions, budget, detectedIngredients } = req.body;
      console.log("MobileNet recipe request:", { predictions, budget });
      const smartRecipes = [
        {
          id: 1,
          name: `Gourmet ${predictions[0]?.className || "Mixed"} Delight`,
          cost: Math.min(budget * 0.8, 12),
          ingredients: predictions.map((p) => p.className).slice(0, 5),
          cookTime: 15,
          difficulty: "Easy",
          confidence: predictions[0]?.probability || 0.8,
          description: "AI-optimized recipe using detected ingredients with perfect flavor balance"
        },
        {
          id: 2,
          name: "Quick Budget Bowl",
          cost: Math.min(budget * 0.6, 8),
          ingredients: [...predictions.map((p) => p.className).slice(0, 3), "seasoning", "oil"],
          cookTime: 10,
          difficulty: "Beginner",
          confidence: Math.max(...predictions.map((p) => p.probability)),
          description: "Simple, nutritious meal maximizing detected ingredients"
        }
      ];
      const affordableRecipes = smartRecipes.filter((recipe) => recipe.cost <= budget);
      res.json({
        success: true,
        recipes: affordableRecipes,
        totalPredictions: predictions.length,
        averageConfidence: predictions.reduce((sum, p) => sum + p.probability, 0) / predictions.length,
        estimatedValue: predictions.reduce((sum, p) => sum + p.estimatedPrice, 0)
      });
    } catch (error) {
      console.error("MobileNet recipe generation error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to generate MobileNet recipe suggestions"
      });
    }
  });
  app2.post("/api/ar-recipe-suggestions", async (req, res) => {
    try {
      const { ingredients, budget, detectedItems } = req.body;
      const recipes = [
        {
          id: 1,
          name: "Quick Fruit Salad",
          cost: 3.25,
          ingredients: ingredients.split(","),
          cookTime: 5,
          difficulty: "Easy",
          instructions: "Combine detected fruits, add honey if available"
        },
        {
          id: 2,
          name: "Simple Smoothie",
          cost: 2.75,
          ingredients: [...ingredients.split(","), "milk", "honey"],
          cookTime: 3,
          difficulty: "Easy",
          instructions: "Blend detected fruits with milk"
        }
      ];
      const affordableRecipes = recipes.filter((recipe) => recipe.cost <= budget);
      res.json({
        success: true,
        recipes: affordableRecipes,
        totalDetectedItems: detectedItems?.length || 0,
        estimatedSavings: budget - Math.min(...affordableRecipes.map((r) => r.cost))
      });
    } catch (error) {
      console.error("AR recipe suggestion error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to generate AR recipe suggestions"
      });
    }
  });
  app2.get("/api/admin/recent-meal-plans", (req, res) => {
    res.json([
      { id: "1", user: "User #142", budget: 50, people: 2, days: 7, created: "2025-01-06" },
      { id: "2", user: "User #138", budget: 35, people: 1, days: 5, created: "2025-01-06" },
      { id: "3", user: "User #145", budget: 75, people: 4, days: 7, created: "2025-01-05" },
      { id: "4", user: "User #131", budget: 40, people: 2, days: 3, created: "2025-01-05" },
      { id: "5", user: "User #149", budget: 60, people: 3, days: 5, created: "2025-01-05" }
    ]);
  });
  app2.post("/api/meal-plans/generate", async (req, res) => {
    try {
      const validated = mealPlanRequestSchema.parse(req.body);
      const { meals, totalCost, groceryList, mealPrepInstructions, savings } = await generateMealPlan(
        validated.budget,
        validated.people,
        validated.days,
        validated.store,
        validated.allergies,
        validated.dislikes,
        validated.dietType,
        validated.calorieGoal,
        validated.activityLevel,
        validated.maxCookingTime,
        validated.skillLevel
      );
      const mealPlan = await storage.createMealPlan({
        userId: null,
        // For now, no auth required
        budget: validated.budget,
        people: validated.people,
        days: validated.days,
        store: validated.store,
        totalCost,
        meals,
        groceryList
      });
      res.json({
        id: mealPlan.id,
        meals,
        totalCost,
        groceryList,
        mealPrepInstructions,
        // SMART WORKFLOW FEATURE!
        savings,
        budget: validated.budget,
        people: validated.people,
        days: validated.days
      });
    } catch (error) {
      console.error("Error generating meal plan:", error);
      res.status(400).json({
        message: error instanceof Error ? error.message : "Failed to generate meal plan"
      });
    }
  });
  app2.get("/api/meal-plans/:id", async (req, res) => {
    try {
      const mealPlan = await storage.getMealPlan(req.params.id);
      if (!mealPlan) {
        return res.status(404).json({ message: "Meal plan not found" });
      }
      res.json(mealPlan);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch meal plan" });
    }
  });
  app2.post("/api/meal-plans/:id/favorite", async (req, res) => {
    try {
      const updated = await storage.updateMealPlan(req.params.id, { isFavorite: true });
      if (!updated) {
        return res.status(404).json({ message: "Meal plan not found" });
      }
      res.json({ message: "Meal plan saved to favorites" });
    } catch (error) {
      res.status(500).json({ message: "Failed to save meal plan" });
    }
  });
  app2.delete("/api/meal-plans/:id/favorite", async (req, res) => {
    try {
      const updated = await storage.updateMealPlan(req.params.id, { isFavorite: false });
      if (!updated) {
        return res.status(404).json({ message: "Meal plan not found" });
      }
      res.json({ message: "Meal plan removed from favorites" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove from favorites" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/index.ts
import path2 from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import express from "express";
import { createServer as createViteServer } from "vite";
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = path2.dirname(__filename2);
var log = (message, source = "server") => {
  const t = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", second: "2-digit", hour12: true });
  console.log(`${t} [${source}] ${message}`);
};
async function setupVite(app2, _server) {
  const vite = await createViteServer({
    root: path2.resolve(__dirname2, "..", "client"),
    server: { middlewareMode: true }
  });
  app2.use(vite.middlewares);
  app2.get("/login.html", (_req, res) => {
    res.sendFile(path2.join(__dirname2, "..", "client", "public", "login.html"));
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(__dirname2, "..", "dist", "public");
  const publicPath = path2.resolve(__dirname2, "..", "client", "public");
  app2.use(express.static(distPath));
  if (process.env.NODE_ENV !== "production") {
    app2.use(express.static(publicPath));
  }
  app2.get("/login.html", (_req, res) => {
    res.sendFile(path2.join(distPath, "login.html"), (err) => {
      if (err) res.sendFile(path2.join(publicPath, "login.html"));
    });
  });
  app2.get("*", (_req, res) => {
    res.sendFile(path2.join(distPath, "index.html"));
  });
}

// server/main.ts
var app = express2();
var PORT = process.env.PORT || 5e3;
app.use(session({
  secret: process.env.SESSION_SECRET || "your-secret-key-change-in-production",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1e3
    // 24 hours
  }
}));
app.use(express2.json());
app.use(express2.urlencoded({ extended: true }));
async function startServer() {
  try {
    if (process.env.NODE_ENV === "development") {
      await setupVite(app, null);
      log("Vite development server setup complete");
    } else {
      serveStatic(app);
      log("Static file serving setup complete");
    }
    const server = await registerRoutes(app);
    server.listen(PORT, () => {
      log(`Server running on port ${PORT}`);
      log(`Login page available at: http://localhost:${PORT}/login.html`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}
startServer();
