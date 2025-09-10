import { notFound } from "next/navigation";

import PostHero from "@/components/blocks/post-hero";
import RecentArticles from "@/components/blocks/recent-articles";

import PortableTextRenderer from "@/components/portable-text-renderer";
import {
  fetchSanityPostBySlug,
  fetchSanityPostsStaticParams,
} from "@/sanity/lib/fetch";
import { generatePageMetadata } from "@/sanity/lib/metadata";

export async function generateStaticParams() {
  const posts = await fetchSanityPostsStaticParams();

  return posts.map((post) => ({
    slug: post.slug?.current,
  }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const post = await fetchSanityPostBySlug({ slug: params.slug });

  if (!post) {
    notFound();
  }

  return generatePageMetadata({ page: post, slug: `blog/${params.slug}` });
}

export default async function PostPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const post = await fetchSanityPostBySlug(params);

  if (!post) {
    notFound();
  }

  return (
    <section>
      <div className="container py-16 xl:py-20">
        <article className="max-w-3xl mx-auto">
          <PostHero {...post} />
          {post.body && <PortableTextRenderer value={post.body} />}
        </article>
        <RecentArticles currentSlug={params.slug} />
      </div>
    </section>
  );
}
