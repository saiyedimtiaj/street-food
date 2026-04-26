"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface MapPickerProps {
  lat: number;
  lng: number;
  onLocationSelect: (lat: number, lng: number) => void;
}

export function MapPicker({ lat, lng, onLocationSelect }: MapPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [lat, lng],
      zoom: 15,
      zoomControl: false,
    });

    L.control.zoom({ position: "bottomright" }).addTo(map);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
    }).addTo(map);

    const icon = L.divIcon({
      html: `<div style="background:#f97316;border:2px solid #fff;border-radius:50%;width:32px;height:32px;display:flex;align-items:center;justify-content:center;box-shadow:0 0 12px rgba(249,115,22,0.5)"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg></div>`,
      className: "",
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

    const marker = L.marker([lat, lng], { icon, draggable: true }).addTo(map);

    marker.on("dragend", () => {
      const pos = marker.getLatLng();
      onLocationSelect(pos.lat, pos.lng);
    });

    map.on("click", (e: L.LeafletMouseEvent) => {
      marker.setLatLng(e.latlng);
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;
    setReady(true);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!ready || !mapInstanceRef.current || !markerRef.current) return;
    mapInstanceRef.current.setView([lat, lng], mapInstanceRef.current.getZoom());
    markerRef.current.setLatLng([lat, lng]);
  }, [lat, lng, ready]);

  return (
    <div
      ref={mapRef}
      className="h-64 w-full rounded-xl border border-border/60 overflow-hidden sm:h-72 lg:h-80"
    />
  );
}
