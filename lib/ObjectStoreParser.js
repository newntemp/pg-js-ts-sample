/**
 * Relies on the IObjectStore using the entries ID as the key for its domain object
 * EX {domain: {"1": {id: 1, ...}}, ...}
 */
 function getReportPageCounts(reportId, store) {
  //Assuming one id at a time, since the prompt ends in "the report" (not "the reports")
  const result = {
    id: reportId,
    pageCount: 0
  };

  if (reportId && store.report[`${reportId}`]) {
    const docIds = getDocIdsForReport([reportId], store);
    const pageIds = getPageIdsForDocuments(docIds, store);

    result.pageCount = pageIds.length;
  } else {
    //debug log
    console.log("Report does not exist");
  }

  return result;
}

function getDocIdsForReport(reportIds, store) {
  return Object.keys(store.document).filter((key) => {
    const doc = store.document[key];
    //not assuming {[id]: undefined} isn't possible
    return doc && doc.report_id && reportIds.includes(doc.report_id);
  });
}

function getPageIdsForDocuments(docIds, store) {
  return Object.keys(store.page).filter((key) => {
    const page = store.page[key];
    return page && page.document_id && docIds.includes(`${page.document_id}`);
  });
}


//------------Q2--------------------


const excludedFields = ["filetype"]
const pageType = "page";
const docType = "doc";
const reportType = "report";

function search(value, store) {
  const searchValue = value.toLowerCase();
  const foundReports = new Set(); //passed by reference to search functions
  searchDomain(searchValue, store.page, store, foundReports, pageType);
  searchDomain(searchValue, store.document, store, foundReports, docType);
  searchDomain(searchValue, store.report, store, foundReports, reportType);
  return Array.from(foundReports);
}

//could be improved, we're double dipping on found reports
// could delete or flag the objects that don't need to be searched
//  make a deep copy if we don't want to mutate the original obj, but thats slow too
// if we don't make a copy though you wont be able to search more than once per obj
// or you need to go back through and sanitize once your done
//  store the reference used to set processed = true and loop through them
//
// Or could have restructured the obj to be:
// [{
//   ..report,
//   documents: [{... pages: [{}] ...}]
// }]
// making a new unreference object, then map each report in the array with isValueInObj returning the report.id if it is
function searchDomain(value, domain, store, foundReports, type) {
  Object.keys(domain).forEach((key) => {
    const entry = domain[key];
    if (type === pageType && entry.document_id && isValueInObj(value, entry)) {
      //if is page
      const pageDoc = store.document[entry.document_id];
      const reportId = pageDoc ? pageDoc.report_id : undefined;
      //EX store.document[entry.document_id].processed = true;
      //or delete store.document[entry.document_id];
      if (reportId) {
        addReportToResults(reportId, foundReports);
      }
    }
    else if (type === docType && entry.report_id && isValueInObj(value, entry)) {
      //is document
      addReportToResults(entry.report_id, foundReports);
    }
    else if (type === reportType && isValueInObj(value, entry)) {
      //is report
      addReportToResults(entry.id, foundReports);
    }
  });
}

function addReportToResults(reportId, foundReports) {
  foundReports.add(reportId);
  //EX store.report[reportId].processed = true;
  //or delete store.report[reportId];
}

function isValueInObj(value, obj) {
  let result = false;
  for (const key of Object.keys(obj)) {
    const data = obj[key];
    if (!data || excludedFields.includes(key)) {
      result = false;
    }
    else if (Array.isArray(data) || typeof data === 'object') {
      result = isValueInObj(value, data);
    }
    else if (typeof data === 'string') {
      result = data.toLowerCase().includes(value);
    }
    //only need one field to return true
    if (result) {
      return result;
    }
  }
  return result;
}

exports.getReportPageCounts = getReportPageCounts;
exports.search = search;
