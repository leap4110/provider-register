import { useState, useCallback } from "react";

interface GeolocationResult {
  latitude: number | null;
  longitude: number | null;
  postcode: string | null;
  suburb: string | null;
  state: string | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation() {
  const [result, setResult] = useState<GeolocationResult>({
    latitude: null,
    longitude: null,
    postcode: null,
    suburb: null,
    state: null,
    error: null,
    loading: false,
  });

  const requestLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setResult((prev) => ({
        ...prev,
        error: "Geolocation is not supported by your browser",
      }));
      return;
    }

    setResult((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const response = await fetch(
            `/api/geo/reverse-geocode?lat=${position.coords.latitude}&lng=${position.coords.longitude}`
          );
          const data = await response.json();

          if (!response.ok)
            throw new Error(data.error || "Failed to resolve location");

          setResult({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            postcode: data.postcode,
            suburb: data.suburb,
            state: data.state,
            error: null,
            loading: false,
          });
        } catch {
          setResult((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error:
              "Could not determine your suburb. Please enter your postcode manually.",
            loading: false,
          }));
        }
      },
      (error) => {
        let message = "Unable to retrieve your location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message =
              "Location permission denied. Please enable location access or enter your postcode manually.";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            message = "Location request timed out. Please try again.";
            break;
        }
        setResult((prev) => ({ ...prev, error: message, loading: false }));
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }, []);

  return { ...result, requestLocation };
}
