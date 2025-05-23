import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from 'react-native';
import { askOpenAI } from '../api/openai'; // or use askGemini if you prefer

const AITestScreen = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!prompt) return;

    setLoading(true);
    const result = await askOpenAI(prompt); // ← swap for askGemini if needed
    setResponse(result);
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>AI Prompt Tester</Text>
      <TextInput
        style={styles.input}
        placeholder="Type your prompt..."
        value={prompt}
        onChangeText={setPrompt}
      />
      <Button title="Ask AI" onPress={handleSubmit} />
      <Text style={styles.label}>Response:</Text>
      <Text style={styles.output}>{loading ? 'Thinking...' : response}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  label: {
    marginTop: 20,
    fontWeight: '600',
  },
  output: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default AITestScreen;