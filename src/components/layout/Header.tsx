"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Resources", href: "/resources" },
    { name: "FAQs", href: "/faq" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-white py-5"
      }`}
    >
      <div className="container mx-auto px-4 max-w-7xl flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-navy font-heading tracking-tight">
            A to Z <span className="text-gold">Academic Help</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-gold ${
                pathname === link.href ? "text-gold" : "text-navy"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link 
            href="?book=true" 
            className="bg-gold text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-gold/90 transition-colors shadow-sm hover:shadow-md"
          >
            Book a Consultation
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden text-navy"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-gray-100 py-4 px-4 flex flex-col space-y-4">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`text-base font-medium p-2 rounded-md ${
                pathname === link.href ? "bg-gray-50 text-gold" : "text-navy"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link 
            href="?book=true" 
            onClick={() => setMobileMenuOpen(false)}
            className="bg-gold text-white px-5 py-3 rounded-lg text-center font-bold"
          >
            Book a Consultation
          </Link>
        </div>
      )}
    </header>
  );
}
