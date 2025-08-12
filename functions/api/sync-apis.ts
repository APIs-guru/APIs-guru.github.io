import type { RequestContext, GuruApiList, SyncResult } from "../../types/api";
import { drizzle } from "drizzle-orm/d1";
import { apis } from "@/db/schema";

export async function onRequestPost({
  request,
  env,
}: RequestContext): Promise<Response> {
  try {
    const result = await syncApis(env);

    return new Response(
      JSON.stringify({
        success: true,
        message: "API sync completed successfully",
        ...result,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  } catch (error) {
    console.error("Manual sync failed:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: "Sync failed",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}

async function syncApis(env: any): Promise<SyncResult> {
  const startTime = Date.now();
  console.log("Starting API sync process...");

  try {
    const db = drizzle(env.DB);

    const response = await fetch(
      env.SYNC_URL || "https://api.apis.guru/v2/list.json",
      {
        headers: {
          "User-Agent": "APIs-Guru-Cloudflare-Worker/1.0",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `HTTP error fetching API list: ${response.status} ${response.statusText}`
      );
    }

    const apiList: GuruApiList = await response.json();
    const entries = Object.entries(apiList);

    console.log(`Fetched ${entries.length} APIs to sync`);

    const batchSize = parseInt(env.BATCH_SIZE || "100");
    let totalProcessed = 0;
    let totalErrors = 0;

    for (let i = 0; i < entries.length; i += batchSize) {
      const batch = entries.slice(i, i + batchSize);

      try {
        const insertData = batch.map(([name, apiEntry]) => {
          const preferredVersion = apiEntry.preferred;
          const versionData = apiEntry.versions[preferredVersion];
          const info = versionData.info;

          const categories = (info["x-apisguru-categories"] || []).map((c) =>
            c.toLowerCase()
          );
          const tags = (info["x-tags"] || []).map((t) => t.toLowerCase());
          const contact = info.contact || {};
          const license = info.license || {};
          const logo = info["x-logo"];

          const externalDocs = versionData.externalDocs;
          const externalUrl =
            externalDocs?.url ||
            (contact as any)?.url ||
            (name.indexOf(".local") < 0 ? `https://${name.split(":")[0]}` : "");

          return {
            name,
            categories: JSON.stringify(categories),
            tags: JSON.stringify(tags),
            added: apiEntry.added,
            updated: versionData.updated || apiEntry.added,
            swaggerUrl: versionData.swaggerUrl,
            swaggerYamlUrl: versionData.swaggerYamlUrl || "",
            description: (info.description || "").substring(0, 1000),
            title: info.title || name,
            version: preferredVersion,
            logoUrl: logo?.url || "",
            externalUrl,
            contact: JSON.stringify(contact),
            license: JSON.stringify(license),
          };
        });

        for (const data of insertData) {
          await db
            .insert(apis)
            .values(data)
            .onConflictDoUpdate({
              target: apis.name,
              set: {
                categories: data.categories,
                tags: data.tags,
                updated: data.updated,
                swaggerUrl: data.swaggerUrl,
                swaggerYamlUrl: data.swaggerYamlUrl,
                description: data.description,
                title: data.title,
                version: data.version,
                logoUrl: data.logoUrl,
                externalUrl: data.externalUrl,
                contact: data.contact,
                license: data.license,
              },
            });
        }

        totalProcessed += batch.length;

        console.log(
          `Processed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(
            entries.length / batchSize
          )} (${batch.length} APIs)`
        );
      } catch (error) {
        console.error(
          `Error processing batch ${Math.floor(i / batchSize) + 1}:`,
          error
        );
        totalErrors += batch.length;
      }
    }

    const duration = Date.now() - startTime;
    console.log(
      `Sync completed in ${duration}ms. Processed: ${totalProcessed}, Errors: ${totalErrors}`
    );

    return {
      duration,
      totalProcessed,
      totalErrors,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Sync failed:", error);
    throw error;
  }
}

export async function onRequestOptions(): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
