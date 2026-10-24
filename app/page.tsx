"use client";

import React, { useState, useRef } from "react";
import { PRODUCTS } from "@/data/products";
import { CATEGORIES } from "@/data/categories";
import { Product } from "@/types/product";
import { SearchBar } from "@/components/home/search-bar";
import { ShoppingSessionCard } from "@/components/home/shopping-session-card";
import { OffersCarousel } from "@/components/home/offers-carousel";

import { CategoryList } from "@/components/home/category-list";
import { ProductSection } from "@/components/home/product-section";

import { ProductPreviewModal } from "@/components/products/product-preview-modal";
import { SplashScreen } from "@/components/splash/splash-screen";
import { getHasInitialSplashRun } from "@/components/splash/splash-state";
import { Sparkles, Flame } from "lucide-react";

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(!getHasInitialSplashRun());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);

  const productSectionRef = useRef<HTMLDivElement>(null);

  // Filter products based on selected category & search query
  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesCategory =
      selectedCategoryId === "all" || product.category === selectedCategoryId;
    const matchesSearch =
      searchQuery.trim() === "" ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.tags &&
        product.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ));
    return matchesCategory && matchesSearch;
  });

  const recommendedProducts = PRODUCTS.filter((p) => p.isRecommended);
  const popularProducts = PRODUCTS.filter((p) => p.isPopular);

  const scrollToProducts = () => {
    if (productSectionRef.current) {
      productSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };



  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className="space-y-6">
      {/* 1. Search Bar */}
      <section aria-label="Product Search">
        <SearchBar
          products={PRODUCTS}
          onSelectProduct={(product) => setPreviewProduct(product)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </section>

      {/* 2. Smart Shopping Session Card */}
      <section aria-label="Shopping Session">
        <ShoppingSessionCard onBrowseClick={scrollToProducts} />
      </section>

      {/* 3. Swipeable Offers Carousel */}
      <OffersCarousel />

      {/* 4. Product Categories Filter */}
      <div ref={productSectionRef}>
        <CategoryList
          categories={CATEGORIES}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={(catId) => setSelectedCategoryId(catId)}
        />
      </div>

      {/* 6. Product listing (filtered or default feed) */}
      {selectedCategoryId !== "all" || searchQuery.trim() !== "" ? (
        <section aria-label="Filtered Catalogue">
          <ProductSection
            title={
              selectedCategoryId !== "all"
                ? CATEGORIES.find((c) => c.id === selectedCategoryId)?.name ||
                  "Category Products"
                : `Search results for "${searchQuery}"`
            }
            subtitle={`Showing ${filteredProducts.length} available items`}
            products={filteredProducts}
            onPreview={(product) => setPreviewProduct(product)}
            emptyMessage={
              searchQuery.trim()
                ? `No products found matching "${searchQuery}".`
                : "No products in this category yet."
            }
          />
        </section>
      ) : (
        <>
          {/* 7. Recommended Products */}
          <section aria-label="Recommended Products">
            <ProductSection
              title="Recommended for you"
              subtitle="Daily fresh essentials & special discounts"
              products={recommendedProducts}
              onPreview={(product) => setPreviewProduct(product)}
              icon={Sparkles}
              variant="grid"
            />
          </section>

          {/* 8. Popular Products */}
          <section aria-label="Popular Products">
            <ProductSection
              title="Popular in your store"
              subtitle="Top picks frequently added to smart carts today"
              products={popularProducts}
              onPreview={(product) => setPreviewProduct(product)}
              icon={Flame}
              variant="carousel"
            />
          </section>
        </>
      )}



      {/* Product Preview Modal */}
      <ProductPreviewModal
        product={previewProduct}
        onClose={() => setPreviewProduct(null)}
      />
    </div>
  );
}
