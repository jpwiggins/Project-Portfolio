import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateProfileRequestSchema, type GenerateProfileRequest, type BuyerProfile } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InputFormProps {
  onProfileGenerated: (profile: BuyerProfile) => void;
  onGenerationStart: () => void;
  onGenerationError: () => void;
  isGenerating: boolean;
  isAdmin?: boolean;
}

export function InputForm({ onProfileGenerated, onGenerationStart, onGenerationError, isGenerating, isAdmin = false }: InputFormProps) {
  const { toast } = useToast();
  
  const form = useForm<GenerateProfileRequest>({
    resolver: zodResolver(generateProfileRequestSchema),
    defaultValues: {
      niche: "",
      productType: "",
    },
  });

  const generateProfileMutation = useMutation({
    mutationFn: async (data: GenerateProfileRequest) => {
      const response = await apiRequest("POST", "/api/generate-profile", data);
      return response.json();
    },
    onSuccess: (data: BuyerProfile) => {
      toast({
        title: "Profile Generated Successfully!",
        description: "Your buyer profile and design recommendations are ready.",
      });
      onProfileGenerated(data);
    },
    onError: (error: Error) => {
      console.error("Generation error:", error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate buyer profile. Please check your API key and try again.",
        variant: "destructive",
      });
      onGenerationError();
    },
  });

  const onSubmit = (data: GenerateProfileRequest) => {
    if (!data.niche.trim() || !data.productType) {
      toast({
        title: "Missing Information",
        description: "Please enter both a niche and select a product type.",
        variant: "destructive",
      });
      return;
    }
    
    onGenerationStart();
    generateProfileMutation.mutate(data);
  };

  return (
    <Card className="bg-gradient-to-r from-white to-blue-50 shadow-lg border border-blue-200">
      <CardContent className="p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-3 flex items-center">
            <span className={`text-transparent bg-clip-text ${
              isAdmin 
                ? "bg-gradient-to-r from-green-600 to-emerald-600" 
                : "bg-gradient-to-r from-blue-600 to-purple-600"
            }`}>
              Generate Your Buyer Profile
            </span>
            {isAdmin && (
              <span className="ml-3 text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Admin Mode
              </span>
            )}
          </h2>
          <p className="text-slate-600 text-lg">
            {isAdmin 
              ? "Admin access: Generate unlimited buyer profiles and design recommendations." 
              : "Enter your niche and product type to create a comprehensive buyer persona and design recommendations."
            }
          </p>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="niche"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-sm font-medium text-slate-700">
                      <Target className="text-primary mr-2 h-4 w-4" />
                      Target Niche
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., Yoga enthusiasts, Dog lovers, Coffee addicts..." 
                        {...field}
                        className="border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="productType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center text-sm font-medium text-slate-700">
                      <span className="text-primary mr-2">👕</span>
                      Product Type
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-slate-300 focus:ring-2 focus:ring-primary focus:border-transparent">
                          <SelectValue placeholder="Select product type..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="t-shirt">T-Shirt</SelectItem>
                        <SelectItem value="hoodie">Hoodie</SelectItem>
                        <SelectItem value="tote-bag">Tote Bag</SelectItem>
                        <SelectItem value="mug">Mug</SelectItem>
                        <SelectItem value="poster">Poster</SelectItem>
                        <SelectItem value="phone-case">Phone Case</SelectItem>
                        <SelectItem value="sticker">Sticker</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button 
              type="submit"
              disabled={isGenerating}
              className={`w-full md:w-auto font-semibold px-8 py-4 rounded-xl shadow-lg transform transition-all hover:scale-105 ${
                isAdmin 
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white" 
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-3 border-white/30 border-t-white mr-3"></div>
                  Generating Magic...
                </>
              ) : (
                <>
                  <Sparkles className="mr-3 h-5 w-5" />
                  {isAdmin ? "Generate Buyer Profile (Admin)" : "Generate Buyer Profile"}
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
