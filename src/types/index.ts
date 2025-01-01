export interface PantryItem {
  id: string;
  name: string;
  barcode: string;
  quantity: number;
  dateAdded: Date;
  expiryDate?: Date;
  image?: string;
  brand?: string;
}

export interface ProductInfo {
  name: string;
  brand: string;
  image_url: string;
  quantity: string;
  ingredients_text?: string;
}

export interface Recipe {
  id: number;
  title: string;
  image: string;
  usedIngredients: string[];
  missedIngredients: string[];
  instructions: string[];
  readyInMinutes: number;
  servings: number;
} 