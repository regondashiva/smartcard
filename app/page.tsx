"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { PRODUCTS } from "@/data/products";
import { CATEGORIES } from "@/data/categories";
import { Product } from "@/types/product";
import { SearchBar } from "@/components/home/search-bar";
import { ShoppingSessionCard } from "@/components/home/shopping-session-card";
import { PromotionalBanner } from "@/components/home/promotional-banner";
import { CategoryList } from "@/components/home/category-list";
import { ProductSection } from "@/components/home/product-section";
import { ShoppingBenefits } from "@/components/home/shopping-benefits";
import { ProductPreviewModal } from "@/components/products/product-preview-modal";
import { Sparkles, Flame, X, CheckCircle2, Bot, ArrowRight } from "lucide-react";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

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

  // Recommended products: filtered subset or items tagged recommended
  const recommendedProducts = PRODUCTS.filter((p) => p.isRecommended);

  // Popular products: filtered subset or items tagged popular
  const popularProducts = PRODUCTS.filter((p) => p.isPopular);

  const scrollToProducts = () => {
    if (productSectionRef.current) {
      productSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Prominent Search Bar */}
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

      {/* 2.5 SmartCart AI Assistant Feature Card */}
      <section aria-label="AI Shopping Assistant">
        <div className="bg-gradient-to-br from-[#102B35] via-[#123845] to-[#0D242C] rounded-2xl p-4 text-white shadow-lg border border-[#17A890]/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-44 h-44 bg-[#17A890]/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#17A890] flex items-center justify-center text-[#102B35] shadow-xs">
                  <Bot className="w-4 h-4 text-[#102B35]" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black tracking-wide uppercase text-[#25d3b6]">
                    Module 11 • SmartCart AI
                  </span>
                  <span className="bg-white/10 text-[10px] font-semibold text-slate-300 px-1.5 py-0.2 rounded">
                    Demo Mode
                  </span>
                </div>
              </div>
            </div>

            <h3 className="text-base font-extrabold text-white tracking-tight mb-1">
              AI Product Recommendations & Shopping Assistant
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              Describe what you need in plain English. Get instant budget-aware recommendations, side-by-side product comparisons, and tailored shopping lists directly from our live supermarket inventory.
            </p>

            {/* Quick action chips */}
            <div className="flex flex-wrap gap-1.5 mb-3.5">
              {[
                "Under ₹500",
                "Compare products",
                "Shopping list for party",
                "Frequently bought",
              ].map((chip, idx) => (
                <Link
                  key={idx}
                  href="/assistant"
                  className="text-[11px] font-medium bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white px-2.5 py-1 rounded-full border border-white/10 transition-colors"
                >
                  {chip}
                </Link>
              ))}
            </div>

            <Link
              href="/assistant"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#17A890] hover:bg-[#138975] text-[#102B35] hover:text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-98"
            >
              <Sparkles className="w-4 h-4" />
              <span>Chat with Shopping Assistant</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Promotional Banner */}
      <section aria-label="Promotional Announcement">
        <PromotionalBanner onLearnMore={() => setShowHowItWorks(true)} />
      </section>

      {/* 4. Product Categories Filter */}
      <div ref={productSectionRef}>
        <CategoryList
          categories={CATEGORIES}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={(catId) => {
            setSelectedCategoryId(catId);
          }}
        />
      </div>

      {/* 5. If user filtered by category or is actively searching, show matched products */}
      {selectedCategoryId !== "all" || searchQuery.trim() !== "" ? (
        <section aria-label="Filtered Catalogue">
          <ProductSection
            title={
              selectedCategoryId !== "all"
                ? CATEGORIES.find((c) => c.id === selectedCategoryId)?.name || "Category Products"
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
        /* Default Home Feed */
        <>
          {/* 6. Recommended Products Section */}
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

          {/* 7. Popular Products Section (Horizontal carousel on mobile, clean grid on desktop) */}
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

      {/* 8. Shopping Benefits */}
      <section aria-label="Smart Shopping Advantages">
        <ShoppingBenefits />
      </section>

      {/* Product Preview Modal */}
      <ProductPreviewModal
        product={previewProduct}
        onClose={() => setPreviewProduct(null)}
      />

      {/* "How It Works" Informational Modal */}
      {showHowItWorks && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E5EBE8] overflow-hidden p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5EBE8]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#17A890]/10 text-[#17A890] flex items-center justify-center font-bold">
                  AI
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#18252B]">
                    How SmartCart AI Works
                  </h3>
                  <p className="text-[11px] text-[#718096]">
                    Frictionless 4-step supermarket journey
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowHowItWorks(false)}
                className="p-1 rounded-lg text-[#718096] hover:bg-slate-100"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#18252B]">
              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-[#F7F9F8] border border-[#E5EBE8]">
                <span className="w-6 h-6 rounded-full bg-[#102B35] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  1
                </span>
                <div>
                  <p className="font-bold">Start Shopping Session</p>
                  <p className="text-[#718096] text-[11px] mt-0.5">
                    Pair your smartphone with an in-store SmartCart or start a personal handheld session.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-[#F7F9F8] border border-[#E5EBE8]">
                <span className="w-6 h-6 rounded-full bg-[#17A890] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  2
                </span>
                <div>
                  <p className="font-bold">Scan In-Aisle Barcodes</p>
                  <p className="text-[#718096] text-[11px] mt-0.5">
                    Use your phone camera to scan barcodes on milk, snacks, and produce before placing them in the cart.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-[#F7F9F8] border border-[#E5EBE8]">
                <span className="w-6 h-6 rounded-full bg-[#17A890] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  3
                </span>
                <div>
                  <p className="font-bold">Track Live Bill & Discounts</p>
                  <p className="text-[#718096] text-[11px] mt-0.5">
                    Review your running total, GST breakdown, and store offers in real-time.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2.5 rounded-xl bg-[#F7F9F8] border border-[#E5EBE8]">
                <span className="w-6 h-6 rounded-full bg-[#16865C] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  4
                </span>
                <div>
                  <p className="font-bold">Pay Digitally & Exit</p>
                  <p className="text-[#718096] text-[11px] mt-0.5">
                    Complete UPI/card payment directly on your phone and scan your exit QR code at the validation gate.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowHowItWorks(false)}
              className="w-full py-2.5 bg-[#17A890] hover:bg-[#128673] text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              Got it, let&apos;s shop!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
