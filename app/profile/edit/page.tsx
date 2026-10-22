"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/auth-store";
import { useCart } from "@/store/cart-store";
import { MOCK_STORES } from "@/data/products";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Check,
  Save,
  Tag,
} from "lucide-react";

const DIETARY_OPTIONS = [
  "Vegetarian",
  "Vegan",
  "Organic Produce",
  "Low Sugar",
  "Gluten Free",
  "Dairy Free",
  "Keto Friendly",
];

export function EditProfileComponent() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  const { showToast } = useCart();

  const [name, setName] = useState(user?.name || "Shiva Ramakrishna");
  const [email, setEmail] = useState(user?.email || "shiva.shopper@smartcart-demo.in");
  const [phone, setPhone] = useState(user?.phone || "+91 98765 43210");
  const [preferredStoreId, setPreferredStoreId] = useState(
    user?.preferredStoreId || "store-blr-01"
  );
  const [selectedDiets, setSelectedDiets] = useState<string[]>(
    user?.dietaryPreferences || ["Vegetarian", "Organic Produce"]
  );

  const toggleDiet = (diet: string) => {
    if (selectedDiets.includes(diet)) {
      setSelectedDiets(selectedDiets.filter((d) => d !== diet));
    } else {
      setSelectedDiets([...selectedDiets, diet]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    updateProfile({
      name,
      email,
      phone,
      preferredStoreId,
      dietaryPreferences: selectedDiets,
    });

    showToast("Profile Updated", "Your changes have been saved successfully.", "success");
    router.push("/profile");
  };

  return (
    <div className="max-w-md mx-auto py-2 space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-[#E5EBE8]">
        <div className="flex items-center gap-2">
          <Link
            href="/profile"
            className="w-8 h-8 rounded-lg bg-white border border-[#E5EBE8] text-[#18252B] flex items-center justify-center hover:bg-slate-50 transition-colors"
            aria-label="Back to profile"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-base font-bold text-[#102B35]">Edit Profile</h1>
            <p className="text-[11px] text-[#718096]">Update shopper information & preferences</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl border border-[#E5EBE8] p-5 shadow-sm space-y-4">
        {/* Full Name */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#18252B] block">
            Full Name
          </label>
          <div className="relative flex items-center">
            <User className="w-4 h-4 text-[#718096] absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E5EBE8] text-xs sm:text-sm text-[#18252B] bg-[#F7F9F8] focus:bg-white focus:border-[#17A890] focus:ring-2 focus:ring-[#17A890]/20 focus:outline-hidden transition-all"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#18252B] block">
            Email Address
          </label>
          <div className="relative flex items-center">
            <Mail className="w-4 h-4 text-[#718096] absolute left-3.5 pointer-events-none" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E5EBE8] text-xs sm:text-sm text-[#18252B] bg-[#F7F9F8] focus:bg-white focus:border-[#17A890] focus:ring-2 focus:ring-[#17A890]/20 focus:outline-hidden transition-all"
            />
          </div>
        </div>

        {/* Mobile Number */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#18252B] block">
            Mobile Number
          </label>
          <div className="relative flex items-center">
            <Phone className="w-4 h-4 text-[#718096] absolute left-3.5 pointer-events-none" />
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E5EBE8] text-xs sm:text-sm text-[#18252B] bg-[#F7F9F8] focus:bg-white focus:border-[#17A890] focus:ring-2 focus:ring-[#17A890]/20 focus:outline-hidden transition-all font-mono"
            />
          </div>
        </div>

        {/* Preferred Store */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-[#18252B] block">
            Preferred Supermarket Branch
          </label>
          <div className="relative flex items-center">
            <MapPin className="w-4 h-4 text-[#718096] absolute left-3.5 pointer-events-none" />
            <select
              value={preferredStoreId}
              onChange={(e) => setPreferredStoreId(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E5EBE8] text-xs sm:text-sm text-[#18252B] bg-[#F7F9F8] focus:bg-white focus:border-[#17A890] focus:ring-2 focus:ring-[#17A890]/20 focus:outline-hidden transition-all cursor-pointer"
            >
              {MOCK_STORES.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name} ({store.distance})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dietary & Lifestyle Preferences */}
        <div className="space-y-2 pt-2 border-t border-[#E5EBE8]">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#18252B]">
            <Tag className="w-3.5 h-3.5 text-[#17A890]" />
            <span>Dietary & Product Preferences</span>
          </div>
          <p className="text-[11px] text-[#718096]">
            Select tags to personalize your aisle recommendations & alerts.
          </p>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {DIETARY_OPTIONS.map((diet) => {
              const isSelected = selectedDiets.includes(diet);
              return (
                <button
                  type="button"
                  key={diet}
                  onClick={() => toggleDiet(diet)}
                  className={`text-xs px-3 py-1.5 rounded-xl border font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#17A890] text-white border-[#17A890]"
                      : "bg-[#F7F9F8] text-[#718096] border-[#E5EBE8] hover:border-[#17A890]/40"
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3" />}
                  <span>{diet}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-3 flex gap-2">
          <Link
            href="/profile"
            className="flex-1 py-2.5 px-4 rounded-xl border border-[#E5EBE8] hover:bg-slate-50 text-[#18252B] font-semibold text-xs text-center transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#17A890] hover:bg-[#128673] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default function EditProfilePage() {
  return <EditProfileComponent />;
}
