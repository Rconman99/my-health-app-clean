// utils/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'workoutPlans';

export async function saveWorkoutPlan(day, workout) {
  if (!day || typeof day !== 'string') throw new Error('Invalid day key');
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    const plans = stored ? JSON.parse(stored) : {};
    plans[day] = workout;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
  } catch (e) {
    console.error('Failed to save workout plan:', e);
    throw e;
  }
}

export async function loadWorkoutPlan(day) {
  if (!day || typeof day !== 'string') return null;
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    const plans = stored ? JSON.parse(stored) : {};
    return plans[day] ?? null;
  } catch (e) {
    console.error('Failed to load workout plan:', e);
    return null;
  }
}

export async function deleteWorkoutPlan(day) {
  if (!day || typeof day !== 'string') return;
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    const plans = stored ? JSON.parse(stored) : {};
    delete plans[day];
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
  } catch (e) {
    console.error('Failed to delete workout plan:', e);
  }
}

export async function getAllWorkoutPlans() {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (e) {
    console.error('Failed to fetch all workout plans:', e);
    return {};
  }
}