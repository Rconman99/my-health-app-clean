import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const defaultTemplates = [
  {
    id: 'strength-6',
    name: '6-Week Strength Plan',
    weeks: 6,
    description: 'Focus on progressive overload for compound lifts.',
    goals: ['Muscle gain', 'Strength'],
  },
  {
    id: 'spartan-8',
    name: '8-Week Spartan Prep',
    weeks: 8,
    description: 'Endurance + functional workouts to prep for race.',
    goals: ['Endurance', 'Conditioning'],
  },
  {
    id: 'cut-4',
    name: '4-Week Summer Cut',
    weeks: 4,
    description: 'Fat loss-focused plan with HIIT & resistance.',
    goals: ['Fat loss', 'Shred'],
  },
];

const STORAGE_KEY = 'customTemplates';

const TemplateLibraryScreen = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const loadTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const parsed = stored ? JSON.parse(stored) : [];
      // Combine defaults with custom templates, ensuring no duplicates by id
      const combined = [...defaultTemplates];
      parsed.forEach((ct) => {
        if (!combined.some((dt) => dt.id === ct.id)) combined.push(ct);
      });
      setTemplates(combined);
    } catch (err) {
      console.error('Failed to load templates:', err);
      setTemplates([...defaultTemplates]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTemplates();
    }, [loadTemplates])
  );

  const handleUseTemplate = (template) => {
    navigation.navigate('MultiWeekPlanner', { template });
  };

  const handleEditTemplate = (template) => {
    navigation.navigate('TemplateEditor', { template, isEdit: true });
  };

  const handleAddTemplate = () => {
    navigation.navigate('TemplateEditor', { isEdit: false });
  };

  const handleDeleteTemplate = (templateId) => {
    Alert.alert(
      'Delete Template',
      'Are you sure you want to delete this custom template?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const stored = await AsyncStorage.getItem(STORAGE_KEY);
              const parsed = stored ? JSON.parse(stored) : [];
              const filtered = parsed.filter((t) => t.id !== templateId);
              await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
              loadTemplates();
            } catch (err) {
              console.error('Failed to delete template:', err);
              Alert.alert('Delete failed. Please try again.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header} accessibilityRole="header" accessibilityLabel="Template Library">
        🏋️ Template Library
      </Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddTemplate}
        accessibilityRole="button"
        accessibilityLabel="Add New Template"
      >
        <Text style={styles.addButtonText}>+ Add New Template</Text>
      </TouchableOpacity>

      {templates.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No templates available.</Text>
        </View>
      ) : (
        <FlatList
          data={templates}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isDefault = defaultTemplates.some((dt) => dt.id === item.id);
            return (
              <TouchableOpacity
                style={styles.card}
                onPress={() => handleUseTemplate(item)}
                onLongPress={() => {
                  if (!isDefault) {
                    Alert.alert(
                      'Edit or Delete?',
                      `Manage template "${item.name}"`,
                      [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Edit', onPress: () => handleEditTemplate(item) },
                        { text: 'Delete', style: 'destructive', onPress: () => handleDeleteTemplate(item.id) },
                      ],
                      { cancelable: true }
                    );
                  }
                }}
                accessibilityRole="button"
                accessibilityLabel={`Use template ${item.name}`}
                accessibilityHint={isDefault ? 'Default template, cannot edit or delete' : 'Long press to edit or delete'}
              >
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.meta}>{item.description}</Text>
                <Text style={styles.meta}>Duration: {item.weeks} weeks</Text>
                <Text style={styles.goalTags}>{item.goals.join(', ')}</Text>
              </TouchableOpacity>
            );
          }}
          accessibilityLabel="List of workout templates"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  center: { justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  emptyText: { fontSize: 18, color: '#666' },
  card: {
    backgroundColor: '#f9f9f9',
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  name: { fontSize: 18, fontWeight: 'bold' },
  meta: { fontSize: 14, color: '#555', marginTop: 4 },
  goalTags: { fontSize: 13, marginTop: 6, color: '#007bff' },
  addButton: {
    backgroundColor: '#007bff',
    padding: 14,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default TemplateLibraryScreen;