import { parseLinesToArray, readFileContent } from "../utils";
function logger(a: any) {
  console.log(a);
  return a;
}
type Command = [string, string, number];

function parseToCommands(line: string): Command {
  const [a, b] = line.trim().split(" ", 2);
  const c = b.split("");
  const [d, ...e] = c;
  return [a, c[0], parseInt(e.join(""))];
}

type Result = {
  done: boolean;
  acc: number;
  bag: number[];
  commands: Command[];
};

function runCommand(
  commands: Command[],
  location: number = 0,
  bag: number[] = [],
  acc = 0
): Result {
  if (bag.includes(location)) {
    return {
      bag,
      commands,
      done: false,
      acc
    };
  }
  bag.push(location);

  const cmd = commands[location];
  const dir = cmd[1];
  const arg = cmd[2];

  let newLocation = location;
  let newAcc = acc;

  if (cmd[0] === "nop") {
    newLocation = location + 1;
  }
  if (cmd[0] === "jmp") {
    newLocation = location + (dir === "-" ? -arg : arg);
  }
  if (cmd[0] === "acc") {
    newAcc = acc + (dir === "-" ? -arg : arg);
    newLocation = location + 1;
  }
  if (!commands[newLocation]) {
    console.log("El FINITO", newAcc);
    return {
      bag,
      commands,
      done: true,
      acc: newAcc
    };
  }

  return runCommand(commands, newLocation, bag, newAcc);
}

function newCommandSet(commands: Command[], indexToChange: number) {
  const el = commands[indexToChange];
  if (el[0] === "acc") {
    return false;
  }
  const newCommand: Command = [el[0] === "jmp" ? "nop" : "jmp", el[1], el[2]];
  let newCommands = [...commands];
  newCommands[indexToChange] = newCommand;
  return newCommands;
}

//Q1
readFileContent("day8/input.txt")
  .then(parseLinesToArray)
  .then((a) => a.map(parseToCommands))
  .then(runCommand)
  .then(logger);

readFileContent("day8/input.txt")
  .then(parseLinesToArray)
  .then((a) => a.map(parseToCommands))
  .then(runCommand)
  .then((result) => {
    return result.bag
      .map((ind) => {
        const newCmds = newCommandSet(result.commands, ind);
        if (!newCmds) {
          return result;
        }

        return runCommand(newCmds);
      })
      .filter((a) => a.done)
      .map((a) => a.acc);
  })
  .then(logger);
