import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Smartphone, X, Wifi, WifiOff } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

export function PWAInstallPrompt() {
  const { isInstallable, isInstalled, isOffline, showInstallPrompt } = usePWA();
  const [isVisible, setIsVisible] = useState(true);
  const [isInstalling, setIsInstalling] = useState(false);

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      const success = await showInstallPrompt();
      if (success) {
        setIsVisible(false);
      }
    } catch (error) {
      console.error('Installation failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Remember dismissal for 24 hours
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
  };

  // Don't show if already installed, not installable, or recently dismissed
  if (isInstalled || !isInstallable || !isVisible) {
    return null;
  }

  // Check if recently dismissed
  const dismissedTime = localStorage.getItem('pwa-prompt-dismissed');
  if (dismissedTime && Date.now() - parseInt(dismissedTime) < 24 * 60 * 60 * 1000) {
    return null;
  }

  return (
    <Card className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm shadow-2xl border-2 border-orange-200 dark:border-orange-800 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950 dark:to-red-950">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
              <Smartphone className="h-6 w-6 text-white" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-sm font-semibold text-orange-900 dark:text-orange-100">
                Install BudgetBites
              </h3>
              <Badge className="bg-orange-500 text-white text-xs">
                PWA
              </Badge>
            </div>
            
            <p className="text-xs text-orange-700 dark:text-orange-300 mb-3">
              Add to home screen for faster access and offline meal planning!
            </p>
            
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleInstall}
                disabled={isInstalling}
                size="sm"
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white h-8 text-xs"
                data-testid="button-install-pwa"
              >
                {isInstalling ? (
                  <div className="animate-spin w-3 h-3 border-2 border-white border-t-transparent rounded-full mr-1" />
                ) : (
                  <Download className="h-3 w-3 mr-1" />
                )}
                Install
              </Button>
              
              <Button
                onClick={handleDismiss}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-orange-600 hover:text-orange-700 hover:bg-orange-100 dark:hover:bg-orange-900"
                data-testid="button-dismiss-pwa"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Features list */}
        <div className="mt-3 pt-3 border-t border-orange-200 dark:border-orange-800">
          <div className="text-xs text-orange-600 dark:text-orange-400 space-y-1">
            <div className="flex items-center space-x-2">
              <span className="w-1 h-1 bg-orange-500 rounded-full"></span>
              <span>Works offline</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-1 h-1 bg-orange-500 rounded-full"></span>
              <span>AR pantry scanning</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-1 h-1 bg-orange-500 rounded-full"></span>
              <span>Push notifications</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function PWAStatusIndicator() {
  const { isInstalled, isOffline } = usePWA();

  if (!isInstalled && !isOffline) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-40">
      {isInstalled && (
        <Badge className="bg-green-600 text-white mr-2">
          <Smartphone className="h-3 w-3 mr-1" />
          Installed
        </Badge>
      )}
      
      {isOffline && (
        <Badge variant="destructive">
          <WifiOff className="h-3 w-3 mr-1" />
          Offline
        </Badge>
      )}
      
      {!isOffline && isInstalled && (
        <Badge className="bg-blue-600 text-white">
          <Wifi className="h-3 w-3 mr-1" />
          Online
        </Badge>
      )}
    </div>
  );
}