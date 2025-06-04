import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';

export default function ExerciseLogScreen({ navigation }) {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [workoutDetails, setWorkoutDetails] = useState({
    workout: '',
    duration: '',
    notes: '',
  });

  useEffect(() => {
    const loadExistingData = async () => {
      try {
        const stored = await AsyncStorage.getItem(`exerciseLog-${date}`);
        if (stored) {
          setWorkoutDetails(JSON.parse(stored));
        }
      } catch (err) {
        console.error('Failed to load existing log:', err);
      }
    };
    loadExistingData();
  }, [date]);

  const saveLog = async () => {
    try {
      await AsyncStorage.setItem(
        `exerciseLog-${date}`,
        JSON.stringify(workoutDetails)
      );
      alert('Workout log saved!');
      navigation.goBack();
    } catch (err) {
      console.error('Failed to save log:', err);
      alert('Failed to save workout log.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Log Your Workout</Text>

        <Text style={styles.label}>Date:</Text>
        <TextInput
          style={styles.input}
          value={date}
          onChangeText={setDate}
          placeholder="YYYY-MM-DD"
        />

        <Text style={styles.label}>Workout:</Text>
        <TextInput
          style={styles.input}
          value={workoutDetails.workout}
          onChangeText={(text) => setWorkoutDetails({ ...workoutDetails, workout: text })}
          placeholder="e.g., Chest Day, WOD, Run, etc."
        />

        <Text style={styles.label}>Duration (minutes):</Text>
        <TextInput
          style={styles.input}
          value={workoutDetails.duration}
          onChangeText={(text) => setWorkoutDetails({ ...workoutDetails, duration: text })}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Notes:</Text>
        <TextInput
          style={[styles.input, styles.notes]}
          value={workoutDetails.notes}
          onChangeText={(text) => setWorkoutDetails({ ...workoutDetails, notes: text })}
          multiline
          numberOfLines={4}
          placeholder="How did the workout feel? Any highlights or issues?"
        />

        <Button title="Save Log" onPress={saveLog} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 80,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  notes: {
    height: 100,
    textAlignVertical: 'top',
  },
});