import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Clock, Search, BriefcaseMedical, Calendar, FileText, Globe, Brain } from "lucide-react";


export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-border p-4 lg:p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src="/assets/nursehub-logo.png" 
              alt="NurseHub Logo" 
              className="h-16 w-auto"
            />
          </div>
          <Button 
            onClick={() => window.location.href = '/auth'}
            className="gradient-bg text-white hover:opacity-90"
          >
            Sign In / Register
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Clock className="w-4 h-4 mr-2" />
            3-Day Free Trial • Start Earning Immediately
          </div>

          <h1 className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6">
            Professional Reference & Mental Health
            <span className="text-purple-600"> Support Center for Nurses</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Access clinical decision support, shift scheduling, translation tools, and mental health resources - designed as a professional reference platform that doesn't require HIPAA compliance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg"
              onClick={() => window.location.href = '/auth'}
              className="gradient-bg text-white hover:opacity-90"
              data-testid="button-start-trial"
            >
              Start Free Trial
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={async () => {
                try {
                  const response = await fetch('/api/demo/login', { 
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    }
                  });
                  
                  if (response.ok) {
                    // Force page reload to refresh auth state
                    window.location.reload();
                  } else {
                    console.error('Demo login failed:', response.status);
                    alert('Demo not available. Please try the free trial instead.');
                  }
                } catch (error) {
                  console.error('Demo error:', error);
                  alert('Demo not available. Please try the free trial instead.');
                }
              }}
              data-testid="button-watch-demo"
            >
              Watch Demo
            </Button>
          </div>
          <p className="text-xs text-gray-600 mt-4">
            Admin? <a href="/admin/login" className="text-purple-600 hover:underline">Access admin panel</a>
          </p>
          
          {/* Trusted by Banner */}
          <div className="text-center text-gray-600 mb-8">
            <p className="text-sm mb-4">Trusted by nurses at leading healthcare facilities</p>
            <div className="flex justify-center items-center space-x-8 opacity-70">
              <div className="text-lg font-semibold text-gray-500">Mayo Clinic</div>
              <div className="text-lg font-semibold text-gray-500">Johns Hopkins</div>
              <div className="text-lg font-semibold text-gray-500">Kaiser Permanente</div>
              <div className="text-lg font-semibold text-gray-500">Cleveland Clinic</div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What Nurses Are Saying
            </h2>
            <p className="text-gray-600">
              Real reviews from healthcare professionals using NurseHub Pro daily
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Review 1 */}
            <Card className="p-6 bg-white">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {"★".repeat(5)}
                  </div>
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "The AI consultation feature saved me during a complex cardiac case at 3 AM. Having instant access to evidence-based protocols when the attending wasn't available was a game-changer."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <Heart className="text-purple-600" size={16} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Sarah M.</p>
                    <p className="text-sm text-gray-600">ICU Nurse, 8 years</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Review 2 */}
            <Card className="p-6 bg-white">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {"★".repeat(5)}
                  </div>
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "Finally, all my tools in one place! The scheduling feature eliminated the constant text chain chaos, and the translation tool helps me connect with colleagues and navigate clinical situations better."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <Calendar className="text-purple-600" size={16} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Maria L.</p>
                    <p className="text-sm text-gray-600">Emergency Nurse, 12 years</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Review 3 */}
            <Card className="p-6 bg-white">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {"★".repeat(5)}
                  </div>
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "The mental health resources and professional references are amazing. The wellness tracking helps me manage the stress of night shifts, and having all clinical resources in one place saves so much time."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <FileText className="text-purple-600" size={16} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Jennifer K.</p>
                    <p className="text-sm text-gray-600">Pediatric Nurse, 6 years</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Reviews */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {/* Review 4 */}
            <Card className="p-6 bg-white">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {"★".repeat(5)}
                  </div>
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "The diagnostic imaging feature helped me identify a rare skin condition during triage. The AI suggestions matched perfectly with what the dermatologist confirmed later. Incredible tool for clinical decision-making."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <Search className="text-purple-600" size={16} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">David R.</p>
                    <p className="text-sm text-gray-600">Travel Nurse, 10 years</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Review 5 */}
            <Card className="p-6 bg-white">
              <CardContent className="p-0">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {"★".repeat(5)}
                  </div>
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "As a charge nurse, the team coordination features are invaluable. I can see everyone's schedules, communicate instantly, and the wellness check-ins help me support my team's mental health during tough shifts."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                    <BriefcaseMedical className="text-purple-600" size={16} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Lisa T.</p>
                    <p className="text-sm text-gray-600">Charge Nurse, 15 years</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Section */}
          <div className="mt-16 text-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">12,000+</div>
                <div className="text-gray-600">Active Nurses</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">4.9/5</div>
                <div className="text-gray-600">Average Rating</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">99.9%</div>
                <div className="text-gray-600">Uptime</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">24/7</div>
                <div className="text-gray-600">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need in One Platform
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Built specifically for nurses by healthcare professionals. Streamline your workflow with integrated tools designed for clinical excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover-lift cursor-pointer">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="text-purple-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">9-Minute Clinical Consult</h3>
                <p className="text-gray-600 text-sm">Quick clinical decision support with searchable protocols and evidence-based guidelines.</p>
              </CardContent>
            </Card>

            <Card className="hover-lift cursor-pointer">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                  <Search className="text-pink-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Visual Diagnostics</h3>
                <p className="text-gray-600 text-sm">Image-based symptom checker with visual differential diagnosis support.</p>
              </CardContent>
            </Card>

            <Card className="hover-lift cursor-pointer">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <BriefcaseMedical className="text-blue-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Clinical References</h3>
                <p className="text-gray-600 text-sm">Comprehensive drug information, dosing guidelines, and medical protocols.</p>
              </CardContent>
            </Card>

            <Card className="hover-lift cursor-pointer">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Calendar className="text-green-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Shift Scheduling</h3>
                <p className="text-gray-600 text-sm">Integrated calendar with shift management and team communication features.</p>
              </CardContent>
            </Card>

            <Card className="hover-lift cursor-pointer">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="text-orange-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Professional Resources</h3>
                <p className="text-gray-600 text-sm">Comprehensive clinical reference library with protocols, guidelines, and educational materials.</p>
              </CardContent>
            </Card>

            <Card className="hover-lift cursor-pointer">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="text-indigo-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Medical Translation</h3>
                <p className="text-gray-600 text-sm">Pre-defined medical phrases in 20+ languages with audio playback support.</p>
              </CardContent>
            </Card>

            <Card className="hover-lift cursor-pointer">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Heart className="text-red-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Mental Health Support</h3>
                <p className="text-gray-600 text-sm">Wellness tracking, stress management tools, and crisis support resources.</p>
              </CardContent>
            </Card>

            <Card className="hover-lift cursor-pointer">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="text-purple-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Assistant</h3>
                <p className="text-gray-600 text-sm">Intelligent chatbot for clinical questions, app navigation, and instant support.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-gray-600 mb-12">
            Start free and upgrade as your needs grow
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-semibold mb-2">Free</h3>
                <div className="text-3xl font-bold mb-4">$0<span className="text-sm font-normal">/month</span></div>
                <ul className="text-left space-y-2 mb-6">
                  <li>✓ Basic clinical references</li>
                  <li>✓ Basic professional resources</li>
                  <li>✓ Translation tool (5 languages)</li>
                  <li>✓ Basic wellness tracking</li>
                </ul>
                <Button 
                  className="w-full"
                  variant="outline"
                  onClick={() => window.location.href = '/api/login'}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>

            <Card className="border-purple-600 border-2">
              <CardContent className="p-8 text-center">
                <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm mb-4">Most Popular</div>
                <h3 className="text-xl font-semibold mb-2">Pro</h3>
                <div className="text-3xl font-bold mb-4">$29<span className="text-sm font-normal">/month</span></div>
                <ul className="text-left space-y-2 mb-6">
                  <li>✓ All Free features</li>
                  <li>✓ 9-Minute Clinical Consult</li>
                  <li>✓ Visual diagnostics</li>
                  <li>✓ Advanced professional resources</li>
                  <li>✓ Full translation (20+ languages)</li>
                  <li>✓ Shift scheduling</li>
                  <li>✓ AI assistant</li>
                  <li>✓ Mental health resources</li>
                </ul>
                <Button 
                  className="w-full gradient-bg text-white hover:opacity-90"
                  onClick={() => window.location.href = '/api/login'}
                >
                  Start Pro Trial
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8 text-center">
                <h3 className="text-xl font-semibold mb-2">Team</h3>
                <div className="text-3xl font-bold mb-4">$49<span className="text-sm font-normal">/month</span></div>
                <ul className="text-left space-y-2 mb-6">
                  <li>✓ All Pro features</li>
                  <li>✓ Team communication</li>
                  <li>✓ Shared protocols</li>
                  <li>✓ Admin dashboard</li>
                  <li>✓ Usage analytics</li>
                  <li>✓ Priority support</li>
                </ul>
                <Button 
                  className="w-full gradient-bg text-white hover:opacity-90"
                  onClick={() => window.location.href = '/subscribe'}
                >
                  Get Team Plan
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <Heart className="text-white" size={16} />
            </div>
            <span className="text-lg font-semibold text-gray-900">NurseHub Pro</span>
          </div>
          <p className="text-gray-600 text-sm">
            Professional reference and mental health support platform for nurses - intentionally designed without patient data handling to eliminate HIPAA compliance requirements.
          </p>
          <div className="mt-8 text-xs text-gray-500">
            © 2024 NurseHub Pro. All rights reserved. | Privacy Policy | Terms of Service
          </div>
        </div>
      </footer>
    </div>
  );
}
