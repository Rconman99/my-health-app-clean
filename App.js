// App.js

import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ThemeProvider, useTheme } from './ThemeContext';

import DashboardScreen from './components/DashboardScreen';
import TrackerScreen from './components/TrackerScreen';
import ProfileForm from './components/ProfileForm';
import SuggestionsScreen from './components/SuggestionsScreen';
import EnhancedHistoryScreen from './components/EnhancedHistoryScreen';
import TrendsScreen from './components/TrendsScreen';
import SettingsScreen from './components/SettingsScreen';
import EditProfileScreen from './components/EditProfileScreen';
import WorkoutScreen from './components/WorkoutScreen';
import DiscoverScreen from './components/DiscoverScreen';

const RootStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const WorkoutStack = createNativeStackNavigator();

const TAB_ICONS = {
  Dashboard: 'home-outline',
  Workout: 'barbell-outline',
  Tracker: 'fitness-outline',
  Profile: 'person-outline',
  Suggestions: 'bulb-outline',
  Journal: 'book-outline',
  Trends: 'trending-up-outline',
  Settings: 'settings-outline',
  Discover: 'compass-outline',
};

function WorkoutStackNavigator() {
  return (
    <WorkoutStack.Navigator
      screenOptions={{
        headerShown: true,
        animation: 'slide_from_right',
      }}
    >
      <WorkoutStack.Screen
        name="WorkoutMain"
        component={WorkoutScreen}
        options={{ title: 'Workout' }}
      />
      {/* Add nested workout screens here */}
    </WorkoutStack.Navigator>
  );
}

function MainTabs() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          const iconName = TAB_ICONS[route.name] || 'ellipse-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
          height: 60,
          paddingBottom: 6,
          paddingTop: 6,
        },
        tabBarAccessibilityLabel: `${route.name} tab`,
        tabBarTestID: `${route.name.toLowerCase()}Tab`,
        lazy: true,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Workout" component={WorkoutStackNavigator} />
      <Tab.Screen name="Tracker" component={TrackerScreen} />
      <Tab.Screen name="Profile" component={ProfileForm} />
      <Tab.Screen name="Suggestions" component={SuggestionsScreen} />
      <Tab.Screen name="Journal" component={EnhancedHistoryScreen} />
      <Tab.Screen name="Trends" component={TrendsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
      <Tab.Screen name="Discover" component={DiscoverScreen} />
    </Tab.Navigator>
  );
}

const linking = {
  prefixes: ['myhealthapp://', 'https://myhealthapp.com'],
  config: {
    screens: {
      MainTabs: {
        screens: {
          Dashboard: 'dashboard',
          Workout: {
            screens: {
              WorkoutMain: 'workout',
            },
          },
          Tracker: 'tracker',
          Profile: 'profile',
          Suggestions: 'suggestions',
          Journal: 'journal',
          Trends: 'trends',
          Settings: 'settings',
          Discover: 'discover',
        },
      },
      EditProfile: 'edit-profile',
    },
  },
};

function AppInner() {
  const { theme } = useTheme();

  return (
    <NavigationContainer theme={theme} linking={linking} fallback={<Text>Loading...</Text>}>
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          presentation: 'modal',
        }}
      >
        <RootStack.Screen name="MainTabs" component={MainTabs} />
        <RootStack.Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={{
            headerShown: true,
            title: 'Edit Profile',
            animation: 'slide_from_bottom',
            presentation: 'modal',
          }}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AppInner />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}