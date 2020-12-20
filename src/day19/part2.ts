import { fromPairs, flatMap, flatMapDeep } from "lodash";
import {
  logger,
  parseToNumberMatrix,
  readFileContent,
  parseByEmptyLinesToArray,
  parseLinesToArray
} from "../utils";

type Rules = Record<string, string>;
//Q1
readFileContent("day19/test2.txt")
  .then(parseByEmptyLinesToArray)
  .then((a) => a.map(parseLinesToArray))
  .then((parsed) => {
    const rules: Rules = fromPairs(
      parsed[0].map((a) =>
        a
          .replace(/"/g, "")
          .split(":")
          .map((a) => a.trim())
      )
    );

    // rules[8] = "42 | 42 8";
    // rules[11] = "42 31 | 42 11 31";

    const maxLength = getMaxLength(parsed[1]);
    console.log(maxLength);

    const result = gatherAllPossibilities(rules, 0, [], 0, maxLength);
    // const validMessages = parsed[1].filter((msg) => {
    //   return result.includes(msg);
    // });
    // console.log("Valid Messages", result);
  })
  .then(logger);

function gatherAllPossibilities(
  rules: Rules,
  ruleNo: number | string,
  bag: string[] = [],
  level = 0,
  maxLength = 0
): string[] {
  const rule = rules[`${ruleNo}`];

  if (["a", "b"].includes(rule)) {
    bag.push(rule);
    return bag;
  }

  const ruleSet = rule.split("|").map((a) => a.trim());

  const ruleSetResult = ruleSet.map((set) => {
    const parts = set.split(" ").filter((a) => !!a);

    const res = parts.map((p) => {
      return gatherAllPossibilities(rules, p, [], level + 1, maxLength);
    });

    return res;
  });
  if (level !== 0) {
    bag.push(...ruleSetResult.map((a) => a.join("")).filter((a) => a));
  } else {
    const currentLength = ruleSetResult.map((a) => a[0][0]).join("").length;
  }
  console.log(level, maxLength);

  return ruleSetResult.map(combinations).reduce((t, c) => [...t, ...c], []);
}

function combinations(set: string[][]) {
  return set.reduce((a, b) => flatMap(a, (x) => b.map((y) => x + y)));
}

const getMaxLength = (set: string[]) => Math.max(...set.map((a) => a.length));
