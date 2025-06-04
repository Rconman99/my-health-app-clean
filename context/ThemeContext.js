// utils/themecontext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';

const STORAGE_KEY = 'user-theme-preference';
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  // Load theme preference on mount
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved !== null) {
          setDarkMode(saved === 'dark');
        }
      } catch (e) {
        console.warn('Failed to load theme preference:', e);
      }
    };
    loadThemePreference();
  }, []);

  // Persist theme preference
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, darkMode ? 'dark' : 'light').catch((err) =>
      console.warn('Failed to save theme preference:', err)
    );
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  const baseTheme = darkMode ? DarkTheme : DefaultTheme;

  const extendedTheme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      textSecondary: darkMode ? '#ccc' : '#555',
      backgroundSoft: darkMode ? '#121212' : '#f9f9f9',
    },
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme, theme: extendedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);