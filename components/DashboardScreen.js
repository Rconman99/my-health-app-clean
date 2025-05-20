import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../ThemeContext';

const motivations = [
  'Cold builds resilience. Step into the discomfort.',
  'Your habits today are your hormones tomorrow.',
  'Discipline is biohacking at its core.',
  'Sunlight, movement, and stillness — nature’s stack.',
  'Small protocols lead to massive shifts.',
];

const discoverItems = [
  { label: 'Workout', icon: '🏋️‍♂️' },
  { label: 'Tracker', icon: '📋' },
  { label: 'Journal', icon: '📔' },
  { label: 'Suggestions', icon: '💡' },
  { label: 'Trends', icon: '📈' },
  { label: 'Profile', icon: '👤' },
  { label: 'Settings', icon: '⚙️' },
];

const DashboardScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();

  const [quote, setQuote] = useState('');
  const [latestLog, setLatestLog] = useState({});

  // Load a random quote and latest habit log
  useEffect(() => {
    refreshQuote();
    loadHabitLog();
  }, []);

  const refreshQuote = () => {
    setQuote(motivations[Math.floor(Math.random() * motivations.length)]);
  };

  const loadHabitLog = async () => {
    try {
      const stored = await AsyncStorage.getItem('habitLog');
      if (!stored) return;
      const parsed = JSON.parse(stored);
      const dates = Object.keys(parsed).sort((a, b) => new Date(b) - new Date(a));
      const latest = dates.length ? parsed[dates[0]] : {};
      setLatestLog(latest);
    } catch (e) {
      console.error('Failed to load habitLog:', e);
    }
  };

  const navigateTo = useCallback(
    (screen) => () => navigation.navigate(screen),
    [navigation]
  );

  // Summarize latest activities with counts or durations if available
  const activitySummary = () => {
    if (!latestLog || Object.keys(latestLog).length === 0) return 'No activity logged yet.';
    const parts = [];
    if (latestLog.workoutNotes) parts.push('🏋️ Workout');
    if (latestLog.plungeDuration) parts.push(`🧊 Plunge (${latestLog.plungeDuration} min)`);
    if (latestLog.redlightDuration) parts.push(`🔴 Red Light (${latestLog.redlightDuration} min)`);
    if (latestLog.peptideType) parts.push(`💉 Peptide (${latestLog.peptideType})`);
    if (latestLog.groundingDuration) parts.push(`🌍 Grounding (${latestLog.groundingDuration} min)`);
    if (latestLog.saunaDuration) parts.push(`🔥 Sauna (${latestLog.saunaDuration} min)`);
    return parts.join('   ');
  };

  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={{ paddingBottom: 80 }}
      keyboardShouldPersistTaps="handled"
      accessibilityLabel="Dashboard scroll view"
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>Welcome back 👋</Text>
      <Text style={[styles.subtitle, { color: theme.colors.text }]}>{today}</Text>

      <Pressable
        onPress={refreshQuote}
        accessibilityRole="button"
        accessibilityLabel="Refresh motivational quote"
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: theme.colors.card },
          pressed && { opacity: 0.7 },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>🧠 Biohacker Motivation</Text>
        <Text style={[styles.quote, { color: theme.colors.text }]}>{quote}</Text>
        <Text style={[styles.refreshHint, { color: theme.colors.text }]}>
          Tap to refresh
        </Text>
      </Pressable>

      <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>📊 Recent Activity</Text>
        <Text style={[styles.activityText, { color: theme.colors.text }]}>
          {activitySummary()}
        </Text>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.colors.text, marginTop: 20 }]}>🧭 Discover</Text>
      <View style={styles.grid}>
        {discoverItems.map(({ label, icon }) => (
          <TouchableOpacity
            key={label}
            style={[styles.gridItem, { backgroundColor: theme.colors.card }]}
            onPress={navigateTo(label)}
            accessibilityLabel={`Go to ${label}`}
            accessibilityRole="button"
            activeOpacity={0.7}
          >
            <Text style={[styles.gridIcon, { color: theme.colors.text }]}>{icon}</Text>
            <Text style={[styles.gridLabel, { color: theme.colors.text }]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  quote: {
    fontSize: 16,
    fontStyle: 'italic',
    lineHeight: 22,
  },
  refreshHint: {
    marginTop: 10,
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'right',
  },
  activityText: {
    fontSize: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    paddingVertical: 18,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    // subtle shadow for feedback
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  gridIcon: {
    fontSize: 26,
    marginBottom: 6,
  },
  gridLabel: {
    fontWeight: '600',
    fontSize: 16,
  },
});

export default DashboardScreen;