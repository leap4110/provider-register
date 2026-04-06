"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DashboardSidebar } from "./DashboardSidebar";

export function DashboardMobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b bg-white px-4 py-3 lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger
          render={
            <button className="inline-flex items-center gap-2 rounded-lg p-2 hover:bg-gray-100">
              <Menu className="h-5 w-5" />
              <span className="text-sm font-medium">Menu</span>
            </button>
          }
        />
        <SheetContent side="left" className="w-72 p-0">
          <div onClick={() => setOpen(false)}>
            <DashboardSidebar />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
