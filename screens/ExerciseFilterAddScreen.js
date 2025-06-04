import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';

export default function ExerciseLogScreen({ navigation }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const loadLogs = async () => {
      try {
        const data = await AsyncStorage.getItem('workoutLogs');
        if (data) {
          const parsed = JSON.parse(data);
          const sorted = parsed.sort((a, b) => new Date(b.date) - new Date(a.date));
          setLogs(sorted);
        }
      } catch (err) {
        console.error('Failed to load logs:', err);
      }
    };

    const unsubscribe = navigation.addListener('focus', loadLogs);
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.date}>{format(new Date(item.date), 'PPP')}</Text>
      {item.exercises.map((ex, idx) => (
        <View key={idx} style={styles.exerciseRow}>
          <Text style={styles.exerciseName}>{ex.emoji} {ex.name}</Text>
          <Text style={styles.details}>Rounds: {ex.rounds}</Text>
          {ex.weights && ex.weights.length > 0 && (
            <Text style={styles.details}>Weights: {ex.weights.join(', ')}</Text>
          )}
          {ex.notes ? <Text style={styles.details}>Notes: {ex.notes}</Text> : null}
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Exercise Log</Text>
      {logs.length === 0 ? (
        <Text style={styles.empty}>No exercise logs available.</Text>
      ) : (
        <FlatList
          data={logs}
          keyExtractor={(item, index) => `${item.date}-${index}`}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      )}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    marginTop: 30,
    fontStyle: 'italic',
  },
  listContainer: {
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  date: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  exerciseRow: {
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '500',
  },
  details: {
    fontSize: 14,
    color: '#555',
  },
  backButton: {
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: '#007aff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});