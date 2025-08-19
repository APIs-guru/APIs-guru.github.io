import { NextRequest, NextResponse } from "next/server";

interface SentryResponse {
  error?: string;
  message?: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "public, max-age=300",
};

export async function POST(req: NextRequest) {
  try {
    const sentryDsn =
      "https://8296abef723d97e7b8d5a15d1e93be1f@o4509816683823104.ingest.us.sentry.io/4509831375683584";

    const dsn = new URL(sentryDsn);
    const projectId = dsn.pathname.split("/").pop();
    if (!projectId) {
      throw new Error("Invalid SENTRY_DSN: missing project ID");
    }

    const sentryIngestUrl = `https://${dsn.host}/api/${projectId}/envelope/`;

    const clientIp =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "";

    const newRequest = new Request(sentryIngestUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-sentry-envelope",
        "X-Forwarded-For": clientIp,
      },
      body: await req.arrayBuffer(),
    });

    const response = await fetch(newRequest);

    return new Response(response.body, {
      status: response.status,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/x-sentry-envelope",
      },
    });
  } catch (error: unknown) {
    console.error("Sentry proxy failed:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Internal server error",
        message: `Failed to proxy Sentry request: ${errorMessage}`,
      } as SentryResponse,
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}
