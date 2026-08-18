"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Compass, 
  Layers, 
  Menu, 
  X, 
  ArrowRight,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/ui/footer";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = pathname === "/admin" || pathname?.startsWith("/admin");

  const navLinks = [
    { label: "Home", href: "/", icon: Compass },
    { label: "Assessments", href: "/test", icon: Layers },
    { label: "Career Guide", href: "/career-guidance-test", icon: BookOpen },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Main Sticky Header */}
      <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 relative flex items-center justify-between">
          {/* Logo & Brand (Left) */}
          <Link href="/" className="flex items-center gap-3 group z-10">
            <img 
              src="/logo.jpeg" 
              alt="ATDC Logo" 
              className="h-11 sm:h-12 w-auto object-contain rounded-lg shadow-xs group-hover:scale-105 transition-transform duration-200" 
            />
            <div className="flex flex-col">
              <span className="font-black text-xl tracking-tight text-[#0f2c59]">
                ATDC
              </span>
              <span className="text-[11px] text-slate-500 font-medium tracking-tight -mt-0.5 hidden sm:inline-block">
                Advanced Training &amp; Development Consultant
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links (Perfect Center Alignment via Absolute Positioning) */}
          <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-1 bg-slate-100/90 p-1.5 rounded-full border border-slate-200/70 shadow-xs">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-white text-[#0f2c59] shadow-xs"
                      : "text-slate-600 hover:text-[#0f2c59] hover:bg-white/50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action CTA & Mobile Toggle */}
          <div className="flex items-center gap-3 z-10">
            {!isAdmin && (
              <Link href="/test" className="hidden lg:inline-flex">
                <Button className="bg-[#0f2c59] hover:bg-[#1e3a8a] text-white text-sm font-semibold px-5 h-10 shadow-sm rounded-full flex items-center gap-2 transition-all hover:scale-105">
                  Take a Test
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-5 space-y-2 shadow-lg animate-in slide-in-from-top-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-semibold ${
                    isActive
                      ? "bg-blue-50 text-[#0f2c59]"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                  {link.label}
                </Link>
              );
            })}
            {!isAdmin && (
              <div className="pt-2">
                <Link href="/test" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-[#0f2c59] hover:bg-[#1e3a8a] text-white">
                    Take an Assessment Now
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Modern Compact Footer */}
      <Footer />
    </div>
  );
}
