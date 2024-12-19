import { FastifyInstance } from "fastify";
import { UserRole } from "../../../core/enums/user-role-enum";
import { GetPlayerGalxeInfoController } from "../controllers/campaigns/get-player-galxe-info-controller";
import { SinginWithGalxeController } from "../controllers/campaigns/signin-with-galxe-controller";
import { CreatePlayerInviteCodeController } from "../controllers/invite/create-player-invite-code-controller";
import { ListPlayerInviteCodesController } from "../controllers/invite/list-player-invite-codes-controller";
import { GetPlayerActivityController } from "../controllers/tasks/get-player-activity-controller";
import { AcceptPlayerInviteController } from "../controllers/user/accept-player-invite-controller";
import { AcceptTermsPlayerController } from "../controllers/user/accept-terms-player-controller";
import { AuthenticatePlayerController } from "../controllers/user/authenticate-player-controller";
import { CheckUsernameController } from "../controllers/user/check-username-controller";
import { DeletePlayerController } from "../controllers/user/delete-player-controller";
import { FindPlayerByIdController } from "../controllers/user/find-player-by-id-controller";
import { GetPlayerInfoController } from "../controllers/user/get-player-info-controller";
import { GetPlayersReportController } from "../controllers/user/get-players-report-controller";
import { InvitePlayerController } from "../controllers/user/invite-player-controller";
import { ListAllPlayersController } from "../controllers/user/list-all-players-controller";
import { ListPlayersController } from "../controllers/user/list-players-controller";
import { RefreshPlayerGalxeEmailController } from "../controllers/user/refresh-player-galxe-email-controller";
import { RefreshPlayerGalxeTelegramIdController } from "../controllers/user/refresh-player-galxe-telegram-id-controller";
import { RefreshPlayerTokenController } from "../controllers/user/refresh-player-token-controller";
import { RequestOTPPlayerController } from "../controllers/user/request-otp-player-controller";
import { RequestPlayerResetPasswordController } from "../controllers/user/request-player-reset-passoword-controller";
import { SigninWithDiscordController } from "../controllers/user/sign-in-with-discord-controller";
import { SigninWithTwitterController } from "../controllers/user/sign-in-with-twitter-controller";
import { UpdatePlayerController } from "../controllers/user/update-player-controller";
import { UpdatePlayerPasswordController } from "../controllers/user/update-player-password-controller";
import { UploadPlayerAvatarController } from "../controllers/user/upload-player-avatar-controller";
import { ValidateOTPPlayerController } from "../controllers/user/validate-otp-player-controller";
import { VerifyUserRole } from "../middlewares/verify-user-role";
import { verifyUserToken } from "../middlewares/verify-user-token";
import { ValidateCaptchaController } from "../controllers/user/validate-captcha-controller";
import { WalletAnonymousUserController } from "../controllers/user/wallet-anonymous-user-controller";
import { UserHasWalletController } from "../controllers/user/user-has-wallet-controller";
import { GetRewardPlayerController } from "../controllers/rewards/get-reward-player-controller";
import { ClaimRewardPlayerController } from "../controllers/rewards/claim-reward-player-controller";
import { ListInviteAcceptedController } from "../controllers/invite/list-invite-accepted-controller";
import { GetStakingPlayerController } from "../controllers/staking/get-staking-player-controller";
import { InsertBulltapPlayerController } from "../controllers/user/insert-bulltap-player-controller";
import { SaveDepositValuePlayerController } from "../controllers/staking/save-deposit-value-player-controller";

