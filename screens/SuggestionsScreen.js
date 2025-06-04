import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const SuggestionsScreen = () => {
  const navigation = useNavigation();
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeeklyData = async () => {
      try {
        const data = await AsyncStorage.getItem('weeklyTracker');
        if (data) {
          setWeeklyData(JSON.parse(data));
        } else {
          setWeeklyData([]);
        }
      } catch (error) {
        console.error('Error fetching weekly tracker data:', error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = navigation.addListener('focus', fetchWeeklyData);
    return unsubscribe;
  }, [navigation]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>💡 AI Suggestions Summary</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
      ) : weeklyData.length === 0 ? (
        <Text style={styles.placeholder}>
          No data available for this week. Log your habits and workouts to start generating insights!
        </Text>
      ) : (
        weeklyData.map((entry, index) => (
          <View key={index} style={styles.entryContainer}>
            <Text style={styles.entryDate}>{entry.date}</Text>
            {Object.entries(entry.data).map(([key, value]) => (
              <Text key={key} style={styles.entryText}>{`${key}: ${value}`}</Text>
            ))}
          </View>
        ))
      )}

      <TouchableOpacity
        style={styles.historyButton}
        onPress={() => navigation.navigate('History')}
        accessibilityLabel="View full calendar history"
      >
        <Text style={styles.historyButtonText}>View Calendar History</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  contentContainer: { padding: 16, paddingBottom: 40 },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  placeholder: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 20,
  },
  entryContainer: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f0f4f8',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  entryDate: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#007AFF',
  },
  entryText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  },
  historyButton: {
    marginTop: 30,
    alignSelf: 'center',
    paddingVertical: 14,
    paddingHorizontal: 28,
    backgroundColor: '#007AFF',
    borderRadius: 10,
  },
  historyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SuggestionsScreen;