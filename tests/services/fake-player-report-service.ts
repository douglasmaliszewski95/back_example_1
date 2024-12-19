import { PlayerReportService } from "../../src/domain/user/application/services/player-report-service";
import { ReportFile, ReportOptions } from "../../src/core/@types/generic";
import { PlayersReportFilters } from "../../src/domain/user/application/services/player-report-service.types";
import { PlayersRepository } from "../../src/domain/user/application/repositories/players-repository";
import { HttpException } from "../../src/core/errors/HttpException";
import { REPORT_FILE_FORMAT } from "../../src/core/enums/report-enum";
import { HttpStatus } from "../../src/core/errors/http-status";
import { FindPlayerResponseDTO } from "../../src/domain/user/application/repositories/players-repository.types";

export class FakePlayerReportService implements PlayerReportService {
  constructor(private readonly playersRepository: PlayersRepository) {}

  public async generatePlayersReport(filters: PlayersReportFilters, options: ReportOptions): Promise<ReportFile> {
    let file: Buffer;

    switch (options.fileFormat) {
      case REPORT_FILE_FORMAT.XLSX:
        file = await this.generatePlayersReportXLSX(filters, options);
        break;
      default:
        throw new HttpException(HttpStatus.NOT_ACCEPTABLE, "File format not supported");
    }

    return {
      file,
      fileName: options.fileName,
      fileFormat: options.fileFormat
    };
  }

  private async generatePlayersReportXLSX(filters: PlayersReportFilters, options: ReportOptions): Promise<Buffer> {
    const results: FindPlayerResponseDTO[] = [];
    let currentPage = 1;
    let totalOfPages = 1;
    const limit = 100;

    do {
      const response = await this.playersRepository.listAllPlayers({
        ...filters,
        limit,
        page: currentPage,
        totalPoints: {
          start: filters.totalPointsStart,
          end: filters.totalPointsEnd
        },
        seasonPoints: {
          start: filters.seasonPointsStart,
          end: filters.seasonPointsEnd
        }
      });

      results.push(response);
      totalOfPages = response.totalOfPages;
      currentPage++;
    } while (currentPage <= totalOfPages);

    const buffer = Buffer.from(JSON.stringify(results));

    return buffer;
  }
}
