"use client";

import { useEffect, useRef } from "react";

interface AttendanceMapProps {
  lat: number;
  lng: number;
  locationName?: string;
  radius?: number;
  officeLat?: number;
  officeLng?: number;
}

export function AttendanceMap({
  lat,
  lng,
  locationName,
  radius,
  officeLat,
  officeLng,
}: AttendanceMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    let mounted = true;

    import("leaflet").then((L) => {
      if (!mounted || !mapRef.current) return;

      // Fix default icon issue with webpack/next.js
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }

      const map = L.map(mapRef.current!).setView([lat, lng], 16);
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      // User position marker - blue dot
      const userIcon = L.divIcon({
        className: "",
        html: '<div style="width:18px;height:18px;background:#3b82f6;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(59,130,246,0.5);"></div>',
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });

      L.marker([lat, lng], { icon: userIcon })
        .addTo(map)
        .bindPopup("Posisi Anda")
        .openPopup();

      // Office location and geofence radius
      if (officeLat !== undefined && officeLng !== undefined && radius) {
        L.marker([officeLat, officeLng])
          .addTo(map)
          .bindPopup(locationName || "Lokasi Kantor");

        L.circle([officeLat, officeLng], {
          radius,
          color: "#3b82f6",
          fillColor: "#3b82f6",
          fillOpacity: 0.08,
          weight: 2,
          dashArray: "6 4",
        }).addTo(map);

        // Fit bounds to show both markers
        const bounds = L.latLngBounds(
          [
            [lat, lng],
            [officeLat, officeLng],
          ]
        );
        map.fitBounds(bounds.pad(0.3));
      }
    });

    return () => {
      mounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [lat, lng, locationName, radius, officeLat, officeLng]);

  return <div ref={mapRef} className="h-full w-full rounded-lg" />;
}
