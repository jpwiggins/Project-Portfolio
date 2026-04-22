import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Wand2, FileText } from "lucide-react";

const policyFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.string().min(1, "Policy type is required"),
  description: z.string().min(1, "Description is required"),
  frameworks: z.array(z.string()).min(1, "At least one framework is required"),
});

type PolicyFormData = z.infer<typeof policyFormSchema>;

interface PolicyCreationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PolicyCreationModal({ open, onOpenChange }: PolicyCreationModalProps) {
  const [frameworks, setFrameworks] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<PolicyFormData>({
    resolver: zodResolver(policyFormSchema),
    defaultValues: {
      title: "",
      type: "",
      description: "",
      frameworks: [],
    },
  });

  const generatePolicyMutation = useMutation({
    mutationFn: async (data: PolicyFormData) => {
      console.log("Generating policy with data:", data);
      const response = await apiRequest("POST", "/api/policies/generate", data);
      const result = await response.json();
      console.log("Generated policy result:", result);
      return result;
    },
    onSuccess: async (generatedPolicy) => {
      // Create the policy with generated content
      const policyData = {
        title: generatedPolicy.title,
        type: form.getValues("type"),
        description: form.getValues("description"),
        content: generatedPolicy.content,
        frameworks,
        status: "draft",
        createdBy: "Current User",
        version: "1.0",
      };

      const response = await apiRequest("POST", "/api/policies", policyData);
      const policy = await response.json();
      
      queryClient.invalidateQueries({ queryKey: ["/api/policies"] });
      toast({
        title: "Policy Generated Successfully",
        description: "AI-powered policy draft has been created and saved.",
      });
      onOpenChange(false);
      form.reset();
      setFrameworks([]);
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createManualPolicyMutation = useMutation({
    mutationFn: async (data: PolicyFormData) => {
      const policyData = {
        ...data,
        content: "",
        status: "draft",
        createdBy: "Current User",
        version: "1.0",
      };
      const response = await apiRequest("POST", "/api/policies", policyData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/policies"] });
      toast({
        title: "Policy Created",
        description: "Policy template has been created successfully.",
      });
      onOpenChange(false);
      form.reset();
      setFrameworks([]);
    },
    onError: (error) => {
      toast({
        title: "Creation Failed",
        description: "Failed to create policy",
        variant: "destructive",
      });
    },
  });

  const handleFrameworkChange = (framework: string, checked: boolean) => {
    const updatedFrameworks = checked
      ? [...frameworks, framework]
      : frameworks.filter(f => f !== framework);
    
    setFrameworks(updatedFrameworks);
    form.setValue("frameworks", updatedFrameworks);
  };

  const handleGenerateWithAI = async () => {
    const data = form.getValues();
    // Update the frameworks in form data
    form.setValue("frameworks", frameworks);
    
    // Trigger validation
    const isValid = await form.trigger();
    
    if (isValid && frameworks.length > 0) {
      generatePolicyMutation.mutate({ ...data, frameworks });
    } else {
      if (frameworks.length === 0) {
        toast({
          title: "Validation Error",
          description: "Please select at least one compliance framework.",
          variant: "destructive",
        });
      }
    }
  };

  const handleCreateManually = async () => {
    const data = form.getValues();
    // Update the frameworks in form data
    form.setValue("frameworks", frameworks);
    
    // Trigger validation
    const isValid = await form.trigger();
    
    if (isValid && frameworks.length > 0) {
      createManualPolicyMutation.mutate({ ...data, frameworks });
    } else {
      if (frameworks.length === 0) {
        toast({
          title: "Validation Error",
          description: "Please select at least one compliance framework.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Policy</DialogTitle>
        </DialogHeader>
        
        <form className="space-y-6">
          <div>
            <Label htmlFor="type">Policy Type</Label>
            <Select onValueChange={(value) => form.setValue("type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a policy type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="privacy">Privacy Policy</SelectItem>
                <SelectItem value="security">Security Policy</SelectItem>
                <SelectItem value="data-processing">Data Processing Policy</SelectItem>
                <SelectItem value="ai-governance">AI Governance Policy</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.type && (
              <p className="text-sm text-error mt-1">{form.formState.errors.type.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="title">Policy Title</Label>
            <Input
              id="title"
              placeholder="Enter policy title"
              {...form.register("title")}
            />
            {form.formState.errors.title && (
              <p className="text-sm text-error mt-1">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div>
            <Label>Framework Compliance</Label>
            <div className="space-y-2 mt-2">
              {[
                { id: "gdpr", label: "GDPR" },
                { id: "soc2", label: "SOC 2" },
                { id: "ai-act", label: "EU AI Act" },
              ].map((framework) => (
                <div key={framework.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={framework.id}
                    checked={frameworks.includes(framework.id)}
                    onCheckedChange={(checked) => 
                      handleFrameworkChange(framework.id, checked as boolean)
                    }
                  />
                  <Label htmlFor={framework.id}>{framework.label}</Label>
                </div>
              ))}
            </div>
            {form.formState.errors.frameworks && (
              <p className="text-sm text-error mt-1">{form.formState.errors.frameworks.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={4}
              placeholder="Describe the policy purpose and scope"
              {...form.register("description")}
            />
            {form.formState.errors.description && (
              <p className="text-sm text-error mt-1">{form.formState.errors.description.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-4 pt-4">
            <Button
              type="button"
              onClick={handleGenerateWithAI}
              disabled={generatePolicyMutation.isPending}
              className="flex-1"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              {generatePolicyMutation.isPending ? "Generating..." : "Generate with AI"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCreateManually}
              disabled={createManualPolicyMutation.isPending}
              className="flex-1"
            >
              <FileText className="w-4 h-4 mr-2" />
              Create Manually
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
