import { FastifyInstance } from "fastify";
import { CheckCurrentSeasonController } from "../controllers/cron/check-current-season-controller";
import { RecalculateAllPlayersSeasonTierController } from "../controllers/cron/recalculate-all-players-season-tier-controller";
import { CheckCampaignsController } from "../controllers/cron/check-campaigns-controller";
import { CheckEmailGalxeController } from "../controllers/cron/check-email-galxe-controller";
import {SaveDepositValuesController} from "../controllers/cron/save-deposit-values-controller";

export async function cronRoutes(app: FastifyInstance) {
  const checkCurrentSeason = new CheckCurrentSeasonController()
  const recalculateSeasonTier = new RecalculateAllPlayersSeasonTierController();
  const checkCampaigns = new CheckCampaignsController();
  const checkEmailGalxe = new CheckEmailGalxeController();
  const saveDepositValues = new SaveDepositValuesController();

  app.get('/cron/check-season-cron', checkCurrentSeason.handle);
  app.get('/cron/recalculate-season-tier', recalculateSeasonTier.handle);
  app.get('/cron/check-campaigns', checkCampaigns.handle);
  app.get('/cron/check-email-galxe', checkEmailGalxe.handle);
  app.get('/cron/save-deposits', saveDepositValues.handle);
}