"use client";

import { useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
  useMap,
} from "react-leaflet";
import "@/lib/leaflet-setup";
import Link from "next/link";
import { StarRating } from "@/components/reviews/StarRating";

interface Provider {
  id: string;
  name: string;
  slug: string;
  latitude?: number | null;
  longitude?: number | null;
  suburb?: string | null;
  state?: string | null;
  averageRating?: number | null;
  reviewCount?: number;
  ndisRegistered?: boolean;
}

interface SearchMapInnerProps {
  providers: Provider[];
  userLocation?: { latitude: number; longitude: number } | null;
  onMapMove?: (bounds: { north: number; south: number; east: number; west: number }) => void;
}

// Sub-component to fit map bounds to providers
function FitBounds({
  providers,
  userLocation,
}: {
  providers: Provider[];
  userLocation?: { latitude: number; longitude: number } | null;
}) {
  const map = useMap();

  const boundsKey = useMemo(() => {
    const coords = providers
      .filter((p) => p.latitude && p.longitude)
      .map((p) => `${p.latitude},${p.longitude}`);
    if (userLocation) coords.push(`${userLocation.latitude},${userLocation.longitude}`);
    return coords.join("|");
  }, [providers, userLocation]);

  useEffect(() => {
    const points: [number, number][] = providers
      .filter((p) => p.latitude && p.longitude)
      .map((p) => [p.latitude!, p.longitude!]);

    if (userLocation) {
      points.push([userLocation.latitude, userLocation.longitude]);
    }

    if (points.length > 0) {
      const L = require("leaflet") as typeof import("leaflet");
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }
  }, [boundsKey, map]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}

export function SearchMapInner({
  providers,
  userLocation,
}: SearchMapInnerProps) {
  // Default center: Brisbane
  const defaultCenter: [number, number] = userLocation
    ? [userLocation.latitude, userLocation.longitude]
    : [-27.468, 153.024];

  const mappableProviders = providers.filter(
    (p) => p.latitude && p.longitude
  );

  return (
    <MapContainer
      center={defaultCenter}
      zoom={11}
      scrollWheelZoom={true}
      className="h-full w-full rounded-xl"
      style={{ minHeight: "350px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* User location circle */}
      {userLocation && (
        <CircleMarker
          center={[userLocation.latitude, userLocation.longitude]}
          radius={10}
          pathOptions={{
            color: "#2563EB",
            fillColor: "#3B82F6",
            fillOpacity: 0.3,
            weight: 2,
          }}
        >
          <Popup>
            <span className="text-sm font-medium">Your location</span>
          </Popup>
        </CircleMarker>
      )}

      {/* Provider markers */}
      {mappableProviders.map((provider) => (
        <Marker
          key={provider.id}
          position={[provider.latitude!, provider.longitude!]}
        >
          <Popup>
            <div className="min-w-[180px]">
              <Link
                href={`/provider/${provider.slug}`}
                className="font-semibold text-blue-700 hover:underline"
              >
                {provider.name}
              </Link>
              {provider.averageRating ? (
                <div className="mt-1 flex items-center gap-1">
                  <StarRating rating={provider.averageRating} size="sm" />
                  <span className="text-xs text-gray-600">
                    ({provider.reviewCount || 0})
                  </span>
                </div>
              ) : (
                <p className="mt-0.5 text-xs italic text-gray-400">
                  No reviews yet
                </p>
              )}
              {(provider.suburb || provider.state) && (
                <p className="mt-1 text-xs text-gray-500">
                  {[provider.suburb, provider.state].filter(Boolean).join(", ")}
                </p>
              )}
              {provider.ndisRegistered && (
                <span className="mt-1 inline-block rounded bg-teal-50 px-1.5 py-0.5 text-[10px] font-medium text-teal-700">
                  ✓ Registered
                </span>
              )}
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Auto-fit bounds */}
      <FitBounds providers={mappableProviders} userLocation={userLocation} />
    </MapContainer>
  );
}
