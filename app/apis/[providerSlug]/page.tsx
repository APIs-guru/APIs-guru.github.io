import React from "react";
import Link from "next/link";
import list from "../../../list.json";

import ApiPage, { getData } from "./[serviceSlug]/page";
import SearchClientComponent from "@/components/SearchClientComponent";

interface Api {
  name: string;
  providerName: string;
  serviceName?: string;
  title: string;
  description: string;
  logo?: { url: string; backgroundColor?: string };
  preferredVersion: string;
}

function getProviderApis(providerSlug: string): Api[] {
  const apiList = list as Record<string, any>;
  const apis: Api[] = [];

  for (const key in apiList) {
    if (Object.prototype.hasOwnProperty.call(apiList, key)) {
      const [provider, service] = key.split(":");
      const normalizedProviderSlug = provider
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      if (normalizedProviderSlug === providerSlug) {
        const api = apiList[key];
        const preferred =
          api.preferred ||
          (api.versions ? Object.keys(api.versions)[0] : "") ||
          "";
        const preferredVersion = api.versions?.[preferred] || {};
        const info = preferredVersion.info || {};

        apis.push({
          name: key,
          providerName: provider,
          serviceName: service,
          title: info.title || key,
          description: info.description || "No description available",
          logo: info["x-logo"] || { url: "/assets/images/no-logo.svg" },
          preferredVersion: preferred,
        });
      }
    }
  }

  return apis;
}

export function generateStaticParams() {
  const apiList = list as Record<string, any>;
  const providerSlugs = new Set<string>();

  for (const key in apiList) {
    if (Object.prototype.hasOwnProperty.call(apiList, key)) {
      const [provider] = key.split(":");
      if (!provider) {
        console.warn(`Invalid key format: ${key}`);
        continue;
      }
      const providerSlug = provider
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      providerSlugs.add(providerSlug);
    }
  }

  const params = Array.from(providerSlugs).map((providerSlug) => ({
    providerSlug,
  }));
  return params;
}
export default async function ProviderPage({
  params,
}: {
  params: Promise<{ providerSlug: string }>;
}) {
  const { providerSlug } = await params;
  const apis = getProviderApis(providerSlug);

  if (apis.length === 0) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Link
          href="/"
          className="text-[#388c9a] hover:underline mb-4 inline-block"
        >
          ← Back to APIs
        </Link>
        <div>Provider not found</div>
      </div>
    );
  }

  const services = apis.filter((api) => api.serviceName);
  if (services.length > 0) {
    return (
      <div className="container mx-auto px-4 py-4 relative h-screen">
        <SearchClientComponent
          repoStarCounts={{}}
          providerSlug={providerSlug}
        />
      </div>
    );
  } else {
    return (
      <ApiPage params={Promise.resolve({ providerSlug, serviceSlug: null })} />
    );
  }
}
