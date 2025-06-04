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
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const fitnessLevels = ['Beginner', 'Intermediate', 'Advanced', 'Athlete'];

const ProfileForm = ({ navigation }) => {
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

  const validateProfile = () => {
    if (!profile.name.trim()) {
      Alert.alert('Validation Error', 'Please enter your name.');
      return false;
    }
    if (
      profile.age &&
      (isNaN(Number(profile.age)) || Number(profile.age) <= 0)
    ) {
      Alert.alert('Validation Error', 'Please enter a valid age.');
      return false;
    }
    if (
      profile.height &&
      (isNaN(Number(profile.height)) || Number(profile.height) <= 0)
    ) {
      Alert.alert('Validation Error', 'Please enter a valid height in inches.');
      return false;
    }
    if (
      profile.weight &&
      (isNaN(Number(profile.weight)) || Number(profile.weight) <= 0)
    ) {
      Alert.alert('Validation Error', 'Please enter a valid weight in lbs.');
      return false;
    }
    if (!profile.fitnessLevel) {
      Alert.alert('Validation Error', 'Please select your fitness level.');
      return false;
    }
    return true;
  };

  const saveProfile = async () => {
    if (!validateProfile()) return;

    try {
      await AsyncStorage.setItem('profile', JSON.stringify(profile));
      Alert.alert('Success', 'Profile saved!');
      navigation.navigate('Suggestions');
    } catch (err) {
      console.error('Failed to save profile:', err);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: '#fff' }}
      keyboardVerticalOffset={100}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        accessibilityLabel="Profile editing form"
      >
        <Text style={styles.title}>Your Profile</Text>

        <TextInput
          placeholder="Full Name"
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
          placeholder="Height (inches)"
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

        <Text style={styles.label}>Fitness Level</Text>
        <View style={styles.levelsContainer}>
          {fitnessLevels.map((level) => {
            const selected = profile.fitnessLevel === level;
            return (
              <TouchableOpacity
                key={level}
                style={[styles.levelButton, selected && styles.levelButtonSelected]}
                onPress={() => setProfile({ ...profile, fitnessLevel: level })}
                accessibilityLabel={`Select fitness level ${level}`}
              >
                <Text style={[styles.levelText, selected && styles.levelTextSelected]}>{level}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.saveButtonContainer}>
          <Button
            title="Save Profile"
            onPress={saveProfile}
            accessibilityLabel="Save profile button"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 25,
    paddingBottom: 100,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 30,
    textAlign: 'center',
    color: '#111',
  },
  input: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 10,
    padding: 14,
    marginBottom: 20,
    fontSize: 18,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#444',
  },
  levelsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  levelButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginBottom: 10,
    minWidth: '48%',
    alignItems: 'center',
  },
  levelButtonSelected: {
    backgroundColor: '#007aff',
  },
  levelText: {
    color: '#333',
    fontWeight: '500',
  },
  levelTextSelected: {
    color: '#fff',
    fontWeight: '700',
  },
  saveButtonContainer: {
    marginTop: 30,
  },
});

export default ProfileForm;