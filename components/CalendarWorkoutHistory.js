import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

const ExerciseCard = ({ exercise, index, onChange, onRemove, onEditName }) => {
  const handleInputChange = (field, value) => {
    onChange(index, { ...exercise, [field]: value });
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => onEditName(index)} accessibilityLabel="Edit exercise name">
        <Text style={styles.name}>{exercise.emoji} {exercise.name}</Text>
      </TouchableOpacity>
      <View style={styles.row}>
        <Text style={styles.label}>Sets</Text>
        <TextInput
          style={styles.input}
          value={exercise.sets?.toString() || ''}
          keyboardType="numeric"
          onChangeText={(text) => handleInputChange('sets', parseInt(text) || 0)}
          placeholder="0"
        />
        <Text style={styles.label}>Reps</Text>
        <TextInput
          style={styles.input}
          value={exercise.reps?.toString() || ''}
          keyboardType="numeric"
          onChangeText={(text) => handleInputChange('reps', parseInt(text) || 0)}
          placeholder="0"
        />
        <Text style={styles.label}>Weight</Text>
        <TextInput
          style={styles.input}
          value={exercise.weight?.toString() || ''}
          keyboardType="numeric"
          onChangeText={(text) => handleInputChange('weight', parseFloat(text) || 0)}
          placeholder="0 lbs"
        />
      </View>
      <TouchableOpacity
        onPress={() => onRemove(index)}
        style={styles.removeButton}
        accessibilityLabel="Remove exercise"
      >
        <Text style={styles.removeText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fafafa',
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  label: {
    fontSize: 14,
    marginHorizontal: 6,
  },
  input: {
    width: 60,
    height: 36,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    marginVertical: 6,
  },
  removeButton: {
    marginTop: 12,
    backgroundColor: '#ff3b30',
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  removeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ExerciseCard;