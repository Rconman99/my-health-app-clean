import React from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import exercises from '../data/exercises';

const ExerciseSelector = ({ onSelect }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.itemContainer} onPress={() => onSelect(item)}>
      <Text style={styles.itemText}>
        {item.emoji} {item.name} <Text style={styles.subText}>({item.category})</Text>
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={exercises}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

export default ExerciseSelector;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  itemContainer: {
    backgroundColor: '#f1f1f1',
    padding: 12,
    borderRadius: 8,
  },
  itemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  subText: {
    fontSize: 14,
    color: '#666',
  },
  separator: {
    height: 10,
  },
});