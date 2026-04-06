"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

// Reuse the service request wizard — it handles auth and form state
const ServiceRequestPage = dynamic(
  () => import("@/app/service-request/page"),
  { loading: () => <div className="py-16 text-center text-gray-500">Loading...</div> }
);

export default function CoordinatorRequestPage() {
  return (
    <Suspense fallback={<div className="py-16 text-center text-gray-500">Loading...</div>}>
      <ServiceRequestPage />
    </Suspense>
  );
}
