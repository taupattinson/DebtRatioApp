import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as currency in tenge
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('ru-KZ', {
    style: 'currency',
    currency: 'KZT',
    maximumFractionDigits: 0
  }).format(value);
}

/**
 * Calculates DTI ratio
 */
export function calculateDTI(income: number, debts: number): number {
  if (income <= 0) return 0;
  return (debts / income) * 100;
}

/**
 * Determines risk level based on DTI percentage
 */
export function getDTIRiskLevel(dtiPercentage: number): "low" | "moderate" | "high" {
  if (dtiPercentage <= 20) {
    return "low";
  } else if (dtiPercentage <= 35) {
    return "moderate";
  } else {
    return "high";
  }
}
