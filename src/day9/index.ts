import { pipe } from "fp-ts/lib/pipeable";
import { parseLinesToArray, readFileContent } from "../utils";
function logger(a: any) {
  console.log(a);
  return a;
}

function getPartial(list: number[], size = 25, startFrom = 0) {
  return list.slice(startFrom, startFrom + size);
}

function isValidNumber(list: number[], el: number) {
  const filtered = list.find((x) => {
    const diff = el - x;
    const pair = list.find((a) => diff === a);
    return diff > 0 && !!pair && pair !== x;
  });
  return filtered;
}

function findContiguousList(list: number[], el: number) {
  const filtered: number[][] = list
    .map((x, key, arr) => {
      if (x >= el) {
        return [];
      }

      let sum = 0;
      let bag: number[] = [];
      for (let i = key; i < list.length; i++) {
        sum += list[i];
        bag.push(list[i]);
        if (sum === el) {
          return bag;
        }
      }
      return [];
    })
    .filter((a) => a.length);
  console.log("FILTERED", filtered);
  if (!filtered) {
    return false;
  }

  return Math.max(...filtered[0]) + Math.min(...filtered[0]);
}

// get item after size starting from first count

readFileContent("day9/input.txt")
  .then(parseLinesToArray)
  .then((a) => a.map(Number))
  .then(logger)
  .then((list): [number[], number] => {
    const sizeToCheck = 25;
    for (let ind = sizeToCheck; ind < list.length; ind++) {
      const el = list[ind];

      const result = pipe(
        getPartial(list, sizeToCheck, ind - sizeToCheck),
        (partial) => isValidNumber(partial, el)
      );

      if (!result) {
        return [list, el];
      }
    }
    return [list, 0];
  })
  .then((r) => findContiguousList(r[0], r[1]))
  .then(logger);
