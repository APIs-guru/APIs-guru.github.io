import {
  ApiList,
  ApiEntry,
  ApiCardModel,
  createSearchableText,
} from "../models/ApiCardModel";

const integrations = [
  {
    text: "Swagger UI",
    template: "https://petstore.swagger.io/?url={swaggerUrl}",
  },
  {
    text: "Swagger Editor",
    template: "https://editor.swagger.io/?url={swaggerUrl}",
  },
  {
    text: "OpenAPI-GUI",
    template: "https://mermade.github.io/openapi-gui/?url={swaggerUrl}",
  },
  {
    text: "Stoplight Elements",
    template: "https://elements-demo.stoplight.io/?spec={swaggerUrl}",
  },
];

const monthAgo = new Date(new Date().setDate(new Date().getDate() - 30));

export async function fetchApis(
  options: {
    search?: string;
    category?: string;
    tag?: string;
    status?: string;
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  } = {}
): Promise<{
  apis: ApiCardModel[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
  };
  filters: {
    search: string | null;
    category: string | null;
    tag: string | null;
    status: string | null;
    sortBy: string;
    sortOrder: string;
  };
}> {
  try {
    const params = new URLSearchParams();

    if (options.search) params.append("search", options.search);
    if (options.category) params.append("category", options.category);
    if (options.tag) params.append("tag", options.tag);
    if (options.status) params.append("status", options.status);
    params.append("page", (options.page || 1).toString());
    params.append("pageSize", (options.pageSize || 20).toString());
    if (options.sortBy) params.append("sortBy", options.sortBy);
    if (options.sortOrder) params.append("sortOrder", options.sortOrder);

    const url = `/api/fetch-apis${
      params.toString() ? "?" + params.toString() : ""
    }`;

    const response = await fetch(url, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch API list: ${response.status}`);
    }

    const data = await response.json();

    const apis = data.apis.map((api: any) =>
      createApiCardModelFromWorkerData(api)
    );

    return {
      apis,
      pagination: data.pagination,
      filters: data.filters,
    };
  } catch (error) {
    console.error("Error fetching APIs:", error);

    return {
      apis: [],
      pagination: {
        page: 1,
        pageSize: 20,
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
        nextPage: null,
        prevPage: null,
      },
      filters: {
        search: null,
        category: null,
        tag: null,
        status: null,
        sortBy: "name",
        sortOrder: "asc",
      },
    };
  }
}

export async function fetchApisInfinite(
  page: number = 1,
  search?: string,
  pageSize: number = 20
): Promise<{
  apis: ApiCardModel[];
  hasMore: boolean;
  nextPage: number | null;
}> {
  try {
    const response = await fetchApis({
      search: search || undefined,
      page,
      pageSize,
      sortBy: "name",
      sortOrder: "asc",
    });

    return {
      apis: response.apis,
      hasMore: response.pagination.hasNextPage,
      nextPage: response.pagination.nextPage,
    };
  } catch (error) {
    console.error("Error fetching APIs for infinite scroll:", error);
    return {
      apis: [],
      hasMore: false,
      nextPage: null,
    };
  }
}

export async function fetchApisLegacy(): Promise<ApiList> {
  try {
    const response = await fetchApis({ pageSize: 10000 });
    const apiList: ApiList = {};

    response.apis.forEach((api) => {
      apiList[api.name] = {
        added: api.added.toISOString(),
        preferred: api.preferred,
        versions: {
          [api.preferred]: {
            swaggerUrl: api.api.swaggerUrl,
            swaggerYamlUrl: api.api.swaggerYamlUrl || "",
            info: api.info,
            updated: api.updated.toISOString(),
            externalDocs: api.api.externalDocs,
          },
        },
      };
    });

    return apiList;
  } catch (error) {
    console.error("Error fetching APIs (legacy):", error);
    return {};
  }
}

function createApiCardModelFromWorkerData(workerApi: any): ApiCardModel {
  const info = {
    title: workerApi.title,
    description: workerApi.description,
    contact: workerApi.contact,
    license: workerApi.license,
    "x-apisguru-categories": workerApi.categories,
    "x-tags": workerApi.tags,
    "x-logo": workerApi.logoUrl ? { url: workerApi.logoUrl } : undefined,
  };

  const api = {
    info,
    swaggerUrl: workerApi.swaggerUrl,
    swaggerYamlUrl: workerApi.swaggerYamlUrl,
    externalDocs: { url: workerApi.externalUrl },
  };

  const logo = info["x-logo"] || {};
  const externalUrl = workerApi.externalUrl;
  const origUrl = workerApi.swaggerUrl;
  const added = new Date(workerApi.added);
  const updated = new Date(workerApi.updated);

  let classes = "";
  let flashText = "";
  let flashTitle = "";

  if (added >= monthAgo) {
    classes = "flash flash-green";
    flashText = "New!";
    flashTitle = added.toLocaleString();
  } else if (updated >= monthAgo) {
    classes = "flash flash-yellow";
    flashText = "Updated";
    flashTitle = updated.toLocaleString();
  }

  if (workerApi.tags && workerApi.tags.indexOf("helpWanted") >= 0) {
    const link = "https://github.com/APIs-guru/openapi-directory/issues";
    classes = "flash flash-red";
    flashText = `<a href="${link}" target="_blank">Help Wanted</a>`;
    flashTitle = updated.toLocaleString();
  }

  const description = info.description || "";
  const cardDescription = description
    .replace(/(<([^>]+)>)/gi, "")
    .split(" ")
    .splice(0, 50)
    .join(" ");

  const apiIntegrations = integrations.map((i) => ({
    text: i.text,
    template: i.template.replace("{swaggerUrl}", workerApi.swaggerUrl),
  }));

  const model: ApiCardModel = {
    name: workerApi.name,
    classes,
    flashText,
    flashTitle,
    preferred: workerApi.version,
    api,
    info: info as any,
    logo,
    externalUrl,
    origUrl,
    versions: null,
    markedDescription: description,
    cardDescription,
    categories: workerApi.categories,
    tags: workerApi.tags,
    added,
    updated,
    integrations: apiIntegrations,
  };

  model.searchableText = createSearchableText(model);
  return model;
}

export function createApiCardModel(name: string, apis: ApiEntry): ApiCardModel {
  const preferred = apis.preferred;
  const api = apis.versions[preferred];
  const info = api.info;
  const externalDocs: { url?: string } = api.externalDocs || {};
  const contact: { url?: string } = info.contact || {};
  const externalUrl =
    externalDocs.url ||
    contact.url ||
    (name.indexOf(".local") < 0 ? "https://" + name.split(":")[0] : "");
  const logo = info["x-logo"] || {};

  let origUrl = "";
  if (api.info["x-origin"]) {
    origUrl = api.info["x-origin"][0].url;
  } else {
    origUrl = api.swaggerUrl;
  }

  const added = new Date(apis.added);
  let updated = added;

  let classes = "";
  let flashText = "";
  let flashTitle = "";

  const versions = [];
  for (const [version, versionApi] of Object.entries(apis.versions)) {
    if (versionApi.updated) {
      const updatedDate = new Date(versionApi.updated);
      if (updatedDate > updated) {
        updated = updatedDate;
      }
    }

    if (version === preferred) {
      continue;
    }

    versions.push({
      version,
      swaggerUrl: versionApi.swaggerUrl,
      swaggerYamlUrl: versionApi.swaggerYamlUrl,
    });
  }

  if (added >= monthAgo) {
    classes = "flash flash-green";
    flashText = "New!";
    flashTitle = added.toLocaleString();
  } else if (updated >= monthAgo) {
    classes = "flash flash-yellow";
    flashText = "Updated";
    flashTitle = updated.toLocaleString();
  }

  if (api.info["x-tags"] && api.info["x-tags"].indexOf("helpWanted") >= 0) {
    const link = (api.info["x-issues"] || [
      "https://github.com/APIs-guru/openapi-directory/issues",
    ])[0];
    classes = "flash flash-red";
    flashText = `<a href="${link}" target="_blank">Help Wanted</a>`;
    flashTitle = updated.toLocaleString();
  }

  const description = info.description || "";
  const cardDescription = description
    .replace(/(<([^>]+)>)/gi, "")
    .split(" ")
    .splice(0, 50)
    .join(" ");

  const categories = info["x-apisguru-categories"] || [];
  const tags = info["x-tags"] || [];

  const apiIntegrations = integrations.map((i) => ({
    text: i.text,
    template: i.template.replace("{swaggerUrl}", api.swaggerUrl),
  }));

  const model: ApiCardModel = {
    name,
    classes,
    flashText,
    flashTitle,
    preferred,
    api,
    info,
    logo,
    externalUrl,
    origUrl,
    versions: versions.length > 1 ? versions : null,
    markedDescription: description,
    cardDescription,
    categories,
    tags,
    added,
    updated,
    integrations: apiIntegrations,
  };

  model.searchableText = createSearchableText(model);

  return model;
}

export function filterApis(
  data: ApiList,
  search?: string,
  category?: string,
  tag?: string,
  status?: string
): ApiList {
  if (!(search || category || tag || status)) return data;

  const result: ApiList = {};
  const searchLower = search ? search.toLowerCase() : "";

  for (const [name, apis] of Object.entries(data)) {
    const version = apis.versions[apis.preferred];
    const info = version.info;

    let matches = false;

    if (search && name.toLowerCase().includes(searchLower)) {
      matches = true;
    }

    if (
      search &&
      info.description &&
      info.description.toLowerCase().includes(searchLower)
    ) {
      matches = true;
    }

    if (category && (info["x-apisguru-categories"] || []).includes(category)) {
      matches = true;
    }

    if (tag && (info["x-tags"] || []).includes(tag)) {
      matches = true;
    }

    if (status === "updated" && new Date(version.updated || "") >= monthAgo) {
      matches = true;
    }

    if (status === "new" && new Date(apis.added) >= monthAgo) {
      matches = true;
    }

    if (matches) {
      result[name] = apis;
    }
  }

  return result;
}

export async function generateStaticSearchPaths() {
  try {
    const apiList = await fetchApisLegacy();

    const categories = new Set<string>();
    const tags = new Set<string>();

    Object.values(apiList).forEach((apiEntry) => {
      const version = apiEntry.versions[apiEntry.preferred];
      const info = version.info;

      if (info["x-apisguru-categories"]) {
        info["x-apisguru-categories"].forEach((cat: string) =>
          categories.add(cat)
        );
      }

      if (info["x-tags"]) {
        info["x-tags"].forEach((tag: string) => tags.add(tag));
      }
    });

    type PathObject = {
      q?: string;
      category?: string;
      tag?: string;
      status?: string;
    };

    const paths: PathObject[] = [
      { q: "google" },
      { q: "aws" },
      { q: "azure" },
      { q: "twitter" },
      { q: "facebook" },
      { q: "payment" },
      { q: "analytics" },
      { q: "cloud" },
      { q: "data" },
      { q: "api" },
    ];

    Array.from(categories).forEach((category) => {
      paths.push({ category });
    });

    Array.from(tags).forEach((tag) => {
      paths.push({ tag });
    });

    paths.push({ status: "new" });
    paths.push({ status: "updated" });

    return paths;
  } catch (error) {
    console.error("Error generating static search paths:", error);
    return [];
  }
}
