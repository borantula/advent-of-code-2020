import { sum, multiply } from "lodash";
import { logger, parseLinesToArray, readFileContent } from "../utils";

function calculateBus({ min, buses }: { min: number; buses: number[] }) {
  const minTimes = buses.map((bus) => Math.ceil(min / bus) * bus);
  const nextBusAt = Math.min(...minTimes);
  const earliestIndex = minTimes.findIndex((a) => a === nextBusAt);

  return buses[earliestIndex] * (nextBusAt - min);
}

// Q1
readFileContent("day13/input.txt")
  .then(parseLinesToArray)
  .then((a) => {
    return {
      min: Number(a[0]),
      buses: a[1]
        .split(",")
        .filter((a) => a !== "x")
        .map(Number)
    };
  })
  .then(calculateBus)
  .then(logger);

readFileContent("day13/input.txt")
  .then(parseLinesToArray)
  .then((a) => {
    return a[1].replace(/x/g, "0").split(",").map(Number);
  })
  .then(toBags)
  .then(findWonderMoment)
  .then(logger);

type Bag = {
  m: number;
  n: number;
  r: number;
  x1?: number;
  final?: number;
};

function toBags(buses: number[]): Bag[] {
  const reduceOnMod = (mod: number) => {
    if (mod === 0) {
      return 0;
    }
    return buses.reduce((t, c) => {
      if (c === mod || c === 0) {
        return t;
      }

      return t * c;
    }, 1);
  };
  return buses
    .map((m, key) => {
      return { m, r: m - key, n: reduceOnMod(m), x1: 0 };
    })
    .filter((b) => b.m !== 0);
}

function findWonderMoment(bags: Bag[]) {
  const moded = bags.map((bus) => {
    bus.x1 = bus.n % bus.m;

    let modFound = false;
    let c = 0;

    while (!modFound) {
      c++;
      if ((c * bus.x1) % bus.m === 1) {
        bus.x1 = c;
        modFound = true;
      }
    }
    return { ...bus, final: bus.r * bus.n * bus.x1 };
  });

  const mod = moded.reduce((t, c) => t * c.m, 1);
  const total = moded.reduce((t, c) => t + (c.final || 0), 0);

  return total % mod;
}

// console.log(findWonderMoment(toBags([1789, 37, 47, 1889])), 1202161486);
// console.log(findWonderMoment(toBags([67, 7, 59, 61])), 754018);
// console.log(findWonderMoment(toBags([67, 0, 7, 59, 61])), 779210);
// console.log(findWonderMoment(toBags([67, 7, 0, 59, 61])), 1261476);
