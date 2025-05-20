// utils/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function saveWorkoutPlan(day, workout) {
  try {
    const stored = await AsyncStorage.getItem('workoutPlans');
    const plans = stored ? JSON.parse(stored) : {};
    plans[day] = workout;
    await AsyncStorage.setItem('workoutPlans', JSON.stringify(plans));
  } catch (e) {
    console.error('Failed to save workout plan:', e);
    throw e;
  }
}

export async function loadWorkoutPlan(day) {
  try {
    const stored = await AsyncStorage.getItem('workoutPlans');
    if (!stored) return null;
    const plans = JSON.parse(stored);
    return plans[day] || null;
  } catch (e) {
    console.error('Failed to load workout plan:', e);
    return null;
  }
}