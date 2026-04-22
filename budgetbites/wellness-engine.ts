// Meal-to-Wellness Mapping Engine
// Maps ingredients and macronutrients to targeted workout and stress relief recommendations

export interface WellnessMapping {
  keywords: string[];
  workout: string;
  workoutDescription: string;
  workoutDuration: number;
  workoutIntensity: 'low' | 'medium' | 'high';
  stressTip: string;
  stressTipDescription: string;
  stressTipDuration: number;
  scientificReason: string;
}

export const wellnessMap: Record<string, WellnessMapping> = {
  protein: {
    keywords: ['chicken', 'eggs', 'tofu', 'lentils', 'turkey', 'fish', 'beans', 'quinoa', 'greek yogurt', 'cottage cheese'],
    workout: 'Strength Training',
    workoutDescription: 'Resistance exercises, weightlifting, or bodyweight strength moves',
    workoutDuration: 45,
    workoutIntensity: 'high',
    stressTip: 'Power Music + Dynamic Stretching',
    stressTipDescription: 'Energizing playlist combined with active stretching routine',
    stressTipDuration: 15,
    scientificReason: 'Protein supports muscle repair and growth - optimal for strength training recovery'
  },
  
  carbs: {
    keywords: ['pasta', 'rice', 'bread', 'potatoes', 'oats', 'banana', 'sweet potato', 'quinoa', 'barley'],
    workout: 'Cardio or Light Jog',
    workoutDescription: 'Running, cycling, dancing, or any sustained cardiovascular activity',
    workoutDuration: 30,
    workoutIntensity: 'medium',
    stressTip: 'Gratitude Journaling',
    stressTipDescription: 'Write down 3 things you\'re grateful for and reflect on positive moments',
    stressTipDuration: 10,
    scientificReason: 'Carbs provide quick energy for cardio; serotonin boost aids mood and gratitude practice'
  },
  
  omega3: {
    keywords: ['salmon', 'walnuts', 'chia seeds', 'flaxseed', 'mackerel', 'sardines', 'hemp seeds'],
    workout: 'Yoga or Pilates',
    workoutDescription: 'Flowing movements, flexibility work, and mind-body connection',
    workoutDuration: 30,
    workoutIntensity: 'low',
    stressTip: 'Guided Meditation',
    stressTipDescription: 'Mindfulness meditation focusing on breath awareness and mental clarity',
    stressTipDuration: 15,
    scientificReason: 'Omega-3s reduce inflammation and support brain health - perfect for mind-body practices'
  },
  
  magnesium: {
    keywords: ['spinach', 'pumpkin seeds', 'dark chocolate', 'almonds', 'avocado', 'black beans', 'kale'],
    workout: 'Progressive Muscle Relaxation',
    workoutDescription: 'Systematic tensing and releasing of muscle groups for deep relaxation',
    workoutDuration: 20,
    workoutIntensity: 'low',
    stressTip: 'Breathwork Session',
    stressTipDescription: 'Deep breathing exercises like 4-7-8 breathing or box breathing',
    stressTipDuration: 10,
    scientificReason: 'Magnesium is essential for muscle relaxation and nervous system regulation'
  },
  
  fiber: {
    keywords: ['broccoli', 'berries', 'apples', 'beans', 'whole grains', 'artichoke', 'brussels sprouts'],
    workout: 'Nature Walk',
    workoutDescription: 'Gentle walk outdoors, hiking, or light outdoor activity',
    workoutDuration: 25,
    workoutIntensity: 'low',
    stressTip: 'Mindful Eating Practice',
    stressTipDescription: 'Slow, conscious eating focusing on flavors, textures, and gratitude',
    stressTipDuration: 15,
    scientificReason: 'Fiber supports gut health which directly impacts mood via the gut-brain axis'
  },
  
  antioxidants: {
    keywords: ['blueberries', 'strawberries', 'green tea', 'dark chocolate', 'bell peppers', 'tomatoes'],
    workout: 'HIIT or Circuit Training',
    workoutDescription: 'High-intensity intervals alternating with rest periods',
    workoutDuration: 20,
    workoutIntensity: 'high',
    stressTip: 'Color Therapy Visualization',
    stressTipDescription: 'Visualize vibrant colors while deep breathing to reduce oxidative stress',
    stressTipDuration: 8,
    scientificReason: 'Antioxidants combat exercise-induced oxidative stress, supporting recovery from intense workouts'
  },
  
  calcium: {
    keywords: ['dairy', 'milk', 'cheese', 'yogurt', 'kale', 'broccoli', 'sardines', 'almonds'],
    workout: 'Bone-Strengthening Exercises',
    workoutDescription: 'Weight-bearing exercises like jumping, dancing, or resistance training',
    workoutDuration: 30,
    workoutIntensity: 'medium',
    stressTip: 'Calming Herbal Tea Ritual',
    stressTipDescription: 'Prepare and mindfully sip chamomile or passionflower tea',
    stressTipDuration: 15,
    scientificReason: 'Calcium supports bone health and muscle contraction; ritual creates calming routine'
  },
  
  iron: {
    keywords: ['red meat', 'spinach', 'lentils', 'tofu', 'pumpkin seeds', 'dark leafy greens'],
    workout: 'Moderate Cardio',
    workoutDescription: 'Steady-state cardio like brisk walking, swimming, or cycling',
    workoutDuration: 35,
    workoutIntensity: 'medium',
    stressTip: 'Energy Visualization',
    stressTipDescription: 'Visualize bright energy flowing through your body, enhancing vitality',
    stressTipDuration: 12,
    scientificReason: 'Iron supports oxygen transport - essential for sustained cardio performance'
  }
};

