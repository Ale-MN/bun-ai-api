import { cerebrasService } from "./services/cerebras";
import { groqService } from "./services/groq";
import type { AIService, ChatMessage } from "./types";

const services: AIService[] = [groqService, cerebrasService];

let currentServiceIndex = 0;

function getNextService() {
  const servcice = services[currentServiceIndex];
  currentServiceIndex = (currentServiceIndex + 1) % services.length;
  return servcice;
}

const server = Bun.serve({
  port: process.env.PORT ?? 3000,
  async fetch(request) {
    const { pathname } = new URL(request.url);

    if (request.method === "POST" && pathname === "/chat") {
      const { messages } = (await request.json()) as {
        messages: ChatMessage[];
      };
      const service = getNextService();
      console.log(`Usando ${service?.name} como servicio`);
      const stream = await service?.chat(messages);

      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    return new Response("NOT FOUND", { status: 404 });
  },
});

console.log(`Server is running on ${server.url}:${server.port}`);
