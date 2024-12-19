import { FastifyInstance } from "fastify";
import { CreateNotificationController } from "../controllers/notifications/create-notification-controller";
import { ReadCsvFileUsernamesController } from "../controllers/notifications/read-csv-file-usernames-controller";
import { UserRole } from "../../../core/enums/user-role-enum";
import { VerifyUserRole } from "../middlewares/verify-user-role";
import { UpdateNotificationController } from "../controllers/notifications/update-notification-controller";
import { ListNotificationsController } from "../controllers/notifications/list-notifications-controller";
import { ListRegistriesForNotificationController } from "../controllers/notifications/list-registries-for-notification-controller";
import { DeleteNotificationController } from "../controllers/notifications/delete-notification-controller";
import { GetNotificationByIdController } from "../controllers/notifications/get-notification-by-id-controller";
import { DeleteNotificationRegistryController } from "../controllers/notifications/delete-notification-registry-controller";
import { CreateNotificationRegistryController } from "../controllers/notifications/create-notification-registry-controller";
import { ListPlayerNotificationsController } from "../controllers/notifications/list-player-notifications-controller";
import { verifyUserToken } from "../middlewares/verify-user-token";
import { DeletePlayerNotificationController } from "../controllers/notifications/delete-player-notification-controller";
import { GetPlayerUnreadNotificationsController } from "../controllers/notifications/get-player-unread-notifications-controller";
import { ListNotificationAutomaticTemplatesController } from "../controllers/notifications/list-notification-automatic-templates-controller";
import { UpdateNotificationAutomaticTemplateController } from "../controllers/notifications/update-notification-automatic-template-controller";
import { GetNotificationAutomaticTemplateByIdController } from "../controllers/notifications/get-notification-automatic-template-by-id-controller";

