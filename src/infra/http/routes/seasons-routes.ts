import { FastifyInstance } from "fastify";
import { CreateSeasonController } from "../controllers/season/create-season-controller";
import { UserRole } from "../../../core/enums/user-role-enum";
import { VerifyUserRole } from "../middlewares/verify-user-role";
import { SeasonLeaderboardsController } from "../controllers/season/season-leaderboards-controller";
import { AllTimeLeaderboardsController } from "../controllers/season/all-time-leaderboards-controller";

export async function seasonsRoutes(app: FastifyInstance) {
  const createSeason = new CreateSeasonController();
  const seasonLeaderboards = new SeasonLeaderboardsController();
  const allTimeLeaderboards = new AllTimeLeaderboardsController();

  const verifyAdmin = new VerifyUserRole().ofRoles([UserRole.ADMIN]);

  app.post('/seasons', {
    onRequest: [verifyAdmin.authorize],
    schema: {
      tags: ['Season'],
      summary: 'Create a new season',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          startAt: { type: 'string' },
          endAt: { type: 'string' }
        }
      },
      response: {
        201: {
          description: "Successfull response",
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            startAt: { type: 'string' },
            endAt: { type: 'string' },
            status: { type: 'boolean' },
            id: { type: 'number' },
          }
        },
        400: {
          description: 'Invalid arguments',
          type: 'object',
          properties: {
            statusCode: { type: 'number' },
            error: { type: 'string' },
            message: { type: 'string' }
          }
        },
        401: {
          description: 'Invalid credentials response',
          type: 'object',
          properties: {
            statusCode: { type: 'number' },
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    }
  }, createSeason.handle);
  app.get('/leaderboards/season', {
    schema: {
      tags: ['Leaderboards'],
      summary: 'Get Season Leaderboards',
      querystring: {
        type: "object",
        properties: {
          limit: { type: "number" },
          page: { type: "number" }
        }
      },
      response: {
        200: {
          description: "Successfull response",
          type: "object",
          properties: {
            page: { type: "number" },
            limit: { type: "number" },
            nrOfPages: { type: "number" },
            total: { type: "number" },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  points: { type: 'number' },
                  tier: { type: 'number' },
                  seasonTier: { type: 'number' },
                  seasonId: { type: 'number' },
                  player: {
                    type: 'object',
                    properties: {
                      username: { type: 'string' },
                      avatarUrl: { type: 'string' },
                    }
                  },
                }
              }
            }
          }
        },
        400: {
          description: 'Invalid arguments',
          type: 'object',
          properties: {
            statusCode: { type: 'number' },
            error: { type: 'string' },
            message: { type: 'string' }
          }
        },
        401: {
          description: 'Invalid credentials response',
          type: 'object',
          properties: {
            statusCode: { type: 'number' },
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    }
  }, seasonLeaderboards.handle);
  app.get('/leaderboards/all', {
    schema: {
      tags: ['Leaderboards'],
      summary: 'Get All Time Leaderboards',
      querystring: {
        type: "object",
        properties: {
          limit: { type: "number" },
          page: { type: "number" }
        }
      },
      response: {
        200: {
          description: "Successfull response",
          type: "object",
          properties: {
            page: { type: "number" },
            limit: { type: "number" },
            nrOfPages: { type: "number" },
            total: { type: "number" },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  points: { type: 'number' },
                  tier: { type: 'number' },
                  player: {
                    type: 'object',
                    properties: {
                      username: { type: 'string' },
                      avatarUrl: { type: 'string' },
                    }
                  },
                }
              }
            }
          }
        },
        400: {
          description: 'Invalid arguments',
          type: 'object',
          properties: {
            statusCode: { type: 'number' },
            error: { type: 'string' },
            message: { type: 'string' }
          }
        },
        401: {
          description: 'Invalid credentials response',
          type: 'object',
          properties: {
            statusCode: { type: 'number' },
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    }
  }, allTimeLeaderboards.handle);
}