export default function SimpleHome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-budget-yellow-50 via-budget-green-50 to-budget-orange-50 p-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <img 
            src="/assets/budgetbites-logo.png" 
            alt="BudgetBites - Healthy Variety. Budget Friendly. Never Boring." 
            className="mx-auto h-32 w-auto object-contain drop-shadow-lg"
          />
        </div>
        
        <h1 className="text-4xl font-bold text-foreground mb-6">
          Healthy Variety. Budget Friendly. Never Boring.
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8">
          Professional-grade meal plans, AI fitness coaching, and mindfulness guidance — 
          all personalized to your budget and goals.
        </p>
        
        <div className="budget-card max-w-md mx-auto">
          <h2 className="text-3xl font-bold text-budget-green-600 mb-2">$9.99/month</h2>
          <p className="text-muted-foreground mb-4">3-day free trial • Cancel anytime</p>
          <button className="healthy-button w-full py-3 text-lg">
            Start Your Healthy Journey
          </button>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="budget-card">
            <div className="w-12 h-12 bg-budget-green-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              🥗
            </div>
            <h3 className="text-lg font-semibold text-budget-green-700 mb-2">Smart Meal Plans</h3>
            <p className="text-muted-foreground">AI-powered nutrition tailored to your budget</p>
          </div>
          
          <div className="budget-card">
            <div className="w-12 h-12 bg-budget-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              💪
            </div>
            <h3 className="text-lg font-semibold text-budget-orange-700 mb-2">Fitness Coaching</h3>
            <p className="text-muted-foreground">Personalized workouts that fit your lifestyle</p>
          </div>
          
          <div className="budget-card">
            <div className="w-12 h-12 bg-budget-yellow-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              🧘
            </div>
            <h3 className="text-lg font-semibold text-budget-yellow-700 mb-2">Mindful Living</h3>
            <p className="text-muted-foreground">Mental wellness and stress management</p>
          </div>
        </div>
      </div>
    </div>
  );
}