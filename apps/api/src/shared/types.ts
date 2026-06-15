/**
 * Module augmentation for Fastify's core interfaces.
 *
 * By declaring extra properties here, TypeScript knows about them everywhere
 * in the project — no need for `as any` casts.
 *
 * Rule: properties added via `fastify.decorate` / `fastify.decorateRequest`
 * that are available GLOBALLY (registered with fastify-plugin / fp()) must be
 * declared here.  Properties scoped to a sub-plugin stay local to that plugin.
 */
import "fastify";
import "@fastify/jwt";
import type { Database } from "../db/index.js";

declare module "fastify" {
  interface FastifyInstance {
    /** Drizzle ORM database client — added by db.plugin.ts */
    db: Database;

    /**
     * JWT authentication guard.
     * Call as a preHandler hook to protect a route.
     * Added by auth.plugin.ts.
     */
    authenticate: (
      request: import("fastify").FastifyRequest,
      reply: import("fastify").FastifyReply,
    ) => Promise<void>;
  }
}

declare module "@fastify/jwt" {
  /**
   * Shapes request.user after a successful JWT verification.
   * @fastify/jwt reads this interface to type the `user` property.
   */
  interface FastifyJWT {
    user: {
      id: number;
      email: string;
      role: string;
    };
  }
}

// Re-export for convenience in plugins
export {};