export function analyzeIngredientsForWellness(ingredients: string[]): {
  primaryCategory: string;
  secondaryCategory?: string;
  workoutRecommendation: WellnessMapping;
  stressReliefRecommendation: WellnessMapping;
  confidence: number;
} {
  // Count matches for each wellness category
  const categoryScores: Record<string, number> = {};
  
  // Analyze each ingredient against wellness categories
  for (const ingredient of ingredients) {
    const lowerIngredient = ingredient.toLowerCase();
    
    for (const [category, mapping] of Object.entries(wellnessMap)) {
      const matchCount = mapping.keywords.filter(keyword => 
        lowerIngredient.includes(keyword.toLowerCase()) ||
        keyword.toLowerCase().includes(lowerIngredient)
      ).length;
      
      categoryScores[category] = (categoryScores[category] || 0) + matchCount;
    }
  }
  
  // Sort categories by score
  const sortedCategories = Object.entries(categoryScores)
    .filter(([_, score]) => score > 0)
    .sort(([_, a], [__, b]) => b - a);
  
  // Default to carbs if no matches (most common macronutrient)
  const primaryCategory = sortedCategories[0]?.[0] || 'carbs';
  const secondaryCategory = sortedCategories[1]?.[0];
  
  const primaryMapping = wellnessMap[primaryCategory];
  const secondaryMapping = secondaryCategory ? wellnessMap[secondaryCategory] : null;
  
  // Calculate confidence based on ingredient matches
  const totalIngredients = ingredients.length;
  const matchedIngredients = sortedCategories[0]?.[1] || 0;
  const confidence = Math.min(0.9, (matchedIngredients / totalIngredients) * 2);
  
  // Use primary for workout, secondary (if available) for stress relief
  return {
    primaryCategory,
    secondaryCategory,
    workoutRecommendation: primaryMapping,
    stressReliefRecommendation: secondaryMapping || primaryMapping,
    confidence: Math.max(0.6, confidence) // Minimum 60% confidence
  };
}

export function analyzeMacronutrientsForWellness(macros: {
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
}): {
  dominantMacro: string;
  workoutRecommendation: WellnessMapping;
  stressReliefRecommendation: WellnessMapping;
  confidence: number;
} {
  const { protein = 0, carbs = 0, fat = 0, fiber = 0 } = macros;
  
  // Determine dominant macronutrient
  let dominantMacro = 'carbs';
  let maxValue = carbs;
  
  if (protein > maxValue) {
    dominantMacro = 'protein';
    maxValue = protein;
  }
  
  if (fat > maxValue) {
    dominantMacro = 'omega3'; // Assume healthy fats
    maxValue = fat;
  }
  
  if (fiber > 10) {
    dominantMacro = 'fiber'; // High fiber gets priority
  }
  
  const workoutMapping = wellnessMap[dominantMacro];
  
  // Choose complementary stress relief based on secondary macro
  let stressReliefCategory = dominantMacro;
  if (dominantMacro === 'protein' && carbs > 20) {
    stressReliefCategory = 'carbs'; // Balance high protein with calming carbs
  } else if (dominantMacro === 'carbs' && protein > 15) {
    stressReliefCategory = 'protein'; // Balance carbs with energizing protein
  }
  
  const stressMapping = wellnessMap[stressReliefCategory];
  
  // Calculate confidence based on how dominant the macro is
  const total = protein + carbs + fat + fiber;
  const confidence = total > 0 ? Math.min(0.9, maxValue / total + 0.4) : 0.7;
  
  return {
    dominantMacro,
    workoutRecommendation: workoutMapping,
    stressReliefRecommendation: stressMapping,
    confidence: Math.max(0.6, confidence)
  };
}

