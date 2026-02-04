import { TRANSPORT_SPEEDS } from "./constants";

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function estimateTravelTime(
  distanceKm: number,
  mode: keyof typeof TRANSPORT_SPEEDS = "motorcycle"
): number {
  const speed = TRANSPORT_SPEEDS[mode];
  return Math.round((distanceKm / speed) * 60);
}

interface TripStop {
  id: string;
  lat: number;
  lng: number;
  name: string;
  openTime?: string;
  visitDuration: number;
  type: "shop" | "cluster";
}

export function optimizeRoute(
  start: { lat: number; lng: number },
  stops: TripStop[]
): TripStop[] {
  const route: TripStop[] = [];
  const remaining = [...stops];
  let current = start;

  while (remaining.length > 0) {
    let nearestIdx = 0;
    let nearestDist = Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const dist = calculateDistance(
        current.lat,
        current.lng,
        remaining[i].lat,
        remaining[i].lng
      );
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestIdx = i;
      }
    }

    const next = remaining.splice(nearestIdx, 1)[0];
    route.push(next);
    current = { lat: next.lat, lng: next.lng };
  }

  return route;
}

function parseTime(timeStr: string): number {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

function formatMinutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export interface TripTimelineEntry {
  stop: TripStop;
  arrivalTime: string;
  departureTime: string;
  distanceFromPrevious: number;
  durationFromPrevious: number;
  warnings: string[];
}

export function generateTimeline(
  startLat: number,
  startLng: number,
  startTime: string,
  optimizedRoute: TripStop[],
  transportMode: keyof typeof TRANSPORT_SPEEDS = "motorcycle"
): {
  timeline: TripTimelineEntry[];
  totalDistance: number;
  totalDuration: number;
  estimatedEndTime: string;
} {
  let currentMinutes = parseTime(startTime);
  let prevLat = startLat;
  let prevLng = startLng;
  let totalDistance = 0;
  const startMinutes = currentMinutes;

  const timeline: TripTimelineEntry[] = optimizedRoute.map((stop) => {
    const distance = calculateDistance(prevLat, prevLng, stop.lat, stop.lng);
    const travelTime = estimateTravelTime(distance, transportMode);
    currentMinutes += travelTime;
    totalDistance += distance;

    const warnings: string[] = [];
    if (stop.openTime) {
      const openMinutes = parseTime(stop.openTime);
      if (currentMinutes < openMinutes) {
        const waitTime = openMinutes - currentMinutes;
        warnings.push(
          `Arrives at ${formatMinutesToTime(currentMinutes)}, opens at ${stop.openTime}. Wait ${waitTime} min.`
        );
        currentMinutes = openMinutes;
      }
    }

    const arrivalTime = formatMinutesToTime(currentMinutes);
    currentMinutes += stop.visitDuration;
    const departureTime = formatMinutesToTime(currentMinutes);

    prevLat = stop.lat;
    prevLng = stop.lng;

    return {
      stop,
      arrivalTime,
      departureTime,
      distanceFromPrevious: Math.round(distance * 10) / 10,
      durationFromPrevious: travelTime,
      warnings,
    };
  });

  // Add return trip estimate
  const returnDistance = calculateDistance(prevLat, prevLng, startLat, startLng);
  const returnTime = estimateTravelTime(returnDistance, transportMode);
  currentMinutes += returnTime;
  totalDistance += returnDistance;

  return {
    timeline,
    totalDistance: Math.round(totalDistance * 10) / 10,
    totalDuration: currentMinutes - startMinutes,
    estimatedEndTime: formatMinutesToTime(currentMinutes),
  };
}
