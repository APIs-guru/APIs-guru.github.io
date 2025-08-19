import Blocks from "@/components/blocks";
import { fetchSanityPageBySlug } from "@/sanity/lib/fetch";
import { generatePageMetadata } from "@/sanity/lib/metadata";
import MissingSanityPage from "@/components/ui/missing-sanity-page";

export async function generateMetadata() {
  const page = await fetchSanityPageBySlug({ slug: "blog" });

  return generatePageMetadata({ page, slug: "blog" });
}

export default async function IndexPage() {
  const page = await fetchSanityPageBySlug({ slug: "blog" });

  if (!page) {
    return MissingSanityPage({ document: "page", slug: "blog" });
  }

  return <Blocks blocks={page?.blocks ?? []} />;
}
