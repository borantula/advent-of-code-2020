const fs = require("fs").promises;
const path = require("path");

export function parseLinesToArray(str: string) {
  return str.split("\n").filter((e) => e);
}

export function parseByEmptyLinesToArray(str: string) {
  return str.split("\n\n").filter((e) => e);
}

export function parseToMatrix(str: string) {
  return parseLinesToArray(str).map((e) => e.split(""));
}

// Greatest common devisor
// export function gcd(a: number, b: number) {
//   return !b ? a : gcd(b, a % b);
// }

export function calcAngleDegrees(dx: number, dy: number) {
  return (Math.atan2(dy, dx) * 180) / Math.PI;
}

export async function readFileContent(fileName = "testData.txt") {
  const file = await fs.readFile(path.join(__dirname, fileName));

  return file.toString();
}
