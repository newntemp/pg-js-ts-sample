//tests rely on this object being structured correctly, not the best idea for maintainability
// wanted one data source for the tests and env
export const testData = {
  document: [
    { id: 8, report_id: 4, name: 'Sample Document', filetype: 'txt' },
    { id: 34, report_id: 21, name: 'Quarterly Report', filetype: 'pdf' },
    { id: 87, report_id: 21, name: 'Performance Summary', filetype: 'pdf' },
    { id: 88, report_id: 22, name: 'Performance Summary', filetype: 'pdf' }
  ],
  report: [
    { id: 4, title: 'Sample Report' },
    { id: 21, title: 'Portfolio Summary 2020' },
    { id: 22, title: 'Portfolio Summary 2020' }
  ],
  page: [
    { id: 19, document_id: 34, body: 'Lorem ipsum...', footnote: null },
    { id: 72, document_id: 87, body: 'Ut aliquet...', footnote: 'Aliquam erat...' },
    { id: 205, document_id: 34, body: 'Donec a dui et...', footnote: null },
    { id: 404, document_id: null, body: 'I have no document 4', footnote: "im not null"},
    { id: 405, document_id: null, body: 'I have no document 5', footnote: null},
    { id: 406, document_id: null, body: 'I have no document 6', footnote: null},
    { id: 407, document_id: null, body: 'I have no document 7', footnote: null},
    { id: 408, document_id: null, body: 'I have no document 8', footnote: null},
    { id: 409, document_id: 88, body: 'I have no document 8', footnote: null}
  ],
};
