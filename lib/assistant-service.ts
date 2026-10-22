import { PRODUCTS } from "@/data/products";
import { CATEGORIES } from "@/data/categories";
import { Product } from "@/types/product";
import {
  AssistantIntentType,
  AssistantMessage,
  AssistantProductCard,
  AssistantResponse,
  ProductComparison,
  ProductComparisonItem,
  ProductSearchIntent,
  ShoppingListItemProposal,
  ShoppingListProposal,
} from "@/types/assistant";
import { getFrequentlyPurchasedProducts, getPersonalizedRecommendations } from "@/lib/analytics-service";
import { DigitalReceipt } from "@/types/receipt";

// ─── Number / Price Extractor ────────────────────────────────────────────────

function extractNumbersAndBudget(query: string): { budget?: number; minPrice?: number; maxPrice?: number } {
  const clean = query.toLowerCase();

  // Pattern: "under 500", "under ₹500", "below 300", "less than 250", "upto 1000", "up to 1000"
  const underMatch = clean.match(/(?:under|below|less\s+than|upto|up\s+to|within|max(?:imum)?)\s*(?:₹|rs\.?|inr)?\s*(\d+)/i);
  if (underMatch) {
    const val = parseInt(underMatch[1], 10);
    return { budget: val, maxPrice: val };
  }

  // Pattern: "budget of 1000", "budget 800", "for 1500"
  const budgetMatch = clean.match(/budget\s*(?:of|is|:)?\s*(?:₹|rs\.?|inr)?\s*(\d+)/i);
  if (budgetMatch) {
    const val = parseInt(budgetMatch[1], 10);
    return { budget: val, maxPrice: val };
  }

  // Pattern: "between 100 and 500"
  const rangeMatch = clean.match(/between\s*(?:₹|rs\.?|inr)?\s*(\d+)\s*(?:and|-|to)\s*(?:₹|rs\.?|inr)?\s*(\d+)/i);
  if (rangeMatch) {
    return {
      minPrice: parseInt(rangeMatch[1], 10),
      maxPrice: parseInt(rangeMatch[2], 10),
      budget: parseInt(rangeMatch[2], 10),
    };
  }

  return {};
}

// ─── Category Detector ───────────────────────────────────────────────────────

function detectCategory(query: string): string | undefined {
  const q = query.toLowerCase();
  if (q.includes("fruit") || q.includes("vegetable") || q.includes("produce") || q.includes("veggie")) {
    return "fruits-vegetables";
  }
  if (q.includes("dairy") || q.includes("milk") || q.includes("egg") || q.includes("yogurt") || q.includes("cheese") || q.includes("butter") || q.includes("paneer")) {
    return "dairy-eggs";
  }
  if (q.includes("bread") || q.includes("bakery") || q.includes("bun") || q.includes("croissant")) {
    return "bakery";
  }
  if (q.includes("snack") || q.includes("chip") || q.includes("biscuit") || q.includes("cookie") || q.includes("namkeen") || q.includes("munch")) {
    return "snacks";
  }
  if (q.includes("staple") || q.includes("rice") || q.includes("atta") || q.includes("flour") || q.includes("oil") || q.includes("dal") || q.includes("grain")) {
    return "rice-atta-staples";
  }
  if (q.includes("beverage") || q.includes("drink") || q.includes("tea") || q.includes("coffee") || q.includes("juice") || q.includes("soda")) {
    return "beverages";
  }
  if (q.includes("shampoo") || q.includes("soap") || q.includes("toothpaste") || q.includes("personal") || q.includes("care") || q.includes("lotion")) {
    return "personal-care";
  }
  if (q.includes("household") || q.includes("cleaning") || q.includes("detergent") || q.includes("dishwash")) {
    return "household";
  }
  return undefined;
}

// ─── Find Products Mentioned in Query ────────────────────────────────────────

function findMentionedProducts(query: string): Product[] {
  const q = query.toLowerCase();
  const matches: { product: Product; score: number }[] = [];

  PRODUCTS.forEach((p) => {
    let score = 0;
    const nameLower = p.name.toLowerCase();
    const brandLower = p.brand.toLowerCase();

    if (q.includes(nameLower)) {
      score += 50;
    } else {
      // Check individual words
      const words = p.name.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
      for (const w of words) {
        if (q.includes(w)) {
          score += 10;
        }
      }
    }

    if (q.includes(brandLower)) {
      score += 15;
    }

    if (score > 15) {
      matches.push({ product: p, score });
    }
  });

  return matches.sort((a, b) => b.score - a.score).map((m) => m.product);
}