export async function notificationsRoutes(app: FastifyInstance) {
  const createNotification = new CreateNotificationController();
  const createNotificationRegistry = new CreateNotificationRegistryController();
  const updateNotification = new UpdateNotificationController();
  const readCsv = new ReadCsvFileUsernamesController();
  const listNotifications = new ListNotificationsController();
  const lisRegistriesForNotifications = new ListRegistriesForNotificationController();
  const deleteNotification = new DeleteNotificationController();
  const getNotification = new GetNotificationByIdController();
  const deleteNotificationRegistry = new DeleteNotificationRegistryController();
  const listPlayerNotification = new ListPlayerNotificationsController();
  const deletePlayerNotification = new DeletePlayerNotificationController();
  const getPlayerUnreadNotifications = new GetPlayerUnreadNotificationsController();
  const listNotificationAutomaticTemplates = new ListNotificationAutomaticTemplatesController();
  const updateNotificationAutomaticTemplate = new UpdateNotificationAutomaticTemplateController();
  const getNotificationAutomaticTemplateById = new GetNotificationAutomaticTemplateByIdController();

  const verifyAdmin = new VerifyUserRole().ofRoles([UserRole.ADMIN]);

  app.get(
    "/admin/notifications/:id",
    {
      onRequest: [verifyAdmin.authorize],
      schema: {
        tags: ["Notification"],
        summary: "Get notification",
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          properties: {
            id: { type: "string" }
          }
        },
        response: {
          200: {
            description: "Successful response",
            type: "object",
            properties: {
              id: { type: "number" },
              title: { type: "string" },
              content: { type: "string" },
              status: { type: "string" },
              tier: { type: "array", items: { type: "number" } },
              type: { type: "string" },
              startDate: { type: "string" },
              endDate: { type: "string" }
            }
          },
          400: {
            description: "Invalid arguments",
            type: "object",
            properties: {
              statusCode: { type: "number" },
              error: { type: "string" },
              message: { type: "string" }
            }
          },
          401: {
            description: "Invalid credentials response",
            type: "object",
            properties: {
              statusCode: { type: "number" },
              error: { type: "string" },
              message: { type: "string" }
            }
          },
          404: {
            description: "Notification not found",
            type: "object",
            properties: {
              statusCode: { type: "number" },
              error: { type: "string" },
              message: { type: "string" }
            }
          }
        }
      }
    },
    getNotification.handle
  );
  app.post(
    "/admin/notifications",
    {
      onRequest: [verifyAdmin.authorize],
      schema: {
        tags: ["Notification"],
        summary: "Create notification",
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          properties: {
            title: { type: "string" },
            content: { type: "string" },
            startDate: { type: "string" },
            endDate: { type: "string" }
          }
        },
        response: {
          201: {
            description: "Successful response",
            type: "object",
            properties: {
              title: { type: "string" },
              content: { type: "string" },
              status: { type: "string" },
              startDate: { type: "string" },
              endDate: { type: "string" },
              id: { type: "number" }
            }
          },
          400: {
            description: "Invalid arguments",
            type: "object",
            properties: {
              statusCode: { type: "number" },
              error: { type: "string" },
              message: { type: "string" }
            }
          },
          401: {
            description: "Invalid credentials response",
            type: "object",
            properties: {
              statusCode: { type: "number" },
              error: { type: "string" },
              message: { type: "string" }
            }
          }
        }
      }
    },
    createNotification.handle
  );
  app.post(
    "/admin/notifications/registry/:id",
    {
      onRequest: [verifyAdmin.authorize],
      schema: {
        tags: ["Notification"],
        summary: "Create notification registry",
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          properties: {
            points: {
              type: "array",
              items: { type: "object", properties: { start: { type: "number" }, end: { type: "number" } } }
            },
            tier: { type: "array", items: { type: "number" } },
            includePlayers: {
              type: "array",
              items: {
                type: "object",
                properties: { providerPlayerId: { type: "string" }, origin: { type: "string" } }
              }
            }
          }
        },
        response: {
          201: {},
          400: {
            description: "Invalid arguments",
            type: "object",
            properties: {
              statusCode: { type: "number" },
              error: { type: "string" },
              message: { type: "string" }
            }
          },
          401: {
            description: "Invalid credentials response",
            type: "object",
            properties: {
              statusCode: { type: "number" },
              error: { type: "string" },
              message: { type: "string" }
            }
          }
        }
      }
    },
    createNotificationRegistry.handle
  );
  app.put(
    "/admin/notifications/:id",
    {
      onRequest: [verifyAdmin.authorize],
      schema: {
        tags: ["Notification"],
        summary: "Update notification",
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          properties: {
            id: { type: "string" }
          }
        },
        body: {
          type: "object",
          properties: {
            title: { type: "string" },
            content: { type: "string" },
            startDate: { type: "string" },
            endDate: { type: "string" },
            isDraft: { type: "boolean" }
          }
        },
        response: {
          200: {
            description: "Successful response",
            type: "object",
            properties: {
              title: { type: "string" },
              content: { type: "string" },
              status: { type: "string" },
              startDate: { type: "string" },
              endDate: { type: "string" },
              id: { type: "number" }
            }
          },
          400: {
            description: "Invalid arguments",
            type: "object",
            properties: {
              statusCode: { type: "number" },
              error: { type: "string" },
              message: { type: "string" }
            }
          },
          401: {
            description: "Invalid credentials response",
            type: "object",
            properties: {
              statusCode: { type: "number" },
              error: { type: "string" },
              message: { type: "string" }
            }
          }
        }
      }
    },
    updateNotification.handle
  );
  app.post(
    "/admin/notifications/csv",
    {
      onRequest: [verifyAdmin.authorize],
      schema: {
        tags: ["Notification"],
        summary: "Read Csv with username",
        security: [{ bearerAuth: [] }],
        requestBody: {
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  template: {
                    type: "string",
                    format: "binary"
                  }
                }
              }
            }
          }
        },
        response: {
          200: {
            description: "Successful response",
            type: "array",
            items: {
              type: "object",
              properties: {
                providerPlayerId: { type: "string" },
                username: { type: "string" },
                wallet: { type: "string" },
                galxeDiscordId: { type: "string" },
                galxeTwitterId: { type: "string" },
                galxeEmail: { type: "string" },
                galxeId: { type: "string" },
                supabaseEmail: { type: "string" },
                tier: { type: "number" },
                seasonPoints: { type: "number" },
                totalPoints: { type: "number" },
                points: { type: "number" },
                status: { type: "string" },
                origin: { type: "string" },
                avatarUrl: { type: "string" },
                createdAt: { type: "string", format: "date-time" }
              }
            }
          },
          400: {
            description: "Invalid arguments",
            type: "object",
            properties: {
              statusCode: { type: "number" },
              error: { type: "string" },
              message: { type: "string" }
            }
          },
          401: {
            description: "Invalid credentials response",
            type: "object",
            properties: {
              statusCode: { type: "number" },
              error: { type: "string" },
              message: { type: "string" }
            }
          }
        }
      }
    },
    readCsv.handle
  );
  app.get(
    "/admin/notifications/list",
    {
      onRequest: [verifyAdmin.authorize],
      schema: {
        tags: ["Notification"],
        summary: "List notifications",
        security: [{ bearerAuth: [] }],
        querystring: {
          type: "object",
          properties: {
            page: { type: "number" },
            limit: { type: "number" },
            title: { type: "string" },
            tier: { type: "string" },
            status: { type: "array", items: { type: "string" } },
            startDate: { type: "string" },
            endDate: { type: "string" }
          }
        }
      }
    },
    listNotifications.handle
  );
  app.get(
    "/admin/notifications/registry/:id",
    {
      onRequest: [verifyAdmin.authorize],
      schema: {
        tags: ["Notification"],
        summary: "List registries for notification",
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          properties: {
            id: { type: "string" }
          }
        },
        querystring: {
          type: "object",
          properties: {
            page: { type: "number" },
            limit: { type: "number" }
          }
        }
      }
    },
    lisRegistriesForNotifications.handle
  );
  app.delete(
    "/admin/notifications/:id",
    {
      onRequest: [verifyAdmin.authorize],
      schema: {
        tags: ["Notification"],
        summary: "Delete notification",
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          properties: {
            id: { type: "string" }
          }
        }
      }
    },
    deleteNotification.handle
  );
  app.delete(
    "/admin/notifications/registry/:id",
    {
      onRequest: [verifyAdmin.authorize],
      schema: {
        tags: ["Notification"],
        summary: "Delete notification registry",
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          properties: {
            id: { type: "string" }
          }
        },
        querystring: {
          type: "object",
          properties: {
            playerProviderId: { type: "string" }
          }
        }
      }
    },
    deleteNotificationRegistry.handle
  );
  app.get(
    "/admin/notifications/template/list",
    {
      onRequest: [verifyAdmin.authorize],
      schema: {
        tags: ["Notification"],
        summary: "List notifications automatic templates",
        security: [{ bearerAuth: [] }],
        querystring: {
          type: "object",
          properties: {
            page: { type: "number" },
            limit: { type: "number" }
          }
        }
      }
    },
    listNotificationAutomaticTemplates.handle
  );
  app.get(
    "/admin/notifications/template/:id",
    {
      onRequest: [verifyAdmin.authorize],
      schema: {
        tags: ["Notification"],
        summary: "Get notification automatic template",
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          properties: {
            id: { type: "string" }
          }
        }
      }
    },
    getNotificationAutomaticTemplateById.handle
  );
  app.put(
    "/admin/notifications/template/:id",
    {
      onRequest: [verifyAdmin.authorize],
      schema: {
        tags: ["Notification"],
        summary: "Update notification automatic template",
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          properties: {
            id: { type: "string" }
          }
        },
        body: {
          type: "object",
          properties: {
            title: { type: "string" },
            content: { type: "string" },
            active: { type: "boolean" }
          }
        },
        response: {
          200: {
            description: "Successful response",
            type: "object",
            properties: {
              id: { type: "number" },
              type: { type: "string" },
              title: { type: "string" },
              content: { type: "string" },
              createdAt: { type: "string" },
              updatedAt: { type: "string" },
              updatedBy: { type: "string" },
              active: { type: "boolean" }
            }
          },
          400: {
            description: "Invalid arguments",
            type: "object",
            properties: {
              statusCode: { type: "number" },
              error: { type: "string" },
              message: { type: "string" }
            }
          },
          401: {
            description: "Invalid credentials response",
            type: "object",
            properties: {
              statusCode: { type: "number" },
              error: { type: "string" },
              message: { type: "string" }
            }
          }
        }
      }
    },
    updateNotificationAutomaticTemplate.handle
  );
  app.get(
    "/player/notifications/list",
    {
      onRequest: [verifyUserToken],
      schema: {
        tags: ["Notification"],
        summary: "List player notifications",
        security: [{ bearerAuth: [] }],
        querystring: {
          type: "object",
          properties: {
            page: { type: "number" },
            limit: { type: "number" }
          }
        }
      }
    },
    listPlayerNotification.handle
  );
  app.delete(
    "/player/notifications/:id",
    {
      onRequest: [verifyUserToken],
      schema: {
        tags: ["Notification"],
        summary: "Delete player notification",
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          properties: {
            id: { type: "string" }
          }
        }
      }
    },
    deletePlayerNotification.handle
  );
  app.get(
    "/player/notifications/unread",
    {
      onRequest: [verifyUserToken],
      schema: {
        tags: ["Notification"],
        summary: "Check if player has unread notifications",
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            description: "Successful response",
            type: "object",
            properties: {
              hasUnread: { type: "boolean" },
              total: { type: "number" }
            }
          }
        }
      }
    },
    getPlayerUnreadNotifications.handle
  );
}
