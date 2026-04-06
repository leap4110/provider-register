import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const user = req.auth?.user;

  // Protect /dashboard routes — require PROVIDER_ADMIN or PROVIDER_STAFF
  if (pathname.startsWith("/dashboard")) {
    if (!user) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const role = user.role;
    if (role !== "PROVIDER_ADMIN" && role !== "PROVIDER_STAFF") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Protect /connect routes — require SUPPORT_COORDINATOR
  if (pathname.startsWith("/connect")) {
    if (!user) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (user.role !== "SUPPORT_COORDINATOR") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/connect/:path*"],
};
