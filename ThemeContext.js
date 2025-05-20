// ThemeContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';

const STORAGE_KEY = 'user-theme-preference';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved !== null) {
          setDarkMode(saved === 'dark');
        }
      } catch (e) {
        console.warn('Failed to load theme preference');
      }
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, darkMode ? 'dark' : 'light').catch(() => {
      console.warn('Failed to save theme preference');
    });
  }, [darkMode]);

  const toggleTheme = () => setDarkMode((prev) => !prev);

  const theme = darkMode ? DarkTheme : DefaultTheme;

  const extendedTheme = {
    ...theme,
    colors: {
      ...theme.colors,
      textSecondary: darkMode ? '#ccc' : '#555',
    },
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme, theme: extendedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);