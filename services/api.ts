import { ApiList, ApiEntry, ApiCardModel, createSearchableText } from "../models/ApiCardModel";

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

// Modified to better support static site generation
export async function fetchApis(newData = false): Promise<ApiList> {
  try {
    // Use fixed data source for static generation
    const url = "https://api.apis.guru/v2/list.json";

    const response = await fetch(url, {
      // Add cache control for static site generation
      next: { revalidate: 3600 }, // Revalidate every hour during build time
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch API list: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching APIs:", error);
    // Return empty API list as fallback for static build
    return {};
  }
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
  const cardDescription =  description.replace(/(<([^>]+)>)/gi, "").split(" ").splice(0,50).join(" ")
  
  // Extract categories and tags for better search
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
  
  // Add searchable text field
  model.searchableText = createSearchableText(model);
  
  return model;
}

// Enhanced filterApis function for better search capabilities
export function filterApis(
  data: ApiList,
  search?: string,
  category?: string,
  tag?: string,
  status?: string
): ApiList {
  if (!(search || category || tag || status)) return data;

  const result: ApiList = {};
  const searchLower = search ? search.toLowerCase() : '';

  for (const [name, apis] of Object.entries(data)) {
    const version = apis.versions[apis.preferred];
    const info = version.info;
    
    // Check if this API matches any of the search criteria
    let matches = false;
    
    // Name match
    if (search && name.toLowerCase().includes(searchLower)) {
      matches = true;
    }
    
    // Description match
    if (search && info.description && info.description.toLowerCase().includes(searchLower)) {
      matches = true;
    }
    
    // Category match
    if (category && (info["x-apisguru-categories"] || []).includes(category)) {
      matches = true;
    }
    
    // Tag match
    if (tag && (info["x-tags"] || []).includes(tag)) {
      matches = true;
    }
    
    // Status: updated
    if (status === "updated" && new Date(version.updated || "") >= monthAgo) {
      matches = true;
    }
    
    // Status: new
    if (status === "new" && new Date(apis.added) >= monthAgo) {
      matches = true;
    }
    
    // Add to results if matches
    if (matches) {
      result[name] = apis;
    }
  }

  return result;
}

// Generate static search paths for all possible search combinations
export async function generateStaticSearchPaths() {
  try {
    const apiList = await fetchApis();
    
    // Extract unique categories and tags
    const categories = new Set<string>();
    const tags = new Set<string>();
    
    Object.values(apiList).forEach(api => {
      const version = api.versions[api.preferred];
      const info = version.info;
      
      // Add categories
      if (info["x-apisguru-categories"]) {
        info["x-apisguru-categories"].forEach(cat => categories.add(cat));
      }
      
      // Add tags
      if (info["x-tags"]) {
        info["x-tags"].forEach(tag => tags.add(tag));
      }
    });
    
    // Define a type for path objects that can have various properties
    type PathObject = {
      q?: string;
      category?: string;
      tag?: string;
      status?: string;
    };
    
    // Generate paths for common search queries
    const paths: PathObject[] = [
      { q: 'google' },
      { q: 'aws' },
      { q: 'azure' },
      { q: 'twitter' },
      { q: 'facebook' },
      { q: 'payment' },
      { q: 'analytics' },
      { q: 'cloud' },
      { q: 'data' },
      { q: 'api' },
    ];
    
    // Add category paths
    Array.from(categories).forEach(category => {
      paths.push({ category });
    });
    
    // Add tag paths
    Array.from(tags).forEach(tag => {
      paths.push({ tag });
    });
    
    // Add status paths
    paths.push({ status: 'new' });
    paths.push({ status: 'updated' });
    
    return paths;
  } catch (error) {
    console.error("Error generating static search paths:", error);
    return [];
  }
}
