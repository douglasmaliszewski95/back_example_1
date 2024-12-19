import { ReportFile, ReportOptions } from "../../../../core/@types/generic";
import { PlayersReportFilters } from "./player-report-service.types";

export interface PlayerReportService {
  generatePlayersReport(filters: PlayersReportFilters, options: ReportOptions): Promise<ReportFile>;
}
