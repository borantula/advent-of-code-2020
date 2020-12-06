import {
  parseByEmptyLinesToArray,
  parseLinesToArray,
  parseToMatrix,
  readFileContent
} from "../utils";
import { pipe } from "fp-ts/lib/function";
import { intersection } from "lodash";

// Q1 answer
readFileContent("day6/input.txt")
  .then(parseByEmptyLinesToArray)
  .then((a) =>
    a
      .map((g) => pipe(parseLinesToArray(g), (v) => v.join("").split("")))
      .map((x) => new Set(x))
      .map((a) => a.size)
      .reduce((total, curr) => {
        return total + curr;
      }, 0)
  )
  .then((a) => console.log(`Answer to Q1 is: ${a}`));

readFileContent("day6/input.txt")
  .then(parseByEmptyLinesToArray)
  .then((a) => a.map((g) => pipe(parseToMatrix(g), (group) => group)))
  .then((matrix) => {
    return matrix.map((group) => {
      if (group.length === 1) {
        return group[0].length;
      }
      return intersection(...group).length;
    });
  })
  .then((totals) =>
    totals.reduce((total, curr) => {
      return total + curr;
    }, 0)
  )
  .then((a) => console.log(`Answer to Q2 is: ${a}`));
