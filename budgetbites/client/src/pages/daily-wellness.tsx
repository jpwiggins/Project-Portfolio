import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Heart, 
  Clock, 
  Users, 
  Flame, 
  ChefHat, 
  Dumbbell,
  Brain,
  Moon,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Utensils,
  Timer
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface RecipeCard {
  id: string;
  name: string;
  calories: number;
  prepTime: number;
  servings: number;
  ingredients: string[];
  instructions: string[];
  image?: string;
  category: "breakfast" | "lunch" | "dinner";
}

interface WorkoutPlan {
  id: string;
  name: string;
  duration: number;
  exercises: {
    name: string;
    sets: number;
    reps: string;
    restTime: number;
    instructions: string;
  }[];
  totalCaloriesBurn: number;
  difficulty: "beginner" | "intermediate" | "advanced";
}

interface MindfulnessSession {
  id: string;
  title: string;
  description: string;
  duration: number;
  type: "breathing" | "meditation" | "relaxation";
  audioGuided: boolean;
}

export default function DailyWellness() {
  const { toast } = useToast();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedMealTab, setSelectedMealTab] = useState<"breakfast" | "lunch" | "dinner">("breakfast");
  const [isMindfulnessPlaying, setIsMindfulnessPlaying] = useState(false);
  const [mindfulnessTimer, setMindfulnessTimer] = useState(0);
  const [breathingPhase, setBreathingPhase] = useState<"inhale" | "hold" | "exhale">("inhale");
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  // Fetch daily wellness data
  const { data: dailyData, isLoading } = useQuery({
    queryKey: ["/api/daily-wellness", currentDate.toDateString()],
    refetchOnWindowFocus: false,
  });

  const { data: motivationalQuote } = useQuery({
    queryKey: ["/api/wellness/quote"],
    refetchOnWindowFocus: false,
  });

  // Start AI-guided mindfulness session
  const startMindfulnessMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/wellness/mindfulness", {
        meals: (dailyData as any)?.meals || [],
        userMood: "neutral",
        timeOfDay: new Date().getHours() > 18 ? "evening" : "day"
      });
      return response;
    },
    onSuccess: (data: any) => {
      setIsMindfulnessPlaying(true);
      toast({
        title: "Mindfulness Session Started",
        description: `AI recommends: ${data?.recommendedSession || "breathing exercises"}`,
      });
    },
  });

  // Mark task as completed
  const toggleTaskCompletion = (taskId: string) => {
    const newCompleted = new Set(completedTasks);
    if (newCompleted.has(taskId)) {
      newCompleted.delete(taskId);
    } else {
      newCompleted.add(taskId);
    }
    setCompletedTasks(newCompleted);
  };

  // Breathing exercise timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isMindfulnessPlaying) {
      interval = setInterval(() => {
        setMindfulnessTimer(prev => prev + 1);
        
        // Breathing pattern: 4s inhale, 4s hold, 6s exhale
        const cycleTime = mindfulnessTimer % 14;
        if (cycleTime < 4) setBreathingPhase("inhale");
        else if (cycleTime < 8) setBreathingPhase("hold");
        else setBreathingPhase("exhale");
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isMindfulnessPlaying, mindfulnessTimer]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-lg text-gray-600">Preparing your daily wellness plan...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const todayMeals: RecipeCard[] = (dailyData as any)?.meals || [
    {
      id: "breakfast-1",
      name: "Protein Power Bowl",
      calories: 450,
      prepTime: 15,
      servings: 1,
      category: "breakfast",
      ingredients: [
        "2 large eggs",
        "1/2 cup quinoa (cooked)",
        "1 avocado, sliced",
        "1 cup spinach",
        "2 tbsp greek yogurt",
        "1 tsp olive oil",
        "Salt and pepper to taste"
      ],
      instructions: [
        "Cook quinoa according to package directions and set aside to cool.",
        "Heat olive oil in a pan over medium heat.",
        "Scramble the eggs until fluffy and cooked through.",
        "Arrange spinach in a bowl as the base.",
        "Add cooked quinoa on one side of the bowl.",
        "Place scrambled eggs next to quinoa.",
        "Add sliced avocado and a dollop of greek yogurt.",
        "Season with salt and pepper. Serve immediately."
      ]
    },
    {
      id: "lunch-1",
      name: "Mediterranean Chicken Wrap",
      calories: 520,
      prepTime: 20,
      servings: 1,
      category: "lunch",
      ingredients: [
        "1 whole wheat tortilla",
        "4 oz grilled chicken breast",
        "2 tbsp hummus",
        "1/4 cup diced cucumber",
        "1/4 cup cherry tomatoes",
        "2 tbsp red onion, diced",
        "2 tbsp feta cheese",
        "1 tbsp olive oil",
        "Fresh lettuce leaves"
      ],
      instructions: [
        "Season and grill chicken breast until cooked through. Let cool and slice.",
        "Warm the tortilla slightly in a dry pan.",
        "Spread hummus evenly across the tortilla.",
        "Layer lettuce leaves on top of hummus.",
        "Add sliced chicken, cucumber, tomatoes, and red onion.",
        "Sprinkle feta cheese over the filling.",
        "Drizzle with olive oil.",
        "Roll tightly and cut in half. Serve immediately."
      ]
    },
    {
      id: "dinner-1",
      name: "Baked Salmon with Roasted Vegetables",
      calories: 580,
      prepTime: 35,
      servings: 1,
      category: "dinner",
      ingredients: [
        "6 oz salmon fillet",
        "1 cup broccoli florets",
        "1 medium sweet potato, cubed",
        "1/2 red bell pepper, sliced",
        "2 tbsp olive oil",
        "1 lemon, juiced",
        "2 cloves garlic, minced",
        "Fresh herbs (dill or parsley)",
        "Salt and pepper to taste"
      ],
      instructions: [
        "Preheat oven to 425°F (220°C).",
        "Toss vegetables with 1 tbsp olive oil, salt, and pepper.",
        "Spread vegetables on a baking sheet and roast for 20 minutes.",
        "Season salmon with salt, pepper, and minced garlic.",
        "Heat remaining olive oil in an oven-safe pan.",
        "Sear salmon skin-side up for 3 minutes.",
        "Flip and transfer pan to oven for 8-10 minutes.",
        "Squeeze lemon juice over salmon and garnish with fresh herbs.",
        "Serve with roasted vegetables."
      ]
    }
  ];

  const todayWorkout: WorkoutPlan = (dailyData as any)?.workout || {
    id: "workout-1",
    name: "Full Body Strength & Cardio",
    duration: 45,
    difficulty: "intermediate",
    totalCaloriesBurn: 350,
    exercises: [
      {
        name: "Push-ups",
        sets: 3,
        reps: "12-15",
        restTime: 60,
        instructions: "Keep your body in a straight line, lower chest to floor, push back up"
      },
      {
        name: "Bodyweight Squats",
        sets: 3,
        reps: "15-20",
        restTime: 60,
        instructions: "Lower until thighs parallel to floor, keep chest up, drive through heels"
      },
      {
        name: "Plank",
        sets: 3,
        reps: "30-45 seconds",
        restTime: 60,
        instructions: "Hold straight body position, engage core, breathe normally"
      },
      {
        name: "Mountain Climbers",
        sets: 3,
        reps: "20 per leg",
        restTime: 60,
        instructions: "Alternate bringing knees to chest rapidly, maintain plank position"
      }
    ]
  };

  const mindfulnessSession: MindfulnessSession = {
    id: "mindfulness-1",
    title: "Evening Wind-Down Breathing",
    description: "Based on your meals today, this breathing exercise will help reduce stress and prepare for restful sleep",
    duration: 10,
    type: "breathing",
    audioGuided: true
  };

  const currentMeal = todayMeals.find(meal => meal.category === selectedMealTab);
  const totalDayCalories = todayMeals.reduce((sum, meal) => sum + meal.calories, 0);
  const completionPercentage = (completedTasks.size / (todayMeals.length + 1 + 1)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Page Header with Date and Progress */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <span>{currentDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Your Daily Wellness Plan
          </h1>
          
          <div className="max-w-md mx-auto">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Daily Progress</span>
              <span>{Math.round(completionPercentage)}% Complete</span>
            </div>
            <Progress value={completionPercentage} className="h-3" />
          </div>
        </div>

        {/* Motivational Quote */}
        <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
          <CardContent className="p-8 text-center">
            <div className="text-2xl font-semibold mb-4">
              "{(motivationalQuote as any)?.text || "Every meal is a new opportunity to nourish your body, every workout is a step towards strength, and every breath is a moment of peace."}"
            </div>
            <p className="text-purple-100">
              — {(motivationalQuote as any)?.author || "Your Wellness Coach"}
            </p>
          </CardContent>
        </Card>

        {/* Today's Meals - Recipe Cards */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center">Today's Meals</h2>
          
          {/* Meal Navigation Tabs */}
          <div className="flex justify-center">
            <div className="bg-white rounded-lg p-1 shadow-lg">
              {["breakfast", "lunch", "dinner"].map((meal) => (
                <Button
                  key={meal}
                  onClick={() => setSelectedMealTab(meal as any)}
                  variant={selectedMealTab === meal ? "default" : "ghost"}
                  className={`capitalize ${selectedMealTab === meal ? 'bg-blue-600 text-white' : 'text-gray-600'}`}
                >
                  {meal}
                </Button>
              ))}
            </div>
          </div>

          {/* Current Meal Recipe Card */}
          {currentMeal && (
            <Card className="max-w-4xl mx-auto shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <ChefHat className="h-6 w-6" />
                    {currentMeal.name}
                  </CardTitle>
                  <Button
                    onClick={() => toggleTaskCompletion(currentMeal.id)}
                    variant={completedTasks.has(currentMeal.id) ? "default" : "outline"}
                    size="sm"
                  >
                    <CheckCircle2 className={`h-4 w-4 ${completedTasks.has(currentMeal.id) ? 'text-white' : 'text-gray-400'}`} />
                    {completedTasks.has(currentMeal.id) ? "Completed" : "Mark Done"}
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Flame className="h-4 w-4" />
                    {currentMeal.calories} calories
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {currentMeal.prepTime} minutes
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Serves {currentMeal.servings}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Ingredients */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Utensils className="h-5 w-5" />
                      Ingredients
                    </h3>
                    <ul className="space-y-2">
                      {currentMeal.ingredients.map((ingredient, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-700">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                          {ingredient}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Instructions */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Timer className="h-5 w-5" />
                      Instructions
                    </h3>
                    <ol className="space-y-3">
                      {currentMeal.instructions.map((instruction, index) => (
                        <li key={index} className="flex gap-3 text-gray-700">
                          <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0">
                            {index + 1}
                          </span>
                          <span>{instruction}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Daily Nutrition Summary */}
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center">Daily Nutrition Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">{totalDayCalories}</div>
                  <div className="text-sm text-gray-600">Total Calories</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{todayMeals.length}</div>
                  <div className="text-sm text-gray-600">Meals</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">Balanced</div>
                  <div className="text-sm text-gray-600">Nutrition</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Workout */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center">Today's Workout</h2>
          
          <Card className="max-w-4xl mx-auto shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Dumbbell className="h-6 w-6" />
                  {todayWorkout.name}
                </CardTitle>
                <Button
                  onClick={() => toggleTaskCompletion("workout")}
                  variant={completedTasks.has("workout") ? "default" : "outline"}
                  size="sm"
                >
                  <CheckCircle2 className={`h-4 w-4 ${completedTasks.has("workout") ? 'text-white' : 'text-gray-400'}`} />
                  {completedTasks.has("workout") ? "Completed" : "Mark Done"}
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {todayWorkout.duration} minutes
                </div>
                <div className="flex items-center gap-1">
                  <Flame className="h-4 w-4" />
                  ~{todayWorkout.totalCaloriesBurn} calories burned
                </div>
                <Badge variant="outline" className="capitalize">
                  {todayWorkout.difficulty}
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid gap-4">
                {todayWorkout.exercises.map((exercise, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-lg">{exercise.name}</h4>
                      <Badge variant="secondary">
                        {exercise.sets} sets × {exercise.reps}
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{exercise.instructions}</p>
                    <div className="text-xs text-gray-500">
                      Rest: {exercise.restTime}s between sets
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Meal Prep Section */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center">Meal Prep for Today</h2>
          
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Smart Prep Tips</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Cook quinoa in bulk for breakfast bowl</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Pre-cut vegetables for dinner while prepping lunch</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Marinate salmon in the morning for maximum flavor</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Time-Saving Order</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>1. Start quinoa cooking</span>
                      <span className="text-gray-500">15 min</span>
                    </div>
                    <div className="flex justify-between">
                      <span>2. Prep all vegetables</span>
                      <span className="text-gray-500">10 min</span>
                    </div>
                    <div className="flex justify-between">
                      <span>3. Marinate salmon</span>
                      <span className="text-gray-500">5 min</span>
                    </div>
                    <div className="flex justify-between">
                      <span>4. Assemble lunch wrap</span>
                      <span className="text-gray-500">10 min</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI-Guided Mindfulness Section */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center">Bedtime Mindfulness</h2>
          
          <Card className="max-w-2xl mx-auto shadow-xl bg-gradient-to-br from-indigo-50 to-purple-50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Brain className="h-6 w-6" />
                  {mindfulnessSession.title}
                </CardTitle>
                <Button
                  onClick={() => toggleTaskCompletion("mindfulness")}
                  variant={completedTasks.has("mindfulness") ? "default" : "outline"}
                  size="sm"
                >
                  <CheckCircle2 className={`h-4 w-4 ${completedTasks.has("mindfulness") ? 'text-white' : 'text-gray-400'}`} />
                  {completedTasks.has("mindfulness") ? "Completed" : "Mark Done"}
                </Button>
              </div>
              <p className="text-gray-600">{mindfulnessSession.description}</p>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Breathing Exercise Visual */}
              <div className="text-center">
                <div className={`w-32 h-32 rounded-full mx-auto mb-6 transition-all duration-1000 ${
                  breathingPhase === "inhale" ? "bg-blue-300 scale-110" :
                  breathingPhase === "hold" ? "bg-purple-300 scale-110" :
                  "bg-green-300 scale-90"
                }`}>
                  <div className="w-full h-full rounded-full flex items-center justify-center text-white font-semibold">
                    <span className="capitalize text-lg">{breathingPhase}</span>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 mb-4">
                  {isMindfulnessPlaying ? (
                    <span>Session time: {Math.floor(mindfulnessTimer / 60)}:{(mindfulnessTimer % 60).toString().padStart(2, '0')}</span>
                  ) : (
                    <span>Press start for AI-guided breathing</span>
                  )}
                </div>
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => {
                    if (isMindfulnessPlaying) {
                      setIsMindfulnessPlaying(false);
                    } else {
                      startMindfulnessMutation.mutate();
                    }
                  }}
                  className="bg-purple-600 hover:bg-purple-700"
                  disabled={startMindfulnessMutation.isPending}
                >
                  {isMindfulnessPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  {isMindfulnessPlaying ? "Pause" : "Start Session"}
                </Button>
                
                <Button
                  onClick={() => {
                    setIsMindfulnessPlaying(false);
                    setMindfulnessTimer(0);
                    setBreathingPhase("inhale");
                  }}
                  variant="outline"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>

              {/* Instructions */}
              <div className="bg-white/70 rounded-lg p-4 space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <Moon className="h-4 w-4" />
                  Breathing Pattern
                </h4>
                <div className="text-sm text-gray-700 space-y-1">
                  <div>🔵 <strong>Inhale</strong> for 4 seconds</div>
                  <div>🟣 <strong>Hold</strong> for 4 seconds</div>
                  <div>🟢 <strong>Exhale</strong> for 6 seconds</div>
                </div>
                <p className="text-xs text-gray-600 mt-3">
                  This 4-4-6 breathing pattern helps activate your parasympathetic nervous system, 
                  promoting relaxation and better sleep quality.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}