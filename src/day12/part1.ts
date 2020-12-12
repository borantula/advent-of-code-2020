import { values } from "lodash";
import { logger, parseLinesToArray, readFileContent } from "../utils";

readFileContent("day12/input.txt")
  .then(parseLinesToArray)
  .then(navigateShip)
  .then((a) => {
    return Math.abs(a[0]) + Math.abs(a[1]);
  })
  .then(logger);

type Position = [number, number];

function navigateShip(
  path: string[],
  index: number = 0,
  heading: Direction = "E",
  initialPosition: Position = [0, 0]
): Position {
  const nextIndex = index + 1;
  const position = path[index];
  if (!position) {
    return initialPosition;
  }

  const directive = position[0] as Direction | Turn | "F";
  const value = parseInt(position.replace(/[A-Z]/g, ""));
  if (directive === "L" || directive === "R") {
    const nextHeading = turner(heading, directive, value);
    return navigateShip(path, nextIndex, nextHeading, initialPosition);
  }

  const toMove = directive === "F" ? heading : directive;

  const nextPosition = mover(toMove, value, initialPosition);

  return navigateShip(path, nextIndex, heading, nextPosition);
}

/*
  N
W   E
  S
*/
// + is R , - is L
type Direction = "E" | "W" | "N" | "S";
type Turn = "L" | "R";
const turningMap: Record<Direction, Direction> = {
  E: "S",
  S: "W",
  W: "N",
  N: "E"
};

function turner(from: Direction, to: Turn, degrees: number): Direction {
  // so we always calcualte turn rights
  const t = to === "L" ? (360 - degrees) / 90 : degrees / 90;
  let next = from;
  for (let i = 0; i < t; i++) {
    next = turningMap[next];
  }
  return next;
}

function mover(d: Direction, value: number, position: Position): Position {
  if (d === "S" || d === "W") {
    value = -1 * value;
  }

  if (["S", "N"].includes(d)) {
    return [position[0] + value, position[1]];
  }
  return [position[0], position[1] + value];
}
