import React from 'react';
import { useColorScheme, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

import DashboardScreen from './screens/DashboardScreen';
import ProfileScreen from './screens/ProfileScreen';
import SuggestionsScreen from './screens/SuggestionsScreen';
import WorkoutScreen from './screens/WorkoutScreen';
import TrackerScreen from './screens/TrackerScreen';
import HistoryScreen from './screens/HistoryScreen';
import JournalScreen from './screens/JournalScreen';
import TrendsScreen from './screens/TrendsScreen';
import SettingsScreen from './screens/SettingsScreen';
import ExerciseSelector from './components/ExerciseSelector';

import { ThemeProvider, useTheme } from './context/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';

const linking = {
  prefixes: ['myhealthapp://', 'https://myhealthapp.com'],
  config: {
    screens: {
      Dashboard: 'dashboard',
      Profile: 'profile',
      Suggestions: 'suggestions',
      Workout: {
        screens: {
          Workout: 'workout',
          ExerciseSelector: 'exercise-selector',
        },
      },
      Tracker: {
        screens: {
          Tracker: 'tracker',
          History: 'history',
        },
      },
      Journal: 'journal',
      Trends: 'trends',
      Settings: 'settings',
    },
  },
};

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TrackerStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Tracker" component={TrackerScreen} />
    <Stack.Screen name="History" component={HistoryScreen} />
  </Stack.Navigator>
);

const WorkoutStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Workout" component={WorkoutScreen} />
    <Stack.Screen name="ExerciseSelector" component={ExerciseSelector} />
  </Stack.Navigator>
);

function MainApp() {
  const { theme } = useTheme();

  return (
    <NavigationContainer linking={linking} theme={theme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            let iconName;
            switch (route.name) {
              case 'Dashboard':
                iconName = 'home';
                break;
              case 'Profile':
                iconName = 'person';
                break;
              case 'Suggestions':
                iconName = 'bulb';
                break;
              case 'Workout':
                iconName = 'barbell';
                break;
              case 'Tracker':
                iconName = 'stats-chart';
                break;
              case 'Journal':
                iconName = 'document-text';
                break;
              case 'Trends':
                iconName = 'analytics';
                break;
              case 'Settings':
                iconName = 'settings';
                break;
              default:
                iconName = 'ellipse';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="Suggestions" component={SuggestionsScreen} />
        <Tab.Screen name="Workout" component={WorkoutStack} />
        <Tab.Screen name="Tracker" component={TrackerStack} />
        <Tab.Screen name="Journal" component={JournalScreen} />
        <Tab.Screen name="Trends" component={TrendsScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider theme={colorScheme}>
        <ErrorBoundary fallback={<Text>Something went wrong. Please restart the app.</Text>}>
          <MainApp />
        </ErrorBoundary>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}