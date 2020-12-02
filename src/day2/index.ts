import { data } from "./data";
const testData = ["1-3 a: abcde", "1-3 b: cdefg", "2-9 c: ccccccccc"];

export function validatePassword(passPhrase: string) {
  const parts = passPhrase.split(":");
  const pass = parts[1];
  const left = parts[0].split(" ");
  const letter = left[1];
  const range = left[0].split("-").map(Number) as [number, number];

  const occuranceCount = pass.split("").filter((l) => l === letter).length;
  //   console.log(pass, letter, range, occuranceCount);

  return occuranceCount >= range[0] && occuranceCount <= range[1];
}

export function validatePassword2(passPhrase: string) {
  const parts = passPhrase.split(":");
  const pass = parts[1].trim();
  const left = parts[0].split(" ");
  const letter = left[1];
  const range = left[0].split("-").map(Number) as [number, number];
  const passArr = pass.split("");
  //   console.log(passArr, passArr[0], passArr[2], range[0], range[1]);
  const p1 = passArr[range[0] - 1];
  const p2 = passArr[range[1] - 1];
  return (p1 === letter || p2 === letter) && p1 !== p2;
}

// const validCount = data.map((d) => validatePassword(d)).filter((a) => a).length;
// console.log("Answer 1", validCount);

const validCount2 = data.map((d) => validatePassword2(d)).filter((a) => a)
  .length;
console.log("Answer 2", validCount2);
