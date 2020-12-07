import {
  parseByEmptyLinesToArray,
  parseLinesToArray,
  parseToMatrix,
  readFileContent
} from "../utils";
import { pipe } from "fp-ts/lib/function";
import uniq from "lodash";

function parseBagRule(rule: string) {
  const a = rule.split("contain", 2) as [string, string];
  const key = a[0].replace(/bags|bag/g, "").trim();
  const bags = a[1]
    .replace(".", "")
    .replace(/bags|bag/g, "")
    .trim();

  // .map((a) =>
  //   a.trim().replace(".", "").replace("bags", "").replace(" bag", "")
  // );
  console.log(bags);
  return [key, bags];
}

function logger(a: any) {
  console.log(a);
  return a;
}

function onlyUnique(value: string, index: number, self: string[]) {
  return self.indexOf(value) === index;
}

function findInRuleset(
  q: string,
  rules: [string, string],
  collected: string[] = []
): string[] {
  const findParent = rules.filter((r) => r[1].includes(q)).map((r) => r[0]);

  if (findParent.length === 0) {
    return collected;
  }
  const tree = findParent
    .map((a) => findInRuleset(a, rules, [...collected, ...findParent]))
    .reduce((t, c) => [...t, ...c], []);

  return tree.filter(onlyUnique);
}
// Q1 answer
readFileContent("day7/input.txt")
  .then(parseLinesToArray)
  .then((l) => l.map(parseBagRule))
  .then(logger)
  .then((rules: [string, string]) => {
    return findInRuleset("shiny gold", rules);
  })
  .then((a) => a.length)
  .then(logger);
