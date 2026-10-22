import React, { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/store/auth-store";
import { CartProvider } from "@/store/cart-store";
import { AppHeader } from "@/components/layout/app-header";
import { BottomNavigation } from "@/components/layout/bottom-navigation";
import { ToastNotification } from "@/components/ui/toast-notification";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SmartCart AI — Intelligent Supermarket Self-Checkout",
  description:
    "Scan grocery barcodes, track live cart totals, explore store deals, and enjoy queue-free self-checkout with SmartCart AI.",
  keywords: [
    "SmartCart AI",
    "Self Checkout",
    "Supermarket",
    "Barcode Scanner",
    "Smart Grocery",
    "Retail Tech",
  ],
  authors: [{ name: "SmartCart AI Team" }],
};

export const viewport: Viewport = {
  themeColor: "#102B35",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F7F9F8] text-[#18252B] selection:bg-[#17A890]/20 selection:text-[#102B35]">
        <AuthProvider>
          <CartProvider>
            {/* Global Toast Feedback */}
            <ToastNotification />

            {/* Sticky Header */}
            <AppHeader />

            {/* Main Content Area */}
            <main className="flex-1 w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto px-4 py-4 safe-pb">
              {children}
            </main>

            {/* Fixed Bottom Navigation */}
            <React.Suspense fallback={null}>
              <BottomNavigation />
            </React.Suspense>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
