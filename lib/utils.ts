import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Debug helper
export const debugLog = (component: string, message: string, data?: any) => {
  if (process.env.NEXT_PUBLIC_DEBUG_MODE === "true") {
    console.log(`🐛 [${component}] ${message}`, data || "")
  }
}

// Format currency
export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price)
}
