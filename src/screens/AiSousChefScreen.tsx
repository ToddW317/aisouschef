import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { spoonacularApi } from '../config/api';

export function AiSousChefScreen() {
  const [userPrompt, setUserPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recipes, setRecipes] = useState<any[]>([]);

  const handleGetRecipes = async () => {
    setIsLoading(true);
    try {
      // For now, let's just use some dummy ingredients
      // Later we'll pull these from the user's pantry
      const dummyIngredients = ['chicken', 'rice', 'tomatoes'];
      const results = await spoonacularApi.searchByIngredients(dummyIngredients);
      setRecipes(results);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.promptContainer}>
          <Text style={styles.label}>What are you in the mood for?</Text>
          <TextInput
            style={styles.input}
            value={userPrompt}
            onChangeText={setUserPrompt}
            placeholder="E.g., Something quick and healthy with chicken..."
            multiline
          />
          
          <TouchableOpacity 
            style={styles.button}
            onPress={handleGetRecipes}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Get Recipe Suggestions</Text>
            )}
          </TouchableOpacity>
        </View>

        {recipes.map((recipe) => (
          <View key={recipe.id} style={styles.recipeCard}>
            <Text style={styles.recipeTitle}>{recipe.title}</Text>
            <Text>Used Ingredients: {recipe.usedIngredientCount}</Text>
            <Text>Missing Ingredients: {recipe.missedIngredientCount}</Text>
          </View>
        ))}
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
  promptContainer: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  recipeCard: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  recipeTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
}); 