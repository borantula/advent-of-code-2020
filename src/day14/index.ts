import { logger, parseLinesToArray, readFileContent } from "../utils";

readFileContent("day14/input.txt")
  .then(parseLinesToArray)
  .then(parse)
  .then((a) => {
    let memory: Record<string, number> = {};
    a.map((b) => {
      const [mask, cmds] = b;
      console.log(mask, cmds);
      const maskArr = mask.split("");
      cmds.map((cmd) => {
        const [mem, val] = cmd.replace("mem[", "").split("] = ").map(Number);
        const mod2 = makeFull36(val.toString(2));
        const newValue = maskArr
          .map((m, k) => {
            if (m === `X`) {
              return mod2[k];
            }
            return m;
          })
          .join("");
        memory[`${mem}`] = parseInt(newValue, 2);
        console.log("newValue", mem, parseInt(newValue, 2));
      });
    });
    return memory;
  })
  .then((a) => Object.values(a).reduce((t, c) => t + c, 0))
  .then(logger);

function parse(a: string[]) {
  return a
    .reduce((t: [string, string[]][], c: string) => {
      if (c.startsWith("mask")) {
        t.push([c, []]);
      } else {
        const lastIndex = t.length - 1;
        t[lastIndex][1].push(c);
      }
      return t;
    }, [])
    .map((a) => {
      a[0] = a[0].replace("mask = ", "");
      // a[1] = a[1].map((b) => {

      //   return b.replace("mem[", "").split("] = ");
      // });
      return a;
    });
}

function makeFull36(val: string) {
  const toAdd = 36 - val.length;
  let v = "";
  for (let i = 0; i < toAdd; i++) {
    v = `${v}0`;
  }
  return `${v}${val}`;
}
