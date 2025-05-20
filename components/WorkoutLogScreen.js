import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { loadFromStorage } from '../storage';

const WorkoutLogScreen = () => {
  const [entries, setEntries] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLog = useCallback(async () => {
    setRefreshing(true);
    try {
      const stored = await loadFromStorage('history');
      if (stored) {
        // Flatten and sort by date descending
        const sorted = Object.entries(stored)
          .sort((a, b) => b[0].localeCompare(a[0]))
          .flatMap(([date, entry]) =>
            entry.exercises.map((ex, i) => ({
              key: `${date}-${i}`,
              date,
              ...ex,
            }))
          );
        setEntries(sorted);
      } else {
        setEntries([]);
      }
    } catch (err) {
      console.error('Failed to load workout log:', err);
      setEntries([]);
    }
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchLog();
  }, [fetchLog]);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(date);
    } catch {
      return dateString;
    }
  };

  const onEntryPress = (item) => {
    // TODO: expand to detail/edit workout entry screen
    console.log('Selected workout entry:', item);
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      key={item.key}
      style={styles.entryContainer}
      onPress={() => onEntryPress(item)}
      accessibilityRole="button"
      accessibilityLabel={`Workout entry for ${item.name} on ${formatDate(item.date)}`}
    >
      {(index === 0 || item.date !== entries[index - 1]?.date) && (
        <Text style={styles.dateHeader}>📅 {formatDate(item.date)}</Text>
      )}

      <Text style={styles.exerciseName}>{item.name}</Text>

      {item.superset && (
        <Text style={styles.supersetLabel}>🔥 Superset {item.superset}</Text>
      )}

      <Text style={styles.detailText}>Rounds: {item.rounds || 1}</Text>
      <Text style={styles.detailText}>Reps: {item.reps || '—'}</Text>

      {Array.isArray(item.weights) && (
        <Text style={styles.detailText}>
          Weights: {item.weights.map((w, i) => `Round ${i + 1}: ${w || '—'}`).join(', ')}
        </Text>
      )}

      {item.notes && <Text style={styles.notesText}>📝 {item.notes}</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>📋 Workout Log</Text>

      {entries.length === 0 && !refreshing ? (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateTitle}>No workout entries yet</Text>
          <Text style={styles.emptyStateSubtitle}>Log your first workout to get started!</Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.key}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchLog} />}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  screenTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#007bff',
  },
  emptyStateContainer: {
    marginTop: 80,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 6,
    textAlign: 'center',
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#007bff',
    marginTop: 20,
    marginBottom: 8,
  },
  entryContainer: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 12,
    marginBottom: 14,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
  },
  supersetLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#d63384',
    marginTop: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#444',
    marginTop: 4,
  },
  notesText: {
    marginTop: 6,
    fontStyle: 'italic',
    color: '#555',
  },
});

export default WorkoutLogScreen;