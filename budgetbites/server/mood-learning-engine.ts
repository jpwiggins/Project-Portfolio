// Advanced Mood-Food Learning Engine
// Analyzes patterns between meals, moods, and wellness activities to provide personalized recommendations

import type { MoodFoodEntry } from "@shared/schema";

export interface MoodPattern {
  foodCategory: string;
  averageMoodImprovement: number;
  energyBoost: number;
  stressReduction: number;
  effectiveWorkouts: string[];
  effectiveStressRelief: string[];
  confidence: number;
  sampleSize: number;
}

export interface PersonalizedRecommendation {
  type: 'workout' | 'stress-relief' | 'meal-timing' | 'mood-boost';
  title: string;
  description: string;
  confidence: number;
  reason: string;
  timing?: string;
}

// Sample training dataset with diverse food-mood patterns
export const mockTrainingData: MoodFoodEntry[] = [
  {
    id: "entry001",
    userId: "user001",
    date: new Date("2025-08-06"),
    meals: ["grilled salmon", "quinoa bowl", "yogurt parfait"],
    moodBefore: "tired",
    moodAfter: "calm",
    energyLevel: 6,
    stressLevel: 3,
    workoutDone: "yoga",
    stressReliefDone: "guided meditation",
    createdAt: new Date(),
  },
  {
    id: "entry002",
    userId: "user002",
    date: new Date("2025-08-06"),
    meals: ["white pasta", "french fries", "soda"],
    moodBefore: "low",
    moodAfter: "anxious",
    energyLevel: 3,
    stressLevel: 7,
    workoutDone: "none",
    stressReliefDone: "breathwork",
    createdAt: new Date(),
  },
  {
    id: "entry003",
    userId: "user003",
    date: new Date("2025-08-06"),
    meals: ["spinach salad", "almonds", "dark chocolate"],
    moodBefore: "neutral",
    moodAfter: "focused",
    energyLevel: 7,
    stressLevel: 2,
    workoutDone: "strength training",
    stressReliefDone: "stretching",
    createdAt: new Date(),
  },
  {
    id: "entry004",
    userId: "user004",
    date: new Date("2025-08-05"),
    meals: ["oatmeal", "blueberries", "walnuts"],
    moodBefore: "sleepy",
    moodAfter: "alert",
    energyLevel: 8,
    stressLevel: 2,
    workoutDone: "cardio",
    stressReliefDone: "deep breathing",
    createdAt: new Date(),
  },
  {
    id: "entry005",
    userId: "user005",
    date: new Date("2025-08-05"),
    meals: ["avocado toast", "green tea", "banana"],
    moodBefore: "stressed",
    moodAfter: "balanced",
    energyLevel: 6,
    stressLevel: 4,
    workoutDone: "pilates",
    stressReliefDone: "mindfulness",
    createdAt: new Date(),
  },
  {
    id: "entry006",
    userId: "user006",
    date: new Date("2025-08-04"),
    meals: ["chicken breast", "sweet potato", "broccoli"],
    moodBefore: "unmotivated",
    moodAfter: "energized",
    energyLevel: 8,
    stressLevel: 3,
    workoutDone: "strength training",
    stressReliefDone: "progressive muscle relaxation",
    createdAt: new Date(),
  },
  {
    id: "entry007",
    userId: "user007",
    date: new Date("2025-08-04"),
    meals: ["chia pudding", "berries", "coconut"],
    moodBefore: "anxious",
    moodAfter: "peaceful",
    energyLevel: 5,
    stressLevel: 2,
    workoutDone: "yoga",
    stressReliefDone: "meditation",
    createdAt: new Date(),
  },
  {
    id: "entry008",
    userId: "user008",
    date: new Date("2025-08-03"),
    meals: ["eggs", "spinach", "whole grain toast"],
    moodBefore: "foggy",
    moodAfter: "clear-minded",
    energyLevel: 7,
    stressLevel: 3,
    workoutDone: "walking",
    stressReliefDone: "journaling",
    createdAt: new Date(),
  }
];

