import { Metadata } from "next";

const SITE_NAME = "NDIS Provider Directory";
const DEFAULT_DESCRIPTION =
  "Find and compare NDIS disability service providers with ratings, reviews, and compliance information.";

export function createMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description?: string;
  path?: string;
  image?: string;
}): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const desc = description || DEFAULT_DESCRIPTION;
  const url = path
    ? `${process.env.NEXT_PUBLIC_APP_URL}${path}`
    : process.env.NEXT_PUBLIC_APP_URL;

  return {
    title: fullTitle,
    description: desc,
    openGraph: {
      title: fullTitle,
      description: desc,
      url,
      siteName: SITE_NAME,
      type: "website",
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
    },
    alternates: {
      canonical: url,
    },
  };
}
