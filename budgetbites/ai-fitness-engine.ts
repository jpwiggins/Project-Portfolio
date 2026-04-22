// AI Fitness & Nutrition Engine
// Integrates with RapidAPI AI Workout Planner for professional fitness recommendations

import type { MoodFoodEntry } from "@shared/schema";

export interface WorkoutPlanRequest {
  goal: 'Build muscle' | 'Lose weight' | 'Improve endurance' | 'General fitness' | 'Strength training';
  fitness_level: 'Beginner' | 'Intermediate' | 'Advanced';
  preferences: string[];
  health_conditions: string[];
  schedule: {
    days_per_week: number;
    session_duration: number;
  };
  plan_duration_weeks: number;
  lang: string;
}

export interface NutritionAdviceRequest {
  goal: 'Lose weight' | 'Build muscle' | 'Maintain weight' | 'Improve health';
  dietary_restrictions: string[];
  current_weight?: number;
  target_weight?: number;
  daily_activity_level: 'Sedentary' | 'Light' | 'Moderate' | 'Active' | 'Very Active';
  lang: string;
}

export interface WorkoutPlan {
  plan_id: string;
  goal: string;
  duration_weeks: number;
  weekly_schedule: Array<{
    day: string;
    exercises: Array<{
      name: string;
      sets: number;
      reps: string;
      rest_seconds: number;
      instructions: string;
    }>;
  }>;
  tips: string[];
  estimated_calories_burned: number;
}

export interface NutritionAdvice {
  advice_id: string;
  daily_calories: number;
  macronutrient_breakdown: {
    protein_percentage: number;
    carbs_percentage: number;
    fats_percentage: number;
  };
  meal_suggestions: Array<{
    meal_type: string;
    foods: string[];
    calories: number;
  }>;
  hydration_advice: string;
  supplement_recommendations: string[];
  tips: string[];
}

export interface ExerciseDetails {
  exercise_name: string;
  muscle_groups: string[];
  equipment_needed: string[];
  difficulty_level: string;
  instructions: {
    setup: string;
    execution: string[];
    tips: string[];
  };
  variations: Array<{
    name: string;
    description: string;
  }>;
  safety_precautions: string[];
  calories_burned_per_minute: number;
}

export interface FoodPlateAnalysis {
  foods_detected: Array<{
    food_name: string;
    confidence: number;
    estimated_quantity: string;
    calories_per_serving: number;
    macronutrients: {
      protein: number;
      carbs: number;
      fats: number;
    };
    health_rating: number;
  }>;
  total_calories: number;
  total_macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  health_analysis: {
    overall_score: number;
    recommendations: string[];
    missing_nutrients: string[];
  };
  meal_category: string;
}

// Map meal categories to fitness goals
export function determineFitnessGoal(mealCategories: string[], userGoal?: string): string {
  if (userGoal) return userGoal;
  
  const categoryCount = mealCategories.reduce((acc, category) => {
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Determine goal based on dominant meal patterns
  if (categoryCount['protein'] > 2) return 'Build muscle';
  if (categoryCount['fiber'] > 2) return 'Lose weight';
  if (categoryCount['carbs'] > 2) return 'Improve endurance';
  
  return 'General fitness';
}

// Map activity levels from mood entries
export function determineActivityLevel(moodEntries: MoodFoodEntry[]): string {
  const recentWorkouts = moodEntries
    .filter(entry => entry.workoutDone && entry.workoutDone !== 'none')
    .slice(0, 7); // Last 7 entries
  
  if (recentWorkouts.length >= 5) return 'Very Active';
  if (recentWorkouts.length >= 3) return 'Active';
  if (recentWorkouts.length >= 1) return 'Moderate';
  
  return 'Light';
}

// Determine fitness level from workout history
export function determineFitnessLevel(moodEntries: MoodFoodEntry[]): string {
  const workoutTypes = moodEntries
    .filter(entry => entry.workoutDone && entry.workoutDone !== 'none')
    .map(entry => entry.workoutDone)
    .slice(0, 10);
  
  const strengthWorkouts = workoutTypes.filter(workout => 
    workout?.includes('strength') || workout?.includes('weight')
  ).length;
  
  const advancedWorkouts = workoutTypes.filter(workout =>
    workout?.includes('crossfit') || workout?.includes('hiit') || workout?.includes('advanced')
  ).length;
  
  if (advancedWorkouts > 3 || strengthWorkouts > 5) return 'Advanced';
  if (workoutTypes.length > 5 || strengthWorkouts > 2) return 'Intermediate';
  
  return 'Beginner';
}

// Generate workout plan using AI API
export async function generateAIWorkoutPlan(
  mealCategories: string[],
  moodEntries: MoodFoodEntry[],
  userPreferences?: Partial<WorkoutPlanRequest>
): Promise<WorkoutPlan | null> {
  if (!process.env.RAPIDAPI_KEY) {
    console.warn('RAPIDAPI_KEY not available, skipping AI workout generation');
    return null;
  }

  try {
    const goal = determineFitnessGoal(mealCategories, userPreferences?.goal);
    const fitnessLevel = determineFitnessLevel(moodEntries);
    
    const requestBody: WorkoutPlanRequest = {
      goal: goal as WorkoutPlanRequest['goal'],
      fitness_level: fitnessLevel as WorkoutPlanRequest['fitness_level'],
      preferences: userPreferences?.preferences || ['Weight training', 'Cardio'],
      health_conditions: userPreferences?.health_conditions || ['None'],
      schedule: {
        days_per_week: userPreferences?.schedule?.days_per_week || 4,
        session_duration: userPreferences?.schedule?.session_duration || 60
      },
      plan_duration_weeks: userPreferences?.plan_duration_weeks || 4,
      lang: 'en'
    };

    const response = await fetch(
      'https://ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com/generateWorkoutPlan?noqueue=1',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-host': 'ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com',
          'x-rapidapi-key': process.env.RAPIDAPI_KEY
        },
        body: JSON.stringify(requestBody)
      }
    );

    if (!response.ok) {
      console.error('AI Workout API error:', response.status, response.statusText);
      return null;
    }

    const workoutPlan = await response.json() as WorkoutPlan;
    return workoutPlan;

  } catch (error) {
    console.error('Error generating AI workout plan:', error);
    return null;
  }
}

