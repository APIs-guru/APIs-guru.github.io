const worker = {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(syncApis(env));
  },
};

export default worker;

export async function onRequestPost({ request, env }) {
  try {
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
  const result = await db
    .prepare(
      `
    UPDATE Apis 
    SET visits = visits + 1
    WHERE name = ?
  `
    )
    .bind(apiName)
    .run();

  if (result.changes === 0) {
    throw new Error(`API '${apiName}' not found`);
  }

  const updatedApi = await db
    .prepare(
      `
    SELECT name, visits FROM Apis WHERE name = ?
  `
    )
    .bind(apiName)
    .first();

  return {
    name: updatedApi.name,
    visits: updatedApi.visits,
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
