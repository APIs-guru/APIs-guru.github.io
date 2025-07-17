import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ApiCardModel } from "../../../models/ApiCardModel";
import DescriptionSection from "../../../components/DescriptionSection";
import list from "../../../list.json";
import { marked } from "marked";

import { Metadata, ResolvingMetadata } from "next";

interface ApiVersion {
  version: string;
  swaggerUrl: string;
  swaggerYamlUrl: string;
}
function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/(\*\*|__)(.*?)\1/g, "$2") // Remove bold
    .replace(/(\*|_)(.*?)\1/g, "$2") // Remove italic
    .replace(/#{1,6}\s/g, "") // Remove headers
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1") // Remove links
    .replace(/!\[([^\]]*)\]\([^\)]+\)/g, "$1") // Remove image alt text
    .replace(/`{1,3}([^`]+)`{1,3}/g, "$1") // Remove code
    .replace(/(\n\s*){2,}/g, "\n\n") // Normalize newlines
    .replace(/^\s+|\s+$/g, ""); // Trim whitespace
}

export async function generateStaticParams() {
  const apiList = list as Record<string, any>;

  return Object.keys(apiList).map((key) => {
    const apiSlug = key
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    return {
      slug: apiSlug,
    };
  });
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const api = getData(slug);

  if (!api) {
    return {
      title: "API Not Found | API Directory",
      description: "The requested API was not found in the directory.",
    };
  }

  const title = `${api.info.title} | API Directory`;
  const description =
    api.cardDescriptionPlain || "Explore this API in the API Directory.";

  return {
    title,
    description,
    keywords: [
      ...(api.categories || []),
      ...(api.tags || []),
      "API",
      "developer tools",
    ],
    openGraph: {
      title,
      description,
      url: `https://apis.guru/apis/${slug}`,
      type: "website",
      images: [
        {
          url: api.logo.url || "/images/logo.svg",
          width: 1200,
          height: 630,
          alt: `${api.info.title} API logo`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [api.logo.url || "/images/logo.svg"],
    },
  };
}

