import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ThemeButtonSimple() {
  // Force dark mode on click - simplest approach for now
  const toggleTheme = () => {
    const root = window.document.documentElement;
    
    // Check if currently in dark mode
    const isDark = root.classList.contains("dark");
    
    // Toggle classes
    if (isDark) {
      root.classList.remove("dark");
      root.classList.add("light");
      localStorage.setItem("konvertit-theme", "light");
      console.log("Theme set to light (direct)");
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
      localStorage.setItem("konvertit-theme", "dark");
      console.log("Theme set to dark (direct)");
    }
  };

  // Determine current theme
  const isDark = typeof window !== "undefined" 
    ? document.documentElement.classList.contains("dark") 
    : false;

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={toggleTheme}
      className="rounded-full"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}