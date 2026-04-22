import { Heart, Download, Sun, Moon, AlertTriangle, ThumbsDown, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MealCard } from "./meal-card";
import { type DayMeals, type Meal } from "@shared/schema";

interface MealPlanDisplayProps {
  mealPlan: {
    id: string;
    meals: Meal[];
    totalCost: number;
    savings: number;
    budget: number;
    people: number;
    days: number;
  };
  onSave: () => void;
  onDownload: () => void;
  isSaved: boolean;
  allergies?: string[];
  dislikes?: string[];
  dietType?: string;
}

export function MealPlanDisplay({ mealPlan, onSave, onDownload, isSaved, allergies, dislikes, dietType }: MealPlanDisplayProps) {
  // Group meals by day
  const mealsByDay = groupMealsByDay(mealPlan.meals, mealPlan.days);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            Your {mealPlan.days}-Day Meal Plan
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Total cost: <span className="font-semibold text-primary" data-testid="text-total-cost">
              ${mealPlan.totalCost.toFixed(2)}
            </span>
            {mealPlan.savings > 0 && (
              <>
                {" | "}Under budget by <span className="font-semibold text-green-600" data-testid="text-savings">
                  ${mealPlan.savings.toFixed(2)}
                </span>
              </>
            )}
          </p>
          {(allergies?.length || dislikes?.length || dietType) && (
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-xs text-gray-500">Applied filters:</span>
              {dietType && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800" data-testid={`filter-diet-${dietType}`}>
                  <Leaf className="w-3 h-3 mr-1" />
                  {dietType.charAt(0).toUpperCase() + dietType.slice(1)}
                </span>
              )}
              {allergies?.map((allergy) => (
                <span key={allergy} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800" data-testid={`filter-allergy-${allergy.toLowerCase().replace(/\s+/g, '-')}`}>
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  No {allergy}
                </span>
              ))}
              {dislikes?.map((dislike) => (
                <span key={dislike} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800" data-testid={`filter-dislike-${dislike.toLowerCase().replace(/\s+/g, '-')}`}>
                  <ThumbsDown className="w-3 h-3 mr-1" />
                  No {dislike}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <Button
            variant="outline"
            onClick={onSave}
            className={`flex items-center space-x-2 ${isSaved ? 'text-red-600 border-red-300' : 'text-gray-600 border-gray-300'}`}
            data-testid="button-save-meal-plan"
          >
            <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
            <span>{isSaved ? 'Saved!' : 'Save Plan'}</span>
          </Button>
          <Button 
            onClick={onDownload}
            className="flex items-center space-x-2 bg-primary text-white hover:bg-primary/90"
            data-testid="button-download-list"
          >
            <Download className="h-4 w-4" />
            <span>Download List</span>
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {mealsByDay.map((dayMeals, index) => (
          <DayMealCard key={index} dayMeals={dayMeals} />
        ))}
      </div>
    </div>
  );
}

function DayMealCard({ dayMeals }: { dayMeals: DayMeals }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold text-gray-900" data-testid={`text-day-${dayMeals.day.toLowerCase()}`}>
            {dayMeals.day}
          </h4>
          <span className="text-sm font-medium text-primary" data-testid={`text-day-cost-${dayMeals.day.toLowerCase()}`}>
            ${dayMeals.totalCost.toFixed(2)}
          </span>
        </div>
        
        <div className="grid md:grid-cols-3 gap-4">
          {dayMeals.meals.map((meal, index) => (
            <MealCard key={index} meal={meal} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}



function groupMealsByDay(meals: Meal[], totalDays: number): DayMeals[] {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dayMeals: DayMeals[] = [];

  for (let dayIndex = 0; dayIndex < totalDays; dayIndex++) {
    const dayName = daysOfWeek[dayIndex % 7];
    const dayMealsArray = meals.filter(meal => meal.day === dayName);
    const totalCost = dayMealsArray.reduce((sum, meal) => sum + meal.cost, 0);
    
    dayMeals.push({
      day: dayName,
      date: new Date(Date.now() + dayIndex * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      meals: dayMealsArray,
      totalCost,
    });
  }

  return dayMeals;
}
