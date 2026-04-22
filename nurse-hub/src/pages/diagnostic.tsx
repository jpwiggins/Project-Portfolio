import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Search, Eye, AlertTriangle } from "lucide-react";

export default function Diagnostic() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const { data: conditions, isLoading } = useQuery({
    queryKey: ["/api/clinical/conditions", searchQuery],
    enabled: !!searchQuery,
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const commonConditions = [
    {
      name: "Dermatitis",
      category: "Skin",
      symptoms: ["Redness", "Itching", "Scaling", "Inflammation"],
      description: "Inflammatory skin condition with various causes including allergic reactions, irritants, and genetic factors.",
      severity: "mild"
    },
    {
      name: "Cellulitis",
      category: "Skin",
      symptoms: ["Swelling", "Warmth", "Redness", "Pain", "Fever"],
      description: "Bacterial skin infection that can spread rapidly and requires immediate treatment.",
      severity: "high"
    },
    {
      name: "Pressure Ulcer",
      category: "Wound",
      symptoms: ["Skin breakdown", "Discoloration", "Pain", "Drainage"],
      description: "Localized injury to skin and underlying tissue over bony prominence.",
      severity: "medium"
    },
    {
      name: "Venous Stasis",
      category: "Vascular",
      symptoms: ["Leg swelling", "Skin discoloration", "Ulceration", "Pain"],
      description: "Poor venous circulation leading to skin changes and potential ulceration.",
      severity: "medium"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'mild': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-neutral">
      <Sidebar />
      
      <div className="lg:ml-72 min-h-screen">
        <Header 
          title="Visual Diagnostics"
          subtitle="Image-based symptom checker and visual differential diagnosis tool"
        />
        
        <main className="p-4 lg:p-6 space-y-6">
          {/* Image Upload Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload size={20} />
                <span>Upload Medical Image</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                {selectedImage ? (
                  <div className="space-y-4">
                    <div className="mx-auto w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Eye size={32} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">{selectedImage.name}</p>
                      <p className="text-sm text-text-secondary">
                        {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <div className="flex space-x-2 justify-center">
                      <Button>Analyze Image</Button>
                      <Button variant="outline" onClick={() => setSelectedImage(null)}>
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload size={48} className="mx-auto text-gray-400" />
                    <div>
                      <p className="text-lg font-medium text-text-primary">Upload an image for analysis</p>
                      <p className="text-text-secondary">
                        Supports JPG, PNG, and other common image formats
                      </p>
                    </div>
                    <label htmlFor="image-upload">
                      <Button asChild>
                        <span>Choose File</span>
                      </Button>
                    </label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
              
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="text-yellow-600 mt-0.5" size={16} />
                  <div className="text-sm">
                    <p className="font-medium text-yellow-800">Educational Use Only</p>
                    <p className="text-yellow-700">
                      This tool is for educational purposes and should not replace professional medical diagnosis. 
                      Always consult with a healthcare provider for accurate diagnosis and treatment.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search Conditions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search size={20} />
                <span>Search Conditions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Input
                  placeholder="Search by condition name, symptoms, or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
                <Search className="absolute right-3 top-3 h-4 w-4 text-text-secondary" />
              </div>
              
              {searchQuery && (
                <div className="mt-4">
                  {isLoading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto" />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {Array.isArray(conditions) && conditions.length > 0 ? (
                        conditions.map((condition: any) => (
                          <Card key={condition.id} className="hover-lift cursor-pointer">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-semibold text-text-primary">{condition.name}</h4>
                                <Badge variant="outline">{condition.category}</Badge>
                              </div>
                              <p className="text-sm text-text-secondary line-clamp-2">{condition.description}</p>
                              {condition.symptoms && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                  {condition.symptoms.slice(0, 3).map((symptom: string, index: number) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {symptom}
                                    </Badge>
                                  ))}
                                  {condition.symptoms.length > 3 && (
                                    <Badge variant="secondary" className="text-xs">
                                      +{condition.symptoms.length - 3} more
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <p className="text-text-secondary text-center py-4">No conditions found for "{searchQuery}"</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Common Conditions */}
          <div>
            <h2 className="text-xl font-semibold text-text-primary mb-4">Common Conditions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {commonConditions.map((condition, index) => (
                <Card key={index} className="hover-lift cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{condition.name}</CardTitle>
                      <Badge variant={getSeverityColor(condition.severity)}>
                        {condition.severity}
                      </Badge>
                    </div>
                    <Badge variant="outline" className="w-fit">
                      {condition.category}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-text-secondary">{condition.description}</p>
                      
                      <div>
                        <p className="text-sm font-medium text-text-primary mb-2">Common Symptoms:</p>
                        <div className="flex flex-wrap gap-1">
                          {condition.symptoms.map((symptom, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {symptom}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <Button size="sm" variant="outline" className="w-full">
                        View Details & Images
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h2 className="text-xl font-semibold text-text-primary mb-4">Browse by Category</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                'Skin', 'Wound', 'Vascular', 'Respiratory', 
                'Cardiac', 'Neurological', 'Pediatric', 'Geriatric'
              ].map((category) => (
                <Button
                  key={category}
                  variant="outline"
                  className="p-4 h-auto flex-col"
                  onClick={() => setSearchQuery(category)}
                >
                  <span className="text-sm font-medium">{category}</span>
                </Button>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
