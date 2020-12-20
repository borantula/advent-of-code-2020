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
readFileContent("day19/input.txt")
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

    const result = gatherAllPossibilities(rules, 0);
    const validMessages = parsed[1].filter((msg) => {
      return result.includes(msg);
    });
    console.log("Valid Messages", validMessages.length);
  })
  .then(logger);

function gatherAllPossibilities(
  rules: Rules,
  ruleNo: number | string,
  bag: string[] = [],
  level = 0
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
      return gatherAllPossibilities(rules, p, [], level + 1);
    });

    return res;
  });

  if (level !== 0) {
    bag.push(...ruleSetResult.map((a) => a.join("")).filter((a) => a));
  }

  return ruleSetResult
    .map((set) => {
      // create combinations of arrays
      return set.reduce((a, b) => flatMap(a, (x) => b.map((y) => x + y)));
    })
    .reduce((t, c) => [...t, ...c], []);
}
