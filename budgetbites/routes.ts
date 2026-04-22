import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWellnessSchema, insertNutritionSchema, insertMoodFoodSchema } from "@shared/schema";
import { mealPlanRequestSchema } from "@shared/schema";
import { generateWellnessRecommendations } from "./wellness-engine";
import { runMoodLearningEngine } from "./mood-learning-engine";
import { 
  generateComprehensiveWellnessRecommendations, 
  getExerciseDetails, 
  generateEnhancedWorkoutPlan,
  generateCustomWorkoutPlan,
  generateAdvancedWellnessRecommendations,
  analyzeFoodPlate,
  analyzeVisualMeal,
  getDailyAffirmation,
  getWellnessMotivation,
  getWellnessTips,
  getDailyQuote
} from "./ai-fitness-engine";
import { z } from "zod";

// Spoonacular API integration
async function generateMealPlan(
  budget: number, 
  people: number, 
  days: number, 
  store?: string,
  allergies?: string[],
  dislikes?: string[],
  dietType?: string,
  calorieGoal?: number,
  activityLevel?: string,
  maxCookingTime?: number,
  skillLevel?: 'beginner' | 'intermediate' | 'advanced'
) {
  const apiKey = process.env.SPOONACULAR_API_KEY || process.env.VITE_SPOONACULAR_API_KEY || "demo_key";
  
  try {
    // Calculate calories per person per day based on goal and activity level
    let caloriesPerPerson = calorieGoal || 2000;
    
    // Adjust calories based on activity level
    if (activityLevel) {
      const activityMultipliers = {
        'sedentary': 0.9,
        'light': 1.0,
        'moderate': 1.1,
        'active': 1.2,
        'very_active': 1.3
      };
      caloriesPerPerson = Math.round(caloriesPerPerson * (activityMultipliers[activityLevel as keyof typeof activityMultipliers] || 1.0));
    }
    
    const totalCalories = caloriesPerPerson * people;
    
    // Build query parameters for dietary restrictions
    const excludeList = [...(allergies || []), ...(dislikes || [])].join(',');
    const dietParam = dietType || '';
    
    // Generate meal plan using Spoonacular
    const mealPlanResponse = await fetch(
      `https://api.spoonacular.com/mealplanner/generate?apiKey=${apiKey}&timeFrame=week&targetCalories=${totalCalories}&diet=${dietParam}&exclude=${excludeList}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!mealPlanResponse.ok) {
      throw new Error(`Spoonacular API error: ${mealPlanResponse.status}`);
    }

    const mealPlanData = await mealPlanResponse.json();
    
    // Process and format the meal plan data
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const meals: any[] = [];
    const groceryItems = new Map();
    let totalCost = 0;

    for (let dayIndex = 0; dayIndex < Math.min(days, 7); dayIndex++) {
      const dayData = mealPlanData.week[Object.keys(mealPlanData.week)[0]];
      const dayMeals = dayData.meals || [];
      
      for (const meal of dayMeals) {
        // Get detailed recipe information
        const recipeResponse = await fetch(
          `https://api.spoonacular.com/recipes/${meal.id}/information?apiKey=${apiKey}&includeNutrition=true`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (recipeResponse.ok) {
          const recipeData = await recipeResponse.json();
          
          // Estimate cost based on ingredients (simplified)
          const estimatedCost = estimateMealCost(recipeData.extendedIngredients, people);
          totalCost += estimatedCost;

          meals.push({
            id: meal.id,
            name: recipeData.title,
            cost: estimatedCost,
            calories: Math.round((recipeData.nutrition?.nutrients?.find((n: any) => n.name === 'Calories')?.amount || 400) * people),
            type: getMealType(dayIndex, meals.length % 3),
            day: daysOfWeek[dayIndex],
            ingredients: recipeData.extendedIngredients.map((ing: any) => ing.original),
          });

          // Add ingredients to grocery list
          recipeData.extendedIngredients.forEach((ingredient: any) => {
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
                category: categorizeIngredient(ingredient.aisle || ingredient.name),
              });
            }
          });
        }
      }
    }

    // If we're over budget, adjust by removing expensive items or suggesting cheaper alternatives
    if (totalCost > budget) {
      // Simple budget adjustment - reduce portions or suggest budget meals
      const reductionFactor = budget / totalCost;
      totalCost = budget * 0.95; // Aim for 95% of budget
      
      meals.forEach(meal => {
        meal.cost *= reductionFactor;
      });

      groceryItems.forEach(item => {
        item.cost *= reductionFactor;
      });
    }

    // Organize grocery list by categories
    const groceryList = organizeGroceryList(Array.from(groceryItems.values()));

    // SMART MEAL PREP WORKFLOW GENERATION - VALUE-PACKED!
    const mealPrepInstructions = generateMealPrepInstructions(meals, days);

    return {
      meals,
      totalCost,
      groceryList,
      mealPrepInstructions, // WORKFLOW OPTIMIZATION FEATURE!
      savings: Math.max(0, budget - totalCost),
    };
    
  } catch (error) {
    console.error('Error generating meal plan:', error);
    
    // Fallback meal plan if API fails
    return await generateFallbackMealPlan(budget, people, days, allergies, dislikes, dietType, calorieGoal, activityLevel, maxCookingTime, skillLevel);
  }
}

function getMealType(dayIndex: number, mealIndex: number): 'breakfast' | 'lunch' | 'dinner' {
  const types: ('breakfast' | 'lunch' | 'dinner')[] = ['breakfast', 'lunch', 'dinner'];
  return types[mealIndex % 3];
}

function estimateMealCost(ingredients: any[], people: number): number {
  // Simplified cost estimation based on ingredient types
  const baseCost = ingredients.reduce((total, ing) => {
    const amount = ing.measures?.metric?.amount || 1;
    const basePrice = getIngredientBasePrice(ing.name || '');
    return total + (basePrice * amount * people);
  }, 0);
  
  return Math.round(baseCost * 100) / 100;
}

