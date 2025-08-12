import { D1Database } from "@cloudflare/workers-types";
import { apis } from "@/db/schema";

export type DatabaseApi = typeof apis.$inferSelect;

export interface ApiInfo {
  title: string;
  description?: string;
  "x-logo"?: {
    url: string;
    backgroundColor?: string;
  };
  "x-origin"?: Array<{
    url: string;
  }>;
  "x-tags"?: string[];
  "x-apisguru-categories"?: string[];
  "x-issues"?: string[];
  contact?: {
    url?: string;
  };
}

export interface ApiVersion {
  version: string;
  swaggerUrl: string;
  swaggerYamlUrl: string;
  info: ApiInfo;
  updated?: string;
  externalDocs?: {
    url?: string;
  };
}

export interface ApiVersions {
  [version: string]: ApiVersion;
}

export interface ApiEntry {
  added: string;
  preferred: string;
  versions: {
    [key: string]: {
      swaggerUrl: string;
      swaggerYamlUrl: string;
      info: ApiInfo;
      updated?: string;
      externalDocs?: {
        url: string;
      };
    };
  };
}

export interface ApiList {
  [name: string]: ApiEntry;
}

export type ApiCard = Omit<DatabaseApi, "added" | "updated"> & {
  categories: string[];
  tags: string[];
  contact: Record<string, any>;
  license: Record<string, any>;
  added: Date;
  updated: Date;
  searchableText: string;
  cardDescription: string;
  markedDescription: string;

  preferred?: string | null;
  api?: any;
  info?: ApiInfo;
  logo?: any;
  origUrl?: string;
  versions?: any;
  integrations?: any[];
  visits?: number | null;
};

export function createSearchableText(model: ApiCard): string {
  const parts = [
    model.name,
    model.description || "",
    model.cardDescription || "",
    ...(model.categories || []),
    ...(model.tags || []),
  ];

  return parts.join(" ").toLowerCase();
}

export interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export interface Filters {
  search: string | null;
}

export interface ApiResponse {
  apis: ApiCard[];
  pagination: Pagination;
  filters: Filters;
}

export interface InfiniteApiResponse {
  apis: ApiCard[];
  hasMore: boolean;
  nextPage: number | null;
  totalCount: number;
}

export interface Env {
  DB: D1Database;
  DEFAULT_PAGE_SIZE?: string;
  MAX_PAGE_SIZE?: string;
  ENVIRONMENT?: string;
  SYNC_URL?: string;
  BATCH_SIZE?: string;
}

export interface RequestContext {
  request: Request;
  env: Env;
}

export interface GuruApiInfo {
  title: string;
  description?: string;
  contact?: Record<string, any>;
  license?: Record<string, any>;
  "x-apisguru-categories"?: string[];
  "x-tags"?: string[];
  "x-logo"?: { url: string };
}

export interface GuruApiVersion {
  swaggerUrl: string;
  swaggerYamlUrl?: string;
  info: GuruApiInfo;
  updated?: string;
  externalDocs?: { url: string };
}

export interface GuruApiEntry {
  added: string;
  preferred: string;
  versions: { [version: string]: GuruApiVersion };
}

export interface GuruApiList {
  [name: string]: GuruApiEntry;
}

export interface SyncResult {
  duration: number;
  totalProcessed: number;
  totalErrors: number;
  timestamp: string;
}

export interface VisitResult {
  name: string;
  visits: number;
}
