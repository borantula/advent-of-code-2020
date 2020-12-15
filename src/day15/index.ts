import { logger, parseLinesToArray, readFileContent } from "../utils";

function gamePlay(numbers: number[], indexToReturn = 2020) {
  const memory: Record<string, number[]> = {};
  let ct = numbers.length;

  function addToMemory(n: number, turn: number) {
    if (!memory[`turn${n}`]) {
      memory[`turn${n}`] = [];
    }
    memory[`turn${n}`].push(turn);
  }

  function getFromMemory(n: number) {
    if (memory[`turn${n}`].length === 1) {
      return 0;
    }
    const lastTwo = memory[`turn${n}`].slice(-2);
    return lastTwo[1] - lastTwo[0];
  }

  numbers.forEach((n, t) => addToMemory(n, t + 1));
  let val = numbers.reverse()[0];
  while (indexToReturn > ct) {
    ct++;
    val = getFromMemory(val);
    addToMemory(val, ct);
  }

  return val;
}

// console.log(gamePlay([0, 3, 6], 30000000), 175594);
// console.log(gamePlay([1, 3, 2], 2020) === 1);
console.log(gamePlay([11, 0, 1, 10, 5, 19], 2020));
console.log(gamePlay([11, 0, 1, 10, 5, 19], 30000000));
