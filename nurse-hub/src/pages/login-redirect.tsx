import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, AlertCircle } from "lucide-react";

export default function LoginRedirect() {
  useEffect(() => {
    // Auto-redirect to Replit login after 3 seconds
    const timer = setTimeout(() => {
      window.location.href = '/api/login';
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-neutral flex items-center justify-center p-6">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <img 
            src="/assets/nursehub-logo.png" 
            alt="NurseHub Logo" 
            className="h-16 w-auto mx-auto mb-4"
          />
          <CardTitle className="flex items-center justify-center gap-2">
            <AlertCircle className="w-5 h-5 text-primary" />
            Login Required
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-text-secondary">
            You need to login through Replit to access NurseHub Pro.
          </p>
          <p className="text-sm text-text-secondary">
            Redirecting automatically in 3 seconds...
          </p>
          <Button 
            onClick={() => window.location.href = '/api/login'}
            className="w-full"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Login with Replit Now
          </Button>
          <p className="text-xs text-text-secondary mt-4">
            This ensures secure authentication for your healthcare data.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}