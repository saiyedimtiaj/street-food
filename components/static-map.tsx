"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface StaticMapProps {
  lat: number;
  lng: number;
  storeName?: string;
  className?: string;
}

export function StaticMap({ lat, lng, storeName, className }: StaticMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [lat, lng],
      zoom: 16,
      zoomControl: false,
      scrollWheelZoom: false,
      dragging: false,
      touchZoom: false,
      doubleClickZoom: false,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
    }).addTo(map);

    const icon = L.divIcon({
      html: `<div class="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground" style="background:#f97316;border:2px solid #fff;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;box-shadow:0 0 12px rgba(249,115,22,0.5)"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg></div>`,
      className: "",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

    const marker = L.marker([lat, lng], { icon, interactive: false }).addTo(map);

    if (storeName) {
      marker.bindTooltip(storeName, {
        permanent: true,
        direction: "top",
        offset: [0, -36],
        className: "static-map-tooltip",
      });
    }

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [lat, lng, storeName]);

  return (
    <div
      ref={mapRef}
      className={`w-full rounded-xl border border-border/60 overflow-hidden ${className || "h-56 sm:h-64"}`}
    />
  );
}
