/**
 * Theme Context for manual theme control
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {createContext, useContext, useEffect, useState} from "react";
import {useColorScheme as useSystemColorScheme} from "react-native";

type ThemeMode = "light" | "dark" | "system";

interface ThemeContextType {
     themeMode: ThemeMode;
     currentTheme: "light" | "dark";
     setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "@todo_app:theme_mode";

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({
     children,
}) => {
     const systemColorScheme = useSystemColorScheme();
     const [themeMode, setThemeModeState] = useState<ThemeMode>("system");

     // Load saved theme preference
     useEffect(() => {
          const loadTheme = async () => {
               try {
                    const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
                    if (
                         saved &&
                         (saved === "light" ||
                              saved === "dark" ||
                              saved === "system")
                    ) {
                         setThemeModeState(saved as ThemeMode);
                    }
               } catch (error) {
                    console.error("Error loading theme:", error);
               }
          };
          loadTheme();
     }, []);

     // Save theme preference
     const setThemeMode = async (mode: ThemeMode) => {
          try {
               await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
               setThemeModeState(mode);
          } catch (error) {
               console.error("Error saving theme:", error);
          }
     };

     // Determine current theme
     const currentTheme =
          themeMode === "system" ? systemColorScheme ?? "light" : themeMode;

     const value: ThemeContextType = {
          themeMode,
          currentTheme,
          setThemeMode,
     };

     return (
          <ThemeContext.Provider value={value}>
               {children}
          </ThemeContext.Provider>
     );
};

export const useTheme = (): ThemeContextType => {
     const context = useContext(ThemeContext);
     if (context === undefined) {
          throw new Error("useTheme must be used within a ThemeProvider");
     }
     return context;
};
