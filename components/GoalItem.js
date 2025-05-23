import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const GoalItem = ({ title }) => {
  return (
    <View style={styles.goalItem}>
      <Text style={styles.goalText}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  goalItem: {
    padding: 10,
    marginVertical: 8,
    backgroundColor: '#f1f3f5',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  goalText: {
    fontSize: 16,
    color: '#333333',
  },
});

export default GoalItem;