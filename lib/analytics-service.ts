import { PRODUCTS } from "@/data/products";
import { CATEGORIES } from "@/data/categories";
import { Product } from "@/types/product";
import { DigitalReceipt } from "@/types/receipt";
import {
  CategorySpending,
  DateRangeFilter,
  FrequentlyPurchasedProduct,
  ProductRecommendation,
  SpendingSummary,
  SpendingTrendPoint,
} from "@/types/analytics";

// ─── Category Color & Metadata Map ───────────────────────────────────────────

const CATEGORY_COLORS: Record<string, string> = {
  "dairy-eggs": "#17A890",
  "fruits-vegetables": "#16865C",
  bakery: "#D97706",
  snacks: "#E11D48",
  "rice-atta-staples": "#4F46E5",
  beverages: "#0284C7",
  "personal-care": "#8B5CF6",
  household: "#64748B",
  all: "#102B35",
};

function getCategoryMeta(catId: string) {
  const found = CATEGORIES.find((c) => c.id === catId);
  return {
    name: found ? found.name : "Groceries & Staples",
    color: CATEGORY_COLORS[catId] || "#17A890",
  };
}

// ─── Filter Orders by Time Period ─────────────────────────────────────────────

function getCutoffTimestamp(range: DateRangeFilter): number {
  const now = Date.now();
  switch (range) {
    case "7d":
      return now - 7 * 24 * 60 * 60 * 1000;
    case "30d":
      return now - 30 * 24 * 60 * 60 * 1000;
    case "90d":
      return now - 90 * 24 * 60 * 60 * 1000;
    case "1y":
      return now - 365 * 24 * 60 * 60 * 1000;
    case "all":
    default:
      return 0;
  }
}

export function filterOrdersByDate(
  orders: DigitalReceipt[],
  range: DateRangeFilter
): DigitalReceipt[] {
  const cutoff = getCutoffTimestamp(range);
  return orders.filter((o) => {
    // Only completed, successful purchases
    if (o.paymentStatus !== "success" || o.orderStatus === "cancelled") {
      return false;
    }
    const orderTime = new Date(o.purchaseDate).getTime();
    return orderTime >= cutoff;
  });
}

// ─── 1. Spending Insights Engine ─────────────────────────────────────────────

export function getSpendingInsights(
  orders: DigitalReceipt[],
  range: DateRangeFilter = "30d"
): SpendingSummary {
  const eligibleOrders = filterOrdersByDate(orders, range);

  const rangeLabels: Record<DateRangeFilter, string> = {
    "7d": "Last 7 Days",
    "30d": "Last 30 Days",
    "90d": "Last 90 Days",
    "1y": "This Year",
    all: "All Time",
  };

  const completedOrdersCount = eligibleOrders.length;
  const totalSpent = eligibleOrders.reduce((sum, o) => sum + o.finalAmount, 0);
  const totalItemsBought = eligibleOrders.reduce((sum, o) => sum + o.itemCount, 0);
  const totalSavings = eligibleOrders.reduce((sum, o) => sum + o.savings, 0);
  const averageOrderValue =
    completedOrdersCount > 0 ? Math.round(totalSpent / completedOrdersCount) : 0;

  // Build daily spending trends
  const dailyMap = new Map<string, { label: string; amount: number; count: number }>();

  eligibleOrders.forEach((order) => {
    const d = new Date(order.purchaseDate);
    const dateKey = d.toISOString().split("T")[0]; // YYYY-MM-DD
    const label = d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });

    const current = dailyMap.get(dateKey) || { label, amount: 0, count: 0 };
    current.amount += order.finalAmount;
    current.count += 1;
    dailyMap.set(dateKey, current);
  });

  const trends: SpendingTrendPoint[] = Array.from(dailyMap.entries())
    .map(([dateKey, val]) => ({
      dateKey,
      label: val.label,
      amount: val.amount,
      orderCount: val.count,
    }))
    .sort((a, b) => a.dateKey.localeCompare(b.dateKey));

  // Build Category Breakdown
  const categoryMap = new Map<
    string,
    { amount: number; orderIds: Set<string>; itemCount: number }
  >();

  eligibleOrders.forEach((order) => {
    order.items.forEach((item) => {
      // Find product to determine category
      const product = PRODUCTS.find((p) => p.id === item.productId);
      const catId = product?.category || "groceries";

      const current = categoryMap.get(catId) || {
        amount: 0,
        orderIds: new Set<string>(),
        itemCount: 0,
      };

      current.amount += item.total;
      current.itemCount += item.quantity;
      current.orderIds.add(order.orderId);
      categoryMap.set(catId, current);
    });
  });

  const categories: CategorySpending[] = Array.from(categoryMap.entries())
    .map(([catId, data]) => {
      const meta = getCategoryMeta(catId);
      const percentage = totalSpent > 0 ? Math.round((data.amount / totalSpent) * 100) : 0;
      return {
        categoryId: catId,
        categoryName: meta.name,
        amount: data.amount,
        orderCount: data.orderIds.size,
        itemCount: data.itemCount,
        percentage,
        color: meta.color,
      };
    })
    .sort((a, b) => b.amount - a.amount);

  const topCategory = categories.length > 0 ? categories[0] : undefined;

  return {
    period: range,
    periodLabel: rangeLabels[range],
    totalSpent,
    completedOrdersCount,
    averageOrderValue,
    totalItemsBought,
    totalSavings,
    trends,
    categories,
    topCategory,
  };
}

