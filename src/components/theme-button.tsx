import React from 'react';
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ui/theme-provider";

export const ThemeButton = () => {
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    console.log("Current theme:", theme);
    const newTheme = theme === "dark" ? "light" : "dark";
    console.log("Setting theme to:", newTheme);
    setTheme(newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
      aria-label={theme === 'light' ? 'Byt till mörkt läge' : 'Byt till ljust läge'}
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </button>
  );
};

export default ThemeButton;