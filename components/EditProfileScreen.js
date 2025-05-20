import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const fitnessLevels = ['Beginner', 'Intermediate', 'Advanced', 'Athlete'];

export default function ProfileForm({ navigation }) {
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    height: '',
    weight: '',
    fitnessLevel: '',
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const stored = await AsyncStorage.getItem('profile');
        if (stored) {
          setProfile(JSON.parse(stored));
        }
      } catch (err) {
        console.error('Error loading profile:', err);
      }
    };
    loadProfile();
  }, []);

  const saveProfile = async () => {
    if (!profile.name.trim()) {
      Alert.alert('Please enter your name.');
      return;
    }
    if (
      (profile.age && isNaN(Number(profile.age))) ||
      (profile.height && isNaN(Number(profile.height))) ||
      (profile.weight && isNaN(Number(profile.weight)))
    ) {
      Alert.alert('Please enter valid numbers for age, height, and weight.');
      return;
    }
    if (!profile.fitnessLevel) {
      Alert.alert('Please select a fitness level.');
      return;
    }

    try {
      await AsyncStorage.setItem('profile', JSON.stringify(profile));
      Alert.alert('Profile updated!');
      navigation.navigate('Suggestions', { profile }); // Pass profile if needed
    } catch (err) {
      console.error('Failed to save profile:', err);
      Alert.alert('Failed to save profile. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Edit Your Profile</Text>

        <TextInput
          placeholder="Name"
          style={styles.input}
          value={profile.name}
          onChangeText={(text) => setProfile({ ...profile, name: text })}
          autoCapitalize="words"
          returnKeyType="done"
          accessibilityLabel="Name input"
        />
        <TextInput
          placeholder="Age"
          style={styles.input}
          keyboardType="numeric"
          value={profile.age?.toString()}
          onChangeText={(text) => setProfile({ ...profile, age: text })}
          returnKeyType="done"
          accessibilityLabel="Age input"
        />
        <TextInput
          placeholder="Height (in inches)"
          style={styles.input}
          keyboardType="numeric"
          value={profile.height?.toString()}
          onChangeText={(text) => setProfile({ ...profile, height: text })}
          returnKeyType="done"
          accessibilityLabel="Height input"
        />
        <TextInput
          placeholder="Weight (lbs)"
          style={styles.input}
          keyboardType="numeric"
          value={profile.weight?.toString()}
          onChangeText={(text) => setProfile({ ...profile, weight: text })}
          returnKeyType="done"
          accessibilityLabel="Weight input"
        />

        <Text style={styles.label}>Fitness Level:</Text>
        {fitnessLevels.map((level, index) => (
          <Button
            key={index}
            title={level}
            color={profile.fitnessLevel === level ? '#007aff' : '#ccc'}
            onPress={() => setProfile({ ...profile, fitnessLevel: level })}
            accessibilityLabel={`Select fitness level ${level}`}
          />
        ))}

        <View style={{ marginTop: 30 }}>
          <Button
            title="Save Changes"
            onPress={saveProfile}
            accessibilityLabel="Save profile changes"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
    paddingBottom: 80,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    marginTop: 20,
    fontWeight: '600',
    marginBottom: 10,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
});