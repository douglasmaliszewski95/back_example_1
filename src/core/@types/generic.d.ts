import { ReportFileFormat } from "../enums/report-enum";

export type ReportOptions = {
  fileFormat: ReportFileFormat;
  fileName: string;
};

export type ReportFile = {
  file: Buffer;
  fileName: string;
  fileFormat: ReportFileFormat;
};
