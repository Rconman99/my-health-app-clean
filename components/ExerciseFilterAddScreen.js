import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import exerciseCategories from '../utils/exerciseList';

// Enable LayoutAnimation on Android for smooth transitions
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const fitnessLevels = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Athlete'];
const categories = ['All', ...Object.keys(exerciseCategories)];

export default function ExerciseFilterAddScreen({ route, navigation }) {
  const onAddExercise = route.params?.onAddExercise || (() => {});

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [search, setSearch] = useState('');

  const filteredExercises = useMemo(() => {
    const lowerSearch = search.toLowerCase();

    let exercises = [];
    if (selectedCategory === 'All') {
      Object.values(exerciseCategories).forEach((exList) => {
        exercises = exercises.concat(exList);
      });
    } else {
      exercises = exerciseCategories[selectedCategory] || [];
    }

    if (selectedLevel !== 'All') {
      exercises = exercises.filter((ex) => ex.level === selectedLevel);
    }

    exercises = exercises.filter(
      (ex) =>
        ex.name.toLowerCase().includes(lowerSearch) ||
        (ex.emoji && ex.emoji.toLowerCase().includes(lowerSearch))
    );

    return exercises;
  }, [selectedCategory, selectedLevel, search]);

  const handleCategoryPress = useCallback(
    (category) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setSelectedCategory(category);
    },
    []
  );

  const handleAddPress = useCallback(
    (exercise) => {
      onAddExercise({
        name: exercise.name,
        rounds: 1,
        weights: [''],
        notes: '',
        timer: 60,
        timerActive: false,
        superset: '',
        id: Math.random().toString(36).substr(2, 9),
        emoji: exercise.emoji,
        level: exercise.level,
      });
      navigation.goBack();
    },
    [onAddExercise, navigation]
  );

  const renderCategoryTab = ({ item }) => {
    const isActive = selectedCategory === item;
    return (
      <TouchableOpacity
        style={[styles.categoryTab, isActive && styles.categoryTabActive]}
        onPress={() => handleCategoryPress(item)}
        accessibilityRole="button"
        accessibilityState={{ selected: isActive }}
      >
        <Text style={isActive ? styles.categoryTextActive : styles.categoryText}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderExercise = ({ item }) => (
    <View style={styles.exerciseCard}>
      <View>
        <Text style={styles.exerciseText}>{item.emoji} {item.name}</Text>
        <Text style={styles.levelText}>{item.level}</Text>
      </View>
      <TouchableOpacity
        onPress={() => handleAddPress(item)}
        style={styles.addButton}
        accessibilityRole="button"
        accessibilityLabel={`Add ${item.name} exercise`}
      >
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find & Add Exercises</Text>

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search exercises..."
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
          accessibilityLabel="Search exercises input"
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>

      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item}
        renderItem={renderCategoryTab}
        contentContainerStyle={styles.categoryList}
      />

      <View style={styles.levelPickerContainer}>
        <Text style={styles.levelPickerLabel}>Fitness Level:</Text>
        <Picker
          selectedValue={selectedLevel}
          onValueChange={setSelectedLevel}
          style={styles.levelPicker}
          accessibilityLabel="Select fitness level"
        >
          {fitnessLevels.map((level) => (
            <Picker.Item key={level} label={level} value={level} />
          ))}
        </Picker>
      </View>

      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => item.name}
        renderItem={renderExercise}
        ListEmptyComponent={<Text style={styles.noDataText}>No exercises found.</Text>}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },

  searchContainer: {
    marginBottom: 12,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },

  categoryList: {
    marginBottom: 12,
  },
  categoryTab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: '#eee',
    borderRadius: 20,
    marginRight: 8,
  },
  categoryTabActive: {
    backgroundColor: '#007aff',
  },
  categoryText: {
    color: '#333',
    fontSize: 14,
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },

  levelPickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelPickerLabel: {
    fontSize: 16,
    marginRight: 12,
  },
  levelPicker: {
    flex: 1,
    height: 40,
  },

  exerciseCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  exerciseText: {
    fontSize: 16,
    fontWeight: '600',
  },
  levelText: {
    fontSize: 12,
    color: '#666',
  },
  addButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  noDataText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#888',
    fontStyle: 'italic',
  },
});