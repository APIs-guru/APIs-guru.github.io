import { drizzle } from "drizzle-orm/d1";
import { like, and, or, sql } from "drizzle-orm";
import { createSearchableText } from "@/types/api";
import type { ApiResponse, RequestContext, ApiCard } from "../../types/api";
import { apis } from "@/db/schema";

export type {
  Pagination,
  Filters,
  ApiResponse,
  InfiniteApiResponse,
} from "../../types/api";

export async function onRequestGet({
  request,
  env,
}: RequestContext): Promise<Response> {
  try {
    const db = drizzle(env.DB);
    const url = new URL(request.url);

    const pageSize = Math.min(
      Math.max(
        parseInt(
          url.searchParams.get("pageSize") || env.DEFAULT_PAGE_SIZE || "20",
        ),
        1,
      ),
      parseInt(env.MAX_PAGE_SIZE || "100"),
    );
    const page = Math.max(parseInt(url.searchParams.get("page") || "1"), 1);
    const search = url.searchParams.get("search")?.toLowerCase().trim();

    const offset = (page - 1) * pageSize;
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          like(apis.name, `%${search}%`),
          like(apis.description, `%${search}%`),
          like(apis.title, `%${search}%`),
        ),
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const rows = await db
      .select({
        name: apis.name,
        title: apis.title,
        description: apis.description,
        categories: apis.categories,
        tags: apis.tags,
        contact: apis.contact,
        license: apis.license,
        added: apis.added,
        updated: apis.updated,
        logoUrl: apis.logoUrl,
        swaggerUrl: apis.swaggerUrl,
        swaggerYamlUrl: apis.swaggerYamlUrl,
        externalUrl: apis.externalUrl,
        version: apis.version,
        total: sql<number>`COUNT(*) OVER()`,
      })
      .from(apis)
      .where(whereClause)
      .orderBy(apis.name)
      .limit(pageSize)
      .offset(offset)
      .all();

    const total = rows.length > 0 ? rows[0].total : 0;

    const apiCards: ApiCard[] = rows
      .map((row): ApiCard => {
        const categories = JSON.parse(row.categories || "[]");
        const tags = JSON.parse(row.tags || "[]");
        const contact = JSON.parse(row.contact || "{}");
        const license = JSON.parse(row.license || "{}");
        const added = new Date(row.added);
        const updated = new Date(row.updated);

        return {
          name: row.name,
          title: row.title,
          description: row.description,
          categories,
          tags,
          contact,
          license,
          added,
          updated,
          logoUrl: row.logoUrl,
          swaggerUrl: row.swaggerUrl,
          swaggerYamlUrl: row.swaggerYamlUrl,
          externalUrl: row.externalUrl,
          version: row.version,
          searchableText: "",
          markedDescription: row.description || "",
          cardDescription: (row.description || "")
            .replace(/(<([^>]+)>)/gi, "")
            .split(" ")
            .slice(0, 50)
            .join(" "),
        };
      })
      .map((model: ApiCard) => {
        model.searchableText = createSearchableText(model);
        return model;
      });

    const totalPages = Math.ceil(total / pageSize);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    const response: ApiResponse = {
      apis: apiCards,
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? page + 1 : null,
        prevPage: hasPrevPage ? page - 1 : null,
      },
      filters: {
        search: search || null,
      },
    };

    return new Response(JSON.stringify(response), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (error) {
    console.error("Fetch APIs failed:", error);

    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: "Failed to fetch APIs",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  }
}

export async function onRequestOptions(): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
