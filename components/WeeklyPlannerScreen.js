import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const WeeklyPlannerScreen = () => {
  const [weekPlan, setWeekPlan] = useState({});
  const navigation = useNavigation();

  useEffect(() => {
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem('weeklyPlan');
        if (stored) setWeekPlan(JSON.parse(stored));
      } catch (err) {
        console.error('Failed to load weekly plan:', err);
      }
    };
    load();
  }, []);

  const handleSelectDay = (day) => {
    navigation.navigate('Workout', {
      selectedDay: day,
      existingPlan: weekPlan[day] || null,
      onSave: async (updatedDay) => {
        const newPlan = { ...weekPlan, [day]: updatedDay };
        setWeekPlan(newPlan);
        try {
          await AsyncStorage.setItem('weeklyPlan', JSON.stringify(newPlan));
        } catch (err) {
          console.error('Failed to save weekly plan:', err);
        }
      },
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>🗓️ Weekly Workout Planner</Text>
      {DAYS.map((day) => (
        <TouchableOpacity
          key={day}
          style={styles.dayCard}
          onPress={() => handleSelectDay(day)}
          accessibilityRole="button"
          accessibilityLabel={`Plan workout for ${day}`}
        >
          <Text style={styles.dayText}>{day}</Text>
          <Text style={styles.subText}>
            {weekPlan[day]?.workout?.length > 0 ? '✅ Workout Planned' : '➕ Tap to Add Workout'}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  dayCard: {
    backgroundColor: '#f2f2f2',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  dayText: {
    fontSize: 18,
    fontWeight: '600',
  },
  subText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

export default WeeklyPlannerScreen;