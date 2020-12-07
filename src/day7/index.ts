import { parseLinesToArray, readFileContent } from "../utils";

function parseBagRule(rule: string): [string, string] {
  const a = rule.split("contain", 2) as [string, string];
  const key = a[0].replace(/bags|bag/g, "").trim();
  const bags = a[1]
    .replace(".", "")
    .replace(/bags|bag/g, "")
    .trim();

  return [key, bags];
}

function parseBagRule2(rule: string): [string, string[]] {
  const a = rule.split("contain", 2) as [string, string];
  const key = a[0].replace(/bags|bag/g, "").trim();
  const bags = a[1]
    .replace(".", "")
    .replace(/bags|bag/g, "")
    .trim()
    .split(",")
    .map((r) => r.trim())
    .filter((r) => r !== "no other");

  return [key, bags];
}

function logger(a: any) {
  console.log(a);
  return a;
}

function onlyUnique(value: string, index: number, self: string[]) {
  return self.indexOf(value) === index;
}

let total = 0;

function findInRuleset(
  q: string,
  rules: [string, string][],
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

function findInRuleset2(
  q: string,
  rules: Record<string, string[]>,
  coef = 1,
  totals: number[] = []
): number {
  const current = rules[q];

  if (rules[q].length === 0) {
    return totals.reduce((t, c) => t + c, 0);
  }

  const ctotal = current.map((e) => {
    const key = e.replace(/[0-9]/g, "").trim();
    const val = parseInt(e[0]);

    const res = findInRuleset2(key, rules, val, [val]);

    return res * coef;
  });

  return ctotal.reduce((t, c) => t + c, 0) + coef;
}
// Q1 answer
readFileContent("day7/input.txt")
  .then(parseLinesToArray)
  .then((l) => l.map(parseBagRule))
  .then((rules: [string, string][]) => {
    return findInRuleset("shiny gold", rules);
  })
  .then((a) => a.length)
  .then(logger);

// Q2 answer
readFileContent("day7/input.txt")
  .then(parseLinesToArray)
  .then((l) =>
    l.map(parseBagRule2).reduce((col, cur) => {
      return { ...col, [cur[0]]: cur[1] };
    }, {})
  )

  .then(
    (rules: Record<string, string[]>) => findInRuleset2("shiny gold", rules) - 1
  )
  .then(logger);
