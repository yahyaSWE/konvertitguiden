/*
 * DEPRECATED: Please use @/components/ui/theme-provider instead
 * This file is kept for backward compatibility but should not be used in new code
 */

import React, { createContext, useContext } from 'react';
import { useTheme as useShadcnTheme } from '@/components/ui/theme-provider';

type Theme = 'light' | 'dark';

interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use the shadcn theme provider under the hood
  const { theme, setTheme } = useShadcnTheme();
  
  const toggleTheme = () => {
    console.log("Legacy theme toggle called, current theme:", theme);
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextProps => {
  // Use the shadcn theme hook under the hood
  const { theme, setTheme } = useShadcnTheme();
  
  return {
    theme,
    toggleTheme: () => {
      console.log("Legacy useTheme.toggleTheme called, current theme:", theme);
      setTheme(theme === 'light' ? 'dark' : 'light');
    }
  };
};