// Generate nutrition advice using AI API
export async function generateAINutritionAdvice(
  mealCategories: string[],
  moodEntries: MoodFoodEntry[],
  userPreferences?: Partial<NutritionAdviceRequest>
): Promise<NutritionAdvice | null> {
  if (!process.env.RAPIDAPI_KEY) {
    console.warn('RAPIDAPI_KEY not available, skipping AI nutrition generation');
    return null;
  }

  try {
    const goal = determineFitnessGoal(mealCategories, userPreferences?.goal);
    const activityLevel = determineActivityLevel(moodEntries);
    
    // Determine dietary restrictions from meal patterns
    const dietaryRestrictions: string[] = [];
    if (mealCategories.includes('fiber') && !mealCategories.includes('protein')) {
      dietaryRestrictions.push('Vegetarian');
    }
    
    const requestBody: NutritionAdviceRequest = {
      goal: goal as NutritionAdviceRequest['goal'],
      dietary_restrictions: userPreferences?.dietary_restrictions || dietaryRestrictions,
      current_weight: userPreferences?.current_weight,
      target_weight: userPreferences?.target_weight,
      daily_activity_level: activityLevel as NutritionAdviceRequest['daily_activity_level'],
      lang: 'en'
    };

    const response = await fetch(
      'https://ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com/nutritionAdvice?noqueue=1',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-host': 'ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com',
          'x-rapidapi-key': process.env.RAPIDAPI_KEY
        },
        body: JSON.stringify(requestBody)
      }
    );

    if (!response.ok) {
      console.error('AI Nutrition API error:', response.status, response.statusText);
      return null;
    }

    const nutritionAdvice = await response.json() as NutritionAdvice;
    return nutritionAdvice;

  } catch (error) {
    console.error('Error generating AI nutrition advice:', error);
    return null;
  }
}

// Create comprehensive wellness recommendations combining our learning engine with AI APIs
export async function generateComprehensiveWellnessRecommendations(
  mealCategories: string[],
  moodEntries: MoodFoodEntry[]
): Promise<{
  aiWorkoutPlan: WorkoutPlan | null;
  aiNutritionAdvice: NutritionAdvice | null;
  personalizedInsights: string[];
}> {
  const [aiWorkoutPlan, aiNutritionAdvice] = await Promise.all([
    generateAIWorkoutPlan(mealCategories, moodEntries),
    generateAINutritionAdvice(mealCategories, moodEntries)
  ]);

  const personalizedInsights: string[] = [];
  
  // Generate insights based on API responses and learning data
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
  
  // Add meal-specific insights
  const dominantCategory = mealCategories[0];
  if (dominantCategory === 'protein' && aiWorkoutPlan) {
    personalizedInsights.push(
      'Your high-protein meals are perfect for strength training - timing is key!'
    );
  }
  
  return {
    aiWorkoutPlan,
    aiNutritionAdvice,
    personalizedInsights
  };
}

