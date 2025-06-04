import React from 'react';
import { View, ScrollView } from 'react-native';
import Journal from '../components/Journal'; // Or whatever your component is named

export default function JournalScreen() {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
      <Journal />
    </ScrollView>
  );
}