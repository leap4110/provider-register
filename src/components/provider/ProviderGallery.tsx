"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface Photo {
  id: string;
  url: string;
  alt: string | null;
}

interface ProviderGalleryProps {
  photos: Photo[];
  providerName: string;
}

export function ProviderGallery({ photos, providerName }: ProviderGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-3 gap-3">
        {photos.map((photo, i) => (
          <button
            key={photo.id}
            onClick={() => setSelectedIndex(i)}
            className="relative aspect-square overflow-hidden rounded-lg transition-opacity hover:opacity-90"
          >
            <Image
              src={photo.url}
              alt={photo.alt || `Photo of ${providerName}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>

      <Dialog
        open={selectedIndex !== null}
        onOpenChange={(open) => !open && setSelectedIndex(null)}
      >
        <DialogContent className="max-w-3xl overflow-hidden p-0">
          {selectedIndex !== null && (
            <div className="relative">
              <div className="relative aspect-video bg-black">
                <Image
                  src={photos[selectedIndex].url}
                  alt={photos[selectedIndex].alt || `Photo of ${providerName}`}
                  fill
                  className="object-contain"
                />
              </div>

              <button
                onClick={() => setSelectedIndex(null)}
                className="absolute right-3 top-3 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70"
              >
                <X className="h-5 w-5" />
              </button>

              {photos.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedIndex(
                        (selectedIndex - 1 + photos.length) % photos.length
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedIndex((selectedIndex + 1) % photos.length)
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
                    {selectedIndex + 1} / {photos.length}
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
