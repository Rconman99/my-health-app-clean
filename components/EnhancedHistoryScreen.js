import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, parseISO } from 'date-fns';

const protocols = [
  'Workout',
  'Cold Plunge',
  'Red Light',
  'Grounding',
  'Peptides',
  'Sauna',
];

const STORAGE_KEY = 'trackerLog';

const EnhancedHistoryScreen = () => {
  const [log, setLog] = useState({});

  useEffect(() => {
    const fetchLog = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setLog(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Failed to load tracker log:', error);
      }
    };
    fetchLog();
  }, []);

  const renderDay = (dateKey, dayLog) => {
    let formattedDate = dateKey;
    try {
      formattedDate = format(parseISO(dateKey), 'EEEE, MMM d, yyyy');
    } catch {}

    return (
      <View key={dateKey} style={styles.dayContainer} accessible accessibilityRole="summary">
        <Text style={styles.date}>{formattedDate}</Text>

        {protocols.map((protocol) => (
          <View key={protocol} style={styles.protocolBox} accessible accessibilityRole="text">
            <Text style={styles.protocolTitle}>{protocol}</Text>
            {dayLog[protocol] ? (
              typeof dayLog[protocol] === 'object' ? (
                Object.entries(dayLog[protocol]).map(([label, value]) => (
                  <Text key={label} style={styles.detail}>
                    {label}: {value}
                  </Text>
                ))
              ) : (
                <Text style={styles.detail}>{dayLog[protocol]}</Text>
              )
            ) : (
              <Text style={styles.missing}>Not logged</Text>
            )}
          </View>
        ))}

        {dayLog.notes && (
          <View style={styles.notesBox} accessible accessibilityRole="text">
            <Text style={styles.notesLabel}>📝 Day Notes:</Text>
            <Text style={styles.detail}>{dayLog.notes}</Text>
          </View>
        )}
      </View>
    );
  };

  const sortedDates = Object.keys(log).sort((a, b) => new Date(b) - new Date(a));

  return (
    <ScrollView contentContainerStyle={styles.container} accessibilityLabel="Journal history screen">
      <Text style={styles.header}>📆 Journal Log</Text>

      {sortedDates.length === 0 ? (
        <Text style={styles.missing}>No logs found</Text>
      ) : (
        sortedDates.map((dateKey) => renderDay(dateKey, log[dateKey]))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 100,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#222',
  },
  dayContainer: {
    marginBottom: 28,
    padding: 16,
    backgroundColor: '#f4f6f8',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  date: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 14,
    color: '#1a73e8',
  },
  protocolBox: {
    marginBottom: 12,
  },
  protocolTitle: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 4,
    color: '#333',
  },
  detail: {
    fontSize: 14,
    marginLeft: 12,
    color: '#555',
  },
  missing: {
    fontStyle: 'italic',
    color: '#999',
    marginLeft: 12,
  },
  notesBox: {
    marginTop: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  notesLabel: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 6,
    color: '#444',
  },
});

export default EnhancedHistoryScreen;