import { REPORTS_TABLE_NAME } from "..";
import { DOCS_TABLE_NAME, PAGES_TABLE_NAME } from "../Database";

//documents anti join pages
// left join because we only need the document data and we want all the documents ignoring pages FK
// NOTE: tests don't create FKs
export const documentsAntiJoinPagesQuery = `
  SELECT doc.id as id
  FROM ${DOCS_TABLE_NAME} doc
  LEFT JOIN ${PAGES_TABLE_NAME} page
    ON doc.id = page.document_id
  WHERE page.document_id is NULL
`;

//reports page count
// inner join to only get reports with docs and docs with pages
export const reportAggregationQuery = `
  SELECT title, count(page.id) as "pageCount"
  FROM ${REPORTS_TABLE_NAME} r
  JOIN ${DOCS_TABLE_NAME} doc
    ON r.id = doc.report_id
  JOIN ${PAGES_TABLE_NAME} page
    ON doc.id = page.document_id
  GROUP BY r.id, title
`;
