import { flatten, inRange, fill } from "lodash";
import {
  logger,
  parseToNumberMatrix,
  readFileContent,
  parseByEmptyLinesToArray
} from "../utils";
type M3D = Record<string, number[][]>;
const makeEmptyMatrix = (l: number): number[][] =>
  Array(l).fill(Array(l).fill(0));
//Q1
readFileContent("day17/test.txt")
  .then((s) => s.replace(/\./g, "0").replace(/#/g, "1"))
  .then(parseToNumberMatrix)
  .then((m) => {
    const matrix3d: M3D = {
      "z-1": makeEmptyMatrix(m.length),
      z0: m,
      z1: makeEmptyMatrix(m.length)
    };

    Object.keys(matrix3d).map((zkey) => {
      const z = parseInt(zkey.slice(1));
      const plane = matrix3d[zkey];

      for (let y = 0; y < plane.length; y++) {
        const row = plane[y];
        for (let x = 0; x < row.length; x++) {
          const el = row[x];
          console.log(x, y, z);
          getHoodies(matrix3d, [x, y, z]);
          return;
        }
      }
    });

    return matrix3d;
  })
  .then(logger);

function getHoodies(matrix3d: M3D, coord: [number, number, number]) {
  coord.map((c, key) => {
    const n = [...coord];
    console.log("hood", c, key);
    return [];
  }, []);
}
