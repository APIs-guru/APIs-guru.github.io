import { ExecutionContext } from "@cloudflare/workers-types";

interface Env {
  SENTRY_DSN: string;
}

interface SentryResponse {
  error?: string;
  message?: string;
}

export async function onRequestPost({
  request,
  env,
}: {
  request: Request;
  env: Env;
}) {
  try {
    const dsn = new URL(env.SENTRY_DSN);
    const projectId = dsn.pathname.split("/").pop();
    if (!projectId) {
      throw new Error("Invalid SENTRY_DSN: missing project ID");
    }

    const sentryIngestUrl = `https://${dsn.host}/api/${projectId}/envelope/`;

    const newRequest = new Request(sentryIngestUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-sentry-envelope",
        "X-Forwarded-For": request.headers.get("CF-Connecting-IP") || "",
      },
      body: await request.arrayBuffer(),
    });

    const response = await fetch(newRequest);

    return new Response(response.body, {
      status: response.status,
      headers: {
        ...corsHeaders(),
        "Content-Type": "application/x-sentry-envelope",
      },
    });
  } catch (error: unknown) {
    console.error("Sentry proxy failed:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: `Failed to proxy Sentry request: ${errorMessage}`,
      } as SentryResponse),
      {
        status: 500,
        headers: corsHeaders(),
      },
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

function corsHeaders(): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "public, max-age=300",
  };
}
