"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Tag, ChevronLeft, ChevronRight } from "lucide-react";

interface OfferBanner {
  id: string;
  badge: string;
  headline: string;
  sub: string;
  cta: string;
  overlay: string;
  badgeColor: string;
  imageUrl: string;
  imageAlt: string;
}

const OFFERS: OfferBanner[] = [
  {
    id: "fresh-50",
    badge: "FLASH DEAL",
    headline: "50% OFF Fresh Fruits",
    sub: "Mangoes, Bananas, Apples & more",
    cta: "Shop Now →",
    overlay: "from-black/70 via-black/40 to-transparent",
    badgeColor: "bg-emerald-400 text-emerald-900",
    imageUrl: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Fresh colourful fruits",
  },
  {
    id: "dairy-30",
    badge: "STORE OFFER",
    headline: "30% OFF Dairy & Eggs",
    sub: "Amul, Mother Dairy & local brands",
    cta: "View Deals →",
    overlay: "from-black/70 via-black/40 to-transparent",
    badgeColor: "bg-blue-300 text-blue-900",
    imageUrl: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Fresh milk and dairy products",
  },
  {
    id: "snacks-buy2",
    badge: "COMBO OFFER",
    headline: "Buy 2 Get 1 Free Snacks",
    sub: "Lays, Kurkure, Bingo & 40+ brands",
    cta: "Grab Deal →",
    overlay: "from-black/70 via-black/40 to-transparent",
    badgeColor: "bg-amber-300 text-amber-900",
    imageUrl: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Variety of snack chips",
  },
  {
    id: "beverages-25",
    badge: "WEEKEND SPECIAL",
    headline: "25% OFF Cold Drinks",
    sub: "Coke, Pepsi, Juice, Energy Drinks",
    cta: "Shop Drinks →",
    overlay: "from-black/70 via-black/40 to-transparent",
    badgeColor: "bg-violet-300 text-violet-900",
    imageUrl: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Cold beverages and drinks",
  },
  {
    id: "household-flat",
    badge: "SMARTCLUB",
    headline: "Flat ₹200 OFF Household",
    sub: "Detergents, Cleaners, Toiletries",
    cta: "Claim Offer →",
    overlay: "from-black/70 via-black/40 to-transparent",
    badgeColor: "bg-cyan-300 text-cyan-900",
    imageUrl: "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Household cleaning products",
  },
  {
    id: "organic-40",
    badge: "NEW ARRIVAL",
    headline: "40% OFF Organic Range",
    sub: "Certified grains, pulses & oils",
    cta: "Go Organic →",
    overlay: "from-black/70 via-black/40 to-transparent",
    badgeColor: "bg-lime-300 text-lime-900",
    imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
    imageAlt: "Fresh organic vegetables and produce",
  },
];

export function OffersCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const total = OFFERS.length;

  // Auto-advance every 3.5 s
  useEffect(() => {
    const t = setInterval(() => setActiveIdx((p) => (p + 1) % total), 3500);
    return () => clearInterval(t);
  }, [total]);

  // Sync scroll to active slide
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const cardW = el.scrollWidth / total;
    el.scrollTo({ left: activeIdx * cardW, behavior: "smooth" });
  }, [activeIdx, total]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const cardW = el.scrollWidth / total;
    setActiveIdx(Math.min(Math.max(Math.round(el.scrollLeft / cardW), 0), total - 1));
  }, [total]);

  return (
    <section aria-label="Deals and Offers" className="space-y-2.5">
      {/* Header row */}
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-[#17A890]" />
          <span className="text-xs font-black text-[#102B35] tracking-tight">
            Today&apos;s Offers
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveIdx((p) => Math.max(p - 1, 0))}
            disabled={activeIdx === 0}
            className="w-6 h-6 rounded-full bg-white border border-[#E5EBE8] flex items-center justify-center hover:bg-[#F7F9F8] disabled:opacity-30 transition-opacity shadow-sm"
            aria-label="Previous offer"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-[#102B35]" />
          </button>
          <button
            onClick={() => setActiveIdx((p) => Math.min(p + 1, total - 1))}
            disabled={activeIdx === total - 1}
            className="w-6 h-6 rounded-full bg-white border border-[#E5EBE8] flex items-center justify-center hover:bg-[#F7F9F8] disabled:opacity-30 transition-opacity shadow-sm"
            aria-label="Next offer"
          >
            <ChevronRight className="w-3.5 h-3.5 text-[#102B35]" />
          </button>
        </div>
      </div>

      {/* Scrollable cards */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-1"
      >
        {OFFERS.map((offer) => (
          <div
            key={offer.id}
            className="snap-start flex-shrink-0 w-[85vw] sm:w-[340px] h-[160px] sm:h-[180px] rounded-2xl overflow-hidden relative cursor-pointer group shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            {/* Background product image */}
            <Image
              src={offer.imageUrl}
              alt={offer.imageAlt}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 85vw, 340px"
            />

            {/* Dark gradient overlay for text legibility */}
            <div className={`absolute inset-0 bg-gradient-to-r ${offer.overlay}`} />

            {/* Content on top of image */}
            <div className="relative z-10 flex flex-col justify-between h-full p-4">
              {/* Badge */}
              <span className={`self-start text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full ${offer.badgeColor}`}>
                {offer.badge}
              </span>

              {/* Text + CTA */}
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-black text-white leading-tight drop-shadow-sm">
                  {offer.headline}
                </h3>
                <p className="text-[11px] text-white/80 leading-snug drop-shadow-sm">
                  {offer.sub}
                </p>
                <button className="mt-1 self-start bg-white/20 hover:bg-white/30 border border-white/40 text-white text-[11px] font-bold px-3 py-1 rounded-lg transition-colors backdrop-blur-sm">
                  {offer.cta}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="flex items-center justify-center gap-1.5">
        {OFFERS.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIdx(i)}
            className={`rounded-full transition-all duration-300 ${
              i === activeIdx ? "w-5 h-1.5 bg-[#17A890]" : "w-1.5 h-1.5 bg-[#CBD5E1]"
            }`}
            aria-label={`Go to offer ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
