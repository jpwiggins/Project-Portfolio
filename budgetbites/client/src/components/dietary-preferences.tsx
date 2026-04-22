import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Activity, Target, AlertTriangle } from "lucide-react";

interface DietaryPreferencesProps {
  allergies: string[];
  dislikes: string[];
  dietType: string;
  calorieGoal: number;
  activityLevel: string;
  onAllergiesChange: (allergies: string[]) => void;
  onDislikesChange: (dislikes: string[]) => void;
  onDietTypeChange: (dietType: string) => void;
  onCalorieGoalChange: (calorieGoal: number) => void;
  onActivityLevelChange: (activityLevel: string) => void;
}

export function DietaryPreferences({ 
  allergies, 
  dislikes, 
  dietType, 
  calorieGoal, 
  activityLevel,
  onAllergiesChange,
  onDislikesChange,
  onDietTypeChange,
  onCalorieGoalChange,
  onActivityLevelChange
}: DietaryPreferencesProps) {
  const [customAllergy, setCustomAllergy] = useState('');
  const [customDislike, setCustomDislike] = useState('');

  const commonAllergies = [
    'nuts', 'dairy', 'eggs', 'fish', 'shellfish', 'soy', 'gluten', 'sesame'
  ];

  const commonDislikes = [
    'mushrooms', 'onions', 'tomatoes', 'spicy food', 'seafood', 'beans', 'cheese', 'olives'
  ];

  const dietTypes = [
    { value: '', label: 'No specific diet' },
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'ketogenic', label: 'Ketogenic' },
    { value: 'paleo', label: 'Paleo' },
    { value: 'gluten-free', label: 'Gluten-free' },
    { value: 'dairy-free', label: 'Dairy-free' },
  ];

  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary (little/no exercise)', multiplier: 1.2 },
    { value: 'light', label: 'Lightly active (light exercise 1-3 days/week)', multiplier: 1.375 },
    { value: 'moderate', label: 'Moderately active (moderate exercise 3-5 days/week)', multiplier: 1.55 },
    { value: 'active', label: 'Very active (hard exercise 6-7 days/week)', multiplier: 1.725 },
    { value: 'very_active', label: 'Extremely active (very hard exercise, physical job)', multiplier: 1.9 },
  ];

  // Calculate recommended calories based on activity level
  const getRecommendedCalories = (activity: string) => {
    const base = 2000; // Base metabolic rate estimate
    const level = activityLevels.find(l => l.value === activity);
    return level ? Math.round(base * level.multiplier) : 2000;
  };

  const recommendedCalories = getRecommendedCalories(activityLevel);

  const addCustomAllergy = () => {
    if (customAllergy.trim() && !allergies.includes(customAllergy.trim().toLowerCase())) {
      onAllergiesChange([...allergies, customAllergy.trim().toLowerCase()]);
      setCustomAllergy('');
    }
  };

  const addCustomDislike = () => {
    if (customDislike.trim() && !dislikes.includes(customDislike.trim().toLowerCase())) {
      onDislikesChange([...dislikes, customDislike.trim().toLowerCase()]);
      setCustomDislike('');
    }
  };

  const removeAllergy = (allergy: string) => {
    onAllergiesChange(allergies.filter(a => a !== allergy));
  };

  const removeDislike = (dislike: string) => {
    onDislikesChange(dislikes.filter(d => d !== dislike));
  };

  const toggleCommonAllergy = (allergy: string) => {
    if (allergies.includes(allergy)) {
      removeAllergy(allergy);
    } else {
      onAllergiesChange([...allergies, allergy]);
    }
  };

  const toggleCommonDislike = (dislike: string) => {
    if (dislikes.includes(dislike)) {
      removeDislike(dislike);
    } else {
      onDislikesChange([...dislikes, dislike]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Calorie & Activity Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-blue-500" />
            <span>Calorie Goals & Activity Level</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="activity-level">Activity Level</Label>
              <Select value={activityLevel} onValueChange={onActivityLevelChange}>
                <SelectTrigger data-testid="select-activity-level">
                  <SelectValue placeholder="Select activity level" />
                </SelectTrigger>
                <SelectContent>
                  {activityLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="calorie-goal">Daily Calorie Goal</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="calorie-goal"
                  type="number"
                  value={calorieGoal}
                  onChange={(e) => onCalorieGoalChange(Number(e.target.value))}
                  className="flex-1"
                  data-testid="input-calorie-goal"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onCalorieGoalChange(recommendedCalories)}
                  data-testid="button-use-recommended"
                >
                  Use Recommended ({recommendedCalories})
                </Button>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                <Activity className="h-3 w-3 inline mr-1" />
                Recommended for your activity level: {recommendedCalories} calories
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Diet Type */}
      <Card>
        <CardHeader>
          <CardTitle>Dietary Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="diet-type">Diet Type</Label>
            <Select value={dietType} onValueChange={onDietTypeChange}>
              <SelectTrigger data-testid="select-diet-type">
                <SelectValue placeholder="Select a diet type" />
              </SelectTrigger>
              <SelectContent>
                {dietTypes.map((diet) => (
                  <SelectItem key={diet.value} value={diet.value}>
                    {diet.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Allergies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span>Food Allergies</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Common Allergies */}
          <div>
            <Label>Common Allergies</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {commonAllergies.map((allergy) => (
                <div key={allergy} className="flex items-center space-x-2">
                  <Checkbox
                    id={`allergy-${allergy}`}
                    checked={allergies.includes(allergy)}
                    onCheckedChange={() => toggleCommonAllergy(allergy)}
                    data-testid={`checkbox-allergy-${allergy}`}
                  />
                  <Label htmlFor={`allergy-${allergy}`} className="text-sm">
                    {allergy.charAt(0).toUpperCase() + allergy.slice(1)}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Allergies */}
          <div>
            <Label>Add Custom Allergy</Label>
            <div className="flex space-x-2 mt-1">
              <Input
                value={customAllergy}
                onChange={(e) => setCustomAllergy(e.target.value)}
                placeholder="Enter custom allergy"
                onKeyPress={(e) => e.key === 'Enter' && addCustomAllergy()}
                data-testid="input-custom-allergy"
              />
              <Button 
                type="button" 
                onClick={addCustomAllergy} 
                size="sm"
                data-testid="button-add-allergy"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Selected Allergies */}
          {allergies.length > 0 && (
            <div>
              <Label>Selected Allergies</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {allergies.map((allergy) => (
                  <Badge 
                    key={allergy} 
                    variant="destructive"
                    className="flex items-center space-x-1"
                    data-testid={`badge-allergy-${allergy}`}
                  >
                    <span>{allergy}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-red-100 hover:text-white"
                      onClick={() => removeAllergy(allergy)}
                      data-testid={`button-remove-allergy-${allergy}`}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Food Dislikes */}
      <Card>
        <CardHeader>
          <CardTitle>Food Dislikes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Common Dislikes */}
          <div>
            <Label>Common Dislikes</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {commonDislikes.map((dislike) => (
                <div key={dislike} className="flex items-center space-x-2">
                  <Checkbox
                    id={`dislike-${dislike}`}
                    checked={dislikes.includes(dislike)}
                    onCheckedChange={() => toggleCommonDislike(dislike)}
                    data-testid={`checkbox-dislike-${dislike}`}
                  />
                  <Label htmlFor={`dislike-${dislike}`} className="text-sm">
                    {dislike.charAt(0).toUpperCase() + dislike.slice(1)}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Dislikes */}
          <div>
            <Label>Add Custom Dislike</Label>
            <div className="flex space-x-2 mt-1">
              <Input
                value={customDislike}
                onChange={(e) => setCustomDislike(e.target.value)}
                placeholder="Enter food you dislike"
                onKeyPress={(e) => e.key === 'Enter' && addCustomDislike()}
                data-testid="input-custom-dislike"
              />
              <Button 
                type="button" 
                onClick={addCustomDislike} 
                size="sm"
                data-testid="button-add-dislike"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Selected Dislikes */}
          {dislikes.length > 0 && (
            <div>
              <Label>Selected Dislikes</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {dislikes.map((dislike) => (
                  <Badge 
                    key={dislike} 
                    variant="secondary"
                    className="flex items-center space-x-1"
                    data-testid={`badge-dislike-${dislike}`}
                  >
                    <span>{dislike}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 text-gray-400 hover:text-gray-600"
                      onClick={() => removeDislike(dislike)}
                      data-testid={`button-remove-dislike-${dislike}`}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}