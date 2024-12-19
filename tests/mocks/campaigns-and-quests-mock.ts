import { GetCampaignsAndQuestsResponse } from "../../src/domain/campaign/application/gateway/campaign-gateway.types";

export class CampaignsAndQuestsMocks {
  static listCampaignsAndQuests(): GetCampaignsAndQuestsResponse {
    return {
      space: {
        id: "58962",
        name: "Credbull",
        links: "{\"Discord\":\"https://discord.gg/kR7ZnETYAf\",\"HomePage\":\"https://credbull.io/\",\"Telegram\":\"https://t.me/CredbullMain\"}",
        status: "Standard",
        followersCount: 480,
        categories: [
          "DeFi",
          "YieldFarming",
          "Web3"
        ]
      },
      campaigns: [
        {
          id: "GCyGytvKpt",
          numberID: 309359,
          name: "Join the inCredbull Earn",
          tasks: [
            {
              rewardPoints: [
                {
                  rewardPoints: "1",
                  rewardType: "LOYALTYPOINTS"
                }
              ],
              rewardType: "LOYALTYPOINTS",
              conditionToComplete: "ALL",
              conditions: [
                {
                  eligible: false,
                  id: "440512974617231360",
                  name: "Join the @CredbullMain on Telegram",
                  credSource: "JOIN_TELEGRAM",
                  credType: "TELEGRAM",
                  lastUpdate: 1722261682,
                  type: "TELEGRAM",
                  referenceLink: "https://t.me/CredbullMain",
                  description: "Users who have joined the @CredbullMain on Telegram.",
                  taskLink: "https://app.galxe.com/quest/credential/440512974617231360",
                  iconLink: "https://vdirldwosaqsbzhgxylo.supabase.co/storage/v1/object/public/incredbull_dev/reward_point.png"
                },
                {
                  eligible: false,
                  id: "443035889057222656",
                  name: "Join the @inCredbullEarn on Telegram",
                  credSource: "JOIN_TELEGRAM",
                  credType: "TELEGRAM",
                  lastUpdate: 1722863188,
                  type: "TELEGRAM",
                  referenceLink: "https://t.me/inCredbullEarn",
                  description: "Users who have joined the @inCredbullEarn on Telegram.",
                  taskLink: "https://app.galxe.com/quest/credential/443035889057222656",
                  iconLink: "https://vdirldwosaqsbzhgxylo.supabase.co/storage/v1/object/public/incredbull_dev/reward_point.png"
                },
                {
                  eligible: false,
                  id: "400628037181280256",
                  name: "credbullDeFi - Twitter Followers",
                  credSource: "TWITTER_FOLLOW",
                  credType: "TWITTER",
                  lastUpdate: 1712752369,
                  type: "TWITTER",
                  referenceLink: "https://twitter.com/intent/follow?screen_name=credbullDeFi",
                  description: "credbullDeFi‘s Twitter followers",
                  taskLink: "https://app.galxe.com/quest/credential/400628037181280256",
                  iconLink: "https://vdirldwosaqsbzhgxylo.supabase.co/storage/v1/object/public/incredbull_dev/reward_point.png"
                }
              ],
              id: "3093590000",
              eligible: false,
              totalConditions: 3,
              completedConditions: 0
            },
            {
              rewardPoints: [
                {
                  rewardPoints: "10",
                  rewardType: "LOYALTYPOINTS"
                }
              ],
              rewardType: "LOYALTYPOINTS",
              conditionToComplete: "ALL",
              conditions: [
                {
                  eligible: false,
                  id: "443170244744187904",
                  name: "Refer Friends to Participate in Join the inCredbull Earn",
                  credSource: "CAMPAIGN_REFERRAL",
                  credType: "GALXE_ID",
                  lastUpdate: 1722895457,
                  type: "GALXE_ID",
                  referenceLink: "",
                  description: "Refer friends to participate in [Join the inCredbull Earn](https://galxe.com/Credbull/campaign/GCyGytvKpt). It must be the referee’s first time to participate in the campaign.",
                  taskLink: "https://app.galxe.com/quest/credential/443170244744187904",
                  iconLink: "https://vdirldwosaqsbzhgxylo.supabase.co/storage/v1/object/public/incredbull_dev/reward_point.png"
                }
              ],
              id: "3093590001",
              eligible: false,
              totalConditions: 1,
              completedConditions: 0
            }
          ],
          startDate: new Date("2024-08-05T03:00:00.000Z"),
          endDate: new Date("2024-08-06T03:00:00.000Z"),
          rewards: []
        },
        {
          id: "GCYE5tkFwz",
          numberID: 305482,
          name: "$100,000 Worth of Credbull $CBL Airdrops on Arbitrum!",
          tasks: [
            {
              rewardPoints: [
                {
                  rewardPoints: "1",
                  rewardType: "OAT"
                },
                {
                  rewardPoints: "20",
                  rewardType: "LOYALTYPOINTS"
                }
              ],
              rewardType: "OAT LOYALTYPOINTS",
              conditionToComplete: "ALL",
              conditions: [
                {
                  eligible: false,
                  id: "440518879127568384",
                  name: "Visit the Aidrdop page and connect your Arbitrum wallet",
                  credSource: "VISIT_LINK",
                  credType: "EVM_ADDRESS",
                  lastUpdate: 1722263089,
                  type: "EVM_ADDRESS",
                  referenceLink: "https://www.incredbull.io/100k",
                  description: "The users who have visited the Aidrdop page and connect your Arbitrum wallet page.",
                  taskLink: "https://app.galxe.com/quest/credential/440518879127568384",
                  iconLink: "https://vdirldwosaqsbzhgxylo.supabase.co/storage/v1/object/public/incredbull_dev/reward_point.png"
                }
              ],
              id: "3054820003",
              eligible: false,
              totalConditions: 1,
              completedConditions: 0
            },
            {
              rewardPoints: [
                {
                  rewardPoints: "1",
                  rewardType: "OAT"
                },
                {
                  rewardPoints: "20",
                  rewardType: "LOYALTYPOINTS"
                }
              ],
              rewardType: "OAT LOYALTYPOINTS",
              conditionToComplete: "ANY",
              conditions: [
                {
                  eligible: false,
                  id: "440458318817980416",
                  name: "Lend a minimum of 1 USDC to qualify",
                  credSource: "CONTRACT_QUERY",
                  credType: "EVM_ADDRESS",
                  lastUpdate: 1722262651,
                  type: "EVM_ADDRESS",
                  referenceLink: "https://www.incredbull.io/100k",
                  description: "Lend atleast 1 USDC into the inCredbull vault on Arbitrum.\n\nThe higher your deposit, the greater your reward.",
                  taskLink: "https://app.galxe.com/quest/credential/440458318817980416",
                  iconLink: "https://vdirldwosaqsbzhgxylo.supabase.co/storage/v1/object/public/incredbull_dev/reward_point.png"
                },
                {
                  eligible: false,
                  id: "440326631945498624",
                  name: "Lend a minimum of 1 USDT to qualify",
                  credSource: "CONTRACT_QUERY",
                  credType: "EVM_ADDRESS",
                  lastUpdate: 1722262678,
                  type: "EVM_ADDRESS",
                  referenceLink: "https://www.incredbull.io/100k",
                  description: "Lend atleast 1 USDT into the inCredbull vault on Arbitrum.\n\nThe higher your deposit, the greater your reward.",
                  taskLink: "https://app.galxe.com/quest/credential/440326631945498624",
                  iconLink: "https://vdirldwosaqsbzhgxylo.supabase.co/storage/v1/object/public/incredbull_dev/reward_point.png"
                }
              ],
              id: "3054820000",
              eligible: false,
              totalConditions: 2,
              completedConditions: 0
            },
            {
              rewardPoints: [
                {
                  rewardPoints: "1",
                  rewardType: "OAT"
                },
                {
                  rewardPoints: "20",
                  rewardType: "LOYALTYPOINTS"
                }
              ],
              rewardType: "OAT LOYALTYPOINTS",
              conditionToComplete: "ALL",
              conditions: [
                {
                  eligible: false,
                  id: "440512974617231360",
                  name: "Join the @CredbullMain on Telegram",
                  credSource: "JOIN_TELEGRAM",
                  credType: "TELEGRAM",
                  lastUpdate: 1722261682,
                  type: "TELEGRAM",
                  referenceLink: "https://t.me/CredbullMain",
                  description: "Users who have joined the @CredbullMain on Telegram.",
                  taskLink: "https://app.galxe.com/quest/credential/440512974617231360",
                  iconLink: "https://vdirldwosaqsbzhgxylo.supabase.co/storage/v1/object/public/incredbull_dev/reward_point.png"
                },
                {
                  eligible: false,
                  id: "400628037181280256",
                  name: "credbullDeFi - Twitter Followers",
                  credSource: "TWITTER_FOLLOW",
                  credType: "TWITTER",
                  lastUpdate: 1712752369,
                  type: "TWITTER",
                  referenceLink: "https://twitter.com/intent/follow?screen_name=credbullDeFi",
                  description: "credbullDeFi‘s Twitter followers",
                  taskLink: "https://app.galxe.com/quest/credential/400628037181280256",
                  iconLink: "https://vdirldwosaqsbzhgxylo.supabase.co/storage/v1/object/public/incredbull_dev/reward_point.png"
                },
                {
                  eligible: false,
                  id: "440519446071627776",
                  name: "CREDBULL Discord Verified",
                  credSource: "DISCORD_MEMBER",
                  credType: "DISCORD",
                  lastUpdate: 1722263225,
                  type: "DISCORD",
                  referenceLink: "https://discord.gg/xgqgTkQSKS",
                  description: "CREDBULL Discord members who have Verified role.",
                  taskLink: "https://app.galxe.com/quest/credential/440519446071627776",
                  iconLink: "https://vdirldwosaqsbzhgxylo.supabase.co/storage/v1/object/public/incredbull_dev/reward_point.png"
                }
              ],
              id: "3054820002",
              eligible: false,
              totalConditions: 3,
              completedConditions: 0
            }
          ],
          startDate: new Date("2024-07-29T14:39:30.000Z"),
          endDate: null,
          rewards: []
        },
        {
          id: "GCSJfthNm1",
          numberID: 286326,
          name: "Welcome to Credbull",
          tasks: [
            {
              rewardPoints: [
                {
                  rewardPoints: "25",
                  rewardType: "LOYALTYPOINTS"
                }
              ],
              rewardType: "LOYALTYPOINTS",
              conditionToComplete: "ALL",
              conditions: [
                {
                  eligible: false,
                  id: "400628037181280256",
                  name: "credbullDeFi - Twitter Followers",
                  credSource: "TWITTER_FOLLOW",
                  credType: "TWITTER",
                  lastUpdate: 1712752369,
                  type: "TWITTER",
                  referenceLink: "https://twitter.com/intent/follow?screen_name=credbullDeFi",
                  description: "credbullDeFi‘s Twitter followers",
                  taskLink: "https://app.galxe.com/quest/credential/400628037181280256",
                  iconLink: "https://vdirldwosaqsbzhgxylo.supabase.co/storage/v1/object/public/incredbull_dev/reward_point.png"
                },
                {
                  eligible: false,
                  id: "403088054073430016",
                  name: "Join the @CredbullMain on Telegram",
                  credSource: "JOIN_TELEGRAM",
                  credType: "TELEGRAM",
                  lastUpdate: 1713338882,
                  type: "TELEGRAM",
                  referenceLink: "https://t.me/CredbullMain",
                  description: "Users who have joined the @CredbullMain on Telegram.",
                  taskLink: "https://app.galxe.com/quest/credential/403088054073430016",
                  iconLink: "https://vdirldwosaqsbzhgxylo.supabase.co/storage/v1/object/public/incredbull_dev/reward_point.png"
                },
                {
                  eligible: false,
                  id: "403088054098624512",
                  name: "CREDBULL Discord Verified",
                  credSource: "DISCORD_MEMBER",
                  credType: "DISCORD",
                  lastUpdate: 1713338882,
                  type: "DISCORD",
                  referenceLink: "https://discord.gg/kR7ZnETYAf",
                  description: "CREDBULL Discord members who have Verified role.",
                  taskLink: "https://app.galxe.com/quest/credential/403088054098624512",
                  iconLink: "https://vdirldwosaqsbzhgxylo.supabase.co/storage/v1/object/public/incredbull_dev/reward_point.png"
                }
              ],
              id: "2863260001",
              eligible: false,
              totalConditions: 3,
              completedConditions: 0
            },
            {
              rewardPoints: [
                {
                  rewardPoints: "25",
                  rewardType: "LOYALTYPOINTS"
                }
              ],
              rewardType: "LOYALTYPOINTS",
              conditionToComplete: "ALL",
              conditions: [
                {
                  eligible: true,
                  id: "403577370251943936",
                  name: "credbullDeFi - Tweet Retweeters - Tweet 1780987242028109889",
                  credSource: "TWITTER_RT",
                  credType: "TWITTER",
                  lastUpdate: 1713455544,
                  type: "TWITTER",
                  referenceLink: "https://twitter.com/intent/retweet?tweet_id=1780987242028109889",
                  description: "credbullDeFi's [Tweet](https://twitter.com/credbullDeFi/status/1780987242028109889) retweeters",
                  taskLink: "https://app.galxe.com/quest/credential/403577370251943936",
                  iconLink: "https://vdirldwosaqsbzhgxylo.supabase.co/storage/v1/object/public/incredbull_dev/reward_point.png"
                }
              ],
              id: "2863260006",
              eligible: true,
              totalConditions: 1,
              completedConditions: 0
            },
            {
              rewardPoints: [
                {
                  rewardPoints: "30",
                  rewardType: "LOYALTYPOINTS"
                }
              ],
              rewardType: "LOYALTYPOINTS",
              conditionToComplete: "ALL",
              conditions: [
                {
                  eligible: false,
                  id: "403088169630756864",
                  name: "CREDBULL Discord Matador",
                  credSource: "DISCORD_MEMBER",
                  credType: "DISCORD",
                  lastUpdate: 1713338910,
                  type: "DISCORD",
                  referenceLink: "https://discord.gg/kR7ZnETYAf",
                  description: "CREDBULL Discord members who have Matador role.",
                  taskLink: "https://app.galxe.com/quest/credential/403088169630756864",
                  iconLink: "https://vdirldwosaqsbzhgxylo.supabase.co/storage/v1/object/public/incredbull_dev/reward_point.png"
                }
              ],
              id: "2863260002",
              eligible: false,
              totalConditions: 1,
              completedConditions: 0
            },
            {
              rewardPoints: [
                {
                  rewardPoints: "50",
                  rewardType: "LOYALTYPOINTS"
                }
              ],
              rewardType: "LOYALTYPOINTS",
              conditionToComplete: "ALL",
              conditions: [
                {
                  eligible: false,
                  id: "403088269849460736",
                  name: "CREDBULL Discord Bullfighter",
                  credSource: "DISCORD_MEMBER",
                  credType: "DISCORD",
                  lastUpdate: 1713338934,
                  type: "DISCORD",
                  referenceLink: "https://discord.gg/kR7ZnETYAf",
                  description: "CREDBULL Discord members who have Bullfighter role.",
                  taskLink: "https://app.galxe.com/quest/credential/403088269849460736",
                  iconLink: "https://vdirldwosaqsbzhgxylo.supabase.co/storage/v1/object/public/incredbull_dev/reward_point.png"
                }
              ],
              id: "2863260003",
              eligible: false,
              totalConditions: 1,
              completedConditions: 0
            },
            {
              rewardPoints: [
                {
                  rewardPoints: "100",
                  rewardType: "LOYALTYPOINTS"
                }
              ],
              rewardType: "LOYALTYPOINTS",
              conditionToComplete: "ALL",
              conditions: [
                {
                  eligible: false,
                  id: "403088447234936832",
                  name: "CREDBULL Discord Mogul",
                  credSource: "DISCORD_MEMBER",
                  credType: "DISCORD",
                  lastUpdate: 1713338976,
                  type: "DISCORD",
                  referenceLink: "https://discord.gg/kR7ZnETYAf",
                  description: "CREDBULL Discord members who have Mogul role.",
                  taskLink: "https://app.galxe.com/quest/credential/403088447234936832",
                  iconLink: "https://vdirldwosaqsbzhgxylo.supabase.co/storage/v1/object/public/incredbull_dev/reward_point.png"
                }
              ],
              id: "2863260005",
              eligible: false,
              totalConditions: 1,
              completedConditions: 0
            },
            {
              rewardPoints: [
                {
                  rewardPoints: "75",
                  rewardType: "LOYALTYPOINTS"
                }
              ],
              rewardType: "LOYALTYPOINTS",
              conditionToComplete: "ALL",
              conditions: [
                {
                  eligible: false,
                  id: "403088371825541120",
                  name: "CREDBULL Discord Leviathan",
                  credSource: "DISCORD_MEMBER",
                  credType: "DISCORD",
                  lastUpdate: 1713338958,
                  type: "DISCORD",
                  referenceLink: "https://discord.gg/kR7ZnETYAf",
                  description: "CREDBULL Discord members who have Leviathan role.",
                  taskLink: "https://app.galxe.com/quest/credential/403088371825541120",
                  iconLink: "https://vdirldwosaqsbzhgxylo.supabase.co/storage/v1/object/public/incredbull_dev/reward_point.png"
                }
              ],
              id: "2863260004",
              eligible: false,
              totalConditions: 1,
              completedConditions: 0
            }
          ],
          startDate: new Date("2024-04-16T22:00:00.000Z"),
          endDate: null,
          rewards: []
        }
      ],
    }
  }
}