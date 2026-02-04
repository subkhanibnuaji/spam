"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";

interface MapMarker {
  lat: number;
  lng: number;
  label: string;
  name: string;
  tier?: string;
  selected?: boolean;
}

interface TripMapProps {
  markers: MapMarker[];
  startLat: number;
  startLng: number;
  showRoute?: boolean;
}

const TIER_COLORS: Record<string, string> = {
  S: "#f59e0b",
  A: "#10b981",
  B: "#3b82f6",
  C: "#6b7280",
};

function createMarkerIcon(
  label: string,
  color: string,
  isSelected?: boolean
): L.DivIcon {
  return L.divIcon({
    html: `<div style="
      background-color: ${color};
      color: white;
      width: ${isSelected ? "32px" : "28px"};
      height: ${isSelected ? "32px" : "28px"};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
      border: 2px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      ${isSelected ? "transform: scale(1.15);" : ""}
    ">${label}</div>`,
    className: "",
    iconSize: [isSelected ? 32 : 28, isSelected ? 32 : 28],
    iconAnchor: [isSelected ? 16 : 14, isSelected ? 16 : 14],
  });
}

export default function TripMap({
  markers,
  startLat,
  startLng,
  showRoute,
}: TripMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView(
        [startLat, startLng],
        11
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(mapRef.current);
    }

    const map = mapRef.current;

    // Clear existing layers
    map.eachLayer((layer) => {
      if (!(layer instanceof L.TileLayer)) {
        map.removeLayer(layer);
      }
    });

    // Start marker
    const startIcon = L.divIcon({
      html: `<div style="
        background-color: #22c55e;
        color: white;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">🏠</div>`,
      className: "",
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    L.marker([startLat, startLng], { icon: startIcon })
      .addTo(map)
      .bindPopup("Starting Point");

    // Add markers
    const bounds = L.latLngBounds([[startLat, startLng]]);

    markers.forEach((m) => {
      if (!m.lat || !m.lng) return;
      const color =
        m.tier && TIER_COLORS[m.tier]
          ? TIER_COLORS[m.tier]
          : m.selected
            ? "#3b82f6"
            : "#6b7280";

      const icon = createMarkerIcon(m.label, color, m.selected);

      L.marker([m.lat, m.lng], { icon })
        .addTo(map)
        .bindPopup(`<strong>${m.name}</strong>`);

      bounds.extend([m.lat, m.lng]);
    });

    // Draw route line if showing trip
    if (showRoute && markers.length > 0) {
      const routePoints: L.LatLngExpression[] = [[startLat, startLng]];
      markers.forEach((m) => {
        if (m.lat && m.lng) {
          routePoints.push([m.lat, m.lng]);
        }
      });
      routePoints.push([startLat, startLng]); // Return to start

      L.polyline(routePoints, {
        color: "#3b82f6",
        weight: 3,
        opacity: 0.7,
        dashArray: "10, 5",
      }).addTo(map);
    }

    map.fitBounds(bounds, { padding: [30, 30] });

    return () => {};
  }, [markers, startLat, startLng, showRoute]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return <div ref={mapContainerRef} className="h-[400px] w-full" />;
}