// ─── Intent Classifier ───────────────────────────────────────────────────────

export function parseCustomerIntent(
  query: string,
  history: AssistantMessage[] = []
): ProductSearchIntent {
  const q = query.toLowerCase().trim();
  const { budget, minPrice, maxPrice } = extractNumbersAndBudget(q);
  const detectedCat = detectCategory(q);
  const mentionedProds = findMentionedProducts(q);

  // 1. Comparison Intent
  if (
    q.includes("compare") ||
    q.includes("vs") ||
    q.includes("versus") ||
    q.includes("which one is cheaper") ||
    q.includes("which is better") ||
    q.includes("difference between")
  ) {
    return {
      type: "compare",
      rawQuery: query,
      targetProductIds: mentionedProds.map((p) => p.id),
      targetProductNames: mentionedProds.map((p) => p.name),
      category: detectedCat,
    };
  }

  // 2. Shopping List Proposal Intent
  if (
    q.includes("shopping list") ||
    q.includes("build a list") ||
    q.includes("prepare a list") ||
    q.includes("family gathering") ||
    q.includes("party snacks") ||
    q.includes("breakfast basket") ||
    q.includes("weekly groceries") ||
    (budget !== undefined && (q.includes("list") || q.includes("basket") || q.includes("what can i buy")))
  ) {
    return {
      type: "shopping_list",
      rawQuery: query,
      budget,
      category: detectedCat,
      keywords: q.split(/\s+/),
    };
  }

  // 3. Budget Specific
  if (budget !== undefined || q.includes("under ₹") || q.includes("under rs") || q.includes("within my budget") || q.includes("within budget")) {
    return {
      type: "budget",
      rawQuery: query,
      budget: budget || 500,
      minPrice,
      maxPrice: maxPrice || budget || 500,
      category: detectedCat,
    };
  }

  // 4. Frequently Purchased / Past Purchases
  if (
    q.includes("frequently buy") ||
    q.includes("frequent") ||
    q.includes("past purchases") ||
    q.includes("previous orders") ||
    q.includes("reorder") ||
    q.includes("my usual") ||
    q.includes("bought before")
  ) {
    return {
      type: "frequent",
      rawQuery: query,
      category: detectedCat,
    };
  }

  // 5. Alternatives / Replacement
  if (
    q.includes("alternative") ||
    q.includes("substitute") ||
    q.includes("cheaper option") ||
    q.includes("replace") ||
    q.includes("healthier option")
  ) {
    return {
      type: "alternative",
      rawQuery: query,
      targetProductIds: mentionedProds.map((p) => p.id),
      category: detectedCat,
    };
  }

  // 6. Direct product search / category exploration
  if (detectedCat || mentionedProds.length > 0 || q.length > 2) {
    return {
      type: "search",
      rawQuery: query,
      category: detectedCat,
      targetProductIds: mentionedProds.map((p) => p.id),
      keywords: q.split(/\s+/).filter((w) => w.length > 2),
    };
  }

  return {
    type: "general",
    rawQuery: query,
  };
}

// ─── Filter & Search Engine ──────────────────────────────────────────────────

