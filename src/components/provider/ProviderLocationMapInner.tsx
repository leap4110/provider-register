"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
} from "react-leaflet";
import "@/lib/leaflet-setup";

interface ProviderLocationMapInnerProps {
  latitude: number;
  longitude: number;
  hideExactAddress?: boolean;
  providerName: string;
}

export function ProviderLocationMapInner({
  latitude,
  longitude,
  hideExactAddress = false,
  providerName,
}: ProviderLocationMapInnerProps) {
  const zoom = hideExactAddress ? 12 : 14;

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={zoom}
      scrollWheelZoom={false}
      zoomControl={true}
      dragging={true}
      className="h-full w-full"
      style={{ minHeight: "224px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {hideExactAddress ? (
        // Approximate location — show circle
        <Circle
          center={[latitude, longitude]}
          radius={1500}
          pathOptions={{
            color: "#2563EB",
            fillColor: "#3B82F6",
            fillOpacity: 0.1,
            weight: 2,
          }}
        />
      ) : (
        // Exact location — show pin
        <Marker position={[latitude, longitude]} />
      )}
    </MapContainer>
  );
}
