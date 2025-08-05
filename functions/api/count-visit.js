const worker = {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(syncApis(env));
  },
};

export default worker;

export async function onRequestPost({ request, env }) {
  try {
    const isProduction = env.ENVIRONMENT === "production";

    if (isProduction) {
      const country = request.headers.get("CF-IPCountry");
      if (country === "UA") {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Access from Ukraine is restricted",
          }),
          {
            status: 403,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
      }
    }

    const { name } = await request.json();

    if (!name) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "API name is required",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    const result = await updateApiVisits(env.DB, name);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Visit count updated",
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
    console.error("Visit count update failed:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: "Visit count update failed",
        message: error.message,
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

async function updateApiVisits(db, apiName) {
  const apiExists = await db
    .prepare("SELECT name FROM Apis WHERE name = ?")
    .bind(apiName)
    .first();

  if (!apiExists) {
    throw new Error(`API '${apiName}' not found`);
  }

  const result = await db
    .prepare(
      `
      INSERT INTO ApiVisits (api_name, visits) 
      VALUES (?, 1)
      ON CONFLICT(api_name) 
      DO UPDATE SET visits = visits + 1
    `
    )
    .bind(apiName)
    .run();

  const updatedVisits = await db
    .prepare("SELECT api_name, visits FROM ApiVisits WHERE api_name = ?")
    .bind(apiName)
    .first();

  return {
    name: updatedVisits.api_name,
    visits: updatedVisits.visits,
  };
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
