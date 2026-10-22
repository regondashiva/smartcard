import { Product } from "./product";

export type DateRangeFilter = "7d" | "30d" | "90d" | "1y" | "all";

export interface CategorySpending {
  categoryId: string;
  categoryName: string;
  amount: number;        // total spent in rupees
  orderCount: number;    // number of orders containing items from this category
  itemCount: number;     // units bought in this category
  percentage: number;    // percentage of total spending
  color: string;
}

export interface SpendingTrendPoint {
  dateKey: string;       // e.g. "2026-10-22"
  label: string;         // e.g. "22 Oct"
  amount: number;        // total spent on that day
  orderCount: number;
}

export interface SpendingSummary {
  period: DateRangeFilter;
  periodLabel: string;
  totalSpent: number;
  completedOrdersCount: number;
  averageOrderValue: number;
  totalItemsBought: number;
  totalSavings: number;
  trends: SpendingTrendPoint[];
  categories: CategorySpending[];
  topCategory?: CategorySpending;
}

export interface FrequentlyPurchasedProduct {
  productId: string;
  productName: string;
  brand: string;
  unit: string;
  imageUrl: string;
  currentPrice: number;
  originalPrice?: number;
  inStock: boolean;
  stockCount?: number;
  timesPurchased: number;
  lastPurchasedDate: string;
  totalSpent: number;
  product: Product;
}

export interface ProductRecommendation {
  product: Product;
  matchScore: number;
  reason: string;
  recommendationType:
    | "frequently_reordered"
    | "category_affinity"
    | "complementary"
    | "popular_fallback";
  associatedCategory?: string;
}
