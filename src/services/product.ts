const OPEN_FOOD_FACTS_API = 'https://world.openfoodfacts.org/api/v0/product';

export async function getProductInfo(barcode: string): Promise<ProductInfo | null> {
  try {
    const response = await fetch(`${OPEN_FOOD_FACTS_API}/${barcode}.json`);
    const data = await response.json();
    
    if (data.status === 1 && data.product) {
      return {
        name: data.product.product_name || 'Unknown Product',
        brand: data.product.brands || 'Unknown Brand',
        image_url: data.product.image_url || '',
        quantity: data.product.quantity || 'N/A',
        ingredients_text: data.product.ingredients_text,
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching product info:', error);
    return null;
  }
} 