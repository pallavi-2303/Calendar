import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const getThemeColor = (month: number) => {
  const themes: Record<number, { bg: string; text: string; accent: string }> = {
    0: { bg: "bg-blue-600", text: "text-blue-600", accent: "text-sky-300" },    // Jan - Winter
    1: { bg: "bg-indigo-500", text: "text-indigo-500", accent: "text-indigo-200" }, // Feb
    2: { bg: "bg-emerald-500", text: "text-emerald-500", accent: "text-emerald-200" }, // Mar - Spring
    3: { bg: "bg-green-500", text: "text-green-500", accent: "text-green-200" }, // Apr
    4: { bg: "bg-yellow-500", text: "text-yellow-500", accent: "text-yellow-200" }, // May
    5: { bg: "bg-orange-500", text: "text-orange-500", accent: "text-orange-200" }, // Jun - Summer
    6: { bg: "bg-red-500", text: "text-red-500", accent: "text-red-200" },    // Jul
    7: { bg: "bg-rose-500", text: "text-rose-500", accent: "text-rose-200" },   // Aug
    8: { bg: "bg-amber-600", text: "text-amber-600", accent: "text-amber-200" }, // Sep - Autumn
    9: { bg: "bg-orange-700", text: "text-orange-700", accent: "text-orange-200" }, // Oct
    10: { bg: "bg-slate-700", text: "text-slate-700", accent: "text-slate-200" }, // Nov
    11: { bg: "bg-red-800", text: "text-red-800", accent: "text-red-200" },    // Dec - Holiday
  };

  return themes[month] || { bg: "bg-primary", text: "text-primary", accent: "text-sky-400" };
};
