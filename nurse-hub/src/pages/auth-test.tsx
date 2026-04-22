import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function AuthTest() {
  const { user, isLoading, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-neutral p-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <img 
            src="/assets/nursehub-logo.png" 
            alt="NurseHub Logo" 
            className="h-16 w-auto mx-auto mb-4"
          />
          <h1 className="text-3xl font-bold text-text-primary">NurseHub Authentication Test</h1>
          <p className="text-text-secondary">Testing login functionality and user authentication</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Authentication Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Loading State:</span>
              {isLoading ? (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Loading...
                </Badge>
              ) : (
                <Badge variant="outline" className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Complete
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span>Authentication:</span>
              {isAuthenticated ? (
                <Badge className="flex items-center gap-1 bg-success text-white">
                  <CheckCircle className="w-3 h-3" />
                  Authenticated
                </Badge>
              ) : (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <XCircle className="w-3 h-3" />
                  Not Authenticated
                </Badge>
              )}
            </div>

            {user && (
              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-2">User Information:</h3>
                <div className="space-y-2 text-sm">
                  <div><strong>ID:</strong> {user.id}</div>
                  <div><strong>Email:</strong> {user.email || 'Not provided'}</div>
                  <div><strong>First Name:</strong> {user.firstName || 'Not provided'}</div>
                  <div><strong>Last Name:</strong> {user.lastName || 'Not provided'}</div>
                  <div><strong>Subscription:</strong> {user.subscriptionStatus || 'free'}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-center">
          {!isAuthenticated ? (
            <Button
              onClick={() => window.location.href = '/api/login'}
              className="px-8"
            >
              Login to NurseHub
            </Button>
          ) : (
            <>
              <Button
                onClick={() => window.location.href = '/'}
                variant="outline"
              >
                Go to Dashboard
              </Button>
              <Button
                onClick={() => window.location.href = '/api/logout'}
                variant="destructive"
              >
                Logout
              </Button>
            </>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-text-secondary">
          <p>This is a test page to verify NurseHub authentication is working properly.</p>
          <p className="mt-2">Admin login: admin@nursehub.com / pass1234</p>
        </div>
      </div>
    </div>
  );
}