import { FastifyInstance } from "fastify";
import { VerifyUserRole } from "../middlewares/verify-user-role";
import { UserRole } from "../../../core/enums/user-role-enum";
import { AuthenticateAdminController } from "../controllers/admin/authenticate-admin-controller";
import { RequestAdminResetPasswordController } from "../controllers/admin/request-admin-reset-passoword-controller";
import { UpdateAdminPasswordController } from "../controllers/admin/update-player-password-controller";
import { InviteAdminUserController } from "../controllers/admin/invite-admin-user-controller";
import { RefreshAdminTokenController } from "../controllers/admin/refresh-admin-token-controller";
import { GetAdminInfoController } from "../controllers/admin/get-admin-info-controller";
import { ListAdminsController } from "../controllers/admin/list-admins-controller";
import { FindAdminByIdController } from "../controllers/admin/find-admin-by-id-controller";
import { UpdateAdminInfoController } from "../controllers/admin/update-admin-info-controller";
import { DeleteAdminByIdController } from "../controllers/admin/delete-admin-by-id-controller";

export async function adminRoutes(app: FastifyInstance) {
  const authenticateAdmin = new AuthenticateAdminController();
  const getAdminInfo = new GetAdminInfoController();
  const refreshToken = new RefreshAdminTokenController();
  const inviteAdmin = new InviteAdminUserController();
  const requestResetPassword = new RequestAdminResetPasswordController();
  const updatePassword = new UpdateAdminPasswordController();
  const listAdmins = new ListAdminsController();
  const findById = new FindAdminByIdController();
  const updateAdmin = new UpdateAdminInfoController();
  const deleteAdmin = new DeleteAdminByIdController();

  const verifyAdmin = new VerifyUserRole().ofRoles([UserRole.ADMIN]);

  // INVITE USER WITH ROLE ADMIN
  app.post('/admin/user', {
    onRequest: [verifyAdmin.authorize],
    schema: {
      tags: ["Admin"],
      summary: 'Create User',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        properties: {
          email: { type: 'string' },
          fullname: { type: 'string' },
        }
      },
    }
  }, inviteAdmin.handle);
  app.get('/admin/me', {
    onRequest: [verifyAdmin.authorize],
    schema: {
      tags: ["Admin"],
      summary: 'Get Admin Information',
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            fullname: { type: 'string' },
            status: { type: 'string' },
          }
        },
        401: {
          description: 'Invalid token response',
          type: 'object',
          properties: {
            statusCode: { type: 'number' },
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    }
  }, getAdminInfo.handle);

  app.get('/admin/:id', {
    schema: {
      tags: ["Admin"],
      summary: 'Find Admin by id',
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: {
            id: { type: 'string' },
            email: { type: 'string' },
            fullname: { type: 'string' },
            status: { type: 'string' },
          }
        },
        401: {
          description: 'Invalid token response',
          type: 'object',
          properties: {
            statusCode: { type: 'number' },
            error: { type: 'string' },
            message: { type: 'string' }
          }
        }
      }
    }
  }, findById.handle)
  app.put('/admin/:id', {
    schema: {
      tags: ["Admin"],
      summary: 'Update Admin Info',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        }
      },
      body: {
        type: 'object',
        properties: {
          fullname: { type: 'string' },
          status: { type: 'string' },
        }
      },
      response: {
        200: {
          description: "Successfull response",
          type: 'object',
          properties: {
            id: { type: 'string' },
            fullname: { type: 'string' },
            email: { type: 'string' },
            status: { type: 'string' },
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
  }, updateAdmin.handle);
  app.delete('/admin/:id', {
    schema: {
      tags: ["Admin"],
      summary: 'Delete Admin',
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        }
      },
      response: {
        200: {
          description: "Successfull response",
          type: 'object',
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
  }, deleteAdmin.handle);

  // DASHBOARD INFORMATION
  app.get('/admin/list-admins', {
    schema: {
      tags: ["Dashboard"],
      summary: 'List admin users',
      security: [{ bearerAuth: [] }],
      querystring: {
        type: 'object',
        properties: {
          email: { type: 'string' },
          fullname: { type: 'string' },
          status: { type: 'string' },
          page: { type: 'number' },
          limit: { type: 'number' },
        }
      },
      response: {
        200: {
          description: "Successfull response",
          type: 'object',
          properties: {
            page: { type: 'number' },
            total: { type: 'number' },
            totalOfPages: { type: 'number' },
            limit: { type: 'number' },
            list: {
              type: 'array',
              properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                fullname: { type: 'string' },
                status: { type: 'string' },
              }
            },
          }
        }
      }
    }
  }, listAdmins.handle);

  // CHANGE USER PASSWORD
  app.post('/admin/user/reset-password', {
    schema: {
      tags: ['Admin'],
      description: 'Request to reset user password',
      body: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
          }
        }
      },
      response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        },
        400: {
          description: 'Invalid credentials response',
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    }
  }, requestResetPassword.handle);
  app.put('/admin/user/change-password', {
    onRequest: [verifyAdmin.authorize],
    schema: {
      tags: ['Admin'],
      description: 'Update user password',
      security: [{ bearerAuth: [] }],
      body: {
        type: 'object',
        properties: {
          newPassword: { type: 'string' },
          refreshToken: { type: 'string' }
        }
      },
      response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        },
        400: {
          description: 'Invalid credentials response',
          type: 'object',
          properties: {
            message: { type: 'string' }
          }
        }
      }
    }
  }, updatePassword.handle);

  // SESSION ADMIN USER
  app.post('/admin/session', {
    schema: {
      tags: ["Admin"],
      summary: 'Authenticate with email and password',
      body: {
        type: 'object',
        properties: {
          email: { type: 'string' },
          password: { type: 'string' }
        }
      },
      response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: {
            token: { type: 'string' },
            refreshToken: { type: 'string' },
            expiresIn: { type: 'number' }
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
  }, authenticateAdmin.handle);
  app.post('/admin/session/refresh', {
    schema: {
      tags: ["Admin"],
      summary: 'Refresh user session',
      body: {
        type: 'object',
        properties: {
          refreshToken: { type: 'string' },
        }
      },
      response: {
        200: {
          description: 'Successful response',
          type: 'object',
          properties: {
            token: { type: 'string' },
            refreshToken: { type: 'string' },
            expiresIn: { type: 'number' }
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
  }, refreshToken.handle);
}