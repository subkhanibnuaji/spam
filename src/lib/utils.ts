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
