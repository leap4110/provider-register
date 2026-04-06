import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { DashboardProvider } from "@/components/dashboard/DashboardContext";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardMobileNav } from "@/components/dashboard/DashboardMobileNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?redirect=/dashboard");
  }

  const role = session.user.role;
  if (role !== "PROVIDER_ADMIN" && role !== "PROVIDER_STAFF") {
    redirect("/");
  }

  const member = await db.providerMember.findUnique({
    where: { userId: session.user.id },
    include: {
      provider: {
        select: { id: true, name: true, slug: true, logo: true, tier: true },
      },
    },
  });

  if (!member) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900">
            No provider account found
          </h1>
          <p className="mt-2 text-gray-500">Please contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardProvider provider={member.provider}>
      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        <aside className="hidden w-60 shrink-0 border-r border-gray-200 bg-white lg:block">
          <DashboardSidebar />
        </aside>

        {/* Main content */}
        <div className="flex-1">
          {/* Mobile nav */}
          <DashboardMobileNav />

          <main className="mx-auto max-w-5xl p-6 md:p-8">{children}</main>
        </div>
      </div>
    </DashboardProvider>
  );
}
