import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../ThemeContext';

const SuggestionsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [plan, setPlan] = useState(null);

  useEffect(() => {
    loadPlan();
  }, []);

  const loadPlan = async () => {
    try {
      const stored = await AsyncStorage.getItem('userPlan');
      if (stored) setPlan(JSON.parse(stored));
    } catch (err) {
      console.error('Failed to load plan:', err);
      Alert.alert('Error', 'Failed to load your plan.');
    }
  };

  const handleEditProfile = () => {
    navigation.navigate('Profile');
  };

  const handleStartWorkout = () => {
    navigation.navigate('Workout', { selectedDay: 'Today', existingPlan: plan });
  };

  if (!plan) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>No plan found.</Text>
        <Button title="Create Profile" onPress={handleEditProfile} accessibilityLabel="Create your profile" />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={{ paddingBottom: 40 }}
      accessibilityLabel="Suggested workout plan"
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>Your Suggested Plan</Text>

      {plan.workout && plan.workout.length > 0 ? (
        plan.workout.map((ex, index) => (
          <View
            key={ex.id || index}
            style={[styles.exerciseCard, { backgroundColor: theme.colors.card }]}
            accessible
            accessibilityRole="summary"
            accessibilityLabel={`${ex.name} exercise, rounds ${ex.rounds}, reps ${ex.reps || 'N/A'}`}
          >
            <Text style={[styles.exerciseName, { color: theme.colors.text }]}>
              {ex.emoji} {ex.name}
            </Text>
            <Text style={[styles.details, { color: theme.colors.text }]}>
              Rounds: {ex.rounds} | Reps: {ex.reps || 'N/A'}
            </Text>
            {ex.notes ? (
              <Text style={[styles.notes, { color: theme.colors.text }]}>Notes: {ex.notes}</Text>
            ) : null}
          </View>
        ))
      ) : (
        <Text style={{ color: theme.colors.text, marginVertical: 20, textAlign: 'center' }}>
          No exercises in your plan yet.
        </Text>
      )}

      <View style={{ marginTop: 30 }}>
        <Button
          title="Edit Profile"
          onPress={handleEditProfile}
          accessibilityLabel="Edit your profile"
        />
        <View style={{ height: 15 }} />
        <Button
          title="Start Workout"
          onPress={handleStartWorkout}
          accessibilityLabel="Start workout session"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  exerciseCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: '700',
  },
  details: {
    marginTop: 6,
    fontSize: 14,
  },
  notes: {
    marginTop: 6,
    fontSize: 13,
    fontStyle: 'italic',
  },
});

export default SuggestionsScreen;