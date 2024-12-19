import { GetPlayersReportUseCase } from "../../../../../domain/user/application/use-cases/user/get-players-report-use-case";
import { PrismaPlayersRepository } from "../../../../database/prisma-repositories/prisma-players-repository";
import { PlayerReportServiceExcelJS } from "../../../../services/user/player-report-service-exceljs";

export function makeGetPlayersReportUseCase() {
  const playersRepository = new PrismaPlayersRepository();
  const playerReportService = new PlayerReportServiceExcelJS(playersRepository);
  return new GetPlayersReportUseCase(playerReportService);
}
