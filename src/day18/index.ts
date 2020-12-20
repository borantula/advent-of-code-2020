import { flatten, inRange, fill } from "lodash";
import {
  logger,
  parseToNumberMatrix,
  readFileContent,
  parseByEmptyLinesToArray
} from "../utils";

//Q1
// readFileContent("day18/test.txt");

const t1 = "1 + 2 * 3 + 4 * 5 + 6";
console.log(eval(t1));
