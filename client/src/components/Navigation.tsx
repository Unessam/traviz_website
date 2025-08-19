import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import travizLogo from "@assets/traviz_logo_no_background_1755634682120.png";

interface NavigationProps {
  showAdmin?: boolean;
}

export default function Navigation({ showAdmin = false }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "#home", label: "Home" },
    { href: "#services", label: "Services" },
    { href: "#products", label: "Products" },
    { href: "#case-studies", label: "Case Studies" },
    { href: "#about", label: "About" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-0 w-full bg-off-white/95 backdrop-blur-md z-50 border-b border-cool-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img 
              src={travizLogo}
              alt="Traviz Logo"
              className="w-8 h-8"
            />
            <span className="text-2xl font-bold gradient-text">Traviz</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-charcoal hover:text-logo-purple transition-colors duration-300 font-medium"
                data-testid={`nav-link-${item.label.toLowerCase()}`}
              >
                {item.label}
              </a>
            ))}
            {showAdmin && (
              <a
                href="/admin"
                className="bg-logo-purple text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all duration-300 font-medium"
                data-testid="nav-link-admin"
              >
                Admin
              </a>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-charcoal" />
              ) : (
                <Menu className="h-6 w-6 text-charcoal" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-off-white border-t border-cool-gray">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block px-3 py-2 text-charcoal hover:text-logo-purple transition-colors duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
                data-testid={`mobile-nav-link-${item.label.toLowerCase()}`}
              >
                {item.label}
              </a>
            ))}
            {showAdmin && (
              <a
                href="/admin"
                className="block px-3 py-2 bg-logo-purple text-white rounded-lg mx-3 text-center"
                onClick={() => setIsMobileMenuOpen(false)}
                data-testid="mobile-nav-link-admin"
              >
                Admin
              </a>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