export async function playerRoutes(app: FastifyInstance) {
  const authenticatePlayer = new AuthenticatePlayerController();
  const getPlayerInfo = new GetPlayerInfoController();
  const findPlayerById = new FindPlayerByIdController();
  const listPlayers = new ListPlayersController();
  const refreshToken = new RefreshPlayerTokenController();
  const signinDiscord = new SigninWithDiscordController();
  const signinTwitter = new SigninWithTwitterController();
  const requestResetPassword = new RequestPlayerResetPasswordController();
  const updatePassword = new UpdatePlayerPasswordController();
  const updatePlayer = new UpdatePlayerController();
  const invitePlayer = new InvitePlayerController();
  const listAllPlayers = new ListAllPlayersController();
  const deletePlayer = new DeletePlayerController();
  const signinWithGalxe = new SinginWithGalxeController();
  const getPlayerGalxeInfo = new GetPlayerGalxeInfoController();
  const uploadPlayerAvatar = new UploadPlayerAvatarController();
  const getPlayerActivities = new GetPlayerActivityController();
  const acceptPlayerInvite = new AcceptPlayerInviteController();
  const checkUsername = new CheckUsernameController();
  const createInviteCode = new CreatePlayerInviteCodeController();
  const listPlayerInviteCodes = new ListPlayerInviteCodesController();
  const getPlayersReport = new GetPlayersReportController();
  const refreshGalxeTelegramId = new RefreshPlayerGalxeTelegramIdController();
  const refreshGalxeEmail = new RefreshPlayerGalxeEmailController();
  const acceptTerms = new AcceptTermsPlayerController();
  const requestOTP = new RequestOTPPlayerController();
  const validateOTP = new ValidateOTPPlayerController();
  // const loginAnonymousPlayer = new LoginAnonymousPlayerController();
  const validateCaptcha = new ValidateCaptchaController();
  const setWalletAnonymousUser = new WalletAnonymousUserController();
  const userHasWallet = new UserHasWalletController();
  const getRewardPlayer = new GetRewardPlayerController();
  const claimRewardPlayer = new ClaimRewardPlayerController();
  const listInviteAccepted = new ListInviteAcceptedController();
  const getStakingPlayer = new GetStakingPlayerController();
  const saveDepositValuePlayer = new SaveDepositValuePlayerController();
  const insertBulltapPlayer = new InsertBulltapPlayerController();

  const verifyAdmin = new VerifyUserRole().ofRoles([UserRole.ADMIN]);

  // USER ENDPOINTS
  // app.get(
  //   "/user/loginAnonymous",
  //   {
  //     schema: {
  //       tags: ["Users"],
  //       summary: "Login anonymous user",
  //       // security: [{ bearerAuth: [] }],
  //       querystring: {
  //         type: "object",
  //         properties: {
  //           tokenCaptcha: { type: "string" }
  //         }
  //       },
  //       response: {
  //         200: {
  //           description: "Successful response",
  //           type: "object",
  //           properties: {
  //             user: {
  //               type: "object",
  //               properties: {
  //                 id: { type: "string" },
  //                 email: { type: "string" },
  //                 is_anonymous: { type: "boolean" },
  //                 username: { type: "string" },
  //               }
  //             },
  //             session: {
  //               type: "object",
  //               properties : {
  //                 access_token: { type: "string" },
  //                 token_type: { type: "string" },
  //                 expires_in: { type: "number" },
  //                 expires_at: { type: "number" },
  //                 refresh_token: { type: "string" },
  //               }
  //             }
  //           }
  //         }
  //       }
  //     }
  //   },
  //   loginAnonymousPlayer.handle
  // );
  app.post(
    "/user/insertBulltapPlayer",
    {
      schema: {
        tags: ["Users"],
        summary: "Insert a player from Bulltap into ICE",
        body: {
          type: "object",
          properties: {
            email: { type: "string" },
            telegramId: { type: "string" },
            system: { type: "string" }
          }
        },
        response: {
          200: {
            description: "Successful response",
            type: "object",
            properties: {
              id: { type: "number" },
              providerPlayerId: { type: "string" },
              email: { type: "string" },
              username: { type: "string" },
              wallet: { type: "string" },
              galxeDiscordId: { type: "string" },
              galxeTwitterId: { type: "string" },
              galxeEmail: { type: "string" },
              galxeId: { type: "string" },
              status: { type: "string" },
              avatar: { type: "string" },
              seasonPositition: { type: "number" },
              seasonTasksCompleted: { type: "number" },
              origin: { type: "string" },
              message: { type: "string" },
              code: { type: "string" }
            }
          },
          401: {
            description: "Invalid token response",
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
    insertBulltapPlayer.handle
  );
  app.get(
    "/user/getStaking",
    {
      schema: {
        tags: ["Users"],
        summary: "Get the staking for player",
        security: [{ bearerAuth: [] }],
        querystring: {
          type: "object",
          properties: {
            wallet: { type: "string" }
          }
        },
        response: {
          200: {
            description: "Successful response",
            type: "object",
            properties: {
              id: { type: "string" },
              totalDeposit: { type: "number" },
              currency: { type: "string" },
              progress: { type: "number" },
              wallet: { type: "string" },
              createdAt: { type: "string" },
              updatedAt: { type: "string" },
              position: { type: "string" },
              totalStaked: { type: "number" }
            }
          },
          401: {
            description: "Invalid token response",
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
    getStakingPlayer.handle
  );
  app.post(
    "/user/saveDeposit",
    {
      onRequest: [verifyUserToken],
      schema: {
        tags: ["Users"],
        summary: "Save the deposit from player",
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          properties: {
            value: { type: "number" },
            wallet: { type: "string" },
            txHash: { type: "string" }
          }
        },
        response: {
          200: {
            description: "Successful response",
            type: "object",
            properties: {
              id: { type: "number" },
              providerPlayerId: { type: "string" },
              username: { type: "string" },
              totalDeposit: { type: "number" },
              currency: { type: "string" },
              progress: { type: "number" },
              wallet: { type: "string" },
              createdAt: { type: "string" },
              updatedAt: { type: "string" },
              StakingHistory: {
                type: "array",
                properties: {
                  id: { type: "number" },
                  providerPlayerId: { type: "string" },
                  stakingId: { type: "number" },
                  tokenDeposit: { type: "number" },
                  createdAt: { type: "string" },
                  updatedAt: { type: "string" }
                }
              }
            }
          },
          401: {
            description: "Invalid token response",
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
    saveDepositValuePlayer.handle
  );
  app.get(
    "/user/getReward",
    {
      onRequest: [verifyUserToken],
      schema: {
        tags: ["Users"],
        summary: "Get the reward for player to claim.",
        security: [{ bearerAuth: [] }],
        querystring: {
          type: "object",
          properties: {
            reward: { type: "string" }
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
              type: { type: "string" },
              active: { type: "boolean" },
              points: { type: "number" },
              createdAt: { type: "string" },
              updatedAt: { type: "string" },
              RewardsHistory: {
                type: "array",
                properties: {
                  id: { type: "number" },
                  providerPlayerId: { type: "string" },
                  rewardId: { type: "number" },
                  points: { type: "number" },
                  createdAt: { type: "string" },
                  availableAt: { type: "string" }
                }
              }
            }
          },
          401: {
            description: "Invalid token response",
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
    getRewardPlayer.handle
  );
  app.post(
    "/user/claimReward",
    {
      onRequest: [verifyUserToken],
      schema: {
        tags: ["Users"],
        summary: "Save the reward claim by user.",
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          properties: {
            reward: { type: "string" }
          }
        },
        response: {
          200: {
            description: "Successful response",
            type: "object",
            properties: {
              id: { type: "number" },
              providerPlayerId: { type: "string" },
              rewardId: { type: "number" },
              points: { type: "number" },
              createdAt: { type: "string" },
              availableAt: { type: "string" }
            }
          },
          401: {
            description: "Invalid token response",
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
    claimRewardPlayer.handle
  );
  app.post(
    "/user/validateCaptcha",
    {
      schema: {
        tags: ["Users"],
        summary: "Validate captcha",
        // security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          properties: {
            tokenCaptcha: { type: "string" }
          }
        },
        response: {
          200: {
            description: "Successful response",
            type: "object",
            properties: {
              success: { type: "boolean" },
              errorCode: { type: "string" }
            }
          },
          401: {
            description: "Invalid token response",
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
    validateCaptcha.handle
  );
  app.get(
    "/user/list-all",
    {
      onRequest: [verifyAdmin.authorize],
      attachValidation: true,
      schema: {
        tags: ["Users"],
        summary: "List users",
        security: [{ bearerAuth: [] }],
        querystring: {
          type: "object",
          properties: {
            page: { type: "number" },
            limit: { type: "number" },
            id: { type: "number" },
            tier: {
              type: "array",
              items: {
                type: "number"
              }
            },
            username: { type: "string" },
            email: { type: "string" },
            wallet: { type: "string" },
            seasonPointsStart: { type: "number" },
            seasonPointsEnd: { type: "number" },
            totalPointsStart: { type: "number" },
            totalPointsEnd: { type: "number" },
            startCreatedAt: { type: "string" },
            endCreatedAt: { type: "string" },
            status: {
              type: "array",
              items: {
                type: "string"
              }
            }
          }
        }
      }
    },
    listAllPlayers.handle
  );
  app.post(
    "/user/invite",
    {
      schema: {
        tags: ["Users"],
        summary: "Invite User",
        body: {
          type: "object",
          properties: {
            email: { type: "string" },
            inviteCode: { type: "string" }
          }
        },
        response: {
          201: {
            description: "Successful response",
            type: "object",
            properties: {}
          },
          400: {
            description: "Invalid property response",
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
    invitePlayer.handle
  );
  app.get(
    "/me",
    {
      onRequest: [verifyUserToken],
      schema: {
        tags: ["Users"],
        summary: "Get user profile",
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            description: "Successful response",
            type: "object",
            properties: {
              providerPlayerId: { type: "string" },
              email: { type: "string" },
              username: { type: "string" },
              wallet: { type: "string" },
              galxeDiscordId: { type: "string" },
              galxeTwitterId: { type: "string" },
              galxeTelegramId: { type: "string" },
              galxeEmail: { type: "string" },
              galxeId: { type: "string" },
              status: { type: "string" },
              avatarUrl: { type: "string" },
              seasonPositition: { type: "number" },
              seasonTasksCompleted: { type: "number" },
              origin: { type: "string" },
              reason: { type: "string" },
              inviteCode: { type: "string" },
              seasonPoints: {
                type: "object",
                properties: {
                  points: { type: "number" },
                  seasonId: { type: "number" },
                  tier: { type: "number" },
                  progress: { type: "number" }
                }
              },
              totalPoints: {
                type: "object",
                properties: {
                  points: { type: "number" },
                  tier: { type: "number" },
                  tierLastUpdatedTime: { type: "string", format: "datetime" },
                  progress: { type: "number" }
                }
              }
            }
          },
          401: {
            description: "Invalid token response",
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
    getPlayerInfo.handle
  );
  app.get(
    "/user",
    {
      schema: {
        tags: ["Users"],
        summary: "Find user by telegram id",
        querystring: {
          type: "object",
          properties: {
            id: { type: "string" },
            system: { type: "string" }
          }
        },
        response: {
          200: {
            description: "Successful response",
            type: "object",
            properties: {
              providerPlayerId: { type: "string" },
              email: { type: "string" },
              username: { type: "string" },
              wallet: { type: "string" },
              galxe: {
                type: "object",
                properties: {
                  discordId: { type: "string" },
                  twitterId: { type: "string" },
                  telegramId: { type: "string" },
                  email: { type: "string" },
                  id: { type: "string" }
                }
              },
              totalPoints: {
                type: "object",
                properties: {
                  points: { type: "number" },
                  tier: { type: "number" }
                }
              },
              seasonPoints: {
                type: "object",
                properties: {
                  points: { type: "number" },
                  tier: { type: "number" }
                }
              },
              inviteCode: { type: "string" }
            }
          },
          401: {
            description: "Invalid token response",
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
    findPlayerById.handle
  );
  app.get(
    "/user/list-by-system",
    {
      schema: {
        tags: ["Users"],
        summary: "List users by systme id",
        querystring: {
          type: "object",
          properties: {
            page: { type: "number" },
            limit: { type: "number" },
            username: { type: "string" },
            discordId: { type: "string" },
            twitterId: { type: "string" },
            email: { type: "string" },
            system: { type: "string" }
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
              totalOfPages: { type: "number" },
              list: {
                type: "array",
                items: {
                  properties: {
                    providerPlayerId: { type: "string" },
                    email: { type: "string" },
                    username: { type: "string" },
                    wallet: { type: "string" },
                    galxe: {
                      type: "object",
                      properties: {
                        discordId: { type: "string" },
                        twitterId: { type: "string" },
                        telegramId: { type: "string" },
                        email: { type: "string" },
                        id: { type: "string" }
                      }
                    },
                    totalPoints: {
                      type: "object",
                      properties: {
                        points: { type: "number" },
                        tier: { type: "number" }
                      }
                    },
                    seasonPoints: {
                      type: "object",
                      properties: {
                        points: { type: "number" },
                        tier: { type: "number" }
                      }
                    },
                    inviteCode: { type: "string" }
                  }
                }
              }
            }
          },
          401: {
            description: "Invalid token response",
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
    listPlayers.handle
  );
  app.put(
    "/user",
    {
      schema: {
        tags: ["Users"],
        description: "Update user info",
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          properties: {
            wallet: { type: "string" },
            username: { type: "string" },
            inviteCode: { type: "string" }
          }
        },
        response: {
          200: {
            description: "Successful response",
            type: "object",
            properties: {
              providerPlayerId: { type: "string" },
              email: { type: "string" },
              username: { type: "string" },
              wallet: { type: "string" },
              galxeDiscordId: { type: "string" },
              galxeTwitterId: { type: "string" },
              galxeEmail: { type: "string" },
              galxeId: { type: "string" },
              status: { type: "string" },
              avatarUrl: { type: "string" },
              origin: { type: "string" }
            }
          },
          401: {
            description: "Invalid token response",
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
    updatePlayer.handle
  );
  app.post(
    "/update/galxe",
    {
      onRequest: [verifyUserToken],
      schema: {
        tags: ["Users"],
        summary: "Update profile with galxe info",
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          properties: {
            code: { type: "string" }
          }
        },
        response: {
          200: {
            description: "Successful response",
            type: "object",
            properties: {
              providerPlayerId: { type: "string" },
              email: { type: "string" },
              username: { type: "string" },
              wallet: { type: "string" },
              galxeDiscordId: { type: "string" },
              galxeTwitterId: { type: "string" },
              galxeEmail: { type: "string" },
              galxeId: { type: "string" },
              status: { type: "string" },
              avatar: { type: "string" },
              seasonPositition: { type: "number" },
              seasonTasksCompleted: { type: "number" },
              origin: { type: "string" }
            }
          },
          401: {
            description: "Invalid token response",
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
    getPlayerGalxeInfo.handle
  );
  // USER HAS WALLET
  app.get(
    "/user/hasWallet",
    {
      onRequest: [verifyUserToken],
      schema: {
        tags: ["Users"],
        summary: "Verify if player has wallet registered",
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            description: "Successful response",
            type: "object",
            properties: {
              hasWallet: { type: "boolean" }
            }
          },
          401: {
            description: "Invalid token response",
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
    userHasWallet.handle
  );
  // WALLET ANONYMOUS USER
  app.post(
    "/user/walletAnonymousUser",
    {
      onRequest: [verifyUserToken],
      schema: {
        tags: ["Users"],
        summary: "Create player with wallet",
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          properties: {
            wallet: { type: "string" }
          }
        },
        response: {
          200: {
            description: "Successful response",
            type: "object",
            properties: {
              providerPlayerId: { type: "string" },
              email: { type: "string" },
              username: { type: "string" },
              wallet: { type: "string" },
              galxeDiscordId: { type: "string" },
              galxeTwitterId: { type: "string" },
              galxeEmail: { type: "string" },
              galxeId: { type: "string" },
              status: { type: "string" },
              avatar: { type: "string" },
              seasonPositition: { type: "number" },
              seasonTasksCompleted: { type: "number" },
              origin: { type: "string" }
            }
          },
          401: {
            description: "Invalid token response",
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
    setWalletAnonymousUser.handle
  );
  app.put(
    "/user/avatar/:id",
    {
      schema: {
        tags: ["Users"],
        summary: "Upload Player Avatar",
        consumes: ["multipart/form-data"],
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          properties: {
            id: { type: "string" }
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
              providerPlayerId: { type: "string" },
              email: { type: "string" },
              username: { type: "string" },
              wallet: { type: "string" },
              galxeDiscordId: { type: "string" },
              galxeTwitterId: { type: "string" },
              galxeEmail: { type: "string" },
              galxeId: { type: "string" },
              status: { type: "string" },
              avatarUrl: { type: "string" },
              seasonPositition: { type: "number" },
              seasonTasksCompleted: { type: "number" },
              origin: { type: "string" }
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
    uploadPlayerAvatar.handle
  );
  app.get(
    "/user/activity",
    {
      onRequest: [verifyUserToken],
      schema: {
        tags: ["Users"],
        summary: "List users activities",
        security: [{ bearerAuth: [] }],
        querystring: {
          type: "object",
          properties: {
            page: { type: "number" },
            limit: { type: "number" },
            username: { type: "string" }
          }
        },
        response: {
          200: {
            description: "Successfull response",
            type: "object",
            properties: {
              currentPage: { type: "number" },
              limit: { type: "number" },
              total: { type: "number" },
              nrOfPages: { type: "number" },
              items: {
                type: "array",
                items: {
                  properties: {
                    providerPlayerId: { type: "string" },
                    username: { type: "string" },
                    avatarUrl: { type: "string" },
                    seasonTier: { type: "number" },
                    activity: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        type: { type: "string" },
                        reward: { type: "number" },
                        lastUpdate: { type: "string" },
                        tasks: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              id: { type: "string" },
                              name: { type: "string" },
                              imageUrl: { type: "string" }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          400: {
            description: "Invalid token response",
            type: "object",
            properties: {
              statusCode: { type: "number" },
              error: { type: "string" },
              message: { type: "string" }
            }
          },
          401: {
            description: "Invalid token response",
            type: "object",
            properties: {
              statusCode: { type: "number" },
              error: { type: "string" },
              message: { type: "string" }
            }
          },
          422: {
            description: "Invalid token response",
            type: "object",
            properties: {
              statusCode: { type: "number" },
              error: { type: "string" },
              message: { type: "string" }
            }
          },
          404: {
            description: "Invalid token response",
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
    getPlayerActivities.handle
  );
  app.get(
    "/user/check/:username",
    {
      schema: {
        tags: ["Users"],
        summary: "Check username",
        params: {
          type: "object",
          properties: {
            username: { type: "string" }
          }
        },
        response: {
          200: {
            description: "Successfull response",
            type: "object",
            properties: {
              valid: { type: "boolean" }
            }
          },
          400: {
            description: "Invalid token response",
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
    checkUsername.handle
  );

  // SESSION ENDPOINTS
  app.get(
    "/session/discord",
    {
      schema: {
        tags: ["Users"],
        summary: "Authenticate with discord",
        querystring: {
          type: "object",
          properties: {
            inviteCode: { type: "string" }
          }
        }
      }
    },
    signinDiscord.handle
  );
  app.get(
    "/session/twitter",
    {
      schema: {
        tags: ["Users"],
        summary: "Authenticate with twitter",
        querystring: {
          type: "object",
          properties: {
            inviteCode: { type: "string" }
          }
        }
      }
    },
    signinTwitter.handle
  );
  app.get(
    "/session/galxe",
    {
      schema: {
        tags: ["Users"],
        summary: "Signin with galxe"
      }
    },
    signinWithGalxe.handle
  );
  app.post(
    "/session",
    {
      schema: {
        tags: ["Users"],
        summary: "Authenticate with email and password",
        body: {
          type: "object",
          properties: {
            email: { type: "string" },
            password: { type: "string" }
          }
        },
        response: {
          200: {
            description: "Successful response",
            type: "object",
            properties: {
              token: { type: "string" },
              refreshToken: { type: "string" },
              expiresIn: { type: "number" }
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
    authenticatePlayer.handle
  );
  app.post(
    "/session/refresh",
    {
      schema: {
        tags: ["Users"],
        summary: "Refresh user session",
        body: {
          type: "object",
          properties: {
            refreshToken: { type: "string" }
          }
        },
        response: {
          200: {
            description: "Successful response",
            type: "object",
            properties: {
              token: { type: "string" },
              refreshToken: { type: "string" },
              expiresIn: { type: "number" }
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
    refreshToken.handle
  );
  app.get(
    "/connect-bulltap",
    {
      onRequest: [verifyUserToken],
      schema: {
        tags: ["Users"],
        summary: "Get user profile",
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            description: "Successful response",
            type: "object",
            properties: {
              providerPlayerId: { type: "string" },
              email: { type: "string" },
              username: { type: "string" },
              wallet: { type: "string" },
              galxeDiscordId: { type: "string" },
              galxeTwitterId: { type: "string" },
              galxeTelegramId: { type: "string" },
              galxeEmail: { type: "string" },
              galxeId: { type: "string" },
              status: { type: "string" },
              avatarUrl: { type: "string" },
              seasonPositition: { type: "number" },
              seasonTasksCompleted: { type: "number" },
              origin: { type: "string" },
              inviteCode: { type: "string" },
              seasonPoints: {
                type: "object",
                properties: {
                  points: { type: "number" },
                  seasonId: { type: "number" },
                  tier: { type: "number" },
                  progress: { type: "number" }
                }
              },
              totalPoints: {
                type: "object",
                properties: {
                  points: { type: "number" },
                  tier: { type: "number" },
                  tierLastUpdatedTime: { type: "string", format: "datetime" },
                  progress: { type: "number" }
                }
              }
            }
          },
          401: {
            description: "Invalid token response",
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
    refreshGalxeTelegramId.handle
  );

  // GET EMAIL FROM GALXE
  app.get(
    "/connect-email-galxe",
    {
      onRequest: [verifyUserToken],
      schema: {
        tags: ["Users"],
        summary: "Get email from galxe",
        security: [{ bearerAuth: [] }],
        // querystring: {
        //   type: "object",
        //   properties: {
        //     tokenGalxe: { type: "string" },
        //     refreshToken: { type: "string" }
        //   }
        // },
        response: {
          200: {
            description: "Successful response",
            type: "object",
            properties: {
              providerPlayerId: { type: "string" },
              email: { type: "string" },
              username: { type: "string" },
              wallet: { type: "string" },
              galxeDiscordId: { type: "string" },
              galxeTwitterId: { type: "string" },
              galxeEmail: { type: "string" },
              galxeId: { type: "string" },
              status: { type: "string" },
              avatar: { type: "string" },
              seasonPositition: { type: "number" },
              seasonTasksCompleted: { type: "number" },
              origin: { type: "string" }
            }
          },
          401: {
            description: "Invalid token response",
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
    refreshGalxeEmail.handle
  );

  // ACCEPT TERMS
  app.post(
    "/user/accept-terms",
    {
      onRequest: [verifyUserToken],
      schema: {
        tags: ["Users"],
        summary: "Save the acception of terms",
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          properties: {
            accepted: { type: "boolean" },
            inviteCode: { type: "string" },
            tokenGalxe: { type: "string" },
            refreshToken: { type: "string" }
          }
        },
        response: {
          200: {
            description: "Successful response",
            type: "object",
            properties: {
              providerPlayerId: { type: "string" },
              email: { type: "string" },
              username: { type: "string" },
              wallet: { type: "string" },
              galxeDiscordId: { type: "string" },
              galxeTwitterId: { type: "string" },
              galxeEmail: { type: "string" },
              galxeId: { type: "string" },
              status: { type: "string" },
              avatar: { type: "string" },
              seasonPositition: { type: "number" },
              seasonTasksCompleted: { type: "number" },
              origin: { type: "string" },
              message: { type: "string" },
              code: { type: "string" }
            }
          },
          400: {
            description: "Invalid token response",
            type: "object",
            properties: {
              statusCode: { type: "number" },
              code: { type: "string" },
              error: { type: "string" },
              message: { type: "string" }
            }
          },
          401: {
            description: "Invalid code response",
            type: "object",
            properties: {
              code: { type: "string" },
              message: { type: "string" }
            }
          }
        }
      }
    },
    acceptTerms.handle
  );

  // OTP REQUEST
  app.get(
    "/user/otp-request",
    {
      onRequest: [verifyUserToken],
      schema: {
        tags: ["Users"],
        summary: "Request a OTP for login",
        security: [{ bearerAuth: [] }],
        querystring: {
          type: "object",
          properties: {
            email: { type: "string" }
          }
        },
        response: {
          200: {
            description: "Successful response",
            type: "object",
            properties: {
              data: {
                type: "object",
                properties: {
                  user: { type: "string" },
                  session: { type: "string" }
                }
              },
              error: { type: "string" }
            }
          },
          401: {
            description: "Invalid token response",
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
    requestOTP.handle
  );

  // OTP VALIDATION
  app.post(
    "/user/validate-otp",
    {
      onRequest: [verifyUserToken],
      schema: {
        tags: ["Users"],
        summary: "Validate OTP code to sign in",
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          properties: {
            tokenOTP: { type: "string" },
            email: { type: "string" }
          }
        },
        response: {
          200: {
            description: "Successful response",
            type: "object",
            properties: {
              access_token: { type: "string" },
              token_type: { type: "string" },
              expires_in: { type: "number" },
              refresh_token: { type: "string" }
            }
          },
          401: {
            description: "Invalid token response",
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
    validateOTP.handle
  );

  // PASSWORD RESET ENDPOINTS
  app.post(
    "/user/reset-password",
    {
      schema: {
        tags: ["Users"],
        description: "Request to reset user password",
        body: {
          type: "object",
          properties: {
            email: {
              type: "string"
            }
          }
        },
        response: {
          200: {
            description: "Successful response",
            type: "object",
            properties: {
              message: { type: "string" }
            }
          },
          400: {
            description: "Invalid credentials response",
            type: "object",
            properties: {
              message: { type: "string" }
            }
          }
        }
      }
    },
    requestResetPassword.handle
  );
  app.put(
    "/user/change-password",
    {
      onRequest: [verifyUserToken],
      schema: {
        tags: ["Users"],
        description: "Update user password",
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          properties: {
            newPassword: { type: "string" },
            refreshToken: { type: "string" }
          }
        },
        response: {
          200: {
            description: "Successful response",
            type: "object",
            properties: {
              // message: { type: "string" }
              token: { type: "string" },
              refreshToken: { type: "string" },
              expiresIn: { type: "number" }
            }
          },
          400: {
            description: "Invalid credentials response",
            type: "object",
            properties: {
              message: { type: "string" }
            }
          }
        }
      }
    },
    updatePassword.handle
  );

  // EXCLUSIVE FOR TESTING PURPOUSES
  app.delete(
    "/user/:id",
    {
      schema: {
        tags: ["Users"],
        summary: "Delete user by id",
        querystring: {
          type: "object",
          properties: {
            providerPlayerId: { type: "string" },
            username: { type: "string" },
            email: { type: "string" }
          }
        },
        response: {
          200: {
            description: "Successful response",
            type: "object"
          },
          401: {
            description: "Invalid token response",
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
    deletePlayer.handle
  );

  // INVITE ENDPOINTS
  app.post(
    "/invite",
    {
      schema: {
        tags: ["Users"],
        description: "Accept Another Players Invite",
        body: {
          type: "object",
          properties: {
            inviteCode: { type: "string" },
            invitedProviderPlayerId: { type: "string" }
          }
        }
      }
    },
    acceptPlayerInvite.handle
  );

  app.post(
    "/invite-code",
    {
      onRequest: [verifyUserToken],
      schema: {
        tags: ["Users"],
        description: "Create user invite code",
        body: {
          type: "object",
          properties: {
            providerPlayerId: { type: "string" },
            inviteCode: { type: "string" },
            expiresIn: { type: "string" }
          }
        },
        response: {
          201: {
            description: "Successful response",
            properties: {}
          },
          400: {
            description: "Invalid credentials response",
            type: "object",
            properties: {
              message: { type: "string" }
            }
          },
          422: {
            description: "Unprocessable Entity",
            type: "object",
            properties: {
              message: { type: "string" }
            }
          }
        }
      }
    },
    createInviteCode.handle
  );
  app.get(
    "/invite-code/list/:id",
    {
      onRequest: [verifyUserToken],
      schema: {
        tags: ["Users"],
        description: "List user invite codes",
        querystring: {
          type: "object",
          properties: {
            page: { type: "number" },
            limit: { type: "number" }
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
              totalOfPages: { type: "number" },
              list: {
                type: "array",
                items: {
                  properties: {
                    id: { type: "number" },
                    inviteCode: { type: "string" },
                    expiresIn: { type: "string" },
                    providerPlayerId: { type: "string" },
                    acceptedQuantity: { type: "number" }
                  }
                }
              }
            }
          },
          400: {
            description: "Invalid credentials response",
            type: "object",
            properties: {
              message: { type: "string" }
            }
          },
          422: {
            description: "Unprocessable Entity",
            type: "object",
            properties: {
              message: { type: "string" }
            }
          }
        }
      }
    },
    listPlayerInviteCodes.handle
  );
  app.get(
    "/user/report/all",
    {
      onRequest: [verifyAdmin.authorize],
      attachValidation: true,
      schema: {
        tags: ["Users"],
        summary: "Generate users report",
        security: [{ bearerAuth: [] }],
        querystring: {
          type: "object",
          properties: {
            id: { type: "number" },
            tier: {
              type: "array",
              items: {
                type: "number"
              }
            },
            username: { type: "string" },
            email: { type: "string" },
            wallet: { type: "string" },
            seasonPointsStart: { type: "number" },
            seasonPointsEnd: { type: "number" },
            totalPointsStart: { type: "number" },
            totalPointsEnd: { type: "number" },
            startCreatedAt: { type: "string" },
            endCreatedAt: { type: "string" },
            status: {
              type: "array",
              items: {
                type: "string"
              }
            }
          }
        }
      }
    },
    getPlayersReport.handle
  );
  app.get(
    "/inviteAccepted/:id",
    {
      onRequest: [verifyUserToken],
      schema: {
        tags: ["Users"],
        summary: "List user who accepted the invite from a player",
        security: [{ bearerAuth: [] }],
        querystring: {
          type: "object",
          properties: {
            page: { type: "number" },
            limit: { type: "number" }
          }
        },
        response: {
          200: {
            description: "Successful response",
            type: "object",
            properties: {
              currentPage: { type: "number" },
              limit: { type: "number" },
              total: { type: "number" },
              nrOfPages: { type: "number" },
              items: {
                type: "array",
                items: {
                  properties: {
                    id: { type: "number" },
                    invitedProviderPlayerId: { type: "string" },
                    invitingProviderPlayerId: { type: "string" },
                    invitedPlayer: {
                      username: { type: "string" }
                    },
                    inviteCode: { type: "string" },
                    createdAt: { type: "string" }
                  }
                }
              }
            }
          },
          400: {
            description: "Invalid credentials response",
            type: "object",
            properties: {
              message: { type: "string" }
            }
          },
          422: {
            description: "Unprocessable Entity",
            type: "object",
            properties: {
              message: { type: "string" }
            }
          }
        }
      }
    },
    listInviteAccepted.handle
  );
}