function searchAuthoritativeCatalogue(intent: ProductSearchIntent): Product[] {
  const rawLower = intent.rawQuery.toLowerCase();

  return PRODUCTS.filter((p) => {
    // Availability check
    if (!p.inStock) return false;

    // Category filter
    if (intent.category && p.category !== intent.category) {
      return false;
    }

    // Price bounds
    if (intent.maxPrice !== undefined && p.price > intent.maxPrice) {
      return false;
    }
    if (intent.minPrice !== undefined && p.price < intent.minPrice) {
      return false;
    }

    // Direct brand match
    if (intent.brand && !p.brand.toLowerCase().includes(intent.brand.toLowerCase())) {
      return false;
    }

    // Target product ids
    if (intent.targetProductIds && intent.targetProductIds.length > 0) {
      if (intent.targetProductIds.includes(p.id)) return true;
    }

    // Keyword relevance
    const searchableText = `${p.name} ${p.brand} ${p.category} ${p.description || ""} ${(p.tags || []).join(" ")}`.toLowerCase();

    // Check if entire query or any significant word matches
    if (intent.keywords && intent.keywords.length > 0) {
      const meaningfulKeywords = intent.keywords.filter(
        (k) => !["find", "show", "me", "want", "need", "for", "the", "and", "under", "with", "products"].includes(k)
      );
      if (meaningfulKeywords.length > 0) {
        return meaningfulKeywords.some((k) => searchableText.includes(k));
      }
    }

    // Fallback if category was specified
    if (intent.category) {
      return true;
    }

    // Fallback check if words match
    const words = rawLower.split(/\s+/).filter((w) => w.length > 2);
    return words.some((w) => searchableText.includes(w));
  });
}

// ─── Comparison Builder ──────────────────────────────────────────────────────

function buildProductComparison(
  intent: ProductSearchIntent,
  history: AssistantMessage[] = []
): { comparison?: ProductComparison; message: string; suggestedQuestions?: string[] } {
  let prodA: Product | undefined;
  let prodB: Product | undefined;

  // 1. Try to find from intent targets
  if (intent.targetProductIds && intent.targetProductIds.length >= 2) {
    prodA = PRODUCTS.find((p) => p.id === intent.targetProductIds![0]);
    prodB = PRODUCTS.find((p) => p.id === intent.targetProductIds![1]);
  } else if (intent.targetProductIds && intent.targetProductIds.length === 1) {
    prodA = PRODUCTS.find((p) => p.id === intent.targetProductIds![0]);
    // Find a comparable product in the same category
    if (prodA) {
      prodB = PRODUCTS.find((p) => p.category === prodA!.category && p.id !== prodA!.id && p.inStock);
    }
  }

  // 2. If not found in current query, look back in recent assistant product cards
  if (!prodA || !prodB) {
    for (let i = history.length - 1; i >= 0; i--) {
      const msg = history[i];
      if (msg.productCards && msg.productCards.length >= 2) {
        if (!prodA) prodA = msg.productCards[0].product;
        if (!prodB) prodB = msg.productCards[1].product;
        break;
      }
    }
  }

  // 3. Fallback to default iconic catalogue comparison (e.g., Amul Milk vs Farm Fresh Eggs or Oat Milk)
  if (!prodA || !prodB) {
    const popularInStock = PRODUCTS.filter((p) => p.inStock);
    prodA = popularInStock.find((p) => p.id === "prod-milk-amul") || popularInStock[0];
    prodB = popularInStock.find((p) => p.category === prodA?.category && p.id !== prodA?.id) || popularInStock[1];
  }

  if (!prodA || !prodB) {
    return {
      message: "Please mention two products from the catalogue you'd like to compare, for example: 'Compare Amul Milk and Epigamia Greek Yogurt'.",
      suggestedQuestions: [
        "Compare Amul Milk and Greek Yogurt",
        "Compare whole wheat bread and multigrain bread",
        "Show popular snacks under ₹100",
      ],
    };
  }

  const isACheaper = prodA.price < prodB.price;
  const priceDiff = Math.abs(prodA.price - prodB.price);

  const itemA: ProductComparisonItem = {
    product: prodA,
    brand: prodA.brand,
    packSize: prodA.unit,
    price: prodA.price,
    pricePerUnit: `₹${prodA.price} / ${prodA.unit}`,
    inStock: prodA.inStock,
    rating: prodA.rating,
    highlights: prodA.nutritionHighlights || prodA.tags || ["Standard retail pack"],
  };

  const itemB: ProductComparisonItem = {
    product: prodB,
    brand: prodB.brand,
    packSize: prodB.unit,
    price: prodB.price,
    pricePerUnit: `₹${prodB.price} / ${prodB.unit}`,
    inStock: prodB.inStock,
    rating: prodB.rating,
    highlights: prodB.nutritionHighlights || prodB.tags || ["Standard retail pack"],
  };

  const cheaperProduct = isACheaper ? prodA : prodB;
  const pricierProduct = isACheaper ? prodB : prodA;

  const comparison: ProductComparison = {
    items: [itemA, itemB],
    cheaperProductId: cheaperProduct.id,
    comparisonSummary: `${cheaperProduct.name} is ₹${priceDiff} lower in price than ${pricierProduct.name}. Both products are verified against current supermarket stock.`,
    tradeoffs: [
      `Price difference: ₹${priceDiff} (${cheaperProduct.name} is ₹${cheaperProduct.price} vs ${pricierProduct.name} at ₹${pricierProduct.price})`,
      `Customer ratings: ${prodA.name} is rated ${prodA.rating}★ (${prodA.ratingCount} reviews) vs ${prodB.name} rated ${prodB.rating}★ (${prodB.ratingCount} reviews)`,
      `Pack sizes: ${prodA.name} is ${prodA.unit} while ${prodB.name} is ${prodB.unit}`,
    ],
  };

  return {
    comparison,
    message: `Here is the authoritative side-by-side comparison between **${prodA.name}** and **${prodB.name}** using current store inventory and verified prices.`,
    suggestedQuestions: [
      `Add ${cheaperProduct.name} to cart`,
      `Show alternatives to ${pricierProduct.name}`,
      "What snacks can I get under ₹200?",
    ],
  };
}

