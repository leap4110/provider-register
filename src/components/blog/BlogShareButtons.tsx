"use client";

import { Link2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function BlogShareButtons({ title }: { title: string }) {
  function copyLink() {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied!");
  }

  function shareWindow(url: string) {
    window.open(url, "_blank", "width=600,height=400");
  }

  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-gray-700">
        Share this article
      </p>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={copyLink}>
          <Link2 className="mr-1.5 h-4 w-4" /> Copy Link
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            shareWindow(
              `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`
            )
          }
        >
          LinkedIn
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            shareWindow(
              `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(title)}`
            )
          }
        >
          X
        </Button>
      </div>
    </div>
  );
}