// Get detailed exercise information
export async function getExerciseDetails(exerciseName: string): Promise<ExerciseDetails | null> {
  if (!process.env.RAPIDAPI_KEY) {
    console.warn('RAPIDAPI_KEY not available, skipping exercise details');
    return null;
  }

  try {
    const response = await fetch(
      'https://ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com/exerciseDetails?noqueue=1',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-host': 'ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com',
          'x-rapidapi-key': process.env.RAPIDAPI_KEY
        },
        body: JSON.stringify({
          exercise_name: exerciseName,
          lang: 'en'
        })
      }
    );

    if (!response.ok) {
      console.error('Exercise Details API error:', response.status, response.statusText);
      return null;
    }

    const exerciseDetails = await response.json() as ExerciseDetails;
    return exerciseDetails;

  } catch (error) {
    console.error('Error fetching exercise details:', error);
    return null;
  }
}

// Enhanced workout plan with detailed exercise information
export async function generateEnhancedWorkoutPlan(
  mealCategories: string[],
  moodEntries: MoodFoodEntry[],
  userPreferences?: Partial<WorkoutPlanRequest>
): Promise<{
  workoutPlan: WorkoutPlan | null;
  exerciseDetails: Record<string, ExerciseDetails>;
}> {
  const workoutPlan = await generateAIWorkoutPlan(mealCategories, moodEntries, userPreferences);
  const exerciseDetails: Record<string, ExerciseDetails> = {};

  if (workoutPlan) {
    // Get detailed information for key exercises
    const allExercises = workoutPlan.weekly_schedule.flatMap(day => day.exercises);
    const keyExercises = allExercises.slice(0, 5); // Get details for first 5 exercises

    for (const exercise of keyExercises) {
      const details = await getExerciseDetails(exercise.name);
      if (details) {
        exerciseDetails[exercise.name] = details;
      }
    }
  }

  return { workoutPlan, exerciseDetails };
}

// Generate custom workout plan based on detailed user preferences
export async function generateCustomWorkoutPlan(
  workoutRequest: WorkoutPlanRequest
): Promise<WorkoutPlan | null> {
  if (!process.env.RAPIDAPI_KEY) {
    console.warn('RAPIDAPI_KEY not available, skipping custom workout plan');
    return null;
  }

  try {
    const response = await fetch(
      'https://ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com/customWorkoutPlan?noqueue=1',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-rapidapi-host': 'ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com',
          'x-rapidapi-key': process.env.RAPIDAPI_KEY
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
          lang: workoutRequest.lang || 'en'
        })
      }
    );

    if (!response.ok) {
      console.error('Custom Workout Plan API error:', response.status, response.statusText);
      return null;
    }

    const workoutPlan = await response.json() as WorkoutPlan;
    return workoutPlan;

  } catch (error) {
    console.error('Error generating custom workout plan:', error);
    return null;
  }
}

// Enhanced comprehensive plan with custom workout generation
export async function generateAdvancedWellnessRecommendations(
  mealCategories: string[],
  moodEntries: MoodFoodEntry[],
  userPreferences: {
    goal?: string;
    fitnessLevel?: string;
    preferences?: string[];
    healthConditions?: string[];
    customGoals?: string[];
    schedule?: { days_per_week: number; session_duration: number };
  } = {}
) {
  // Determine optimal workout goals based on meal patterns
  const proteinMeals = mealCategories.filter(cat => cat.includes('protein')).length;
  const fiberMeals = mealCategories.filter(cat => cat.includes('fiber')).length;
  const omegaMeals = mealCategories.filter(cat => cat.includes('omega')).length;

  let suggestedGoal = userPreferences.goal || 'Improve overall fitness';
  let suggestedCustomGoals = userPreferences.customGoals || [];

  // Smart goal detection based on nutrition patterns
  if (proteinMeals > 3) {
    suggestedGoal = 'Build muscle';
    suggestedCustomGoals = ['Increase strength', 'Build lean muscle mass'];
  } else if (fiberMeals > 3) {
    suggestedGoal = 'Lose weight';
    suggestedCustomGoals = ['Burn fat', 'Improve cardiovascular health'];
  } else if (omegaMeals > 2) {
    suggestedGoal = 'Improve overall fitness';
    suggestedCustomGoals = ['Reduce inflammation', 'Improve joint health'];
  }

  // Determine fitness level from mood/energy patterns
  const recentEntries = moodEntries.slice(-7); // Last week
  const avgEnergy = recentEntries.reduce((sum, entry) => sum + (entry.energyLevel || 3), 0) / recentEntries.length;
  const suggestedLevel = avgEnergy > 4 ? 'Intermediate' : avgEnergy > 2.5 ? 'Beginner' : 'Beginner';

  // Generate custom workout plan
  const customWorkoutPlan = await generateCustomWorkoutPlan({
    goal: suggestedGoal as any,
    fitness_level: userPreferences.fitnessLevel || suggestedLevel as any,
    preferences: userPreferences.preferences || ['Full body', 'Strength training'],
    health_conditions: userPreferences.healthConditions || [],
    schedule: userPreferences.schedule || { days_per_week: 4, session_duration: 45 },
    plan_duration_weeks: 6,

    lang: 'en'
  });

  // Get nutrition advice and exercise details
  const [nutritionAdvice, enhancedPlan] = await Promise.all([
    generateAINutritionAdvice(mealCategories, moodEntries),
    customWorkoutPlan ? generateEnhancedWorkoutPlan(mealCategories, moodEntries) : null
  ]);

  const personalizedInsights: string[] = [];
  
  if (customWorkoutPlan) {
    personalizedInsights.push(
      `Custom ${customWorkoutPlan.duration_weeks}-week plan created based on your ${proteinMeals > 3 ? 'high-protein' : fiberMeals > 3 ? 'high-fiber' : 'balanced'} meal pattern`
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
        primaryNutrientFocus: proteinMeals > 3 ? 'protein' : fiberMeals > 3 ? 'fiber' : 'balanced'
      }
    }
  };
}