// Map meals to wellness categories for pattern analysis
export function categorizeMeal(meal: string): string {
  const lowerMeal = meal.toLowerCase();
  
  if (lowerMeal.includes('salmon') || lowerMeal.includes('fish') || lowerMeal.includes('walnuts') || lowerMeal.includes('chia')) {
    return 'omega3';
  }
  if (lowerMeal.includes('chicken') || lowerMeal.includes('eggs') || lowerMeal.includes('tofu') || lowerMeal.includes('yogurt')) {
    return 'protein';
  }
  if (lowerMeal.includes('spinach') || lowerMeal.includes('almonds') || lowerMeal.includes('avocado') || lowerMeal.includes('dark chocolate')) {
    return 'magnesium';
  }
  if (lowerMeal.includes('berries') || lowerMeal.includes('blueberries') || lowerMeal.includes('tea')) {
    return 'antioxidants';
  }
  if (lowerMeal.includes('pasta') || lowerMeal.includes('rice') || lowerMeal.includes('oatmeal') || lowerMeal.includes('toast')) {
    return 'carbs';
  }
  if (lowerMeal.includes('salad') || lowerMeal.includes('broccoli') || lowerMeal.includes('vegetables')) {
    return 'fiber';
  }
  
  return 'general';
}

// Calculate mood improvement score
export function calculateMoodImprovement(before: string, after: string): number {
  const moodScales: Record<string, number> = {
    'terrible': 1, 'low': 2, 'tired': 3, 'stressed': 3, 'anxious': 2, 
    'sleepy': 3, 'foggy': 3, 'unmotivated': 2, 'neutral': 5,
    'calm': 7, 'focused': 8, 'alert': 8, 'balanced': 7, 'energized': 9, 
    'peaceful': 8, 'clear-minded': 8, 'amazing': 10
  };
  
  const beforeScore = moodScales[before.toLowerCase()] || 5;
  const afterScore = moodScales[after.toLowerCase()] || 5;
  
  return afterScore - beforeScore;
}