function getData(slug: string): any | null {
  const apiList = list as Record<string, any>;

  for (const key in apiList) {
    if (apiList.hasOwnProperty(key)) {
      const api = apiList[key];
      const apiSlug = key
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      if (apiSlug === slug) {
        try {
          const versions = api.versions || {};
          const preferred = api.preferred || Object.keys(versions)[0] || "";
          const preferredVersion = versions[preferred] || {};
          const info = preferredVersion.info || {};
          const externalDocs = preferredVersion.externalDocs || {};
          const contact = info.contact || {};

          const logo = {
            url: info["x-logo"]?.url || null,
            backgroundColor: info["x-logo"]?.backgroundColor || null,
          };

          const externalUrl =
            externalDocs.url ||
            contact.url ||
            (key.indexOf(".local") < 0 ? `https://${key.split(":")[0]}` : "");

          let origUrl = "";
          if (
            info["x-origin"] &&
            Array.isArray(info["x-origin"]) &&
            info["x-origin"].length > 0
          ) {
            origUrl =
              info["x-origin"][0]?.url || preferredVersion.swaggerUrl || "";
          } else {
            origUrl = preferredVersion.swaggerUrl || "";
          }

          const categories = info["x-apisguru-categories"] || [];
          const tags = info["x-tags"] || [];

          const versionsArray = Object.entries(versions).map(
            ([version, details]: [string, any]) => ({
              version,
              swaggerUrl: details?.swaggerUrl || "",
              swaggerYamlUrl: details?.swaggerYamlUrl || "",
            })
          );

          const description = info.description || "No description available";
          const cardDescription = marked(description);
          const cardDescriptionPlain = stripMarkdown(description);

          return {
            name: key,
            preferred: api.preferred || "",
            info,
            api: {
              swaggerUrl: preferredVersion.swaggerUrl || "",
              swaggerYamlUrl: preferredVersion.swaggerYamlUrl || "",
            },
            logo,
            externalUrl,
            origUrl,
            versions: versionsArray,
            cardDescription,
            cardDescriptionPlain,
            categories,
            tags,
            integrations: api.integrations || [],
          };
        } catch (error) {
          console.error(`Error processing API ${key}:`, error);
          return null;
        }
      }
    }
  }
  console.warn(`No API found for slug: ${slug}`);
  return null;
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const api = getData(slug);

  if (!api) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Link
          href="/"
          className="text-[#388c9a] hover:underline mb-4 inline-block"
        >
          ← Back to APIs
        </Link>
        <div>API not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Link
        href="/"
        className="text-[#388c9a] hover:underline mb-4 inline-block"
      >
        ← Back to APIs
      </Link>

      {/* Header with logo and buttons */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {/* Logo Section */}
        <div className="flex-shrink-0">
          <Image
            src={api.logo.url || "/assets/images/no-logo.svg"}
            alt={`${api.info.title} API logo`}
            width={200}
            height={200}
            className="max-w-full max-h-[200px] p-[10px]"
            style={{
              backgroundColor: api.logo.backgroundColor || "transparent",
            }}
          />
        </div>

        <div className="flex-grow">
          <h1 className="text-3xl font-bold text-[#388c9a] mb-2">
            {api.externalUrl ? (
              <Link
                href={api.externalUrl}
                target="_blank"
                className="hover:underline  text-decoration-line:none text-[#388c9a]"
              >
                {api.info.title}
              </Link>
            ) : (
              api.info.title
            )}
          </h1>

          <h3 className="text-lg mb-4">Preferred Version: {api.preferred}</h3>

          <div className="flex flex-wrap gap-3 mb-6">
            <Link
              href={api.api.swaggerUrl}
              target="_blank"
              className="py-2 px-4 bg-[#388c9a] rounded text-white hover:bg-[#2a6b77]"
            >
              JSON
            </Link>
            <Link
              href={api.api.swaggerYamlUrl}
              target="_blank"
              className="py-2 px-4 bg-[#388c9a] rounded text-white hover:bg-[#2a6b77]"
            >
              YAML
            </Link>
            <Link
              href={api.origUrl}
              target="_blank"
              className="py-2 px-4 bg-[#388c9a] rounded text-white hover:bg-[#2a6b77]"
            >
              Original
            </Link>
            <Link
              href={`https://redocly.github.io/redoc/?url=${api.api.swaggerUrl}`}
              target="_blank"
              className="py-2 px-4 bg-[#388c9a] rounded text-white hover:bg-[#2a6b77]"
            >
              Documentation
            </Link>
          </div>

          {/* Tools */}
          {api.integrations && api.integrations.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3">Tools</h4>
              <div className="flex flex-wrap gap-2">
                {api.integrations.map((integration: any, index: any) => (
                  <Link
                    key={index}
                    href={integration.template}
                    target="_blank"
                    className="py-1 px-3 bg-gray-600 rounded text-white text-sm hover:bg-gray-700"
                  >
                    {integration.text}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <DescriptionSection description={api.cardDescription} />

      {api.versions && api.versions.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">All Versions</h2>
          <div className="space-y-4">
            {api.versions
              .reverse()
              .map((version: ApiVersion, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded"
                >
                  <span className="font-semibold">{version.version}</span>
                  <div className="flex gap-2">
                    <Link
                      href={version.swaggerUrl}
                      target="_blank"
                      className="py-1 px-3 bg-[#388c9a] rounded text-white text-sm hover:bg-[#2a6b77]"
                    >
                      JSON
                    </Link>
                    <Link
                      href={version.swaggerYamlUrl}
                      target="_blank"
                      className="py-1 px-3 bg-[#388c9a] rounded text-white text-sm hover:bg-[#2a6b77]"
                    >
                      YAML
                    </Link>
                    <Link
                      href={`https://redocly.github.io/redoc/?url=${version.swaggerUrl}`}
                      target="_blank"
                      className="py-1 px-3 bg-[#388c9a] rounded text-white text-sm hover:bg-[#2a6b77]"
                    >
                      Docs
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
