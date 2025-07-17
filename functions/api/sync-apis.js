const worker = {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(syncApis(env));
  },
};

export default worker;

export async function onRequestPost({ request, env }) {
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
      },
    );
  } catch (error) {
    console.error("Manual sync failed:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: "Sync failed",
        message: error.message,
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

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

async function syncApis(env) {
  const startTime = Date.now();
  console.log("Starting API sync process...");

  try {
    const response = await fetch(
      env.SYNC_URL || "https://api.apis.guru/v2/list.json",
      {
        headers: {
          "User-Agent": "APIs-Guru-Cloudflare-Worker/1.0",
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        `HTTP error fetching API list: ${response.status} ${response.statusText}`,
      );
    }

    const apiList = await response.json();
    const entries = Object.entries(apiList);

    console.log(`Fetched ${entries.length} APIs to sync`);

    const batchSize = parseInt(env.BATCH_SIZE || "100");
    let totalProcessed = 0;
    let totalErrors = 0;

    for (let i = 0; i < entries.length; i += batchSize) {
      const batch = entries.slice(i, i + batchSize);

      try {
        const statements = batch.map(([name, apiEntry]) => {
          const preferredVersion = apiEntry.preferred;
          const versionData = apiEntry.versions[preferredVersion];
          const info = versionData.info;

          const categories = (info["x-apisguru-categories"] || []).map((c) =>
            c.toLowerCase(),
          );
          const tags = (info["x-tags"] || []).map((t) => t.toLowerCase());
          const contact = info.contact || {};
          const license = info.license || {};
          const logo = info["x-logo"] || {};

          const externalDocs = versionData.externalDocs || {};
          const externalUrl =
            externalDocs.url ||
            contact.url ||
            (name.indexOf(".local") < 0 ? `https://${name.split(":")[0]}` : "");

          return env.DB.prepare(
            `
            INSERT OR REPLACE INTO Apis (
              name, categories, tags, added, updated, swaggerUrl, swaggerYamlUrl,
              description, title, version, logoUrl, externalUrl, contact, license,
              updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
          `,
          ).bind(
            name,
            JSON.stringify(categories),
            JSON.stringify(tags),
            apiEntry.added,
            versionData.updated || apiEntry.added,
            versionData.swaggerUrl,
            versionData.swaggerYamlUrl || "",
            (info.description || "").substring(0, 1000),
            info.title || name,
            preferredVersion,
            logo.url || "",
            externalUrl,
            JSON.stringify(contact),
            JSON.stringify(license),
          );
        });

        await env.DB.batch(statements);
        totalProcessed += batch.length;

        console.log(
          `Processed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(entries.length / batchSize)} (${batch.length} APIs)`,
        );
      } catch (error) {
        console.error(
          `Error processing batch ${Math.floor(i / batchSize) + 1}:`,
          error,
        );
        totalErrors += batch.length;
      }
    }

    const duration = Date.now() - startTime;
    console.log(
      `Sync completed in ${duration}ms. Processed: ${totalProcessed}, Errors: ${totalErrors}`,
    );

    try {
      await env.DB.prepare(
        `
        INSERT OR REPLACE INTO Apis (name, description, updated_at) 
        VALUES ('__sync_metadata__', ?, CURRENT_TIMESTAMP)
      `,
      )
        .bind(
          `Last sync: ${new Date().toISOString()}, Processed: ${totalProcessed}, Errors: ${totalErrors}`,
        )
        .run();
    } catch (metaError) {
      console.error("Error updating sync metadata:", metaError);
    }

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
