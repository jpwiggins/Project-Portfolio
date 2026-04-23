import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ARPantryScanner } from "@/components/ar-pantry-scan";
import { RealARScanner } from "@/components/real-ar-scanner";
import { MobileNetScanner } from "@/components/mobilenet-scanner";
import { VoiceGestureController } from "@/components/voice-gesture-controller";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Smartphone, Brain, Eye } from "lucide-react";

export default function ARPantryPage() {
  const handleVoiceNavigation = (path: string) => {
    window.location.href = path;
  };

  const handleVoiceAction = (action: string) => {
    console.log('Voice action triggered:', action);
    // Handle specific actions based on the current context
    switch (action) {
      case 'scan_start':
        // Trigger scan start if scanner is available
        const startButton = document.querySelector('[data-testid="button-start-live-scan"]') as HTMLButtonElement;
        startButton?.click();
        break;
      case 'scan_stop':
        // Trigger scan stop if scanner is running
        const stopButton = document.querySelector('[data-testid="button-stop-scan"]') as HTMLButtonElement;
        stopButton?.click();
        break;
      case 'show_help':
        // Show help modal or navigate to help section
        alert('Voice Commands:\n"Scan food" - Start AR scanner\n"Go home" - Return to main menu\n"Create meal plan" - Generate new meal plan');
        break;
      default:
        console.log('Unknown action:', action);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              AR Pantry Scanner
            </h1>
            <Badge variant="secondary" className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800">
              BETA
            </Badge>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Point your camera at pantry items and get instant recipe suggestions that fit your budget
          </p>
        </div>

        {/* Voice & Gesture Controls */}
        <div className="flex justify-center mb-6">
          <VoiceGestureController 
            onNavigate={handleVoiceNavigation}
            onAction={handleVoiceAction}
          />
        </div>

        {/* Enhanced MobileNet Scanner */}
        <MobileNetScanner />

        {/* Technical Details */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Eye className="h-5 w-5 text-blue-500" />
                <span>Computer Vision</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                TensorFlow.js COCO-SSD model detects 20+ food items in real-time with 85%+ accuracy
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Zap className="h-5 w-5 text-green-500" />
                <span>AR Overlay</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                AR.js provides augmented reality overlays showing detected items and recipe suggestions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Brain className="h-5 w-5 text-purple-500" />
                <span>Smart Matching</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                AI matches detected ingredients with budget-friendly recipes from Spoonacular API
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Smartphone className="h-5 w-5 text-orange-500" />
                <span>Web-Based</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                No app download required. Works directly in mobile browsers with camera access
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Implementation Roadmap */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-purple-500" />
              <span>Development Roadmap</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-green-600">Phase 1: Basic Detection (1 week)</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Camera access and food detection</li>
                  <li>• TensorFlow.js COCO-SSD integration</li>
                  <li>• Basic recipe matching</li>
                  <li>• Budget integration</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold text-blue-600">Phase 2: AR Enhancement (2 weeks)</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• AR.js/MindAR-js integration</li>
                  <li>• Real-time bounding boxes</li>
                  <li>• Recipe overlays in 3D space</li>
                  <li>• Nutrition information display</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950 rounded-lg border">
              <h4 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
                Technical Feasibility: HIGH ✓
              </h4>
              <p className="text-sm text-purple-600 dark:text-purple-300">
                All required technologies (TensorFlow.js, AR.js, WebRTC) are mature and browser-ready. 
                Pre-trained models are available. Implementation complexity is moderate.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Browser Support */}
        <Card>
          <CardHeader>
            <CardTitle>Browser Support</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="space-y-2">
                <div className="text-green-600 font-semibold">Chrome Mobile</div>
                <div className="text-sm text-muted-foreground">Full Support</div>
              </div>
              <div className="space-y-2">
                <div className="text-green-600 font-semibold">Firefox Mobile</div>
                <div className="text-sm text-muted-foreground">Full Support</div>
              </div>
              <div className="space-y-2">
                <div className="text-yellow-600 font-semibold">Safari iOS</div>
                <div className="text-sm text-muted-foreground">Limited AR</div>
              </div>
              <div className="space-y-2">
                <div className="text-green-600 font-semibold">Edge Mobile</div>
                <div className="text-sm text-muted-foreground">Full Support</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}