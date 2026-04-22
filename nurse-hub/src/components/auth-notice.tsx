import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function AuthNotice() {
  return (
    <Alert className="mb-4 border-blue-200 bg-blue-50 text-blue-800">
      <Info className="h-4 w-4" />
      <AlertDescription>
        <strong>Security Notice:</strong> You'll be redirected to secure authentication. 
        The app name may show as "nursehun" (the project ID), but you're logging into NurseHub Pro.
        This ensures your professional data remains secure on our reference and support platform.
      </AlertDescription>
    </Alert>
  );
}