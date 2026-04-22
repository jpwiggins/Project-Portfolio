import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Camera, Scan, ShoppingCart, Zap } from "lucide-react";

interface DetectedItem {
  name: string;
  confidence: number;
  bbox: number[];
  price?: number;
}

interface RecipeSuggestion {
  name: string;
  cost: number;
  ingredients: string[];
  cookTime: string;
}

export function ARPantryScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [detectedItems, setDetectedItems] = useState<DetectedItem[]>([]);
  const [recipeSuggestions, setRecipeSuggestions] = useState<RecipeSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Food items that COCO-SSD can detect
  const DETECTABLE_FOODS = [
    'banana', 'apple', 'sandwich', 'orange', 'broccoli', 
    'carrot', 'pizza', 'donut', 'cake', 'chair', 'bottle'
  ];

  const startCamera = async () => {
    try {
      setIsScanning(true);
      setIsLoading(true);

      // Request camera access - prefer back camera on mobile
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        
        // Simulate loading TensorFlow.js model
        setTimeout(() => {
          setIsLoading(false);
          startDetection();
        }, 2000);
      }
    } catch (error) {
      console.error('Camera access failed:', error);
      setIsScanning(false);
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
    setDetectedItems([]);
    setRecipeSuggestions([]);
  };

  const startDetection = () => {
    // Simulate real-time food detection
    const detectInterval = setInterval(() => {
      if (!isScanning) {
        clearInterval(detectInterval);
        return;
      }

      // Mock detection results (in real implementation, this would be TensorFlow.js)
      const mockDetections: DetectedItem[] = [
        { name: 'banana', confidence: 0.95, bbox: [100, 50, 150, 120], price: 0.25 },
        { name: 'apple', confidence: 0.87, bbox: [200, 80, 250, 140], price: 0.50 },
        { name: 'carrot', confidence: 0.82, bbox: [150, 200, 200, 280], price: 0.15 }
      ];

      setDetectedItems(mockDetections);
      generateRecipeSuggestions(mockDetections);
    }, 3000);
  };

  const generateRecipeSuggestions = async (items: DetectedItem[]) => {
    // Mock recipe suggestions based on detected items
    const ingredients = items.map(item => item.name);
    
    if (ingredients.includes('banana') && ingredients.includes('apple')) {
      setRecipeSuggestions([
        {
          name: 'Fruit Salad Bowl',
          cost: 3.50,
          ingredients: ['banana', 'apple', 'honey', 'yogurt'],
          cookTime: '5 mins'
        },
        {
          name: 'Smoothie Blend',
          cost: 2.75,
          ingredients: ['banana', 'apple', 'milk'],
          cookTime: '3 mins'
        }
      ]);
    } else if (ingredients.includes('carrot')) {
      setRecipeSuggestions([
        {
          name: 'Roasted Carrots',
          cost: 2.25,
          ingredients: ['carrot', 'olive oil', 'herbs'],
          cookTime: '25 mins'
        }
      ]);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Scan className="h-5 w-5 text-blue-500" />
          <span>AR Pantry Scanner</span>
          <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800">
            BETA
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Point your camera at pantry items to get instant budget-friendly recipe suggestions
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Camera View */}
        <div className="relative">
          <video
            ref={videoRef}
            className={`w-full h-64 bg-gray-900 rounded-lg object-cover ${
              isScanning ? 'block' : 'hidden'
            }`}
            playsInline
            muted
            data-testid="camera-video"
          />
          
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-64 pointer-events-none"
            data-testid="detection-overlay"
          />

          {!isScanning && (
            <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg flex items-center justify-center">
              <div className="text-center space-y-3">
                <Camera className="h-12 w-12 text-gray-400 mx-auto" />
                <p className="text-sm text-muted-foreground">
                  Camera ready to scan your pantry
                </p>
              </div>
            </div>
          )}

          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
              <div className="text-center text-white space-y-2">
                <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full mx-auto" />
                <p className="text-sm">Loading AI food detection...</p>
              </div>
            </div>
          )}

          {/* Detection Overlays (would be real bounding boxes in production) */}
          {isScanning && !isLoading && detectedItems.length > 0 && (
            <div className="absolute top-2 left-2 space-y-1">
              {detectedItems.map((item, index) => (
                <Badge 
                  key={index}
                  className="bg-green-500 text-white shadow-lg"
                  data-testid={`detected-item-${index}`}
                >
                  <Zap className="h-3 w-3 mr-1" />
                  {item.name} ({Math.round(item.confidence * 100)}%)
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex space-x-2">
          {!isScanning ? (
            <Button 
              onClick={startCamera} 
              className="flex-1"
              data-testid="button-start-scan"
            >
              <Camera className="h-4 w-4 mr-2" />
              Start Scanning
            </Button>
          ) : (
            <Button 
              onClick={stopCamera} 
              variant="outline" 
              className="flex-1"
              data-testid="button-stop-scan"
            >
              Stop Scanning
            </Button>
          )}
        </div>

        {/* Detected Items */}
        {detectedItems.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Detected Items</h3>
            <div className="grid grid-cols-1 gap-2">
              {detectedItems.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                  data-testid={`item-card-${index}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                      <ShoppingCart className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium capitalize">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {Math.round(item.confidence * 100)}% confidence
                      </p>
                    </div>
                  </div>
                  {item.price && (
                    <Badge variant="secondary">${item.price.toFixed(2)}</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recipe Suggestions */}
        {recipeSuggestions.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Recipe Suggestions</h3>
            <div className="space-y-3">
              {recipeSuggestions.map((recipe, index) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-950 dark:to-green-950"
                  data-testid={`recipe-suggestion-${index}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{recipe.name}</h4>
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-500 text-white">
                        ${recipe.cost.toFixed(2)}
                      </Badge>
                      <Badge variant="outline">{recipe.cookTime}</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Uses: {recipe.ingredients.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tech Preview Notice */}
        <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="flex items-start space-x-2">
            <Zap className="h-4 w-4 text-purple-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-purple-800 dark:text-purple-200">
                Tech Preview Feature
              </p>
              <p className="text-purple-600 dark:text-purple-300">
                Real implementation uses TensorFlow.js + AR.js for live food detection and AR overlays. 
                Current demo shows the interface and workflow.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}