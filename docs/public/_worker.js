const SERVICE_NAME = "MineTool Pages API";
const API_VERSION = "1.0.0";

function jsonResponse(data, options = {}) {
  const {
    status = 200,
    headers: extraHeaders = {},
    head = false,
  } = options;

  const headers = new Headers(extraHeaders);
  headers.set("Content-Type", "application/json; charset=utf-8");
  headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  headers.set("Pragma", "no-cache");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("Referrer-Policy", "no-referrer");

  return new Response(head ? null : JSON.stringify(data, null, 2), {
    status,
    headers,
  });
}

function getRequestId(request) {
  return request.headers.get("cf-ray") || crypto.randomUUID();
}

function getEdgeInfo(request, requestId) {
  const cf = request.cf || {};

  return {
    colo: cf.colo || null,
    country: cf.country || null,
    region: cf.region || null,
    asn: Number.isFinite(cf.asn) ? cf.asn : null,
    httpProtocol: cf.httpProtocol || null,
    tlsVersion: cf.tlsVersion || null,
    rayId: requestId,
  };
}

export default {
  async fetch(request, env) {
    const requestStartedAt = performance.now();
    const url = new URL(request.url);

    // Keep all non-API traffic on Pages' static asset service.
    if (!url.pathname.startsWith("/api/")) {
      return env.ASSETS.fetch(request);
    }

    const requestId = getRequestId(request);

    try {
      if (url.pathname === "/api/health" || url.pathname === "/api/health/") {
        if (request.method !== "GET" && request.method !== "HEAD") {
          return jsonResponse(
            {
              ok: false,
              error: {
                code: "METHOD_NOT_ALLOWED",
                message: "Use GET or HEAD for this endpoint.",
              },
              requestId,
            },
            {
              status: 405,
              headers: { Allow: "GET, HEAD", "X-Request-ID": requestId },
              head: request.method === "HEAD",
            },
          );
        }

        const edge = getEdgeInfo(request, requestId);
        const serverProcessingMs = Number(
          (performance.now() - requestStartedAt).toFixed(3),
        );

        const payload = {
          ok: true,
          service: SERVICE_NAME,
          version: API_VERSION,
          timestamp: new Date().toISOString(),
          request: {
            method: request.method,
            path: url.pathname,
            host: url.host,
            protocol: url.protocol.replace(":", ""),
            userAgent: request.headers.get("user-agent") || null,
          },
          edge,
          runtime: {
            platform: "Cloudflare Pages",
            mode: "Advanced Mode (_worker.js)",
            serviceBinding: {
              name: "API_WORKER",
              configured: Boolean(env.API_WORKER),
            },
          },
          timing: {
            serverProcessingMs,
            scope:
              "Cloudflare edge handler time only; excludes client-to-edge network latency.",
          },
        };

        return jsonResponse(payload, {
          headers: {
            "X-Request-ID": requestId,
            "X-Response-Time-Ms": String(serverProcessingMs),
            "Server-Timing": `app;dur=${serverProcessingMs}`,
          },
          head: request.method === "HEAD",
        });
      }

      // Optional private Worker gateway:
      // /api/worker/health -> bound Worker's /health endpoint.
      if (url.pathname.startsWith("/api/worker/")) {
        if (!env.API_WORKER || typeof env.API_WORKER.fetch !== "function") {
          return jsonResponse(
            {
              ok: false,
              error: {
                code: "SERVICE_BINDING_NOT_CONFIGURED",
                message:
                  "Add the API_WORKER Service Binding to this Pages project, then redeploy.",
              },
              requestId,
            },
            {
              status: 503,
              headers: { "X-Request-ID": requestId },
            },
          );
        }

        const targetUrl = new URL(request.url);
        targetUrl.pathname =
          url.pathname.replace(/^\/api\/worker/, "") || "/";
        const initialRequest = new Request(targetUrl.toString(), request);
        const headers = new Headers(initialRequest.headers);

        headers.set("X-Forwarded-Host", url.host);
        headers.set("X-Forwarded-Proto", url.protocol.replace(":", ""));
        headers.set("X-Request-ID", requestId);

        // Set this as a Secret on the Pages project and validate it in the
        // downstream Worker if you want an additional application-level check.
        if (env.INTERNAL_TOKEN) {
          headers.set("X-Internal-Token", env.INTERNAL_TOKEN);
        }

        const forwardedRequest = new Request(initialRequest, { headers });
        return env.API_WORKER.fetch(forwardedRequest);
      }

      return jsonResponse(
        {
          ok: false,
          error: {
            code: "API_NOT_FOUND",
            message: "No API route matches this path.",
          },
          requestId,
        },
        {
          status: 404,
          headers: { "X-Request-ID": requestId },
        },
      );
    } catch {
      return jsonResponse(
        {
          ok: false,
          error: {
            code: "INTERNAL_ERROR",
            message: "The API request could not be completed.",
          },
          requestId,
        },
        {
          status: 500,
          headers: { "X-Request-ID": requestId },
        },
      );
    }
  },
};
