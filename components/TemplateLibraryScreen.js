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
        