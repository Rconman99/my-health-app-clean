import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { saveToStorage } from '../storage';

const goalOptions = [
  "Build Muscle",
  "Lose Fat",
  "Increase Energy",
  "Spartan Race",
  "Triathlon",
  "Longevity",
  "TRT/Hormone Optimization",
  "General Fitness",
  "Rebuild from Injury",
  "Optimize Sleep",
];

const GoalSurvey = ({ navigation, route }) => {
  const { profile } = route.params || {};
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleGoal = (goal) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const handleSubmit = async () => {
    if (!profile) {
      Alert.alert('Profile data is missing.');
      return;
    }
    if (selectedGoals.length === 0) {
      Alert.alert('Please select at least one goal.');
      return;
    }

    setLoading(true);

    const prompt = `
Create a personalized health optimization and fitness strategy based on the following user profile:

Name: ${profile.name}
Age: ${profile.age}
Height: ${profile.height}" (inches)
Weight: ${profile.weight} lbs
Fitness Level: ${profile.fitnessLevel}
Goals: ${selectedGoals.join(', ')}

Include:
- Workout split recommendation
- Nutrition or supplements
- Recovery tools (e.g., red light, cold plunge)
- Hormone/peptide optimization ideas (for research only)
- Encouragement quote
    `.trim();

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
<<<<<<< HEAD
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
=======
          Authorization: 'Bearer YOUR_OPENAI_API_KEY_HERE',
>>>>>>> 8a49e53 (Update latest changes)
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.8,
        }),
      });

      const data = await response.json();
<<<<<<< HEAD
      console.log('GPT FULL RESPONSE:', JSON.stringify(data, null, 2));
=======
>>>>>>> 8a49e53 (Update latest changes)

      let suggestions = 'No suggestions returned.';
      if (
        data &&
        data.choices &&
        Array.isArray(data.choices) &&
        data.choices.length > 0 &&
        data.choices[0].message &&
        data.choices[0].message.content
      ) {
        suggestions = data.choices[0].message.content.trim();
      }

      await saveToStorage('profile', profile);
      await saveToStorage('goals', selectedGoals);
      await saveToStorage('suggestions', suggestions);

      navigation.navigate('Suggestions', {
        profile,
        goals: selectedGoals,
        suggestions,
      });
    } catch (error) {
      console.error('GPT request failed:', error);
      Alert.alert('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Select Your Goals</Text>

      {goalOptions.map((goal, index) => {
        const selected = selectedGoals.includes(goal);
        return (
          <TouchableOpacity
            key={index}
            style={[styles.goalButton, selected && styles.goalButtonSelected]}
            onPress={() => toggleGoal(goal)}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: selected }}
          >
            <Text style={[styles.goalText, selected && styles.goalTextSelected]}>
              {goal}
            </Text>
          </TouchableOpacity>
        );
      })}

      {loading ? (
        <ActivityIndicator size="large" color="#007aff" style={{ marginTop: 20 }} />
      ) : (
        <Button title="Get My Plan" onPress={handleSubmit} accessibilityLabel="Get personalized plan" />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 80,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  goalButton: {
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  goalButtonSelected: {
    backgroundColor: '#007aff',
    borderColor: '#007aff',
  },
  goalText: {
    color: '#000',
    textAlign: 'center',
  },
  goalTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default GoalSurvey;