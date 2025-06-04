// screens/WorkoutScreen.js

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import ExerciseCard from '../components/ExerciseCard';
import exercisesLibrary from '../data/exercises';

const WorkoutScreen = () => {
  const [exercises, setExercises] = useState([]);
  const navigation = useNavigation();
  const flatListRef = useRef();

  // Load saved exercises
  useEffect(() => {
    const loadExercises = async () => {
      try {
        const saved = await AsyncStorage.getItem('@workout');
        if (saved) {
          setExercises(JSON.parse(saved));
        }
      } catch (e) {
        console.error('Failed to load workout', e);
      }
    };
    loadExercises();
  }, []);

  // Save to storage whenever it changes
  useEffect(() => {
    const saveExercises = async () => {
      try {
        await AsyncStorage.setItem('@workout', JSON.stringify(exercises));
      } catch (e) {
        console.error('Failed to save workout', e);
      }
    };
    saveExercises();
  }, [exercises]);

  const handleRemove = (id) => {
    Alert.alert('Remove Exercise', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () =>
          setExercises((prev) => prev.filter((item) => item.id !== id)),
      },
    ]);
  };

  const handleAddExercise = () => {
    navigation.navigate('ExerciseSelector', {
      onSelect: (selected) => {
        setExercises((prev) => [...prev, selected]);
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={handleAddExercise}>
        <Text style={styles.addButtonText}>+ Add Exercise</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatListRef}
        data={exercises}
        keyExtractor={(item) => item.uid || item.id}
        renderItem={({ item, index }) => (
          <ExerciseCard
            exercise={item}
            index={index}
            onRemove={() => handleRemove(item.id)}
            onUpdate={(updated) => {
              const newList = [...exercises];
              newList[index] = updated;
              setExercises(newList);
            }}
          />
        )}
        ListEmptyComponent={<Text style={styles.empty}>No exercises yet.</Text>}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  addButton: {
    backgroundColor: '#222',
    padding: 16,
    margin: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  empty: {
    marginTop: 40,
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
  },
});

export default WorkoutScreen;