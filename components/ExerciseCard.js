import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import exerciseLibrary from '../utils/exerciselibrary';

export default function ExerciseCard({
  exercise,
  updateWeights,
  toggleComplete,
  removeExercise,
  swapExercise,
  index,
  reorderExercise,
  timerEnabled,
  lastIndex,
}) {
  const [timer, setTimer] = useState(exercise.restTime || 60);
  const [timerActive, setTimerActive] = useState(false);
  const [customExercise, setCustomExercise] = useState(exercise.name);

  useEffect(() => {
    let interval;
    if (timerActive) {
      interval = setInterval(() => {
        setTimer((t) => {
          if (t <= 1) {
            clearInterval(interval);
            setTimerActive(false);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  const handleSwap = (newName) => {
    if (newName === customExercise) return; // prevent no-op
    const newEx = exerciseLibrary.find((e) => e.name === newName);
    if (newEx) {
      swapExercise(exercise.id, newEx);
      setCustomExercise(newName);
    }
  };

  const handleTimerToggle = () => {
    setTimerActive(!timerActive);
  };

  const handleManualTime = (text) => {
    const num = parseInt(text);
    if (!isNaN(num)) setTimer(num);
  };

  return (
    <View style={[styles.card, exercise.completed && styles.completed]}>
      <View style={styles.headerRow}>
        <Text style={styles.exerciseName}>{exercise.emoji} {customExercise}</Text>
        <TouchableOpacity
          onPress={() => toggleComplete(exercise.id)}
          accessibilityLabel={exercise.completed ? 'Mark as incomplete' : 'Mark as complete'}
        >
          <Text style={styles.completeBtn}>
            {exercise.completed ? '✅ Finished ✅' : '☐ Start This Set'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Swap Exercise:</Text>
      <View style={styles.dropdown}>
        <Picker
          selectedValue={customExercise}
          onValueChange={handleSwap}
          accessibilityLabel="Exercise swap selector"
        >
          {exerciseLibrary.map((ex) => (
            <Picker.Item key={ex.name} label={`${ex.emoji} ${ex.name}`} value={ex.name} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Weights by Round:</Text>
      {exercise.weights.map((weight, i) => (
        <TextInput
          key={i}
          placeholder={`Round ${i + 1} weight`}
          value={String(weight)}
          keyboardType="number-pad"
          onChangeText={(text) => updateWeights(exercise.id, i, text)}
          style={styles.input}
          accessibilityLabel={`Weight for round ${i + 1}`}
        />
      ))}

      {timerEnabled && (
        <>
          <Text style={styles.label}>Rest Timer: {timer}s</Text>
          <View style={styles.timerRow}>
            <TouchableOpacity
              onPress={handleTimerToggle}
              style={styles.timerBtn}
              accessibilityLabel={timerActive ? 'Stop timer' : 'Start timer'}
            >
              <Text>{timerActive ? '⏹ Stop' : '▶️ Start'}</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.timerInput}
              keyboardType="number-pad"
              value={String(timer)}
              onChangeText={handleManualTime}
              placeholder="Set Time"
              accessibilityLabel="Manual timer input"
            />
          </View>
        </>
      )}

      <View style={styles.row}>
        <TouchableOpacity
          onPress={() => reorderExercise(index, index - 1)}
          disabled={index === 0}
          accessibilityLabel="Move exercise up"
        >
          <Text style={[styles.orderBtn, index === 0 && styles.disabledBtn]}>⬆️</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => reorderExercise(index, index + 1)}
          disabled={index === lastIndex}
          accessibilityLabel="Move exercise down"
        >
          <Text style={[styles.orderBtn, index === lastIndex && styles.disabledBtn]}>⬇️</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => removeExercise(exercise.id)}
          accessibilityLabel="Remove exercise"
        >
          <Text style={styles.removeBtn}>🗑️ Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fdfdfd',
    borderRadius: 10,
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  completed: {
    backgroundColor: '#e6ffe6',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  exerciseName: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  label: {
    marginTop: 10,
    fontWeight: '500',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginTop: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 6,
    marginTop: 4,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 6,
  },
  timerBtn: {
    backgroundColor: '#dff',
    padding: 6,
    borderRadius: 6,
  },
  timerInput: {
    borderWidth: 1,
    borderColor: '#888',
    padding: 4,
    width: 80,
    borderRadius: 6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  completeBtn: {
    color: '#007AFF',
    fontWeight: '600',
  },
  removeBtn: {
    color: 'red',
    fontWeight: '600',
  },
  orderBtn: {
    fontSize: 20,
  },
  disabledBtn: {
    opacity: 0.3,
  },
});