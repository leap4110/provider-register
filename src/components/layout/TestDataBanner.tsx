"use client";

import { useState } from "react";
import { FlaskConical, X } from "lucide-react";

export function TestDataBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (process.env.NEXT_PUBLIC_SHOW_TEST_BANNER !== "true") return null;
  if (dismissed) return null;

  return (
    <div className="fixed left-0 right-0 top-0 z-[100] bg-amber-400 px-4 py-2 text-center text-sm font-medium text-amber-950">
      <div className="flex items-center justify-center gap-2">
        <FlaskConical size={16} />
        <span>
          TEST DATA — This environment contains mock data for development and
          testing purposes.
        </span>
        <button
          onClick={() => setDismissed(true)}
          className="ml-2 underline hover:no-underline"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
