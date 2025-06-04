import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const supersetColors = {
  A: '#FF6B6B',
  B: '#4ECDC4',
  C: '#FFD93D',
  D: '#1A535C',
  E: '#FF9F1C',
};

const getSupersetLabel = (key) => {
  if (!key) return 'Individual Exercise';
  return `Superset ${key}`;
};

const getSupersetColor = (key) => {
  return supersetColors[key] || '#888'; // fallback to gray
};

const WorkoutGroupSelector = ({ groupKey }) => {
  const label = getSupersetLabel(groupKey);
  const color = getSupersetColor(groupKey);

  return (
    <View
      style={[styles.groupHeader, { backgroundColor: color }]}
      accessible={true}
      accessibilityRole="header"
      accessibilityLabel={label}
    >
      <Text style={styles.groupHeaderText}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  groupHeader: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  groupHeaderText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
  },
});

export default WorkoutGroupSelector;