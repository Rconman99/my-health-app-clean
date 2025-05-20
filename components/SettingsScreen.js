// SettingsScreen.js

import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { useTheme } from '../ThemeContext';

const SettingsScreen = () => {
  const { darkMode, toggleTheme, theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.label, { color: theme.colors.text }]}>Dark Mode</Text>
      <Switch
        value={darkMode}
        onValueChange={toggleTheme}
        thumbColor={darkMode ? '#007AFF' : '#f4f3f4'}
        trackColor={{ false: '#767577', true: '#81b0ff' }}
        accessibilityLabel="Toggle dark mode"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  label: { fontSize: 18, marginBottom: 10, fontWeight: '600' },
});

export default SettingsScreen;