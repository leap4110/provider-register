import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";

interface UserLocation {
  latitude: number;
  longitude: number;
  city: string | null;
  state: string | null;
  postcode: string | null;
  source: "ip" | "gps" | "fallback";
}

export function useUserLocation() {
  const [preciseLocation, setPreciseLocation] = useState<UserLocation | null>(
    null
  );
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  // Auto-fetch IP-based location on mount (silent, no popup)
  const { data: ipLocation, isLoading: ipLoading } = useQuery({
    queryKey: ["ip-location"],
    queryFn: async () => {
      const res = await fetch("/api/geo/ip-location");
      if (!res.ok) throw new Error("IP location failed");
      return res.json() as Promise<UserLocation>;
    },
    staleTime: 60 * 60 * 1000, // 1 hour
    retry: 1,
  });

  // User-triggered precise GPS location
  const requestPreciseLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setGpsError("Geolocation is not supported by your browser");
      return;
    }

    setGpsLoading(true);
    setGpsError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const res = await fetch(
            `/api/geo/reverse-geocode?lat=${position.coords.latitude}&lng=${position.coords.longitude}`
          );
          const data = await res.json();

          setPreciseLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            city: data.suburb || null,
            state: data.state || null,
            postcode: data.postcode || null,
            source: "gps",
          });
        } catch {
          // Even if reverse geocode fails, we have the coordinates
          setPreciseLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            city: null,
            state: null,
            postcode: null,
            source: "gps",
          });
        }
        setGpsLoading(false);
      },
      (error) => {
        let message = "Unable to get your location";
        if (error.code === error.PERMISSION_DENIED) {
          message = "Location permission denied";
        }
        setGpsError(message);
        setGpsLoading(false);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  // Return the most precise location available
  const location = preciseLocation || ipLocation || null;

  return {
    location,
    isLoading: ipLoading && !preciseLocation,
    gpsLoading,
    gpsError,
    isPrecise: location?.source === "gps",
    requestPreciseLocation,
  };
}
