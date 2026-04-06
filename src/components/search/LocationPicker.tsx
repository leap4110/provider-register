"use client";

import { useEffect } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGeolocation } from "@/hooks/useGeolocation";

interface LocationPickerProps {
  postcode: string;
  onPostcodeChange: (postcode: string) => void;
  onLocationResolved?: (data: {
    postcode: string;
    suburb: string;
    state: string;
  }) => void;
  compact?: boolean;
}

export function LocationPicker({
  postcode,
  onPostcodeChange,
  onLocationResolved,
  compact = false,
}: LocationPickerProps) {
  const geo = useGeolocation();

  // When geolocation resolves, update postcode
  useEffect(() => {
    if (geo.postcode) {
      onPostcodeChange(geo.postcode);
      if (geo.suburb && geo.state) {
        onLocationResolved?.({
          postcode: geo.postcode,
          suburb: geo.suburb,
          state: geo.state,
        });
      }
    }
  }, [geo.postcode, geo.suburb, geo.state, onPostcodeChange, onLocationResolved]);

  return (
    <div>
      <div className="flex items-center gap-2">
        <Input
          value={postcode}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "").slice(0, 4);
            onPostcodeChange(val);
          }}
          placeholder="Postcode"
          inputMode="numeric"
          maxLength={4}
          className={compact ? "h-10 w-32 rounded-lg" : "h-10 w-36 rounded-lg"}
        />
        <Button
          type="button"
          variant="outline"
          size={compact ? "sm" : "default"}
          onClick={geo.requestLocation}
          disabled={geo.loading}
          className="shrink-0 border-blue-300 text-blue-600 hover:bg-blue-50"
        >
          {geo.loading ? (
            <>
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              Locating...
            </>
          ) : (
            <>
              <MapPin className="mr-1.5 h-4 w-4" />
              Use my location
            </>
          )}
        </Button>
      </div>
      {geo.suburb && geo.state && !geo.error && (
        <p className="mt-1 text-xs text-green-600">
          Located: {geo.suburb}, {geo.state}
        </p>
      )}
      {geo.error && <p className="mt-1 text-xs text-red-500">{geo.error}</p>}
    </div>
  );
}