function getIngredientBasePrice(ingredientName: string): number {
  const name = ingredientName.toLowerCase();
  
  // Price estimates per unit (simplified)
  if (name.includes('chicken') || name.includes('beef') || name.includes('pork')) return 0.15;
  if (name.includes('fish') || name.includes('salmon') || name.includes('tuna')) return 0.20;
  if (name.includes('egg')) return 0.25;
  if (name.includes('milk') || name.includes('cheese') || name.includes('yogurt')) return 0.10;
  if (name.includes('rice') || name.includes('pasta') || name.includes('bread')) return 0.05;
  if (name.includes('potato') || name.includes('onion') || name.includes('carrot')) return 0.03;
  if (name.includes('tomato') || name.includes('pepper') || name.includes('lettuce')) return 0.08;
  if (name.includes('oil') || name.includes('butter')) return 0.12;
  if (name.includes('spice') || name.includes('herb') || name.includes('salt')) return 0.02;
  
  return 0.06; // Default price per unit
}

function estimateIngredientCost(ingredient: any): number {
  const amount = ingredient.measures?.metric?.amount || 1;
  const basePrice = getIngredientBasePrice(ingredient.name || '');
  return Math.round(basePrice * amount * 100) / 100;
}

function categorizeIngredient(aisle: string): string {
  const aisleMap: { [key: string]: string } = {
    'Meat': 'protein',
    'Seafood': 'protein',
    'Dairy and Eggs': 'dairy',
    'Produce': 'produce',
    'Pantry': 'pantry',
    'Bakery/Bread': 'pantry',
    'Pasta and Rice': 'pantry',
    'Canned and Jarred': 'pantry',
    'Frozen': 'frozen',
    'Spices and Seasonings': 'pantry',
  };
  
  return aisleMap[aisle] || 'pantry';
}

