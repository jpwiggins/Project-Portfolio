import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Dumbbell, Apple, Target, Clock, Zap, TrendingUp, Camera } from 'lucide-react';
import { VisualMealAnalyzer } from "./visual-meal-analyzer";

interface WorkoutPlan {
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

interface NutritionAdvice {
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

interface ExerciseDetails {
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

interface AIFitnessDashboardProps {
  currentMeals: string[];
  userId: string;
}

export function AIFitnessDashboard({ currentMeals, userId }: AIFitnessDashboardProps) {
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [nutritionAdvice, setNutritionAdvice] = useState<NutritionAdvice | null>(null);
  const [exerciseDetails, setExerciseDetails] = useState<Record<string, ExerciseDetails>>({});
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<string[]>([]);
  const [aiRecommendations, setAiRecommendations] = useState<any>(null);
  const [showCustomizer, setShowCustomizer] = useState(false);
  const { toast } = useToast();

  const generateComprehensivePlan = async (userPreferences = {}) => {
    setLoading(true);
    try {
      // Get advanced wellness recommendations with custom workout planning
      const advancedResponse = await fetch('/api/ai-fitness/advanced-wellness-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, userPreferences })
      });

      if (advancedResponse.ok) {
        const advancedData = await advancedResponse.json();
        setWorkoutPlan(advancedData.customWorkoutPlan);
        setNutritionAdvice(advancedData.nutritionAdvice);
        setExerciseDetails(advancedData.exerciseDetails || {});
        setInsights(advancedData.personalizedInsights || []);
        setAiRecommendations(advancedData.aiRecommendations);

        toast({
          title: "Advanced AI Plan Generated!",
          description: `Custom ${advancedData.customWorkoutPlan?.duration_weeks || 6}-week plan created based on your meal patterns and preferences.`,
        });
        return;
      }

      // Fallback to enhanced workout plan
      const enhancedResponse = await fetch('/api/ai-fitness/enhanced-workout-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });

      if (enhancedResponse.ok) {
        const enhancedData = await enhancedResponse.json();
        setWorkoutPlan(enhancedData.workoutPlan);
        setExerciseDetails(enhancedData.exerciseDetails || {});

        // Get nutrition advice separately
        const nutritionResponse = await fetch('/api/ai-fitness/nutrition-advice', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
        });

        if (nutritionResponse.ok) {
          const nutritionData = await nutritionResponse.json();
          setNutritionAdvice(nutritionData);
        }

        toast({
          title: "AI Plan Generated!",
          description: "Your personalized fitness and nutrition plan with detailed exercise guides is ready.",
        });
        return;
      }

      throw new Error('All AI fitness services are unavailable');
    } catch (error) {
      console.error('Error generating AI plan:', error);
      toast({
        title: "Service Unavailable",
        description: "AI fitness service is temporarily unavailable. Please ensure RapidAPI key is configured.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateCustomPlan = async (customPreferences: any) => {
    await generateComprehensivePlan(customPreferences);
    setShowCustomizer(false);
  };

  useEffect(() => {
    if (currentMeals.length > 0) {
      generateComprehensivePlan();
    }
  }, [currentMeals, userId]);

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-orange-500" />
            Generating AI Fitness Plan...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="animate-pulse bg-gray-200 h-4 rounded w-3/4"></div>
            <div className="animate-pulse bg-gray-200 h-4 rounded w-1/2"></div>
            <div className="animate-pulse bg-gray-200 h-20 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!workoutPlan && !nutritionAdvice) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-orange-500" />
            AI Fitness & Nutrition Coach
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">
              Get professional workout plans and nutrition advice based on your meal patterns
            </p>
            <Button onClick={generateComprehensivePlan} className="bg-orange-500 hover:bg-orange-600">
              <Zap className="w-4 h-4 mr-2" />
              Generate AI Fitness Plan
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* AI Insights */}
      {insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {insights.map((insight, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                  <p className="text-sm text-gray-700">{insight}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Recommendations Summary */}
      {aiRecommendations && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              AI Analysis & Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-blue-50 p-3 rounded border">
                <div className="font-medium text-blue-600">Suggested Goal</div>
                <div className="text-gray-700">{aiRecommendations.suggestedGoal}</div>
              </div>
              <div className="bg-green-50 p-3 rounded border">
                <div className="font-medium text-green-600">Fitness Level</div>
                <div className="text-gray-700">{aiRecommendations.suggestedLevel}</div>
              </div>
              <div className="bg-purple-50 p-3 rounded border">
                <div className="font-medium text-purple-600">Primary Focus</div>
                <div className="text-gray-700 capitalize">{aiRecommendations.mealPatternAnalysis?.primaryNutrientFocus}</div>
              </div>
            </div>
            {aiRecommendations.customGoals?.length > 0 && (
              <div className="mt-4">
                <div className="font-medium text-sm mb-2">Custom Goals:</div>
                <div className="flex flex-wrap gap-1">
                  {aiRecommendations.customGoals.map((goal: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {goal}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="workout" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="workout" className="flex items-center gap-2">
            <Dumbbell className="w-4 h-4" />
            Workout Plan
          </TabsTrigger>
          <TabsTrigger value="nutrition" className="flex items-center gap-2">
            <Apple className="w-4 h-4" />
            Nutrition Guide
          </TabsTrigger>
          <TabsTrigger value="visual-analysis" className="flex items-center gap-2">
            <Camera className="w-4 h-4" />
            Meal Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workout" className="space-y-4">
          {workoutPlan ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{workoutPlan.goal} Plan</span>
                  <Badge variant="outline">{workoutPlan.duration_weeks} weeks</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-medium">Weekly Schedule</span>
                    </div>
                    <p className="text-sm text-gray-600">{workoutPlan.weekly_schedule.length} days/week</p>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="w-4 h-4 text-orange-500" />
                      <span className="text-sm font-medium">Calories/Session</span>
                    </div>
                    <p className="text-sm text-gray-600">{workoutPlan.estimated_calories_burned}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Weekly Schedule:</h4>
                  {workoutPlan.weekly_schedule.map((day, index) => (
                    <Card key={index} className="bg-gray-50">
                      <CardContent className="p-3">
                        <h5 className="font-medium text-sm mb-2">{day.day}</h5>
                        <div className="space-y-2">
                          {day.exercises.slice(0, 3).map((exercise, exerciseIndex) => {
                            const hasDetails = exerciseDetails[exercise.name];
                            return (
                              <div 
                                key={exerciseIndex} 
                                className={`bg-white p-2 rounded border transition-colors ${
                                  hasDetails ? 'hover:bg-blue-50 cursor-pointer' : ''
                                }`}
                                onClick={() => hasDetails && setSelectedExercise(exercise.name)}
                              >
                                <div className="flex justify-between items-start mb-1">
                                  <span className="font-medium text-sm flex items-center gap-1">
                                    {exercise.name}
                                    {hasDetails && (
                                      <Badge variant="outline" className="text-xs px-1 py-0">
                                        Details
                                      </Badge>
                                    )}
                                  </span>
                                  <Badge variant="secondary" className="text-xs">
                                    {exercise.sets} × {exercise.reps}
                                  </Badge>
                                </div>
                                <p className="text-xs text-gray-600 truncate">{exercise.instructions}</p>
                                {hasDetails && (
                                  <div className="mt-1 flex flex-wrap gap-1">
                                    {exerciseDetails[exercise.name].muscle_groups.slice(0, 2).map((muscle, idx) => (
                                      <Badge key={idx} variant="outline" className="text-xs px-1 py-0">
                                        {muscle}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                          {day.exercises.length > 3 && (
                            <p className="text-xs text-gray-500 text-center">
                              +{day.exercises.length - 3} more exercises
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {workoutPlan.tips.length > 0 && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Pro Tips:</h4>
                    <ul className="space-y-1">
                      {workoutPlan.tips.slice(0, 3).map((tip, index) => (
                        <li key={index} className="text-xs text-gray-600 flex items-start gap-1">
                          <span className="text-blue-500">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-500">No workout plan available</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="nutrition" className="space-y-4">
          {nutritionAdvice ? (
            <Card>
              <CardHeader>
                <CardTitle>Nutrition Guidance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-green-500" />
                    <span className="font-medium">Daily Calorie Target</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">{nutritionAdvice.daily_calories}</p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Macronutrient Breakdown:</h4>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Protein</span>
                        <span>{nutritionAdvice.macronutrient_breakdown.protein_percentage}%</span>
                      </div>
                      <Progress value={nutritionAdvice.macronutrient_breakdown.protein_percentage} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Carbs</span>
                        <span>{nutritionAdvice.macronutrient_breakdown.carbs_percentage}%</span>
                      </div>
                      <Progress value={nutritionAdvice.macronutrient_breakdown.carbs_percentage} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Fats</span>
                        <span>{nutritionAdvice.macronutrient_breakdown.fats_percentage}%</span>
                      </div>
                      <Progress value={nutritionAdvice.macronutrient_breakdown.fats_percentage} className="h-2" />
                    </div>
                  </div>
                </div>

                {nutritionAdvice.meal_suggestions.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Meal Suggestions:</h4>
                    <div className="grid gap-3">
                      {nutritionAdvice.meal_suggestions.map((meal, index) => (
                        <Card key={index} className="bg-gray-50">
                          <CardContent className="p-3">
                            <div className="flex justify-between items-center mb-2">
                              <h5 className="font-medium text-sm capitalize">{meal.meal_type}</h5>
                              <Badge variant="outline">{meal.calories} cal</Badge>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {meal.foods.slice(0, 4).map((food, foodIndex) => (
                                <Badge key={foodIndex} variant="secondary" className="text-xs">
                                  {food}
                                </Badge>
                              ))}
                              {meal.foods.length > 4 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{meal.foods.length - 4}
                                </Badge>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {nutritionAdvice.hydration_advice && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Hydration:</h4>
                    <p className="text-sm text-gray-600">{nutritionAdvice.hydration_advice}</p>
                  </div>
                )}

                {nutritionAdvice.tips.length > 0 && (
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <h4 className="font-medium text-sm mb-2">Nutrition Tips:</h4>
                    <ul className="space-y-1">
                      {nutritionAdvice.tips.slice(0, 3).map((tip, index) => (
                        <li key={index} className="text-xs text-gray-600 flex items-start gap-1">
                          <span className="text-yellow-500">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-500">No nutrition advice available</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="visual-analysis" className="space-y-4">
          <VisualMealAnalyzer userId={userId} />
        </TabsContent>
      </Tabs>

      <div className="flex justify-center gap-2">
        <Button 
          onClick={() => generateComprehensivePlan()} 
          variant="outline" 
          size="sm"
          disabled={loading}
        >
          {loading ? "Generating..." : "Refresh AI Plan"}
        </Button>
        <Button 
          onClick={() => setShowCustomizer(!showCustomizer)} 
          variant="secondary" 
          size="sm"
          disabled={loading}
        >
          Customize Plan
        </Button>
      </div>

      {/* Custom Plan Configurator */}
      {showCustomizer && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Customize Your Fitness Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Fitness Goal</label>
                  <select className="w-full mt-1 p-2 border rounded text-sm">
                    <option>Build muscle</option>
                    <option>Lose weight</option>
                    <option>Improve overall fitness</option>
                    <option>General fitness</option>
                    <option>Strength training</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Fitness Level</label>
                  <select className="w-full mt-1 p-2 border rounded text-sm">
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Workout Preferences</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {['HIIT', 'Yoga', 'Strength Training', 'Cardio', 'Full Body', 'Calisthenics'].map(pref => (
                    <Badge key={pref} variant="outline" className="cursor-pointer hover:bg-blue-100 text-xs">
                      {pref}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Health Considerations</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {['Lower back pain', 'Knee issues', 'Shoulder injury', 'None'].map(condition => (
                    <Badge key={condition} variant="outline" className="cursor-pointer hover:bg-orange-100 text-xs">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Days per Week</label>
                  <select className="w-full mt-1 p-2 border rounded text-sm">
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                    <option>6</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Session Duration</label>
                  <select className="w-full mt-1 p-2 border rounded text-sm">
                    <option>30 minutes</option>
                    <option>45 minutes</option>
                    <option>60 minutes</option>
                    <option>90 minutes</option>
                  </select>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={() => generateCustomPlan({})} 
                  className="flex-1"
                  disabled={loading}
                >
                  Generate Custom Plan
                </Button>
                <Button 
                  onClick={() => setShowCustomizer(false)} 
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Exercise Details Modal */}
      {selectedExercise && exerciseDetails[selectedExercise] && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">{selectedExercise}</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedExercise(null)}
                className="h-8 w-8 p-0"
              >
                ×
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {(() => {
                const details = exerciseDetails[selectedExercise];
                return (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-sm mb-2">Muscle Groups</h4>
                        <div className="flex flex-wrap gap-1">
                          {details.muscle_groups.map((muscle, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {muscle}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-2">Equipment</h4>
                        <div className="flex flex-wrap gap-1">
                          {details.equipment_needed.map((equipment, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {equipment}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="text-sm font-medium">Difficulty</div>
                        <div className="text-xs text-gray-600">{details.difficulty_level}</div>
                      </div>
                      <div className="bg-orange-50 p-3 rounded-lg">
                        <div className="text-sm font-medium">Calories/Min</div>
                        <div className="text-xs text-gray-600">{details.calories_burned_per_minute}</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-2">Setup</h4>
                      <p className="text-sm text-gray-700">{details.instructions.setup}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-2">Execution Steps</h4>
                      <ol className="space-y-1">
                        {details.instructions.execution.map((step, idx) => (
                          <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                            <span className="bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>

                    {details.instructions.tips.length > 0 && (
                      <div className="bg-yellow-50 p-3 rounded-lg">
                        <h4 className="font-medium text-sm mb-2">Pro Tips</h4>
                        <ul className="space-y-1">
                          {details.instructions.tips.map((tip, idx) => (
                            <li key={idx} className="text-xs text-gray-600 flex items-start gap-1">
                              <span className="text-yellow-500">•</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {details.safety_precautions.length > 0 && (
                      <div className="bg-red-50 p-3 rounded-lg">
                        <h4 className="font-medium text-sm mb-2">Safety Precautions</h4>
                        <ul className="space-y-1">
                          {details.safety_precautions.map((precaution, idx) => (
                            <li key={idx} className="text-xs text-red-700 flex items-start gap-1">
                              <span className="text-red-500">⚠</span>
                              {precaution}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {details.variations.length > 0 && (
                      <div>
                        <h4 className="font-medium text-sm mb-2">Variations</h4>
                        <div className="space-y-2">
                          {details.variations.map((variation, idx) => (
                            <div key={idx} className="border-l-2 border-gray-200 pl-3">
                              <div className="font-medium text-xs">{variation.name}</div>
                              <div className="text-xs text-gray-600">{variation.description}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                );
              })()}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}