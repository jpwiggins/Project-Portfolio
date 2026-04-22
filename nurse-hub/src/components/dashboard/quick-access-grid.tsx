import { Link } from "wouter";
import { Clock, Search, BriefcaseMedical, Heart, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function QuickAccessGrid() {
  return (
    <div className="space-y-6">
      {/* Quick Access Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 9-Minute Clinical Consult */}
        <Card className="hover-lift cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Clock className="text-primary" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary">9-Minute Clinical Consult</h3>
                <p className="text-text-secondary text-sm">Quick clinical decision support</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-text-primary">Most Recent:</span>
                  <span className="text-xs text-text-secondary">2 hours ago</span>
                </div>
                <p className="text-sm text-text-secondary mt-1">Acute chest pain protocol</p>
              </div>
              <Link href="/consult">
                <Button className="w-full bg-primary text-white hover:bg-primary/90">
                  Start New Consult
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Visual Diagnostics */}
        <Card className="hover-lift cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Search className="text-secondary" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary">Visual Diagnostics</h3>
                <p className="text-text-secondary text-sm">Image-based symptom checker</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="w-full h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-text-secondary text-sm">Upload image for analysis</span>
              </div>
              <Link href="/diagnostic">
                <Button className="w-full bg-secondary text-white hover:bg-secondary/90">
                  Upload & Analyze
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Clinical References */}
        <Card className="hover-lift cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <BriefcaseMedical className="text-accent" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary">Clinical References</h3>
                <p className="text-text-secondary text-sm">Drug info & protocols</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="relative">
                <Input 
                  placeholder="Search medications, protocols..." 
                  className="pr-10"
                />
                <Search className="absolute right-3 top-3 h-4 w-4 text-text-secondary" />
              </div>
              <div className="text-xs text-text-secondary">
                Recent: Metformin, Hypertension protocol, Wound care
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wellness & Translation Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mental Health Support */}
        <Card className="bg-gradient-to-br from-success/10 to-success/5 border border-success/20">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center">
                <Heart className="text-success" size={18} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary">Mental Health Support</h3>
                <p className="text-text-secondary text-sm">Your wellness matters</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-text-primary">Stress Level Check</span>
                  <span className="text-success text-sm">85% Good</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-success h-2 rounded-full" style={{width: "85%"}}></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Link href="/wellness">
                  <Button variant="outline" className="w-full p-3 h-auto flex-col">
                    <span className="text-success text-lg mb-1">🧘</span>
                    <span className="text-xs font-medium text-text-primary">Quick Meditation</span>
                  </Button>
                </Link>
                <Link href="/wellness">
                  <Button variant="outline" className="w-full p-3 h-auto flex-col">
                    <span className="text-success text-lg mb-1">📞</span>
                    <span className="text-xs font-medium text-text-primary">Crisis Support</span>
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Translation Tool */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                <Globe className="text-accent" size={18} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary">Medical Translation</h3>
                <p className="text-text-secondary text-sm">20+ languages available</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Select defaultValue="english">
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="From" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="mandarin">Mandarin</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="spanish">
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="To" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="mandarin">Mandarin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Select defaultValue="how-feeling">
                <SelectTrigger>
                  <SelectValue placeholder="Select phrase" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="how-feeling">How are you feeling today?</SelectItem>
                  <SelectItem value="pain-level">Please describe your pain level</SelectItem>
                  <SelectItem value="symptoms-start">When did your symptoms start?</SelectItem>
                  <SelectItem value="allergies">Do you have any allergies?</SelectItem>
                  <SelectItem value="take-medication">Please take this medication</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-text-primary font-medium mb-1">Translation:</p>
                <p className="text-text-secondary">"¿Cómo se siente hoy?"</p>
                <Button 
                  size="sm" 
                  className="mt-2 bg-accent text-white hover:bg-accent/90"
                >
                  🔊 Play Audio
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
