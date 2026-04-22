import { Link } from "wouter";

export function Header() {
  return (
    <header className="main-header sticky top-0 z-50">
      <img 
        src="/assets/IMG_7593_1754519435815.png" 
        alt="BudgetBites Logo" 
        className="logo"
        onError={(e) => {
          console.log('Logo image failed to load');
          e.currentTarget.style.display = 'none';
        }}
      />
      <div className="header-text">
        Everyone has a premium account for a budget price — we value your health.
      </div>
      <Link href="/login" className="login-link">
        Login
      </Link>
    </header>
  );
}