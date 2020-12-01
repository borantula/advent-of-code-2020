import { data } from "./data";

export function findResult(data) {
  let result = 0;
  for (let i = 0; i < data.length; i++) {
    const el1 = data[i];
    for (let j = 0; j < data.length; j++) {
      if (i === j) continue;
      const el2 = data[j];
      if (el1 + el2 === 2020) {
        return el1 * el2;
      }
    }
  }
  return result;
}

export function findResult3(data) {
  let result = 0;
  for (let i = 0; i < data.length; i++) {
    const el1 = data[i];
    for (let j = 0; j < data.length; j++) {
      if (i === j) continue;
      const el2 = data[j];
      if (el1 + el2 > 2020) continue;

      for (let h = 0; h < data.length; h++) {
        if (i === h) continue;
        const el3 = data[h];
        if (el1 + el2 + el3 === 2020) {
          return el1 * el2 * el3;
        }
      }
    }
  }
  return result;
}

console.log(findResult(data));
console.log(findResult3(data));
