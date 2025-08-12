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
  description: string | null;
  cardDescription: string | null;
  markedDescription: string | null;
  categories: string[] | null;
  tags: string[] | null;
  classes: string;
  flashText: string;
  flashTitle: string;
  preferred: string | null;
  api: any;
  info: ApiInfo;
  logo: any;
  externalUrl: string;
  origUrl: string;
  versions: any;
  added: Date;
  updated: Date;
  integrations: any[];
  searchableText?: string;
  visits: number | null;
}
