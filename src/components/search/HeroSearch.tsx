"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LocationPicker } from "@/components/search/LocationPicker";

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [postcode, setPostcode] = useState("");
  const [locationInfo, setLocationInfo] = useState<{
    suburb: string;
    state: string;
  } | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (postcode) params.set("postcode", postcode);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-8 max-w-2xl rounded-xl bg-white p-6 shadow-2xl"
    >
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by service, provider, or keyword..."
          className="h-12 rounded-lg border-gray-300 pl-10 text-base focus:ring-blue-500"
        />
      </div>
      <div className="mt-3">
        <LocationPicker
          postcode={postcode}
          onPostcodeChange={setPostcode}
          onLocationResolved={(data) =>
            setLocationInfo({ suburb: data.suburb, state: data.state })
          }
        />
      </div>
      <Button
        type="submit"
        className="mt-3 h-11 w-full rounded-lg bg-blue-600 font-medium text-white hover:bg-blue-700"
      >
        <Search className="mr-2 h-4 w-4" />
        Search
      </Button>
    </form>
  );
}
