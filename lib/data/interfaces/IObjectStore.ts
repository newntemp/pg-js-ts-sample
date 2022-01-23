import { IDocument, IPage, IReport } from "./";

export interface IObjectStore {
  document: {[key:string]: IDocument};
  page: {[key:string]: IPage};
  report: {[key:string]: IReport};
}
