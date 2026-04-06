"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const navLinks = [
  { href: "/search", label: "Find Services" },
  { href: "/providers", label: "For Business" },
  { href: "/blog", label: "Blog" },
];

export function Header() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isProvider =
    session?.user?.role === "PROVIDER_ADMIN" ||
    session?.user?.role === "PROVIDER_STAFF";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-blue-600">
          NDIS Directory
        </Link>

        {/* Center nav — hidden on mobile */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button className="relative flex h-9 w-9 items-center justify-center rounded-full outline-none hover:bg-gray-100">
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={session.user.image ?? undefined}
                        alt={session.user.name ?? ""}
                      />
                      <AvatarFallback className="bg-blue-100 text-sm font-medium text-blue-700">
                        {getInitials(session.user.name ?? "U")}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                }
              />
              <DropdownMenuContent align="end" className="w-48">
                {isProvider && (
                  <DropdownMenuItem
                    render={<Link href="/dashboard">Dashboard</Link>}
                  />
                )}
                <DropdownMenuItem
                  render={<Link href="/settings">Settings</Link>}
                />
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-red-600"
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link
                href="/login"
                className={cn(buttonVariants({ variant: "ghost" }))}
              >
                Login
              </Link>
              <Link
                href="/register"
                className={cn(
                  buttonVariants(),
                  "bg-blue-600 text-white hover:bg-blue-700"
                )}
              >
                Register
              </Link>
            </div>
          )}

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <button className="inline-flex h-9 w-9 items-center justify-center rounded-lg outline-none hover:bg-gray-100 md:hidden">
                  {mobileOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </button>
              }
            />
            <SheetContent side="right" className="w-72">
              <nav className="mt-8 flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-lg font-medium text-gray-700 hover:text-gray-900"
                  >
                    {link.label}
                  </Link>
                ))}
                {!session?.user && (
                  <>
                    <hr className="my-2 border-gray-200" />
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="text-lg font-medium text-gray-700"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileOpen(false)}
                      className="text-lg font-medium text-blue-600"
                    >
                      Register
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
