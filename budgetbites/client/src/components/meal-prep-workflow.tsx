import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ChefHat, Utensils, CheckCircle2 } from "lucide-react";

interface MealPrepTask {
  day: number;
  dayName: string;
  task: string;
  benefit: string;
  meals: string[];
  timeRequired: string;
  category: string;
}

interface MealPrepInstructions {
  totalPrepTime: number;
  timeSavedDaily: string;
  instructions: MealPrepTask[];
  tips: string[];
}

interface MealPrepWorkflowProps {
  mealPrepInstructions: MealPrepInstructions;
}

export function MealPrepWorkflow({ mealPrepInstructions }: MealPrepWorkflowProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'batch-cooking':
        return <ChefHat className="h-4 w-4" />;
      case 'prep-work':
        return <Utensils className="h-4 w-4" />;
      case 'protein-prep':
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'batch-cooking':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'prep-work':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'protein-prep':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ChefHat className="h-5 w-5 text-blue-500" />
          <span>Smart Meal Prep Workflow</span>
        </CardTitle>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>Total prep: {mealPrepInstructions.totalPrepTime} minutes</span>
          </div>
          <div className="flex items-center space-x-1">
            <CheckCircle2 className="h-4 w-4" />
            <span>Saves {mealPrepInstructions.timeSavedDaily}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Prep Instructions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Prep Schedule</h3>
          {mealPrepInstructions.instructions.map((instruction, index) => (
            <div
              key={index}
              className="p-4 rounded-lg border bg-card"
              data-testid={`prep-task-${index}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant="secondary" 
                    className={getCategoryColor(instruction.category)}
                  >
                    {getCategoryIcon(instruction.category)}
                    <span className="ml-1">{instruction.dayName}</span>
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {instruction.timeRequired}
                  </span>
                </div>
              </div>
              
              <h4 className="font-medium text-foreground mb-1">
                {instruction.task}
              </h4>
              
              <p className="text-sm text-green-600 dark:text-green-400 mb-2">
                💡 {instruction.benefit}
              </p>
              
              {instruction.meals.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">Used in: </span>
                  {instruction.meals.join(', ')}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pro Tips */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground">Pro Tips</h3>
          <div className="grid gap-2">
            {mealPrepInstructions.tips.map((tip, index) => (
              <div
                key={index}
                className="flex items-start space-x-2 text-sm"
                data-testid={`tip-${index}`}
              >
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Value Proposition */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950 rounded-lg border">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              Time-Saving Impact
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            With this prep workflow, you'll save <strong>{mealPrepInstructions.timeSavedDaily}</strong> on meal preparation. 
            That's <strong>2-3 hours per week</strong> you can spend on what matters most to you!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}