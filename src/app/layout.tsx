import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { Toaster } from "@/components/ui/sonner";
import { SkipToContent } from "@/components/layout/SkipToContent";
import { TestDataBanner } from "@/components/layout/TestDataBanner";
import { JsonLd } from "@/components/seo/JsonLd";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "NDIS Provider Directory — Find Disability Services Near You",
  description:
    "Search and connect with NDIS service providers across Australia. Compare providers, read reviews, and find the right disability support services for your needs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <SkipToContent />
        <TestDataBanner />
        <SessionProvider>
          <Header />
          <main id="main-content" role="main" className="flex-1">
            {children}
          </main>
          <Footer />
          <Toaster />
        </SessionProvider>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "NDIS Provider Directory",
            url: process.env.NEXT_PUBLIC_APP_URL || "https://yourdomain.com.au",
            description:
              "Find and compare NDIS disability service providers with ratings, reviews, and compliance information.",
          }}
        />
      </body>
    </html>
  );
}
