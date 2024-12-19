export enum REPORT_FILE_FORMAT {
  XLSX = "xlsx",
  CSV = "csv"
}

export type ReportFileFormat = `${REPORT_FILE_FORMAT}`;

export const ReportFileContentType = {
  [REPORT_FILE_FORMAT.XLSX]: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  [REPORT_FILE_FORMAT.CSV]: "text/csv"
};
