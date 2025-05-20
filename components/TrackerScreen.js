import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Button,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../ThemeContext';
import PushNotification from 'react-native-push-notification';

const ACTIVITIES = [
  'Workout',
  'Cold Plunge',
  'Red Light Therapy',
  'Peptide Dose',
  'Grounding',
];

const MOOD_OPTIONS = ['😄 Happy', '😐 Neutral', '😩 Tired', '😠 Stressed'];

const HABIT_LOG_KEY = 'habitLog';
const NOTIF_CHANNEL_ID = 'daily-reminder';

const TrackerScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [log, setLog] = useState({});
  const [mood, setMood] = useState('');
  const today = new Date().toISOString().split('T')[0];
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notificationsConfigured, setNotificationsConfigured] = useState(false);

  // Create notification channel on Android and schedule notification once
  const configureNotifications = useCallback(() => {
    if (notificationsConfigured) return; // Only once

    PushNotification.createChannel(
      {
        channelId: NOTIF_CHANNEL_ID,
        channelName: 'Daily Reminder',
        channelDescription: 'Reminder to track your habits daily',
        importance: 4,
        vibrate: true,
      },
      (created) => {
        console.log(`Notification channel '${NOTIF_CHANNEL_ID}' created:`, created);
      }
    );

    PushNotification.configure({
      onNotification: (notification) => {
        console.log('Notification:', notification);
      },
      popInitialNotification: true,
      requestPermissions: true,
    });

    // Cancel all previous to avoid duplicates, then schedule daily notification at 7 PM
    PushNotification.cancelAllLocalNotifications();

    const now = new Date();
    let sevenPM = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      19, 0, 0
    );
    if (sevenPM <= now) {
      sevenPM.setDate(sevenPM.getDate() + 1);
    }

    PushNotification.localNotificationSchedule({
      channelId: NOTIF_CHANNEL_ID,
      message: "Don't forget to track your habits and mood today!",
      date: sevenPM,
      repeatType: 'day',
      allowWhileIdle: true,
    });

    setNotificationsConfigured(true);
  }, [notificationsConfigured]);

  // Load log data and mood
  const loadLog = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(HABIT_LOG_KEY);
      const parsed = stored ? JSON.parse(stored) : {};
      setLog(parsed);
      const todayLog = parsed[today] || {};
      setMood(todayLog.mood || '');
    } catch (err) {
      console.error('Error loading log:', err);
      Alert.alert('Error', 'Failed to load habit log.');
    }
  }, [today]);

  // Load last 7 days history
  const loadHistory = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(HABIT_LOG_KEY);
      const parsed = stored ? JSON.parse(stored) : {};
      const days = Object.keys(parsed)
        .sort((a, b) => b.localeCompare(a))
        .slice(0, 7);
      const historyData = days.map((date) => ({
        date,
        habits: parsed[date]?.habits || [],
        mood: parsed[date]?.mood || '',
      }));
      setHistory(historyData);
    } catch (err) {
      console.error('Error loading history:', err);
      Alert.alert('Error', 'Failed to load history.');
    }
  }, []);

  // Combined load & hide loading
  const loadAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([loadLog(), loadHistory()]);
    setLoading(false);
  }, [loadLog, loadHistory]);

  // Save updated log and optionally new mood
  const saveLog = useCallback(
    async (newLog, newMood) => {
      try {
        await AsyncStorage.setItem(HABIT_LOG_KEY, JSON.stringify(newLog));
        setLog(newLog);
        if (newMood !== undefined) setMood(newMood);
        await loadHistory();
      } catch (err) {
        console.error('Failed to save log:', err);
        Alert.alert('Error', 'Failed to save habit log.');
      }
    },
    [loadHistory]
  );

  const toggleActivity = useCallback(
    (activity) => {
      const todayLog = log[today] || { habits: [], mood };
      const hasActivity = todayLog.habits.includes(activity);
      const updatedHabits = hasActivity
        ? todayLog.habits.filter((a) => a !== activity)
        : [...todayLog.habits, activity];

      const newLog = {
        ...log,
        [today]: { ...todayLog, habits: updatedHabits, mood },
      };

      saveLog(newLog);
    },
    [log, mood, saveLog, today]
  );

  const selectMood = useCallback(
    (selectedMood) => {
      const todayLog = log[today] || { habits: [], mood: '' };

      const newLog = {
        ...log,
        [today]: { ...todayLog, mood: selectedMood },
      };

      saveLog(newLog, selectedMood);
    },
    [log, saveLog, today]
  );

  const isChecked = useCallback(
    (activity) => log[today]?.habits?.includes(activity),
    [log, today]
  );

  // Workout frequency %
  const workoutDays = history.filter((h) => h.habits.includes('Workout')).length;
  const progressPercent = Math.round((workoutDays / 7) * 100);

  // Effects
  useEffect(() => {
    loadAll();
    configureNotifications();
  }, [loadAll, configureNotifications]);

  // Render loading UI
  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ color: theme.colors.text, marginTop: 10 }}>Loading your habit data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }}>
      <View style={[styles.container]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Today's Tracker
        </Text>
        <Text style={[styles.date, { color: theme.colors.text }]}>{today}</Text>

        {ACTIVITIES.map((activity, index) => {
          const checked = isChecked(activity);
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.button,
                {
                  backgroundColor: checked ? theme.colors.primary : theme.colors.card,
                  borderColor: theme.colors.border,
                },
              ]}
              onPress={() => toggleActivity(activity)}
              accessibilityRole="button"
              accessibilityState={{ selected: checked }}
              accessibilityLabel={`Toggle ${activity} ${checked ? 'on' : 'off'}`}
            >
              <Text
                style={{
                  color: checked ? '#fff' : theme.colors.text,
                  textAlign: 'center',
                  fontSize: 16,
                  fontWeight: checked ? '600' : '400',
                }}
              >
                {activity}
              </Text>
            </TouchableOpacity>
          );
        })}

        <Text style={[styles.moodLabel, { color: theme.colors.text }]}>
          How are you feeling?
        </Text>
        <View style={styles.moodRow}>
          {MOOD_OPTIONS.map((m, index) => {
            const selected = mood === m;
            return (
              <TouchableOpacity
                key={index}
                onPress={() => selectMood(m)}
                style={[
                  styles.moodButton,
                  {
                    backgroundColor: selected ? theme.colors.primary : theme.colors.card,
                    borderColor: theme.colors.border,
                  },
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={`Select mood ${m}`}
              >
                <Text
                  style={{
                    fontSize: 18,
                    color: selected ? '#fff' : theme.colors.text,
                  }}
                >
                  {m}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View
          style={[styles.progressContainer, { borderColor: theme.colors.border }]}
          accessibilityRole="progressbar"
          accessibilityValue={{ now: progressPercent, min: 0, max: 100 }}
          accessibilityLabel="Workout Frequency last 7 days"
        >
          <Text style={[styles.progressLabel, { color: theme.colors.text }]}>
            Workout Frequency (Last 7 Days): {progressPercent}%
          </Text>
          <View style={styles.progressBarBackground}>
            <View
              style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
            />
          </View>
        </View>

        <Text style={[styles.historyTitle, { color: theme.colors.text, marginTop: 30 }]}>
          Last 7 Days History
        </Text>
        {history.length === 0 && (
          <Text style={{ color: theme.colors.text, marginTop: 8 }}>
            No history data available.
          </Text>
        )}
        {history.map(({ date, habits, mood: dayMood }) => (
          <View key={date} style={[styles.historyItem, { borderColor: theme.colors.border }]}>
            <Text style={[styles.historyDate, { color: theme.colors.text }]}>{date}</Text>
            <Text style={{ color: theme.colors.text }}>
              Habits: {habits.length > 0 ? habits.join(', ') : 'None'}
            </Text>
            <Text style={{ color: theme.colors.text }}>
              Mood: {dayMood || 'Not logged'}
            </Text>
          </View>
        ))}

        <View style={{ marginTop: 30 }}>
          <Button
            title="Go to Profile Setup"
            onPress={() => navigation.navigate('Profile')}
          />
          <View style={{ height: 15 }} />
          <Button
            title="Go to Your Plan"
            onPress={() => navigation.navigate('Suggestions')}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  container: {
    padding: 30,
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },
  date: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    padding: 14,
    marginVertical: 8,
    borderWidth: 1,
    borderRadius: 10,
  },
  moodLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 25,
    marginBottom: 10,
    textAlign: 'center',
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  moodButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 10,
  },
  progressContainer: {
    marginTop: 20,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
  progressBarBackground: {
    width: '100%',
    height: 20,
    backgroundColor: '#ddd',
    borderRadius: 12,
  },
  progressBarFill: {
    height: 20,
    backgroundColor: '#007bff',
    borderRadius: 12,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  historyItem: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
  },
  historyDate: {
    fontWeight: '600',
    marginBottom: 4,
  },
});

export default TrackerScreen;