import { useState } from "react";
import { DollarSign, Users, Calendar, Store, Sparkles, Settings, Clock, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DietaryPreferences } from "./dietary-preferences";
import { type MealPlanRequest } from "@shared/schema";

interface BudgetFormProps {
  onSubmit: (data: MealPlanRequest) => void;
  isLoading: boolean;
}

export function BudgetForm({ onSubmit, isLoading }: BudgetFormProps) {
  const [budget, setBudget] = useState(100);
  const [people, setPeople] = useState(4);
  const [days, setDays] = useState(7);
  const [store, setStore] = useState<string>("");
  const [allergies, setAllergies] = useState<string[]>([]);
  const [dislikes, setDislikes] = useState<string[]>([]);
  const [dietType, setDietType] = useState<string>("");
  const [calorieGoal, setCalorieGoal] = useState<number>(2000);
  const [activityLevel, setActivityLevel] = useState<string>("moderate");
  const [maxCookingTime, setMaxCookingTime] = useState<number>(60);
  const [skillLevel, setSkillLevel] = useState<string>("intermediate");
  const [showPreferences, setShowPreferences] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      budget,
      people,
      days,
      store: store && store !== "any" ? store : undefined,
      allergies: allergies.length > 0 ? allergies : undefined,
      dislikes: dislikes.length > 0 ? dislikes : undefined,
      dietType: dietType || undefined,
      calorieGoal: calorieGoal !== 2000 ? calorieGoal : undefined,
      activityLevel: activityLevel !== "moderate" ? activityLevel : undefined,
      maxCookingTime: maxCookingTime !== 60 ? maxCookingTime : undefined,
      skillLevel: skillLevel !== "intermediate" ? (skillLevel as 'beginner' | 'intermediate' | 'advanced') : undefined,
    });
  };

  const budgetPerPersonPerDay = budget / (people * days);
  const budgetPerMeal = budgetPerPersonPerDay / 3;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Plan Your Budget</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
            <DollarSign className="inline mr-2 h-4 w-4 text-primary" />
            Weekly Budget
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <Input
              type="number"
              id="budget"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              min="20"
              max="500"
              className="pl-8 text-lg font-semibold"
              placeholder="100"
              data-testid="input-budget"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="people" className="block text-sm font-medium text-gray-700 mb-2">
            <Users className="inline mr-2 h-4 w-4 text-primary" />
            Number of People
          </Label>
          <Select value={people.toString()} onValueChange={(value) => setPeople(Number(value))}>
            <SelectTrigger data-testid="select-people">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Person</SelectItem>
              <SelectItem value="2">2 People</SelectItem>
              <SelectItem value="3">3 People</SelectItem>
              <SelectItem value="4">4 People</SelectItem>
              <SelectItem value="5">5 People</SelectItem>
              <SelectItem value="6">6+ People</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="days" className="block text-sm font-medium text-gray-700 mb-2">
            <Calendar className="inline mr-2 h-4 w-4 text-primary" />
            Number of Days
          </Label>
          <Select value={days.toString()} onValueChange={(value) => setDays(Number(value))}>
            <SelectTrigger data-testid="select-days">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 Days</SelectItem>
              <SelectItem value="5">5 Days</SelectItem>
              <SelectItem value="7">7 Days (1 Week)</SelectItem>
              <SelectItem value="14">14 Days (2 Weeks)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="store" className="block text-sm font-medium text-gray-700 mb-2">
            <Store className="inline mr-2 h-4 w-4 text-primary" />
            Preferred Store (Optional)
          </Label>
          <Select value={store} onValueChange={setStore}>
            <SelectTrigger data-testid="select-store">
              <SelectValue placeholder="Any Store" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Store</SelectItem>
              <SelectItem value="walmart">Walmart</SelectItem>
              <SelectItem value="kroger">Kroger</SelectItem>
              <SelectItem value="aldi">Aldi</SelectItem>
              <SelectItem value="target">Target</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Time + Skill Filters Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div>
            <Label htmlFor="cookingTime" className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="inline mr-2 h-4 w-4 text-blue-600" />
              Max Cooking Time
            </Label>
            <Select value={maxCookingTime.toString()} onValueChange={(value) => setMaxCookingTime(Number(value))}>
              <SelectTrigger data-testid="select-cooking-time">
                <SelectValue placeholder="Choose time limit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">15 minutes (Quick meals)</SelectItem>
                <SelectItem value="30">30 minutes (Fast cooking)</SelectItem>
                <SelectItem value="45">45 minutes (Moderate prep)</SelectItem>
                <SelectItem value="60">1 hour (Standard)</SelectItem>
                <SelectItem value="90">1.5 hours (More involved)</SelectItem>
                <SelectItem value="180">No time limit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="skillLevel" className="block text-sm font-medium text-gray-700 mb-2">
              <ChefHat className="inline mr-2 h-4 w-4 text-blue-600" />
              Cooking Skill Level
            </Label>
            <Select value={skillLevel} onValueChange={setSkillLevel}>
              <SelectTrigger data-testid="select-skill-level">
                <SelectValue placeholder="Choose your skill level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">🔥 Beginner (Microwave, no-cook)</SelectItem>
                <SelectItem value="intermediate">👨‍🍳 Intermediate (One-pan, simple)</SelectItem>
                <SelectItem value="advanced">⭐ Advanced (Any recipe)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {skillLevel === "beginner" && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              <strong>Perfect for beginners!</strong> We'll focus on microwave meals, no-cook options, and simple one-pan dishes.
            </p>
          </div>
        )}

        {maxCookingTime <= 15 && (
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-800">
              <strong>15-minute meals:</strong> Quick salads, sandwiches, microwave recipes, and instant options.
            </p>
          </div>
        )}

        {/* Dietary Preferences Collapsible Section */}
        <Collapsible open={showPreferences} onOpenChange={setShowPreferences}>
          <CollapsibleTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-between"
              data-testid="button-toggle-preferences"
            >
              <span className="flex items-center">
                <Settings className="mr-2 h-4 w-4" />
                Dietary Preferences
                {(allergies.length > 0 || dislikes.length > 0 || dietType || calorieGoal !== 2000 || activityLevel !== "moderate" || maxCookingTime !== 60 || skillLevel !== "intermediate") && (
                  <span className="ml-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
                    {(allergies.length + dislikes.length + (dietType ? 1 : 0) + (calorieGoal !== 2000 ? 1 : 0) + (activityLevel !== "moderate" ? 1 : 0) + (maxCookingTime !== 60 ? 1 : 0) + (skillLevel !== "intermediate" ? 1 : 0))}
                  </span>
                )}
              </span>
              <span className="text-xs text-gray-500">
                {showPreferences ? 'Hide' : 'Show'}
              </span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4">
            <DietaryPreferences
              allergies={allergies}
              dislikes={dislikes}
              dietType={dietType}
              calorieGoal={calorieGoal}
              activityLevel={activityLevel}
              onAllergiesChange={setAllergies}
              onDislikesChange={setDislikes}
              onDietTypeChange={setDietType}
              onCalorieGoalChange={setCalorieGoal}
              onActivityLevelChange={setActivityLevel}
            />
          </CollapsibleContent>
        </Collapsible>

        <Button 
          type="submit" 
          className="w-full bg-primary text-white py-3 hover:bg-primary/90 font-semibold text-lg"
          disabled={isLoading}
          data-testid="button-generate-meal-plan"
        >
          {isLoading ? (
            <>
              <Sparkles className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Meal Plan
            </>
          )}
        </Button>
      </form>

      <Card className="mt-6 bg-gray-50">
        <CardContent className="p-4">
          <h4 className="font-medium text-gray-900 mb-2">Budget Breakdown</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Per Person/Day:</span>
              <span className="font-medium" data-testid="text-budget-per-person-day">
                ${budgetPerPersonPerDay.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Per Meal:</span>
              <span className="font-medium" data-testid="text-budget-per-meal">
                ${budgetPerMeal.toFixed(2)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
