import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext'; // 🔥 Correct source

const SettingsScreen = () => {
  const navigation = useNavigation();
  const { darkMode, toggleTheme } = useTheme(); // ⬅️ Using global theme state

  return (
    <View style={[styles.container, { backgroundColor: darkMode ? '#121212' : '#fff' }]}>
      <Text style={[styles.header, { color: darkMode ? '#fff' : '#000' }]}>⚙️ Settings</Text>

      <View style={styles.settingItem}>
        <Text style={[styles.settingText, { color: darkMode ? '#fff' : '#000' }]}>Dark Mode</Text>
        <Switch
          value={darkMode}
          onValueChange={toggleTheme}
          accessibilityLabel="Toggle dark mode"
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('EditProfile')}
        accessibilityLabel="Edit profile button"
      >
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('History')}
        accessibilityLabel="Workout history button"
      >
        <Text style={styles.buttonText}>Workout History</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
    alignItems: 'center',
  },
  settingText: {
    fontSize: 18,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 10,
    marginTop: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default SettingsScreen;