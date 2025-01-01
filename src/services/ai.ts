import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface RecipeAnalysis {
  suggestedCuisine: string;
  dietaryInfo: string[];
  cookingDifficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number;
  suggestedModifications?: string[];
}

export const aiService = {
  analyzeRecipeRequest: async (
    prompt: string,
    ingredients: string[],
    dietaryPreferences: string[]
  ): Promise<RecipeAnalysis> => {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt_template = `
      As a culinary AI assistant, analyze this recipe request:
      User Request: "${prompt}"
      Available Ingredients: ${ingredients.join(', ')}
      Dietary Preferences: ${dietaryPreferences.join(', ')}

      Provide analysis in JSON format with:
      - suggestedCuisine
      - dietaryInfo (array of dietary considerations)
      - cookingDifficulty (easy/medium/hard)
      - estimatedTime (in minutes)
      - suggestedModifications (array of possible modifications based on ingredients)
    `;

    try {
      const result = await model.generateContent(prompt_template);
      const response = await result.response;
      const text = response.text();
      return JSON.parse(text);
    } catch (error) {
      console.error('Error analyzing recipe with Gemini:', error);
      throw error;
    }
  },

  enhanceRecipeInstructions: async (
    recipe: any,
    userSkillLevel: 'beginner' | 'intermediate' | 'advanced'
  ): Promise<string[]> => {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt_template = `
      As a culinary instructor, enhance these recipe instructions for a ${userSkillLevel} cook:
      Recipe: ${recipe.title}
      Original Instructions: ${JSON.stringify(recipe.instructions)}

      Provide detailed, step-by-step instructions with cooking tips and explanations.
      Format as a JSON array of strings, each string being one step.
    `;

    try {
      const result = await model.generateContent(prompt_template);
      const response = await result.response;
      const text = response.text();
      return JSON.parse(text);
    } catch (error) {
      console.error('Error enhancing recipe instructions:', error);
      throw error;
    }
  }
}; 