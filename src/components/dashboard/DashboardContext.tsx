"use client";

import { createContext, useContext } from "react";

interface DashboardProviderData {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  tier: string;
}

const DashboardContext = createContext<DashboardProviderData | null>(null);

export function DashboardProvider({
  provider,
  children,
}: {
  provider: DashboardProviderData;
  children: React.ReactNode;
}) {
  return (
    <DashboardContext.Provider value={provider}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboardProvider() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboardProvider must be used within DashboardProvider");
  return ctx;
}
