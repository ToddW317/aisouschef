import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function Home() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.welcome}>Welcome to your smart kitchen assistant!</Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => router.push('/sous-chef')}
        >
          <Text style={styles.buttonText}>Ask AI Sous Chef</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // ... keep your existing styles
}); 