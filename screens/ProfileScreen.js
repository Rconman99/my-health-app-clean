// screens/ProfileScreen.js

import React from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import ProfileForm from '../components/ProfileForm';

export default function ProfileScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ProfileForm />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
});