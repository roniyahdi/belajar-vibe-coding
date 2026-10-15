import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { userRoutes } from "./routes/users-route";

const port = Number(process.env.PORT) || 3000;

const app = new Elysia()
  .use(cors())
  .use(
    swagger({
      documentation: {
        info: {
          title: "Belajar Vibe Coding API",
          version: "1.0.0",
          description: "REST API built with Bun, ElysiaJS, Drizzle ORM, and MySQL",
        },
      },
      path: "/swagger",
    })
  )
  .get("/", () => ({
    name: "Belajar Vibe Coding API",
    status: "running",
    docs: "/swagger",
  }))
  .use(userRoutes)
  .listen(port);

console.log(
  `🚀 Elysia server is running at http://${app.server?.hostname}:${app.server?.port}`
);
console.log(`📚 Swagger documentation at http://${app.server?.hostname}:${app.server?.port}/swagger`);

export type App = typeof app;
