import { FastifyInstance } from "fastify";
import { CreateCompletedTaskController } from "../controllers/tasks/create-completed-task-controller";

export async function taskRoutes(app: FastifyInstance) {
  const createTask = new CreateCompletedTaskController();

  app.post('/task', {
    schema: {
      tags: ["Task"],
      summary: "Add completed task to a user",
      querystring: {
        type: 'object',
        properties: {
          system: { type: "string" },
        }
      },
      body: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          points: { type: "number" },
          completedDate: { type: "string" },
          providerPlayerId: { type: "string" },
          telegramId: { type: "string" },
          taskId: { type: "string" },
        }
      },
      response: {
        201: {
          description: 'Successful response',
          type: 'object',
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            points: { type: "number" },
            completedDate: { type: "string" },
            providerPlayerId: { type: "string" },
            systemId: { type: "string" },
            taskId: { type: "string" },
          }
        },
        400: {
          description: 'General error',
          type: 'object',
          properties: {
            message: { type: "string" },
          }
        },
        422: {
          description: 'Unprocessable Entity',
          type: 'object',
          properties: {
            message: { type: "string" },
          }
        }
      }
    }
  }, createTask.handle);
}