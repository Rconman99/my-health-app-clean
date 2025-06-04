import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const TrackerScreen = () => {
  const navigation = useNavigation();
  const [weeklyData, setWeeklyData] = useState([]);

  useEffect(() => {
    const fetchWeeklyData = async () => {
      try {
        const data = await AsyncStorage.getItem('weeklyTracker');
        if (data) {
          setWeeklyData(JSON.parse(data));
        }
      } catch (error) {
        console.error('Error fetching weekly tracker data:', error);
      }
    };

    const unsubscribe = navigation.addListener('focus', fetchWeeklyData);
    return unsubscribe;
  }, [navigation]);

  return (
    <ScrollView style={styles.container} accessibilityLabel="Weekly Tracker Screen">
      <Text style={styles.title}>📊 Weekly Tracker Summary</Text>

      {weeklyData.length === 0 ? (
        <Text style={styles.placeholder}>No data available for this week.</Text>
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
        accessibilityLabel="Navigate to Calendar History"
      >
        <Text style={styles.historyButtonText}>📅 View Calendar History</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333',
  },
  placeholder: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 40,
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
    color: '#007AFF',
    marginBottom: 8,
  },
  entryText: {
    fontSize: 15,
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
    fontWeight: 'bold',
  },
});

export default TrackerScreen;