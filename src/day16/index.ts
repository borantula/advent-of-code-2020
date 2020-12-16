import { flatten, inRange } from "lodash";
import {
  logger,
  parseLinesToArray,
  readFileContent,
  parseByEmptyLinesToArray
} from "../utils";

// readFileContent("day16/input.txt")
//   .then(parseByEmptyLinesToArray)
//   .then((a) => a.map((r) => r.split("\n")))
//   .then((parsed) => {
//     const rules = parsed[0].map(parseRule);
//     const yourTicket = parsed[1][1].split(",").map(Number);
//     const otherTickets = parsed[2]
//       .slice(1)
//       .map((r) => r.split(",").map(Number));

//     return { rules, yourTicket, otherTickets };
//   })
//   .then(({ rules, yourTicket, otherTickets }) => {
//     const validated = otherTickets.map((t) => validateTicket(rules, t));

//     return flatten(validated).reduce((t, c) => t + c, 0);
//   })

//   .then(logger);

readFileContent("day16/input.txt")
  .then(parseByEmptyLinesToArray)
  .then((a) => a.map((r) => r.split("\n")))
  .then((parsed) => {
    const rules = parsed[0].map(parseRule);
    const yourTicket = parsed[1][1].split(",").map(Number);
    const otherTickets = parsed[2]
      .slice(1)
      .map((r) => r.split(",").map(Number));

    return { rules, yourTicket, otherTickets };
  })
  .then(({ rules, yourTicket, otherTickets }) => {
    const validated = otherTickets.filter(
      (t) => validateTicket(rules, t).length === 0
    );
    console.log("otherTickets", otherTickets.length);
    console.log("validated", validated.length);

    return { rules, yourTicket, otherTickets: validated };
  })
  .then(({ rules, yourTicket, otherTickets }) => {
    let finalBag: Record<number, string> = {};
    const bag: number[] = [];
    const validBag = runForList(rules, yourTicket, otherTickets);
    validBag.forEach((a) => {
      const toAdd = a[1].filter((v) => !bag.includes(v));
      finalBag[toAdd[0]] = a[0];
      bag.push(toAdd[0]);
    });

    const result = Object.values(finalBag).reduce((t, k, i) => {
      if (!k.startsWith("departure ")) {
        return t;
      }

      return yourTicket[i] * t;
    }, 1);
    console.log(result);
  })
  .then(logger);

function runForList(
  rules: Rule[],
  yourTicket: number[],
  otherTickets: number[][]
) {
  const validBag: Record<string, number[]> = {};

  rules.forEach((r) => {
    validBag[r[0]] = [];
    for (let i = 0; i < yourTicket.length; i++) {
      const indexNumbers = otherTickets.map((a) => a[i]);
      const allValid = indexNumbers.every((n) => validateNumber(r[1], n));
      if (allValid) {
        validBag[r[0]].push(i);
      }
    }
  });

  return Object.entries(validBag).sort((a, b) => {
    return a[1].length > b[1].length ? 1 : -1;
  });
}

function getSingleItems(validBag: ReturnType<typeof runForList>) {
  return validBag
    .sort((a, b) => {
      return a[1].length > b[1].length ? 1 : -1;
    })
    .map((a) => a[0]);
}

type RuleSet = [number, number][];
type Rule = [string, RuleSet];
type Ticket = number[];

function parseRule(rule: string): Rule {
  const p = rule.split(":");
  const key = p[0];
  const rules = p[1]
    .trim()
    .split(" or ")
    .map((a) => a.split("-").map(Number)) as RuleSet;
  return [key, rules];
}

function validateTicket(rules: Rule[], ticket: Ticket) {
  return ticket.filter((n) => {
    return !rules.some((rule) => {
      return validateNumber(rule[1], n);
    });
  });
}

function validateNumber(ruleSet: RuleSet, n: number) {
  const [a, b] = ruleSet;
  return inRange(n, a[0], a[1] + 1) || inRange(n, b[0], b[1] + 1);
}
