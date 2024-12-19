import { FastifyInstance } from "fastify";
import { CreateSystemController } from "../controllers/system/create-system-controller";
import { ListSystemController } from "../controllers/system/list-system-controller";
import { DeleteSystemController } from "../controllers/system/delete-system-controller";
import { VerifyUserRole } from "../middlewares/verify-user-role";
import { UserRole } from "../../../core/enums/user-role-enum";
import { UpdateSystemController } from "../controllers/system/update-system-controller";
import { GetSystemByIdController } from "../controllers/system/get-system-by-id-controller";

const systemBaseUrl = "/system";

export async function systemRoutes(app: FastifyInstance) {
  const createSystemController = new CreateSystemController();
  const listSystemController = new ListSystemController();
  const deleteSystemController = new DeleteSystemController();
  const updateSystemController = new UpdateSystemController();
  const getSystemByIdController = new GetSystemByIdController();

  const verifyAdmin = new VerifyUserRole().ofRoles([UserRole.ADMIN]);

  // SYSTEM ENDPOINTS
  app.delete(
    systemBaseUrl + "/:id",
    {
      onRequest: [verifyAdmin.authorize],
      schema: {
        tags: ["System"],
        summary: "List systems",
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          properties: {
            id: { type: "string" }
          }
        }
      }
    },
    deleteSystemController.handle
  );

  app.get(
    systemBaseUrl,
    {
      onRequest: [verifyAdmin.authorize],
      schema: {
        tags: ["System"],
        summary: "List systems",
        security: [{ bearerAuth: [] }],
        querystring: {
          type: "object",
          properties: {
            page: { type: "number" },
            limit: { type: "number" },
            name: { type: "string" },
            description: { type: "string" },
            status: { type: "string" }
          }
        },
        response: {
          200: {
            description: "Successful response",
            type: "object",
            properties: {
              page: { type: "number" },
              limit: { type: "number" },
              total: { type: "number" },
              list: {
                type: "array",
                properties: {
                  id: { type: "number" },
                  name: { type: "string" },
                  description: { type: "string" },
                  systemId: { type: "string" },
                  status: { type: "string" }
                }
              }
            }
          }
        }
      }
    },
    listSystemController.handle
  );

  app.get(
    systemBaseUrl + "/:id",
    {
      onRequest: [verifyAdmin.authorize],
      schema: {
        tags: ["System"],
        summary: "Get system by id",
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
              name: { type: "string" },
              description: { type: "string" },
              systemId: { type: "string" },
              status: { type: "string" }
            }
          }
        }
      }
    },
    getSystemByIdController.handle
  );

  app.post(
    systemBaseUrl,
    {
      onRequest: [verifyAdmin.authorize],
      schema: {
        tags: ["System"],
        summary: "Create a new system",
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          properties: {
            name: { type: "string" },
            description: { type: "string" }
          }
        },
        response: {
          200: {
            description: "Successful response",
            type: "object",
            properties: {}
          }
        }
      }
    },
    createSystemController.handle
  );

  app.put(
    systemBaseUrl,
    {
      onRequest: [verifyAdmin.authorize],
      schema: {
        tags: ["System"],
        summary: "Update an existent system",
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            status: { type: "string" },
            id: { type: "number" }
          }
        },
        response: {
          200: {
            description: "Successful response",
            type: "object",
            properties: {}
          }
        }
      }
    },
    updateSystemController.handle
  );
}
