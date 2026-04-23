import { useState } from "react";
import { Link } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  return (
    <header className="main-header sticky top-0 z-50">
      {logoError ? (
        <span aria-label="BudgetBites" className="logo-fallback" style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
          BudgetBites
        </span>
      ) : (
        <img
          src="/assets/budgetbites-logo.png"
          alt="BudgetBites - Healthy Variety. Budget Friendly. Never Boring."
          className="logo"
          onError={(e) => {
            console.error('BudgetBites logo failed to load', e);
            setLogoError(true);
          }}
        />
      )}
      <div className="header-text">
        Everyone has a premium account for a budget price — we value your health.
      </div>
      <Link href="/login" className="login-link">
        Login
      </Link>
    </header>
  );
}