// ─── 2. Frequently Purchased Products ("Buy Again") ──────────────────────────

export function getFrequentlyPurchasedProducts(
  orders: DigitalReceipt[]
): FrequentlyPurchasedProduct[] {
  const eligibleOrders = orders.filter(
    (o) => o.paymentStatus === "success" && o.orderStatus !== "cancelled"
  );

  const productAggMap = new Map<
    string,
    {
      timesPurchased: number;
      lastDate: string;
      totalSpent: number;
      lastItem: (typeof eligibleOrders)[0]["items"][0];
    }
  >();

  eligibleOrders.forEach((order) => {
    order.items.forEach((item) => {
      const current = productAggMap.get(item.productId);
      if (!current) {
        productAggMap.set(item.productId, {
          timesPurchased: 1,
          lastDate: order.purchaseDate,
          totalSpent: item.total,
          lastItem: item,
        });
      } else {
        current.timesPurchased += 1;
        current.totalSpent += item.total;
        if (new Date(order.purchaseDate) > new Date(current.lastDate)) {
          current.lastDate = order.purchaseDate;
        }
      }
    });
  });

  const results: FrequentlyPurchasedProduct[] = [];

  productAggMap.forEach((agg, productId) => {
    // Authoritative live catalogue product lookup
    const catalogueProduct = PRODUCTS.find((p) => p.id === productId);

    if (catalogueProduct) {
      results.push({
        productId,
        productName: catalogueProduct.name,
        brand: catalogueProduct.brand,
        unit: catalogueProduct.unit,
        imageUrl: catalogueProduct.imageUrl,
        currentPrice: catalogueProduct.price,
        originalPrice: catalogueProduct.originalPrice,
        inStock: catalogueProduct.inStock,
        stockCount: catalogueProduct.stockCount,
        timesPurchased: agg.timesPurchased,
        lastPurchasedDate: agg.lastDate,
        totalSpent: agg.totalSpent,
        product: catalogueProduct,
      });
    } else {
      // Historical fallback if product was discontinued from active catalogue
      results.push({
        productId,
        productName: agg.lastItem.productName,
        brand: agg.lastItem.brand,
        unit: agg.lastItem.unit,
        imageUrl: agg.lastItem.imageUrl || "",
        currentPrice: agg.lastItem.unitPrice,
        inStock: false,
        timesPurchased: agg.timesPurchased,
        lastPurchasedDate: agg.lastDate,
        totalSpent: agg.totalSpent,
        product: {
          id: productId,
          name: agg.lastItem.productName,
          brand: agg.lastItem.brand,
          category: "groceries",
          price: agg.lastItem.unitPrice,
          unit: agg.lastItem.unit,
          imageUrl: agg.lastItem.imageUrl || "",
          inStock: false,
          rating: 4.5,
          ratingCount: 10,
          barcode: "",
        },
      });
    }
  });

  // Sort by times purchased descending, then most recent purchase
  results.sort((a, b) => {
    if (b.timesPurchased !== a.timesPurchased) {
      return b.timesPurchased - a.timesPurchased;
    }
    return (
      new Date(b.lastPurchasedDate).getTime() -
      new Date(a.lastPurchasedDate).getTime()
    );
  });

  return results;
}

