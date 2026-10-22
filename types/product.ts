export interface ProductCategory {
  id: string;
  name: string;
  iconName: string;
  itemCount: number;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  categoryId?: string;
  price: number;
  originalPrice?: number;
  unit: string;
  weight?: string;
  imageUrl: string;
  inStock: boolean;
  stockCount?: number;
  stockQuantity?: number;
  offerLabel?: string;
  rating: number;
  ratingCount: number;
  barcode: string;
  isPopular?: boolean;
  isRecommended?: boolean;
  popularityScore?: number;
  description?: string;
  shelfLocation?: string;
  nutritionHighlights?: string[];
  tags?: string[];
}
