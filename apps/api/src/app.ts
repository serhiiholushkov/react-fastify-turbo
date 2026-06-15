import fastify from "fastify";

export async function buildApp() {
  const server = fastify();

  server.get("/ping", async (request, reply) => {
    return "pong\n";
  });

  return server;
}
