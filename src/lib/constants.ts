export const TIER_CONFIG = {
  S: {
    bg: "bg-amber-500",
    text: "text-white",
    label: "Surface Specialist",
    borderColor: "border-amber-500",
    lightBg: "bg-amber-50",
    lightText: "text-amber-700",
  },
  A: {
    bg: "bg-emerald-500",
    text: "text-white",
    label: "Confirmed Capable",
    borderColor: "border-emerald-500",
    lightBg: "bg-emerald-50",
    lightText: "text-emerald-700",
  },
  B: {
    bg: "bg-blue-500",
    text: "text-white",
    label: "Likely Capable",
    borderColor: "border-blue-500",
    lightBg: "bg-blue-50",
    lightText: "text-blue-700",
  },
  C: {
    bg: "bg-gray-500",
    text: "text-white",
    label: "General Repair",
    borderColor: "border-gray-500",
    lightBg: "bg-gray-50",
    lightText: "text-gray-700",
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
  "Jabodetabek",
] as const;

export const DEFAULT_START = {
  address: "Jl. Raden Patah 1 No.1 2, Selong, Kebayoran Baru, Jakarta Selatan",
  lat: -6.2437,
  lng: 106.8012,
};

export const TRANSPORT_SPEEDS = {
  motorcycle: 20, // km/h average in Jakarta
  car: 15,        // km/h average in Jakarta traffic
  public: 12,     // km/h average with waiting
} as const;