// ─── 3. Personalized Recommendations Engine ───────────────────────────────────

export function getPersonalizedRecommendations(
  orders: DigitalReceipt[],
  currentCartProductIds: string[] = []
): ProductRecommendation[] {
  const cartSet = new Set(currentCartProductIds);
  const eligibleOrders = orders.filter(
    (o) => o.paymentStatus === "success" && o.orderStatus !== "cancelled"
  );

  // If customer has no purchase history, provide catalogue popularity fallbacks
  if (eligibleOrders.length === 0) {
    return PRODUCTS.filter((p) => p.inStock && !cartSet.has(p.id))
      .filter((p) => p.isPopular || p.isRecommended)
      .slice(0, 6)
      .map((p) => ({
        product: p,
        matchScore: 85,
        reason: p.offerLabel ? `Special offer: ${p.offerLabel}` : "Popular choice among shoppers",
        recommendationType: "popular_fallback",
        associatedCategory: p.category,
      }));
  }

  // Count purchased categories and products
  const categoryFrequency = new Map<string, number>();
  const purchasedProductIds = new Set<string>();

  eligibleOrders.forEach((order) => {
    order.items.forEach((item) => {
      purchasedProductIds.add(item.productId);
      const prod = PRODUCTS.find((p) => p.id === item.productId);
      if (prod) {
        categoryFrequency.set(
          prod.category,
          (categoryFrequency.get(prod.category) || 0) + item.quantity
        );
      }
    });
  });

  // Sort categories by purchase frequency
  const sortedCategories = Array.from(categoryFrequency.entries()).sort(
    (a, b) => b[1] - a[1]
  );
  const topCategoryId = sortedCategories.length > 0 ? sortedCategories[0][0] : null;

  const recommendations: ProductRecommendation[] = [];
  const recommendedIds = new Set<string>();

  // Strategy A: Frequently Reordered Staples (in stock and bought 2+ times)
  const freq = getFrequentlyPurchasedProducts(eligibleOrders);
  freq
    .filter((f) => f.inStock && f.timesPurchased >= 2 && !cartSet.has(f.productId))
    .slice(0, 2)
    .forEach((f) => {
      recommendations.push({
        product: f.product,
        matchScore: 95,
        reason: `You've purchased this ${f.timesPurchased} times`,
        recommendationType: "frequently_reordered",
        associatedCategory: f.product.category,
      });
      recommendedIds.add(f.productId);
    });

  // Strategy B: Category Affinity (Products in top purchased category not yet bought)
  if (topCategoryId) {
    const meta = getCategoryMeta(topCategoryId);
    const categoryMatches = PRODUCTS.filter(
      (p) =>
        p.category === topCategoryId &&
        p.inStock &&
        !cartSet.has(p.id) &&
        !recommendedIds.has(p.id)
    )
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);

    categoryMatches.forEach((p) => {
      recommendations.push({
        product: p,
        matchScore: 88,
        reason: `Based on your frequent ${meta.name} purchases`,
        recommendationType: "category_affinity",
        associatedCategory: topCategoryId,
      });
      recommendedIds.add(p.id);
    });
  }

  // Strategy C: Complementary / Similar products across other catalogue items
  const otherCandidates = PRODUCTS.filter(
    (p) =>
      p.inStock &&
      !cartSet.has(p.id) &&
      !recommendedIds.has(p.id) &&
      (p.isPopular || p.isRecommended)
  )
    .sort((a, b) => (b.popularityScore || b.rating) - (a.popularityScore || a.rating))
    .slice(0, 3);

  otherCandidates.forEach((p) => {
    recommendations.push({
      product: p,
      matchScore: 80,
      reason: "Popular companion product for your pantry",
      recommendationType: "complementary",
      associatedCategory: p.category,
    });
    recommendedIds.add(p.id);
  });

  return recommendations.slice(0, 6);
}
