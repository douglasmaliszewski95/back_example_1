import { FastifyInstance } from "fastify";
import { CheckCurrentSeasonController } from "../controllers/cron/check-current-season-controller";
import { RecalculateAllPlayersSeasonTierController } from "../controllers/cron/recalculate-all-players-season-tier-controller";
import { ListLogsController } from "../controllers/logs/list-logs-controller";

export async function logsRoutes(app: FastifyInstance) {
  const listLogsController = new ListLogsController();

  app.get('/logs/list', listLogsController.handle);
}