// Enhanced meal analysis that combines ingredients and macros
export function generateWellnessRecommendations(meals: any[]): {
  workoutRecommendation: {
    type: 'workout';
    title: string;
    description: string;
    reason: string;
    duration: number;
    intensity: 'low' | 'medium' | 'high';
    category: string;
    confidence: number;
  };
  stressReliefTip: {
    type: 'meditation' | 'lifestyle';
    title: string;
    description: string;
    reason: string;
    duration: number;
    intensity: 'low' | 'medium' | 'high';
    confidence: number;
  };
} {
  if (!meals || meals.length === 0) {
    // Default recommendations
    return {
      workoutRecommendation: {
        type: 'workout',
        title: wellnessMap.carbs.workout,
        description: wellnessMap.carbs.workoutDescription,
        reason: wellnessMap.carbs.scientificReason,
        duration: wellnessMap.carbs.workoutDuration,
        intensity: wellnessMap.carbs.workoutIntensity,
        category: 'carbs',
        confidence: 0.7
      },
      stressReliefTip: {
        type: 'lifestyle',
        title: wellnessMap.carbs.stressTip,
        description: wellnessMap.carbs.stressTipDescription,
        reason: wellnessMap.carbs.scientificReason,
        duration: wellnessMap.carbs.stressTipDuration,
        intensity: 'low',
        confidence: 0.7
      }
    };
  }
  
  // Collect all ingredients from meals
  const allIngredients = meals.flatMap(meal => meal.ingredients || []);
  
  // Collect nutrition info
  const totalNutrition = meals.reduce((total, meal) => {
    const nutrition = meal.nutritionInfo || {};
    return {
      protein: (total.protein || 0) + (nutrition.protein || 0),
      carbs: (total.carbs || 0) + (nutrition.carbs || 0),
      fat: (total.fat || 0) + (nutrition.fat || 0),
      fiber: (total.fiber || 0) + (nutrition.fiber || 0),
    };
  }, {});
  
  // Analyze both ingredients and macros
  const ingredientAnalysis = analyzeIngredientsForWellness(allIngredients);
  const macroAnalysis = analyzeMacronutrientsForWellness(totalNutrition);
  
  // Combine analyses (prefer ingredient analysis if confidence is higher)
  const useIngredientAnalysis = ingredientAnalysis.confidence >= macroAnalysis.confidence;
  const workoutMapping = useIngredientAnalysis ? 
    ingredientAnalysis.workoutRecommendation : 
    macroAnalysis.workoutRecommendation;
  const stressMapping = useIngredientAnalysis ? 
    ingredientAnalysis.stressReliefRecommendation : 
    macroAnalysis.stressReliefRecommendation;
  
  const finalConfidence = Math.max(ingredientAnalysis.confidence, macroAnalysis.confidence);
  
  return {
    workoutRecommendation: {
      type: 'workout',
      title: workoutMapping.workout,
      description: workoutMapping.workoutDescription,
      reason: workoutMapping.scientificReason,
      duration: workoutMapping.workoutDuration,
      intensity: workoutMapping.workoutIntensity,
      category: useIngredientAnalysis ? ingredientAnalysis.primaryCategory : macroAnalysis.dominantMacro,
      confidence: finalConfidence
    },
    stressReliefTip: {
      type: stressMapping.stressTip.toLowerCase().includes('meditation') ? 'meditation' : 'lifestyle',
      title: stressMapping.stressTip,
      description: stressMapping.stressTipDescription,
      reason: stressMapping.scientificReason,
      duration: stressMapping.stressTipDuration,
      intensity: 'low',
      confidence: finalConfidence
    }
  };
}