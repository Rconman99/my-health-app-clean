// utils/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveToStorage = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Storage save error:', err);
  }
};

export const loadFromStorage = async (key) => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error('Storage load error:', err);
    return null;
  }
};

export const removeFromStorage = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (err) {
    console.error('Storage remove error:', err);
  }
};

export const clearAllStorage = async () => {
  try {
    await AsyncStorage.clear();
  } catch (err) {
    console.error('Storage clear error:', err);
  }
};