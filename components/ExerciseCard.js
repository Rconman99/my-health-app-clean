import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';

const ExerciseCard = ({ exercise, onUpdate, onRemove }) => {
  const handleRoundChange = (index, field, value) => {
    const updatedRounds = exercise.rounds.map((round, i) =>
      i === index ? { ...round, [field]: value } : round
    );
    onUpdate(exercise.id, { rounds: updatedRounds });
  };

  const handleAddRound = () => {
    const updatedRounds = [...(exercise.rounds || []), { sets: '', reps: '', weight: '' }];
    onUpdate(exercise.id, { rounds: updatedRounds });
  };

  const handleRemoveRound = (index) => {
    const updatedRounds = exercise.rounds.filter((_, i) => i !== index);
    onUpdate(exercise.id, { rounds: updatedRounds });
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{exercise.emoji} {exercise.name}</Text>
        <Text style={styles.category}>{exercise.category} | {exercise.level}</Text>
      </View>

      <View style={styles.details}>
        {Array.isArray(exercise.rounds) && exercise.rounds.length > 0 ? (
          exercise.rounds.map((round, index) => (
            <View key={index} style={styles.roundRow}>
              <Text style={styles.roundLabel}>Round {index + 1}</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Sets"
                value={round.sets?.toString() || ''}
                onChangeText={(text) => handleRoundChange(index, 'sets', text)}
              />
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Reps"
                value={round.reps?.toString() || ''}
                onChangeText={(text) => handleRoundChange(index, 'reps', text)}
              />
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Weight"
                value={round.weight?.toString() || ''}
                onChangeText={(text) => handleRoundChange(index, 'weight', text)}
              />
              <TouchableOpacity onPress={() => handleRemoveRound(index)}>
                <Text style={styles.removeRoundText}>Remove</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.detail}>No rounds added yet.</Text>
        )}

        <TouchableOpacity
          onPress={handleAddRound}
          style={styles.addRoundButton}
          accessibilityLabel="Add round"
        >
          <Text style={styles.addRoundText}>+ Add Round</Text>
        </TouchableOpacity>

        {exercise.notes ? (
          <Text style={styles.notes}>📝 {exercise.notes}</Text>
        ) : null}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          onPress={() => onRemove(exercise.id)}
          style={styles.removeButton}
          accessibilityLabel="Remove exercise"
        >
          <Text style={styles.buttonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f2f2f2',
    padding: 16,
    borderRadius: 12,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  category: {
    fontSize: 14,
    color: '#666',
  },
  details: {
    marginTop: 6,
  },
  roundRow: {
    marginBottom: 10,
  },
  roundLabel: {
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    marginBottom: 4,
  },
  removeRoundText: {
    color: '#FF3B30',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  addRoundButton: {
    marginTop: 8,
  },
  addRoundText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  notes: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#444',
    marginTop: 6,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  removeButton: {
    backgroundColor: '#F44336',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default ExerciseCard;