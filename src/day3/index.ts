import { parseLinesToArray, parseToMatrix } from "../utils";
import { testData, realData } from "./data";

// console.log(goDown(parseToMatrix(realData), [3, 1]));

function goDown(roadMap: string[][], ruleSet: [number, number]) {
  // finished when y === rangeBottom
  const rangeVertical = roadMap.length;
  const rangeHorizontal = roadMap[0].length;

  // !!3right1down rule hardcoded
  const needForExtension = Math.ceil(
    (ruleSet[0] * (rangeVertical - 1)) / (rangeHorizontal * ruleSet[1])
  );

  roadMap = roadMap.map((line) => {
    let newArr: string[] = [];
    for (let i = 0; i < needForExtension; i++) {
      //   const element = array[i];
      newArr = [...newArr, ...line];
    }

    return newArr;
  });

  const initialIndex: [number, number] = [0, 0];

  const points = getRoadMap([initialIndex], rangeVertical, ruleSet);
  const trees = points
    .map((point) => isItATree(roadMap, point))
    .filter((a) => a);

  return trees.length;
}

function getRoadMap(
  roadMap: [number, number][],
  rangeVertical: number,
  ruleSet: [number, number]
): [number, number][] {
  const last = [...roadMap].reverse()[0];

  if (last[1] + 1 === rangeVertical) {
    return roadMap;
  }

  return getRoadMap(
    [...roadMap, getNextIndex(last, ruleSet)],
    rangeVertical,
    ruleSet
  );
}

function getNextIndex(
  currentIndex: [number, number],
  ruleSet: [number, number]
): [number, number] {
  return [currentIndex[0] + ruleSet[0], currentIndex[1] + ruleSet[1]];
}

function isItATree(roadMap: string[][], c: [number, number]) {
  return roadMap[c[1]][c[0]] === "#";
}

console.log("Q1", goDown(parseToMatrix(realData), [3, 1]));

// Question 2
const ruleSets: [number, number][] = [
  [1, 1],
  [3, 1],
  [5, 1],
  [7, 1],
  [1, 2]
];

const Q2 = ruleSets
  .map((ruleSet) => goDown(parseToMatrix(realData), ruleSet))
  .reduce((prevValue, curValue) => {
    return prevValue * curValue;
  }, 1);

console.log("Answer Q2", Q2);
