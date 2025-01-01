export const SPOONACULAR_API_KEY = 'f918742e1b2543fe811130e818bc94a2';
export const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com/recipes';

export const spoonacularApi = {
  searchByIngredients: async (ingredients: string[]) => {
    const response = await fetch(
      `${SPOONACULAR_BASE_URL}/findByIngredients?apiKey=${SPOONACULAR_API_KEY}&ingredients=${ingredients.join(',')}&number=5`
    );
    return response.json();
  },

  getRecipeInstructions: async (recipeId: number) => {
    const response = await fetch(
      `${SPOONACULAR_BASE_URL}/${recipeId}/analyzedInstructions?apiKey=${SPOONACULAR_API_KEY}`
    );
    return response.json();
  },

  searchRecipes: async (query: string, diet?: string) => {
    const params = new URLSearchParams({
      apiKey: SPOONACULAR_API_KEY,
      query,
      number: '5',
      ...(diet && { diet }),
    });
    
    const response = await fetch(
      `${SPOONACULAR_BASE_URL}/complexSearch?${params.toString()}`
    );
    return response.json();
  },

  getRecipeInformation: async (recipeId: number) => {
    const response = await fetch(
      `${SPOONACULAR_BASE_URL}/${recipeId}/information?apiKey=${SPOONACULAR_API_KEY}`
    );
    return response.json();
  },

  searchRecipesComplex: async ({
    query,
    ingredients,
    diet,
    intolerances,
    maxReadyTime,
  }: {
    query?: string;
    ingredients?: string[];
    diet?: string;
    intolerances?: string[];
    maxReadyTime?: number;
  }) => {
    const params = new URLSearchParams({
      apiKey: SPOONACULAR_API_KEY,
      number: '5',
      addRecipeInformation: 'true',
      fillIngredients: 'true',
      ...(query && { query }),
      ...(ingredients?.length && { includeIngredients: ingredients.join(',') }),
      ...(diet && { diet }),
      ...(intolerances?.length && { intolerances: intolerances.join(',') }),
      ...(maxReadyTime && { maxReadyTime: maxReadyTime.toString() }),
    });
    
    const response = await fetch(
      `${SPOONACULAR_BASE_URL}/complexSearch?${params.toString()}`
    );
    return response.json();
  },

  analyzePrompt: async (prompt: string) => {
    // This would ideally use GPT/other AI to analyze the prompt
    // For now, we'll do basic keyword extraction
    const keywords = {
      diet: prompt.match(/vegetarian|vegan|gluten-free|keto/gi)?.[0]?.toLowerCase(),
      time: prompt.match(/quick|fast|under \d+ minutes/gi)?.[0],
      type: prompt.match(/breakfast|lunch|dinner|snack/gi)?.[0],
      ingredients: prompt.match(/with ([^,]+)/i)?.[1],
    };
    return keywords;
  }
}; 