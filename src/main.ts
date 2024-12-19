import Fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import FastifyMultipart from "@fastify/multipart";
import { env } from "./infra/env";
import { campaignRoutes } from "./infra/http/routes/campaign-routes";
import { taskRoutes } from "./infra/http/routes/task-routes";
import { systemRoutes } from "./infra/http/routes/system-routes";
import { playerRoutes } from "./infra/http/routes/player-routes";
import { adminRoutes } from "./infra/http/routes/admin-routes";
import { announcementsRoutes } from "./infra/http/routes/announcements-routes";
import { notificationsRoutes } from "./infra/http/routes/notifications-routes";
import { cronRoutes } from "./infra/http/routes/cron-routes";
import { seasonsRoutes } from "./infra/http/routes/seasons-routes";
import { logsRoutes } from "./infra/http/routes/logs-routes";
import FastifyCors from '@fastify/cors';

export const fastify = Fastify();
async function main() {

  fastify.register(fastifySwagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: "Incredbull Core Api",
        description: "Documentation for Incredbull Core Api",
        version: "1.0.0",
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT"
          }
        }
      }
    }
  });

  fastify.register(FastifyCors, {
    origin: env.CORS,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })

  fastify.register(fastifySwaggerUI, {
    theme: {
      title: "Incredbull Core Api"
    },
    routePrefix: "/swagger-ui"
  });

  fastify.register(FastifyMultipart);
  fastify.register(playerRoutes);
  fastify.register(campaignRoutes);
  fastify.register(taskRoutes);
  fastify.register(adminRoutes);
  fastify.register(systemRoutes);
  fastify.register(announcementsRoutes);
  fastify.register(notificationsRoutes);
  fastify.register(seasonsRoutes);
  fastify.register(logsRoutes);

  // crons
  fastify.register(cronRoutes);
  fastify.listen({
    port: env.PORT
  });
  console.log(`Server running at port ${env.PORT}`);
}

main();