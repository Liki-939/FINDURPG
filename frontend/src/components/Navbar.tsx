"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, LogOut, LayoutDashboard, PlusCircle, Menu, X, ArrowRight } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Immediate check on mount
    const savedRole = localStorage.getItem("role");
    setRole(savedRole);
    setAuthLoaded(true);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("role");
    setRole(null);
    setAuthLoaded(true);
    router.push("/");
  };

  const navLinks = [
    { name: "Home", href: "/", icon: <Home className="w-4 h-4" /> },
  ];

  if (role === "ADMIN") {
    navLinks.push({ name: "Admin Dashboard", href: "/admin", icon: <LayoutDashboard className="w-4 h-4" /> });
  } else if (role === "VENDOR") {
    navLinks.push({ name: "My Dashboard", href: "/vendor", icon: <LayoutDashboard className="w-4 h-4" /> });
    navLinks.push({ name: "Add Listing", href: "/add-listing", icon: <PlusCircle className="w-4 h-4" /> });
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm py-3" 
          : "bg-transparent border-b border-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-3 group h-11">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-all">
                P
              </div>
              <span className="font-black text-xl tracking-tighter text-foreground group-hover:text-primary transition-colors hidden sm:block">
                FINDURPG
              </span>
            </Link>
          </div>

          {/* Centered Navigation */}
          <nav className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2 p-1 bg-surface-hover/80 dark:bg-surface/80 backdrop-blur-md rounded-2xl border border-border/50 shadow-lg h-11">
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`flex items-center gap-2.5 px-4 h-9 rounded-xl text-[13px] font-black uppercase tracking-wider transition-all ${
                  pathname === link.href 
                    ? "bg-surface text-primary shadow-sm" 
                    : "text-muted hover:text-foreground hover:bg-surface/50"
                }`}
              >
                <span className="flex items-center justify-center w-4 h-4">{link.icon}</span>
                <span className="leading-none">{link.name}</span>
              </Link>
            ))}
          </nav>

          {/* Actions Section */}
          <div className="flex items-center gap-3">
            <div className="h-11 flex items-center">
              <ThemeToggle />
            </div>
            
            <div className="hidden md:flex items-center gap-3 border-l border-border pl-3 ml-1 h-11 min-w-[120px] justify-end">
              {!authLoaded ? (
                <div className="h-4 w-20 bg-surface-hover animate-pulse rounded-lg"></div>
              ) : role ? (
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-5 h-9 rounded-xl bg-surface border border-border text-[12px] font-black uppercase tracking-widest text-foreground hover:border-red-500/50 hover:text-red-500 transition-all shadow-sm active:scale-95"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              ) : (
                <>
                  <Link href="/login" className="text-[12px] font-black uppercase tracking-widest text-muted hover:text-foreground transition-colors px-4">
                    Log in
                  </Link>
                  <Link 
                    href="/signup" 
                    className="px-6 h-9 rounded-xl bg-primary hover:bg-primary-hover text-white text-[12px] font-black uppercase tracking-widest transition-all shadow-md hover:shadow-lg shadow-primary/20 flex items-center gap-2 active:scale-95"
                  >
                    Get Started <ArrowRight className="w-4 h-4" />
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                className="p-2.5 rounded-xl bg-surface-hover border border-border text-foreground hover:border-primary transition"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-t border-border overflow-hidden"
          >
            <div className="px-4 py-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                    pathname === link.href 
                      ? "bg-primary/10 text-primary border border-primary/20" 
                      : "text-muted hover:text-foreground hover:bg-surface-hover"
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
              
              <div className="mt-4 pt-4 border-t border-border flex flex-col gap-3">
                {role ? (
                  <button 
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-surface-hover border border-border text-base font-medium text-red-500 hover:bg-red-500/10 transition-all"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center w-full px-5 py-3 rounded-xl bg-surface-hover border border-border text-foreground font-medium">
                      Log in
                    </Link>
                    <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center w-full px-5 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary-hover shadow-lg shadow-primary/20">
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
