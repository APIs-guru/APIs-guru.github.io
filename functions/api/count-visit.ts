import type { RequestContext, VisitResult } from "../../types/api";
import { drizzle } from "drizzle-orm/d1";
import { apis, apiVisits } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import type { D1Database } from "@cloudflare/workers-types";

export async function onRequestPost({
  request,
  env,
}: RequestContext): Promise<Response> {
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

    const body = (await request.json()) as { name: string };
    const { name } = body;

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

async function updateApiVisits(
  database: D1Database,
  apiName: string
): Promise<VisitResult> {
  const db = drizzle(database);

  const apiExists = await db
    .select({ name: apis.name })
    .from(apis)
    .where(eq(apis.name, apiName))
    .get();

  if (!apiExists) {
    throw new Error(`API '${apiName}' not found`);
  }

  await db
    .insert(apiVisits)
    .values({
      api_name: apiName,
      visits: 1,
    })
    .onConflictDoUpdate({
      target: apiVisits.api_name,
      set: {
        visits: sql`${apiVisits.visits} + 1`,
      },
    });

  const updatedVisits = await db
    .select({
      api_name: apiVisits.api_name,
      visits: apiVisits.visits,
    })
    .from(apiVisits)
    .where(eq(apiVisits.api_name, apiName))
    .get();

  if (!updatedVisits) {
    throw new Error(`Failed to retrieve updated visit count for '${apiName}'`);
  }

  return {
    name: updatedVisits.api_name,
    visits: updatedVisits.visits,
  };
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
