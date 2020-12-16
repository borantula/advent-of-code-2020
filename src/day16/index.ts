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
    const validBag = runForList(rules, yourTicket, otherTickets);
    console.log(validBag);

    const result = validBag.reduce((t, k, i) => {
      if (!k.startsWith("departure ")) {
        return t;
      }
      console.log(yourTicket[i], t, i);
      return yourTicket[i] * t;
    }, 1);
    console.log(result);
  })
  .then(logger);

function runForList(
  rules: Rule[],
  yourTicket: number[],
  otherTickets: number[][],
  validBag: string[] = []
): string[] {
  if (validBag.length === yourTicket.length) {
    return validBag;
  }

  for (let i = 0; i < yourTicket.length; i++) {
    const indexNumbers = otherTickets.map((a) => a[i]);
    const allValid = rules.filter(
      (r) =>
        !validBag.includes(r[0]) &&
        indexNumbers.every((n) => validateNumber(r[1], n))
    );
    if (allValid.length === 1) {
      console.log(allValid);
      validBag.push(allValid[0][0]);
      return runForList(rules, yourTicket, otherTickets, validBag);
    }
  }
  return [];
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
