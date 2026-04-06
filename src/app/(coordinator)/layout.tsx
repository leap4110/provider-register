import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Header } from "@/components/layout/Header";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { Toaster } from "@/components/ui/sonner";
import { CoordinatorBar } from "@/components/coordinator/CoordinatorBar";

export default async function CoordinatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?redirect=/connect");
  }

  if (session.user.role !== "SUPPORT_COORDINATOR") {
    redirect("/");
  }

  return (
    <SessionProvider>
      <Header />
      <CoordinatorBar userName={session.user.name || "Coordinator"} />
      <main className="flex-1">{children}</main>
      <Toaster />
    </SessionProvider>
  );
}
