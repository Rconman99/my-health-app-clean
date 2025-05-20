import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import exerciseLibrary from '../utils/exerciselibrary'; // lowercase 'l'

const categories = [
  'All',
  'Strength',
  'Mobility',
  'Functional',
  'CrossFit',
  'Cardio',
  'Recovery',
];

const muscleGroups = [
  'All',
  'Chest',
  'Back',
  'Legs',
  'Shoulders',
  'Arms',
  'Core',
  'Full Body',
  'Glutes',
  'Quads',
  'Hamstrings',
];

const fitnessLevels = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Athlete'];

const equipmentOptions = [
  'All',
  'None',
  'Barbell',
  'Dumbbells',
  'Kettlebell',
  'Machine',
  'Resistance Band',
  'Medicine Ball',
  'Foam Roller',
  'Pull-Up Bar',
  'Jump Rope',
];

export default function DiscoverScreen({ navigation, route }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMuscle, setSelectedMuscle] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedEquipment, setSelectedEquipment] = useState('All');

  const filteredExercises = useMemo(() => {
    const lowerSearch = search.toLowerCase();

    return exerciseLibrary.filter((exercise) => {
      const matchesCategory =
        selectedCategory === 'All' || exercise.category === selectedCategory;
      const matchesMuscle =
        selectedMuscle === 'All' || exercise.muscleGroup === selectedMuscle;
      const matchesLevel =
        selectedLevel === 'All' || exercise.fitnessLevel === selectedLevel;
      const matchesEquipment =
        selectedEquipment === 'All' || exercise.equipment === selectedEquipment;

      const matchesSearch =
        exercise.name.toLowerCase().includes(lowerSearch) ||
        (exercise.emoji && exercise.emoji.toLowerCase().includes(lowerSearch)) ||
        (exercise.tags && exercise.tags.some((tag) => tag.toLowerCase().includes(lowerSearch)));

      return (
        matchesCategory &&
        matchesMuscle &&
        matchesLevel &&
        matchesEquipment &&
        matchesSearch
      );
    });
  }, [search, selectedCategory, selectedMuscle, selectedLevel, selectedEquipment]);

  const renderFilterButtons = (items, selected, setSelected) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
      {items.map((item) => {
        const isActive = selected === item;
        return (
          <TouchableOpacity
            key={item}
            style={[styles.filterButton, isActive && styles.filterButtonActive]}
            onPress={() => setSelected(item)}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
          >
            <Text style={isActive ? styles.filterTextActive : styles.filterText}>{item}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Discover Workouts</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search exercises or tags..."
        value={search}
        onChangeText={setSearch}
        accessibilityLabel="Search exercises input"
        autoCorrect={false}
        autoCapitalize="none"
      />

      <Text style={styles.filterLabel}>Category</Text>
      {renderFilterButtons(categories, selectedCategory, setSelectedCategory)}

      <Text style={styles.filterLabel}>Muscle Group</Text>
      {renderFilterButtons(muscleGroups, selectedMuscle, setSelectedMuscle)}

      <Text style={styles.filterLabel}>Fitness Level</Text>
      {renderFilterButtons(fitnessLevels, selectedLevel, setSelectedLevel)}

      <Text style={styles.filterLabel}>Equipment</Text>
      {renderFilterButtons(equipmentOptions, selectedEquipment, setSelectedEquipment)}

      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              if (route.params?.onSelectExercise) {
                route.params.onSelectExercise({
                  name: item.name,
                  reps: '',
                  rounds: 1,
                  weights: [''],
                  notes: '',
                  useTimer: true,
                  superset: '',
                  emoji: item.emoji,
                });
              }
              navigation.goBack();
            }}
            accessibilityRole="button"
            accessibilityLabel={`Select exercise ${item.name}`}
          >
            <Text style={styles.cardText}>{item.emoji} {item.name}</Text>
            <Text style={styles.tagText}>
              {item.category} • {item.muscleGroup} • {item.fitnessLevel} • {item.equipment}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No exercises found.</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },

  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 16,
  },

  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 6,
  },

  filterScroll: {
    marginBottom: 8,
  },

  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#eee',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#007bff',
  },
  filterText: {
    fontSize: 14,
    color: '#333',
  },
  filterTextActive: {
    color: '#fff',
    fontWeight: '600',
  },

  card: {
    backgroundColor: '#f9f9f9',
    padding: 14,
    borderRadius: 8,
    marginVertical: 6,
  },
  cardText: {
    fontSize: 18,
    fontWeight: '600',
  },
  tagText: {
    marginTop: 6,
    fontSize: 14,
    color: '#666',
  },

  emptyContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  emptyText: {
    fontStyle: 'italic',
    color: '#666',
  },
});