// Analyze patterns from mood-food data
export function analyzeMoodFoodPatterns(entries: MoodFoodEntry[]): Record<string, MoodPattern> {
  const categoryData: Record<string, {
    moodImprovements: number[];
    energyLevels: number[];
    stressLevels: number[];
    workouts: string[];
    stressReliefs: string[];
  }> = {};
  
  // Collect data by food category
  entries.forEach(entry => {
    const categories = entry.meals.map(meal => categorizeMeal(meal));
    const dominantCategory = categories[0] || 'general'; // Use first category for simplicity
    
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
    if (entry.stressLevel) data.stressLevels.push(10 - entry.stressLevel); // Convert to stress reduction
    if (entry.workoutDone && entry.workoutDone !== 'none') data.workouts.push(entry.workoutDone);
    if (entry.stressReliefDone) data.stressReliefs.push(entry.stressReliefDone);
  });
  
  // Calculate patterns
  const patterns: Record<string, MoodPattern> = {};
  
  Object.entries(categoryData).forEach(([category, data]) => {
    const avgMoodImprovement = data.moodImprovements.length > 0 
      ? data.moodImprovements.reduce((a, b) => a + b, 0) / data.moodImprovements.length 
      : 0;
    
    const avgEnergyBoost = data.energyLevels.length > 0
      ? data.energyLevels.reduce((a, b) => a + b, 0) / data.energyLevels.length
      : 5;
    
    const avgStressReduction = data.stressLevels.length > 0
      ? data.stressLevels.reduce((a, b) => a + b, 0) / data.stressLevels.length
      : 5;
    
    // Get most effective activities
    const workoutFreq = data.workouts.reduce((acc, workout) => {
      acc[workout] = (acc[workout] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const stressReliefFreq = data.stressReliefs.reduce((acc, relief) => {
      acc[relief] = (acc[relief] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const effectiveWorkouts = Object.keys(workoutFreq).sort((a, b) => workoutFreq[b] - workoutFreq[a]);
    const effectiveStressRelief = Object.keys(stressReliefFreq).sort((a, b) => stressReliefFreq[b] - stressReliefFreq[a]);
    
    const sampleSize = data.moodImprovements.length + data.energyLevels.length + data.stressLevels.length;
    const confidence = Math.min(0.95, sampleSize / 10); // Higher confidence with more samples
    
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

// Generate personalized recommendations based on learned patterns
export function generatePersonalizedRecommendations(
  userMeals: string[], 
  currentMood: string, 
  patterns: Record<string, MoodPattern>
): PersonalizedRecommendation[] {
  const recommendations: PersonalizedRecommendation[] = [];
  
  // Analyze user's current meal categories
  const userCategories = userMeals.map(meal => categorizeMeal(meal));
  const dominantCategory = userCategories[0] || 'general';
  
  const pattern = patterns[dominantCategory];
  if (!pattern) return recommendations;
  
  // Workout recommendation based on learned patterns
  if (pattern.effectiveWorkouts.length > 0 && pattern.energyBoost > 6) {
    recommendations.push({
      type: 'workout',
      title: `Try ${pattern.effectiveWorkouts[0]}`,
      description: `Based on ${pattern.sampleSize} similar meal patterns, ${pattern.effectiveWorkouts[0]} works best with ${dominantCategory} meals`,
      confidence: pattern.confidence,
      reason: `Users with ${dominantCategory} meals showed ${Math.round(pattern.energyBoost)}/10 energy levels with this workout`,
      timing: 'within 2-3 hours of eating'
    });
  }
  
  // Stress relief recommendation
  if (pattern.effectiveStressRelief.length > 0 && pattern.stressReduction > 5) {
    recommendations.push({
      type: 'stress-relief',
      title: `${pattern.effectiveStressRelief[0]} session`,
      description: `Your meal profile suggests this stress relief method will be highly effective`,
      confidence: pattern.confidence,
      reason: `${dominantCategory} meals combined with ${pattern.effectiveStressRelief[0]} reduced stress by ${Math.round(pattern.stressReduction)}/10 on average`,
      timing: 'ideal for right now'
    });
  }
  
  // Mood boost recommendation
  if (pattern.averageMoodImprovement > 1 && currentMood.toLowerCase().includes('tired')) {
    recommendations.push({
      type: 'mood-boost',
      title: 'Perfect meal choice for energy',
      description: `Your ${dominantCategory} meals typically boost mood and energy levels significantly`,
      confidence: pattern.confidence,
      reason: `Similar meals improved mood by ${Math.round(pattern.averageMoodImprovement)} points on average`,
    });
  }
  
  return recommendations.sort((a, b) => b.confidence - a.confidence);
}

// Main learning engine function
export function runMoodLearningEngine(
  userEntries: MoodFoodEntry[], 
  currentMeals: string[], 
  currentMood: string = 'neutral'
): {
  patterns: Record<string, MoodPattern>;
  recommendations: PersonalizedRecommendation[];
  insights: string[];
} {
  // Combine user data with training data for better pattern recognition
  const allEntries = [...mockTrainingData, ...userEntries];
  
  // Analyze patterns
  const patterns = analyzeMoodFoodPatterns(allEntries);
  
  // Generate personalized recommendations
  const recommendations = generatePersonalizedRecommendations(currentMeals, currentMood, patterns);
  
  // Generate insights
  const insights: string[] = [];
  const sortedPatterns = Object.values(patterns)
    .filter(p => p.sampleSize > 2)
    .sort((a, b) => b.averageMoodImprovement - a.averageMoodImprovement);
  
  if (sortedPatterns.length > 0) {
    const bestPattern = sortedPatterns[0];
    insights.push(`${bestPattern.foodCategory} meals show the highest mood improvement (+${Math.round(bestPattern.averageMoodImprovement)} points)`);
  }
  
  if (sortedPatterns.length > 1) {
    const energeticPattern = sortedPatterns.find(p => p.energyBoost > 7);
    if (energeticPattern) {
      insights.push(`${energeticPattern.foodCategory} meals provide the best energy boost (${Math.round(energeticPattern.energyBoost)}/10)`);
    }
  }
  
  return { patterns, recommendations, insights };
}