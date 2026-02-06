export const TIER_CONFIG = {
  "1": {
    bg: "bg-red-600",
    text: "text-white",
    label: "Surface Specialist",
    borderColor: "border-red-600",
    lightBg: "bg-red-50",
    lightText: "text-red-700",
    color: "#dc2626",
  },
  "2": {
    bg: "bg-orange-500",
    text: "text-white",
    label: "Premium Device",
    borderColor: "border-orange-500",
    lightBg: "bg-orange-50",
    lightText: "text-orange-700",
    color: "#ea580c",
  },
  "3": {
    bg: "bg-yellow-500",
    text: "text-white",
    label: "Authorized Center",
    borderColor: "border-yellow-500",
    lightBg: "bg-yellow-50",
    lightText: "text-yellow-700",
    color: "#eab308",
  },
  "4": {
    bg: "bg-green-600",
    text: "text-white",
    label: "High-Volume",
    borderColor: "border-green-600",
    lightBg: "bg-green-50",
    lightText: "text-green-700",
    color: "#16a34a",
  },
  "5": {
    bg: "bg-teal-500",
    text: "text-white",
    label: "Mall-Based",
    borderColor: "border-teal-500",
    lightBg: "bg-teal-50",
    lightText: "text-teal-700",
    color: "#14b8a6",
  },
  "6": {
    bg: "bg-blue-500",
    text: "text-white",
    label: "Mangga Dua",
    borderColor: "border-blue-500",
    lightBg: "bg-blue-50",
    lightText: "text-blue-700",
    color: "#3b82f6",
  },
  "7": {
    bg: "bg-indigo-500",
    text: "text-white",
    label: "Bekasi Area",
    borderColor: "border-indigo-500",
    lightBg: "bg-indigo-50",
    lightText: "text-indigo-700",
    color: "#6366f1",
  },
  "8": {
    bg: "bg-purple-500",
    text: "text-white",
    label: "Tangerang/BSD",
    borderColor: "border-purple-500",
    lightBg: "bg-purple-50",
    lightText: "text-purple-700",
    color: "#a855f7",
  },
} as const;

export type TierKey = keyof typeof TIER_CONFIG;

export const DISTRICTS = [
  "Jakarta Selatan",
  "Jakarta Barat",
  "Jakarta Pusat",
  "Jakarta Utara",
  "Jakarta Timur",
  "Bekasi",
  "Tangerang/BSD",
] as const;

export const DEFAULT_START = {
  address: "Jl. Raden Patah 1 No.1-2, Selong, Kebayoran Baru, Jakarta Selatan 12110",
  lat: -6.2441,
  lng: 106.8089,
};

export const TRANSPORT_SPEEDS = {
  motorcycle: 25, // km/h average in Jakarta traffic
  car: 15,
  public: 12,
} as const;
