import { MetadataRoute } from "next";
import { groq } from "next-sanity";
import { sanityFetch } from "@/sanity/lib/live";

const POSTS_PER_SITEMAP = 50000;

export async function generateSitemaps() {
  const countQuery = groq`count(*[_type == "post" && noindex != true])`;
  const { data: total } = await sanityFetch({ query: countQuery });
  const sitemapsNeeded = Math.ceil((total || 0) / POSTS_PER_SITEMAP);
  return Array.from({ length: sitemapsNeeded }, (_, index) => ({ id: index }));
}

export default async function sitemap({
  id,
}: {
  id: number;
}): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://apis.guru";

  const start = id * POSTS_PER_SITEMAP;
  const end = start + POSTS_PER_SITEMAP - 1;

  const postsQuery = groq`
    *[_type == "post" && noindex != true] | order(_updatedAt desc) [${start}..${end}]{
      "url": $baseUrl + "/blog/" + slug.current,
      "lastModified": _updatedAt,
      "changeFrequency": "daily",
      "priority": 0.7
    }
  `;

  const { data } = await sanityFetch({
    query: postsQuery,
    params: { baseUrl },
  });

  return data;
}
