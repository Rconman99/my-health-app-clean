import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../ThemeContext';
import { LineChart, BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width - 30;

const getPastNDates = (n) => {
  const dates = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
};

const TrendsScreen = () => {
  const { theme } = useTheme();
  const [log, setLog] = useState({});
  const last7Days = getPastNDates(7);

  useEffect(() => {
    const loadLog = async () => {
      try {
        const stored = await AsyncStorage.getItem('habitLog');
        const parsed = stored ? JSON.parse(stored) : {};
        setLog(parsed);
      } catch (err) {
        console.error('Failed to load habit log:', err);
      }
    };
    loadLog();
  }, []);

  const extractSeries = (field) =>
    last7Days.map((date) => {
      const val = log[date]?.[field];
      // parseFloat in case values are stored as strings
      return val !== undefined && val !== null ? parseFloat(val) : 0;
    });

  const getLabels = () => last7Days.map((d) => d.slice(5)); // MM-DD

  const peptideNotes = last7Days
    .map((date) =>
      log[date]?.peptideType
        ? `• ${date.slice(5)}: ${log[date].peptideType}`
        : null
    )
    .filter(Boolean);

  return (
    <ScrollView
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={styles.container}
      accessibilityLabel="Health trends and progress charts"
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>
        📈 Trends (Last 7 Days)
      </Text>

      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        🧊 Cold Plunge Duration (min)
      </Text>
      <BarChart
        data={{ labels: getLabels(), datasets: [{ data: extractSeries('plungeDuration') }] }}
        width={screenWidth}
        height={180}
        yAxisSuffix="m"
        chartConfig={chartConfig(theme)}
        style={styles.chart}
        accessibilityLabel="Cold plunge duration chart"
      />

      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        🌡️ Cold Plunge Temp (°F)
      </Text>
      <LineChart
        data={{ labels: getLabels(), datasets: [{ data: extractSeries('plungeTemp') }] }}
        width={screenWidth}
        height={180}
        yAxisSuffix="°"
        chartConfig={chartConfig(theme)}
        style={styles.chart}
        accessibilityLabel="Cold plunge temperature chart"
      />

      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        🔴 Red Light Duration (min)
      </Text>
      <BarChart
        data={{ labels: getLabels(), datasets: [{ data: extractSeries('redlightDuration') }] }}
        width={screenWidth}
        height={180}
        yAxisSuffix="m"
        chartConfig={chartConfig(theme)}
        style={styles.chart}
        accessibilityLabel="Red light therapy duration chart"
      />

      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        🌍 Grounding Duration (min)
      </Text>
      <LineChart
        data={{ labels: getLabels(), datasets: [{ data: extractSeries('groundingDuration') }] }}
        width={screenWidth}
        height={180}
        yAxisSuffix="m"
        chartConfig={chartConfig(theme)}
        style={styles.chart}
        accessibilityLabel="Grounding duration chart"
      />

      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        🔥 Sauna Duration (min)
      </Text>
      <BarChart
        data={{ labels: getLabels(), datasets: [{ data: extractSeries('saunaDuration') }] }}
        width={screenWidth}
        height={180}
        yAxisSuffix="m"
        chartConfig={chartConfig(theme)}
        style={styles.chart}
        accessibilityLabel="Sauna duration chart"
      />

      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        💉 Peptides Used
      </Text>
      {peptideNotes.length > 0 ? (
        peptideNotes.map((line, i) => (
          <Text
            key={i}
            style={{ color: theme.colors.text, marginBottom: 4, fontSize: 14 }}
            accessibilityLabel={`Peptide usage note ${line}`}
          >
            {line}
          </Text>
        ))
      ) : (
        <Text style={{ color: theme.colors.text, fontSize: 14 }}>
          No entries this week.
        </Text>
      )}
    </ScrollView>
  );
};

const chartConfig = (theme) => ({
  backgroundColor: theme.colors.card,
  backgroundGradientFrom: theme.colors.card,
  backgroundGradientTo: theme.colors.card,
  decimalPlaces: 0,
  color: (opacity = 1) => theme.colors.primary,
  labelColor: () => theme.colors.text,
  propsForDots: { r: '4', strokeWidth: '2', stroke: theme.colors.primary },
  style: { borderRadius: 8 },
});

const styles = StyleSheet.create({
  container: {
    padding: 15,
    paddingBottom: 80,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 8,
  },
  chart: {
    borderRadius: 8,
  },
});

export default TrendsScreen;