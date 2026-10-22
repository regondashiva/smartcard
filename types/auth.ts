export type MembershipTier =
  | "Basic"
  | "SmartClub Silver"
  | "SmartClub Gold"
  | "SmartClub Platinum";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  membershipTier: MembershipTier;
  memberSince: string;
  avatarUrl?: string;
  preferredStoreId: string;
  dietaryPreferences: string[];
  twoFactorEnabled: boolean;
  biometricLoginEnabled: boolean;
  notificationPreferences: {
    orderUpdates: boolean;
    discountAlerts: boolean;
    cartReminders: boolean;
  };
  stats: {
    totalTrips: number;
    totalSavings: number;
    clubPoints: number;
  };
}

export interface SignUpData {
  name: string;
  email: string;
  phone: string;
  password: string;
  termsAccepted: boolean;
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  hasCompletedOnboarding: boolean;
  pendingVerificationPhone?: string;
  pendingVerificationEmail?: string;
}
