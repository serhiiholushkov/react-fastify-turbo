/**
 * common.hooks.ts
 *
 * Global application hooks registered at the ROOT level.
 * Because these are added to the root instance they fire for EVERY request,
 * regardless of which plugin handles the route.
 *
 * Hooks here:
 *  - onRequest  : attach a correlation ID to every request
 *  - onResponse : log timing for every completed request
 *
 * ASP.NET Core equivalent:
 *   app.Use(async (ctx, next) => { ... await next(); ... }) — middleware
 *
 * Key difference: ASP.NET middleware wraps the whole pipeline (before+after)
 * in one function.  Fastify separates concerns into discrete hooks that each
 * have a well-defined point in the lifecycle.
 */
import type { FastifyInstance } from "fastify";
import { randomUUID } from "node:crypto";

export function registerCommonHooks(fastify: FastifyInstance): void {
  // ── onRequest — first hook in the lifecycle ──────────────────────────────
  // Runs before body parsing, before validation.
  // Good for: attaching request IDs, very early auth checks, rate limiting.
  fastify.addHook("onRequest", async (request) => {
    // Attach a correlation ID so all log lines for this request share an ID.
    // The client may send their own via X-Request-Id; fall back to a uuid.
    (request as any).correlationId =
      (request.headers["x-request-id"] as string) ?? randomUUID();

    request.log.info(
      {
        method: request.method,
        url: request.url,
        reqId: (request as any).correlationId,
      },
      "incoming request",
    );
  });

  // ── onResponse — fires AFTER the response is sent ───────────────────────
  // Runs after the response has left the socket.
  // Good for: metrics, audit logs, releasing per-request resources.
  fastify.addHook("onResponse", async (request, reply) => {
    request.log.info(
      {
        method: request.method,
        url: request.url,
        statusCode: reply.statusCode,
        durationMs: reply.elapsedTime,
        reqId: (request as any).correlationId,
      },
      "request completed",
    );
  });

  // ── onError — fires when an unhandled error reaches the error handler ────
  // NOTE: this is for LOGGING/OBSERVABILITY only — not for changing the error.
  // Use setErrorHandler() to shape the error response.
  fastify.addHook("onError", async (request, _reply, error) => {
    request.log.error(
      { err: error, reqId: (request as any).correlationId },
      "request error",
    );
  });
}
