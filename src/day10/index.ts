import { pipe } from "fp-ts/lib/pipeable";
import { parseLinesToArray, readFileContent } from "../utils";
function logger(a: any) {
  console.log(a);
  return a;
}

type AdapterBag = number[];
type Differences = [number, number, number];

function plugThemTogether(
  adapters: AdapterBag,
  diff = [0, 0, 0],
  current = 0
): Differences {
  if (adapters.length === 0) {
    return [diff[0], diff[1], diff[2] + 1];
  }
  const [currentAdapter, ...remaining] = adapters;
  const currentDiff = currentAdapter - current;
  diff[currentDiff - 1]++;
  console.log(diff, currentAdapter);

  return plugThemTogether(remaining, diff, currentAdapter);
}

function findParallelUniverses(
  adapters: AdapterBag,
  current = 0,
  total = 0,
  branchCache: Record<string, number> = {}
) {
  const usableAdapters = getUsableAdapters(adapters, current);

  if (adapters.length === 0) {
    return total;
  }
  total += usableAdapters.length - 1;

  usableAdapters.map((adpt, key) => {
    const remaining = adapters.slice(key + 1);
    const first = remaining[0];
    if (!branchCache.hasOwnProperty(`b${first}`)) {
      branchCache[`b${first}`] = findParallelUniverses(
        remaining,
        adpt,
        0,
        branchCache
      );
    }
    total += branchCache[`b${first}`];
  });

  return total;
}

function getUsableAdapters(adapters: AdapterBag, current = 0): number[] {
  return adapters.filter((a) => current + 4 > a);
}

function runQ1(fileName = "input") {
  readFileContent(`day10/${fileName}.txt`)
    .then(parseLinesToArray)
    .then((a) => a.map(Number).sort((a, b) => (a > b ? 1 : -1)))
    .then(plugThemTogether)
    .then(logger)
    .then((d) => {
      console.log(`Q1 Answer: ${d[0] * d[2]}`);
    });
}

function runQ2(fileName = "input") {
  // get item after size starting from first count
  readFileContent(`day10/${fileName}.txt`)
    .then(parseLinesToArray)
    .then((a) => a.map(Number).sort((a, b) => (a > b ? 1 : -1)))
    .then(findParallelUniverses)

    .then((d) => {
      console.log(`Q2 Answer: ${d + 1}`);
    });
}

runQ1("input");
runQ2("input");
