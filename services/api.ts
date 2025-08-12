import type { ApiResponse, InfiniteApiResponse } from "../types/api";

export async function fetchApis(
  options: {
    search?: string;
    page?: number;
    pageSize?: number;
  } = {}
): Promise<ApiResponse> {
  try {
    const params = new URLSearchParams();

    if (options.search) params.append("search", options.search);
    params.append("page", (options.page || 1).toString());
    params.append("pageSize", (options.pageSize || 20).toString());

    const url = `/api/fetch-apis?${params.toString()}`;

    const response = await fetch(url, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch API list: ${response.status}`);
    }

    const data: ApiResponse = await response.json();

    return data;
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
      },
    };
  }
}

export async function fetchApisInfinite(
  page: number = 1,
  search?: string,
  pageSize: number = 20
): Promise<InfiniteApiResponse> {
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
