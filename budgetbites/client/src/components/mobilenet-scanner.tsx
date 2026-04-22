import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Scan, ChefHat, Zap, X, RotateCcw, ImageIcon } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useCamera, CameraUtils } from "./camera-utils";

interface FoodPrediction {
  className: string;
  probability: number;
  estimatedPrice: number;
  category: string;
}

interface SmartRecipe {
  id: number;
  name: string;
  cost: number;
  ingredients: string[];
  cookTime: number;
  difficulty: string;
  confidence: number;
  description: string;
}

declare global {
  interface Window {
    tf: any;
    mobilenet: any;
    cocoSsd: any;
    AFRAME: any;
  }
}

export function MobileNetScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [predictions, setPredictions] = useState<FoodPrediction[]>([]);
  const [smartRecipes, setSmartRecipes] = useState<SmartRecipe[]>([]);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [mobileNetModel, setMobileNetModel] = useState<any>(null);
  const [scanMode, setScanMode] = useState<'live' | 'photo'>('live');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Enhanced camera management
  const { 
    cameraManager, 
    isActive: isCameraActive, 
    error: cameraError, 
    startCamera, 
    stopCamera, 
    switchCamera,
    isSupported,
    isMobile 
  } = useCamera();

  // Food price estimation based on MobileNet classifications
  const FOOD_PRICES: Record<string, number> = {
    // Fruits
    'banana': 0.25, 'apple': 0.50, 'orange': 0.40, 'lemon': 0.30,
    'strawberry': 0.15, 'pineapple': 3.00, 'grapes': 2.50,
    
    // Vegetables
    'broccoli': 1.50, 'carrot': 0.20, 'bell pepper': 1.00,
    'cucumber': 0.75, 'tomato': 0.30, 'potato': 0.15,
    'onion': 0.25, 'garlic': 0.10,
    
    // Proteins & Dairy
    'egg': 0.25, 'milk': 0.50, 'cheese': 2.00, 'yogurt': 1.00,
    'chicken': 1.50, 'beef': 3.00, 'fish': 2.50,
    
    // Grains & Pantry
    'bread': 2.50, 'rice': 0.50, 'pasta': 1.00, 'cereal': 4.00,
    'flour': 0.30, 'sugar': 0.50, 'salt': 0.05,
    
    // Processed Foods
    'pizza': 8.00, 'hamburger': 5.00, 'hot dog': 1.50,
    'sandwich': 4.00, 'bagel': 1.00, 'pretzel': 2.00
  };

  const FOOD_CATEGORIES: Record<string, string> = {
    'banana': 'fruit', 'apple': 'fruit', 'orange': 'fruit',
    'broccoli': 'vegetable', 'carrot': 'vegetable', 
    'bread': 'grain', 'rice': 'grain', 'pasta': 'grain',
    'milk': 'dairy', 'cheese': 'dairy', 'yogurt': 'dairy',
    'chicken': 'protein', 'beef': 'protein', 'fish': 'protein'
  };

  useEffect(() => {
    initializeModels();
  }, []);

  const initializeModels = async () => {
    setIsModelLoading(true);
    
    try {
      console.log('Loading MobileNet model...');
      
      if (window.tf && window.mobilenet) {
        const model = await window.mobilenet.load();
        setMobileNetModel(model);
        console.log('MobileNet model loaded successfully');
      } else {
        throw new Error('TensorFlow.js or MobileNet not available');
      }
    } catch (error) {
      console.error('Model loading failed:', error);
    } finally {
      setIsModelLoading(false);
    }
  };

  const startLiveScanning = async () => {
    if (!mobileNetModel) {
      console.error('MobileNet model not loaded');
      return;
    }

    setIsScanning(true);
    setScanMode('live');

    try {
      const videoElement = await startCamera();
      console.log('Camera started for live scanning');
      
      // Start continuous prediction loop
      startLivePredictions(videoElement);
    } catch (error) {
      console.error('Failed to start live scanning:', error);
      setIsScanning(false);
    }
  };

  const startLivePredictions = (videoElement: HTMLVideoElement) => {
    const predict = async () => {
      if (!isScanning || !mobileNetModel || !videoElement.videoWidth) {
        return;
      }

      try {
        // Predict on video element directly
        const predictions = await mobileNetModel.classify(videoElement, 5);
        
        // Process and filter food-related predictions
        const foodPredictions = predictions
          .filter((pred: any) => pred.probability > 0.1)
          .map((pred: any) => ({
            className: pred.className.toLowerCase(),
            probability: pred.probability,
            estimatedPrice: estimateFoodPrice(pred.className.toLowerCase()),
            category: FOOD_CATEGORIES[pred.className.toLowerCase()] || 'other'
          }))
          .filter((pred: FoodPrediction) => pred.category !== 'other');

        if (foodPredictions.length > 0) {
          setPredictions(foodPredictions);
          await generateSmartRecipes(foodPredictions);
        }
      } catch (error) {
        console.error('Prediction error:', error);
      }

      // Continue predictions if still scanning
      if (isScanning) {
        requestAnimationFrame(() => setTimeout(predict, 2000)); // Predict every 2 seconds
      }
    };

    // Wait for video to load
    videoElement.addEventListener('loadeddata', () => {
      predict();
    });

    if (videoElement.readyState >= 2) {
      predict();
    }
  };

  const captureAndAnalyze = async () => {
    if (!mobileNetModel || !cameraManager) return;

    try {
      const videoElement = cameraManager.getVideoElement();
      if (!videoElement) return;

      // Capture frame to canvas
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext('2d');
      if (!context) return;

      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      context.drawImage(videoElement, 0, 0);

      // Convert to data URL for display
      const photoDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedPhoto(photoDataUrl);
      setScanMode('photo');

      // Analyze the captured image
      const predictions = await mobileNetModel.classify(canvas, 10);
      
      const foodPredictions = predictions
        .filter((pred: any) => pred.probability > 0.05)
        .map((pred: any) => ({
          className: pred.className.toLowerCase(),
          probability: pred.probability,
          estimatedPrice: estimateFoodPrice(pred.className.toLowerCase()),
          category: FOOD_CATEGORIES[pred.className.toLowerCase()] || 'other'
        }));

      setPredictions(foodPredictions);
      await generateSmartRecipes(foodPredictions);
      
    } catch (error) {
      console.error('Capture and analyze failed:', error);
    }
  };

  const uploadPhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !mobileNetModel) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageDataUrl = e.target?.result as string;
      setCapturedPhoto(imageDataUrl);
      setScanMode('photo');

      // Create image element for analysis
      const img = new Image();
      img.onload = async () => {
        try {
          const predictions = await mobileNetModel.classify(img, 10);
          
          const foodPredictions = predictions
            .filter((pred: any) => pred.probability > 0.05)
            .map((pred: any) => ({
              className: pred.className.toLowerCase(),
              probability: pred.probability,
              estimatedPrice: estimateFoodPrice(pred.className.toLowerCase()),
              category: FOOD_CATEGORIES[pred.className.toLowerCase()] || 'other'
            }));

          setPredictions(foodPredictions);
          await generateSmartRecipes(foodPredictions);
        } catch (error) {
          console.error('Photo analysis failed:', error);
        }
      };
      img.src = imageDataUrl;
    };
    reader.readAsDataURL(file);
  };

  const estimateFoodPrice = (foodName: string): number => {
    // Try exact match first
    if (FOOD_PRICES[foodName]) {
      return FOOD_PRICES[foodName];
    }

    // Try partial matches
    for (const [key, price] of Object.entries(FOOD_PRICES)) {
      if (foodName.includes(key) || key.includes(foodName)) {
        return price;
      }
    }

    return 1.00; // Default price
  };

  const generateSmartRecipes = async (predictions: FoodPrediction[]) => {
    try {
      const ingredients = predictions.map(p => p.className).join(',');
      const totalBudget = Math.min(predictions.reduce((sum, p) => sum + p.estimatedPrice, 0) + 5.00, 15.00);
      
      const response = await apiRequest('POST', '/api/mobilenet-recipes', {
        predictions,
        budget: totalBudget,
        detectedIngredients: ingredients
      });
      
      if (response.ok) {
        const data = await response.json();
        setSmartRecipes(data.recipes || []);
      }
    } catch (error) {
      // Fallback smart recipes
      const smartRecipes: SmartRecipe[] = predictions.length > 0 ? [
        {
          id: 1,
          name: `Fresh ${predictions[0].className.charAt(0).toUpperCase() + predictions[0].className.slice(1)} Bowl`,
          cost: predictions.reduce((sum, p) => sum + p.estimatedPrice, 0) + 2.00,
          ingredients: predictions.map(p => p.className),
          cookTime: 10,
          difficulty: 'Easy',
          confidence: Math.max(...predictions.map(p => p.probability)),
          description: 'Simple and nutritious meal using detected ingredients'
        }
      ] : [];
      
      setSmartRecipes(smartRecipes);
    }
  };

  const stopScanning = () => {
    setIsScanning(false);
    setPredictions([]);
    setSmartRecipes([]);
    setCapturedPhoto(null);
    stopCamera();
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ChefHat className="h-5 w-5 text-orange-500" />
          <span>Smart Food Recognition Scanner</span>
          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
            MobileNet AI
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Camera/Photo Display */}
        <div className="relative">
          {scanMode === 'live' && isScanning ? (
            <div className="w-full h-[400px] bg-black rounded-lg overflow-hidden">
              <div id="live-camera-feed" className="w-full h-full" />
            </div>
          ) : capturedPhoto ? (
            <div className="w-full h-[400px] bg-black rounded-lg overflow-hidden flex items-center justify-center">
              <img 
                src={capturedPhoto} 
                alt="Captured food" 
                className="max-w-full max-h-full object-contain"
                data-testid="captured-photo"
              />
            </div>
          ) : (
            <div className="w-full h-[400px] bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900 dark:to-red-900 rounded-lg flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto">
                  <ChefHat className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">MobileNet Food Recognition</h3>
                  <p className="text-muted-foreground">
                    Advanced AI model for detailed food classification and recipe suggestions
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Loading Overlay */}
          {isModelLoading && (
            <div className="absolute inset-0 bg-black bg-opacity-75 rounded-lg flex items-center justify-center z-10">
              <div className="text-center text-white space-y-3">
                <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto" />
                <p>Loading MobileNet AI model...</p>
                <p className="text-sm opacity-75">Preparing food classification engine</p>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Controls */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3">
            {!isScanning ? (
              <>
                <Button 
                  onClick={startLiveScanning}
                  className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
                  disabled={!mobileNetModel || !isSupported}
                  data-testid="button-start-live-scan"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Start Live Scanning
                </Button>
                
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  disabled={!mobileNetModel}
                  data-testid="button-upload-photo"
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Upload Photo
                </Button>
              </>
            ) : (
              <>
                <Button 
                  onClick={captureAndAnalyze}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  data-testid="button-capture-analyze"
                >
                  <Scan className="h-4 w-4 mr-2" />
                  Capture & Analyze
                </Button>
                
                <Button 
                  onClick={switchCamera}
                  variant="outline"
                  disabled={!isMobile}
                  data-testid="button-switch-camera"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                
                <Button 
                  onClick={stopScanning}
                  variant="destructive"
                  data-testid="button-stop-scan"
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>

          {/* Camera Error States */}
          {cameraError && (
            <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">
                Camera Error: {cameraError}
              </p>
            </div>
          )}
        </div>

        {/* Food Predictions */}
        {predictions.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center space-x-2">
              <Zap className="h-4 w-4 text-green-500" />
              <span>Detected Food Items</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {predictions.slice(0, 6).map((prediction, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg bg-green-50 dark:bg-green-950"
                  data-testid={`prediction-${index}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium capitalize">{prediction.className}</p>
                      <p className="text-xs text-muted-foreground">
                        Confidence: {Math.round(prediction.probability * 100)}%
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge variant="secondary">
                        ${prediction.estimatedPrice.toFixed(2)}
                      </Badge>
                      <Badge className="text-xs" variant="outline">
                        {prediction.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Smart Recipe Suggestions */}
        {smartRecipes.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold">AI-Generated Recipe Suggestions</h3>
            <div className="space-y-3">
              {smartRecipes.map((recipe, index) => (
                <div
                  key={recipe.id}
                  className="p-4 border rounded-lg bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950"
                  data-testid={`smart-recipe-${index}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium">{recipe.name}</h4>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-orange-600 text-white">
                        ${recipe.cost.toFixed(2)}
                      </Badge>
                      <Badge variant="outline">
                        {recipe.cookTime}min
                      </Badge>
                      <Badge variant="outline">
                        {Math.round(recipe.confidence * 100)}% match
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {recipe.description}
                  </p>
                  <p className="text-sm font-medium">
                    Ingredients: {recipe.ingredients.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technical Info */}
        <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950 rounded-lg border">
          <h4 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">
            MobileNet Implementation
          </h4>
          <div className="text-sm text-orange-600 dark:text-orange-300 space-y-1">
            <p>• Advanced food classification with 1000+ categories</p>
            <p>• Real-time live scanning + photo upload support</p>
            <p>• Smart price estimation and recipe generation</p>
            <p>• Mobile-optimized performance</p>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={uploadPhoto}
          className="hidden"
        />

        {/* Hidden canvas for image processing */}
        <canvas ref={canvasRef} className="hidden" />
      </CardContent>
    </Card>
  );
}