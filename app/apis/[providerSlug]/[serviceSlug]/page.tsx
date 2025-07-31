import React from "react";
import Link from "next/link";
import Image from "next/image";
import { marked } from "marked";
import { Metadata, ResolvingMetadata } from "next";
import DescriptionSection from "../../../../components/DescriptionSection";
import list from "../../../../list.json";
import { Badge } from "@/components/ui/badge";
import { JsonTree } from "@/components/JsonTree";
import ApiButtons from "@/components/ApiButtons";

interface ApiVersion {
  version: string;
  swaggerUrl: string;
  swaggerYamlUrl: string;
}

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

  for (const key in apiList) {
    if (apiList.hasOwnProperty(key) && key === targetKey) {
      try {
        const api = apiList[key];
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
  console.warn(
    `No API found for provider: ${providerSlug}, service: ${serviceSlug}`
  );
  return null;
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

  console.log("Generated static params:", params);
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

  let jsonData: any = null;
  let error: string | null = null;

  if (api?.api.swaggerUrl) {
    try {
      const response = await fetch(api.api.swaggerUrl, {
        cache: "force-cache",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch OpenAPI JSON");
      }
      jsonData = await response.json();
    } catch (err) {
      console.error("Error fetching OpenAPI JSON:", err);
      error = "Unable to load OpenAPI JSON";
    }
  } else {
    error = "No Swagger URL available";
  }

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
      {/* <Link
        href="/"
        className="text-[#388c9a] hover:underline mb-4 inline-block"
      >
        ← Back to APIs
      </Link> */}

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="flex-shrink-0">
          <Image
            src={api.logo.url}
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
          <div className="text-3xl font-bold text-[#388c9a] mb-2 gap-6 flex items-center">
            {api.externalUrl ? (
              <Link
                href={api.externalUrl}
                target="_blank"
                className="hover:underline text-decoration-line:none text-[#388c9a]"
              >
                {api.info.title}
              </Link>
            ) : (
              api.info.title
            )}
            <Badge variant="outline" className="text-sm">
              <span className="text-sm text-gray-500">OpenAPI / Swagger</span>
            </Badge>
          </div>

          <h3 className="text-lg mb-4">Preferred Version: {api.preferred}</h3>

          <div className="relative flex flex-wrap gap-3 mb-6">
            <div className="flex flex-wrap gap-3">
              <ApiButtons
                swaggerUrl={api.api.swaggerUrl}
                swaggerYamlUrl={api.api.swaggerYamlUrl}
                origUrl={api.origUrl}
                title={api.info.title}
              />
            </div>
          </div>
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

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">OpenAPI/Swagger JSON</h2>
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <JsonTree jsonData={jsonData} />
        )}
      </div>

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
                    <ApiButtons
                      swaggerUrl={version.swaggerUrl}
                      swaggerYamlUrl={version.swaggerYamlUrl}
                      origUrl={`https://redocly.github.io/redoc/?url=${version.swaggerUrl}`}
                      title={`${api.info.title}-v${version.version}`}
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
