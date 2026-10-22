import { Product } from "./product";

export interface CartItem {
  product: Product;
  quantity: number;
  addedAt: string;
}

export interface ShoppingSession {
  id: string;
  isActive: boolean;
  storeId: string;
  storeName: string;
  storeLocation: string;
  startTime?: string;
  cartTag: string; // e.g. "Cart #04"
  isHardwareConnected: boolean; // explicitly false for demo session
}

export interface StoreLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  distance: string;
  isOpen: boolean;
  hours: string;
}
