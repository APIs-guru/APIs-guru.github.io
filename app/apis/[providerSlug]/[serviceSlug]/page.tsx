import React from "react";
import Link from "next/link";
import Image from "next/image";
import { marked } from "marked";
import { Metadata, ResolvingMetadata } from "next";
import DescriptionSection from "../../../../components/DescriptionSection";
import list from "../../../../list.json";
import { Badge } from "@/components/ui/badge";
import JsonTreeContainer, { JsonTree } from "@/components/JsonTree";
import ApiButtons from "@/components/ApiButtons";
import VisitCounter from "@/components/VisitCounter";
import type { ApiVersion } from "@/types/api";
import { ExternalLink } from "lucide-react";

function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    .replace(/#{1,6}\s/g, "")
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
    .replace(/!\[([^\]]*)\]\([^\)]+\)/g, "$1")
    .replace(/`{1,3}([^`]+)`{1,3}/g, "$1")
    .replace(/(\n\s*){2,}/g, "\n\n")
    .replace(/^\s+|\s+$/g, "");
}
export function getData(
  providerSlug: string,
  serviceSlug?: string | null
): any | null {
  const apiList = list as Record<string, any>;

  const targetKey = serviceSlug
    ? `${providerSlug}:${serviceSlug}`
    : providerSlug;

  if (apiList[targetKey]) {
    return processApiData(targetKey, apiList[targetKey]);
  }

  for (const key in apiList) {
    if (
      apiList.hasOwnProperty(key) &&
      key.toLowerCase() === targetKey.toLowerCase()
    ) {
      return processApiData(key, apiList[key]);
    }
  }

  console.warn(
    `No API found for provider: ${providerSlug}, service: ${serviceSlug}`
  );
  return null;
}

function processApiData(key: string, api: any) {
  try {
    const versions = api.versions || {};
    const preferred = api.preferred || Object.keys(versions)[0] || "";
    const preferredVersion = versions[preferred] || {};
    const info = preferredVersion.info || {};
    const externalDocs = preferredVersion.externalDocs || {};
    const contact = info.contact || {};

    const logo = {
      url: info["x-logo"]?.url || "/assets/images/no-logo.svg",
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
      origUrl = info["x-origin"][0]?.url || preferredVersion.swaggerUrl || "";
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
      updated: preferredVersion.updated || "",
    };
  } catch (error) {
    console.error(`Error processing API ${key}:`, error);
    return null;
  }
}

export async function generateStaticParams() {
  const apiList = list as Record<string, any>;
  const params: { providerSlug: string; serviceSlug: string }[] = [];

  for (const key in apiList) {
    if (Object.prototype.hasOwnProperty.call(apiList, key)) {
      const [provider, service] = key.split(":");
      const providerSlug = provider.toLowerCase();
      const serviceSlug = service ? service.toLowerCase() : providerSlug;

      params.push({
        providerSlug,
        serviceSlug,
      });
    }
  }

  return params;
}

export async function generateMetadata(
  {
    params,
  }: { params: Promise<{ providerSlug: string; serviceSlug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { providerSlug, serviceSlug } = await params;
  const api = getData(providerSlug, serviceSlug);

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
      url: `/apis/${providerSlug}/${serviceSlug}`,
      type: "website",
      images: [
        {
          url: api.logo.url,
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
      images: [api.logo.url],
    },
  };
}

export default async function ApiPage({
  params,
}: {
  params: Promise<{ providerSlug: string; serviceSlug: string | null }>;
}) {
  const { providerSlug, serviceSlug } = await params;
  const api = getData(providerSlug, serviceSlug);

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
    <div className="container mx-auto p-6 max-w-6xl">
      <VisitCounter providerSlug={providerSlug} serviceSlug={serviceSlug} />

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="flex-shrink-0">
          <div className="bg-white rounded-lg px-6 ">
            <Image
              src={api.logo.url}
              alt={`${api.info.title} API logo`}
              width={200}
              height={200}
              className="max-w-full max-h-[200px] mx-auto"
              style={{
                backgroundColor: api.logo.backgroundColor || "transparent",
              }}
            />
          </div>
        </div>

        <div className="flex-grow">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              {api.externalUrl ? (
                <Link
                  href={api.externalUrl}
                  target="_blank"
                  className="hover:text-[#388c9a] transition-colors duration-200"
                >
                  {api.info.title}
                </Link>
              ) : (
                api.info.title
              )}
            </h1>

            <p className="text-lg text-gray-600 mb-4">
              Last updated:{" "}
              {new Date(api.updated).toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>

            <div className="mb-6">
              <ApiButtons
                swaggerUrl={api.api.swaggerUrl}
                title={api.info.title}
              />
            </div>
          </div>

          {api.integrations && api.integrations.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Available Tools
              </h3>
              <div className="flex flex-wrap gap-3">
                {api.integrations.map((integration: any, index: any) => (
                  <Link
                    key={index}
                    href={integration.template}
                    target="_blank"
                    className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors duration-200 text-sm font-medium"
                  >
                    {integration.text}
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <DescriptionSection description={api.cardDescription} />

      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">
          OpenAPI Specification
        </h2>
        <JsonTreeContainer
          swaggerUrl={api.api.swaggerUrl}
          swaggerYamlUrl={api.api.swaggerYamlUrl}
          title={api.info.title}
        />
      </div>

      {api.versions && api.versions.length > 0 && (
        <div>
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            All Versions
          </h2>
          <div className="space-y-4">
            {api.versions
              .reverse()
              .map((version: ApiVersion, index: number) => (
                <div
                  key={index}
                  className="bg-white border rounded-lg p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Version {version.version}
                    </h3>
                    <ApiButtons
                      swaggerUrl={version.swaggerUrl}
                      title={api.info.title}
                      version={version.version}
                    />
                  </div>

                  <div className="mb-4">
                    <h4 className="text-lg font-medium mb-3 text-gray-800">
                      OpenAPI Specification
                    </h4>
                    <JsonTreeContainer
                      swaggerUrl={version.swaggerUrl}
                      swaggerYamlUrl={version.swaggerYamlUrl}
                      title={api.info.title}
                      version={version.version}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
