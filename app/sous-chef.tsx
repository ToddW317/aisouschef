import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { spoonacularApi } from '../src/config/api';
import { Recipe } from '../src/types';
import { useRouter } from 'expo-router';
import { usePantryStore } from '../src/store/pantryStore';

interface DietaryFilter {
  id: string;
  label: string;
  value: string;
}

const DIETARY_FILTERS: DietaryFilter[] = [
  { id: '1', label: 'Vegetarian', value: 'vegetarian' },
  { id: '2', label: 'Vegan', value: 'vegan' },
  { id: '3', label: 'Gluten Free', value: 'gluten-free' },
  { id: '4', label: 'Quick & Easy', value: 'quick' },
];

export default function SousChefScreen() {
  const router = useRouter();
  const pantryItems = usePantryStore((state) => state.items);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const toggleFilter = (value: string) => {
    setSelectedFilters(prev => 
      prev.includes(value) 
        ? prev.filter(f => f !== value)
        : [...prev, value]
    );
  };

  const analyzeAndSearch = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get ingredients from pantry
      const pantryIngredients = pantryItems.map(item => item.name);
      
      // Analyze the user's prompt
      const promptAnalysis = await spoonacularApi.analyzePrompt(prompt);
      
      // Combine filters
      const dietaryRestrictions = selectedFilters.filter(f => 
        ['vegetarian', 'vegan', 'gluten-free'].includes(f)
      );
      
      // Determine time constraint
      const isQuick = selectedFilters.includes('quick');
      
      // Search for recipes
      const results = await spoonacularApi.searchRecipesComplex({
        query: prompt,
        ingredients: pantryIngredients,
        diet: dietaryRestrictions[0], // Spoonacular only accepts one diet
        maxReadyTime: isQuick ? 30 : undefined,
      });
      
      if (results.results?.length > 0) {
        setRecipes(results.results);
      } else {
        setError('No recipes found matching your criteria. Try adjusting your filters or adding more ingredients to your pantry.');
      }
    } catch (error) {
      console.error('Error searching recipes:', error);
      setError('Failed to search recipes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>AI Sous Chef</Text>
        
        {/* Pantry Summary */}
        <View style={styles.pantryPreview}>
          <Text style={styles.label}>Available Ingredients</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {pantryItems.length > 0 ? (
              pantryItems.map(item => (
                <View key={item.id} style={styles.ingredientChip}>
                  <Text style={styles.ingredientChipText}>{item.name}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No ingredients in pantry</Text>
            )}
          </ScrollView>
        </View>

        {/* Prompt Input */}
        <View style={styles.promptContainer}>
          <Text style={styles.label}>What would you like to cook?</Text>
          <TextInput
            style={styles.input}
            value={prompt}
            onChangeText={setPrompt}
            placeholder="E.g., A quick healthy dinner with chicken..."
            multiline
          />
        </View>

        {/* Dietary Filters */}
        <View style={styles.filtersContainer}>
          <Text style={styles.label}>Dietary Preferences</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {DIETARY_FILTERS.map(filter => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterChip,
                  selectedFilters.includes(filter.value) && styles.filterChipSelected
                ]}
                onPress={() => toggleFilter(filter.value)}
              >
                <Text style={[
                  styles.filterText,
                  selectedFilters.includes(filter.value) && styles.filterTextSelected
                ]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Search Button */}
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={analyzeAndSearch}
          disabled={isLoading}
        >
          <FontAwesome name="magic" size={20} color="white" />
          <Text style={styles.searchButtonText}>
            Find AI-Powered Recipes
          </Text>
        </TouchableOpacity>

        {/* Error Message */}
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        {/* Results */}
        {isLoading ? (
          <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
        ) : (
          <View style={styles.resultsContainer}>
            {recipes.map(recipe => (
              <TouchableOpacity 
                key={recipe.id} 
                style={styles.recipeCard}
                onPress={() => router.push(`/recipe/${recipe.id}`)}
              >
                <Image 
                  source={{ uri: recipe.image }} 
                  style={styles.recipeImage}
                />
                <View style={styles.recipeInfo}>
                  <Text style={styles.recipeName}>{recipe.title}</Text>
                  <Text style={styles.recipeDetail}>
                    Ready in {recipe.readyInMinutes} mins • Serves {recipe.servings}
                  </Text>
                  <View style={styles.ingredientTags}>
                    <Text style={styles.ingredientTag}>
                      {recipe.usedIngredients.length} pantry items
                    </Text>
                    {recipe.missedIngredients.length > 0 && (
                      <Text style={[styles.ingredientTag, styles.missedTag]}>
                        {recipe.missedIngredients.length} missing
                      </Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
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
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  promptContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    minHeight: 100,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
  },
  filtersContainer: {
    marginBottom: 24,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterChipSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  filterTextSelected: {
    color: '#fff',
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  searchButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  loader: {
    marginTop: 32,
  },
  resultsContainer: {
    gap: 16,
  },
  recipeCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  recipeImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#eee',
  },
  recipeInfo: {
    padding: 16,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  recipeDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  ingredientTags: {
    flexDirection: 'row',
    gap: 8,
  },
  ingredientTag: {
    fontSize: 12,
    color: '#007AFF',
    backgroundColor: '#e8f2ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  missedTag: {
    color: '#ff3b30',
    backgroundColor: '#ffe8e8',
  },
  pantryPreview: {
    marginBottom: 24,
  },
  ingredientChip: {
    backgroundColor: '#e8f2ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  ingredientChipText: {
    color: '#007AFF',
    fontSize: 14,
  },
  errorText: {
    color: '#ff3b30',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  emptyText: {
    color: '#666',
    fontStyle: 'italic',
  },
}); 