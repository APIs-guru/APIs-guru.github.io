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
  "x-issues"?: string[]; // Added to fix TypeScript error
  contact?: {
    url?: string;
  };
}

export interface ApiVersion {
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

export interface ApiCardModel {
  name: string;
  description?: string;
  cardDescription?: string;
  markedDescription?: string;
  categories?: string[]; // Added for improved search
  tags?: string[]; // Added for improved search
  classes: string;
  flashText: string;
  flashTitle: string;
  preferred: string;
  api: any;
  info: ApiInfo;
  logo: any;
  externalUrl: string;
  origUrl: string;
  versions: any;
  added: Date;
  updated: Date;
  integrations: any[];
  searchableText?: string; // Added for improved search
}

// Export a function to create a searchable text field from an API model
export function createSearchableText(model: ApiCardModel): string {
  const parts = [
    model.name,
    model.description || "",
    model.cardDescription || "",
    ...(model.categories || []),
    ...(model.tags || []),
  ];

  return parts.join(" ").toLowerCase();
}
