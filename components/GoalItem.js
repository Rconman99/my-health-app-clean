import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const GoalItem = ({ title }) => {
  return (
    <View style={styles.container} accessibilityLabel={`Goal: ${title}`}>
      <Text style={styles.text}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    marginVertical: 6,
    backgroundColor: '#E6F4EA',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#34A853',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E2E2E',
  },
});

export default GoalItem;