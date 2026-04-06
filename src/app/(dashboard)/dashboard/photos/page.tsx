"use client";

import { useState } from "react";
import Link from "next/link";
import { Camera, Upload, ImageIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDashboardProvider } from "@/components/dashboard/DashboardContext";

export default function PhotosPage() {
  const { tier } = useDashboardProvider();
  const [photos] = useState<{ id: string; url: string; alt: string }[]>([]);

  if (tier === "STARTER") {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <Camera className="h-8 w-8 text-gray-400" />
        </div>
        <h1 className="mt-4 text-xl font-bold text-gray-900">Photo Gallery</h1>
        <p className="mt-2 max-w-sm text-sm text-gray-500">
          Showcase your facilities, team, and services with a photo gallery.
          Upgrade to Accreditation Plus or Enterprise to upload photos.
        </p>
        <Link
          href="/dashboard/billing"
          className="mt-6 inline-flex h-10 items-center rounded-lg bg-blue-600 px-6 text-sm font-medium text-white hover:bg-blue-700"
        >
          View Plans
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900">Photo Gallery</h1>
      <p className="text-sm text-gray-500">
        Upload photos to showcase your facilities and services
      </p>

      {/* Upload area */}
      <div className="mt-6">
        <label
          htmlFor="photo-upload"
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-white px-6 py-12 transition-colors hover:border-blue-400 hover:bg-blue-50/50"
        >
          <Upload className="h-8 w-8 text-gray-400" />
          <p className="mt-3 text-sm font-medium text-gray-700">
            Click to upload photos
          </p>
          <p className="mt-1 text-xs text-gray-500">
            PNG, JPG up to 5MB each. Maximum 20 photos.
          </p>
          <input
            id="photo-upload"
            type="file"
            accept="image/png,image/jpeg"
            multiple
            className="hidden"
          />
        </label>
      </div>

      {/* Photo grid */}
      <div className="mt-8">
        {photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border bg-white py-16">
            <ImageIcon className="h-12 w-12 text-gray-300" />
            <p className="mt-3 text-sm text-gray-500">
              No photos uploaded yet
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Upload photos to display them on your public profile
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="group relative aspect-square overflow-hidden rounded-lg border bg-gray-100"
              >
                <img
                  src={photo.url}
                  alt={photo.alt}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <button className="rounded-full bg-white/90 p-2 text-red-600 hover:bg-white">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
