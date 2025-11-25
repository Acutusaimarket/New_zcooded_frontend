import { createContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

export const ThemeProviderContext =
  createContext<ThemeProviderState>(initialState);

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Force light theme always - ignore localStorage and system preferences
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const root = window.document.documentElement;

    // Always remove both classes first
    root.classList.remove("light", "dark");

    // Always add light theme class regardless of theme state
    root.classList.add("light");
  }, [theme]);

  const value = {
    theme: "light" as Theme, // Always return light theme
    setTheme: (_theme: Theme) => {
      // Don't save to localStorage and don't change the theme
      // Always keep it as light mode
      setTheme("light");
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
