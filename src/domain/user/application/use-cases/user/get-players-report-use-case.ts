import { ReportFile } from "../../../../../core/@types/generic";
import { PlayerReportService } from "../../services/player-report-service";
import { PlayersReportFilters } from "../../services/player-report-service.types";

export class GetPlayersReportUseCase {
  constructor(private readonly playersReportService: PlayerReportService) {}

  async execute(filters: PlayersReportFilters): Promise<ReportFile> {
    return this.playersReportService.generatePlayersReport(filters, {
      fileFormat: "xlsx",
      fileName: "players-report"
    });
  }
}
