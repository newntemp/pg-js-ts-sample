export interface IDocument {
  id: number;
  report_id?: number;
  //assuming optional
  name?: string;
  fileType?: string;
}
