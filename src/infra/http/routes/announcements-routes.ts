import { FastifyInstance } from "fastify";
import { CreateAnnouncementController } from "../controllers/announcements/create-announcement-controller";
import { ListAnnouncementsController } from "../controllers/announcements/list-announcements-controller";
import { DeleteAnnouncementController } from "../controllers/announcements/delete-announcement-controller";
import { UpdateAnnouncementController } from "../controllers/announcements/update-announcement-controller";
import { UserRole } from "../../../core/enums/user-role-enum";
import { VerifyUserRole } from "../middlewares/verify-user-role";
import { UploadAnnouncementController } from "../controllers/announcements/upload-announcement-banner-controller";
import { FindAnnouncementController } from "../controllers/announcements/find-announcement-controller";
import { ListPlayerAnnouncementsController } from "../controllers/announcements/list-player-announcements-controller";
import { verifyUserToken } from "../middlewares/verify-user-token";
import { ReadAnnouncementController } from "../controllers/announcements/read-announcement-controller";
import { ListAnnouncementVisualizationsController } from "../controllers/announcements/list-announcement-visualizations-controller";
import { DeleteAnnouncementBannerControler } from "../controllers/announcements/delete-announcement-banner-controller";

export async function announcementsRoutes(app: FastifyInstance) {
  const createAnnouncement = new CreateAnnouncementController();
  const deleteAnnouncement = new DeleteAnnouncementController();
  const deleteAnnouncementBanner = new DeleteAnnouncementBannerControler();
  const listAnnouncements = new ListAnnouncementsController();
  const updateAnnouncement = new UpdateAnnouncementController();
  const uploadAnnouncementBanner = new UploadAnnouncementController();
  const findAnnouncement = new FindAnnouncementController();
  const listPlayerAnnouncements = new ListPlayerAnnouncementsController();
  const readAnnouncement = new ReadAnnouncementController();
  const listAnnouncementVisualizations = new ListAnnouncementVisualizationsController();

  const verifyAdmin = new VerifyUserRole().ofRoles([UserRole.ADMIN]);

  app.post(
    "/admin/announcement",
    {
      onRequest: [verifyAdmin.authorize],
      schema: {
        tags: ["Announcement"],
        summary: "Create Announcement",
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          properties: {
            tier: { type: "array", items: { type: "number" } },
            title: { type: "string" },
            message: { type: "string" },
            startDate: { type: "string" },
            endDate: { type: "string" }
          }
        },
        response: {
          201: {
            description: "Successfull response",
            type: "object",
            properties: {
              id: { type: "number" },
              tier: { type: "array" },
              title: { type: "string" },
              message: { type: "string" },
              startDate: { type: "string" },
              endDate: { type: "string" }
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
          422: {
            description: "Invalid rules response",
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
    createAnnouncement.handle
  );
  app.delete(
    "/admin/announcement/:id",
    {
      onRequest: [verifyAdmin.authorize],
      schema: {
        tags: ["Announcement"],
        summary: "Delete Announcement",
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          properties: {
            id: { type: "string" }
          }
        },
        response: {
          200: {
            description: "Successfull response",
            type: "object",
            properties: {}
          },
          404: {
            description: "Announcement not found",
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
    deleteAnnouncement.handle
  );
  app.delete(
    "/admin/announcement/banner/:id",
    {
      onRequest: [verifyAdmin.authorize],
      schema: {
        tags: ["Announcement"],
        summary: "Delete Announcement Banner",
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          properties: {
            id: { type: "string" }
          }
        },
        response: {
          200: {
            description: "Successfull response",
            type: "object",
            properties: {}
          },
          404: {
            description: "Announcement not found",
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
    deleteAnnouncementBanner.handle
  );
  app.get(
    "/admin/announcement/:id",
    {
      onRequest: [verifyAdmin.authorize],
      schema: {
        tags: ["Announcement"],
        summary: "Find Announcement",
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          properties: {
            id: { type: "string" }
          }
        },
        response: {
          200: {
            description: "Successfull response",
            type: "object",
            properties: {
              id: { type: "number" },
              tier: { type: "array" },
              title: { type: "string" },
              message: { type: "string" },
              startDate: { type: "string" },
              endDate: { type: "string" },
              bannerUrl: { type: "string" },
              bannerExtension: { type: "string" }
            }
          },
          404: {
            description: "Announcement not found",
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
    findAnnouncement.handle
  );
  app.get(
    "/admin/announcement/list",
    {
      onRequest: [verifyAdmin.authorize],
      schema: {
        tags: ["Announcement"],
        summary: "List announcements",
        security: [{ bearerAuth: [] }],
        querystring: {
          type: "object",
          properties: {
            page: { type: "number" },
            limit: { type: "number" },
            title: { type: "string" },
            tier: { type: "string" },
            startDate: { type: "string" },
            endDate: { type: "string" }
          }
        }
      }
    },
    listAnnouncements.handle
  );
  app.put(
    "/admin/announcement/:id",
    {
      onRequest: [verifyAdmin.authorize],
      schema: {
        tags: ["Announcement"],
        summary: "Update Announcement",
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          properties: {
            id: { type: "number" }
          }
        },
        body: {
          type: "object",
          properties: {
            tier: { type: "array", items: { type: "number" } },
            title: { type: "string" },
            message: { type: "string" },
            startDate: { type: "string" },
            endDate: { type: "string" }
          }
        },
        response: {
          200: {
            description: "Successfull response",
            type: "object",
            properties: {
              id: { type: "number" },
              tier: { type: "array" },
              title: { type: "string" },
              message: { type: "string" },
              startDate: { type: "string" },
              endDate: { type: "string" }
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
    updateAnnouncement.handle
  );
  app.put(
    "/admin/announcement/banner/:id",
    {
      onRequest: [verifyAdmin.authorize],
      schema: {
        tags: ["Announcement"],
        summary: "Upload Announcement Banner",
        consumes: ["multipart/form-data"],
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          properties: {
            id: { type: "number" }
          }
        },
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
            description: "Successfull response",
            type: "object",
            properties: {
              id: { type: "number" },
              tier: { type: "array" },
              title: { type: "string" },
              message: { type: "string" },
              startDate: { type: "string" },
              endDate: { type: "string" },
              bannerExtension: { type: "string" },
              bannerUrl: { type: "string" }
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
          422: {
            description: "Invalid file type",
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
    uploadAnnouncementBanner.handle
  );
  app.get(
    "/player/announcement/list",
    {
      onRequest: [verifyUserToken],
      schema: {
        tags: ["Announcement"],
        summary: "List player announcements",
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            description: "Successfull response",
            type: "object",
            properties: {
              total: { type: "number" },
              list: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "number" },
                    tier: {
                      type: "array",
                      items: { type: "number" }
                    },
                    title: { type: "string" },
                    message: { type: "string" },
                    startDate: { type: "string" },
                    endDate: { type: "string" },
                    bannerUrl: { type: "string" },
                    bannerExtension: { type: "string" },
                    isRead: { type: "boolean" }
                  }
                }
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
    listPlayerAnnouncements.handle
  );
  app.post('/announcement/read', {
    onRequest: [verifyUserToken],
    schema: {
      tags: ["Announcement"],
      summary: "Read Announcement",
      security: [{ bearerAuth: [] }],
      body: {
        type: "object",
        properties: {
          announcementId: { type: "number" },
          providerPlayerId: { type: "string" }
        }
      },
      response: {
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
  }, readAnnouncement.handle);
  app.get('/announcement/visualizations/:id', {
    onRequest: [verifyAdmin.authorize],
    schema: {
      tags: ["Announcement"],
      summary: "List announcement visualizations",
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
      },
      response: {
        200: {
          description: "successful response",
          type: "object",
          properties: {
            page: { type: "number" },
            limit: { type: "number" },
            total: { type: "number" },
            numberOfPages: { type: "number" },
            list: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "number" },
                  announcementId: { type: "number" },
                  providerPlayerId: { type: "string" },
                  isRead: { type: "boolean" },
                  readAt: { type: "string" },
                }
              }
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
    },
  }, listAnnouncementVisualizations.handle)
}
