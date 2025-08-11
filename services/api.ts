import { ApiCardModel, createSearchableText } from "../models/ApiCardModel";

export async function fetchApis(
  options: {
    search?: string;
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
    sortBy: string;
    sortOrder: string;
  };
}> {
  try {
    const params = new URLSearchParams();

    if (options.search) params.append("search", options.search);
    params.append("page", (options.page || 1).toString());
    params.append("pageSize", (options.pageSize || 20).toString());
    params.append("sortBy", options.sortBy || "name");
    params.append("sortOrder", options.sortOrder || "asc");

    const url = `/api/fetch-apis?${params.toString()}`;

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
  totalCount: number;
}> {
  try {
    const response = await fetchApis({
      search,
      page,
      pageSize,
    });

    return {
      apis: response.apis,
      hasMore: response.pagination.hasNextPage,
      nextPage: response.pagination.nextPage,
      totalCount: response.pagination.total,
    };
  } catch (error) {
    console.error("Error fetching APIs for infinite scroll:", error);
    return {
      apis: [],
      hasMore: false,
      nextPage: null,
      totalCount: 0,
    };
  }
}

function createApiCardModelFromWorkerData(workerApi: any): ApiCardModel {
  const monthAgo = new Date(new Date().setDate(new Date().getDate() - 30));

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
    classes = "flash flash-red";
    flashText = `<a href="https://github.com/APIs-guru/openapi-directory/issues" target="_blank">Help Wanted</a>`;
    flashTitle = updated.toLocaleString();
  }

  const description = info.description || "";
  const cardDescription = description
    .replace(/(<([^>]+)>)/gi, "")
    .split(" ")
    .slice(0, 50)
    .join(" ");

  const model: ApiCardModel = {
    name: workerApi.name,
    classes,
    flashText,
    flashTitle,
    preferred: workerApi.version,
    api,
    info: info as any,
    logo: info["x-logo"] || {},
    externalUrl: workerApi.externalUrl,
    origUrl: workerApi.swaggerUrl,
    versions: null,
    markedDescription: description,
    cardDescription,
    categories: workerApi.categories,
    tags: workerApi.tags,
    added,
    updated,
    integrations: [],
  };

  model.searchableText = createSearchableText(model);
  return model;
}