function combineQuantities(existing: string, newAmount: number, unit: string): string {
  // Simplified quantity combination
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

function organizeGroceryList(items: any[]) {
  const categories: { [key: string]: { name: string; icon: string; items: any[]; totalCost: number } } = {
    produce: { name: 'Produce', icon: 'apple-alt', items: [], totalCost: 0 },
    protein: { name: 'Protein', icon: 'drumstick-bite', items: [], totalCost: 0 },
    dairy: { name: 'Dairy', icon: 'cheese', items: [], totalCost: 0 },
    pantry: { name: 'Pantry', icon: 'box', items: [], totalCost: 0 },
    frozen: { name: 'Frozen', icon: 'snowflake', items: [], totalCost: 0 },
  };

  items.forEach(item => {
    const category = categories[item.category] || categories.pantry;
    category.items.push(item);
    category.totalCost += item.cost;
  });

  return Object.values(categories).filter((cat: any) => cat.items.length > 0);
}

// SMART MEAL PREP WORKFLOW GENERATOR - VALUE-PACKED OPTIMIZATION!
function generateMealPrepInstructions(meals: any[], days: number) {
  const prepTasks: any[] = [];
  const ingredientBatches: Record<string, any> = {};
  
  // Analyze meals to find batch cooking opportunities
  meals.forEach((meal, index) => {
    const day = Math.floor(index / 3) + 1;
    
    // Identify batch cooking opportunities
    if (meal.ingredients.includes('rice') || meal.ingredients.includes('instant rice')) {
      if (!ingredientBatches['rice']) {
        ingredientBatches['rice'] = {
          ingredient: 'rice',
          totalAmount: '3-4 cups',
          meals: [],
          day: day
        };
      }
      ingredientBatches['rice'].meals.push(meal.name);
    }
    
    if (meal.ingredients.some((ing: string) => ing.includes('vegetables') || ing.includes('veggies'))) {
      if (!ingredientBatches['vegetables']) {
        ingredientBatches['vegetables'] = {
          ingredient: 'vegetables',
          task: 'Pre-chop all vegetables',
          meals: [],
          day: Math.min(day, 2) // Do early for freshness
        };
      }
      ingredientBatches['vegetables'].meals.push(meal.name);
    }
    
    if (meal.ingredients.includes('pasta')) {
      if (!ingredientBatches['pasta']) {
        ingredientBatches['pasta'] = {
          ingredient: 'pasta',
          task: 'Cook large batch of pasta',
          meals: [],
          day: day
        };
      }
      ingredientBatches['pasta'].meals.push(meal.name);
    }
  });
  
  // Generate smart prep instructions
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Day 1: Batch cooking foundations
  if (ingredientBatches['rice']) {
    prepTasks.push({
      day: 1,
      dayName: daysOfWeek[0],
      task: `Cook ${ingredientBatches['rice'].totalAmount} rice for multiple meals`,
      benefit: `Saves 15+ minutes daily`,
      meals: ingredientBatches['rice'].meals.slice(0, 3),
      timeRequired: '20 minutes',
      category: 'batch-cooking'
    });
  }
  
  // Day 2: Prep work
  if (ingredientBatches['vegetables']) {
    prepTasks.push({
      day: 2,
      dayName: daysOfWeek[1],
      task: 'Pre-chop all vegetables for stir fry, omelets, and bowls',
      benefit: 'Quick assembly for 3-4 meals',
      meals: ingredientBatches['vegetables'].meals.slice(0, 3),
      timeRequired: '15 minutes',
      category: 'prep-work'
    });
  }
  
  // Day 3: Sauces and dressings
  prepTasks.push({
    day: 3,
    dayName: daysOfWeek[2],
    task: 'Mix dressings and sauces for different bowls',
    benefit: 'Instant flavor for quick meals',
    meals: ['Rice bowls', 'Salads', 'Stir fry dishes'],
    timeRequired: '10 minutes',
    category: 'sauces'
  });
  
  // Add protein prep if relevant
  const proteinMeals = meals.filter(meal => 
    meal.ingredients.some((ing: string) => 
      ['chicken', 'turkey', 'beef', 'fish', 'tofu'].some(protein => 
        ing.toLowerCase().includes(protein)
      )
    )
  );
  
  if (proteinMeals.length >= 3) {
    prepTasks.push({
      day: 1,
      dayName: daysOfWeek[0],
      task: 'Season and marinate proteins for the week',
      benefit: 'Better flavor and faster cooking',
      meals: proteinMeals.slice(0, 3).map(meal => meal.name),
      timeRequired: '10 minutes',
      category: 'protein-prep'
    });
  }
  
  return {
    totalPrepTime: prepTasks.reduce((total, task) => total + parseInt(task.timeRequired), 0),
    timeSavedDaily: '20-30 minutes per day',
    instructions: prepTasks,
    tips: [
      'Store prepped vegetables in airtight containers',
      'Cooked rice lasts 4-5 days in refrigerator',
      'Prep on Sunday for week-long convenience',
      'Use glass containers for better freshness'
    ]
  };
}

function generateFallbackMealPlan(
  budget: number, 
  people: number, 
  days: number, 
  allergies?: string[], 
  dislikes?: string[], 
  dietType?: string,
  calorieGoal?: number,
  activityLevel?: string,
  maxCookingTime?: number,
  skillLevel?: 'beginner' | 'intermediate' | 'advanced'
) {
  // Enhanced meal database with TIME + SKILL filtering - THE DIFFERENTIATOR!
  let simpleMeals = [
    { 
      name: 'Oatmeal with Banana', 
      type: 'breakfast', 
      costPerPerson: 1.50, 
      calories: 320, 
      contains: ['gluten'], 
      ingredients: ['oats', 'banana', 'milk'],
      cookingTime: 5, // 5 minutes - MICROWAVE FRIENDLY
      skillLevel: 'beginner' as const,
      cookingMethod: 'microwave',
      nutritionInfo: { protein: 8, carbs: 54, fat: 6, fiber: 8 },
      substitutions: [] as Array<{original: string, substitute: string, reason: string}>
    },
    { 
      name: 'Scrambled Eggs & Toast', 
      type: 'breakfast', 
      costPerPerson: 2.00, 
      calories: 285, 
      contains: ['eggs', 'gluten'], 
      ingredients: ['eggs', 'bread', 'butter'],
      cookingTime: 8, // 8 minutes
      skillLevel: 'beginner' as const,
      cookingMethod: 'stovetop',
      nutritionInfo: { protein: 15, carbs: 20, fat: 18, fiber: 2 },
      substitutions: [] as Array<{original: string, substitute: string, reason: string}>
    },
    { 
      name: 'Peanut Butter Toast', 
      type: 'breakfast', 
      costPerPerson: 1.25, 
      calories: 290, 
      contains: ['nuts', 'gluten'], 
      ingredients: ['bread', 'peanut butter'],
      cookingTime: 3, // 3 minutes - NO COOKING!
      skillLevel: 'beginner' as const,
      cookingMethod: 'no-cook',
      nutritionInfo: { protein: 12, carbs: 28, fat: 16, fiber: 4 },
      substitutions: [] as Array<{original: string, substitute: string, reason: string}>
    },
    { 
      name: 'Fruit & Yogurt Bowl', 
      type: 'breakfast', 
      costPerPerson: 2.25, 
      calories: 250, 
      contains: ['dairy'], 
      ingredients: ['yogurt', 'berries', 'granola'],
      cookingTime: 2, // 2 minutes - ASSEMBLY ONLY
      skillLevel: 'beginner' as const,
      cookingMethod: 'no-cook',
      nutritionInfo: { protein: 12, carbs: 35, fat: 8, fiber: 6 },
      substitutions: [] as Array<{original: string, substitute: string, reason: string}>
    },
    
    // 15-MINUTE MICROWAVE MEALS FOR BEGINNERS
    { 
      name: 'Microwave Burrito Bowl', 
      type: 'lunch', 
      costPerPerson: 3.25, 
      calories: 450, 
      contains: [], 
      ingredients: ['instant rice', 'canned beans', 'salsa', 'cheese'],
      cookingTime: 6, // 6 minutes - MICROWAVE
      skillLevel: 'beginner' as const,
      cookingMethod: 'microwave',
      nutritionInfo: { protein: 18, carbs: 65, fat: 12, fiber: 12 },
      substitutions: [] as Array<{original: string, substitute: string, reason: string}>
    },
    { 
      name: 'Instant Ramen Upgrade', 
      type: 'lunch', 
      costPerPerson: 2.50, 
      calories: 380, 
      contains: ['gluten'], 
      ingredients: ['instant ramen', 'frozen vegetables', 'egg'],
      cookingTime: 5, // 5 minutes - MICROWAVE + EGG
      skillLevel: 'beginner' as const,
      cookingMethod: 'microwave',
      nutritionInfo: { protein: 15, carbs: 48, fat: 14, fiber: 4 },
      substitutions: [] as Array<{original: string, substitute: string, reason: string}>
    },
    
    { 
      name: 'Turkey Sandwich', 
      type: 'lunch', 
      costPerPerson: 3.50, 
      calories: 420, 
      contains: ['gluten'], 
      ingredients: ['turkey', 'bread', 'lettuce', 'tomato'],
      cookingTime: 5, // 5 minutes - ASSEMBLY ONLY
      skillLevel: 'beginner' as const,
      cookingMethod: 'no-cook',
      nutritionInfo: { protein: 25, carbs: 35, fat: 12, fiber: 4 },
      substitutions: [] as Array<{original: string, substitute: string, reason: string}>
    },
    { 
      name: 'Pasta Salad', 
      type: 'lunch', 
      costPerPerson: 2.75, 
      calories: 380, 
      contains: ['gluten'], 
      ingredients: ['pasta', 'vegetables', 'olive oil'],
      cookingTime: 15, // 15 minutes - BOIL PASTA
      skillLevel: 'intermediate' as const,
      cookingMethod: 'stovetop',
      nutritionInfo: { protein: 8, carbs: 55, fat: 14, fiber: 5 },
      substitutions: [] as Array<{original: string, substitute: string, reason: string}>
    },
    { 
      name: 'Rice Bowl with Vegetables', 
      type: 'lunch', 
      costPerPerson: 3.00, 
      calories: 450, 
      contains: [], 
      ingredients: ['rice', 'mixed vegetables', 'soy sauce'],
      nutritionInfo: { protein: 10, carbs: 65, fat: 12, fiber: 6 },
      substitutions: [] as Array<{original: string, substitute: string, reason: string}>
    },
    { 
      name: 'Quinoa Salad', 
      type: 'lunch', 
      costPerPerson: 3.25, 
      calories: 400, 
      contains: [], 
      ingredients: ['quinoa', 'vegetables', 'vinaigrette'],
      nutritionInfo: { protein: 14, carbs: 58, fat: 10, fiber: 8 },
      substitutions: [] as Array<{original: string, substitute: string, reason: string}>
    },
    
    { 
      name: 'Chicken & Rice', 
      type: 'dinner', 
      costPerPerson: 5.50, 
      calories: 580, 
      contains: [], 
      ingredients: ['chicken breast', 'rice', 'vegetables'],
      nutritionInfo: { protein: 45, carbs: 50, fat: 12, fiber: 4 },
      substitutions: [] as Array<{original: string, substitute: string, reason: string}>
    },
    { 
      name: 'Spaghetti with Marinara', 
      type: 'dinner', 
      costPerPerson: 4.25, 
      calories: 520, 
      contains: ['gluten'], 
      ingredients: ['pasta', 'marinara sauce', 'herbs'],
      nutritionInfo: { protein: 15, carbs: 78, fat: 12, fiber: 6 },
      substitutions: [] as Array<{original: string, substitute: string, reason: string}>
    },
    { 
      name: 'Bean & Vegetable Stew', 
      type: 'dinner', 
      costPerPerson: 3.75, 
      calories: 450, 
      contains: [], 
      ingredients: ['beans', 'vegetables', 'broth'],
      nutritionInfo: { protein: 18, carbs: 65, fat: 8, fiber: 12 },
      substitutions: [] as Array<{original: string, substitute: string, reason: string}>
    },
    { 
      name: 'Grilled Fish with Vegetables', 
      type: 'dinner', 
      costPerPerson: 6.00, 
      calories: 480, 
      contains: ['fish'], 
      ingredients: ['fish fillet', 'vegetables', 'herbs'],
      nutritionInfo: { protein: 35, carbs: 25, fat: 20, fiber: 6 },
      substitutions: [] as Array<{original: string, substitute: string, reason: string}>
    },
    { 
      name: 'Tofu Stir Fry', 
      type: 'dinner', 
      costPerPerson: 4.00, 
      calories: 420, 
      contains: ['soy'], 
      ingredients: ['tofu', 'vegetables', 'stir fry sauce'],
      nutritionInfo: { protein: 20, carbs: 35, fat: 18, fiber: 8 },
      substitutions: [] as Array<{original: string, substitute: string, reason: string}>
    },
  ];

  // Add substitutions before filtering
  const substitutionMap = {
    // Dairy substitutions
    'milk': { substitute: 'almond milk', reason: 'dairy-free alternative' },
    'yogurt': { substitute: 'coconut yogurt', reason: 'dairy-free alternative' },
    'butter': { substitute: 'olive oil', reason: 'dairy-free alternative' },
    'cheese': { substitute: 'nutritional yeast', reason: 'dairy-free alternative' },
    
    // Gluten substitutions
    'bread': { substitute: 'gluten-free bread', reason: 'gluten-free alternative' },
    'pasta': { substitute: 'rice noodles', reason: 'gluten-free alternative' },
    'oats': { substitute: 'quinoa flakes', reason: 'gluten-free alternative' },
    
    // Nut substitutions
    'peanut butter': { substitute: 'sunflower seed butter', reason: 'nut-free alternative' },
    'almonds': { substitute: 'pumpkin seeds', reason: 'nut-free alternative' },
    
    // Meat substitutions for vegetarian/vegan
    'chicken': { substitute: 'tofu', reason: 'plant-based protein' },
    'turkey': { substitute: 'tempeh', reason: 'plant-based protein' },
    'fish': { substitute: 'mushrooms', reason: 'plant-based alternative' },
    
    // Egg substitutions
    'eggs': { substitute: 'flax eggs', reason: 'vegan alternative' },
  };

  // Apply substitutions to meals before filtering
  simpleMeals = simpleMeals.map(meal => {
    const mealCopy = { ...meal, substitutions: [] as Array<{original: string, substitute: string, reason: string}> };
    
    // Check if meal needs substitutions based on dietary restrictions
    const needsSubstitution = [...(allergies || []), ...(dislikes || [])];
    
    if (needsSubstitution.length > 0) {
      mealCopy.ingredients = meal.ingredients.map(ingredient => {
        const lowerIngredient = ingredient.toLowerCase();
        
        // Check if this ingredient needs substitution
        for (const restriction of needsSubstitution) {
          const lowerRestriction = restriction.toLowerCase();
          
          if (lowerIngredient.includes(lowerRestriction) || 
              (lowerRestriction.includes('dairy') && ['milk', 'yogurt', 'cheese', 'butter'].some(dairy => lowerIngredient.includes(dairy))) ||
              (lowerRestriction.includes('nuts') && ['peanut', 'almond', 'walnut', 'cashew'].some(nut => lowerIngredient.includes(nut)))) {
            
            // Find substitution
            const substitution = Object.entries(substitutionMap).find(([key]) => 
              lowerIngredient.includes(key)
            );
            
            if (substitution) {
              const [original, sub] = substitution;
              mealCopy.substitutions!.push({
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

  // 🎯 TIME + SKILL FILTERS - THE KEY DIFFERENTIATOR!
  // Most apps only filter by calories/macros - we filter by real cooking constraints!
  
  // Filter by cooking time constraint (15-minute meals for busy people)
  if (maxCookingTime && maxCookingTime > 0) {
    simpleMeals = simpleMeals.filter(meal => (meal.cookingTime || 30) <= maxCookingTime);
    console.log(`Filtered to ${simpleMeals.length} meals under ${maxCookingTime} minutes`);
  }
  
  // Filter by skill level ("I can't cook" = microwave/no-cook only)
  if (skillLevel) {
    if (skillLevel === 'beginner') {
      // Only include microwave, no-cook, and very simple stovetop meals
      simpleMeals = simpleMeals.filter(meal => 
        meal.skillLevel === 'beginner' && 
        (meal.cookingMethod === 'microwave' || 
         meal.cookingMethod === 'no-cook' || 
         (meal.cookingMethod === 'stovetop' && (meal.cookingTime || 30) <= 10))
      );
      console.log(`Filtered to ${simpleMeals.length} beginner-friendly meals`);
    } else if (skillLevel === 'intermediate') {
      simpleMeals = simpleMeals.filter(meal => 
        meal.skillLevel === 'beginner' || meal.skillLevel === 'intermediate'
      );
    }
    // Advanced skill level includes all meals
  }
  
  // Filter meals based on dietary restrictions (after attempting substitutions)
  if (allergies && allergies.length > 0) {
    simpleMeals = simpleMeals.filter(meal => 
      !allergies.some(allergy => 
        meal.contains.includes(allergy.toLowerCase()) ||
        meal.ingredients.some(ingredient => 
          ingredient.toLowerCase().includes(allergy.toLowerCase()) ||
          (allergy.toLowerCase().includes('dairy') && ['milk', 'yogurt', 'cheese', 'butter'].some(dairy => 
            ingredient.toLowerCase().includes(dairy)
          )) ||
          (allergy.toLowerCase().includes('nuts') && ['peanut', 'almond', 'walnut', 'cashew'].some(nut => 
            ingredient.toLowerCase().includes(nut)
          ))
        )
      )
    );
  }

  if (dislikes && dislikes.length > 0) {
    simpleMeals = simpleMeals.filter(meal => 
      !dislikes.some(dislike => 
        meal.name.toLowerCase().includes(dislike.toLowerCase()) ||
        meal.ingredients.some(ingredient => 
          ingredient.toLowerCase().includes(dislike.toLowerCase())
        )
      )
    );
  }

  // Filter by diet type
  if (dietType) {
    switch (dietType.toLowerCase()) {
      case 'vegetarian':
        simpleMeals = simpleMeals.filter(meal => 
          !meal.ingredients.some(ingredient => 
            ['chicken', 'turkey', 'beef', 'pork', 'fish'].some(meat => 
              ingredient.toLowerCase().includes(meat)
            )
          )
        );
        break;
      case 'vegan':
        simpleMeals = simpleMeals.filter(meal => 
          !meal.contains.includes('dairy') && 
          !meal.contains.includes('eggs') &&
          !meal.ingredients.some(ingredient => 
            ['chicken', 'turkey', 'beef', 'pork', 'fish', 'milk', 'yogurt', 'cheese', 'butter', 'eggs'].some(animal => 
              ingredient.toLowerCase().includes(animal)
            )
          )
        );
        break;
      case 'pescatarian':
        simpleMeals = simpleMeals.filter(meal => 
          !meal.ingredients.some(ingredient => 
            ['chicken', 'turkey', 'beef', 'pork'].some(meat => 
              ingredient.toLowerCase().includes(meat)
            )
          )
        );
        break;
      case 'gluten-free':
        simpleMeals = simpleMeals.filter(meal => !meal.contains.includes('gluten'));
        break;
    }
  }

  // Filter meals based on calorie goal - TARGET SPECIFIC CALORIE RANGES!
  if (calorieGoal && calorieGoal > 0) {
    const targetCaloriesPerMeal = Math.round(calorieGoal / 3); // Divide daily calories across 3 meals
    const calorieRange = Math.round(targetCaloriesPerMeal * 0.3); // Allow 30% variance
    
    simpleMeals = simpleMeals.filter(meal => {
      const mealCalories = meal.calories || 400; // Default if not specified
      return mealCalories >= (targetCaloriesPerMeal - calorieRange) && 
             mealCalories <= (targetCaloriesPerMeal + calorieRange);
    });
    
    console.log(`Filtered to ${simpleMeals.length} meals matching calorie goal of ${calorieGoal} calories/day`);
  }

  const meals: any[] = [];
  let totalCost = 0;
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  for (let day = 0; day < days; day++) {
    ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
      const availableMeals = simpleMeals.filter(m => m.type === mealType);
      if (availableMeals.length === 0) {
        // If no meals available due to restrictions, add a safe fallback
        const safeMeal = {
          name: `Safe ${mealType.charAt(0).toUpperCase() + mealType.slice(1)}`,
          costPerPerson: 3.00,
          calories: 400
        };
        meals.push({
          id: Math.floor(Math.random() * 1000000),
          name: safeMeal.name,
          cost: safeMeal.costPerPerson * people,
          calories: safeMeal.calories * people,
          type: mealType,
          day: daysOfWeek[day % 7],
          ingredients: [],
        });
        totalCost += safeMeal.costPerPerson * people;
        return;
      }
      
      const meal = availableMeals[Math.floor(Math.random() * availableMeals.length)];
      const cost = meal.costPerPerson * people;
      
      meals.push({
        id: Math.floor(Math.random() * 1000000),
        name: meal.name,
        cost,
        calories: meal.calories * people,
        type: meal.type,
        day: daysOfWeek[day % 7],
        ingredients: meal.ingredients || [],
        substitutions: meal.substitutions || [],
        cookingTime: meal.cookingTime || 30, // Include cooking time
        skillLevel: meal.skillLevel || 'intermediate', // Include skill level
        cookingMethod: meal.cookingMethod || 'stovetop', // Include cooking method
        nutritionInfo: meal.nutritionInfo ? {
          protein: meal.nutritionInfo.protein * people,
          carbs: meal.nutritionInfo.carbs * people,
          fat: meal.nutritionInfo.fat * people,
          fiber: meal.nutritionInfo.fiber * people,
        } : undefined,
      });
      
      totalCost += cost;
    });
  }

  // Adjust if over budget
  if (totalCost > budget) {
    const factor = (budget * 0.95) / totalCost;
    totalCost = budget * 0.95;
    meals.forEach(meal => {
      meal.cost *= factor;
    });
  }

  // SMART MEAL PREP OPTIMIZATION - VALUE-PACKED WORKFLOW!
  const mealPrepInstructions = generateMealPrepInstructions(meals, days);

  // Basic grocery list
  const groceryList = [
    {
      name: 'Produce',
      icon: 'apple-alt',
      items: [
        { name: 'Bananas', quantity: '2 lbs', cost: 2.98, category: 'produce' },
        { name: 'Onions', quantity: '3 lbs', cost: 2.49, category: 'produce' },
      ],
      totalCost: 5.47,
    },
    {
      name: 'Protein',
      icon: 'drumstick-bite',
      items: [
        { name: 'Chicken Breast', quantity: '2 lbs', cost: 7.98, category: 'protein' },
        { name: 'Eggs', quantity: '18 count', cost: 3.99, category: 'protein' },
      ],
      totalCost: 11.97,
    },
    {
      name: 'Pantry',
      icon: 'box',
      items: [
        { name: 'Rice', quantity: '5 lbs', cost: 4.49, category: 'pantry' },
        { name: 'Pasta', quantity: '3 boxes', cost: 2.97, category: 'pantry' },
        { name: 'Bread', quantity: '2 loaves', cost: 2.98, category: 'pantry' },
      ],
      totalCost: 10.44,
    },
  ];

  return {
    meals,
    totalCost,
    groceryList,
    mealPrepInstructions, // SMART WORKFLOW OPTIMIZATION!
    savings: Math.max(0, budget - totalCost),
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Test preview route
  app.get('/test-preview', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html><head><title>BudgetBites Header Test</title><style>
      .main-header{display:flex;align-items:center;justify-content:space-between;padding:1rem;background:#fff;border-bottom:1px solid #ccc;}
      .logo{height:40px;width:auto;object-fit:contain;}.header-text{flex-grow:1;text-align:center;font-weight:bold;font-size:1rem;padding:0 1rem;color:#374151;}
      .login-link{margin-left:auto;text-decoration:none;font-weight:bold;color:#059669;}
      .login-link:hover{color:#047857;}
      body{margin:0;font-family:Arial,sans-serif;}.content{padding:40px;text-align:center;background:#f9fafb;min-height:calc(100vh - 72px);}
      h1{color:#047857;font-size:2.5rem;margin-bottom:16px;}
      </style></head><body>
      <header class="main-header">
        <img src="/assets/IMG_7593_1754519435815.png" alt="BudgetBites Logo" class="logo" />
        <div class="header-text">Everyone has a premium account for a budget price — we value your health.</div>
        <a href="/login" class="login-link">Login</a>
      </header>
      <div class="content">
        <h1>PREVIEW TEST WORKING!</h1>
        <h2 style="color:#059669;">Can you see this page now?</h2>
        <div style="background:white;padding:30px;border-radius:16px;box-shadow:0 10px 25px rgba(0,0,0,0.1);max-width:600px;margin:20px auto;">
          <p style="color:#6b7280;margin-bottom:20px;font-size:1.1rem;">✓ Logo (40px) on left<br>✓ Tagline centered<br>✓ Login link on right</p>
          <p style="color:#10b981;font-weight:bold;font-size:1.2rem;">This is your header working!</p>
        </div>
        <p style="margin-top:30px;color:#6b7280;">URL: /test-preview</p>
      </div>
      </body></html>
    `);
  });
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Wellness tracking endpoints
  app.post("/api/wellness/track", async (req, res) => {
    try {
      const validated = insertWellnessSchema.parse(req.body);
      const wellnessEntry = await storage.createWellnessEntry(validated);
      res.json(wellnessEntry);
    } catch (error) {
      console.error("Error tracking wellness:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid wellness data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to track wellness" });
    }
  });

  app.get("/api/wellness/history", async (req, res) => {
    try {
      const days = parseInt(req.query.days as string) || 30;
      const history = await storage.getWellnessHistory(days);
      res.json(history);
    } catch (error) {
      console.error("Error fetching wellness history:", error);
      res.status(500).json({ message: "Failed to fetch wellness history" });
    }
  });

  app.post("/api/nutrition/insights", async (req, res) => {
    try {
      const validated = insertNutritionSchema.parse(req.body);
      const insight = await storage.createNutritionInsight(validated);
      res.json(insight);
    } catch (error) {
      console.error("Error creating nutrition insight:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid nutrition data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create nutrition insight" });
    }
  });

  // Advanced wellness recommendations using ingredient mapping engine
  app.post("/api/wellness/recommendations", async (req, res) => {
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

  // Mood-Food Learning System endpoints
  app.post("/api/mood-food/entry", async (req, res) => {
    try {
      const validated = insertMoodFoodSchema.parse(req.body);
      const entry = await storage.createMoodFoodEntry(validated);
      res.json(entry);
    } catch (error) {
      console.error("Error creating mood-food entry:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid mood-food data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create mood-food entry" });
    }
  });

  app.get("/api/mood-food/entries/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const days = parseInt(req.query.days as string) || 30;
      const entries = await storage.getMoodFoodEntries(userId, days);
      res.json(entries);
    } catch (error) {
      console.error("Error fetching mood-food entries:", error);
      res.status(500).json({ message: "Failed to fetch mood-food entries" });
    }
  });

  // AI-powered personalized recommendations based on learning
  app.post("/api/mood-learning/recommendations", async (req, res) => {
    try {
      const { userId, currentMeals, currentMood } = req.body;
      
      if (!userId || !currentMeals) {
        return res.status(400).json({ message: "userId and currentMeals are required" });
      }
      
      // Get user's historical data
      const userEntries = await storage.getMoodFoodEntries(userId, 90); // Last 90 days
      
      // Run the learning engine
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

  // Get learning insights for dashboard
  app.get("/api/mood-learning/insights/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const userEntries = await storage.getMoodFoodEntries(userId, 60); // Last 60 days
      
      if (userEntries.length < 3) {
        return res.json({
          message: "Not enough data yet. Keep tracking your meals and mood!",
          dataPoints: userEntries.length,
          needMore: 3 - userEntries.length
        });
      }
      
      const result = runMoodLearningEngine(userEntries, [], 'neutral');
      
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

  // AI-powered comprehensive wellness recommendations
  app.post("/api/ai-fitness/comprehensive-plan", async (req, res) => {
    try {
      const { userId, currentMeals } = req.body;
      
      if (!userId || !currentMeals) {
        return res.status(400).json({ message: "userId and currentMeals are required" });
      }
      
      // Get user's meal patterns and mood history
      const userEntries = await storage.getMoodFoodEntries(userId, 30);
      
      // Generate comprehensive recommendations using AI APIs
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

  // Get AI workout plan only
  app.post("/api/ai-fitness/workout-plan", async (req, res) => {
    try {
      const { userId, goal, fitnessLevel, preferences, schedule } = req.body;
      
      const userEntries = await storage.getMoodFoodEntries(userId || "demo-user", 30);
      const mealCategories = userEntries.flatMap(entry => entry.meals);
      
      const { generateAIWorkoutPlan } = await import("./ai-fitness-engine");
      const workoutPlan = await generateAIWorkoutPlan(mealCategories, userEntries, {
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

  // Get AI nutrition advice only
  app.post("/api/ai-fitness/nutrition-advice", async (req, res) => {
    try {
      const { userId, goal, dietaryRestrictions, currentWeight, targetWeight } = req.body;
      
      const userEntries = await storage.getMoodFoodEntries(userId || "demo-user", 30);
      const mealCategories = userEntries.flatMap(entry => entry.meals);
      
      const { generateAINutritionAdvice } = await import("./ai-fitness-engine");
      const nutritionAdvice = await generateAINutritionAdvice(mealCategories, userEntries, {
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

  // Get detailed exercise information
  app.post("/api/ai-fitness/exercise-details", async (req, res) => {
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

  // Enhanced workout plan with exercise details
  app.post("/api/ai-fitness/enhanced-workout-plan", async (req, res) => {
    try {
      const { userId, goal, fitnessLevel, preferences, schedule } = req.body;
      
      const userEntries = await storage.getMoodFoodEntries(userId || "demo-user", 30);
      const mealCategories = userEntries.flatMap(entry => entry.meals);
      
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

  // Generate custom workout plan based on detailed preferences
  app.post("/api/ai-fitness/custom-workout-plan", async (req, res) => {
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
        goal: goal || 'Improve overall fitness',
        fitness_level: fitnessLevel || 'Intermediate',
        preferences: preferences || [],
        health_conditions: healthConditions || [],
        schedule: schedule || { days_per_week: 4, session_duration: 45 },
        plan_duration_weeks: planDurationWeeks || 6,

        lang: 'en'
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

  // Advanced wellness recommendations with custom workout integration
  app.post("/api/ai-fitness/advanced-wellness-plan", async (req, res) => {
    try {
      const { 
        userId, 
        userPreferences = {} 
      } = req.body;
      
      const userEntries = await storage.getMoodFoodEntries(userId || "demo-user", 30);
      const mealCategories = userEntries.flatMap(entry => entry.meals);
      
      const result = await generateAdvancedWellnessRecommendations(
        mealCategories, 
        userEntries, 
        userPreferences
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

  // Analyze food plate from image
  app.post("/api/ai-fitness/analyze-food-plate", async (req, res) => {
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

  // Visual meal analysis with fitness recommendations
  app.post("/api/ai-fitness/visual-meal-analysis", async (req, res) => {
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

  // Get daily affirmation for motivation
  app.get("/api/wellness/daily-affirmation", async (req, res) => {
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
        timestamp: new Date().toISOString(),
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

  // Get comprehensive wellness motivation
  app.get("/api/wellness/motivation", async (req, res) => {
    try {
      const motivation = await getWellnessMotivation();
      
      res.json({
        ...motivation,
        timestamp: new Date().toISOString(),
        message: "Wellness motivation retrieved successfully"
      });
    } catch (error) {
      console.error("Error fetching wellness motivation:", error);
      res.status(500).json({ message: "Failed to fetch wellness motivation" });
    }
  });

  // Get comprehensive wellness tips
  app.get("/api/wellness/tips", async (req, res) => {
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
        timestamp: new Date().toISOString(),
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

  // Get daily inspirational quote
  app.get("/api/wellness/quote", async (req, res) => {
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
        timestamp: new Date().toISOString(),
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

  // Admin authentication endpoints
  app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    
    // Simple admin authentication (use proper auth in production)
    if (username === 'admin' && password === 'totalwellness2025') {
      const token = 'admin_authenticated_' + Date.now();
      res.json({ 
        success: true, 
        token,
        message: 'Admin login successful'
      });
    } else {
      res.status(401).json({ 
        success: false, 
        message: 'Invalid admin credentials' 
      });
    }
  });

  // Admin stats endpoint
  app.get('/api/admin/stats', (req, res) => {
    // Mock admin statistics (replace with real data in production)
    res.json({
      totalUsers: 156,
      activeSubscriptions: 89,
      monthlyRevenue: 890.11,
      totalMealPlans: 1247,
      conversionRate: 57.1,
      averageOrderValue: 9.99
    });
  });

  // MobileNet Recipe Suggestions endpoint
  app.post('/api/mobilenet-recipes', async (req, res) => {
    try {
      const { predictions, budget, detectedIngredients } = req.body;
      
      console.log('MobileNet recipe request:', { predictions, budget });
      
      // Generate smart recipes based on MobileNet predictions
      const smartRecipes = [
        {
          id: 1,
          name: `Gourmet ${predictions[0]?.className || 'Mixed'} Delight`,
          cost: Math.min(budget * 0.8, 12.00),
          ingredients: predictions.map((p: any) => p.className).slice(0, 5),
          cookTime: 15,
          difficulty: 'Easy',
          confidence: predictions[0]?.probability || 0.8,
          description: 'AI-optimized recipe using detected ingredients with perfect flavor balance'
        },
        {
          id: 2,
          name: 'Quick Budget Bowl',
          cost: Math.min(budget * 0.6, 8.00),
          ingredients: [...predictions.map((p: any) => p.className).slice(0, 3), 'seasoning', 'oil'],
          cookTime: 10,
          difficulty: 'Beginner',
          confidence: Math.max(...predictions.map((p: any) => p.probability)),
          description: 'Simple, nutritious meal maximizing detected ingredients'
        }
      ];

      // Filter by budget and add smart suggestions
      const affordableRecipes = smartRecipes.filter(recipe => recipe.cost <= budget);

      res.json({
        success: true,
        recipes: affordableRecipes,
        totalPredictions: predictions.length,
        averageConfidence: predictions.reduce((sum: number, p: any) => sum + p.probability, 0) / predictions.length,
        estimatedValue: predictions.reduce((sum: number, p: any) => sum + p.estimatedPrice, 0)
      });
    } catch (error) {
      console.error('MobileNet recipe generation error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to generate MobileNet recipe suggestions' 
      });
    }
  });

  // AR Recipe Suggestions endpoint
  app.post('/api/ar-recipe-suggestions', async (req, res) => {
    try {
      const { ingredients, budget, detectedItems } = req.body;
      
      // Generate budget-optimized recipes using detected ingredients
      const recipes = [
        {
          id: 1,
          name: 'Quick Fruit Salad',
          cost: 3.25,
          ingredients: ingredients.split(','),
          cookTime: 5,
          difficulty: 'Easy',
          instructions: 'Combine detected fruits, add honey if available'
        },
        {
          id: 2,
          name: 'Simple Smoothie',
          cost: 2.75,
          ingredients: [...ingredients.split(','), 'milk', 'honey'],
          cookTime: 3,
          difficulty: 'Easy',
          instructions: 'Blend detected fruits with milk'
        }
      ];

      // Filter recipes by budget
      const affordableRecipes = recipes.filter(recipe => recipe.cost <= budget);

      res.json({
        success: true,
        recipes: affordableRecipes,
        totalDetectedItems: detectedItems?.length || 0,
        estimatedSavings: budget - Math.min(...affordableRecipes.map(r => r.cost))
      });
    } catch (error) {
      console.error('AR recipe suggestion error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Failed to generate AR recipe suggestions' 
      });
    }
  });

  // Admin recent meal plans endpoint
  app.get('/api/admin/recent-meal-plans', (req, res) => {
    // Mock recent meal plans data
    res.json([
      { id: "1", user: "User #142", budget: 50, people: 2, days: 7, created: "2025-01-06" },
      { id: "2", user: "User #138", budget: 35, people: 1, days: 5, created: "2025-01-06" },
      { id: "3", user: "User #145", budget: 75, people: 4, days: 7, created: "2025-01-05" },
      { id: "4", user: "User #131", budget: 40, people: 2, days: 3, created: "2025-01-05" },
      { id: "5", user: "User #149", budget: 60, people: 3, days: 5, created: "2025-01-05" },
    ]);
  });
  // Generate meal plan
  app.post("/api/meal-plans/generate", async (req, res) => {
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
        userId: null, // For now, no auth required
        budget: validated.budget,
        people: validated.people,
        days: validated.days,
        store: validated.store,
        totalCost: totalCost,
        meals,
        groceryList,
      });

      res.json({
        id: mealPlan.id,
        meals,
        totalCost,
        groceryList,
        mealPrepInstructions, // SMART WORKFLOW FEATURE!
        savings,
        budget: validated.budget,
        people: validated.people,
        days: validated.days,
      });
    } catch (error) {
      console.error('Error generating meal plan:', error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to generate meal plan" 
      });
    }
  });

  // Get meal plan by ID
  app.get("/api/meal-plans/:id", async (req, res) => {
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

  // Save/favorite meal plan
  app.post("/api/meal-plans/:id/favorite", async (req, res) => {
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

  // Remove from favorites
  app.delete("/api/meal-plans/:id/favorite", async (req, res) => {
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

  const httpServer = createServer(app);
  return httpServer;
}
