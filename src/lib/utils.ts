import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatWhatsAppLink(number: string): string {
  const cleaned = number.replace(/[^0-9]/g, "");
  const international = cleaned.startsWith("0")
    ? "62" + cleaned.slice(1)
    : cleaned.startsWith("62")
      ? cleaned
      : "62" + cleaned;
  return `https://wa.me/${international}`;
}

export function formatGoogleMapsLink(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

export function formatPhoneLink(phone: string): string {
  return `tel:${phone.replace(/[^0-9+]/g, "")}`;
}

export function parseOperatingHours(
  hoursJson: string
): Record<string, string> {
  try {
    return JSON.parse(hoursJson);
  } catch {
    return {};
  }
}

export function isOpenNow(hoursJson: string): boolean {
  const hours = parseOperatingHours(hoursJson);
  const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const now = new Date();
  const dayKey = days[now.getDay()];
  const todayHours = hours[dayKey];

  if (!todayHours || todayHours === "closed") return false;

  const [open, close] = todayHours.split("-");
  if (!open || !close) return false;

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const [openH, openM] = open.split(":").map(Number);
  const [closeH, closeM] = close.split(":").map(Number);

  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
}

export function parseJsonArray(json: string | null): string[] {
  if (!json) return [];
  try {
    return JSON.parse(json);
  } catch {
    return [];
  }
}

// Haversine formula to calculate distance between two coordinates in km
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Calculate travel time in minutes based on distance and speed
export function calculateTravelTime(
  distanceKm: number,
  speedKmh: number = 25
): number {
  return Math.round((distanceKm / speedKmh) * 60);
}

// Format distance for display
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)} m`;
  }
  return `${km.toFixed(1)} km`;
}

// Get open status text
export function getOpenStatusText(hoursJson: string): {
  isOpen: boolean;
  text: string;
  color: string;
} {
  const hours = parseOperatingHours(hoursJson);
  const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const now = new Date();
  const dayKey = days[now.getDay()];
  const todayHours = hours[dayKey];

  if (!todayHours || todayHours === "closed") {
    return { isOpen: false, text: "Closed today", color: "text-red-500" };
  }

  if (todayHours === "By appointment" || todayHours === "24 Hours") {
    return { isOpen: true, text: todayHours, color: "text-green-500" };
  }

  const [open, close] = todayHours.split("-");
  if (!open || !close) {
    return { isOpen: false, text: "Hours unknown", color: "text-gray-500" };
  }

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const [openH, openM] = open.split(":").map(Number);
  const [closeH, closeM] = close.split(":").map(Number);

  const openMinutes = openH * 60 + (openM || 0);
  const closeMinutes = closeH * 60 + (closeM || 0);

  if (currentMinutes < openMinutes) {
    return { isOpen: false, text: `Opens at ${open}`, color: "text-yellow-500" };
  }
  if (currentMinutes >= closeMinutes) {
    return { isOpen: false, text: "Closed", color: "text-red-500" };
  }
  return { isOpen: true, text: `Open until ${close}`, color: "text-green-500" };
}
