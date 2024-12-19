import { FastifyInstance } from "fastify";
import { verifyUserToken } from "../middlewares/verify-user-token";
import { GetCampaignsAndQuestsController } from "../controllers/campaigns/get-campaign-and-quests-controller";

export async function campaignRoutes(app: FastifyInstance) {
  const getCampaignAndQuests = new GetCampaignsAndQuestsController();

  app.get(
    "/campaigns",
    {
      onRequest: [verifyUserToken],
      schema: {
        tags: ["Campaign"],
        summary: "List Space Campaigns, Quests and user completion",
        security: [{ bearerAuth: [] }],
        querystring: {
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
              space: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  name: { type: "string" },
                  links: { type: "string" },
                  status: { type: "string" },
                  followersCount: { type: "integer" },
                  categories: {
                    type: "array",
                    items: { type: "string" }
                  }
                },
                required: ["id", "name", "links", "status", "followersCount", "categories"]
              },
              campaigns: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    numberID: { type: "integer" },
                    name: { type: "string" },
                    startDate: { type: "string" },
                    endDate: { type: "string" },
                    rewards: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          rewardPoints: { type: 'string' },
                          rewardType: { type: 'string' },
                        }
                      }
                    },
                    tasks: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          id: { type: "string" },
                          eligible: { type: "boolean" },
                          totalConditions: { type: "integer" },
                          completedConditions: { type: "integer" },
                          rewardPoints: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                rewardPoints: { type: 'string' },
                                rewardType: { type: 'string' },
                              }
                            }
                          },
                          rewardType: { type: "string" },
                          conditionToComplete: { type: "string" },
                          conditions: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                eligible: { type: "boolean" },
                                id: { type: "string" },
                                name: { type: "string" },
                                credSource: { type: "string" },
                                credType: { type: "string" },
                                lastUpdate: { type: "integer" },
                                type: { type: "string" },
                                referenceLink: { type: "string" },
                                taskLink: { type: "string" },
                                iconLink: { type: "string" },
                                description: { type: "string" }
                              },
                              required: [
                                "eligible",
                                "id",
                                "name",
                                "credSource",
                                "credType",
                                "lastUpdate",
                                "type",
                                "referenceLink",
                                "description"
                              ]
                            }
                          }
                        },
                        required: ["rewardPoints", "rewardType", "conditionToComplete", "conditions"]
                      }
                    }
                  },
                  required: ["id", "numberID", "name", "tasks"]
                }
              }
            },
            required: ["space", "campaigns"]
          }
        }
      }
    },
    getCampaignAndQuests.handle
  );
}
