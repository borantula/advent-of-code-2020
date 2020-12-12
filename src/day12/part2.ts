import { logger, parseLinesToArray, readFileContent } from "../utils";

readFileContent("day12/input.txt")
  .then(parseLinesToArray)
  .then(navigateShip)
  .then(logger)
  .then((a) => {
    return Math.abs(a[0]) + Math.abs(a[1]);
  })
  .then(logger);

type Position = [number, number];

function navigateShip(
  path: string[],
  index: number = 0,
  heading: Direction = "E",
  initialPosition: Position = [10, 1],
  ship: Position = [0, 0]
): Position {
  const nextIndex = index + 1;
  const position = path[index];
  if (!position) {
    return ship;
  }

  const directive = position[0] as Direction | Turn | "F";
  const value = parseInt(position.replace(/[A-Z]/g, ""));

  if (directive === "L" || directive === "R") {
    const t = directive === "L" ? (360 - value) / 90 : value / 90;
    return navigateShip(
      path,
      nextIndex,
      heading,
      turn(initialPosition, t),
      ship
    );
  }

  if (directive === "F") {
    const shipCoef = initialPosition.map((p) => p * value) as Position;
    const newShip = [ship[0] + shipCoef[0], ship[1] + shipCoef[1]] as Position;

    return navigateShip(path, nextIndex, heading, initialPosition, newShip);
  }

  const nextPosition = mover(directive, value, initialPosition);

  return navigateShip(path, nextIndex, heading, nextPosition, ship);
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

function turn(p: Position, times = 1): Position {
  // so we always calcualte turn rights
  let next = p;
  for (let i = 0; i < times; i++) {
    next = [next[1], next[0] * -1];
  }
  return next;
}

function mover(d: Direction, value: number, position: Position): Position {
  if (d === "S" || d === "W") {
    value = -1 * value;
  }

  if (["S", "N"].includes(d)) {
    return [position[0], position[1] + value];
  }
  return [position[0] + value, position[1]];
}
