const { findResult, findResult3 } = require("./q1");

const testData = [1721, 979, 366, 299, 675, 1456];

describe("Q1", () => {
  it("finds total 2020", () => {
    expect(findResult(testData)).toEqual(514579);
  });
});

describe("Q2", () => {
  it("finds total 2020", () => {
    expect(findResult3(testData)).toEqual(241861950);
  });
});
