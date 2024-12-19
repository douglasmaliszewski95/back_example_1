import { Workbook } from "exceljs";
import { ReportFile, ReportOptions } from "../../../core/@types/generic";
import { REPORT_FILE_FORMAT } from "../../../core/enums/report-enum";
import { PlayersRepository } from "../../../domain/user/application/repositories/players-repository";
import { FindPlayerResponse } from "../../../domain/user/application/repositories/players-repository.types";
import { PlayerReportService } from "../../../domain/user/application/services/player-report-service";
import { PlayersReportFilters } from "../../../domain/user/application/services/player-report-service.types";
import { HttpException } from "../../../core/errors/HttpException";
import { HttpStatus } from "../../../core/errors/http-status";
import { createInviteCodeLink } from "../../../domain/user/application/helpers/invite-code";

export class PlayerReportServiceExcelJS implements PlayerReportService {
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
    let currentPage = 1;
    let totalOfPages = 1;
    const limit = 100;

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet(options.fileName);
    const header = new Set<keyof FindPlayerResponse>();

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

      const list: FindPlayerResponse[] = response.list.map(player => ({
        ...player,
        inviteCode: createInviteCodeLink(player.inviteCode)
      }));

      totalOfPages = response.totalOfPages;
      currentPage++;

      if (header.size === 0) {
        Object.keys(list[0]).forEach(key => {
          header.add(key as keyof FindPlayerResponse);
        });
        worksheet.addRow(Array.from(header));
      }

      list.forEach(player => {
        const row: (string | number | Date | null)[] = [];
        header.forEach(key => {
          row.push(player[key]);
        });
        worksheet.addRow(row);
      });
    } while (currentPage <= totalOfPages);

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer as Buffer;
  }
}