// Analyze food plate from image URL
export async function analyzeFoodPlate(imageUrl: string): Promise<FoodPlateAnalysis | null> {
  if (!process.env.RAPIDAPI_KEY) {
    console.warn('RAPIDAPI_KEY not available, skipping food plate analysis');
    return null;
  }

  try {
    const response = await fetch(
      `https://ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com/analyzeFoodPlate?imageUrl=${encodeURIComponent(imageUrl)}&lang=en&noqueue=1`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'x-rapidapi-host': 'ai-workout-planner-exercise-fitness-nutrition-guide.p.rapidapi.com',
          'x-rapidapi-key': process.env.RAPIDAPI_KEY
        }
      }
    );

    if (!response.ok) {
      console.error('Food Plate Analysis API error:', response.status, response.statusText);
      return null;
    }

    const analysis = await response.json() as FoodPlateAnalysis;
    return analysis;

  } catch (error) {
    console.error('Error analyzing food plate:', error);
    return null;
  }
}

// Enhanced meal analysis with visual recognition
export async function analyzeVisualMeal(
  imageUrl: string,
  userId: string
): Promise<{
  analysis: FoodPlateAnalysis | null;
  recommendations: string[];
  fitnessInsights: string[];
}> {
  const analysis = await analyzeFoodPlate(imageUrl);
  const recommendations: string[] = [];
  const fitnessInsights: string[] = [];

  if (!analysis) {
    return { analysis: null, recommendations: [], fitnessInsights: [] };
  }

  // Generate personalized recommendations based on analysis
  const { total_macros, health_analysis, foods_detected } = analysis;

  // Protein analysis
  if (total_macros.protein > 25) {
    recommendations.push('Excellent protein content - perfect for muscle building and recovery');
    fitnessInsights.push('High-protein meal detected - ideal timing is post-workout for muscle synthesis');
  } else if (total_macros.protein < 15) {
    recommendations.push('Consider adding lean protein sources like chicken, fish, or legumes');
    fitnessInsights.push('Low protein - may not support optimal muscle recovery after strength training');
  }

  // Carb analysis  
  if (total_macros.carbs > 45) {
    recommendations.push('High carb content - great for energy and endurance activities');
    fitnessInsights.push('Carb-rich meal - perfect pre-workout fuel for high-intensity training');
  } else if (total_macros.carbs < 20) {
    recommendations.push('Low carb meal - good for fat burning and weight management');
    fitnessInsights.push('Low-carb profile - aligns well with fat-burning workout goals');
  }

  // Health score insights
  if (health_analysis.overall_score > 8) {
    recommendations.push('Outstanding nutritional balance - keep up the healthy choices!');
    fitnessInsights.push('Nutrient-dense meal supports optimal performance and recovery');
  } else if (health_analysis.overall_score < 6) {
    recommendations.push('Consider adding more vegetables and reducing processed foods');
    fitnessInsights.push('Room for improvement - better nutrition will enhance workout results');
  }

  // Food-specific insights
  const proteinFoods = foods_detected.filter(food => 
    food.macronutrients.protein > food.macronutrients.carbs && 
    food.macronutrients.protein > food.macronutrients.fats
  );

  if (proteinFoods.length > 0) {
    fitnessInsights.push(`Detected ${proteinFoods.length} protein-rich foods - excellent for strength training days`);
  }

  // Add health analysis recommendations
  recommendations.push(...health_analysis.recommendations);

  return { analysis, recommendations, fitnessInsights };
}

