import { parseLinesToArray, readFileContent } from "../utils";
import { last, map, sort } from "fp-ts/lib/Array";
import { flow, pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import { takeLeft, takeRight } from "fp-ts/lib/ReadonlyArray";

type SeatRange = [number, number];

type Direction = "F" | "B" | "L" | "R";

type PassData = [
  Direction,
  Direction,
  Direction,
  Direction,
  Direction,
  Direction,
  Direction,
  Direction,
  Direction,
  Direction
];

export const ROWCOUNT = 128;
export const SEATCOUNT = 8;
export const initialRowRange: SeatRange = [0, 127];
export const initialSeatRange: SeatRange = [0, 7];
export const initialRange: [SeatRange, SeatRange] = [
  initialRowRange,
  initialSeatRange
];

const getHalf = (n: number) => (n + 1) / 2;

export const rangers: Record<Direction, (r: SeatRange) => SeatRange> = {
  F: (range) => {
    return [range[0], range[0] + Math.floor((range[1] - range[0]) / 2)];
  },
  B: (range) => {
    return [range[0] + Math.ceil((range[1] - range[0]) / 2), range[1]];
  },
  L: (range) => {
    return [range[0], range[0] + Math.floor((range[1] - range[0]) / 2)];
  },
  R: (range) => {
    return [range[0] + Math.ceil((range[1] - range[0]) / 2), range[1]];
  }
};

export function parsePass(pass: string) {
  return pass.split("") as PassData;
}

const testData = "FBFBBFFRLR";

function calculateSeat(passData: PassData) {
  const rowDirections = [...takeLeft(7)(passData)];
  const seatDirections = [...takeRight(3)(passData)];

  const rows = rowDirections.reduce((prev, curr) => {
    // const isLast = currInd === rowDirections.length - 1;
    return rangers[curr](prev);
  }, initialRowRange);

  const seats = seatDirections.reduce((prev, curr) => {
    // const isLast = currInd === rowDirections.length - 1;
    return rangers[curr](prev);
  }, initialSeatRange);

  const lastRow = pipe(last(rowDirections), O.toUndefined);
  const lastSeat = pipe(last(seatDirections), O.toUndefined);

  const row = lastRow === "F" ? rows[0] : rows[1];
  const seat = lastSeat === "L" ? seats[0] : seats[1];

  //   console.log(rows, row, seat);
  return row * 8 + seat;
}

function findMissingInRange(values: number[]) {
  for (let i = 1; i < values.length; i++) {
    const el = values[i];
    const prev = values[i - 1];

    if (prev + 1 !== el) {
      return el - 1;
    }
  }
  return undefined;
}

const calculate = flow(parsePass, calculateSeat);

// Q1 answer
readFileContent("day5/input.txt")
  .then(parseLinesToArray)
  .then((passes) => passes.map(calculate))
  .then((v) => Math.max(...v))
  .then(console.log);

// Q2 answer
readFileContent("day5/input.txt")
  .then(parseLinesToArray)
  .then((passes) => passes.map(calculate))
  .then((v) => v.sort())
  .then(findMissingInRange)
  .then(console.log);
