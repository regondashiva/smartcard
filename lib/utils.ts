import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function parseProductWeightInGrams(unit: string, weight?: string): number | null {
  const text = `${weight || ""} ${unit}`.toLowerCase();

  const kgMatch = text.match(/([\d.]+)\s*kg/);
  if (kgMatch) {
    const val = parseFloat(kgMatch[1]);
    return isNaN(val) ? null : val * 1000;
  }

  const gMatch = text.match(/([\d.]+)\s*(?:g|gm|gms|gram|grams)(?!\w)/);
  if (gMatch) {
    const val = parseFloat(gMatch[1]);
    return isNaN(val) ? null : val;
  }

  const lMatch = text.match(/([\d.]+)\s*(?:l|ltr|liter|litre)(?!\w)/);
  if (lMatch) {
    const val = parseFloat(lMatch[1]);
    return isNaN(val) ? null : val * 1000;
  }

  const mlMatch = text.match(/([\d.]+)\s*ml(?!\w)/);
  if (mlMatch) {
    const val = parseFloat(mlMatch[1]);
    return isNaN(val) ? null : val;
  }

  return null;
}

export function formatWeight(grams: number): string {
  if (grams >= 1000) {
    const kg = grams / 1000;
    return `${kg.toFixed(2)} kg`;
  }
  return `${Math.round(grams)} g`;
}
