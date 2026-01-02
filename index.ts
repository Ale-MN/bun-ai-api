const server = Bun.serve({
  port: process.env.PORT ?? 3000,
  async fetch(request) {
    return new Response("api de bun esta funcionando correctamente");
  },
});

console.log(`Server is running on ${server.url}:${server.port}`);
