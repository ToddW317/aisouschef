import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Image, 
  ActivityIndicator 
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { spoonacularApi } from '../../src/config/api';

export default function RecipeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecipe() {
      try {
        const data = await spoonacularApi.getRecipeInformation(Number(id));
        setRecipe(data);
      } catch (error) {
        console.error('Error loading recipe:', error);
      } finally {
        setLoading(false);
      }
    }
    loadRecipe();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </SafeAreaView>
    );
  }

  if (!recipe) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Recipe not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Image 
          source={{ uri: recipe.image }} 
          style={styles.image}
        />
        <View style={styles.details}>
          <Text style={styles.title}>{recipe.title}</Text>
          <View style={styles.metadata}>
            <Text style={styles.metaItem}>🕒 {recipe.readyInMinutes} mins</Text>
            <Text style={styles.metaItem}>👥 Serves {recipe.servings}</Text>
          </View>

          <Text style={styles.sectionTitle}>Ingredients</Text>
          {recipe.extendedIngredients.map((ingredient: any, index: number) => (
            <Text key={index} style={styles.ingredient}>
              • {ingredient.original}
            </Text>
          ))}

          <Text style={styles.sectionTitle}>Instructions</Text>
          {recipe.analyzedInstructions[0]?.steps.map((step: any, index: number) => (
            <View key={index} style={styles.step}>
              <Text style={styles.stepNumber}>{index + 1}</Text>
              <Text style={styles.stepText}>{step.step}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: '#eee',
  },
  details: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  metadata: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 16,
  },
  metaItem: {
    fontSize: 16,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 12,
    color: '#333',
  },
  ingredient: {
    fontSize: 16,
    marginBottom: 8,
    color: '#444',
  },
  step: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
    fontSize: 14,
    fontWeight: '600',
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    color: '#444',
  },
}); 