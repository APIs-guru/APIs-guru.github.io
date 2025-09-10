import React from "react";
import SearchClientComponent from "@/components/SearchClientComponent";
import { generateSimpleMetadata } from "@/sanity/lib/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return generateSimpleMetadata({
    title: "APIs.guru - Wikipedia for Web APIs",
    description:
      "Wikipedia for Web APIs. Directory of REST API specs in OpenAPI 3.0 format",
    slug: "",
  });
}

export default async function Home() {
  return (
    <div className="container mx-auto px-4 py-4 relative">
      <div className="relative z-10">
        <SearchClientComponent />
      </div>
    </div>
  );
}
