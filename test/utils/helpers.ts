import { Database, DOCS_TABLE_NAME, IPage, PAGES_TABLE_NAME, REPORTS_TABLE_NAME, IObjectStore } from "../../dist";
import { testData } from "./testData";

export async function addTestData(): Promise<void> {
  await Database.createTables();
  await executeInsert(testData.page, PAGES_TABLE_NAME, `(id, document_id, body, footnote)`);
  await executeInsert(testData.document, DOCS_TABLE_NAME, `(id, report_id, name, filetype)`);
  await executeInsert(testData.report, REPORTS_TABLE_NAME, `(id, title)`);
}

export function getDocsWithoutPages(): IPage[] {
  return testData.document.filter((doc) => !testData.page.find((page) => page.document_id === doc.id));
}

export function convertTestDataToStore(): IObjectStore {
  const store = {} as IObjectStore;
  Object.keys(testData).forEach((key)=> {
    //Note: object keys are never numbers, document shows number keys in the store
    store[key] = {};
    // testData[key].map((elem) => ({[elem.id]: elem}));
    testData[key].forEach((elem) => {
      //assumption key is id
      store[key][elem.id] = elem;
    });
  });
  return store;
}

/**
 * @Param fieldNames are formatted "(fieldName, fieldName)"
 * Assumes ordered and complete test data
 */
async function executeInsert(data: {[key:string]: string | number}[],
                             tableName: string,
                             fieldNames: string //could have pull these from the object keys
                            ): Promise<void> {
  const valuePlaceholders = [];
  const replacements = [];
  for(const elem of data) {
      valuePlaceholders.push(`(${Object.keys(elem).map((_key) => "?").join()})`)
      replacements.push(...Object.keys(elem).map((key) => elem[key]));
  };
  const sql = `
      INSERT INTO ${tableName}
        ${fieldNames}
      VALUES
        ${valuePlaceholders.join()}
      ON CONFLICT DO NOTHING`;
  await Database.execute(sql, replacements);
}
