import { urlFor } from "@/sanity/lib/image";
import { PAGE_QUERYResult, POST_QUERYResult } from "@/sanity.types";
import { Metadata } from "next";

const isProduction = process.env.NEXT_PUBLIC_SITE_ENV === "production";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://apis.guru";

export function generatePageMetadata({
  page,
  slug,
}: {
  page: PAGE_QUERYResult | POST_QUERYResult;
  slug: string;
}) {
  const canonicalUrl = `${siteUrl}/${slug === "index" ? "" : slug}`;

  return {
    title: page?.meta_title,
    description: page?.meta_description,
    openGraph: {
      images: [
        {
          url: page?.ogImage
            ? urlFor(page?.ogImage).quality(100).url()
            : `${siteUrl}/images/og-image.jpg`,
          width: page?.ogImage?.asset?.metadata?.dimensions?.width || 1200,
          height: page?.ogImage?.asset?.metadata?.dimensions?.height || 630,
        },
      ],
      locale: "en_US",
      type: "website",
      url: canonicalUrl,
    },
    robots: !isProduction
      ? "noindex, nofollow"
      : page?.noindex
        ? "noindex"
        : "index, follow",
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export function generateSimpleMetadata({
  title,
  description,
  slug,
}: {
  title: string;
  description: string;
  slug: string;
}): Metadata {
  const canonicalUrl = `${siteUrl}/${slug === "" ? "" : slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      locale: "en_US",
      images: [
        {
          url: `${siteUrl}/images/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${siteUrl}/images/og-image.jpg`],
    },
    robots: !isProduction ? "noindex, nofollow" : "index, follow",
    alternates: {
      canonical: canonicalUrl,
    },
  };
}