// ─── Shopping List Builder ───────────────────────────────────────────────────

function buildShoppingListProposal(
  intent: ProductSearchIntent,
  budget: number
): { shoppingList: ShoppingListProposal; message: string; suggestedQuestions: string[] } {
  const isFamily = intent.rawQuery.toLowerCase().includes("family") || intent.rawQuery.toLowerCase().includes("gathering") || intent.rawQuery.toLowerCase().includes("party");
  const isBreakfast = intent.rawQuery.toLowerCase().includes("breakfast");

  // Select suitable items from inventory
  let candidatePool = PRODUCTS.filter((p) => p.inStock);

  if (isFamily) {
    candidatePool = candidatePool.filter((p) => ["snacks", "beverages", "bakery", "dairy-eggs"].includes(p.category));
  } else if (isBreakfast) {
    candidatePool = candidatePool.filter((p) => ["dairy-eggs", "bakery", "beverages", "fruits-vegetables"].includes(p.category));
  }

  // Sort by popularity and rating
  candidatePool.sort((a, b) => b.rating - a.rating);

  const selectedItems: ShoppingListItemProposal[] = [];
  let runningTotal = 0;

  for (const prod of candidatePool) {
    if (runningTotal + prod.price <= budget && selectedItems.length < 5) {
      selectedItems.push({
        product: prod,
        quantity: 1,
        unitPrice: prod.price,
        lineTotal: prod.price,
      });
      runningTotal += prod.price;
    }
  }

  // If pool was too restrictive, pick high-rated essentials
  if (selectedItems.length === 0) {
    const essentials = PRODUCTS.filter((p) => p.inStock && p.price <= budget).slice(0, 3);
    for (const prod of essentials) {
      if (runningTotal + prod.price <= budget) {
        selectedItems.push({
          product: prod,
          quantity: 1,
          unitPrice: prod.price,
          lineTotal: prod.price,
        });
        runningTotal += prod.price;
      }
    }
  }

  const remaining = budget - runningTotal;

  const proposal: ShoppingListProposal = {
    id: `proposal-${Date.now()}`,
    title: isFamily
      ? "Family Gathering & Party Basket"
      : isBreakfast
      ? "Nutritious Breakfast Essentials"
      : `Curated Shopping List (Budget: ₹${budget})`,
    items: selectedItems,
    estimatedTotal: runningTotal,
    budget,
    budgetRemaining: remaining >= 0 ? remaining : 0,
    fitsBudget: runningTotal <= budget,
    notes: "Estimated prices reflect current store shelves. You can adjust quantities or remove items before adding them to your cart.",
  };

  const message = `I have assembled a proposed shopping list with **${selectedItems.length} items** totaling **₹${runningTotal}** (within your ₹${budget} budget, leaving ₹${remaining} remaining). Review the items below, adjust quantities, and tap 'Add Selected to Cart' when ready.`;

  return {
    shoppingList: proposal,
    message,
    suggestedQuestions: [
      "Can I replace an item with a cheaper alternative?",
      "Add dairy products to this list",
      "What snacks can I buy with the remaining budget?",
    ],
  };
}

