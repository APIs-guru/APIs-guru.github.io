import { generateSimpleMetadata } from "@/sanity/lib/metadata";
import ApiDocClient from "./ApiDocClient";

export async function generateMetadata() {
  return generateSimpleMetadata({
    title: "API Documentation",
    description:
      "Interactive API documentation for the APIs.guru REST API. Explore endpoints and test API calls.",
    slug: "api-doc",
  });
}

export default function ApiDocPage() {
  return <ApiDocClient />;
}
