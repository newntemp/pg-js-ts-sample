export interface IReport {
  id: number;
  title?: string;
}

export interface IReportPageCount extends IReport {
  pageCount?: string | number;
}
