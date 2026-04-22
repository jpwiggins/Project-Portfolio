import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-gray-600 text-sm">
          <p>&copy; 2025 Total Wellness on a Budget. Your complete AI-powered health transformation companion.</p>
          <div className="mt-4 space-x-6">
            <Link href="/privacy" data-testid="link-privacy" className="hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="/terms" data-testid="link-terms" className="hover:text-primary">
              Terms of Service
            </Link>
            <Link href="/contact" data-testid="link-contact" className="hover:text-primary">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
