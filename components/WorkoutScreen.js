import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
// Import from JSON now
import workoutData from '../assets/data/workoutData.json';
import { Picker } from '@react-native-picker/picker';

// Unique muscle groups for filtering in SearchableDropdown
const MUSCLE_GROUPS = ['All', ...Array.from(new Set(workoutData.map((ex) => ex.muscleGroup)))];

// Color palette for superset groups (cycled)
const SUPERSET_COLORS = ['#d1e7dd', '#f8d7da', '#cff4fc', '#fff3cd', '#e2e3e5', '#dbeafe'];

const SearchableDropdown = ({ data, onSelect }) => {
  const [query, setQuery] = useState('');
  const [muscleGroupFilter, setMuscleGroupFilter] = useState('All');

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return data.filter((ex) => {
      const matchesMuscleGroup = muscleGroupFilter === 'All' || ex.muscleGroup === muscleGroupFilter;
      const matchesQuery = ex.name.toLowerCase().includes(q) || (ex.emoji && ex.emoji.toLowerCase().includes(q));
      return matchesMuscleGroup && matchesQuery;
    });
  }, [data, query, muscleGroupFilter]);

  return (
    <View style={{ marginBottom: 20 }}>
      <View style={styles.filterRow}>
        <Text style={styles.filterLabel}>Filter by Muscle Group:</Text>
        <Picker
          selectedValue={muscleGroupFilter}
          style={styles.picker}
          onValueChange={(val) => setMuscleGroupFilter(val)}
          accessibilityLabel="Muscle group filter picker"
        >
          {MUSCLE_GROUPS.map((group) => (
            <Picker.Item key={group} label={group} value={group} />
          ))}
        </Picker>
      </View>

      <TextInput
        placeholder="Search exercises..."
        value={query}
        onChangeText={setQuery}
        style={styles.searchInput}
        accessibilityLabel="Search exercises input"
        returnKeyType="search"
        clearButtonMode="while-editing"
      />

      {(query.length > 0 || muscleGroupFilter !== 'All') && (
        <View style={styles.dropdownList}>
          {filtered.length === 0 ? (
            <Text style={styles.noResultsText}>No exercises found.</Text>
          ) : (
            filtered.map((item) => (
              <TouchableOpacity
                key={item.name}
                style={styles.dropdownItem}
                onPress={() => {
                  onSelect(item);
                  setQuery('');
                }}
                accessibilityRole="button"
                accessibilityLabel={`Add ${item.name} exercise`}
              >
                <Text style={styles.dropdownText}>
                  {item.emoji} {item.name} ({item.muscleGroup})
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      )}
    </View>
  );
};

const WorkoutScreen = ({ route, navigation }) => {
  const { selectedDay = 'Workout', existingPlan, onSave } = route.params || {};
  const [exercises, setExercises] = useState(existingPlan?.workout || []);

  useEffect(() => {
    navigation.setOptions({ title: `${selectedDay} Workout` });
  }, [selectedDay, navigation]);

  const addExerciseFromLibrary = (exercise) => {
    setExercises((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        name: exercise.name,
        rounds: 1,
        weights: [''],
        reps: '',
        notes: '',
        emoji: exercise.emoji || '',
        superset: '',
      },
    ]);
  };

  const updateExercise = (index, field, value) => {
    const updated = [...exercises];
    if (field === 'rounds') {
      if (value === '') {
        updated[index][field] = '';
      } else {
        const roundsNum = Math.max(parseInt(value) || 1, 1);
        updated[index][field] = roundsNum;
        const oldWeights = updated[index].weights || [];
        updated[index].weights = Array(roundsNum)
          .fill('')
          .map((_, i) => oldWeights[i] || '');
      }
    } else {
      updated[index][field] = value;
    }
    setExercises(updated);
  };

  const updateWeight = (exIndex, weightIndex, value) => {
    const updated = [...exercises];
    if (!updated[exIndex].weights) updated[exIndex].weights = [];
    updated[exIndex].weights[weightIndex] = value;
    setExercises(updated);
  };

  const removeExercise = (index) => {
    Alert.alert(
      'Remove Exercise?',
      'Are you sure you want to remove this exercise from your workout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            const updated = [...exercises];
            updated.splice(index, 1);
            setExercises(updated);
          },
        },
      ]
    );
  };

  const validateExercises = () => {
    for (const [i, ex] of exercises.entries()) {
      if (!ex.name.trim()) {
        Alert.alert(`Exercise #${i + 1} is missing a name.`);
        return false;
      }
      const rounds = parseInt(ex.rounds);
      if (isNaN(rounds) || rounds < 1) {
        Alert.alert(`Exercise #${i + 1} must have at least 1 round.`);
        return false;
      }
    }
    return true;
  };

  const saveWorkout = async () => {
    if (!validateExercises()) return;
    if (onSave) {
      try {
        const cleanedExercises = exercises.map((ex) => ({
          ...ex,
          rounds: parseInt(ex.rounds) || 1,
        }));
        await onSave({ workout: cleanedExercises });
        Alert.alert('Workout saved!');
        navigation.goBack();
      } catch (e) {
        Alert.alert('Failed to save workout. Please try again.');
      }
    }
  };

  const groupedExercises = useMemo(() => {
    const groups = {};
    exercises.forEach((ex) => {
      const key = ex.superset || '';
      if (!groups[key]) groups[key] = [];
      groups[key].push(ex);
    });
    return groups;
  }, [exercises]);

  const onDragEnd = ({ data }) => {
    setExercises(data);
  };

  const renderItem = ({ item, index, drag, isActive }) => {
    const supersetColorIndex =
      item.superset && item.superset.length > 0
        ? item.superset.charCodeAt(0) % SUPERSET_COLORS.length
        : -1;
    const backgroundColor =
      supersetColorIndex >= 0 ? SUPERSET_COLORS[supersetColorIndex] : '#f0f4f8';

    return (
      <TouchableOpacity
        onLongPress={drag}
        disabled={isActive}
        style={[styles.exerciseCard, { backgroundColor, opacity: isActive ? 0.8 : 1 }]}
        accessible
        accessibilityLabel={`Exercise ${index + 1}, ${item.name}`}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <Text style={styles.emoji}>{item.emoji}</Text>
          <TextInput
            style={[styles.supersetInput, { borderColor: backgroundColor }]}
            placeholder="Superset (e.g., A, B)"
            value={item.superset}
            onChangeText={(text) => updateExercise(index, 'superset', text.toUpperCase())}
            maxLength={2}
            autoCapitalize="characters"
            accessibilityLabel={`Superset label input for exercise ${index + 1}`}
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Exercise Name"
          value={item.name}
          onChangeText={(text) => updateExercise(index, 'name', text)}
          accessibilityLabel={`Exercise name input for exercise ${index + 1}`}
          returnKeyType="done"
          autoCapitalize="words"
        />

        <TextInput
          style={styles.input}
          placeholder="Rounds"
          keyboardType="numeric"
          value={item.rounds === '' ? '' : String(item.rounds)}
          onChangeText={(text) => updateExercise(index, 'rounds', text)}
          accessibilityLabel={`Rounds input for exercise ${index + 1}`}
          returnKeyType="done"
          editable
        />

        {Array.from({ length: item.rounds || 0 }).map((_, idx) => (
          <TextInput
            key={idx}
            style={styles.input}
            placeholder={`Weight Round ${idx + 1}`}
            keyboardType="numeric"
            value={item.weights?.[idx] || ''}
            onChangeText={(text) => updateWeight(index, idx, text)}
            accessibilityLabel={`Weight input for round ${idx + 1} of exercise ${index + 1}`}
            returnKeyType="done"
            editable
          />
        ))}

        <TextInput
          style={styles.input}
          placeholder="Reps"
          keyboardType="numeric"
          value={item.reps}
          onChangeText={(text) => updateExercise(index, 'reps', text)}
          accessibilityLabel={`Reps input for exercise ${index + 1}`}
          returnKeyType="done"
          editable
        />

        <TextInput
          style={[styles.input, { height: 70 }]}
          placeholder="Notes"
          value={item.notes}
          onChangeText={(text) => updateExercise(index, 'notes', text)}
          multiline
          accessibilityLabel={`Notes input for exercise ${index + 1}`}
          textAlignVertical="top"
          editable
        />

        <TouchableOpacity
          onPress={() => removeExercise(index)}
          style={styles.removeButton}
          accessibilityRole="button"
          accessibilityLabel={`Remove exercise ${index + 1}`}
        >
          <Text style={styles.removeButtonText}>Remove Exercise</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: '#fff' }}
      keyboardVerticalOffset={100}
    >
      <View style={styles.container}>
        <Text style={styles.header}>{selectedDay} Workout</Text>

        <SearchableDropdown data={workoutData} onSelect={addExerciseFromLibrary} />

        <DraggableFlatList
          data={exercises}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          onDragEnd={onDragEnd}
          activationDistance={15}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 40 }}
        />

        <View style={{ marginTop: 25 }}>
          <Button
            title="Save Workout"
            onPress={saveWorkout}
            accessibilityLabel="Save workout button"
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
    color: '#111',
  },
  filterRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  filterLabel: { fontSize: 16, fontWeight: '600', marginRight: 10 },
  picker: { flex: 1, height: 40 },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    backgroundColor: '#fff',
    fontSize: 18,
  },
  dropdownList: {
    maxHeight: 150,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  noResultsText: { padding: 12, fontStyle: 'italic', color: '#666', textAlign: 'center' },
  dropdownItem: { paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  dropdownText: { fontSize: 16 },
  exerciseCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#d1d9e6',
  },
  emoji: { fontSize: 32, marginRight: 10 },
  supersetInput: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 14,
    width: 70,
    textAlign: 'center',
    marginLeft: 10,
  },
  removeButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 12,
  },
  removeButtonText: { color: '#fff', fontWeight: '700', textAlign: 'center', fontSize: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
});

export default WorkoutScreen;