// Get daily affirmation for motivation
export async function getDailyAffirmation(): Promise<string | null> {
  if (!process.env.RAPIDAPI_KEY) {
    console.warn('RAPIDAPI_KEY not available, skipping affirmation service');
    return null;
  }

  try {
    const response = await fetch('https://positivity-tips.p.rapidapi.com/api/positivity/affirmation', {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'positivity-tips.p.rapidapi.com',
        'x-rapidapi-key': process.env.RAPIDAPI_KEY
      }
    });

    if (!response.ok) {
      console.error('Positivity API error:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    return data.affirmation || data.message || null;

  } catch (error) {
    console.error('Error fetching daily affirmation:', error);
    return null;
  }
}

// Get inspirational quote
export async function getDailyQuote(): Promise<string | null> {
  if (!process.env.RAPIDAPI_KEY) {
    console.warn('RAPIDAPI_KEY not available, skipping quote service');
    return null;
  }

  try {
    const response = await fetch('https://positivity-tips.p.rapidapi.com/api/positivity/quote', {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'positivity-tips.p.rapidapi.com',
        'x-rapidapi-key': process.env.RAPIDAPI_KEY
      }
    });

    if (!response.ok) {
      console.error('Quote API error:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    return data.quote || data.message || null;

  } catch (error) {
    console.error('Error fetching daily quote:', error);
    return null;
  }
}

// Get wellness tips and comprehensive wellness content
export async function getWellnessTips(): Promise<{
  tips: string[];
  wellness_quote?: string;
  mindfulness_tip?: string;
  stress_relief?: string;
} | null> {
  if (!process.env.RAPIDAPI_KEY) {
    console.warn('RAPIDAPI_KEY not available, skipping wellness service');
    return null;
  }

  try {
    const response = await fetch('https://positivity-tips.p.rapidapi.com/api/positivity/wellness', {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'positivity-tips.p.rapidapi.com',
        'x-rapidapi-key': process.env.RAPIDAPI_KEY
      }
    });

    if (!response.ok) {
      console.error('Wellness API error:', response.status, response.statusText);
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
    console.error('Error fetching wellness tips:', error);
    return null;
  }
}

// Get comprehensive wellness motivation combining affirmations and wellness tips
export async function getWellnessMotivation(): Promise<{
  affirmation: string | null;
  motivationalTips: string[];
  dailyFocus: string;
  wellnessTips?: string[];
  mindfulnessTip?: string;
  stressRelief?: string;
  wellnessQuote?: string;
  inspirationalQuote?: string;
}> {
  // Fetch affirmation, wellness content, and quote concurrently
  const [affirmation, wellnessData, dailyQuote] = await Promise.all([
    getDailyAffirmation(),
    getWellnessTips(),
    getDailyQuote()
  ]);
  
  const fallbackMotivationalTips = [
    'Remember: Small consistent steps lead to big transformations',
    'Your body is capable of amazing things when fueled properly',
    'Every healthy choice you make is an investment in your future self',
    'Progress, not perfection, is what matters most',
    'Celebrate every victory, no matter how small'
  ];

  const fallbackDailyFocuses = [
    'Focus on nourishing your body with wholesome foods today',
    'Prioritize movement that brings you joy and energy',
    'Listen to your body and give it what it needs',
    'Practice gratitude for your body\'s strength and resilience',
    'Embrace the journey of becoming your healthiest self'
  ];

  // Use API wellness tips if available, otherwise fallback
  const motivationalTips = wellnessData?.tips?.length 
    ? wellnessData.tips 
    : fallbackMotivationalTips;

  const dailyFocus = wellnessData?.mindfulness_tip 
    || fallbackDailyFocuses[Math.floor(Math.random() * fallbackDailyFocuses.length)];

  return {
    affirmation,
    motivationalTips,
    dailyFocus,
    wellnessTips: wellnessData?.tips,
    mindfulnessTip: wellnessData?.mindfulness_tip,
    stressRelief: wellnessData?.stress_relief,
    wellnessQuote: wellnessData?.wellness_quote,
    inspirationalQuote: dailyQuote ?? undefined
  };
}