// ─── Alternatives Generator ──────────────────────────────────────────────────

function buildAlternativeRecommendations(
  intent: ProductSearchIntent
): { cards: AssistantProductCard[]; message: string; suggestedQuestions: string[] } {
  let targetProduct: Product | undefined;

  if (intent.targetProductIds && intent.targetProductIds.length > 0) {
    targetProduct = PRODUCTS.find((p) => p.id === intent.targetProductIds![0]);
  }

  if (!targetProduct) {
    // Pick first in-stock product or one mentioned
    targetProduct = PRODUCTS.find((p) => p.inStock) || PRODUCTS[0];
  }

  // Find alternatives in the same category
  const alternatives = PRODUCTS.filter(
    (p) => p.category === targetProduct!.category && p.id !== targetProduct!.id && p.inStock
  ).sort((a, b) => a.price - b.price);

  const cards: AssistantProductCard[] = alternatives.slice(0, 4).map((alt) => {
    const diff = targetProduct!.price - alt.price;
    const reason =
      diff > 0
        ? `Saves ₹${diff} compared to ${targetProduct!.name} (${alt.unit})`
        : `Comparable option in ${alt.category.replace("-", " ")} with ${alt.rating}★ rating`;

    return {
      product: alt,
      reason,
      badge: diff > 0 ? `Saves ₹${diff}` : `${alt.rating}★ Rated`,
      matchScore: 90,
    };
  });

  if (cards.length === 0) {
    return {
      cards: [],
      message: `No immediate direct alternatives found for **${targetProduct.name}** in the current store stock. Here are other popular items in our catalogue.`,
      suggestedQuestions: ["Show top recommended essentials", "Find snacks under ₹100"],
    };
  }

  return {
    cards,
    message: `Here are available alternatives to **${targetProduct.name}** in **${targetProduct.brand}**'s category, sorted with transparent pricing and real inventory:`,
    suggestedQuestions: [
      `Compare ${targetProduct.name} and ${cards[0].product.name}`,
      `Add ${cards[0].product.name} to cart`,
      "Show products under ₹200",
    ],
  };
}

// ─── Frequently Purchased Assistant Response ─────────────────────────────────

function buildFrequentlyPurchasedResponse(
  orders: DigitalReceipt[] = []
): { cards: AssistantProductCard[]; message: string; suggestedQuestions: string[] } {
  const frequentItems = getFrequentlyPurchasedProducts(orders);

  if (frequentItems.length === 0) {
    // Fallback to top-rated essentials
    const essentials = PRODUCTS.filter((p) => p.isPopular || p.isRecommended).slice(0, 4);
    const cards: AssistantProductCard[] = essentials.map((p) => ({
      product: p,
      reason: "Popular store staple frequently purchased by SmartCart shoppers",
      badge: "Popular Staple",
      matchScore: 92,
    }));

    return {
      cards,
      message: "You haven't completed any previous orders yet, so I've highlighted the store's most frequently bought daily staples for you:",
      suggestedQuestions: [
        "Recommend products under ₹500",
        "Help me prepare a shopping list",
        "Show fresh dairy and eggs",
      ],
    };
  }

  const cards: AssistantProductCard[] = frequentItems.slice(0, 4).map((f) => ({
    product: f.product,
    reason: `Purchased ${f.timesPurchased} times in your shopping history`,
    badge: `Bought ${f.timesPurchased}x`,
    matchScore: 98,
  }));

  return {
    cards,
    message: `Here are the items you frequently purchase based on your authenticated order history:`,
    suggestedQuestions: [
      "Add my top staple to cart",
      "Help me find products for my shopping list",
      "Show snacks under ₹200",
    ],
  };
}

// ─── Main Conversational Processing Function ─────────────────────────────────

