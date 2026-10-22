"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/store/cart-store";
import {
  Home,
  Compass,
  ScanLine,
  ShoppingCart,
  User,
} from "lucide-react";

export function BottomNavigation() {
  const pathname = usePathname();
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: Home,
    },
    {
      label: "Explore",
      href: "/explore",
      icon: Compass,
    },
    {
      label: "Scan",
      href: "/scan",
      icon: ScanLine,
      isPrimaryAction: true,
    },
    {
      label: "Cart",
      href: "/cart",
      icon: ShoppingCart,
      badge: itemCount > 0 ? itemCount : undefined,
    },
    {
      label: "Profile",
      href: "/profile",
      icon: User,
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E5EBE8] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] print:hidden"
      role="navigation"
      aria-label="Main Mobile Navigation"
    >
      <div className="max-w-md md:max-w-xl lg:max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.isPrimaryAction) {
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label="Scan Product Barcode"
                className="relative -top-3 flex flex-col items-center group focus:outline-hidden"
              >
                <div
                  className={`w-13 h-13 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 group-hover:shadow-xl ${
                    isActive
                      ? "bg-[#102B35] text-[#17A890] ring-3 ring-[#17A890]"
                      : "bg-[#17A890] text-white hover:bg-[#128673]"
                  }`}
                >
                  <Icon className="w-6 h-6 stroke-[2.2]" />
                </div>
                <span
                  className={`text-[10px] font-bold mt-0.5 tracking-tight ${
                    isActive ? "text-[#102B35]" : "text-[#718096] group-hover:text-[#17A890]"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center py-1 transition-colors relative group ${
                isActive ? "text-[#17A890]" : "text-[#718096] hover:text-[#18252B]"
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform group-hover:scale-105 ${
                    isActive ? "stroke-[2.4]" : "stroke-[1.8]"
                  }`}
                />
                {item.badge !== undefined && (
                  <span
                    aria-label={`${item.badge} items in cart`}
                    className="absolute -top-1.5 -right-2 bg-[#D97706] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white animate-in zoom-in-75 duration-150"
                  >
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[11px] font-semibold mt-1 tracking-tight ${
                  isActive ? "text-[#17A890] font-bold" : "text-[#718096]"
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[#17A890] mt-0.5" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
