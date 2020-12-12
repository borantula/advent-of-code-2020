import {
  logger,
  parseLinesToArray,
  parseToMatrix,
  readFileContent,
  backToMatrixString
} from "../utils";

function solveQ1() {
  return readFileContent("day11/input.txt")
    .then(parseToMatrix)
    .then((seats) => {
      let currentSeats = seats;
      let isStable = false;
      let count = 0;
      while (!isStable) {
        count++;
        const newSeats = currentSeats.map((row, y) => {
          return row.map((seat, x) => {
            return applyRules(currentSeats, seat, y, x);
          });
        });
        isStable = JSON.stringify(currentSeats) === JSON.stringify(newSeats);
        currentSeats = newSeats;
      }
      return currentSeats;
    })
    .then((seats) => {
      return JSON.stringify(seats)
        .split("")
        .filter((a) => a === "#").length;
    });
}

function solveQ2() {
  return readFileContent("day11/input.txt")
    .then(parseToMatrix)
    .then((seats) => {
      let currentSeats = seats;
      let isStable = false;
      let count = 0;
      while (!isStable) {
        count++;
        const newSeats = currentSeats.map((row, y) => {
          return row.map((seat, x) => {
            // console.log(seat, y, x);
            return applyRules2(currentSeats, seat, y, x);
          });
        });
        isStable = JSON.stringify(currentSeats) === JSON.stringify(newSeats);
        currentSeats = newSeats;
      }
      return currentSeats;
    })
    .then((seats) => {
      return JSON.stringify(seats)
        .split("")
        .filter((a) => a === "#").length;
    })
    .then(logger);
}

function applyRules(matrix: string[][], seat: string, y: number, x: number) {
  if (seat === ".") {
    return seat;
  }
  const isEmpty = seat === "L";
  const isOccupied = seat === "#";
  const surroundings = getSurroundings(matrix, y, x);
  const occupiedNeighbours = Object.values(surroundings).filter(
    (a) => a === "#"
  );

  if (isEmpty && occupiedNeighbours.length === 0) {
    return "#";
  }

  if (isOccupied && occupiedNeighbours.length >= 4) {
    return "L";
  }
  return seat;
}

function applyRules2(matrix: string[][], seat: string, y: number, x: number) {
  if (seat === ".") {
    return seat;
  }
  const isEmpty = seat === "L";
  const isOccupied = seat === "#";
  const surroundings = getFarSurroundings(matrix, y, x);
  const occupiedNeighbours = Object.values(surroundings).filter(
    (a) => a === "#"
  );

  if (isEmpty && occupiedNeighbours.length === 0) {
    return "#";
  }

  if (isOccupied && occupiedNeighbours.length >= 5) {
    return "L";
  }
  return seat;
}

function getCell(matrix: string[][], y: number, x: number) {
  var NO_VALUE = null;
  var value, hasValue;

  try {
    hasValue = matrix[y][x] !== undefined;
    value = hasValue ? matrix[y][x] : NO_VALUE;
  } catch (e) {
    value = NO_VALUE;
  }
  return value;
}

const isVisibleSeat = (v: any) => {
  return v === "L" || v === "#";
};

type Dir =
  | "up"
  | "upRight"
  | "right"
  | "downRight"
  | "down"
  | "downLeft"
  | "left"
  | "upLeft";

function getSurroundings(
  matrix: string[][],
  y: number,
  x: number,
  // d for distance
  d = 1
): Record<Dir, string | null> {
  // Directions are clockwise
  return {
    up: getCell(matrix, y - d, x),
    upRight: getCell(matrix, y - d, x + d),
    right: getCell(matrix, y, x + d),
    downRight: getCell(matrix, y + d, x + d),
    down: getCell(matrix, y + d, x),
    downLeft: getCell(matrix, y + d, x - d),
    left: getCell(matrix, y, x - d),
    upLeft: getCell(matrix, y - d, x - d)
  };
}

function getFarSurroundings(
  matrix: string[][],
  y: number,
  x: number,
  // d for distance
  d = 1
): Record<Dir, string | null> {
  let allResolved = false;
  let surroundings: Record<Dir, string | null> = {
    up: null,
    upRight: null,
    right: null,
    downRight: null,
    down: null,
    downLeft: null,
    left: null,
    upLeft: null
  };
  while (!allResolved) {
    const p = surroundings;
    surroundings = {
      up: isVisibleSeat(p.up) ? p.up : getCell(matrix, y - d, x),
      upRight: isVisibleSeat(p.upRight)
        ? p.upRight
        : getCell(matrix, y - d, x + d),
      right: isVisibleSeat(p.right) ? p.right : getCell(matrix, y, x + d),
      downRight: isVisibleSeat(p.downRight)
        ? p.downRight
        : getCell(matrix, y + d, x + d),
      down: isVisibleSeat(p.down) ? p.down : getCell(matrix, y + d, x),
      downLeft: isVisibleSeat(p.downLeft)
        ? p.downLeft
        : getCell(matrix, y + d, x - d),
      left: isVisibleSeat(p.left) ? p.left : getCell(matrix, y, x - d),
      upLeft: isVisibleSeat(p.upLeft) ? p.upLeft : getCell(matrix, y - d, x - d)
    };
    const values = Object.values(surroundings).filter((v) => v !== ".");
    // console.log("values", surroundings, values);
    if (values.length === 8) {
      allResolved = true;
    }
    d++;
  }
  return surroundings;
}

// solveQ1().then((a) => {
//   console.log("Q1", a);
// });
const testData = `.............
.L.L.#.#.#.#.
.............`;

const testData1 = `.......#.
...#.....
.#.......
.........
..#L....#
....#....
.........
#........
...#.....`;

// const m = parseToMatrix(testData1);
// const spot = logger(m[4][3]);

// console.log(spot, getFarSurroundings(m, 4, 3));

solveQ2();
