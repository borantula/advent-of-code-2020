import { fromPairs, flatMap, flatMapDeep, flatten } from "lodash";
import {
  logger,
  parseToNumberMatrix,
  readFileContent,
  parseByEmptyLinesToArray,
  parseLinesToArray,
  parseToMatrix
} from "../utils";

type Dir = "l" | "r" | "t" | "b" | "lr" | "rr" | "tr" | "br";
type Tiles = Record<string, Record<Dir, string>>;
//Q1
readFileContent("day20/input.txt")
  .then(parseByEmptyLinesToArray)
  .then((a) => a.map(parseLinesToArray))
  .then((tiles) => {
    let tilesObj: Tiles = {};
    tiles.forEach((tileArr) => {
      const [key, ...tile] = tileArr;
      const keyNumbers = key.replace(/[^0-9]/g, "");
      const matrix = parseToMatrix(tile.join("\n"));
      const l = matrix.map((a) => a[0]).join("");
      const r = matrix.map((a) => a.reverse()[0]).join("");
      const t = matrix[0].join("");
      const b = matrix.reverse()[0].join("");
      tilesObj[keyNumbers] = {
        l,
        r,
        t,
        b,
        lr: l.split("").reverse().join(""),
        rr: r.split("").reverse().join(""),
        tr: t.split("").reverse().join(""),
        br: b.split("").reverse().join("")
      };
    });
    return tilesObj;
  })
  .then((tilesObj) => {
    const matches: Record<string, string[]> = {};
    const counts: Record<string, number> = {};

    // Find how many instances each side is used
    Object.entries(tilesObj).forEach((tile) => {
      const [tk, to] = tile;
      Object.keys(to).forEach((dk) => {
        const side = to[dk as Dir];
        if (!matches.hasOwnProperty(side)) {
          matches[side] = [];
        }

        matches[side].push(tk);
      });
    });
    // group them by count like {[tileId]:usedSideCount}
    const groupedByCount = flatten(
      Object.entries(matches)
        .filter((a) => a[1].length === 1)
        .map((a) => a[1])
    ).reduce((t, c) => {
      t[c] = t[c] + 1 || 0;
      return t;
    }, {} as Record<string, number>);
    // remove if theres so 3 sides empty
    const onlySides = Object.entries(groupedByCount)
      .filter((a) => a[1] === 3)
      .map((a) => Number(a[0]));
    // console.log(groupedByCount);
    return onlySides.reduce((t, c) => t * c, 1);
  })
  .then(logger);
