import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const plans = [
  { weeks: 4, label: '4 Week Plan', suggestion: 'Good for short-term goals, mini cuts, or habit resets.' },
  { weeks: 6, label: '6 Week Plan', suggestion: 'Ideal for structured strength programs or focused athletic prep.' },
  { weeks: 8, label: '8 Week Plan', suggestion: 'Best for transformations, endurance building, or goal-driven phases.' },
];

const MultiWeekPlanner = () => {
  const [selectedPlan, setSelectedPlan] = useState(plans[1]);
  const [plan, setPlan] = useState({});
  const [editingWeek, setEditingWeek] = useState(null);
  const navigation = useNavigation();

  const handleWeekSelect = (weekIndex) => {
    if (!selectedPlan || !selectedPlan.weeks) return;

    setEditingWeek(weekIndex);

    navigation.navigate('WeeklyPlanner', {
      weekNumber: weekIndex + 1,
      existingPlan: plan[weekIndex] || {},
      onSave: (updatedWeek) => {
        setPlan((prev) => ({ ...prev, [weekIndex]: updatedWeek }));
        setEditingWeek(null);
      },
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>
      <Text style={styles.header}>📆 Build Your Training Plan</Text>
      <Text style={styles.sub}>Select how many weeks you'd like to plan:</Text>

      {plans.map((item) => {
        const isSelected = selectedPlan?.weeks === item.weeks;
        return (
          <TouchableOpacity
            key={item.weeks}
            style={[styles.planCard, isSelected && styles.planActive]}
            onPress={() => setSelectedPlan(item)}
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={`Select ${item.label}`}
          >
            <Text style={[styles.planLabel, isSelected && styles.planLabelSelected]}>
              {item.label}
            </Text>
            <Text style={[styles.suggestion, isSelected && styles.suggestionSelected]}>
              {item.suggestion}
            </Text>
          </TouchableOpacity>
        );
      })}

      <Text style={styles.sub}>📅 Tap a week to customize workouts:</Text>

      {selectedPlan && selectedPlan.weeks ? (
        Array.from({ length: selectedPlan.weeks }).map((_, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.weekCard,
              editingWeek === i && styles.weekCardEditing,
              plan[i] && styles.weekCardPlanned,
            ]}
            onPress={() => handleWeekSelect(i)}
            accessibilityRole="button"
            accessibilityLabel={`Plan week ${i + 1}`}
          >
            <Text style={styles.weekTitle}>Week {i + 1}</Text>
            <Text style={styles.weekStatus}>
              {plan[i] ? '✅ Planned' : '➕ Tap to Plan Week'}
            </Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.noPlanText}>
          Please select a plan duration above.
        </Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
    color: '#007bff',
  },
  sub: {
    fontSize: 16,
    marginVertical: 12,
    color: '#444',
  },
  planCard: {
    padding: 14,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  planActive: {
    backgroundColor: '#007bff',
    borderColor: '#0056b3',
  },
  planLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  planLabelSelected: {
    color: '#fff',
  },
  suggestion: {
    fontSize: 14,
    marginTop: 6,
    color: '#666',
  },
  suggestionSelected: {
    color: '#ddd',
  },
  weekCard: {
    backgroundColor: '#f7f7f7',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  weekCardEditing: {
    borderColor: '#007bff',
    borderWidth: 2,
  },
  weekCardPlanned: {
    backgroundColor: '#e6f0ff',
  },
  weekTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },
  weekStatus: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  noPlanText: {
    fontStyle: 'italic',
    color: '#888',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default MultiWeekPlanner;