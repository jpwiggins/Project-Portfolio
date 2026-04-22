import { Clock, DollarSign, Users, RefreshCw, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type Meal } from "@shared/schema";

interface MealCardProps {
  meal: Meal;
}

export function MealCard({ meal }: MealCardProps) {
  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-semibold text-gray-900 text-sm" data-testid={`meal-name-${meal.id}`}>
            {meal.name}
          </h4>
          <span className="text-xs text-gray-500 capitalize bg-gray-100 px-2 py-1 rounded">
            {meal.type}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
          <div className="flex items-center space-x-1">
            <DollarSign className="h-3 w-3" />
            <span data-testid={`meal-cost-${meal.id}`}>${meal.cost.toFixed(2)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Activity className="h-3 w-3" />
            <span data-testid={`meal-calories-${meal.id}`}>{meal.calories} cal</span>
          </div>
        </div>

        {/* Nutrition Information */}
        {meal.nutritionInfo && (
          <div className="mb-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-blue-50 p-2 rounded">
                <span className="font-medium text-blue-700">Protein:</span>
                <span className="ml-1 text-blue-600" data-testid={`meal-protein-${meal.id}`}>
                  {meal.nutritionInfo.protein}g
                </span>
              </div>
              <div className="bg-orange-50 p-2 rounded">
                <span className="font-medium text-orange-700">Carbs:</span>
                <span className="ml-1 text-orange-600" data-testid={`meal-carbs-${meal.id}`}>
                  {meal.nutritionInfo.carbs}g
                </span>
              </div>
              <div className="bg-yellow-50 p-2 rounded">
                <span className="font-medium text-yellow-700">Fat:</span>
                <span className="ml-1 text-yellow-600" data-testid={`meal-fat-${meal.id}`}>
                  {meal.nutritionInfo.fat}g
                </span>
              </div>
              <div className="bg-green-50 p-2 rounded">
                <span className="font-medium text-green-700">Fiber:</span>
                <span className="ml-1 text-green-600" data-testid={`meal-fiber-${meal.id}`}>
                  {meal.nutritionInfo.fiber}g
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Ingredients */}
        {meal.ingredients && meal.ingredients.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-medium text-gray-700 mb-1">Ingredients:</p>
            <div className="flex flex-wrap gap-1">
              {meal.ingredients.slice(0, 4).map((ingredient, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs py-0 px-1"
                  data-testid={`ingredient-${meal.id}-${index}`}
                >
                  {ingredient}
                </Badge>
              ))}
              {meal.ingredients.length > 4 && (
                <Badge variant="outline" className="text-xs py-0 px-1">
                  +{meal.ingredients.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Substitutions */}
        {meal.substitutions && meal.substitutions.length > 0 && (
          <div className="border-t pt-2">
            <div className="flex items-center space-x-1 mb-2">
              <RefreshCw className="h-3 w-3 text-blue-500" />
              <p className="text-xs font-medium text-blue-700">Smart Substitutions:</p>
            </div>
            <div className="space-y-1">
              {meal.substitutions.map((sub, index) => (
                <div 
                  key={index} 
                  className="text-xs bg-blue-50 p-2 rounded"
                  data-testid={`substitution-${meal.id}-${index}`}
                >
                  <span className="line-through text-gray-500">{sub.original}</span>
                  <span className="mx-1">→</span>
                  <span className="font-medium text-blue-700">{sub.substitute}</span>
                  <div className="text-blue-600 mt-1">
                    <em>{sub.reason}</em>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}