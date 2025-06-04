import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';

const EnhancedHistoryScreen = () => {
  const navigation = useNavigation();
  const [history, setHistory] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);

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
    <TouchableOpacity onPress={() => setSelectedDay(item)} style={styles.card}>
      <Text style={styles.date}>{format(new Date(item.date), 'PPP')}</Text>
      {Object.entries(item.data).map(([key, value]) => (
        <Text key={key} style={styles.metric}>{key}: {value}</Text>
      ))}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enhanced History Log</Text>
      {history.length === 0 ? (
        <Text style={styles.empty}>No tracked data available.</Text>
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

      <Modal visible={!!selectedDay} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{format(new Date(selectedDay?.date), 'PPPP')}</Text>
            {selectedDay && Object.entries(selectedDay.data).map(([key, value]) => (
              <Text key={key} style={styles.modalText}>{key}: {value}</Text>
            ))}
            <TouchableOpacity onPress={() => setSelectedDay(null)} style={styles.closeButton}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
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
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 12,
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    marginTop: 30,
  },
  card: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  date: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  metric: {
    fontSize: 16,
    marginBottom: 4,
  },
  backButton: {
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '85%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 6,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#FF3B30',
    paddingVertical: 10,
    borderRadius: 8,
  },
  closeText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default EnhancedHistoryScreen;