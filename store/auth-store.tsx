"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { UserProfile, SignUpData } from "@/types/auth";

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  hasCompletedOnboarding: boolean;
  isHydrated: boolean;
  pendingVerificationPhone: string | null;
  pendingVerificationEmail: string | null;
  login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithOtp: (phone: string) => Promise<{ success: boolean; error?: string }>;
  signup: (data: SignUpData) => Promise<{ success: boolean; error?: string }>;
  verifyPhoneOtp: (otp: string) => Promise<{ success: boolean; error?: string }>;
  verifyEmail: () => Promise<{ success: boolean; error?: string }>;
  requestPasswordReset: (identifier: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updated: Partial<UserProfile>) => void;
  logout: () => void;
  continueAsGuest: () => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_AUTH_KEY = "smartcart_auth_user_v1";
const LOCAL_STORAGE_ONBOARDING_KEY = "smartcart_onboarding_completed_v1";

export const DEFAULT_DEMO_USER: UserProfile = {
  id: "usr_84920",
  name: "Shiva Ramakrishna",
  email: "shiva.shopper@smartcart-demo.in",
  phone: "+91 98765 43210",
  isPhoneVerified: true,
  isEmailVerified: true,
  membershipTier: "SmartClub Gold",
  memberSince: "March 2024",
  preferredStoreId: "store-blr-01",
  dietaryPreferences: ["Vegetarian", "Organic Produce", "Low Sugar"],
  twoFactorEnabled: false,
  biometricLoginEnabled: true,
  notificationPreferences: {
    orderUpdates: true,
    discountAlerts: true,
    cartReminders: true,
  },
  stats: {
    totalTrips: 18,
    totalSavings: 1420,
    clubPoints: 850,
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(DEFAULT_DEMO_USER);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(true);
  const [pendingVerificationPhone, setPendingVerificationPhone] = useState<string | null>(null);
  const [pendingVerificationEmail, setPendingVerificationEmail] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // Client hydration
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
      const storedOnboarding = localStorage.getItem(LOCAL_STORAGE_ONBOARDING_KEY);

      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed.isGuest) {
          setIsGuest(true);
          setIsAuthenticated(false);
          setUser(null);
        } else if (parsed.user) {
          setUser(parsed.user);
          setIsAuthenticated(true);
          setIsGuest(false);
        }
      }

      if (storedOnboarding !== null) {
        setHasCompletedOnboarding(storedOnboarding === "true");
      }
    } catch {
      // Storage access or JSON error
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save to localStorage when state changes
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(
        LOCAL_STORAGE_AUTH_KEY,
        JSON.stringify({ user, isAuthenticated, isGuest })
      );
      localStorage.setItem(
        LOCAL_STORAGE_ONBOARDING_KEY,
        hasCompletedOnboarding ? "true" : "false"
      );
    } catch {
      // Local storage unavailable
    }
  }, [user, isAuthenticated, isGuest, hasCompletedOnboarding, isHydrated]);

  const login = async (identifier: string, _password: string) => {
    // Quick validation
    if (!identifier || identifier.trim() === "") {
      return { success: false, error: "Please enter your email or mobile number." };
    }

    // Populate user profile based on identifier or fallback to demo
    const isPhone = /^\+?[0-9\s-]{8,15}$/.test(identifier);
    const updatedUser: UserProfile = {
      ...DEFAULT_DEMO_USER,
      email: isPhone ? DEFAULT_DEMO_USER.email : identifier,
      phone: isPhone ? identifier : DEFAULT_DEMO_USER.phone,
    };

    setUser(updatedUser);
    setIsAuthenticated(true);
    setIsGuest(false);
    return { success: true };
  };

  const loginWithOtp = async (phone: string) => {
    if (!phone || phone.trim().length < 8) {
      return { success: false, error: "Please enter a valid 10-digit mobile number." };
    }
    setPendingVerificationPhone(phone);
    return { success: true };
  };

  const signup = async (data: SignUpData) => {
    if (!data.name || !data.email || !data.phone || !data.password) {
      return { success: false, error: "All registration fields are required." };
    }
    if (!data.termsAccepted) {
      return { success: false, error: "Please accept the terms and conditions to proceed." };
    }

    const newUser: UserProfile = {
      id: `usr_${Math.floor(10000 + Math.random() * 90000)}`,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      isPhoneVerified: false,
      isEmailVerified: false,
      membershipTier: "SmartClub Silver",
      memberSince: "Just now",
      preferredStoreId: "store-blr-01",
      dietaryPreferences: [],
      twoFactorEnabled: false,
      biometricLoginEnabled: false,
      notificationPreferences: {
        orderUpdates: true,
        discountAlerts: true,
        cartReminders: true,
      },
      stats: {
        totalTrips: 0,
        totalSavings: 0,
        clubPoints: 100, // 100 welcome bonus points!
      },
    };

    setUser(newUser);
    setIsAuthenticated(true);
    setIsGuest(false);
    setPendingVerificationPhone(data.phone);
    setPendingVerificationEmail(data.email);
    return { success: true };
  };

  const verifyPhoneOtp = async (otp: string) => {
    if (!otp || otp.length !== 6) {
      return { success: false, error: "Please enter a complete 6-digit OTP." };
    }
    // Accept demo OTP "123456" or any 6-digit code for testing
    if (user) {
      setUser({ ...user, isPhoneVerified: true });
    }
    setPendingVerificationPhone(null);
    return { success: true };
  };

  const verifyEmail = async () => {
    if (user) {
      setUser({ ...user, isEmailVerified: true });
    }
    setPendingVerificationEmail(null);
    return { success: true };
  };

  const requestPasswordReset = async (identifier: string) => {
    if (!identifier || identifier.trim() === "") {
      return { success: false, message: "Please provide your registered email or phone number." };
    }
    return {
      success: true,
      message: `Password reset instructions sent to ${identifier}.`,
    };
  };

  const resetPassword = async (newPassword: string) => {
    if (!newPassword || newPassword.length < 8) {
      return { success: false, error: "Password must be at least 8 characters long." };
    }
    return { success: true };
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    if (!user) return;
    setUser({ ...user, ...updated });
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsGuest(true);
  };

  const continueAsGuest = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsGuest(true);
    setHasCompletedOnboarding(true);
  };

  const completeOnboarding = () => {
    setHasCompletedOnboarding(true);
  };

  const resetOnboarding = () => {
    setHasCompletedOnboarding(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isGuest,
        hasCompletedOnboarding,
        isHydrated,
        pendingVerificationPhone,
        pendingVerificationEmail,
        login,
        loginWithOtp,
        signup,
        verifyPhoneOtp,
        verifyEmail,
        requestPasswordReset,
        resetPassword,
        updateProfile,
        logout,
        continueAsGuest,
        completeOnboarding,
        resetOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
