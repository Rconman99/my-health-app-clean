import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../ThemeContext';

const activities = [
  'Workout',
  'Cold Plunge',
  'Red Light Therapy',
  'Peptide Dose',
  'Grounding',
];

const getPastNDates = (n) => {
  const dates = [];
  for (let i = 0; i < n; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
};

const HistoryScreen = () => {
  const { theme } = useTheme();
  const [log, setLog] = useState({});
  const [summary, setSummary] = useState({});
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const last7Days = getPastNDates(7);

  useEffect(() => {
    loadLog();
  }, []);

  const loadLog = async () => {
    try {
      const stored = await AsyncStorage.getItem('habitLog');
      const parsed = stored ? JSON.parse(stored) : {};
      setLog(parsed);
      calculateSummary(parsed);
      const streakData = calculateStreak(parsed);

      // Trigger badge alert
      if (streakData.current === 3) {
        Alert.alert('🔥 3-Day Streak!', 'Nice work! Keep it going!');
      } else if (streakData.current === 7) {
        Alert.alert('🏆 7-Day Streak!', "You're crushing it. Milestone unlocked!");
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    }
  };

  const calculateSummary = (logData) => {
    const summaryData = {};
    for (let activity of activities) {
      summaryData[activity] = 0;
    }

    for (let date of last7Days) {
      const dayLog = logData[date]?.habits || [];
      for (let activity of activities) {
        if (dayLog.includes(activity)) {
          summaryData[activity] += 1;
        }
      }
    }

    setSummary(summaryData);
  };

  const calculateStreak = (logData) => {
    let currentStreak = 0;
    let longestStreak = 0;

    const allDates = Object.keys(logData).sort().reverse();

    for (let i = 0; i < allDates.length; i++) {
      const date = allDates[i];
      const hasHabits = logData[date]?.habits?.length > 0;

      if (hasHabits) {
        currentStreak += 1;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        if (i === 0) continue; // allow today to be blank
        break;
      }
    }

    setStreak(currentStreak);
    setBestStreak(longestStreak);

    return { current: currentStreak, best: longestStreak };
  };

  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Last 7 Days</Text>

        <View style={[styles.streakBlock, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>🔥 Streaks</Text>
          <Text style={[styles.streakItem, { color: theme.colors.text }]}>Current Streak: {streak} day(s)</Text>
          <Text style={[styles.streakItem, { color: theme.colors.text }]}>Best Streak: {bestStreak} day(s)</Text>
        </View>

        <View style={[styles.summaryBlock, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Weekly Summary</Text>
          {activities.map((activity) => (
            <Text key={activity} style={[styles.summaryItem, { color: theme.colors.text }]}>
              {activity}: {summary[activity] || 0}/7 days
            </Text>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Daily Breakdown</Text>
        {last7Days.map((date, index) => {
          const day = log[date];
          const habits = day?.habits || [];
          const mood = day?.mood || '';

          return (
            <View key={index} style={[styles.dayCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
              <Text style={[styles.date, { color: theme.colors.text }]}>
                {date} {mood ? `| Mood: ${mood}` : ''}
              </Text>
              {activities.map((activity) => (
                <Text
                  key={activity}
                  style={[
                    habits.includes(activity) ? styles.checked : styles.unchecked,
                    { color: habits.includes(activity) ? '#0a0' : theme.colors.text },
                  ]}
                >
                  {habits.includes(activity) ? '✅' : '⬜️'} {activity}
                </Text>
              ))}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 10,
  },
  summaryBlock: {
    marginBottom: 20,
    padding: 12,
    borderWidth: 1,
    borderRadius: 10,
  },
  streakBlock: {
    marginBottom: 15,
    padding: 12,
    borderWidth: 1,
    borderRadius: 10,
  },
  streakItem: {
    fontSize: 16,
    marginBottom: 6,
  },
  summaryItem: {
    fontSize: 15,
    marginBottom: 4,
  },
  dayCard: {
    marginBottom: 20,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  date: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 6,
  },
  checked: {
    marginLeft: 10,
    marginBottom: 2,
  },
  unchecked: {
    marginLeft: 10,
    marginBottom: 2,
  },
});

export default HistoryScreen;