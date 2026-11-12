"use client";

import React, { useState, useEffect } from "react";
import { Menu, X, ArrowRight, Sparkles, Store, ShoppingBag } from "lucide-react";
import { Logo } from "./Logo";

interface NavbarProps {
  onOpenCreateStore: (initialHandle?: string) => void;
  onOpenLogin: () => void;
}

export function Navbar({ onOpenCreateStore, onOpenLogin }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Demo Store", href: "#demo-storefront" },
    { label: "Pricing", href: "#pricing" },
  ];

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-[#FBFBFA]/90 backdrop-blur-md border-b border-stone-200/70 shadow-subtle py-3.5"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a
              href="#"
              className="group transition-transform active:scale-95"
              aria-label="SellNest Home"
            >
              <Logo size="md" />
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 bg-stone-100/70 p-1 rounded-full border border-stone-200/60 shadow-inner-glow">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleScrollTo(e, link.href)}
                  className="px-4 py-1.5 text-xs lg:text-sm font-medium text-charcoal-700 hover:text-charcoal-950 rounded-full hover:bg-white/80 transition-all duration-150"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Right CTAs */}
            <div className="hidden md:flex items-center space-x-3">
              <a
                href="/login"
                className="text-xs lg:text-sm font-semibold text-charcoal-700 hover:text-charcoal-950 px-3.5 py-2 rounded-full hover:bg-stone-100 transition-colors"
              >
                Login
              </a>
              <a
                href="/signup"
                className="group relative inline-flex items-center gap-1.5 bg-charcoal-900 hover:bg-charcoal-950 text-white text-xs lg:text-sm font-semibold px-4 lg:px-5 py-2.5 rounded-full shadow-sm hover:shadow-purple-glow transition-all duration-200 active:scale-98"
              >
                <span>Get Started</span>
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 group-hover:scale-125 transition-transform" />
                <ArrowRight className="w-3.5 h-3.5 text-stone-300 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex items-center gap-2 md:hidden">
              <a
                href="/signup"
                className="bg-charcoal-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full"
              >
                Start Free
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl text-charcoal-700 hover:bg-stone-100 transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#FBFBFA] border-b border-stone-200/80 px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col space-y-2 pt-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleScrollTo(e, link.href)}
                  className="px-4 py-2.5 text-sm font-medium text-charcoal-800 hover:bg-stone-100 rounded-xl transition-colors flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
                </a>
              ))}
              <div className="pt-3 border-t border-stone-200 flex flex-col gap-2">
                <a
                  href="/login"
                  className="w-full text-center py-2.5 text-sm font-medium text-charcoal-700 bg-stone-100 rounded-xl hover:bg-stone-200 transition-colors"
                >
                  Login
                </a>
                <a
                  href="/signup"
                  className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-purple-700 hover:bg-purple-800 rounded-xl shadow-purple-glow"
                >
                  <span>Create your free store</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

