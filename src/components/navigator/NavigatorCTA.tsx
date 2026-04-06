"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface NavigatorCTAProps {
  categorySlug: string;
  categoryName: string;
}

export function NavigatorCTA({ categorySlug, categoryName }: NavigatorCTAProps) {
  const router = useRouter();
  const [postcode, setPostcode] = useState("");

  function handleSearch() {
    const params = new URLSearchParams({ category: categorySlug });
    if (postcode) params.set("postcode", postcode);
    router.push(`/search?${params.toString()}`);
  }

  return (
    <div className="mt-3 flex items-center gap-2">
      <Input
        value={postcode}
        onChange={(e) => setPostcode(e.target.value.replace(/\D/g, "").slice(0, 4))}
        placeholder="Postcode"
        inputMode="numeric"
        maxLength={4}
        className="h-10 w-32"
      />
      <Button
        onClick={handleSearch}
        className="bg-blue-600 text-white hover:bg-blue-700"
      >
        Search {categoryName} Providers →
      </Button>
    </div>
  );
}
