import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';

const HistoryScreen = () => {
  const navigation = useNavigation();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await AsyncStorage.getItem('weeklyTracker');
        if (data) {
          const parsed = JSON.parse(data);
          const sorted = parsed.sort((a, b) => new Date(b.date) - new Date(a.date));
          setHistory(sorted);
        }
      } catch (error) {
        console.error('Failed to load history:', error);
      }
    };

    const unsubscribe = navigation.addListener('focus', loadHistory);
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.date}>{format(new Date(item.date), 'PPP')}</Text>
      {Object.entries(item.data).map(([key, value]) => (
        <Text key={key} style={styles.metric}>{key}: {value}</Text>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daily History</Text>
      {history.length === 0 ? (
        <Text style={styles.empty}>No history available.</Text>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item, index) => `${item.date}-${index}`}
          renderItem={renderItem}
        />
      )}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 26, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  empty: { textAlign: 'center', color: '#999', marginTop: 20 },
  card: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  date: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  metric: { fontSize: 15, color: '#444', marginBottom: 4 },
  backButton: {
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default HistoryScreen;