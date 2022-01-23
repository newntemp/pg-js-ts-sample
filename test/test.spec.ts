import { expect } from "chai"

import {
  Database,
  documentsAntiJoinPagesQuery,
  getReportPageCounts,
  search,
  IDocument,
  IReportPageCount,
  reportAggregationQuery
} from "../dist";
import { addTestData, convertTestDataToStore, getDocsWithoutPages } from "./utils/helpers";

describe("Prompt", () => {

  before(async () => {
    // Normally I'd stub the db instead of using one in unit tests
    await addTestData();
  });

  it("Should connect to the local test database", async () => {
    const sqlize = Database.getConnection();
    try {
      await sqlize.authenticate();
    } catch (error) {
      expect.fail("Connection to local db failed");
    }
  });

  describe("Part 1", () => {

    it("Should get all documents without pages", async () => {
      const result = await Database.execute<IDocument>(documentsAntiJoinPagesQuery);
      expect(result[0], "Anti Join Result Exists").to.exist;
      const docIds = result[0].map((val) => val.id);
      const expected = getDocsWithoutPages().map((val) => val.id);
      expect(docIds).to.have.members(expected);
    });

    it("Should get the page count of reports with pages", async () => {
      const result = await Database.execute<IReportPageCount>(reportAggregationQuery);
      expect(result[0], "Aggregation Result Exists").to.exist;
      const reports = result[0];
      //expected values taken from the testData object
      expect(reports.length).to.equal(2);
      expect(reports).to.have.deep.members([
        { title: 'Portfolio Summary 2020', pageCount: '1' },
        { title: 'Portfolio Summary 2020', pageCount: '3' }
      ]);
    });

  });

  describe("Part 2", () => {
    let objectStore;

    beforeEach(() => {
      const data = convertTestDataToStore();
      objectStore = JSON.parse(JSON.stringify(data));
    });

    afterEach(() => {
      objectStore = undefined;
    });

    describe("Q1", () => {

      it("Should get the page counts from a report with one page", () => {
        const id = 22;
        const onePage = getReportPageCounts(id, objectStore);
        expect(onePage.id).to.equal(id);
        expect(onePage.pageCount).to.exist;
        expect(onePage.pageCount).to.equal(1);
      });

      it("Should get the page counts from a report with more than one page", () => {
        const id = 21;
        const threePage = getReportPageCounts(id, objectStore);
        expect(threePage.id).to.equal(id);
        expect(threePage.pageCount).to.exist;
        expect(threePage.pageCount).to.equal(3);
      });

      it("Should return 0 pages for reports with 0 pages", () => {
        const id = 4;
        const noPage = getReportPageCounts(id, objectStore);
        expect(noPage.id).to.equal(id);
        expect(noPage.pageCount).to.exist;
        expect(noPage.pageCount).to.equal(0);
      });

      it("Should return successfully if the report doesn't exist in storage", () => {
        const id = 999;
        const noPage = getReportPageCounts(id, objectStore);
        expect(noPage.id).to.equal(id);
        expect(noPage.pageCount).to.exist;
        expect(noPage.pageCount).to.equal(0);
      });

      it("Should handle null report ids", () => {
        const noPage = getReportPageCounts(null, objectStore);
        expect(noPage.id).to.equal(null);
        expect(noPage.pageCount).to.exist;
        expect(noPage.pageCount).to.equal(0);
      });
    });

    describe("Q2", () => {
      it("Should find reports", () => {
        //document with sample is the same report
        let result = search("sample", objectStore);
        expect(result).to.exist;
        expect(result.length).to.equal(1);
        expect(result).to.have.members([4]);
      });

      it("Should ignore case", () => {
        let result = search("lY re", objectStore);
        expect(result).to.exist;
        expect(result.length).to.equal(1);
        expect(result).to.have.members([21]);
      });

      it("Should count a report only once", () => {
        let result = search("sumMary", objectStore);
        expect(result).to.exist;
        expect(result.length).to.equal(2);
        expect(result).to.have.members([21,22]);
      });

      it("Should get from the body", () => {
        let result = search("no", objectStore);
        expect(result).to.exist;
        expect(result.length, "no").to.equal(1);
      });

      it("Should get from the footnote", () => {
        let result = search("Aliquam", objectStore);
        expect(result).to.exist;
        expect(result.length).to.equal(1);
        expect(result).to.have.members([21]);
      });

      it("Should exclude the filetype", () => {
        let result = search("pdf", objectStore);
        expect(result).to.exist;
        expect(result.length).to.equal(0);
      });

      it("Should not report data with no report associated", () => {
        let result = search("no document", objectStore);
        expect(result).to.exist;
        expect(result.length).to.equal(1);
        expect(result).to.have.members([22]);
      });

      it("Should return 0 if none are found", () => {
        let result = search("z", objectStore);
        expect(result).to.exist;
        expect(result.length).to.equal(0);
      });

      it("Should be repeatable", () => {
        //Assuming this is a requirement
        let result = search("Aliquam", objectStore);
        expect(result).to.exist;
        expect(result.length).to.equal(1);
        expect(result).to.have.members([21]);

        result = search("Aliquam", objectStore);
        expect(result).to.exist;
        expect(result.length).to.equal(1);
        expect(result).to.have.members([21]);
      });

      it("Should not let previous searches affect the current search", () => {
        let result = search("sumMary", objectStore);
        expect(result).to.exist;
        expect(result.length).to.equal(2);
        expect(result, "1").to.have.members([21, 22]);

        result = search("aliquam", objectStore);
        expect(result).to.exist;
        expect(result.length).to.equal(1);
        expect(result, "2").to.have.members([21]);

        result = search("sumMary", objectStore);
        expect(result).to.exist;
        expect(result.length).to.equal(2);
        expect(result).to.have.members([21,22]);
      });
    });
  });
});
