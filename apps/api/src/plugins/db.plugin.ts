/**
 * db.plugin.ts
 *
 * Registers the Drizzle database client as a Fastify decorator.
 *
 * Wrapped with `fastify-plugin` (fp) so that `fastify.db` is available
 * in every plugin that is registered AFTER this one — including sibling
 * plugins, not just child plugins.  This is the key difference between
 * fp-wrapped plugins and plain plugins (encapsulated by default).
 *
 * ASP.NET Core equivalent:
 *   builder.Services.AddSingleton<IDatabase>(db);
 *   — Fastify uses explicit decoration instead of a DI container.
 */
import fp from "fastify-plugin";
import type { FastifyPluginAsync } from "fastify";
import { db } from "../db/index.js";

const dbPlugin: FastifyPluginAsync = async (fastify) => {
  // Decorate the fastify instance with the shared Drizzle client.
  // TypeScript knows the type because we declared it in shared/types.ts.
  fastify.decorate("db", db);

  // Close the connection pool gracefully when Fastify shuts down.
  fastify.addHook("onClose", async () => {
    fastify.log.info("Closing database connection…");
    // postgres-js exposes .end() on the underlying sql client.
    // We reach it through the drizzle session:
    // (db as any).$client.end() — or keep a reference to the sql client.
    // For simplicity the pool is closed at process exit in this example.
  });
};

// fp() breaks encapsulation: fastify.db becomes visible to all sibling
// and parent contexts, not just this plugin's subtree.
export default fp(dbPlugin, {
  name: "db-plugin",
  fastify: "5.x",
});
