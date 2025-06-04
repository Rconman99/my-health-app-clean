import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const DashboardScreen = () => {
  const navigation = useNavigation();

  const navigateTo = (screen) => {
    navigation.navigate(screen);
  };

  const greeting = "Welcome Back"; // This can later be replaced with user context or time-based logic

  const motivationQuotes = [
    "Every rep brings you closer to your best self.",
    "Discipline beats motivation—train anyway.",
    "Your future self will thank you for today’s effort.",
    "Progress, not perfection.",
    "Fuel your goals with consistency.",
    "Push harder than yesterday if you want a different tomorrow.",
    "Strength grows in the moments when you think you can’t go on but you keep going.",
    "Success starts with self-discipline.",
  ];

  const quoteOfTheDay = motivationQuotes[new Date().getDate() % motivationQuotes.length];

  const protocols = [
    { name: 'Workout', screen: 'Workout' },
    { name: 'Cold Plunge', screen: 'ColdPlunge' },
    { name: 'Red Light', screen: 'RedLight' },
    { name: 'Sauna', screen: 'Sauna' },
    { name: 'Peptides', screen: 'Peptides' },
    { name: 'Grounding', screen: 'Grounding' },
    { name: 'Tracker', screen: 'Tracker' },
    { name: 'Suggestions', screen: 'Suggestions' },
    { name: 'Gemini Chat', screen: 'GeminiChat' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>{greeting}</Text>
      <Text style={styles.motivation}>{quoteOfTheDay}</Text>

      <Text style={styles.sectionTitle}>Quick Access</Text>
      <View style={styles.grid}>
        {protocols.map((protocol, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => navigateTo(protocol.screen)}
          >
            <Text style={styles.cardText}>{protocol.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 16,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 12,
  },
  motivation: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    fontStyle: 'italic',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    marginLeft: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    flexBasis: '47%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardText: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
    color: '#007AFF',
  },
});

export default DashboardScreen;