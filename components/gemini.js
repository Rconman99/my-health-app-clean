<<<<<<< HEAD
export async function askGemini(promptText) {
    const apiKey = process.env.GEMINI_API_KEY;
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
  
    const body = {
      contents: [{ parts: [{ text: promptText }] }],
    };
  
=======
import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { askGemini } from './geminiAPI'; // Make sure this function correctly calls your AI API

export default function GeminiChatScreen() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAsk = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResponse('');
    setError(null);

>>>>>>> 8a49e53 (Update latest changes)
    try {
      const result = await askGemini(prompt);
      setResponse(result);
    } catch (err) {
      setError('Oops! Something went wrong. Please try again.');
      console.error('Gemini API error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <TextInput
          style={styles.input}
          placeholder="Ask Gemini..."
          multiline
          value={prompt}
          onChangeText={setPrompt}
          accessibilityLabel="Gemini AI prompt input"
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="done"
          blurOnSubmit={true}
          editable={!loading}
        />

        <Button
          title={loading ? "Thinking..." : "Send"}
          onPress={handleAsk}
          disabled={loading || !prompt.trim()}
          accessibilityLabel="Send prompt to Gemini AI"
        />

        {loading && <ActivityIndicator size="large" style={styles.loading} />}

        {error && <Text style={styles.error}>{error}</Text>}

        {!loading && response ? (
          <View style={styles.responseBox}>
            <Text style={styles.responseText}>{response}</Text>
          </View>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    marginBottom: 12,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  loading: {
    marginTop: 20,
  },
  responseBox: {
    marginTop: 20,
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
  },
  responseText: {
    fontSize: 16,
    color: '#333',
  },
  error: {
    marginTop: 20,
    color: 'red',
    fontWeight: '600',
    textAlign: 'center',
  },
});