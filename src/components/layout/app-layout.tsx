import { useState } from "react";
import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Home, BookOpen, Star, User, Settings, LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";
import ThemeButtonSimple from "@/components/theme-button-simple";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isLoading, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold">Not Authorized</h1>
          <p className="text-gray-500 mt-2">Please log in to access this page</p>
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm md:hidden">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-primary rounded-md p-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h1 className="text-lg font-poppins font-bold text-textColor dark:text-white">Konvertit Guiden</h1>
          </div>
          <div className="flex items-center space-x-2">
            <ThemeButtonSimple />
            <button
              type="button"
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed top-0 left-0 w-3/4 h-full bg-white dark:bg-gray-900 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl font-poppins font-bold dark:text-white">Konvertit Guiden</h1>
              <button
                type="button"
                className="p-1 dark:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <a href="/dashboard" className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800">
                <Home className="w-5 h-5 mr-3" />
                Hem
              </a>
              <a href="/courses" className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800">
                <BookOpen className="w-5 h-5 mr-3" />
                Kurser
              </a>
              <a href="/achievements" className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800">
                <Star className="w-5 h-5 mr-3" />
                Prestationer
              </a>
              <a href="/profile" className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800">
                <User className="w-5 h-5 mr-3" />
                Profil
              </a>
              <a href="/settings" className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800">
                <Settings className="w-5 h-5 mr-3" />
                Inställningar
              </a>
              <div className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800">
                <Moon className="w-5 h-5 mr-3" />
                <button
                  onClick={() => {
                    const root = window.document.documentElement;
                    const isDark = root.classList.contains("dark");
                    
                    if (isDark) {
                      root.classList.remove("dark");
                      root.classList.add("light");
                      localStorage.setItem("konvertit-theme", "light");
                      console.log("Theme set to light (direct from mobile menu)");
                    } else {
                      root.classList.remove("light");
                      root.classList.add("dark");
                      localStorage.setItem("konvertit-theme", "dark");
                      console.log("Theme set to dark (direct from mobile menu)");
                    }
                  }}
                  className="w-full text-left"
                >
                  Byt tema
                </button>
              </div>
              <button 
                onClick={logout}
                className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-red-600"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logga ut
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Navigation (Desktop) */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-background">
        {children}
      </main>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
}