import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProgressScreen = () => {
  const [progress, setProgress] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadProgress = useCallback(async () => {
    setRefreshing(true);
    try {
      const stored = await AsyncStorage.getItem('weeklyPlan');
      const parsed = stored ? JSON.parse(stored) : {};

      const results = Object.keys(parsed).map((day) => {
        const details = parsed[day];
        const totalExercises = details?.workout?.length || 0;
        const completed = details?.workout?.filter((w) => w.completed).length || 0;
        return {
          day,
          total: totalExercises,
          completed,
          percent: totalExercises ? Math.round((completed / totalExercises) * 100) : 0,
        };
      });

      setProgress(results);
    } catch (err) {
      console.error('Failed to load progress:', err);
      setProgress([]);
    }
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.day}>{item.day}</Text>
      <Text style={styles.details}>✅ {item.completed} / {item.total} completed</Text>

      <View style={styles.progressBarBackground}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${item.percent}%` },
            item.percent === 100 && styles.progressBarComplete,
          ]}
        />
      </View>

      <Text style={styles.percent}>Progress: {item.percent}%</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📈 Weekly Progress</Text>

      {progress.length === 0 && !refreshing ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No progress data available.</Text>
          <Text style={styles.emptySubText}>Complete some workouts to see your progress here.</Text>
        </View>
      ) : (
        <FlatList
          data={progress}
          keyExtractor={(item) => item.day}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={loadProgress} />
          }
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  card: {
    backgroundColor: '#f3f3f3',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  day: { fontSize: 18, fontWeight: '600' },
  details: { fontSize: 14, marginTop: 4, color: '#555' },
  progressBarBackground: {
    height: 12,
    backgroundColor: '#ddd',
    borderRadius: 6,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#007bff',
    borderRadius: 6,
  },
  progressBarComplete: {
    backgroundColor: '#28a745', // green when 100%
  },
  percent: { fontSize: 14, marginTop: 4, fontWeight: 'bold', color: '#007bff' },
  emptyContainer: {
    marginTop: 80,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
  },
  emptySubText: {
    marginTop: 6,
    fontSize: 14,
    color: '#999',
  },
});

export default ProgressScreen;