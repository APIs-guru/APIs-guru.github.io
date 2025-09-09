import Link from "next/link";
import PostCard from "@/components/ui/post-card";
import { fetchSanityPosts } from "@/sanity/lib/fetch";

export default async function RecentArticles({
  currentSlug,
  title = "Recent articles",
}: {
  currentSlug: string;
  title?: string;
}) {
  const posts = await fetchSanityPosts();
  const recent = posts
    .filter((p) => p?.slug?.current && p.slug.current !== currentSlug)
    .slice(0, 3);

  if (!recent.length) return null;

  return (
    <div className="mt-16 border-t pt-10">
      <h2 className="text-2xl font-semibold mb-6">{title}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {recent.map((post) => (
          <Link
            key={post?.slug?.current}
            className="flex w-full rounded-3xl ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            href={`/blog/${post?.slug?.current}`}
          >
            <PostCard
              title={post?.title ?? ""}
              excerpt={post?.excerpt ?? ""}
              image={post?.image ?? null}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
