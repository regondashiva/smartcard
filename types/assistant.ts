import { Product } from "@/types/product";

export type AssistantMessageRole = "user" | "assistant" | "system";

export type AssistantIntentType =
  | "search"
  | "recommend"
  | "compare"
  | "budget"
  | "shopping_list"
  | "alternative"
  | "frequent"
  | "clarification"
  | "general";

export interface AssistantProductCard {
  product: Product;
  reason: string;
  matchScore?: number;
  highlight?: string;
  badge?: string;
}

export interface ProductComparisonItem {
  product: Product;
  packSize: string;
  price: number;
  pricePerUnit?: string;
  inStock: boolean;
  rating: number;
  brand: string;
  highlights: string[];
}

export interface ProductComparison {
  items: [ProductComparisonItem, ProductComparisonItem];
  cheaperProductId?: string;
  comparisonSummary: string;
  tradeoffs: string[];
}

export interface ShoppingListItemProposal {
  product: Product;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface ShoppingListProposal {
  id: string;
  title: string;
  items: ShoppingListItemProposal[];
  estimatedTotal: number;
  budget?: number;
  budgetRemaining?: number;
  fitsBudget?: boolean;
  notes?: string;
}

export interface AssistantMessage {
  id: string;
  role: AssistantMessageRole;
  content: string;
  timestamp: string;
  intentType?: AssistantIntentType;
  isDemoMode?: boolean;
  productCards?: AssistantProductCard[];
  comparison?: ProductComparison;
  shoppingList?: ShoppingListProposal;
  suggestedQuestions?: string[];
}

export interface ProductSearchIntent {
  type: AssistantIntentType;
  keywords?: string[];
  rawQuery: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  budget?: number;
  targetProductIds?: string[];
  targetProductNames?: string[];
  brand?: string;
  healthOrDietaryPreference?: string;
}

export interface AssistantResponse {
  message: string;
  intentType: AssistantIntentType;
  isDemoMode: boolean;
  productCards?: AssistantProductCard[];
  comparison?: ProductComparison;
  shoppingList?: ShoppingListProposal;
  suggestedQuestions?: string[];
}