export async function processAssistantRequest({
  message,
  conversationHistory = [],
  orders = [],
  userId,
}: {
  message: string;
  conversationHistory?: AssistantMessage[];
  orders?: DigitalReceipt[];
  userId?: string;
}): Promise<AssistantResponse> {
  const intent = parseCustomerIntent(message, conversationHistory);

  // 1. Comparison Intent
  if (intent.type === "compare") {
    const compResult = buildProductComparison(intent, conversationHistory);
    return {
      message: compResult.message,
      intentType: "compare",
      isDemoMode: true,
      comparison: compResult.comparison,
      suggestedQuestions: compResult.suggestedQuestions,
    };
  }

  // 2. Shopping List Proposal Intent
  if (intent.type === "shopping_list") {
    const budget = intent.budget || 500;
    const listResult = buildShoppingListProposal(intent, budget);
    return {
      message: listResult.message,
      intentType: "shopping_list",
      isDemoMode: true,
      shoppingList: listResult.shoppingList,
      suggestedQuestions: listResult.suggestedQuestions,
    };
  }

  // 3. Alternative Products Intent
  if (intent.type === "alternative") {
    const altResult = buildAlternativeRecommendations(intent);
    return {
      message: altResult.message,
      intentType: "alternative",
      isDemoMode: true,
      productCards: altResult.cards,
      suggestedQuestions: altResult.suggestedQuestions,
    };
  }

  // 4. Frequently Purchased Intent
  if (intent.type === "frequent") {
    const freqResult = buildFrequentlyPurchasedResponse(orders);
    return {
      message: freqResult.message,
      intentType: "frequent",
      isDemoMode: true,
      productCards: freqResult.cards,
      suggestedQuestions: freqResult.suggestedQuestions,
    };
  }

  // 5. Budget Based Recommendations
  if (intent.type === "budget") {
    const max = intent.maxPrice || intent.budget || 500;
    const matchingProducts = PRODUCTS.filter((p) => p.inStock && p.price <= max)
      .sort((a, b) => (b.popularityScore || b.rating) - (a.popularityScore || a.rating))
      .slice(0, 5);

    if (matchingProducts.length === 0) {
      return {
        message: `I couldn't find available products strictly under ₹${max}. Would you like to explore products starting from ₹${Math.min(...PRODUCTS.map((p) => p.price))}?`,
        intentType: "budget",
        isDemoMode: true,
        suggestedQuestions: [
          "Show products under ₹500",
          "Show available snacks",
          "Build a shopping list under ₹1,000",
        ],
      };
    }

    const cards: AssistantProductCard[] = matchingProducts.map((p) => ({
      product: p,
      reason: `Fits your budget of ₹${max} (Price: ₹${p.price})`,
      badge: `Under ₹${max}`,
      matchScore: 92,
    }));

    return {
      message: `Here are **${cards.length} top-rated products** that comfortably fit your budget of **₹${max}**:`,
      intentType: "budget",
      isDemoMode: true,
      productCards: cards,
      suggestedQuestions: [
        "Build a shopping list with these under ₹500",
        "Which of these is the best value?",
        "Show snacks under ₹100",
      ],
    };
  }

  // 6. Natural Language Catalogue Search
  const searchResults = searchAuthoritativeCatalogue(intent);

  if (searchResults.length > 0) {
    const cards: AssistantProductCard[] = searchResults.slice(0, 5).map((p) => {
      let reason = `Verified in-stock (${p.unit}) with ${p.rating}★ customer rating`;
      if (p.offerLabel) {
        reason += ` • ${p.offerLabel}`;
      }
      return {
        product: p,
        reason,
        badge: p.offerLabel || (p.isPopular ? "Popular" : undefined),
        matchScore: 88,
      };
    });

    return {
      message: `I found **${searchResults.length} matching products** in the live catalogue:`,
      intentType: "search",
      isDemoMode: true,
      productCards: cards,
      suggestedQuestions: [
        `Compare ${cards[0].product.name} and ${cards[1] ? cards[1].product.name : "alternatives"}`,
        "Recommend products under ₹300",
        "Help me prepare a shopping list",
      ],
    };
  }

  // 7. Clarification / General Fallback
  return {
    message: `I couldn't find exact matches for "${message}" in the current supermarket catalogue. Would you like to browse by category, find items within a specific budget, or compare two products?`,
    intentType: "clarification",
    isDemoMode: true,
    suggestedQuestions: [
      "Recommend products under ₹500",
      "Show fresh dairy and eggs",
      "Build a shopping list under ₹1,000",
      "Show products I frequently buy",
    ],
  };
}
