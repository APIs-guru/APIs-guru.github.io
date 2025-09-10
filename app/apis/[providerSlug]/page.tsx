import React from "react";
import Link from "next/link";
import list from "../../../list.json";
import { generateSimpleMetadata } from "@/sanity/lib/metadata";

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
      const normalizedProviderSlug = provider.toLowerCase();

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
      const providerSlug = provider.toLowerCase();

      providerSlugs.add(providerSlug);
    }
  }

  const params = Array.from(providerSlugs).map((providerSlug) => ({
    providerSlug,
  }));
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ providerSlug: string }>;
}) {
  const { providerSlug } = await params;
  const apis = getProviderApis(providerSlug);

  const providerName = apis.length > 0 ? apis[0].providerName : providerSlug;
  const services = apis.filter((api) => api.serviceName);

  const title =
    services.length > 0
      ? `${providerName} APIs`
      : `${apis[0]?.title || providerName} API`;

  const description =
    services.length > 0
      ? `Explore ${providerName} APIs. Browse ${services.length} API${services.length > 1 ? "s" : ""} from ${providerName}.`
      : `Documentation and specification of the ${apis[0]?.title || providerName} API. Explore endpoints, methods, and integration options to use ${apis[0]?.title || providerName} in your applications.`;

  return generateSimpleMetadata({
    title,
    description,
    slug: `apis/${providerSlug}`,
  });
}
export default async function ProviderPage({
  params,
}: {
  params: Promise<{ providerSlug: string }>;
}) {
  const { providerSlug } = await params;
  const apis = getProviderApis(providerSlug);

  const services = apis.filter((api) => api.serviceName);
  if (services.length > 0) {
    return (
      <div className=" mx-auto px-4  relative">
        <SearchClientComponent providerSlug={providerSlug} />
      </div>
    );
  } else {
    return (
      <ApiPage params={Promise.resolve({ providerSlug, serviceSlug: null })} />
    );
  }
}
